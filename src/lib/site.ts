// Central place for brand strings. The project name is expected to change —
// update here (and in SiteHeader/SiteFooter/layout metadata) rather than
// re-hardcoding it elsewhere.
export const SITE_NAME = "Merkabanooks";

// Public origin, used for absolute URLs in the sitemap, robots.txt, and social
// share previews. Set NEXT_PUBLIC_SITE_URL in production if the domain differs.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://merkabanooks.com").replace(/\/$/, "");
