import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      role: string;
      tenantId: string;
      tenantName: string;
    };
  }

  interface User {
    role: string;
    tenantId: string;
    tenantName: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    tenantId?: string;
    tenantName?: string;
  }
}