import { NextResponse } from "next/server";
import { forms } from "@/lib/forms";
import { append, saveFile, randomUUID } from "@/lib/store";
import { dbConnect } from "@/lib/mongodb";
import { Application } from "@/lib/models/Application";

export const runtime = "nodejs";
const hits = new Map<string, number[]>();
const limited = (ip: string) => { const n = Date.now(); const r = (hits.get(ip) ?? []).filter((t) => n - t < 600_000); r.push(n); hits.set(ip, r); return r.length > 6; };

export async function POST(req: Request) {
  const kind = new URL(req.url).searchParams.get("form");
  if (kind !== "enquiry" && kind !== "profile") return NextResponse.json({ ok: false, error: "Unknown form." }, { status: 400 });
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (limited(ip)) return NextResponse.json({ ok: false, error: "Too many submissions. Please try again later." }, { status: 429 });
  let fd: FormData;
  try { fd = await req.formData(); } catch { return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 }); }
  if (String(fd.get("website") ?? "")) return NextResponse.json({ ok: true }); // honeypot

  const errors: Record<string, string> = {}; const rec: Record<string, unknown> = {}; const files: Record<string, string> = {};
  for (const f of forms[kind].fields) {
    const v = fd.get(f.name);
    if (f.type === "file") {
      if (v instanceof File && v.size > 0) { const r = await saveFile(v); if (r.ok) files[f.name] = `${r.stored}|${r.original}`; else errors[f.name] = r.error; }
      else if (f.required) errors[f.name] = "Upload a file.";
      continue;
    }
    if (f.type === "checkbox") { if (f.required && v !== "on") errors[f.name] = "This confirmation is required."; rec[f.name] = v === "on"; continue; }
    const s = typeof v === "string" ? v.trim() : "";
    if (!s) { if (f.required) errors[f.name] = "This field is required."; continue; }
    if (s.length > (f.max ?? 300)) { errors[f.name] = "Too long."; continue; }
    if (f.type === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s)) { errors[f.name] = "Enter a valid email address."; continue; }
    if (f.type === "tel" && !/^[+\d][\d\s()-]{6,19}$/.test(s)) { errors[f.name] = "Enter a valid phone number."; continue; }
    if (f.type === "number" && !/^\d{1,9}$/.test(s)) { errors[f.name] = "Enter a number."; continue; }
    if (f.type === "date" && Number.isNaN(Date.parse(s))) { errors[f.name] = "Enter a valid date."; continue; }
    if (f.type === "select" && !f.options?.includes(s)) { errors[f.name] = "Select a listed option."; continue; }
    rec[f.name] = s;
  }
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 422 });

  const id = randomUUID(); const now = new Date().toISOString();
  const record = { id, status: "New", receivedAt: now, ...rec, files, consentRecord: { at: now, ip, policy: "privacy-policy" } };
  try {
    // 1. Try to save to MongoDB Application collection
    try {
      const db = await dbConnect();
      if (db) {
        await Application.create({
          name: String(rec.name ?? rec.fullName ?? "Applicant"),
          email: String(rec.email ?? ""),
          phone: String(rec.phone ?? ""),
          rank: String(rec.rank ?? rec.appliedFor ?? ""),
          storedFile: Object.values(files)[0] ?? "",
        });
        console.log("💾 Application saved to MongoDB");
      }
    } catch (dbErr) {
      console.warn("⚠️ MongoDB save bypassed for application:", dbErr);
    }

    // 2. Local File Log Backup
    await append(kind === "enquiry" ? "enquiries" : "profiles", record);
    if (process.env.LEAD_WEBHOOK_URL && kind === "enquiry") await fetch(process.env.LEAD_WEBHOOK_URL, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id, kind, ...rec }) }).catch(() => {});
  } catch (e) { console.error("[submit] store failed", e); return NextResponse.json({ ok: false, error: "We could not save your submission. Please call or email us." }, { status: 500 }); }
  return NextResponse.json({ ok: true });
}
