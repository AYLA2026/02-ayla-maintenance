"use client";

import { useState, useMemo } from "react";
import {
  DollarSign, Plus, X, Download, Trash2, Search,
  FileText, Users, FileSpreadsheet, TrendingUp, TrendingDown
} from "lucide-react";

interface SalaryDetail {
  basic: number; housing: number; transport: number;
  overtime: number; deductions: number; net: number;
}

interface WorkerSalary {
  id: string; name: string; job: string; month: string;
  projectName: string; details: SalaryDetail;
}

interface ProjectFinance {
  id: string; projectName: string; contractValue: number;
  schoolCost: number; salariesCost: number; housingCost: number;
  vehiclesCost: number; sparePartsCost: number;
}

const exportWithHeader = async (data: any[][], filename: string, sheetName: string) => {
  const XLSX = await import("xlsx");
  const headerRows = [
    ["Ayla Maintenance"], ["م. محمد عبد الرحمن"],
    [new Date().toLocaleDateString("ar-SA")], [],
  ];
  const allRows = [...headerRows, ...data];
  const ws = XLSX.utils.aoa_to_sheet(allRows);
  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: data[0].length - 1 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: data[0].length - 1 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: data[0].length - 1 } },
  ];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, filename);
};

export default function FinancePage() {
  const [projects, setProjects] = useState<ProjectFinance[]>([]);
  const [salaries, setSalaries] = useState<WorkerSalary[]>([]);
  const [activeTab, setActiveTab] = useState<"projects" | "salaries">("projects");
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddSalary, setShowAddSalary] = useState(false);
  const [search, setSearch] = useState("");

  const [projForm, setProjForm] = useState({
    projectName: "", contractValue: "", schoolCost: "", salariesCost: "",
    housingCost: "", vehiclesCost: "", sparePartsCost: ""
  });
  const [salForm, setSalForm] = useState({
    name: "", job: "", month: "", projectName: "",
    basic: "", housing: "", transport: "", overtime: "", deductions: ""
  });

  const addProject = () => {
    if (!projForm.projectName.trim()) return alert("اسم المشروع مطلوب");
    setProjects((prev) => [...prev, {
      id: `fin-${Date.now()}`,
      projectName: projForm.projectName,
      contractValue: Number(projForm.contractValue) || 0,
      schoolCost: Number(projForm.schoolCost) || 0,
      salariesCost: Number(projForm.salariesCost) || 0,
      housingCost: Number(projForm.housingCost) || 0,
      vehiclesCost: Number(projForm.vehiclesCost) || 0,
      sparePartsCost: Number(projForm.sparePartsCost) || 0,
    }]);
    setProjForm({ projectName: "", contractValue: "", schoolCost: "", salariesCost: "", housingCost: "", vehiclesCost: "", sparePartsCost: "" });
    setShowAddProject(false);
  };

  const addSalary = () => {
    if (!salForm.name.trim()) return alert("اسم العامل مطلوب");
    const basic = Number(salForm.basic) || 0;
    const housing = Number(salForm.housing) || 0;
    const transport = Number(salForm.transport) || 0;
    const overtime = Number(salForm.overtime) || 0;
    const deductions = Number(salForm.deductions) || 0;
    setSalaries((prev) => [...prev, {
      id: `sal-${Date.now()}`, name: salForm.name, job: salForm.job,
      month: salForm.month, projectName: salForm.projectName,
      details: { basic, housing, transport, overtime, deductions, net: basic + housing + transport + overtime - deductions }
    }]);
    setSalForm({ name: "", job: "", month: "", projectName: "", basic: "", housing: "", transport: "", overtime: "", deductions: "" });
    setShowAddSalary(false);
  };

  const exportProjects = async () => {
    if (projects.length === 0) return;
    const headers = [["اسم المشروع", "العقد", "المدارس", "الرواتب", "السكن", "السيارات", "قطع الغيار", "المصروفات", "الصافي"]];
    const rows = projects.map((p) => {
      const exp = p.schoolCost + p.salariesCost + p.housingCost + p.vehiclesCost + p.sparePartsCost;
      return [p.projectName, p.contractValue, p.schoolCost, p.salariesCost, p.housingCost, p.vehiclesCost, p.sparePartsCost, exp, p.contractValue - exp];
    });
    await exportWithHeader([...headers, ...rows], "المالية_المشاريع_آيلا.xlsx", "المشاريع");
  };

  const exportSalaries = async () => {
    if (salaries.length === 0) return;
    const headers = [["الاسم", "الوظيفة", "الشهر", "المشروع", "أساسي", "سكن", "نقل", "إضافي", "خصومات", "صافي"]];
    const rows = salaries.map((s) => [s.name, s.job, s.month, s.projectName, s.details.basic, s.details.housing, s.details.transport, s.details.overtime, s.details.deductions, s.details.net]);
    await exportWithHeader([...headers, ...rows], "الرواتب_آيلا.xlsx", "الرواتب");
  };

  const filteredProjects = useMemo(() => {
    if (!search.trim()) return projects;
    return projects.filter((p) => p.projectName.includes(search));
  }, [projects, search]);

  const filteredSalaries = useMemo(() => {
    if (!search.trim()) return salaries;
    return salaries.filter((s) => s.name.includes(search) || s.projectName.includes(search));
  }, [salaries, search]);

  const totalContract = projects.reduce((s, p) => s + p.contractValue, 0);
  const totalExpenses = projects.reduce((s, p) => s + p.schoolCost + p.salariesCost + p.housingCost + p.vehiclesCost + p.sparePartsCost, 0);
  const totalNet = totalContract - totalExpenses;

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl lg:text-3xl font-bold text-[#2C1810] mb-6 flex items-center gap-3" style={{ fontFamily: "Tajawal, sans-serif" }}>
          <DollarSign className="w-8 h-8 text-[#C9A227]" /> إدارة المالية
        </h1>

        {/* إحصائيات عامة */}
        {projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            <div className="p-4 rounded-2xl bg-white border border-[#C9A227]/10 text-center">
              <div className="text-2xl font-bold text-[#C9A227]">{totalContract.toLocaleString()} ر.س</div>
              <div className="text-xs text-gray-500 mt-1">إجمالي العقود</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-red-200 text-center">
              <div className="text-2xl font-bold text-red-600">{totalExpenses.toLocaleString()} ر.س</div>
              <div className="text-xs text-gray-500 mt-1">إجمالي المصروفات</div>
            </div>
            <div className={`p-4 rounded-2xl bg-white border text-center ${totalNet >= 0 ? "border-green-200" : "border-red-200"}`}>
              <div className={`text-2xl font-bold ${totalNet >= 0 ? "text-green-600" : "text-red-600"}`}>{totalNet.toLocaleString()} ر.س</div>
              <div className="text-xs text-gray-500 mt-1">صافي الربح / الخسارة</div>
            </div>
          </div>
        )}

        {/* تبويبات */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => { setActiveTab("projects"); setSearch(""); }} className={`px-5 py-2 rounded-xl font-bold text-sm transition ${activeTab === "projects" ? "bg-[#C9A227] text-[#1A0F09]" : "bg-white text-[#5C3A2A] border border-[#C9A227]/20"}`}>
            <FileText className="w-4 h-4 inline ml-1" /> المشاريع
          </button>
          <button onClick={() => { setActiveTab("salaries"); setSearch(""); }} className={`px-5 py-2 rounded-xl font-bold text-sm transition ${activeTab === "salaries" ? "bg-[#C9A227] text-[#1A0F09]" : "bg-white text-[#5C3A2A] border border-[#C9A227]/20"}`}>
            <Users className="w-4 h-4 inline ml-1" /> الرواتب
          </button>
        </div>

        {/* أدوات */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={activeTab === "projects" ? "بحث باسم المشروع..." : "بحث بالاسم أو المشروع..."} className="w-full pr-9 pl-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
          </div>
          {activeTab === "projects" ? (
            <>
              <button onClick={() => setShowAddProject(true)} className="px-4 py-2 rounded-xl bg-[#1A0F09] text-[#C9A227] font-bold text-sm flex items-center gap-2 hover:bg-[#2C1810] transition">
                <Plus className="w-4 h-4" /> إضافة مشروع
              </button>
              {projects.length > 0 && (
                <>
                  <button onClick={exportProjects} className="px-4 py-2 rounded-xl bg-green-600 text-white font-bold text-sm flex items-center gap-2 hover:bg-green-700 transition">
                    <Download className="w-4 h-4" /> تصدير
                  </button>
                  <button onClick={() => confirm("تأكيد؟") && setProjects([])} className="px-4 py-2 rounded-xl bg-red-50 text-red-600 border border-red-200 font-bold text-sm flex items-center gap-2 hover:bg-red-100 transition">
                    <Trash2 className="w-4 h-4" /> تفريغ
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              <button onClick={() => setShowAddSalary(true)} className="px-4 py-2 rounded-xl bg-[#1A0F09] text-[#C9A227] font-bold text-sm flex items-center gap-2 hover:bg-[#2C1810] transition">
                <Plus className="w-4 h-4" /> إضافة راتب
              </button>
              {salaries.length > 0 && (
                <>
                  <button onClick={exportSalaries} className="px-4 py-2 rounded-xl bg-green-600 text-white font-bold text-sm flex items-center gap-2 hover:bg-green-700 transition">
                    <Download className="w-4 h-4" /> تصدير
                  </button>
                  <button onClick={() => confirm("تأكيد؟") && setSalaries([])} className="px-4 py-2 rounded-xl bg-red-50 text-red-600 border border-red-200 font-bold text-sm flex items-center gap-2 hover:bg-red-100 transition">
                    <Trash2 className="w-4 h-4" /> تفريغ
                  </button>
                </>
              )}
            </>
          )}
        </div>

        {/* محتوى المشاريع */}
        {activeTab === "projects" && (
          <>
            {projects.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#C9A227]/10 p-12 text-center">
                <FileText className="w-16 h-16 text-[#C9A227]/20 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">لا توجد مشاريع مالية مسجلة</p>
                <button onClick={() => setShowAddProject(true)} className="px-6 py-3 rounded-xl bg-[#C9A227] text-[#1A0F09] font-bold hover:bg-[#b89420] transition">إضافة مشروع</button>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredProjects.map((p) => {
                  const exp = p.schoolCost + p.salariesCost + p.housingCost + p.vehiclesCost + p.sparePartsCost;
                  const net = p.contractValue - exp;
                  return (
                    <div key={p.id} className="bg-white rounded-2xl border border-[#C9A227]/10 p-5 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-lg text-[#2C1810]">{p.projectName}</h3>
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${net >= 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                          {net >= 0 ? "ربح" : "خسارة"}: {net.toLocaleString()} ر.س
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-sm">
                        <div className="bg-[#FAF7F2] rounded-xl p-3 text-center">
                          <div className="text-[#C9A227] font-bold">{p.contractValue.toLocaleString()}</div>
                          <div className="text-[10px] text-gray-500">العقد</div>
                        </div>
                        <div className="bg-[#FAF7F2] rounded-xl p-3 text-center">
                          <div className="text-blue-600 font-bold">{p.schoolCost.toLocaleString()}</div>
                          <div className="text-[10px] text-gray-500">المدارس</div>
                        </div>
                        <div className="bg-[#FAF7F2] rounded-xl p-3 text-center">
                          <div className="text-purple-600 font-bold">{p.salariesCost.toLocaleString()}</div>
                          <div className="text-[10px] text-gray-500">الرواتب</div>
                        </div>
                        <div className="bg-[#FAF7F2] rounded-xl p-3 text-center">
                          <div className="text-orange-600 font-bold">{p.housingCost.toLocaleString()}</div>
                          <div className="text-[10px] text-gray-500">السكن</div>
                        </div>
                        <div className="bg-[#FAF7F2] rounded-xl p-3 text-center">
                          <div className="text-cyan-600 font-bold">{p.vehiclesCost.toLocaleString()}</div>
                          <div className="text-[10px] text-gray-500">السيارات</div>
                        </div>
                        <div className="bg-[#FAF7F2] rounded-xl p-3 text-center">
                          <div className="text-red-600 font-bold">{p.sparePartsCost.toLocaleString()}</div>
                          <div className="text-[10px] text-gray-500">قطع الغيار</div>
                        </div>
                      </div>
                      <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#C9A227] rounded-full transition-all" style={{ width: `${Math.min((exp / p.contractValue) * 100, 100)}%` }} />
                      </div>
                      <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                        <span>المصروفات: {exp.toLocaleString()}</span>
                        <span>{((exp / p.contractValue) * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* محتوى الرواتب */}
        {activeTab === "salaries" && (
          <>
            {salaries.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#C9A227]/10 p-12 text-center">
                <Users className="w-16 h-16 text-[#C9A227]/20 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">لا توجد رواتب مسجلة</p>
                <button onClick={() => setShowAddSalary(true)} className="px-6 py-3 rounded-xl bg-[#C9A227] text-[#1A0F09] font-bold hover:bg-[#b89420] transition">إضافة راتب</button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#C9A227]/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[#FAF7F2]">
                      <tr>
                        <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">#</th>
                        <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">الاسم</th>
                        <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">الوظيفة</th>
                        <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">الشهر</th>
                        <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">المشروع</th>
                        <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">أساسي</th>
                        <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">سكن</th>
                        <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">نقل</th>
                        <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">إضافي</th>
                        <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">خصومات</th>
                        <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">صافي</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSalaries.map((s, i) => (
                        <tr key={s.id} className="border-t border-[#C9A227]/5 hover:bg-[#FAF7F2]/50 transition">
                          <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                          <td className="px-4 py-3 font-bold text-[#2C1810]">{s.name}</td>
                          <td className="px-4 py-3 text-gray-600">{s.job}</td>
                          <td className="px-4 py-3 text-gray-600">{s.month}</td>
                          <td className="px-4 py-3"><span className="px-2 py-1 rounded-lg bg-[#C9A227]/10 text-[#5C3A2A] text-xs font-bold">{s.projectName}</span></td>
                          <td className="px-4 py-3 text-gray-600">{s.details.basic}</td>
                          <td className="px-4 py-3 text-gray-600">{s.details.housing}</td>
                          <td className="px-4 py-3 text-gray-600">{s.details.transport}</td>
                          <td className="px-4 py-3 text-green-600">+{s.details.overtime}</td>
                          <td className="px-4 py-3 text-red-600">-{s.details.deductions}</td>
                          <td className="px-4 py-3 font-bold text-[#C9A227]">{s.details.net.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal مشروع */}
      {showAddProject && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAddProject(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#2C1810]">إضافة مشروع مالي</h2>
              <button onClick={() => setShowAddProject(false)} className="p-1 rounded-lg hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input placeholder="اسم المشروع *" value={projForm.projectName} onChange={(e) => setProjForm({ ...projForm, projectName: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227] md:col-span-2" />
              <input placeholder="قيمة العقد" type="number" value={projForm.contractValue} onChange={(e) => setProjForm({ ...projForm, contractValue: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
              <input placeholder="تكلفة المدارس" type="number" value={projForm.schoolCost} onChange={(e) => setProjForm({ ...projForm, schoolCost: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
              <input placeholder="تكلفة الرواتب" type="number" value={projForm.salariesCost} onChange={(e) => setProjForm({ ...projForm, salariesCost: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
              <input placeholder="إيجار السكن" type="number" value={projForm.housingCost} onChange={(e) => setProjForm({ ...projForm, housingCost: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
              <input placeholder="تكلفة السيارات" type="number" value={projForm.vehiclesCost} onChange={(e) => setProjForm({ ...projForm, vehiclesCost: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
              <input placeholder="قطع الغيار" type="number" value={projForm.sparePartsCost} onChange={(e) => setProjForm({ ...projForm, sparePartsCost: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227] md:col-span-2" />
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <button onClick={() => setShowAddProject(false)} className="px-5 py-2 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition">إلغاء</button>
              <button onClick={addProject} className="px-5 py-2 rounded-xl bg-[#C9A227] text-[#1A0F09] font-bold text-sm hover:bg-[#b89420] transition">حفظ المشروع</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal راتب */}
      {showAddSalary && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAddSalary(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#2C1810]">نموذج راتب العامل</h2>
              <button onClick={() => setShowAddSalary(false)} className="p-1 rounded-lg hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input placeholder="اسم العامل *" value={salForm.name} onChange={(e) => setSalForm({ ...salForm, name: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
              <input placeholder="الوظيفة" value={salForm.job} onChange={(e) => setSalForm({ ...salForm, job: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
              <input placeholder="الشهر (مثلاً: يناير 2026)" value={salForm.month} onChange={(e) => setSalForm({ ...salForm, month: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
              <input placeholder="اسم المشروع" value={salForm.projectName} onChange={(e) => setSalForm({ ...salForm, projectName: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
              <input placeholder="الراتب الأساسي" type="number" value={salForm.basic} onChange={(e) => setSalForm({ ...salForm, basic: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
              <input placeholder="بدل السكن" type="number" value={salForm.housing} onChange={(e) => setSalForm({ ...salForm, housing: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
              <input placeholder="بدل النقل" type="number" value={salForm.transport} onChange={(e) => setSalForm({ ...salForm, transport: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
              <input placeholder="ساعات إضافية" type="number" value={salForm.overtime} onChange={(e) => setSalForm({ ...salForm, overtime: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
              <input placeholder="الخصومات" type="number" value={salForm.deductions} onChange={(e) => setSalForm({ ...salForm, deductions: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227] md:col-span-2" />
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <button onClick={() => setShowAddSalary(false)} className="px-5 py-2 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition">إلغاء</button>
              <button onClick={addSalary} className="px-5 py-2 rounded-xl bg-[#C9A227] text-[#1A0F09] font-bold text-sm hover:bg-[#b89420] transition">حفظ الراتب</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}