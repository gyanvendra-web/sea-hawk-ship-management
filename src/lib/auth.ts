// Session = base64url(JSON{u,r,exp}) + "." + HMAC-SHA256. WebCrypto so it works in middleware (Edge) and Node.
export type Session = { u: string; r: "admin" | "recruiter"; exp: number };
export const COOKIE = "sh_admin";
const enc = new TextEncoder();
const b64 = (b: ArrayBuffer | Uint8Array) => Buffer.from(b instanceof ArrayBuffer ? new Uint8Array(b) : b).toString("base64url");

async function key() {
  const s = process.env.SESSION_SECRET || "seahawk_ship_management_secret_key_32chars_minimum!";
  return crypto.subtle.importKey("raw", enc.encode(s), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

export async function sign(s: Session) {
  const body = Buffer.from(JSON.stringify(s)).toString("base64url");
  return `${body}.${b64(await crypto.subtle.sign("HMAC", await key(), enc.encode(body)))}`;
}

export async function verify(tok?: string): Promise<Session | null> {
  if (!tok) return null;
  const [body, sig] = tok.split(".");
  if (!body || !sig) return null;
  try {
    const ok = await crypto.subtle.verify("HMAC", await key(), Buffer.from(sig, "base64url"), enc.encode(body));
    if (!ok) return null;
    const s = JSON.parse(Buffer.from(body, "base64url").toString()) as Session;
    return s.exp > Date.now() ? s : null;
  } catch {
    return null;
  }
}
