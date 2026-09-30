/** ===================================================
 * ⚙️ BACKEND API: Forgot Password & Email OTP Endpoint (POST /api/admin/forgot-password)
 * =================================================== */
import { NextResponse } from "next/server";
import { scryptSync } from "crypto";
import { dbConnect } from "@/lib/mongodb";
import { StaffUser } from "@/lib/models/StaffUser";
import { PasswordReset } from "@/lib/models/PasswordReset";
import { sendOtpEmail } from "@/lib/mailer";
import { append } from "@/lib/store";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const action = String(body.action ?? "").trim();
    const email = String(body.email ?? "").toLowerCase().trim();

    if (!email) {
      return NextResponse.json({ ok: false, error: "Email address is required." }, { status: 400 });
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

    // ----------------------------------------------------
    // ACTION 1: SEND OTP
    // ----------------------------------------------------
    if (action === "send_otp") {
      const db = await dbConnect();
      let userExists = false;

      if (db) {
        const staff = await StaffUser.findOne({ email });
        if (staff) userExists = true;
      }

      // Check default accounts as fallback
      if (!userExists) {
        if (email === "admin" || email === "admin@seahawk.com" || email === "recruiter") {
          userExists = true;
        }
      }

      if (!userExists) {
        return NextResponse.json(
          { ok: false, error: "No staff account found with this email address." },
          { status: 404 }
        );
      }

      // Generate 6-digit numeric OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      if (db) {
        await PasswordReset.findOneAndUpdate(
          { email },
          { email, otp, expiresAt },
          { upsert: true, new: true }
        );
      }

      const mailRes = await sendOtpEmail({ toEmail: email, otp });

      await append("access", {
        at: new Date().toISOString(),
        event: "otp_requested",
        user: email,
        ip,
      });

      return NextResponse.json({
        ok: true,
        message: mailRes.simulated
          ? `[Demo Mode] OTP sent! (Demo Code: ${otp})`
          : `6-Digit OTP code has been sent to ${email}`,
        simulatedOtp: mailRes.simulated ? otp : undefined,
      });
    }

    // ----------------------------------------------------
    // ACTION 2: VERIFY OTP & RESET PASSWORD
    // ----------------------------------------------------
    if (action === "verify_otp") {
      const otp = String(body.otp ?? "").trim();
      const newPassword = String(body.newPassword ?? "").trim();

      if (!otp || !newPassword) {
        return NextResponse.json(
          { ok: false, error: "OTP and new password are required." },
          { status: 400 }
        );
      }

      const db = await dbConnect();
      let validOtp = false;

      if (db) {
        const resetDoc = await PasswordReset.findOne({
          email,
          otp,
          expiresAt: { $gt: new Date() },
        });
        if (resetDoc) {
          validOtp = true;
        }
      } else {
        // Fallback testing if offline
        validOtp = true;
      }

      if (!validOtp) {
        return NextResponse.json(
          { ok: false, error: "Invalid or expired OTP code. Please request a new OTP." },
          { status: 400 }
        );
      }

      // Hash new password
      const salt = `salt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const hashBuf = scryptSync(newPassword, salt, 64);
      const passwordHash = `scrypt:${salt}:${hashBuf.toString("hex")}`;

      if (db) {
        await StaffUser.findOneAndUpdate(
          { email },
          { passwordHash },
          { upsert: true }
        );
        // Delete used OTP
        await PasswordReset.deleteOne({ email });
      }

      await append("access", {
        at: new Date().toISOString(),
        event: "password_reset_success",
        user: email,
        ip,
      });

      return NextResponse.json({
        ok: true,
        message: "Password reset successfully! You can now log in with your new password.",
      });
    }

    return NextResponse.json({ ok: false, error: "Invalid action specified." }, { status: 400 });
  } catch (err: any) {
    console.error("❌ Forgot password endpoint error:", err);
    return NextResponse.json({ ok: false, error: err?.message || "Server error" }, { status: 500 });
  }
}
