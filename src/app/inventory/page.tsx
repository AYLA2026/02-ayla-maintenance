"use client";

import { useState, useRef, useMemo } from "react";
import {
  Package, Plus, X, Download, Search, Upload,
  AlertTriangle, TrendingDown, ArrowLeftRight, FileSpreadsheet,
  Warehouse, BarChart3
} from "lucide-react";

type WarehouseType = "maintenance" | "electrical" | "hvac" | "civil";

interface InventoryItem {
  id: string;
  name: string;
  code: string;
  unit: string;
  quantity: number;
  minLevel: number;
  warehouse: WarehouseType;
}

interface Withdrawal {
  id: string;
  supervisor: string;
  team: string;
  itemId: string;
  itemName: string;
  quantity: number;
  date: string;
  warehouse: string;
}

const WAREHOUSES: { key: WarehouseType; label: string; color: string; light: string }[] = [
  { key: "maintenance", label: "مستودع الصيانة", color: "text-blue-700", light: "bg-blue-50 border-blue-200" },
  { key: "electrical", label: "مستودع الكهرباء", color: "text-yellow-700", light: "bg-yellow-50 border-yellow-200" },
  { key: "hvac", label: "مستودع التكييف", color: "text-cyan-700", light: "bg-cyan-50 border-cyan-200" },
  { key: "civil", label: "الأعمال المدنية والمعمارية", color: "text-orange-700", light: "bg-orange-50 border-orange-200" },
];

const DEFAULT_ITEMS: Record<WarehouseType, Omit<InventoryItem, "id" | "warehouse">[]> = {
  maintenance: [
    { name: "مسامير تجاري 6 مم", code: "MNT-001", unit: "كجم", quantity: 50, minLevel: 10 },
    { name: "صواميل ستانلس 8 مم", code: "MNT-002", unit: "كجم", quantity: 30, minLevel: 5 },
    { name: "سيلكون أبيض", code: "MNT-003", unit: "قطعة", quantity: 120, minLevel: 20 },
    { name: "لاصق بلاط سريع", code: "MNT-004", unit: "شكارة", quantity: 25, minLevel: 5 },
    { name: "شريط لاصق عازل", code: "MNT-005", unit: "رول", quantity: 40, minLevel: 10 },
    { name: "عازل مائي بيتومين", code: "MNT-006", unit: "برميل", quantity: 8, minLevel: 2 },
    { name: "سنفرة خشبية", code: "MNT-007", unit: "قطعة", quantity: 15, minLevel: 3 },
    { name: "مفك براغي متعدد", code: "MNT-008", unit: "قطعة", quantity: 20, minLevel: 5 },
  ],
  electrical: [
    { name: "فيش كهرباء ثلاثي", code: "ELE-001", unit: "قطعة", quantity: 200, minLevel: 30 },
    { name: "لمبة LED 18 واط", code: "ELE-002", unit: "قطعة", quantity: 150, minLevel: 25 },
    { name: "سلك كهرباء 2.5 مم", code: "ELE-003", unit: "متر", quantity: 500, minLevel: 100 },
    { name: "سلك كهرباء 4 مم", code: "ELE-004", unit: "متر", quantity: 300, minLevel: 50 },
    { name: "قاطع كهرباء 32 أمبير", code: "ELE-005", unit: "قطعة", quantity: 40, minLevel: 8 },
    { name: "بلكة كهرباء مربعة", code: "ELE-006", unit: "قطعة", quantity: 100, minLevel: 20 },
    { name: "شريط LED 5 متر", code: "ELE-007", unit: "رول", quantity: 35, minLevel: 5 },
    { name: "محول كهرباء 12V", code: "ELE-008", unit: "قطعة", quantity: 20, minLevel: 4 },
  ],
  hvac: [
    { name: "فلتر مكيف سبليت", code: "HVA-001", unit: "قطعة", quantity: 60, minLevel: 10 },
    { name: "غاز فريون R22", code: "HVA-002", unit: "أسطوانة", quantity: 12, minLevel: 3 },
    { name: "عازل نحاس 3/8", code: "HVA-003", unit: "متر", quantity: 80, minLevel: 15 },
    { name: "مروحة خارجية 1.5 طن", code: "HVA-004", unit: "قطعة", quantity: 6, minLevel: 2 },
    { name: "ثرموستات ديجيتال", code: "HVA-005", unit: "قطعة", quantity: 18, minLevel: 4 },
    { name: "كمبرسر 2.5 طن", code: "HVA-006", unit: "قطعة", quantity: 4, minLevel: 1 },
    { name: "مبخر داخلي صغير", code: "HVA-007", unit: "قطعة", quantity: 8, minLevel: 2 },
    { name: "حساس حرارة", code: "HVA-008", unit: "قطعة", quantity: 25, minLevel: 5 },
  ],
  civil: [
    { name: "سيراميك أرضيات 60×60", code: "CIV-001", unit: "متر مربع", quantity: 120, minLevel: 20 },
    { name: "دهان بلاستيك أبيض", code: "CIV-002", unit: "علبة", quantity: 45, minLevel: 10 },
    { name: "أسمنت أبيض", code: "CIV-003", unit: "شكارة", quantity: 30, minLevel: 5 },
    { name: "معجون جدران", code: "CIV-004", unit: "علبة", quantity: 50, minLevel: 10 },
    { name: "سلك شبك حديد", code: "CIV-005", unit: "متر", quantity: 200, minLevel: 40 },
    { name: "بلاط جدران 30×60", code: "CIV-006", unit: "متر مربع", quantity: 80, minLevel: 15 },
    { name: "جبس بورد عادي", code: "CIV-007", unit: "لوح", quantity: 40, minLevel: 8 },
    { name: "سيلكون محايد رمادي", code: "CIV-008", unit: "قطعة", quantity: 35, minLevel: 7 },
  ],
};

const exportWithHeader = async (data: any[][], filename: string, sheetName: string) => {
  const XLSX = await import("xlsx");
  const headerRows = [
    ["Ayla Maintenance"],
    ["م. محمد عبد الرحمن"],
    [new Date().toLocaleDateString("ar-SA")],
    [],
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

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>(() => {
    const all: InventoryItem[] = [];
    (Object.keys(DEFAULT_ITEMS) as WarehouseType[]).forEach((wh) => {
      DEFAULT_ITEMS[wh].forEach((it, idx) => {
        all.push({ ...it, id: `${wh}-${idx}`, warehouse: wh });
      });
    });
    return all;
  });

  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [activeTab, setActiveTab] = useState<WarehouseType | "reports">("maintenance");
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const excelRef = useRef<HTMLInputElement>(null);

  const [addForm, setAddForm] = useState({
    name: "", code: "", unit: "", quantity: "", minLevel: "", warehouse: "maintenance" as WarehouseType
  });
  const [withdrawForm, setWithdrawForm] = useState({
    supervisor: "", team: "", itemId: "", quantity: "", warehouse: "maintenance" as WarehouseType
  });

  const handleExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const buf = await file.arrayBuffer();
      const XLSX = await import("xlsx");
      const wb = XLSX.read(buf, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];
      const rows = data.slice(1);
      const imported: InventoryItem[] = rows.map((row, idx) => ({
        id: `imp-${Date.now()}-${idx}`,
        name: String(row[0] || ""),
        code: String(row[1] || ""),
        unit: String(row[2] || ""),
        quantity: Number(row[3] || 0),
        minLevel: Number(row[4] || 0),
        warehouse: (["maintenance", "electrical", "hvac", "civil"].includes(row[5]) ? row[5] : "maintenance") as WarehouseType,
      })).filter((it) => it.name.trim());
      setItems((prev) => [...prev, ...imported]);
    } catch {
      alert("⚠️ تأكد من تثبيت: npm install xlsx");
    }
  };

  const addItem = () => {
    if (!addForm.name.trim() || !addForm.code.trim()) return alert("الاسم والكود مطلوبان");
    setItems((prev) => [...prev, {
      id: `itm-${Date.now()}`,
      name: addForm.name,
      code: addForm.code,
      unit: addForm.unit || "قطعة",
      quantity: Number(addForm.quantity) || 0,
      minLevel: Number(addForm.minLevel) || 5,
      warehouse: addForm.warehouse,
    }]);
    setAddForm({ name: "", code: "", unit: "", quantity: "", minLevel: "", warehouse: "maintenance" });
    setShowAdd(false);
  };

  const withdrawItem = () => {
    if (!withdrawForm.supervisor.trim() || !withdrawForm.itemId || !withdrawForm.quantity) return alert("جميع الحقول مطلوبة");
    const item = items.find((i) => i.id === withdrawForm.itemId);
    if (!item) return alert("الصنف غير موجود");
    const qty = Number(withdrawForm.quantity);
    if (qty <= 0) return alert("الكمية يجب أن تكون أكبر من صفر");
    if (qty > item.quantity) return alert(`الكمية غير متوفرة — المتوفر: ${item.quantity}`);

    setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity - qty } : i));
    setWithdrawals((prev) => [...prev, {
      id: `wdr-${Date.now()}`,
      supervisor: withdrawForm.supervisor,
      team: withdrawForm.team,
      itemId: item.id,
      itemName: item.name,
      quantity: qty,
      date: new Date().toLocaleString("ar-SA"),
      warehouse: item.warehouse,
    }]);
    setWithdrawForm({ supervisor: "", team: "", itemId: "", quantity: "", warehouse: "maintenance" });
    setShowWithdraw(false);
  };

  const exportInventory = async () => {
    const headers = [["المستودع", "الكود", "اسم الصنف", "الوحدة", "الكمية", "الحد الأدنى"]];
    const rows = filteredItems.map((i) => {
      const wh = WAREHOUSES.find((w) => w.key === i.warehouse)?.label || i.warehouse;
      return [wh, i.code, i.name, i.unit, i.quantity, i.minLevel];
    });
    await exportWithHeader([...headers, ...rows], "المخزون_آيلا.xlsx", "المخزون");
  };

  const exportWithdrawals = async () => {
    if (withdrawals.length === 0) return alert("لا توجد صرفيات");
    const headers = [["التاريخ", "المشرف", "الفريق", "المستودع", "الصنف", "الكمية"]];
    const rows = withdrawals.map((w) => {
      const wh = WAREHOUSES.find((x) => x.key === w.warehouse)?.label || w.warehouse;
      return [w.date, w.supervisor, w.team, wh, w.itemName, w.quantity];
    });
    await exportWithHeader([...headers, ...rows], "الصرفيات_آيلا.xlsx", "الصرفيات");
  };

  const filteredItems = useMemo(() => {
    let list = activeTab === "reports" ? items : items.filter((i) => i.warehouse === activeTab);
    if (search.trim()) list = list.filter((i) => i.name.includes(search) || i.code.includes(search));
    return list;
  }, [items, activeTab, search]);

  const lowStock = useMemo(() => items.filter((i) => i.quantity <= i.minLevel), [items]);

  const supervisorReport = useMemo(() => {
    const map: Record<string, { supervisor: string; totalQty: number; items: string[] }> = {};
    withdrawals.forEach((w) => {
      if (!map[w.supervisor]) map[w.supervisor] = { supervisor: w.supervisor, totalQty: 0, items: [] };
      map[w.supervisor].totalQty += w.quantity;
      map[w.supervisor].items.push(`${w.itemName} (${w.quantity})`);
    });
    return Object.values(map);
  }, [withdrawals]);

  const whStats = (wh: WarehouseType) => {
    const list = items.filter((i) => i.warehouse === wh);
    return { count: list.length, low: list.filter((i) => i.quantity <= i.minLevel).length };
  };

  const whItems = (wh: WarehouseType) => items.filter((i) => i.warehouse === wh);

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h1 className="text-2xl lg:text-3xl font-bold text-[#2C1810] flex items-center gap-3" style={{ fontFamily: "Tajawal, sans-serif" }}>
            <Warehouse className="w-8 h-8 text-[#C9A227]" /> إدارة المخازن
          </h1>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => excelRef.current?.click()} className="px-4 py-2 rounded-xl bg-[#C9A227] text-[#1A0F09] font-bold text-sm flex items-center gap-2 hover:bg-[#b89420] transition">
              <Upload className="w-4 h-4" /> استيراد Excel
            </button>
            <input ref={excelRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleExcel} />
            <button onClick={() => setShowAdd(true)} className="px-4 py-2 rounded-xl bg-[#1A0F09] text-[#C9A227] font-bold text-sm flex items-center gap-2 hover:bg-[#2C1810] transition">
              <Plus className="w-4 h-4" /> إضافة صنف
            </button>
            <button onClick={() => setShowWithdraw(true)} className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center gap-2 hover:bg-blue-700 transition">
              <ArrowLeftRight className="w-4 h-4" /> صرف قطع
            </button>
            {items.length > 0 && (
              <>
                <button onClick={exportInventory} className="px-4 py-2 rounded-xl bg-green-600 text-white font-bold text-sm flex items-center gap-2 hover:bg-green-700 transition">
                  <Download className="w-4 h-4" /> تصدير المخزون
                </button>
                <button onClick={exportWithdrawals} className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-sm flex items-center gap-2 hover:bg-purple-700 transition">
                  <FileSpreadsheet className="w-4 h-4" /> تصدير الصرفيات
                </button>
              </>
            )}
          </div>
        </div>

        {/* إحصائيات */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <div className="p-4 rounded-2xl bg-white border border-[#C9A227]/10 text-center">
            <div className="text-2xl font-bold text-[#C9A227]">{items.length}</div>
            <div className="text-xs text-gray-500 mt-1">إجمالي الأصناف</div>
          </div>
          {WAREHOUSES.map((w) => (
            <div key={w.key} className={`p-4 rounded-2xl bg-white border text-center ${w.light}`}>
              <div className={`text-2xl font-bold ${w.color}`}>{whStats(w.key).count}</div>
              <div className="text-xs text-gray-500 mt-1">{w.label}</div>
              {whStats(w.key).low > 0 && (
                <div className="text-[10px] text-red-600 mt-1 flex items-center justify-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> {whStats(w.key).low} ناقص
                </div>
              )}
            </div>
          ))}
        </div>

        {/* تنبيهات النواقص */}
        {lowStock.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="font-bold text-red-700 text-sm">تنبيه: أصناف وصلت للحد الأدنى ({lowStock.length})</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {lowStock.map((it) => (
                <span key={it.id} className="px-3 py-1 rounded-lg bg-white border border-red-200 text-xs text-red-700 font-bold">
                  {it.name} ({it.quantity} {it.unit})
                </span>
              ))}
            </div>
          </div>
        )}

        {/* تبويبات */}
        <div className="flex flex-wrap gap-2 mb-6">
          {WAREHOUSES.map((w) => (
            <button key={w.key} onClick={() => setActiveTab(w.key)} className={`px-4 py-2 rounded-xl font-bold text-sm transition flex items-center gap-2 ${activeTab === w.key ? "bg-[#C9A227] text-[#1A0F09]" : "bg-white text-[#5C3A2A] border border-[#C9A227]/20"}`}>
              <Package className="w-4 h-4" /> {w.label}
            </button>
          ))}
          <button onClick={() => setActiveTab("reports")} className={`px-4 py-2 rounded-xl font-bold text-sm transition flex items-center gap-2 ${activeTab === "reports" ? "bg-[#C9A227] text-[#1A0F09]" : "bg-white text-[#5C3A2A] border border-[#C9A227]/20"}`}>
            <BarChart3 className="w-4 h-4" /> تقارير الصرف
          </button>
        </div>

        {/* بحث */}
        {activeTab !== "reports" && (
          <div className="bg-white rounded-2xl border border-[#C9A227]/10 p-4 mb-6">
            <div className="relative max-w-md">
              <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث باسم الصنف أو الكود..." className="w-full pr-9 pl-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
            </div>
          </div>
        )}

        {/* محتوى المستودعات */}
        {activeTab !== "reports" && (
          <div className="bg-white rounded-2xl border border-[#C9A227]/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#FAF7F2]">
                  <tr>
                    <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">#</th>
                    <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">الكود</th>
                    <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">اسم الصنف</th>
                    <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">الوحدة</th>
                    <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">الكمية</th>
                    <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">الحد الأدنى</th>
                    <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((it, i) => (
                    <tr key={it.id} className="border-t border-[#C9A227]/5 hover:bg-[#FAF7F2]/50 transition">
                      <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{it.code}</td>
                      <td className="px-4 py-3 font-medium text-[#2C1810]">{it.name}</td>
                      <td className="px-4 py-3 text-gray-600">{it.unit}</td>
                      <td className="px-4 py-3 font-bold text-[#2C1810]">{it.quantity}</td>
                      <td className="px-4 py-3 text-gray-500">{it.minLevel}</td>
                      <td className="px-4 py-3">
                        {it.quantity <= it.minLevel ? (
                          <span className="px-2 py-1 rounded-lg bg-red-50 text-red-700 text-xs font-bold border border-red-200 flex items-center gap-1 w-fit">
                            <TrendingDown className="w-3 h-3" /> ناقص
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-bold border border-green-200">متوفر</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-3 border-t border-[#C9A227]/10 text-xs text-gray-500 text-center">
              عرض {filteredItems.length} صنف
            </div>
          </div>
        )}

        {/* تقارير الصرف */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            {/* جدول الصرفيات */}
            <div className="bg-white rounded-2xl border border-[#C9A227]/10 overflow-hidden">
              <div className="p-4 border-b border-[#C9A227]/10 flex items-center gap-2">
                <ArrowLeftRight className="w-5 h-5 text-[#C9A227]" />
                <h3 className="font-bold text-[#2C1810]">سجل الصرفيات</h3>
              </div>
              {withdrawals.length === 0 ? (
                <div className="p-12 text-center text-gray-500">لا توجد صرفيات مسجلة</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[#FAF7F2]">
                      <tr>
                        <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">#</th>
                        <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">التاريخ</th>
                        <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">المشرف</th>
                        <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">الفريق</th>
                        <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">المستودع</th>
                        <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">الصنف</th>
                        <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">الكمية</th>
                      </tr>
                    </thead>
                    <tbody>
                      {withdrawals.map((w, i) => (
                        <tr key={w.id} className="border-t border-[#C9A227]/5 hover:bg-[#FAF7F2]/50 transition">
                          <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                          <td className="px-4 py-3 text-gray-600 text-xs">{w.date}</td>
                          <td className="px-4 py-3 font-bold text-[#2C1810]">{w.supervisor}</td>
                          <td className="px-4 py-3 text-gray-600">{w.team}</td>
                          <td className="px-4 py-3"><span className="px-2 py-1 rounded-lg bg-[#C9A227]/10 text-[#5C3A2A] text-[10px] font-bold">{WAREHOUSES.find((x) => x.key === w.warehouse)?.label || w.warehouse}</span></td>
                          <td className="px-4 py-3 text-gray-600">{w.itemName}</td>
                          <td className="px-4 py-3 font-bold text-red-600">{w.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* تقرير المشرفين */}
            {supervisorReport.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#C9A227]/10 overflow-hidden">
                <div className="p-4 border-b border-[#C9A227]/10 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#C9A227]" />
                  <h3 className="font-bold text-[#2C1810]">تقرير استهلاك المشرفين</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[#FAF7F2]">
                      <tr>
                        <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">#</th>
                        <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">المشرف</th>
                        <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">إجمالي الكمية</th>
                        <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">الأصناف المستهلكة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {supervisorReport.map((r, i) => (
                        <tr key={i} className="border-t border-[#C9A227]/5 hover:bg-[#FAF7F2]/50 transition">
                          <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                          <td className="px-4 py-3 font-bold text-[#2C1810]">{r.supervisor}</td>
                          <td className="px-4 py-3 font-bold text-[#C9A227]">{r.totalQty}</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {r.items.map((it, idx) => (
                                <span key={idx} className="px-2 py-0.5 rounded-lg bg-gray-100 text-gray-700 text-[10px] font-bold">{it}</span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal إضافة صنف */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#2C1810]">إضافة صنف جديد</h2>
              <button onClick={() => setShowAdd(false)} className="p-1 rounded-lg hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input placeholder="اسم الصنف *" value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227] md:col-span-2" />
              <input placeholder="الكود *" value={addForm.code} onChange={(e) => setAddForm({ ...addForm, code: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
              <input placeholder="الوحدة (قطعة / متر / كجم...)" value={addForm.unit} onChange={(e) => setAddForm({ ...addForm, unit: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
              <input placeholder="الكمية" type="number" value={addForm.quantity} onChange={(e) => setAddForm({ ...addForm, quantity: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
              <input placeholder="الحد الأدنى" type="number" value={addForm.minLevel} onChange={(e) => setAddForm({ ...addForm, minLevel: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
              <select value={addForm.warehouse} onChange={(e) => setAddForm({ ...addForm, warehouse: e.target.value as WarehouseType })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm bg-white focus:outline-none focus:border-[#C9A227] md:col-span-2">
                {WAREHOUSES.map((w) => <option key={w.key} value={w.key}>{w.label}</option>)}
              </select>
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <button onClick={() => setShowAdd(false)} className="px-5 py-2 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition">إلغاء</button>
              <button onClick={addItem} className="px-5 py-2 rounded-xl bg-[#C9A227] text-[#1A0F09] font-bold text-sm hover:bg-[#b89420] transition">حفظ الصنف</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal صرف قطع */}
      {showWithdraw && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowWithdraw(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#2C1810]">صرف قطع للمشرف</h2>
              <button onClick={() => setShowWithdraw(false)} className="p-1 rounded-lg hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <input placeholder="اسم المشرف *" value={withdrawForm.supervisor} onChange={(e) => setWithdrawForm({ ...withdrawForm, supervisor: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
              <input placeholder="اسم الفريق" value={withdrawForm.team} onChange={(e) => setWithdrawForm({ ...withdrawForm, team: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
              <select value={withdrawForm.warehouse} onChange={(e) => setWithdrawForm({ ...withdrawForm, warehouse: e.target.value as WarehouseType, itemId: "" })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm bg-white focus:outline-none focus:border-[#C9A227]">
                {WAREHOUSES.map((w) => <option key={w.key} value={w.key}>{w.label}</option>)}
              </select>
              <select value={withdrawForm.itemId} onChange={(e) => setWithdrawForm({ ...withdrawForm, itemId: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm bg-white focus:outline-none focus:border-[#C9A227]">
                <option value="">اختر الصنف</option>
                {whItems(withdrawForm.warehouse).map((it) => (
                  <option key={it.id} value={it.id}>{it.name} (متوفر: {it.quantity} {it.unit})</option>
                ))}
              </select>
              <input placeholder="الكمية" type="number" value={withdrawForm.quantity} onChange={(e) => setWithdrawForm({ ...withdrawForm, quantity: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <button onClick={() => setShowWithdraw(false)} className="px-5 py-2 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition">إلغاء</button>
              <button onClick={withdrawItem} className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition">تأكيد الصرف</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}