import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/layout/Card";
import StatCard from "@/components/layout/StatCard";
import { 
  Wrench, 
  Building2, 
  Users, 
  ClipboardList, 
  MessageSquare, 
  Clock,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="p-8 min-h-screen" style={{ background: "linear-gradient(135deg, #FAF7F2 0%, #F5E6D3 100%)" }}>
      <PageHeader 
        title="لوحة التحكم" 
        subtitle="نظرة عامة على النظام" 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="إجمالي المشاريع" value="24" icon={Wrench} delay={0} />
        <StatCard title="المدارس" value="12" icon={Building2} delay={0.1} />
        <StatCard title="أعضاء الفريق" value="45" icon={Users} delay={0.2} />
        <StatCard title="التقارير" value="156" icon={ClipboardList} delay={0.3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-[#2C1810]" style={{ fontFamily: "Tajawal, sans-serif" }}>
              المشاريع النشطة
            </h2>
            <span className="text-xs text-[#C9A227] cursor-pointer hover:underline">عرض الكل</span>
          </div>
          <div className="space-y-4">
            {[
              { name: "صيانة مكيفات المبنى A", school: "مدرسة النور", status: "نشط", progress: 75 },
              { name: "تنظيف المباني", school: "مدرسة الفجر", status: "مكتمل", progress: 100 },
              { name: "إصلاح كهرباء", school: "مدرسة الروضة", status: "عاجل", progress: 30 },
            ].map((project, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-[#2C1810] text-sm">{project.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      project.status === "نشط" ? "bg-amber-100 text-amber-800" :
                      project.status === "مكتمل" ? "bg-green-100 text-green-800" :
                      "bg-red-100 text-red-800"
                    }`}>{project.status}</span>
                  </div>
                  <div className="text-xs text-[#5C3A2A] mb-2">{project.school}</div>
                  <div className="h-2 rounded-full bg-[#C9A227]/10 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${project.progress}%`,
                        background: "linear-gradient(90deg, #C9A227 0%, #E8D5A3 100%)"
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-[#2C1810]" style={{ fontFamily: "Tajawal, sans-serif" }}>
              البلاغات الأخيرة
            </h2>
            <MessageSquare className="w-5 h-5 text-[#C9A227]" />
          </div>
          <div className="space-y-4">
            {[
              { title: "عطل في المكيف", school: "مدرسة النور", time: "منذ ساعة" },
              { title: "تسرب مياه", school: "مدرسة الفجر", time: "منذ 3 ساعات" },
              { title: "إنارة خارجة", school: "مدرسة الروضة", time: "منذ يوم" },
            ].map((complaint, i) => (
              <div key={i} className="flex items-start gap-3 pb-3 border-b border-[#C9A227]/10 last:border-0">
                <div className="w-2 h-2 rounded-full bg-[#C9A227] mt-2 shrink-0" />
                <div>
                  <div className="font-medium text-[#2C1810] text-sm">{complaint.title}</div>
                  <div className="text-xs text-[#5C3A2A]">{complaint.school}</div>
                  <div className="text-xs text-[#C9A227]/60 mt-1">{complaint.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-100">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#2C1810]">85%</div>
            <div className="text-xs text-[#5C3A2A]">نسبة الإنجاز</div>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-amber-100">
            <Clock className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#2C1810]">12</div>
            <div className="text-xs text-[#5C3A2A]">مهمة هذا الأسبوع</div>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-red-100">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#2C1810]">3</div>
            <div className="text-xs text-[#5C3A2A]">بلاغات عاجلة</div>
          </div>
        </Card>
      </div>
    </div>
  );
}