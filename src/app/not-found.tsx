import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-1 flex-col bg-paper">
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 py-16 sm:px-8 sm:py-24">
        <div className="section-rule pt-6">
          <p className="type-display text-[8rem] text-ink sm:text-[12rem] lg:text-[16rem]" aria-hidden="true">
            404
          </p>
          <h1 className="mt-6 max-w-[30ch] text-2xl font-semibold text-ink sm:text-3xl">
            <span className="sr-only">Error 404: </span>
            This room hasn&apos;t been furnished yet.
          </h1>
          <p className="mt-4 max-w-[62ch] text-ink-2">
            The page you&apos;re looking for doesn&apos;t exist or has moved. Try the catalog, or head back home.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/" className="btn btn-primary">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back home
            </Link>
            <Link href="/categories" className="btn btn-secondary">
              Browse the catalog
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
