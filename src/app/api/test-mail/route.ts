import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const targetEmail = url.searchParams.get("to") || process.env.SMTP_USER || "gyanvendram@gmail.com";

  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();

  if (!user || !pass) {
    return NextResponse.json({
      ok: false,
      status: "NO_CREDENTIALS",
      error: "SMTP_USER or SMTP_PASS environment variables are missing in Vercel settings.",
      envCheck: {
        SMTP_HOST: host,
        SMTP_PORT: port,
        SMTP_USER_PRESENT: !!user,
        SMTP_PASS_PRESENT: !!pass,
      },
    });
  }

  // Use service: "gmail" if host is gmail or user ends with @gmail.com
  const isGmail = host.includes("gmail") || user.endsWith("@gmail.com");

  try {
    const transporter = isGmail
      ? nodemailer.createTransport({
          service: "gmail",
          auth: { user, pass },
        })
      : nodemailer.createTransport({
          host,
          port,
          secure: port === 465,
          auth: { user, pass },
        });

    // Verify SMTP connection
    await transporter.verify();

    // Send test email
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || `"Sea Hawk Maritime" <${user}>`,
      to: targetEmail,
      subject: "⚓ Live SMTP Verification - Sea Hawk Ship Management",
      html: `<div style="font-family:sans-serif;padding:20px;background:#f8fafc;color:#0b2233;">
        <h2>✅ SMTP Email Verification Successful!</h2>
        <p>This email confirms that live email sending from Sea Hawk Ship Management on Vercel is 100% active and working.</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
      </div>`,
    });

    return NextResponse.json({
      ok: true,
      status: "SENT",
      messageId: info.messageId,
      accepted: info.accepted,
      sentTo: targetEmail,
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      {
        ok: false,
        status: "FAILED",
        errorName: error.name,
        errorMessage: error.message,
        envCheck: {
          SMTP_HOST: host,
          SMTP_PORT: port,
          SMTP_USER_PRESENT: !!user,
          SMTP_PASS_PRESENT: !!pass,
        },
      },
      { status: 500 }
    );
  }
}
