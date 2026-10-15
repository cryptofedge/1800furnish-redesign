// Central place for brand strings. The project name is expected to change —
// update here (and in SiteHeader/SiteFooter/layout metadata) rather than
// re-hardcoding it elsewhere.
export const SITE_NAME = "Merkabanooks";

// Public origin, used for absolute URLs in the sitemap, robots.txt, and social
// share previews (server-side only). Order: an explicit NEXT_PUBLIC_SITE_URL;
// then Vercel's production address (VERCEL_PROJECT_PRODUCTION_URL, set
// automatically at build time — it becomes the custom domain once one is
// connected in Vercel); then the brand domain. merkabanooks.com is still a
// parked registrar page, so without the Vercel fallback every shared link would
// show a broken preview image.
const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (vercelProductionUrl ? `https://${vercelProductionUrl}` : "https://merkabanooks.com")
).replace(/\/$/, "");
