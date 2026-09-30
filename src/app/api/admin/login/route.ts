import { NextResponse } from "next/server";
import { scryptSync, timingSafeEqual } from "crypto";
import { sign, COOKIE } from "@/lib/auth";
import { append } from "@/lib/store";
export const runtime = "nodejs";

const tries = new Map<string, number[]>();
type U = { user: string; role: "admin" | "recruiter"; hash: string };

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const n = Date.now(); const t = (tries.get(ip) ?? []).filter((x) => n - x < 600_000); t.push(n); tries.set(ip, t);
  const back = (q: string) => NextResponse.redirect(new URL(`/admin/login/?e=${q}`, req.url), 303);
  if (t.length > 5) return back("limit");
  const fd = await req.formData(); const user = String(fd.get("user") ?? ""); const pw = String(fd.get("password") ?? "");
  let users: U[] = []; try { users = JSON.parse(process.env.ADMIN_USERS ?? "[]"); } catch {}
  const u = users.find((x) => x.user === user);
  const [, salt, hex] = (u?.hash ?? "scrypt:00:00").split(":");
  const a = scryptSync(pw, salt, 64), b = Buffer.from(hex, "hex");
  const ok = !!u && a.length === b.length && timingSafeEqual(a, b);
  await append("access", { at: new Date().toISOString(), event: ok ? "login" : "login_failed", user, ip });
  if (!ok) return back("1");
  const res = NextResponse.redirect(new URL("/admin/", req.url), 303);
  res.cookies.set(COOKIE, await sign({ u: u!.user, r: u!.role, exp: Date.now() + 8 * 3600_000 }), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 8 * 3600 });
  return res;
}
