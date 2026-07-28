import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
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
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|svg|css|js)$).*)"],
}
