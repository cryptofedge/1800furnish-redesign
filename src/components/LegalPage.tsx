import type { ReactNode } from "react";

/** Shared frame for plain-text policy pages (privacy, terms). */
export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <main className="pt-[72px]">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-8 sm:py-16">
        <header className="section-rule pt-6">
          <h1 className="type-display text-5xl text-ink sm:text-6xl lg:text-7xl">{title}</h1>
          <p className="type-data mt-4 text-sm text-ink-2">Last updated {updated}</p>
        </header>
        <div className="mt-10 flex max-w-[68ch] flex-col gap-8 text-ink-2 [&_li]:ml-5 [&_li]:list-disc [&_p+p]:mt-3 [&_strong]:text-ink [&_ul]:mt-3 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2">
          {children}
        </div>
      </div>
    </main>
  );
}
