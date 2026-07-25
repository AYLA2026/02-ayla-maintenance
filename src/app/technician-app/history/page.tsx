"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Wrench, Star, Clock, CheckCircle, Calendar, TrendingUp, Timer } from "lucide-react";

interface HistoryItem {
  id: string;
  title: string;
  school: string;
  closedAt: string;
  rating: number;
  checkIn?: string;
  checkOut?: string;
  beforeCount?: number;
  afterCount?: number;
}

export default function HistoryPage() {
  const router = useRouter();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [todayCount, setTodayCount] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [totalTime, setTotalTime] = useState("0 ساعة");

  useEffect(() => {
    const data: HistoryItem[] = JSON.parse(localStorage.getItem("tech_history") || "[]");
    setItems(data);

    // 📊 تقرير يومي
    const today = new Date().toLocaleDateString("ar-SA");
    const todayItems = data.filter((d) => d.closedAt.includes(today.split("/")[0])); // تقريبي
    setTodayCount(todayItems.length);

    if (data.length > 0) {
      const avg = data.reduce((sum, d) => sum + d.rating, 0) / data.length;
      setAvgRating(Number(avg.toFixed(1)));
    }

    // حساب وقت العمل
    let mins = 0;
    data.forEach((d) => {
      if (d.checkIn && d.checkOut) {
        const start = new Date(d.checkIn).getTime();
        const end = new Date(d.checkOut).getTime();
        if (!isNaN(start) && !isNaN(end)) mins += (end - start) / 60000;
      }
    });
    const hrs = Math.floor(mins / 60);
    setTotalTime(`${hrs} ساعة ${Math.floor(mins % 60)} دقيقة`);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      
      <div className="sticky top-0 z-10 p-4 border-b border-[#C9A227]/20 flex items-center gap-3 bg-white shadow-sm">
        <button onClick={() => router.back()} className="p-2 rounded-lg bg-[#C9A227]/10">
          <ArrowRight className="w-5 h-5 text-[#C9A227]" />
        </button>
        <h1 className="text-lg font-bold text-[#2C1810]">سجل أعمالي</h1>
      </div>

      {/* 📊 التقرير اليومي */}
      <div className="p-4 grid grid-cols-3 gap-3 mb-2">
        <div className="p-3 rounded-xl bg-white border border-[#C9A227]/15 text-center shadow-sm">
          <div className="text-2xl font-bold text-[#C9A227]">{todayCount}</div>
          <div className="text-[10px] text-[#5C3A2A]">اليوم</div>
        </div>
        <div className="p-3 rounded-xl bg-white border border-[#C9A227]/15 text-center shadow-sm">
          <div className="text-2xl font-bold text-[#C9A227] flex items-center justify-center gap-1"><Star className="w-4 h-4 fill-[#C9A227]" />{avgRating}</div>
          <div className="text-[10px] text-[#5C3A2A]">متوسط التقييم</div>
        </div>
        <div className="p-3 rounded-xl bg-white border border-[#C9A227]/15 text-center shadow-sm">
          <div className="text-lg font-bold text-[#C9A227]">{totalTime}</div>
          <div className="text-[10px] text-[#5C3A2A]">وقت العمل</div>
        </div>
      </div>

      <div className="p-4 space-y-3 pb-8">
        {items.length === 0 ? (
          <div className="text-center text-gray-400 mt-20">
            <Wrench className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>لا توجد بلاغات مكتملة بعد</p>
          </div>
        ) : (
          items.map((item, i) => (
            <div key={item.id} className="p-4 rounded-xl bg-white border border-[#C9A227]/15 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-[#2C1810]">{item.title}</h3>
                  <p className="text-xs text-[#5C3A2A]">{item.school}</p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{item.closedAt}</span>
                <span className="flex items-center gap-1"><Star className="w-3 h-3 text-[#C9A227] fill-[#C9A227]" />{item.rating}/5</span>
              </div>
              {(item.checkIn || item.checkOut) && (
                <div className="text-[10px] text-gray-400 bg-gray-50 p-2 rounded-lg space-y-1">
                  {item.checkIn && <p>⏱️ بدء: {item.checkIn}</p>}
                  {item.checkOut && <p>⏱️ انتهاء: {item.checkOut}</p>}
                </div>
              )}
              {(item.beforeCount || item.afterCount) && (
                <p className="text-[10px] text-[#C9A227] mt-2">📸 {item.beforeCount || 0} قبل / {item.afterCount || 0} بعد</p>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
}