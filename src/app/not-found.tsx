import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-charcoal-950 px-6 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">404</p>
      <h1 className="mt-4 font-display text-4xl font-semibold text-slate-200 sm:text-5xl">
        This room hasn&apos;t been furnished yet.
      </h1>
      <p className="mt-4 max-w-md text-slate-400">
        The page you&apos;re looking for doesn&apos;t exist or has moved. Try the catalog, or head back home.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-charcoal-950 transition-colors hover:bg-amber-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back home
        </Link>
        <Link
          href="/categories"
          className="rounded-full border border-slate-200/15 px-5 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:border-slate-200/30"
        >
          Browse the catalog
        </Link>
      </div>
    </main>
  );
}
