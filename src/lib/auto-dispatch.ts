import { classifyReport, ClassificationResult } from './ai';

export interface Report {
  id: string;
  source: 'whatsapp' | 'web' | 'manual';
  from: string;
  name: string;
  school: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: 'NEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED';
  createdAt: string;
  technicianId?: string;
  technicianName?: string;
  schoolLat?: number;
  schoolLng?: number;
}

export interface Technician {
  id: string;
  name: string;
  phone: string;
  specialty: string;
  isAvailable: boolean;
  isActive: boolean;
  lat?: number;
  lng?: number;
  activeJobs: number;
  rating: number;
  schools?: string[];
}

/**
 * 🧠 تصنيف ذكي — AI أولاً، fallback محلي احتياطاً
 */
export async function analyzeReport(text: string): Promise<ClassificationResult> {
  if (process.env.OPENAI_API_KEY) {
    try {
      return await classifyReport(text, []);
    } catch (err) {
      console.log('⚠️ AI classification failed, using fallback:', err);
    }
  }
  return fallbackClassify(text);
}

/**
 * 🔧 Fallback محلي سريع (بدون AI)
 */
function fallbackClassify(text: string): ClassificationResult {
  const lower = text.toLowerCase();
  let category = 'OTHER';
  let priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' = 'MEDIUM';

  if (/كهرب|فيش|لمبة|كابل|توصيل|قاطع|عداد/.test(lower)) {
    category = 'ELECTRICAL';
    if (/شرارة|دخان|حريق|صعق/.test(lower)) priority = 'URGENT';
  } else if (/ماء|صنبور|تسرب|صرف|حمام|مواسير|سخان/.test(lower)) {
    category = 'PLUMBING';
    if (/فيضان|غمر|طفح/.test(lower)) priority = 'URGENT';
  } else if (/مكيف|تكييف|تبريد|فلتر|حار|بارد|مروحة/.test(lower)) {
    category = 'HVAC';
    priority = 'HIGH';
  } else if (/باب|شباك|خشب|قفل|مقبض|نجارة/.test(lower)) {
    category = 'CARPENTRY';
  } else if (/دهان|طلاء|لون|جدارية/.test(lower)) {
    category = 'PAINTING';
    priority = 'LOW';
  } else if (/نظاف|كنس|مسح|قمامة|تعقيم/.test(lower)) {
    category = 'CLEANING';
    priority = 'LOW';
  } else if (/انترنت|شبكة|واي فاي|كمبيوتر|طابعة|بروجكتور|سيرفر/.test(lower)) {
    category = 'IT';
    priority = 'HIGH';
  } else if (/أمن|كاميرا|حماية|حراسة/.test(lower)) {
    category = 'SECURITY';
  }

  return {
    title: `بلاغ ${getCategoryLabel(category)}`,
    category,
    priority,
    confidence: 0.5,
  };
}

function getCategoryLabel(cat: string): string {
  const map: Record<string, string> = {
    ELECTRICAL: 'كهرباء', PLUMBING: 'سباكة', HVAC: 'تكييف',
    CARPENTRY: 'نجارة', PAINTING: 'دهان', CLEANING: 'نظافة',
    SECURITY: 'أمن', IT: 'تقنية معلومات', OTHER: 'صيانة عامة',
  };
  return map[cat] || cat;
}

/**
 * 🎯 مطابقة الفني الأنسب
 */
export function matchTechnician(
  report: Pick<Report, 'category' | 'school' | 'schoolLat' | 'schoolLng'>,
  technicians: Technician[]
): Technician | null {
  const available = technicians.filter((t) => t.isAvailable && t.isActive);
  if (available.length === 0) return null;

  const sameSpecialty = available.filter((t) => t.specialty === report.category);
  const candidates = sameSpecialty.length > 0 ? sameSpecialty : available;

  const scored = candidates.map((t) => {
    let score = 0;
    score += Math.max(0, 10 - t.activeJobs * 2);
    score += t.rating * 2;
    if (t.schools?.includes(report.school)) score += 15;
    if (report.schoolLat && report.schoolLng && t.lat && t.lng) {
      const d = haversine(report.schoolLat, report.schoolLng, t.lat, t.lng);
      if (d < 5) score += 10;
      else if (d < 10) score += 5;
    }
    return { ...t, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0];
}

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/* 👷 فنيين تجريبيين — استبدلهم بـ Prisma لاحقاً */
export const DEMO_TECHNICIANS: Technician[] = [
  { id: '1', name: 'فني مكيفات أحمد', phone: '966501234567', specialty: 'HVAC', isAvailable: true, isActive: true, activeJobs: 1, rating: 4.8, lat: 24.7, lng: 46.7, schools: ['مدرسة النور'] },
  { id: '2', name: 'فني سباكة خالد', phone: '966509876543', specialty: 'PLUMBING', isAvailable: true, isActive: true, activeJobs: 0, rating: 4.5, lat: 24.72, lng: 46.68, schools: ['مدرسة الفجر'] },
  { id: '3', name: 'فني كهرباء سعد', phone: '966503332222', specialty: 'ELECTRICAL', isAvailable: false, isActive: true, activeJobs: 3, rating: 4.2, lat: 24.68, lng: 46.72, schools: [] },
];