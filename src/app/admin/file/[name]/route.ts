import { promises as fs } from "fs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify, COOKIE } from "@/lib/auth";
import { uploadPath, append } from "@/lib/store";
export const runtime = "nodejs";

export async function GET(_: Request, { params }: { params: Promise<{ name: string }> }) {
  const s = await verify((await cookies()).get(COOKIE)?.value);
  if (!s) return new NextResponse("Unauthorised", { status: 401 });
  const { name } = await params;
  const p = uploadPath(name); if (!p) return new NextResponse("Not found", { status: 404 });
  try {
    const buf = await fs.readFile(p);
    await append("access", { at: new Date().toISOString(), event: "download", user: s.u, file: name });
    return new NextResponse(buf, { headers: { "Content-Disposition": `attachment; filename="${name}"`, "Content-Type": "application/octet-stream", "X-Content-Type-Options": "nosniff", "Cache-Control": "no-store" } });
  } catch { return new NextResponse("Not found", { status: 404 }); }
}
