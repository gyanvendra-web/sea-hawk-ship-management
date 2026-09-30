import Link from "next/link";
export const metadata = { title: "Page not found | Sea Hawk Ship Management", robots: { index: false } };
export default function NotFound() {
  return (
    <section className="section"><div className="wrap">
      <h1>Page not found</h1>
      <p>The page you are looking for has moved or does not exist. Try one of these instead.</p>
      <ul className="plain">
        <li><Link href="/services/">Our services</Link></li>
        <li><Link href="/seafarers/">Seafarer Hub</Link></li>
        <li><Link href="/contact/">Contact us</Link></li>
      </ul>
    </div></section>
  );
}
