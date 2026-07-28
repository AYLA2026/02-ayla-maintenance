import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const token = await getToken({ 
    req, 
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET 
  })
  
  const { nextUrl } = req
  const isLoggedIn = !!token
  const isAuthPage = nextUrl.pathname.startsWith("/auth")
  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth")
  const isPublic = nextUrl.pathname === "/" || nextUrl.pathname.startsWith("/_next") || nextUrl.pathname.includes(".")

  if (isApiAuthRoute) return NextResponse.next()
  if (!isLoggedIn && !isAuthPage && !isPublic) {
    return NextResponse.redirect(new URL("/auth/login", nextUrl))
  }
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/", nextUrl))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|svg|css|js)$).*)"],
}
