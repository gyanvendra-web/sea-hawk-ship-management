import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authorized Staff Portal | Sea Hawk Ship Management",
  description: "Administrative staff portal for Sea Hawk Ship Management personnel to manage seafarer profiles, fleet leads, and security audit logs.",
  alternates: { canonical: "/admin/login/" },
  robots: { index: true, follow: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-layout-container">{children}</div>;
}
