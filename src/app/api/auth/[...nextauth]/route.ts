import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      id: "credentials", // ← أضف هذا
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("Credentials received:", credentials);
        
        if (credentials?.email === "admin@ayla.com" && credentials?.password === "password") {
          console.log("Login SUCCESS");
          return { 
            id: "1", 
            email: "admin@ayla.com", 
            name: "مدير النظام" 
          };
        }
        
        console.log("Login FAILED");
        return null;
      }
    })
  ],
  pages: { 
    signIn: "/auth/login",
    error: "/auth/login",
  },
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV !== "production",
});

export { handler as GET, handler as POST };