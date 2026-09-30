/** ===================================================
 * ⚙️ UTILITY: Email Notification Service (Nodemailer)
 * Handles sending Staff Welcome Credentials & Forgot Password OTPs
 * =================================================== */
import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST || "";
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const SMTP_FROM = process.env.SMTP_FROM || `"Sea Hawk Maritime Portal" <noreply@seahawkgroup.co.in>`;

/**
 * Creates Nodemailer Transporter if credentials configured
 */
function getTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER || "";
  const pass = process.env.SMTP_PASS || "";

  if (user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });
  }
  return null;
}

/**
 * Send Welcome Credentials email to newly registered staff member
 */
export async function sendStaffWelcomeEmail(params: {
  toEmail: string;
  staffName: string;
  role: string;
  tempPassword: string;
}): Promise<{ success: boolean; simulated?: boolean; error?: string }> {
  const { toEmail, staffName, role, tempPassword } = params;

  const subject = `⚓ Sea Hawk Maritime Portal - Staff Account Created`;
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f6f9; padding: 30px; color: #1e293b;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <div style="background: #0b2233; color: #ffffff; padding: 24px; text-align: center; border-bottom: 4px solid #d49b18;">
          <h2 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 1px;">⚓ SEA HAWK MARITIME</h2>
          <p style="margin: 5px 0 0; font-size: 13px; color: #d49b18; text-transform: uppercase;">Maritime Operations Portal Access</p>
        </div>
        
        <div style="padding: 30px;">
          <h3 style="color: #0b2233; margin-top: 0;">Welcome to the Operations Team, ${staffName}!</h3>
          <p style="line-height: 1.6; color: #475569;">
            An administrator has created your staff access account for the <strong>Sea Hawk Maritime Operations Portal</strong> under the department: <strong>${role}</strong>.
          </p>
          
          <div style="background: #f8fafc; border-left: 4px solid #d49b18; padding: 20px; margin: 25px 0; border-radius: 4px;">
            <p style="margin: 0 0 10px; font-size: 12px; font-weight: bold; color: #64748b; text-transform: uppercase;">Your Portal Credentials</p>
            <p style="margin: 5px 0;"><strong>Official Email:</strong> ${toEmail}</p>
            <p style="margin: 5px 0;"><strong>Temporary Password:</strong> <code style="background: #e2e8f0; padding: 4px 8px; border-radius: 4px; font-size: 15px; color: #0b2233; font-weight: bold;">${tempPassword}</code></p>
          </div>

          <p style="line-height: 1.6; color: #475569;">
            Please log in at your earliest convenience to access your dashboard. We recommend changing your password after your first sign-in.
          </p>

          <div style="text-align: center; margin-top: 30px;">
            <a href="https://seahawk-website.vercel.app/admin/login" style="background: #0b2233; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-weight: bold; display: inline-block;">Log In To Staff Portal →</a>
          </div>
        </div>

        <div style="background: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
          Sea Hawk Ship Management Pvt. Ltd. • Enterprise Operations Security
        </div>
      </div>
    </div>
  `;

  try {
    const transporter = getTransporter();
    if (transporter) {
      await transporter.sendMail({
        from: SMTP_FROM,
        to: toEmail,
        subject,
        html,
      });
      console.log(`✉️ Welcome email sent successfully to ${toEmail}`);
      return { success: true };
    } else {
      console.log(`ℹ️ [SIMULATED EMAIL] Welcome email for ${toEmail}: Password=${tempPassword}`);
      return { success: true, simulated: true };
    }
  } catch (err: any) {
    console.error("❌ Failed to send welcome email:", err);
    return { success: false, error: err?.message };
  }
}

/**
 * Send Forgot Password 6-Digit Verification OTP email
 */
export async function sendOtpEmail(params: {
  toEmail: string;
  otp: string;
}): Promise<{ success: boolean; simulated?: boolean; error?: string }> {
  const { toEmail, otp } = params;

  const subject = `🔑 Sea Hawk Portal - Password Reset OTP (${otp})`;
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f6f9; padding: 30px; color: #1e293b;">
      <div style="max-width: 550px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <div style="background: #0b2233; color: #ffffff; padding: 24px; text-align: center; border-bottom: 4px solid #d49b18;">
          <h2 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 1px;">⚓ SEA HAWK MARITIME</h2>
          <p style="margin: 5px 0 0; font-size: 13px; color: #d49b18; text-transform: uppercase;">Security Verification Code</p>
        </div>
        
        <div style="padding: 30px; text-align: center;">
          <h3 style="color: #0b2233; margin-top: 0;">Password Reset Request</h3>
          <p style="line-height: 1.6; color: #475569;">
            We received a request to reset the password for your Sea Hawk Staff account (<strong>${toEmail}</strong>).
          </p>
          
          <div style="background: #f8fafc; border: 2px dashed #d49b18; padding: 20px; margin: 25px 0; border-radius: 8px; display: inline-block;">
            <p style="margin: 0 0 5px; font-size: 11px; font-weight: bold; color: #64748b; text-transform: uppercase;">Your 6-Digit OTP Code</p>
            <span style="font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #0b2233;">${otp}</span>
            <p style="margin: 8px 0 0; font-size: 12px; color: #ef4444;">⏰ Valid for 10 minutes</p>
          </div>

          <p style="line-height: 1.5; color: #64748b; font-size: 13px;">
            If you did not request a password reset, please ignore this email or contact security administration immediately.
          </p>
        </div>

        <div style="background: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
          Sea Hawk Ship Management Pvt. Ltd. • Automated Security Gateway
        </div>
      </div>
    </div>
  `;

  try {
    const transporter = getTransporter();
    if (transporter) {
      await transporter.sendMail({
        from: SMTP_FROM,
        to: toEmail,
        subject,
        html,
      });
      console.log(`✉️ OTP email sent successfully to ${toEmail}`);
      return { success: true };
    } else {
      console.log(`🔑 [SIMULATED OTP] Sent to ${toEmail}: OTP=${otp}`);
      return { success: true, simulated: true };
    }
  } catch (err: any) {
    console.error("❌ Failed to send OTP email:", err);
    return { success: false, error: err?.message };
  }
}
