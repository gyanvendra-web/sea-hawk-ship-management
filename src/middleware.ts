import { NextResponse, type NextRequest } from "next/server";
import { verify, COOKIE } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const res = pathname === "/admin/login/" || pathname === "/admin/login" ? NextResponse.next() : await (async () => {
    const s = await verify(req.cookies.get(COOKIE)?.value);
    return s ? NextResponse.next() : NextResponse.redirect(new URL("/admin/login/", req.url));
  })();
  res.headers.set("X-Robots-Tag", "noindex, nofollow"); res.headers.set("Cache-Control", "no-store");
  return res;
}
export const config = { matcher: ["/admin/:path*"] };
