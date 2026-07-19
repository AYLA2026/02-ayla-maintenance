import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (credentials?.email === "admin@ayla.com" && credentials?.password === "password") {
          return { id: "1", email: "admin@ayla.com", name: "مدير النظام" };
        }
        return null;
      }
    })
  ],
  pages: { 
    signIn: "/auth/login",
    error: "/auth/login",  // ← أضف هذا
  },
  session: { strategy: "jwt" },
  callbacks: {
    async redirect({ url, baseUrl }) {
      return baseUrl;  // ← يوجه للرئيسية دائماً
    },
  },
});

export { handler as GET, handler as POST };