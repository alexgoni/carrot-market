import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/session";

const publicOnlyPaths = new Set([
  "/",
  "/login",
  "/sms",
  "/create-account",
  "/github/start",
  "/github/complete",
]);

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const pathname = request.nextUrl.pathname;
  const isPublic = publicOnlyPaths.has(pathname);

  // 비로그인 상태에서 private 페이지 접근 시 -> 홈으로 리다이렉트
  if (!session.id && !isPublic) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 로그인 상태에서 public 페이지 접근 시 -> products로 리다이렉트
  if (session.id && isPublic) {
    return NextResponse.redirect(new URL("/products", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
