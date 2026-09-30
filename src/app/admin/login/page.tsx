import StaffLoginClient from "@/components/StaffLoginClient";

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ e?: string }>;
}) {
  const { e } = await searchParams;
  return <StaffLoginClient error={e} />;
}

