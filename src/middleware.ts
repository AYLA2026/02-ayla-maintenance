import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ req, token }) {
        if (token) return true;
        return false;
      },
    },
    pages: {
      signIn: "/auth/login",
    },
  }
);

// الصفحات التي تحتاج حماية
export const config = {
  matcher: [
    "/",
    "/projects/:path*",
    "/schools/:path*",
    "/workforce/:path*",
    "/reports/:path*",
    "/dashboard/:path*",
  ],
};