import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verify, COOKIE } from "@/lib/auth";
import { readAll, append } from "@/lib/store";
import StaffDashboardClient from "@/components/StaffDashboardClient";

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

  return (
    <StaffDashboardClient
      session={{ u: s.u, r: s.r }}
      profiles={profiles}
      enquiries={enquiries}
      contacts={contacts}
      accessLogs={accessLogs}
    />
  );
}

