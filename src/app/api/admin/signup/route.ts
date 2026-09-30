/** ===================================================
 * ⚙️ BACKEND API: Staff Registration Endpoint (POST /api/admin/signup)
 * =================================================== */
import { NextResponse } from "next/server";
import { sign, COOKIE } from "@/lib/auth";
import { append } from "@/lib/store";
import { dbConnect } from "@/lib/mongodb";
import { StaffUser } from "@/lib/models/StaffUser";
import { AccessLog } from "@/lib/models/AccessLog";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const fd = await req.formData();
    const name = String(fd.get("name") ?? "Staff Member");
    const email = String(fd.get("email") ?? "staff@seahawkgroup.co.in");
    const phone = String(fd.get("phone") ?? "");
    const role = String(fd.get("role") ?? "Manning & Crewing");
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

    // 1. Try to connect & store in MongoDB
    try {
      const db = await dbConnect();
      if (db) {
        await StaffUser.findOneAndUpdate(
          { email: email.toLowerCase() },
          { name, email, phone, role },
          { upsert: true, new: true }
        );
        await AccessLog.create({
          at: new Date(),
          event: "staff_signup",
          user: email || name,
          ip,
        });
        console.log("💾 Registered staff user saved to MongoDB");
      }
    } catch (dbErr) {
      console.warn("⚠️ MongoDB save bypassed, using local store:", dbErr);
    }

    // 2. Local File Log Backup
    await append("access", {
      at: new Date().toISOString(),
      event: "staff_signup",
      user: email || name,
      ip,
    });

    // 3. Sign authentication cookie for instant dashboard access
    const res = NextResponse.redirect(new URL("/admin/", req.url), 303);
    res.cookies.set(
      COOKIE,
      await sign({ u: name || email, r: "admin", exp: Date.now() + 8 * 3600_000 }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 8 * 3600,
      }
    );
    return res;
  } catch (err) {
    return NextResponse.redirect(new URL("/admin/login/?e=1", req.url), 303);
  }
}
