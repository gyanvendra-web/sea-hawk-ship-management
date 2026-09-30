export const metadata = { title: "Staff area", robots: { index: false, follow: false } };
export default function AdminLayout({ children }: { children: React.ReactNode }) { return <div className="wrap section">{children}</div>; }
