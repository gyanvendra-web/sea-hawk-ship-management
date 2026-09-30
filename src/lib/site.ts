export const site = {
  name: "Sea Hawk Ship Management",
  legalName: "SEA HAWK SHIP MANAGEMENT PRIVATE LIMITED", // VERIFY BEFORE PUBLISH: exact spelling per MCA records
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://seahawkgroup.co.in",
  phone: "+91 99992 42808",
  phoneHref: "tel:+919999242808",
  landline: "0120-4528060",
  landlineHref: "tel:01204528060",
  email: "info@seahawkgroup.co.in",
  address: "Unit No. S-28, Eighth Floor, URBTECH NPX, Sector 153, Noida, Gautam Buddha Nagar, Uttar Pradesh 201301, India",
};

export type NavItem = {
  href: string;
  label: string;
  children?: { href: string; label: string }[];
};

export const nav: NavItem[] = [
  {
    href: "/about/",
    label: "About Us",
    children: [
      { href: "/about/", label: "Overview" },
      { href: "/about/leadership/", label: "Leadership" },
      { href: "/about/quality-safety-compliance/", label: "Quality & Safety" },
    ],
  },
  {
    href: "/services/",
    label: "Services",
    children: [
      { href: "/services/", label: "Services Overview" },
      { href: "/services/commercial-management/", label: "Commercial Management" },
      { href: "/services/technical-management/", label: "Technical Management" },
      { href: "/services/crew-management/", label: "Crew Management" },
      { href: "/services/marine-consultancy/", label: "Marine Consultancy" },
      { href: "/services/offshore-marine-support/", label: "Offshore & Marine Support" },
    ],
  },
  { href: "/ship-owners/", label: "Ship Owners" },
  {
    href: "/seafarers/",
    label: "Seafarers",
    children: [
      { href: "/seafarers/", label: "Seafarer Hub" },
      { href: "/seafarers/vacancies/", label: "Current Vacancies" },
      { href: "/seafarers/profile/", label: "Register / Update Profile" },
      { href: "/seafarers/guidance/", label: "Career & Training Guidance" },
      { href: "/recruitment-fraud-advisory/", label: "Fraud Advisory" },
    ],
  },
  { href: "/insights/", label: "Insights" },
  { href: "/contact/", label: "Contact" },
];

