export interface OfflineComplaint {
  id: string;
  title: string;
  school: string;
  schoolRef: string;
  type: string;
  priority: string;
  status: string;
  description?: string;
  createdAt: string;
  assignedTo?: string;
  team?: string;
  distributed: boolean;
  synced: boolean;
  source: "whatsapp" | "education_app" | "manual" | "smart_distributor";
}

export interface Team {
  id: string;
  name: string;
  specialty: string[];
  status: "متاح" | "مشغول" | "خارج الخدمة";
  members: number;
  currentLoad: number;
  schools: string[];
}

const STORAGE_KEY = "ayla-offline-complaints";
const TEAMS_KEY = "ayla-teams";

function isValidTeam(t: any): t is Team {
  return t && typeof t.id === "string" && Array.isArray(t.schools);
}

export function getTeams(): Team[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(TEAMS_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Team[];
      if (Array.isArray(parsed) && parsed.every(isValidTeam)) {
        return parsed;
      }
    } catch {
      // ignore
    }
  }
  const defaultTeams: Team[] = [
    { id: "t1", name: "فريق الصيانة أ", specialty: ["صيانة", "كهرباء"], status: "متاح", members: 4, currentLoad: 2, schools: ["مجمع مدارس الأمل", "مدرسة النور الابتدائية", "مدرسة الفجر الابتدائية", "مدرسة النخبة الثانوية", "مجمع الرواد التعليمي"] },
    { id: "t2", name: "فريق الصيانة ب", specialty: ["صيانة", "سباكة"], status: "متاح", members: 3, currentLoad: 1, schools: ["مدرسة المستقبل الثانوية", "مدرسة الابتكار المتوسطة", "مدرسة الرياض الابتدائية", "مدرسة الفيصلية المتوسطة", "مدرسة الغد الثانوية"] },
    { id: "t3", name: "فريق التكييف ب", specialty: ["تكييف"], status: "مشغول", members: 2, currentLoad: 4, schools: ["مجمع العلوم الحديثة", "مدرسة الأمل الخاصة", "مدرسة التحفيظ الابتدائية", "مدرسة النور الثانوية", "مدرسة السلام المتوسطة"] },
    { id: "t4", name: "فريق النظافة ج", specialty: ["نظافة"], status: "متاح", members: 6, currentLoad: 0, schools: ["مجمع التربية النموذجي", "مدرسة الابتكار الابتدائية", "مدرسة الفتح الثانوية", "مدرسة الزهراء المتوسطة", "مدرسة الصفوة الابتدائية"] },
    { id: "t5", name: "فريق الطوارئ", specialty: ["صيانة", "تكييف", "كهرباء"], status: "متاح", members: 3, currentLoad: 1, schools: ["مجمع الملك سلمان", "مدرسة العليا الثانوية", "مدرسة الروضة الابتدائية", "مدرسة المجد المتوسطة", "مدرسة الإبداع الثانوية"] },
  ];
  localStorage.setItem(TEAMS_KEY, JSON.stringify(defaultTeams));
  return defaultTeams;
}

export function getOfflineComplaints(): OfflineComplaint[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as OfflineComplaint[];
  } catch {
    return [];
  }
}

export function addOfflineComplaint(
  data: Omit<OfflineComplaint, "id" | "createdAt" | "distributed" | "synced">
): OfflineComplaint {
  const complaints = getOfflineComplaints();
  const newC: OfflineComplaint = {
    ...data,
    id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
    distributed: false,
    synced: false,
  };
  complaints.unshift(newC);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
  return newC;
}

export function updateComplaint(id: string, updates: Partial<OfflineComplaint>): OfflineComplaint | null {
  const complaints = getOfflineComplaints();
  const idx = complaints.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  complaints[idx] = { ...complaints[idx], ...updates };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
  return complaints[idx];
}

function findBestTeam(complaint: OfflineComplaint, teams: Team[]): Team | null {
  const schoolTeam = teams.find(
    (t) => t.schools.includes(complaint.school) && t.status !== "خارج الخدمة"
  );
  if (schoolTeam) return schoolTeam;

  const typeMap: Record<string, string[]> = {
    صيانة: ["فريق الصيانة أ", "فريق الصيانة ب", "فريق الطوارئ"],
    نظافة: ["فريق النظافة ج"],
    تكييف: ["فريق التكييف ب", "فريق الطوارئ"],
    كهرباء: ["فريق الصيانة أ", "فريق الطوارئ"],
    سباكة: ["فريق الصيانة ب", "فريق الطوارئ"],
  };

  const candidates = typeMap[complaint.type] ?? teams.map((t) => t.name);
  const available = teams.filter(
    (t) => candidates.includes(t.name) && t.status === "متاح"
  );
  if (available.length === 0) {
    return teams.find((t) => candidates.includes(t.name)) || null;
  }
  return available.sort((a, b) => a.currentLoad - b.currentLoad)[0];
}

export function distributeComplaints(): { complaints: OfflineComplaint[]; distributed: number } {
  const teams = getTeams();
  const complaints = getOfflineComplaints();
  let count = 0;
  const updated = complaints.map((c) => {
    if (c.distributed && c.team) return c;
    const team = findBestTeam(c, teams);
    if (team) {
      count++;
      return {
        ...c,
        assignedTo: team.id,
        team: team.name,
        distributed: true,
        status: "قيد العمل",
      };
    }
    return c;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return { complaints: updated, distributed: count };
}

export function seedDemoData(): void {
  const existing = getOfflineComplaints();
  if (existing.length > 0) return;

  const demo = [
    { title: "تسرب مياه في مبنى الإدارة - الدور الثاني", school: "مجمع مدارس الأمل", schoolRef: "REF-1001", type: "سباكة", priority: "عالي", status: "قيد العمل", description: "تسرب خلف الحمام الرئيسي", team: "فريق الصيانة ب", assignedTo: "t2", distributed: true, synced: true, source: "whatsapp" as const },
    { title: "عطل مكيف قاعة الاجتماعات", school: "مدرسة النور الابتدائية", schoolRef: "REF-1002", type: "تكييف", priority: "عالي", status: "جديد", description: "لا يبرد، يحتاج فحص فريون", source: "education_app" as const },
    { title: "تبديل لمبات LED الممر الشرقي", school: "مدرسة المستقبل الثانوية", schoolRef: "REF-1003", type: "كهرباء", priority: "متوسط", status: "جديد", description: "8 لمبات محروقة", source: "manual" as const },
    { title: "تنظيف شامل لقاعة الملك فهد", school: "مجمع مدارس الأمل", schoolRef: "REF-1001", type: "نظافة", priority: "منخفض", status: "جديد", description: "مطلوب بعد الاحتفال", source: "whatsapp" as const },
    { title: "كسر باب غرفة الخوادم", school: "مدرسة المستقبل الثانوية", schoolRef: "REF-1003", type: "صيانة", priority: "عالي", status: "جديد", description: "الباب لا يغلق، يحتاج قفل جديد", source: "education_app" as const },
    { title: "صيانة دورية لمولد الكهرباء", school: "مدرسة النور الابتدائية", schoolRef: "REF-1002", type: "صيانة", priority: "متوسط", status: "جديد", description: "فحص زيت + فلتر", source: "manual" as const },
  ];

  demo.forEach((d, i) => {
    const c: OfflineComplaint = {
      id: `demo-${i + 1}`,
      title: d.title,
      school: d.school,
      schoolRef: d.schoolRef,
      type: d.type,
      priority: d.priority,
      status: d.status,
      description: d.description,
      createdAt: new Date(Date.now() - i * 3600000).toISOString(),
      assignedTo: d.assignedTo,
      team: d.team,
      distributed: d.distributed ?? false,
      synced: d.synced ?? false,
      source: d.source,
    };

    if (!c.distributed) {
      const teams = getTeams();
      const team = findBestTeam(c, teams);
      if (team) {
        c.assignedTo = team.id;
        c.team = team.name;
        c.distributed = true;
      }
    }

    const all = getOfflineComplaints();
    all.push(c);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  });
}

export function clearAllData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(TEAMS_KEY);
}