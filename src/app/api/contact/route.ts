/** ===================================================
 * ⚙️ BACKEND API: Contact Inquiry Endpoint (POST /api/contact)
 * =================================================== */
import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validate";
import { append, randomUUID } from "@/lib/store";
import { dbConnect } from "@/lib/mongodb";
import { ContactForm } from "@/lib/models/ContactForm";

export const runtime = "nodejs";

const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 600_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (limited(ip)) return NextResponse.json({ ok: false, error: "Too many submissions. Please try again later." }, { status: 429 });

  const contentType = req.headers.get("content-type") ?? "";
  let leadData: { name: string; email: string; phone?: string; subject?: string; message: string; company?: string } = {
    name: "",
    email: "",
    message: "",
  };
  let isFormData = false;

  if (contentType.includes("application/json")) {
    try {
      const body = await req.json();
      const parsed = contactSchema.safeParse(body);
      if (!parsed.success) return NextResponse.json({ ok: false, fieldErrors: parsed.error.flatten().fieldErrors }, { status: 422 });
      if (parsed.data.website) return NextResponse.json({ ok: true });
      const { website: _hp, ...lead } = parsed.data;
      leadData = {
        name: lead.name,
        company: lead.company ?? "",
        email: lead.email,
        phone: lead.phone ?? "",
        subject: `${lead.enquiryType} - ${lead.company ?? "General"}`,
        message: lead.message,
      };
    } catch {
      return NextResponse.json({ ok: false, error: "Invalid JSON request." }, { status: 400 });
    }
  } else {
    // HTML FormData Submission
    isFormData = true;
    try {
      const fd = await req.formData();
      if (String(fd.get("website") ?? "")) {
        return NextResponse.redirect(new URL("/?submitted=true", req.url), 303);
      }
      leadData = {
        name: String(fd.get("name") ?? ""),
        company: String(fd.get("company") ?? ""),
        email: String(fd.get("email") ?? ""),
        phone: String(fd.get("phone") ?? ""),
        subject: String(fd.get("subject") ?? "General Inquiry"),
        message: String(fd.get("message") ?? "Quick Contact Form"),
      };
    } catch {
      return NextResponse.json({ ok: false, error: "Invalid Form request." }, { status: 400 });
    }
  }

  try {
    // 1. Try to store in MongoDB
    try {
      const db = await dbConnect();
      if (db) {
        await ContactForm.create({
          name: leadData.name,
          email: leadData.email,
          phone: leadData.phone,
          subject: leadData.subject,
          message: leadData.message,
        });
        console.log("💾 Contact enquiry saved to MongoDB");
      }
    } catch (dbErr) {
      console.warn("⚠️ MongoDB save bypassed for contact:", dbErr);
    }

    // 2. Local File Log Backup
    await append("contacts", {
      id: randomUUID(),
      status: "New",
      receivedAt: new Date().toISOString(),
      ...leadData,
      consentRecord: { at: new Date().toISOString(), ip, policy: "privacy-policy" },
    });
  } catch (e) {
    console.error("[lead:contact] delivery failed", e);
  }

  if (isFormData) {
    return NextResponse.redirect(new URL("/?submitted=true", req.url), 303);
  }

  return NextResponse.json({ ok: true });
}
