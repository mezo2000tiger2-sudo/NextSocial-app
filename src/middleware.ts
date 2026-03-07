import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const authRoutes = ['/login', '/regestier']

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const isAuthRoute = authRoutes.includes(req.nextUrl.pathname)

  if (!token && !isAuthRoute) {
    req.nextUrl.pathname = '/login'
    return NextResponse.redirect(req.nextUrl)
  }

  if (token && isAuthRoute) {
    req.nextUrl.pathname = '/'
    return NextResponse.redirect(req.nextUrl)
  }

  return NextResponse.next()
}
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}