"use client";

import { useState } from "react";
import { MessageCircle, Phone, Send, CheckCircle } from "lucide-react";

interface TeamLeader {
  code: string;
  name: string;
  phone: string;
  school: string;
  task: string;
  time: string;
}

export default function WhatsAppSender() {
  const [leaders] = useState<TeamLeader[]>([
    { code: "F1", name: "أحمد محمد", phone: "0501111111", school: "مدرسة النور", task: "تنظيف الفصول", time: "06:00" },
    { code: "F2", name: "محمد سالم", phone: "0505555555", school: "مدرسة الفجر", task: "صيانة مكيفات", time: "08:00" },
    { code: "F3", name: "يوسف أحمد", phone: "0508888888", school: "مدرسة الأمل", task: "إصلاح كهرباء", time: "10:00" },
  ]);

  const [sent, setSent] = useState<Record<string, boolean>>({});

  const sendWhatsApp = (leader: TeamLeader) => {
    const message = `🌅 صباح الخير ${leader.name}

📋 مهمة اليوم:
🏫 ${leader.school}
🔧 ${leader.task}
🕐 ${leader.time}

📍 رابط التفاصيل: https://ayla.vercel.app/schedule

— نظام آيلا للصيانة`;

    const url = `https://wa.me/${leader.phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    setSent(prev => ({ ...prev, [leader.code]: true }));
  };

  const sendAll = () => {
    leaders.forEach((leader, index) => {
      setTimeout(() => sendWhatsApp(leader), index * 1000);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-[#2C1810]" style={{ fontFamily: "Tajawal, sans-serif" }}>📱 إرسال تنبيهات واتساب</h3>
        <button onClick={sendAll} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[#1A0F09]" style={{ background: "linear-gradient(135deg, #C9A227 0%, #E8D5A3 100%)" }}>
          <Send className="w-4 h-4" /> إرسال للجميع
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {leaders.map(leader => (
          <div key={leader.code} className="p-4 rounded-xl border border-[#C9A227]/15" style={{ background: "linear-gradient(145deg, #FAF7F2 0%, #F5E6D3 100%)" }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-green-100">
                <MessageCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-bold text-[#2C1810] text-sm">{leader.name}</p>
                <p className="text-xs text-[#5C3A2A]">قائد {leader.code}</p>
              </div>
            </div>
            <div className="space-y-1 text-xs text-[#5C3A2A] mb-3">
              <p>📞 {leader.phone}</p>
              <p>🏫 {leader.school}</p>
              <p>🔧 {leader.task} — {leader.time}</p>
            </div>
            <button
              onClick={() => sendWhatsApp(leader)}
              disabled={sent[leader.code]}
              className={`w-full py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all ${sent[leader.code] ? "bg-green-100 text-green-700" : "bg-green-500 text-white hover:bg-green-600"}`}
            >
              {sent[leader.code] ? <><CheckCircle className="w-3 h-3" /> تم الإرسال</> : <><Phone className="w-3 h-3" /> إرسال واتساب</>}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}