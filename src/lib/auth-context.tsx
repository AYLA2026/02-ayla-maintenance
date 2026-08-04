"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "system_admin" | "company_manager" | "site_engineer" | "supervisor" | "technician" | "visitor";

interface Tenant {
  id: string;
  name: string;
  nameAr: string;
  color: string;
  logo?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId: string;
  tenantName: string;
  image?: string;
}

interface AuthContextType {
  user: User | null;
  tenant: Tenant | null;
  tenants: Tenant[];
  loading: boolean;
  login: (tenantId: string, role: UserRole, name: string) => void;
  logout: () => void;
  isAllowed: (roles: UserRole[]) => boolean;
}

const TENANTS: Tenant[] = [
  { id: "ayla-main", name: "Ayla Maintenance", nameAr: "آيلا للصيانة", color: "#C9A227" },
  { id: "demo-corp", name: "Demo Corp", nameAr: "شركة تجريبية", color: "#2563eb" },
  { id: "future-co", name: "Future Co", nameAr: "المستقبل", color: "#059669" },
];

const AuthContext = createContext<AuthContextType>({
  user: null, tenant: null, tenants: TENANTS, loading: true,
  login: () => {}, logout: () => {}, isAllowed: () => false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("ayla-session");
    if (saved) {
      try {
        const s = JSON.parse(saved);
        setUser(s.user);
        const t = TENANTS.find(x => x.id === s.user.tenantId) || TENANTS[0];
        setTenant(t);
        document.cookie = `ayla-auth=true; path=/; max-age=86400; SameSite=Lax`;
        document.cookie = `ayla-tenant=${s.user.tenantId}; path=/; max-age=86400; SameSite=Lax`;
      } catch {}
    }
    setLoading(false);
  }, []);

  const login = (tenantId: string, role: UserRole, name: string) => {
    const t = TENANTS.find(x => x.id === tenantId) || TENANTS[0];
    const u: User = {
      id: `u-${Date.now()}`,
      name: name || "User",
      email: `${role}@${tenantId}.local`,
      role,
      tenantId: t.id,
      tenantName: t.nameAr,
    };
    setUser(u);
    setTenant(t);
    localStorage.setItem("ayla-session", JSON.stringify({ user: u }));
    document.cookie = `ayla-auth=true; path=/; max-age=86400; SameSite=Lax`;
    document.cookie = `ayla-tenant=${t.id}; path=/; max-age=86400; SameSite=Lax`;
  };

  const logout = () => {
    setUser(null);
    setTenant(null);
    localStorage.removeItem("ayla-session");
    document.cookie = `ayla-auth=; path=/; max-age=0`;
    document.cookie = `ayla-tenant=; path=/; max-age=0`;
    window.location.href = "/auth/login";
  };

  const isAllowed = (roles: UserRole[]) => {
    if (!user) return false;
    if (user.role === "system_admin") return true;
    return roles.includes(user.role);
  };

  if (!mounted) return <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center"><div className="w-10 h-10 border-4 border-[#C9A227] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <AuthContext.Provider value={{ user, tenant, tenants: TENANTS, loading, login, logout, isAllowed }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);