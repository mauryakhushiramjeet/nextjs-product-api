import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";
export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublic = path === "/login" || path === "/signup";
  const token = request.cookies.get("token")?.value;
  let role = null;

  if (token) {
    try {
      const { payload: decoded } = await jose.jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_KEY as string)
      );
      role = decoded.role;
    } catch (err) {
      console.log(err);
      return NextResponse.redirect(new URL("/login", request.nextUrl));
    }
  }
  if (isPublic && token) {
    if (role === "admin")
      return NextResponse.redirect(
        new URL("/admin/dashboard", request.nextUrl)
      );
    if (role === "user")
      return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  if (!isPublic && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  if (role === "user" && path.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }
  if (role === "admin" && (path.startsWith("/user") || path === "/")) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.nextUrl));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin/:path*", "/user/:path*", "/login", "/signup"],
};
