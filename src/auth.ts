import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: { signIn: "/auth/login", error: "/auth/login" },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: { members: { include: { tenant: true } } }
        })
        
        if (!user || !user.password) return null
        
        const isValid = await compare(credentials.password as string, user.password)
        if (!isValid) return null
        
        const member = user.members[0]
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: member?.role || "viewer",
          tenantId: member?.tenantId || "",
          tenantName: member?.tenant?.name || "",
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.tenantId = user.tenantId
        token.tenantName = user.tenantName
      }
      return token
    },
    async session({ session, token }) {
      if (token.sub) session.user.id = token.sub
      if (token.role) session.user.role = token.role as string
      if (token.tenantId) session.user.tenantId = token.tenantId as string
      if (token.tenantName) session.user.tenantName = token.tenantName as string
      return session
    },
  },
})
