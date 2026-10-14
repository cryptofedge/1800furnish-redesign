import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";

// Staff-only area: give it its own tab title and keep it out of search results.
export const metadata: Metadata = {
  title: `Admin | ${SITE_NAME}`,
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
