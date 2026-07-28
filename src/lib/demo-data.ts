export const DEMO_SCHOOLS = [
  { id: "sch-1", name: "مدرسة النور الابتدائية", type: "ابتدائية", location: "حي النور الرياض", contact: "0551234567" },
  { id: "sch-2", name: "مدرسة الفيصل المتوسطة", type: "متوسطة", location: "حي الفيصل الرياض", contact: "0557654321" },
  { id: "sch-3", name: "مدرسة الرياض الثانوية", type: "ثانوية", location: "حي الرياض الرياض", contact: "0559988776" },
];

export const DEMO_COMPLAINTS = [
  { id: "BLG-001", schoolId: "sch-1", type: "سباكة", title: "تسريب مياه في دورة المياه", status: "جديد", priority: "عالي", date: "2026-07-28", supervisorPhone: "966501234567" },
  { id: "BLG-002", schoolId: "sch-2", type: "كهرباء", title: "انقطاع كهرباء الملعب", status: "قيد العمل", priority: "متوسط", date: "2026-07-27", supervisorPhone: "966501234567" },
  { id: "BLG-003", schoolId: "sch-1", type: "تكييف", title: "عطل مكيف المكتبة", status: "مغلق", priority: "منخفض", date: "2026-07-25", supervisorPhone: "966501234567" },
  { id: "BLG-004", schoolId: "sch-3", type: "دهان", title: "تقشير دهانات الممر الرئيسي", status: "جديد", priority: "متوسط", date: "2026-07-28", supervisorPhone: "966508765432" },
  { id: "BLG-005", schoolId: "sch-2", type: "نجارة", title: "كسر باب الفصل ٢-ب", status: "قيد العمل", priority: "عالي", date: "2026-07-26", supervisorPhone: "966508765432" },
];

export const DEMO_INVENTORY = [
  { id: "INV-001", name: "غاز فريون R22", unit: "أسطوانة", qty: 2, min: 5, warehouse: "المستودع الرئيسي" },
  { id: "INV-002", name: "مسامير تجاري 6 مم", unit: "كجم", qty: 8, min: 10, warehouse: "المستودع الرئيسي" },
  { id: "INV-003", name: "سلك كهرباء 2.5 مم", unit: "بكرة", qty: 15, min: 5, warehouse: "مستودع الكهرباء" },
  { id: "INV-004", name: "صنبور ماء نحاس", unit: "قطعة", qty: 3, min: 5, warehouse: "مستودع السباكة" },
  { id: "INV-005", name: "دهان جدران أبيض", unit: "علبة", qty: 20, min: 10, warehouse: "المستودع الرئيسي" },
  { id: "INV-006", name: "لمبات LED 18 واط", unit: "قطعة", qty: 4, min: 10, warehouse: "مستودع الكهرباء" },
  { id: "INV-007", name: "شريط لاصق عازل", unit: "رول", qty: 12, min: 5, warehouse: "مستودع الكهرباء" },
  { id: "INV-008", name: "مفك كهربائي", unit: "قطعة", qty: 6, min: 3, warehouse: "ورشة الفنيين" },
  { id: "INV-009", name: "مفتاح ربط ١٤ مم", unit: "قطعة", qty: 2, min: 4, warehouse: "ورشة الفنيين" },
  { id: "INV-010", name: "خراطيم مياه PVC", unit: "متر", qty: 30, min: 15, warehouse: "مستودع السباكة" },
];

export const DEMO_TEAMS = [
  { id: "team-1", name: "فريق السباكة", leader: "فهد العتيبي", members: ["سعد الدوسري", "ماجد الشمري"], specialty: "سباكة" },
  { id: "team-2", name: "فريق الكهرباء", leader: "خالد السبيعي", members: ["ناصر القحطاني"], specialty: "كهرباء" },
  { id: "team-3", name: "فريق التكييف", leader: "عبدالله المطيري", members: ["بندر الغامدي"], specialty: "تكييف" },
];
