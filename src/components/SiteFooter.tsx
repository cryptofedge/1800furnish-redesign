import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

const SECTOR_LINKS = ["Transitional Housing", "Municipal Contracts", "Commercial Offices", "Hospitality"];

const SHOP_LINKS = [
  { label: "Bedroom", href: "/categories/bedroom" },
  { label: "Commercial", href: "/categories/commercial" },
  { label: "Security", href: "/categories/security" },
  { label: "Janitorial", href: "/categories/janitorial" },
  { label: "All categories", href: "/categories" },
];

// Only links that resolve to something real. Add About/Careers here once
// those pages exist.
const COMPANY_LINKS = [
  { label: "Request a Quote", href: "/#quote" },
  { label: "Nooksguard Security", href: "/security" },
  { label: "Contact Sales", href: "mailto:sales@merkabanooks.com" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200/10 bg-charcoal-950">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 sm:px-10 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div>
          <p className="font-display text-lg font-semibold text-slate-200">
            Merkaba<span className="text-amber-400">nooks</span>
          </p>
          <p className="mt-3 max-w-xs text-sm text-slate-400">
            Furniture, facility, and maintenance supply for the institutions that
            hold communities together.
          </p>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-slate-200">Sectors</p>
          <ul className="flex flex-col gap-2">
            {SECTOR_LINKS.map((link) => (
              <li key={link}>
                <Link href="/#sectors" className="text-sm text-slate-400 transition-colors hover:text-amber-300">
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-slate-200">Shop</p>
          <ul className="flex flex-col gap-2">
            {SHOP_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-slate-400 transition-colors hover:text-amber-300">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-slate-200">Company</p>
          <ul className="flex flex-col gap-2">
            {COMPANY_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-slate-400 transition-colors hover:text-amber-300">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200/10 px-6 py-6 text-center text-xs text-slate-500 sm:px-10">
        © 2026 {SITE_NAME}. All rights reserved.
      </div>
    </footer>
  );
}
