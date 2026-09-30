/** ===================================================
 * ⚙️ BACKEND API: Admin Staff Creation Endpoint (POST /api/admin/signup)
 * =================================================== */
import { NextResponse } from "next/server";
import { scryptSync } from "crypto";
import { verify, COOKIE } from "@/lib/auth";
import { append } from "@/lib/store";
import { dbConnect } from "@/lib/mongodb";
import { StaffUser } from "@/lib/models/StaffUser";
import { AccessLog } from "@/lib/models/AccessLog";
import { sendStaffWelcomeEmail } from "@/lib/mailer";

export const runtime = "nodejs";

// Helper to generate secure random password (e.g. SHM-78aK92)
function generateRandomPassword(): string {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  let randStr = "";
  for (let i = 0; i < 6; i++) {
    randStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SHM-${randStr}`;
}

export async function POST(req: Request) {
  try {
    // 1. Verify Admin Session
    const authHeader = req.headers.get("cookie");
    const cookiesArr = authHeader?.split(";").map((c) => c.trim()) ?? [];
    const cookieVal = cookiesArr.find((c) => c.startsWith(`${COOKIE}=`))?.split("=")[1];
    const session = cookieVal ? await verify(cookieVal) : null;

    if (!session || session.r !== "admin") {
      return NextResponse.json({ ok: false, error: "Unauthorized. Admin privileges required." }, { status: 401 });
    }

    // 2. Extract Data (FormData or JSON)
    let name = "";
    let email = "";
    let phone = "";
    let role = "Manning & Crewing";
    let password = "";

    const contentType = req.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const body = await req.json();
      name = String(body.name ?? "").trim();
      email = String(body.email ?? "").trim();
      phone = String(body.phone ?? "").trim();
      role = String(body.role ?? "Manning & Crewing").trim();
      password = String(body.password ?? "").trim();
    } else {
      const fd = await req.formData();
      name = String(fd.get("name") ?? "").trim();
      email = String(fd.get("email") ?? "").trim();
      phone = String(fd.get("phone") ?? "").trim();
      role = String(fd.get("role") ?? "Manning & Crewing").trim();
      password = String(fd.get("password") ?? "").trim();
    }

    if (!email || !name) {
      return NextResponse.json({ ok: false, error: "Staff Name and Official Email are required." }, { status: 400 });
    }

    // If password is not provided or empty, auto-generate a random secure password
    if (!password) {
      password = generateRandomPassword();
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

    // 3. Connect to MongoDB & Check Duplicate Email
    try {
      const db = await dbConnect();
      if (db) {
        const existingStaff = await StaffUser.findOne({ email: email.toLowerCase() });
        if (existingStaff) {
          return NextResponse.json(
            { ok: false, error: `Staff user with email '${email}' already exists in database.` },
            { status: 400 }
          );
        }
      }
    } catch (dbErr) {
      console.warn("⚠️ MongoDB duplicate check warning:", dbErr);
    }

    // 4. Hash Password using scryptSync
    const salt = `salt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const hashBuf = scryptSync(password, salt, 64);
    const passwordHash = `scrypt:${salt}:${hashBuf.toString("hex")}`;

    // 5. Connect and Save in MongoDB
    try {
      const db = await dbConnect();
      if (db) {
        await StaffUser.create({
          name,
          email: email.toLowerCase(),
          phone,
          role,
          status: "active",
          passwordHash,
        });
        await AccessLog.create({
          at: new Date(),
          event: "admin_created_staff",
          user: `${session.u} created ${email}`,
          ip,
        });
        console.log(`💾 Admin (${session.u}) successfully registered staff user: ${email}`);
      }
    } catch (dbErr) {
      console.warn("⚠️ MongoDB save warning during staff registration:", dbErr);
    }

    // 5. Send Welcome Email with login credentials
    const mailRes = await sendStaffWelcomeEmail({
      toEmail: email,
      staffName: name,
      role,
      tempPassword: password,
    });

    // 6. Audit Log Backup
    await append("access", {
      at: new Date().toISOString(),
      event: "admin_created_staff",
      user: `${session.u} created ${email}`,
      ip,
    });

    if (contentType.includes("application/json") || req.headers.get("accept")?.includes("application/json")) {
      return NextResponse.json({
        ok: true,
        message: `Staff account '${name}' created successfully. Login credentials sent to ${email}`,
        tempPassword: password,
        emailSimulated: mailRes.simulated,
      });
    }

    return NextResponse.redirect(new URL("/admin/?registered=1", req.url), 303);
  } catch (err: any) {
    console.error("❌ Staff creation error:", err);
    return NextResponse.json({ ok: false, error: err?.message || "Server error" }, { status: 500 });
  }
}


