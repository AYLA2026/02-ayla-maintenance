"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Send, User, Shield } from "lucide-react";

interface Message {
  id: number;
  from: "me" | "admin";
  text: string;
  time: string;
}

export default function ChatPage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, from: "admin", text: "السلام عليكم، وصلت للموقع؟", time: "10:30 ص" },
    { id: 2, from: "me", text: "عليكم السلام، نعم وصلت الآن", time: "10:32 ص" },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!text.trim()) return;
    const now = new Date().toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" });
    setMessages([...messages, { id: Date.now(), from: "me", text, time: now }]);
    setText("");
    // رد تلقائي تجريبي
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, from: "admin", text: "تمام، شغل الله يوفقك", time: new Date().toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" }) },
      ]);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#2C1810]">
      
      {/* Header */}
      <div className="p-4 border-b border-[#C9A227]/20 flex items-center gap-3 bg-[#1A0F09]">
        <button onClick={() => router.back()} className="p-2 rounded-lg bg-[#C9A227]/20">
          <ArrowRight className="w-5 h-5 text-[#C9A227]" />
        </button>
        <div className="w-10 h-10 rounded-full bg-[#C9A227]/20 flex items-center justify-center">
          <Shield className="w-5 h-5 text-[#C9A227]" />
        </div>
        <div>
          <h1 className="font-bold text-[#C9A227]">المشرف</h1>
          <p className="text-xs text-green-400">● متصل</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl ${m.from === "me" ? "bg-[#C9A227] text-[#1A0F09] rounded-br-none" : "bg-[#1A0F09] text-white border border-[#C9A227]/20 rounded-bl-none"}`}>
              <p className="text-sm">{m.text}</p>
              <p className={`text-[10px] mt-1 ${m.from === "me" ? "text-[#1A0F09]/60" : "text-[#C9A227]/50"}`}>{m.time}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[#C9A227]/20 bg-[#1A0F09] flex gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="اكتب رسالة..." dir="rtl"
          className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-[#C9A227]/20 text-white placeholder-[#C9A227]/40 focus:border-[#C9A227] focus:outline-none" />
        <button onClick={send} className="px-4 py-3 rounded-xl bg-[#C9A227] text-[#1A0F09] active:scale-95 transition">
          <Send className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
}