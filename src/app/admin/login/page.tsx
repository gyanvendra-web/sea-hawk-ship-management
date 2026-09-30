import type { Metadata } from "next";
import StaffLoginClient from "@/components/StaffLoginClient";

export const metadata: Metadata = {
  title: "Authorized Staff Login | Sea Hawk Ship Management",
  description: "Secure authentication portal for Sea Hawk Ship Management authorized staff and recruiters to access operational tools.",
  alternates: { canonical: "/admin/login/" },
  robots: { index: false, follow: false },
};

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ e?: string }>;
}) {
  const { e } = await searchParams;
  return <StaffLoginClient error={e} />;
}

