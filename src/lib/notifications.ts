// Browser Notifications API - بدون OneSignal package

export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications");
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === "granted";
}

export function sendLocalNotification(title: string, body: string, icon?: string) {
  if (Notification.permission === "granted") {
    new Notification(title, {
      body,
      icon: icon || "/icon.svg",
      badge: "/icon.svg",
      tag: "ayla-notification",
      requireInteraction: true,
      dir: "rtl",
    });
  }
}

// OneSignal REST API (للـ server فقط)
export async function sendPushNotification(
  technicianId: string,
  title: string,
  message: string,
  url?: string
) {
  try {
    const response = await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${process.env.ONESIGNAL_REST_API_KEY}`,
      },
      body: JSON.stringify({
        app_id: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
        include_aliases: {
          external_id: [technicianId],
        },
        target_channel: "push",
        headings: { ar: title, en: title },
        contents: { ar: message, en: message },
        url: url || `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/technician-app/reports`,
      }),
    });

    return await response.json();
  } catch (error) {
    console.error("Push notification error:", error);
    return null;
  }
}