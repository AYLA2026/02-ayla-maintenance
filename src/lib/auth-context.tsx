"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "super_admin" | "admin" | "supervisor" | "technician" | "viewer";

export interface Tenant {
  id: string;
  name: string;
  color?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId: string;
}

interface AuthContextType {
  user: AuthUser | null;
  tenant: Tenant | null;
  tenants: Tenant[];
  login: (user: AuthUser, tenant: Tenant) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_TENANTS: Tenant[] = [
  { id: "ayla-main", name: "آيلا للصيانة", color: "#C9A227" },
  { id: "demo-1", name: "شركة النور", color: "#2563eb" },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [tenants] = useState<Tenant[]>(DEFAULT_TENANTS);
  const [isLoading, setIsLoading] = useState(true);

  // فحص الجلسة عند التحميل
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/me");
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
            setTenant(data.tenant || DEFAULT_TENANTS[0]);
          }
        }
      } catch {
        // ignore
      }
      // fallback: localStorage demo
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("ayla_user");
        const savedTenant = localStorage.getItem("ayla_tenant");
        if (saved && !user) {
          setUser(JSON.parse(saved));
          if (savedTenant) setTenant(JSON.parse(savedTenant));
        }
      }
      setIsLoading(false);
    }
    checkSession();
  }, []);

  const login = (newUser: AuthUser, newTenant: Tenant) => {
    setUser(newUser);
    setTenant(newTenant);
    if (typeof window !== "undefined") {
      localStorage.setItem("ayla_user", JSON.stringify(newUser));
      localStorage.setItem("ayla_tenant", JSON.stringify(newTenant));
    }
  };

  const logout = () => {
    setUser(null);
    setTenant(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("ayla_user");
      localStorage.removeItem("ayla_tenant");
    }
    fetch("/api/logout", { method: "POST" }).catch(() => {});
  };

  return (
    <AuthContext.Provider value={{ user, tenant, tenants, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
