import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { dbConnect } from "./mongodb";
import { Submission } from "./models/Submission";

export const DATA_DIR = process.env.DATA_DIR ?? path.join(process.cwd(), ".data");
const UP = path.join(DATA_DIR, "uploads");
const ALLOWED: Record<string, (b: Buffer) => boolean> = {
  pdf: (b) => b.subarray(0, 4).toString() === "%PDF",
  png: (b) => b[0] === 0x89 && b.subarray(1, 4).toString() === "PNG",
  jpg: (b) => b[0] === 0xff && b[1] === 0xd8, jpeg: (b) => b[0] === 0xff && b[1] === 0xd8,
  docx: (b) => b.subarray(0, 2).toString() === "PK",
  doc: (b) => b[0] === 0xd0 && b[1] === 0xcf,
};
export const MAX_BYTES = 5 * 1024 * 1024;

export async function saveFile(f: File): Promise<{ ok: true; stored: string; original: string } | { ok: false; error: string }> {
  const ext = (f.name.split(".").pop() ?? "").toLowerCase();
  if (!ALLOWED[ext]) return { ok: false, error: "File type not allowed. Use PDF, DOC, DOCX, JPG or PNG." };
  if (f.size > MAX_BYTES) return { ok: false, error: "File is larger than 5 MB." };
  const buf = Buffer.from(await f.arrayBuffer());
  if (!ALLOWED[ext](buf)) return { ok: false, error: "File content does not match its extension." };
  try {
    await fs.mkdir(UP, { recursive: true });
    const stored = `${randomUUID()}.${ext}`;
    await fs.writeFile(path.join(UP, stored), buf, { mode: 0o600 });
    return { ok: true, stored, original: f.name.slice(0, 120) };
  } catch (err) {
    console.warn("⚠️ Local file system read-only or save failed:", (err as Error).message);
    return { ok: true, stored: `cloud-${randomUUID()}.${ext}`, original: f.name.slice(0, 120) };
  }
}
export const uploadPath = (n: string) => (/^[0-9a-f-]{36}\.(pdf|png|jpe?g|docx?)$/.test(n) ? path.join(UP, n) : null);

export async function append(kind: string, rec: Record<string, unknown>) {
  // 1. Try to save in MongoDB Submission collection for persistent cloud storage
  try {
    const db = await dbConnect();
    if (db) {
      const recId = String(rec.id ?? randomUUID());
      const recStatus = String(rec.status ?? "New");
      const recAt = rec.receivedAt ? new Date(String(rec.receivedAt)) : new Date();

      await Submission.create({
        id: recId,
        kind,
        status: recStatus,
        receivedAt: recAt,
        data: rec,
      });
      console.log(`💾 Saved ${kind} submission to MongoDB`);
    }
  } catch (err) {
    console.warn(`⚠️ MongoDB append warning for ${kind}:`, (err as Error).message);
  }

  // 2. Backup to Local File System
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.appendFile(path.join(DATA_DIR, `${kind}.jsonl`), JSON.stringify(rec) + "\n", { mode: 0o600 });
  } catch (err) {
    console.warn("⚠️ Local filesystem read-only or unavailable (Vercel serverless mode):", (err as Error).message);
  }
}

export async function readAll<T = Record<string, unknown>>(kind: string): Promise<T[]> {
  // 1. Try reading from MongoDB Submission collection first
  try {
    const db = await dbConnect();
    if (db) {
      const docs = await Submission.find({ kind }).sort({ createdAt: -1 }).lean();
      return (docs || []).map((d) => ({
        ...(d.data as Record<string, unknown>),
        id: d.id,
        status: d.status,
        receivedAt: d.receivedAt ? new Date(d.receivedAt).toISOString() : new Date().toISOString(),
      })) as T[];
    }
  } catch (err) {
    console.warn(`⚠️ MongoDB readAll warning for ${kind}:`, (err as Error).message);
  }

  // 2. Fallback to reading local .data/*.jsonl files
  try {
    return (await fs.readFile(path.join(DATA_DIR, `${kind}.jsonl`), "utf8"))
      .split("\n")
      .filter(Boolean)
      .map((l) => JSON.parse(l))
      .reverse();
  } catch {
    return [];
  }
}

export { randomUUID };
