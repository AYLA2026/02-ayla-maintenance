export default function ReportsPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: "Tajawal, sans-serif", color: "#2C1810" }}>
        التقارير
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a href="/reports/cleaning" className="p-6 rounded-xl border border-[#C9A227]/20 hover:border-[#C9A227] transition-all" style={{ background: "linear-gradient(135deg, #FAF7F2 0%, #F5E6D3 100%)" }}>
          <h2 className="text-lg font-bold text-[#2C1810]">تقرير التنظيف</h2>
        </a>
        <a href="/reports/hvac" className="p-6 rounded-xl border border-[#C9A227]/20 hover:border-[#C9A227] transition-all" style={{ background: "linear-gradient(135deg, #FAF7F2 0%, #F5E6D3 100%)" }}>
          <h2 className="text-lg font-bold text-[#2C1810]">تقرير التكييف</h2>
        </a>
        <a href="/reports/om" className="p-6 rounded-xl border border-[#C9A227]/20 hover:border-[#C9A227] transition-all" style={{ background: "linear-gradient(135deg, #FAF7F2 0%, #F5E6D3 100%)" }}>
          <h2 className="text-lg font-bold text-[#2C1810]">تقرير الصيانة</h2>
        </a>
        <a href="/reports/photo" className="p-6 rounded-xl border border-[#C9A227]/20 hover:border-[#C9A227] transition-all" style={{ background: "linear-gradient(135deg, #FAF7F2 0%, #F5E6D3 100%)" }}>
          <h2 className="text-lg font-bold text-[#2C1810]">تقرير الصور</h2>
        </a>
      </div>
    </div>
  );
}