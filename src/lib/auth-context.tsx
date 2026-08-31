"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export type UserRole = "system_admin" | "company_manager" | "site_engineer" | "supervisor" | "technician" | "visitor";

interface Tenant {
  id: string;
  name: string;
  nameAr: string;
  color: string;
  logo?: string;
}

interface User {
  id: string; name: string; email: string; role: UserRole;
  tenantId: string; tenantName: string; image?: string;
}

interface AuthContextType {
  user: User | null;
  tenant: Tenant | null;
  tenants: Tenant[];
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAllowed: (roles: UserRole[]) => boolean;
  addTenant: (t: Tenant) => void;
  removeTenant: (id: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null, tenant: null, tenants: [], loading: true,
  login: async () => {}, logout: () => {}, isAllowed: () => false,
  addTenant: () => {}, removeTenant: () => {},
});

const DEFAULT_TENANTS: Tenant[] = [
  { id: "ayla-main", name: "Ayla Maintenance", nameAr: "آيلا للصيانة", color: "#C9A227" },
  { id: "demo-corp", name: "Demo Corp", nameAr: "شركة تجريبية", color: "#2563eb" },
  { id: "future-co", name: "Future Co", nameAr: "المستقبل", color: "#059669" },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [tenants, setTenants] = useState<Tenant[]>(DEFAULT_TENANTS);

  useEffect(() => {
    const saved = localStorage.getItem("ayla_tenants");
    if (saved) {
      try { setTenants(JSON.parse(saved)); } catch {}
    }
  }, []);

  const user: User | null = session?.user ? {
    id: session.user.id || "", name: session.user.name || "",
    email: session.user.email || "", role: (session.user.role as UserRole) || "visitor",
    tenantId: (session.user.tenantId as string) || "",
    tenantName: (session.user.tenantName as string) || "",
    image: session.user.image || undefined,
  } : null;

  const tenant: Tenant | null = user ? {
    id: user.tenantId, name: user.tenantName, nameAr: user.tenantName, color: "#C9A227"
  } : null;

  const addTenant = (t: Tenant) => {
    const updated = [...tenants, t];
    setTenants(updated);
    localStorage.setItem("ayla_tenants", JSON.stringify(updated));
  };

  const removeTenant = (id: string) => {
    const updated = tenants.filter((t) => t.id !== id);
    setTenants(updated);
    localStorage.setItem("ayla_tenants", JSON.stringify(updated));
  };

  const login = async (email: string, password: string) => {
    await signIn("credentials", { email, password, callbackUrl: "/" });
  };

  const logout = () => { signOut({ callbackUrl: "/auth/login" }); };

  const isAllowed = (roles: UserRole[]) => {
    if (!user) return false;
    if (user.role === "system_admin") return true;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{
      user, tenant, tenants, loading: status === "loading",
      login, logout, isAllowed, addTenant, removeTenant
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);