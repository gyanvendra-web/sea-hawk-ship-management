// node scripts/hash-password.mjs "your password"  -> paste result into ADMIN_USERS
import { scryptSync, randomBytes } from "crypto";
const salt = randomBytes(16).toString("hex");
console.log(`scrypt:${salt}:${scryptSync(process.argv[2], salt, 64).toString("hex")}`);
