import { UserRole } from "@/lib/auth-context";

export interface NavItem {
  label: string;
  href: string;
  iconName: string;
  roles: UserRole[];
}

export const NAV_ITEMS: NavItem[] = [
  { label: "لوحة التحكم", href: "/", iconName: "LayoutDashboard", roles: ["system_admin", "company_manager", "supervisor", "site_engineer", "technician", "visitor"] },
  { label: "البلاغات", href: "/complaints/inbox", iconName: "Inbox", roles: ["system_admin", "company_manager", "supervisor", "site_engineer", "technician", "visitor"] },
  { label: "البلاغات الذكية", href: "/complaints/distributor", iconName: "Zap", roles: ["system_admin", "company_manager", "supervisor", "site_engineer"] },
  { label: "الجدولة الدورية", href: "/schedule", iconName: "Calendar", roles: ["system_admin", "company_manager", "supervisor"] },
  { label: "المخازن", href: "/inventory", iconName: "Package", roles: ["system_admin", "company_manager", "supervisor"] },
  { label: "المباني", href: "/buildings", iconName: "Building2", roles: ["system_admin", "company_manager", "supervisor", "site_engineer"] },
  { label: "الفرق", href: "/teams", iconName: "Users", roles: ["system_admin", "company_manager", "supervisor"] },
  { label: "السيارات", href: "/vehicles", iconName: "Truck", roles: ["system_admin", "company_manager", "supervisor"] },
  { label: "الفنيين", href: "/technicians", iconName: "Wrench", roles: ["system_admin", "company_manager", "supervisor"] },
  { label: "التقارير", href: "/reports", iconName: "BarChart3", roles: ["system_admin", "company_manager", "supervisor", "site_engineer"] },
  { label: "إدارة الشركات", href: "/admin/tenants", iconName: "Building2", roles: ["system_admin"] },
];

export function canAccess(role: UserRole | undefined, href: string): boolean {
  if (!role) return false;
  if (href === "/auth/login") return true;
  const item = NAV_ITEMS.find((n) => n.href === href);
  if (!item) return true;
  return item.roles.includes(role);
}