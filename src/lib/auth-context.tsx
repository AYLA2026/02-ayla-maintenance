"use client";

import { createContext, useContext, ReactNode } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export type UserRole = "system_admin" | "company_manager" | "site_engineer" | "supervisor" | "technician" | "visitor";

interface Tenant { id: string; name: string; nameAr: string; color: string; }

interface User {
  id: string; name: string; email: string; role: UserRole;
  tenantId: string; tenantName: string; image?: string;
}

interface AuthContextType {
  user: User | null; tenant: Tenant | null; loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void; isAllowed: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null, tenant: null, loading: true,
  login: async () => {}, logout: () => {}, isAllowed: () => false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
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
    <AuthContext.Provider value={{ user, tenant, loading: status === "loading", login, logout, isAllowed }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
