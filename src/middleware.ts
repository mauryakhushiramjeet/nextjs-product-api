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
      console.log("Role is:", role);
    } catch (err) {
      console.log(err);
      return NextResponse.redirect(new URL("/login", request.nextUrl));
    }
  }
  // console.log("token is here show in middelware", token);
  if (isPublic && token && role == "admin") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.nextUrl));
  }
  if (isPublic && token && role == "user") {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  if (!isPublic && (!token || !role)) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }
  const adminRoutes = ["/admin/dashboard"];
  const userRoutes = [
    "/",
    "/user/aboutUs",
    "/user/contactUs",
    "/user/shopping",
    `/user/:path`,
    "/user/cart",
  ];
  if (role == "user") {
    if (adminRoutes.includes(path)) {
      return NextResponse.redirect(new URL("/", request.nextUrl));
    }
  } else {
    if (userRoutes.includes(path)) {
      return NextResponse.redirect(
        new URL("/admin/dashboard", request.nextUrl)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/signup",
    "/signIn",
    "/admin/dashboard",
    "/user/aboutUs",
    "/user/contactUs",
    "/user/shopping",
    `/user/:path`,
    "/user/cart",
  ],
};
