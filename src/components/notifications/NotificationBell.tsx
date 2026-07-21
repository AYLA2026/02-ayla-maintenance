"use client";

import { useState } from "react";
import { Bell, X, CheckCircle, AlertTriangle, Clock, MessageCircle } from "lucide-react";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: "task" | "overdue" | "reminder" | "whatsapp";
  timestamp: string;
  read: boolean;
  teamCode?: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, title: "مهمة جديدة", message: "F1: تنظيف مدرسة النور — 06:00", type: "task", timestamp: "06:00", read: false, teamCode: "F1" },
    { id: 2, title: "تنبيه واتساب", message: "تم إرسال تنبيه للمشرف أحمد محمد", type: "whatsapp", timestamp: "06:05", read: false, teamCode: "F1" },
    { id: 3, title: "مهمة متأخرة", message: "F3: إصلاح كهرباء مدرسة الأمل", type: "overdue", timestamp: "أمس", read: false, teamCode: "F3" },
  ]);

  const [showPanel, setShowPanel] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "task": return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "overdue": return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case "whatsapp": return <MessageCircle className="w-4 h-4 text-green-500" />;
      default: return <Clock className="w-4 h-4 text-blue-600" />;
    }
  };

  const getBg = (type: string) => {
    switch (type) {
      case "task": return "bg-green-50 border-green-200";
      case "overdue": return "bg-red-50 border-red-200";
      case "whatsapp": return "bg-green-50 border-green-300";
      default: return "bg-blue-50 border-blue-200";
    }
  };

  return (
    <div className="relative">
      <button onClick={() => setShowPanel(!showPanel)} className="relative p-2 rounded-lg hover:bg-[#C9A227]/10 transition-colors">
        <Bell className="w-5 h-5 text-[#FAF7F2]/80" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
            {unreadCount}
          </span>
        )}
      </button>

      {showPanel && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowPanel(false)} />
          <div className="absolute left-0 top-12 w-80 rounded-2xl shadow-2xl z-50 overflow-hidden" style={{ background: "linear-gradient(145deg, #FAF7F2 0%, #F5E6D3 100%)", border: "1px solid rgba(201, 162, 39, 0.15)" }}>
            <div className="p-4 border-b border-[#C9A227]/20 flex items-center justify-between">
              <h3 className="font-bold text-[#2C1810] text-sm" style={{ fontFamily: "Tajawal, sans-serif" }}>التنبيهات</h3>
              <button onClick={markAllRead} className="text-xs text-[#C9A227] hover:text-[#2C1810]">تحديد الكل</button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.map(n => (
                <div key={n.id} className={`p-3 border-b border-[#C9A227]/10 ${!n.read ? "bg-[#C9A227]/5" : ""}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getBg(n.type)}`}>{getIcon(n.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-[#2C1810]">{n.title}</p>
                        {!n.read && <span className="w-2 h-2 rounded-full bg-[#C9A227]" />}
                      </div>
                      <p className="text-xs text-[#5C3A2A] mt-1">{n.message}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-[#C9A227]/60">{n.timestamp}</span>
                        {n.teamCode && <span className="text-xs px-2 py-0.5 rounded-full bg-[#C9A227]/10 text-[#C9A227]">{n.teamCode}</span>}
                      </div>
                    </div>
                    {!n.read && (
                      <button onClick={() => markAsRead(n.id)} className="p-1 hover:bg-[#C9A227]/10 rounded text-[#C9A227]">
                        <CheckCircle className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}