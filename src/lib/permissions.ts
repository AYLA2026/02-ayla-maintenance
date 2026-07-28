export type UserRole = "super_admin" | "admin" | "supervisor" | "technician" | "viewer";

export interface Tenant { id: string; name: string; color?: string; }
export interface AuthUser { id: string; name: string; email: string; role: UserRole; tenantId: string; }

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "مدير النظام",
  admin: "مدير الشركة",
  supervisor: "مشرف",
  technician: "فني",
  viewer: "مشاهد",
};

// ألوان واضحة على الخلفية الداكنة #1A0F09
export const ROLE_COLORS: Record<UserRole, string> = {
  super_admin: "text-purple-300 bg-purple-500/20 border-purple-400/40",
  admin:       "text-amber-300  bg-amber-500/20  border-amber-400/40",
  supervisor:  "text-sky-300    bg-sky-500/20    border-sky-400/40",
  technician:  "text-emerald-300 bg-emerald-500/20 border-emerald-400/40",
  viewer:      "text-gray-300   bg-gray-500/20   border-gray-400/40",
};

export const PERMISSIONS: Record<string, UserRole[]> = {
  dashboard: ["super_admin","admin","supervisor","viewer"],
  projects: ["super_admin","admin","supervisor"],
  schools: ["super_admin","admin","supervisor","viewer"],
  vehicles: ["super_admin","admin","supervisor","viewer"],
  employees: ["super_admin","admin","supervisor"],
  finance: ["super_admin","admin","viewer"],
  inventory: ["super_admin","admin","supervisor"],
  teams: ["super_admin","admin","supervisor"],
  schedule: ["super_admin","admin","supervisor"],
  complaints_inbox: ["super_admin","admin","supervisor"],
  complaints_history: ["super_admin","admin","supervisor","viewer"],
  complaints_auto: ["super_admin","admin","supervisor"], // <-- أضفنا المشرف
  reports: ["super_admin","admin","supervisor","viewer"],
  technicians: ["super_admin","admin","supervisor"],
  settings: ["super_admin","admin"],
  tenants: ["super_admin"],
  technician_app: ["technician"],
};

export function hasPermission(role: UserRole, page: string): boolean {
  if (role === "super_admin") return true;
  const allowed = PERMISSIONS[page];
  return allowed ? allowed.includes(role) : false;
}

export function getAllowedLinks(role: UserRole) {
  const all = [
    { key: "dashboard", href: "/", label: "الرئيسية", icon: "LayoutDashboard" },
    { key: "projects", href: "/projects", label: "المشاريع", icon: "Briefcase" },
    { key: "schools", href: "/schools", label: "المدارس", icon: "School" },
    { key: "vehicles", href: "/vehicles", label: "السيارات", icon: "Car" },
    { key: "employees", href: "/employees", label: "القوى العاملة", icon: "Users" },
    { key: "finance", href: "/finance", label: "المالية", icon: "DollarSign" },
    { key: "inventory", href: "/inventory", label: "المخازن", icon: "Package" },
    { key: "teams", href: "/teams", label: "الفرق", icon: "Shield" },
    { key: "schedule", href: "/schedule", label: "الصيانة المجدولة", icon: "Calendar" },
  ];
  return all.filter(l => hasPermission(role, l.key));
}

export function getComplaintLinks(role: UserRole) {
  const links: any[] = [];
  if (hasPermission(role, "complaints_inbox")) links.push({ key: "complaints_inbox", href: "/complaints/inbox", label: "البلاغات الواردة" });
  if (hasPermission(role, "complaints_auto")) links.push({ key: "complaints_auto", href: "/complaints/auto-dispatch", label: "التوزيع الذكي" });
  if (hasPermission(role, "complaints_history")) links.push({ key: "complaints_history", href: "/complaints/history", label: "سجل البلاغات" });
  return links;
}
