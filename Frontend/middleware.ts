import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname === "/women") {
    return NextResponse.rewrite(new URL("/main/women", request.url));
  }

  if (pathname === "/login") {
    return NextResponse.rewrite(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/women", "/login"],
};
