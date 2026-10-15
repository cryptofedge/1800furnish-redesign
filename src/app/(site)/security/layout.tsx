// Clears the fixed 72px SiteHeader (security pages have no CategoryNav) and
// gives these routes a main landmark, matching categories/layout.tsx.
export default function SecurityLayout({ children }: { children: React.ReactNode }) {
  return <main className="pt-[72px]">{children}</main>;
}
