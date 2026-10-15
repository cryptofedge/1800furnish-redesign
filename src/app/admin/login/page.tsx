"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { login, type LoginState } from "../actions";
import { SITE_NAME } from "@/lib/site";

const initialState: LoginState = {};

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="section-rule flex items-baseline justify-between gap-3 pt-4">
          <p className="type-display text-3xl text-ink">{SITE_NAME}</p>
          <p className="type-label">Admin</p>
        </div>

        <div className="panel mt-6 p-6 sm:p-8">
          <h1 className="text-lg font-semibold text-ink">Staff sign-in</h1>

          <form action={formAction} className="mt-6 flex flex-col gap-5">
            <div>
              <label htmlFor="email" className="type-label mb-1.5 block">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="username"
                className="field"
              />
            </div>

            <div>
              <label htmlFor="password" className="type-label mb-1.5 block">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="field"
              />
            </div>

            {state.error && (
              <p role="alert" className="border border-danger px-3 py-2 text-sm text-danger">
                {state.error}
              </p>
            )}

            <button type="submit" disabled={pending} className="btn btn-primary mt-1 w-full">
              {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              Sign in
            </button>
          </form>
        </div>

        <p className="mt-4 text-xs text-ink-3">
          Accounts are created by an admin in the Supabase dashboard — there&apos;s
          no public sign-up.
        </p>
      </div>
    </div>
  );
}
