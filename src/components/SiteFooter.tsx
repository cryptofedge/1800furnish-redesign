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
  // "Contact Sales" returns once a working sales inbox exists (merkabanooks.com
  // has no mail service yet, so sales@merkabanooks.com would bounce).
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
];

// Calm mist band (the owner asked for no black backgrounds). Ink text and the
// global accent-ink focus ring both read clearly on mist.
const FOOTER_LINK =
  "inline-flex min-h-11 items-center text-sm text-ink-2 transition-colors hover:text-ink";
const FOOTER_HEADING = "type-label mb-2";

export function SiteFooter() {
  return (
    <footer className="border-t-2 border-ink bg-mist text-ink">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-8 sm:py-16 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div>
          <p className="max-w-xs text-lg font-semibold leading-snug text-ink">
            Furniture, facility, and maintenance supply for the institutions that
            hold communities together.
          </p>
        </div>

        <div className="border-t border-ink/15 pt-4 md:border-t-0 md:pt-0">
          <p className={FOOTER_HEADING}>Sectors</p>
          <ul className="flex flex-col">
            {SECTOR_LINKS.map((link) => (
              <li key={link}>
                <Link href="/#sectors" className={FOOTER_LINK}>
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-ink/15 pt-4 md:border-t-0 md:pt-0">
          <p className={FOOTER_HEADING}>Shop</p>
          <ul className="flex flex-col">
            {SHOP_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={FOOTER_LINK}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-ink/15 pt-4 md:border-t-0 md:pt-0">
          <p className={FOOTER_HEADING}>Company</p>
          <ul className="flex flex-col">
            {COMPANY_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={FOOTER_LINK}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Oversized sign-off wordmark, sized to run the full container width. */}
      <div aria-hidden="true" className="overflow-hidden border-t-[3px] border-ink">
        <p
          data-wordmark
          className="type-display mx-auto max-w-7xl whitespace-nowrap px-4 pt-6 text-[length:calc((100vw_-_2.75rem)/6.6)] leading-[0.78] sm:text-[length:min(calc((100vw_-_5.25rem)/6.6),11.5rem)] text-ink sm:px-8"
        >
          {SITE_NAME}
        </p>
      </div>

      <div className="border-t border-ink/15">
        <p className="type-data mx-auto max-w-7xl px-4 py-6 text-xs text-ink-2 sm:px-8">
          © 2026 {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
