export interface Report {
  id: string;
  reportNo: string;
  title: string;
  description: string;
  category: ReportCategory;
  priority: Priority;
  status: ReportStatus;
  senderPhone: string;
  senderName: string | null;
  senderType: SenderType;
  schoolId: string | null;
  supervisorId: string | null;
  technicianId: string | null;
  images: { url: string; type: 'before' | 'after' }[] | null;
  location: { lat: number; lng: number; address: string } | null;
  rating: number | null;
  feedback: string | null;
  receivedAt: Date;
  assignedAt: Date | null;
  startedAt: Date | null;
  completedAt: Date | null;
  closedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type ReportCategory = 'ELECTRICAL' | 'PLUMBING' | 'HVAC' | 'CARPENTRY' | 'PAINTING' | 'CLEANING' | 'SECURITY' | 'IT' | 'FURNITURE' | 'OTHER';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type ReportStatus = 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CLOSED' | 'CANCELLED';
export type SenderType = 'WHATSAPP_SCHOOL' | 'WHATSAPP_DIRECT' | 'PLATFORM_API' | 'MANUAL' | 'UNKNOWN';