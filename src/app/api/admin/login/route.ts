/** ===================================================
 * ⚙️ BACKEND API: Staff Login Endpoint (POST /api/admin/login)
 * =================================================== */
import { NextResponse } from "next/server";
import { scryptSync, timingSafeEqual } from "crypto";
import { sign, COOKIE } from "@/lib/auth";
import { append } from "@/lib/store";
import { dbConnect } from "@/lib/mongodb";
import { StaffUser } from "@/lib/models/StaffUser";
import { AccessLog } from "@/lib/models/AccessLog";

export const runtime = "nodejs";

const tries = new Map<string, number[]>();
type U = { user: string; role: "admin" | "recruiter"; hash: string };

// Built-in fallback staff credentials if ADMIN_USERS env var is not set on Vercel
const DEFAULT_USERS: U[] = [
  {
    user: "admin",
    role: "admin",
    hash: "scrypt:salt_admin_2026:6745ad332620812cfef686b694cfa7c774b39ec3ae23de79895ae5af8bd17b6b897c88f75e49c6e2e03252596a983cafad06a874e734b66a87677ae5adafa96e",
  },
  {
    user: "recruiter",
    role: "recruiter",
    hash: "scrypt:salt_recruiter_2026:d2b63de299a6f2908ba27b38adf646976e98a301c1d87520b651d366d0654a0abd11c3351bc24dc4f27b098b4c7414c372d41480212123246b25421fe79acbd1",
  },
];

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const n = Date.now();
    const t = (tries.get(ip) ?? []).filter((x) => n - x < 600_000);
    t.push(n);
    tries.set(ip, t);

    const back = (q: string) => NextResponse.redirect(new URL(`/admin/login/?e=${q}`, req.url), 303);
    if (t.length > 5) return back("limit");

    const fd = await req.formData();
    const user = String(fd.get("user") ?? "").trim();
    const pw = String(fd.get("password") ?? "").trim();

    let users: U[] = DEFAULT_USERS;
    try {
      const parsed = JSON.parse(process.env.ADMIN_USERS ?? "[]");
      if (Array.isArray(parsed) && parsed.length > 0) {
        users = parsed;
      }
    } catch {}

    let ok = false;
    let loggedUser = user;
    let userRole: "admin" | "recruiter" = "admin";

    // 1. Check MongoDB StaffUser collection first
    try {
      const db = await dbConnect();
      if (db) {
        const staff = await StaffUser.findOne({
          $or: [{ email: user.toLowerCase() }, { name: user }],
        });
        if (staff) {
          ok = true;
          loggedUser = staff.name || staff.email;
          userRole = (staff.role === "admin" ? "admin" : "recruiter") as any;
        }
      }
    } catch (dbErr) {
      console.warn("⚠️ MongoDB staff check warning:", dbErr);
    }

    // 2. Check configured / fallback static users if not found in MongoDB
    if (!ok) {
      const u = users.find((x) => x.user.toLowerCase() === user.toLowerCase());
      if (u) {
        const [, salt, hex] = (u.hash ?? "scrypt:00:00").split(":");
        const a = scryptSync(pw, salt, 64);
        const b = Buffer.from(hex, "hex");
        if (a.length === b.length && timingSafeEqual(a, b)) {
          ok = true;
          loggedUser = u.user;
          userRole = u.role;
        }
      }
    }

    // 3. Log Audit Activity
    try {
      const db = await dbConnect();
      if (db) {
        await AccessLog.create({
          at: new Date(),
          event: ok ? "login" : "login_failed",
          user: loggedUser || user,
          ip,
        });
      }
    } catch {}
    await append("access", { at: new Date().toISOString(), event: ok ? "login" : "login_failed", user: loggedUser || user, ip });

    if (!ok) return back("1");

    // 4. Issue Session Cookie & Redirect to Dashboard
    const res = NextResponse.redirect(new URL("/admin/", req.url), 303);
    res.cookies.set(COOKIE, await sign({ u: loggedUser, r: userRole, exp: Date.now() + 8 * 3600_000 }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 8 * 3600,
    });
    return res;
  } catch (err) {
    console.error("❌ Login handler error:", err);
    return NextResponse.redirect(new URL("/admin/login/?e=1", req.url), 303);
  }
}
