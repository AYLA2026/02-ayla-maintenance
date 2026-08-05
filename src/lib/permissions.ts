import { UserRole } from "@/lib/auth-context";

export interface NavItem {
  label: string;
  href: string;
  iconName: string;
  roles: UserRole[];
}

export const NAV_ITEMS: NavItem[] = [
  { label: "لوحة التحكم", href: "/", iconName: "LayoutDashboard", roles: ["system_admin", "company_manager", "supervisor", "site_engineer", "technician", "visitor"] },
  { label: "المشاريع", href: "/projects", iconName: "FolderKanban", roles: ["system_admin", "company_manager", "supervisor", "site_engineer"] },
  { label: "المدارس", href: "/schools", iconName: "Building2", roles: ["system_admin", "company_manager", "supervisor", "site_engineer"] },
  { label: "البلاغات", href: "/complaints/inbox", iconName: "Inbox", roles: ["system_admin", "company_manager", "supervisor", "site_engineer", "technician", "visitor"] },
  { label: "البلاغات الذكية", href: "/complaints", iconName: "Zap", roles: ["system_admin", "company_manager", "supervisor", "site_engineer"] },
  { label: "الجدولة الدورية", href: "/schedule", iconName: "Calendar", roles: ["system_admin", "company_manager", "supervisor"] },
  { label: "المخازن", href: "/inventory", iconName: "Package", roles: ["system_admin", "company_manager", "supervisor"] },
  { label: "الفرق", href: "/teams", iconName: "Users", roles: ["system_admin", "company_manager", "supervisor"] },
  { label: "الفنيين", href: "/technicians", iconName: "Wrench", roles: ["system_admin", "company_manager", "supervisor"] },
  { label: "السيارات", href: "/vehicles", iconName: "Truck", roles: ["system_admin", "company_manager", "supervisor"] },
  { label: "المالية", href: "/finance", iconName: "Wallet", roles: ["system_admin", "company_manager", "supervisor"] },
  { label: "التقارير", href: "/reports", iconName: "BarChart3", roles: ["system_admin", "company_manager", "supervisor", "site_engineer"] },
  { label: "تسجيل الشركات", href: "/admin/tenants", iconName: "Building2", roles: ["system_admin"] },
  { label: "الإعدادات", href: "/settings", iconName: "Settings", roles: ["system_admin", "company_manager", "supervisor"] },
];

export function canAccess(role: UserRole | undefined, href: string): boolean {
  if (!role) return false;
  if (href === "/auth/login" || href.startsWith("/auth/")) return true;
  // ابحث عن تطابق تام أولاً (للروابط الطويلة مثل /complaints/inbox)
  const exact = NAV_ITEMS.find((n) => n.href === href);
  if (exact) return exact.roles.includes(role);
  // بعدها ابحث عن تطابق جزئي
  const item = NAV_ITEMS.find((n) => href.startsWith(n.href + "/"));
  if (!item) return true;
  return item.roles.includes(role);
}