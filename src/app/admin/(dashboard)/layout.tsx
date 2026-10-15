import Link from "next/link";
import { LogOut } from "lucide-react";
import { logout } from "../actions";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-ink bg-paper">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-3 sm:px-8">
          <Link href="/admin" className="flex min-h-11 items-baseline gap-2 text-ink">
            <span className="type-display text-2xl leading-none sm:text-[1.75rem]">Merkabanooks</span>
            <span className="type-label">Admin</span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-5">
            <Link href="/" target="_blank" className="link inline-flex min-h-11 items-center text-sm">
              View site
            </Link>
            <form action={logout}>
              <button type="submit" aria-label="Log out" className="btn-tool min-h-11 min-w-11">
                <LogOut className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Log out</span>
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-8">{children}</main>
    </div>
  );
}
