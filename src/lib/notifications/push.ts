export interface PushNotificationData {
  userId: string | null;
  title: string;
  body: string;
  data?: Record<string, any>;
}

/**
 * إرسال إشعار Push (OneSignal)
 */
export async function sendPushNotification(notification: PushNotificationData) {
  if (!notification.userId) return;

  try {
    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${process.env.ONESIGNAL_REST_API_KEY}`
      },
      body: JSON.stringify({
        app_id: process.env.ONESIGNAL_APP_ID,
        include_external_user_ids: [notification.userId],
        headings: { ar: notification.title, en: notification.title },
        contents: { ar: notification.body, en: notification.body },
        data: notification.data || {}
      })
    });

    if (!response.ok) {
      console.error('Push notification failed:', await response.text());
    }
  } catch (error) {
    console.error('Push notification error:', error);
  }
}