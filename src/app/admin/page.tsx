import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verify, COOKIE } from "@/lib/auth";
import { readAll, append } from "@/lib/store";
import { dbConnect } from "@/lib/mongodb";
import { StaffUser } from "@/lib/models/StaffUser";
import StaffDashboardClient from "@/components/StaffDashboardClient";

export const metadata: Metadata = {
  title: "Executive Staff Dashboard | Sea Hawk Ship Management",
  description: "Internal administrative control panel for Sea Hawk Ship Management fleet leads, seafarer profiles, and audit records.",
  alternates: { canonical: "/admin/" },
  robots: { index: true, follow: true },
};

type R = Record<string, unknown> & {
  id: string;
  receivedAt: string;
  status: string;
  files?: Record<string, string>;
};

export default async function Admin() {
  const s = await verify((await cookies()).get(COOKIE)?.value);
  if (!s) redirect("/admin/login/");

  await append("access", {
    at: new Date().toISOString(),
    event: "view_dashboard",
    user: s.u,
  });

  const profiles = await readAll<R>("profiles");
  const isAdmin = s.r === "admin";
  const enquiries = isAdmin ? await readAll<R>("enquiries") : [];
  const contacts = isAdmin ? await readAll<R>("contacts") : [];
  const accessLogs = isAdmin ? await readAll<Record<string, unknown>>("access") : [];

  let staffUsers: Record<string, unknown>[] = [];
  if (isAdmin) {
    try {
      const db = await dbConnect();
      if (db) {
        const users = await StaffUser.find({}).sort({ createdAt: -1 }).lean();
        staffUsers = JSON.parse(JSON.stringify(users));
      }
    } catch (err) {
      console.warn("⚠️ Failed to load staff users:", err);
    }
  }

  return (
    <StaffDashboardClient
      session={{ u: s.u, r: s.r }}
      profiles={profiles}
      enquiries={enquiries}
      contacts={contacts}
      accessLogs={accessLogs}
      staffUsers={staffUsers}
    />
  );
}


