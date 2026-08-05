"use client";

import { useState, useRef, useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  Upload, Image as ImageIcon, X, Filter, Download, FileSpreadsheet,
  Camera, Trash2, Search, Calendar, CheckCircle
} from "lucide-react";

interface ReportImage {
  id: string;
  url: string;
  name: string;
  date: string;
  category: string;
  school: string;
  note: string;
}

interface ExcelRow {
  school: string;
  date: string;
  category: string;
  status: string;
  note: string;
}

export default function SmartReportPage() {
  const { tenant } = useAuth();
  const [images, setImages] = useState<ReportImage[]>([]);
  const [excelData, setExcelData] = useState<ExcelRow[]>([]);
  const [filterCategory, setFilterCategory] = useState("الكل");
  const [filterSchool, setFilterSchool] = useState("الكل");
  const [filterDate, setFilterDate] = useState("");
  const [search, setSearch] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const imgRef = useRef<HTMLInputElement>(null);
  const excelRef = useRef<HTMLInputElement>(null);

  // رفع صور متعددة
  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      setImages((prev) => [...prev, {
        id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        url,
        name: file.name,
        date: new Date().toISOString().split("T")[0],
        category: "عام",
        school: "غير محدد",
        note: "",
      }]);
    });
  };

  // استيراد Excel (نموذج إدارة التعليم)
  const handleExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const buf = await file.arrayBuffer();
      const XLSX = await import("xlsx");
      const wb = XLSX.read(buf, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];
      const rows = data.slice(1).map((row) => ({
        school: String(row[0] || ""),
        date: String(row[1] || ""),
        category: String(row[2] || ""),
        status: String(row[3] || ""),
        note: String(row[4] || ""),
      })).filter((r) => r.school.trim());
      setExcelData(rows);
      alert(`✅ تم استيراد ${rows.length} صف من Excel`);
    } catch {
      alert("⚠️ تأكد من تثبيت: npm install xlsx");
    }
  };

  // فلترة الصور
  const filteredImages = useMemo(() => {
    return images.filter((img) => {
      const matchCat = filterCategory === "الكل" || img.category === filterCategory;
      const matchSchool = filterSchool === "الكل" || img.school.includes(filterSchool);
      const matchDate = !filterDate || img.date === filterDate;
      const matchSearch = !search || img.name.includes(search) || img.note.includes(search);
      return matchCat && matchSchool && matchDate && matchSearch;
    });
  }, [images, filterCategory, filterSchool, filterDate, search]);

  const categories = useMemo(() => ["الكل", ...Array.from(new Set(images.map((i) => i.category)))], [images]);
  const schools = useMemo(() => ["الكل", ...Array.from(new Set(images.map((i) => i.school)))], [images]);

  const toggleSelect = (id: string) => {
    setSelectedImages((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const deleteSelected = () => {
    if (!confirm("تأكيد حذف الصور المحددة؟")) return;
    setImages((prev) => prev.filter((i) => !selectedImages.includes(i.id)));
    setSelectedImages([]);
  };

  const exportReport = () => {
    const report = {
      tenant: tenant?.nameAr,
      date: new Date().toLocaleDateString("ar-SA"),
      totalImages: images.length,
      filtered: filteredImages.length,
      excelRows: excelData.length,
      images: filteredImages.map((i) => ({ name: i.name, date: i.date, category: i.category, school: i.school })),
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `تقرير_ذكي_${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* الهيدر */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1A0F09] flex items-center gap-3">
            <Camera className="w-7 h-7 text-[#C9A227]" /> التقرير الذكي المصور
          </h1>
          <p className="text-gray-500 text-sm mt-1">استيراد نموذج + رفع صور + فلترة + تصدير — {tenant?.nameAr}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => excelRef.current?.click()} className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition">
            <FileSpreadsheet className="w-4 h-4" /> استيراد Excel
          </button>
          <input ref={excelRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleExcel} />
          <button onClick={() => imgRef.current?.click()} className="flex items-center gap-2 px-4 py-2.5 bg-[#C9A227] text-[#1A0F09] rounded-xl font-bold text-sm hover:bg-[#b89420] transition">
            <ImageIcon className="w-4 h-4" /> رفع صور
          </button>
          <input ref={imgRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />
          <button onClick={exportReport} className="flex items-center gap-2 px-4 py-2.5 bg-[#1A0F09] text-[#C9A227] rounded-xl font-bold text-sm hover:bg-[#3d2317] transition">
            <Download className="w-4 h-4" /> تصدير التقرير
          </button>
        </div>
      </div>

      {/* إحصائيات */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm text-center">
          <p className="text-3xl font-black text-[#C9A227]">{images.length}</p>
          <p className="text-xs text-gray-500 mt-1">إجمالي الصور</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm text-center">
          <p className="text-3xl font-black text-blue-600">{filteredImages.length}</p>
          <p className="text-xs text-gray-500 mt-1">المفلترة</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm text-center">
          <p className="text-3xl font-black text-emerald-600">{excelData.length}</p>
          <p className="text-xs text-gray-500 mt-1">صفوف Excel</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm text-center">
          <p className="text-3xl font-black text-amber-600">{selectedImages.length}</p>
          <p className="text-xs text-gray-500 mt-1">محددة</p>
        </div>
      </div>

      {/* فلترة */}
      {images.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Filter className="w-4 h-4 text-[#C9A227]" />
            <span className="font-bold text-sm text-[#1A0F09]">فلترة الصور</span>
            {selectedImages.length > 0 && (
              <button onClick={deleteSelected} className="mr-auto flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition">
                <Trash2 className="w-3 h-3" /> حذف المحددة
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث باسم الصورة أو الملاحظة..." className="w-full pr-9 pl-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#C9A227] outline-none" />
            </div>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:border-[#C9A227] outline-none">
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={filterSchool} onChange={(e) => setFilterSchool(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:border-[#C9A227] outline-none">
              {schools.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <div className="relative">
              <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
              <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="w-full pr-9 pl-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#C9A227] outline-none" />
            </div>
          </div>
        </div>
      )}

      {/* شبكة الصور */}
      {filteredImages.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Camera className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500">لا توجد صور. ارفع صورًا أو استورد Excel أولاً.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredImages.map((img) => {
            const isSelected = selectedImages.includes(img.id);
            return (
              <div
                key={img.id}
                className={`relative group bg-white rounded-2xl border overflow-hidden shadow-sm transition-all cursor-pointer ${
                  isSelected ? "border-[#C9A227] ring-2 ring-[#C9A227]/30" : "border-gray-100 hover:shadow-md"
                }`}
                onClick={() => toggleSelect(img.id)}
              >
                <div className="aspect-square bg-gray-100 relative">
                  <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                  {isSelected && (
                    <div className="absolute top-2 left-2 w-6 h-6 bg-[#C9A227] rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-[#1A0F09]" />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-xs font-bold text-[#1A0F09] truncate">{img.name}</p>
                  <p className="text-[10px] text-gray-500 mt-1">{img.date}</p>
                  <p className="text-[10px] text-[#C9A227] font-bold mt-0.5">{img.category}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}