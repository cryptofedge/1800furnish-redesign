"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ClipboardList, Minus, Plus, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/quote-data";
import {
  QUOTE_LIST_ADDED_EVENT,
  QUOTE_LIST_OPEN_EVENT,
  clearQuote,
  quoteListTotals,
  removeFromQuote,
  setQuoteQty,
  useQuoteList,
} from "@/lib/quote-list";

/**
 * Header control for the quote list: a counter button that opens a side
 * drawer where the buyer adjusts quantities and sends everything as one
 * request (it opens the home-page quote form with the list attached).
 */
export function QuoteListDrawer({ className }: { className?: string }) {
  const list = useQuoteList();
  const { lines, units, subtotal } = quoteListTotals(list);
  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(false);
  const reduceMotion = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Open on request from anywhere (e.g. the quote form's "Edit list").
  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onAdded = () => setPulse(true);
    window.addEventListener(QUOTE_LIST_OPEN_EVENT, onOpen);
    window.addEventListener(QUOTE_LIST_ADDED_EVENT, onAdded);
    return () => {
      window.removeEventListener(QUOTE_LIST_OPEN_EVENT, onOpen);
      window.removeEventListener(QUOTE_LIST_ADDED_EVENT, onAdded);
    };
  }, []);

  useEffect(() => {
    if (!pulse) return;
    const t = window.setTimeout(() => setPulse(false), 600);
    return () => window.clearTimeout(t);
  }, [pulse]);

  // While open: lock page scroll, focus the close button, Esc closes, focus returns on close.
  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      trigger?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Quote list, ${lines} item${lines === 1 ? "" : "s"}`}
        className={cn("btn-tool relative h-11 min-w-11 gap-2 px-3", pulse && "animate-[quote-pulse_0.6s_ease-out]", className)}
      >
        <ClipboardList className="h-5 w-5" aria-hidden="true" />
        <span className="hidden text-sm font-semibold xl:inline">Quote list</span>
        {lines > 0 && (
          <span className="type-data absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center border border-ink bg-accent px-1 text-[11px] font-medium text-ink">
            {lines}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div className="absolute inset-0 bg-mist/85" onClick={() => setOpen(false)} aria-hidden="true" />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Quote list"
              initial={{ x: reduceMotion ? 0 : 40, opacity: reduceMotion ? 1 : 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: reduceMotion ? 0 : 40, opacity: reduceMotion ? 1 : 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l-2 border-ink bg-well"
              style={{ paddingTop: "env(safe-area-inset-top, 0px)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
            >
              <div className="flex items-start justify-between gap-4 border-b border-rule p-5">
                <div>
                  <p className="type-display text-3xl text-ink">Quote list</p>
                  <p className="type-data mt-1 text-xs text-ink-2">
                    {lines} item{lines === 1 ? "" : "s"} · {units} unit{units === 1 ? "" : "s"}
                  </p>
                </div>
                <button ref={closeRef} type="button" onClick={() => setOpen(false)} aria-label="Close quote list" className="btn-tool h-11 w-11 p-0">
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              {list.length === 0 ? (
                <div className="flex flex-1 flex-col items-start gap-3 p-5">
                  <p className="font-semibold text-ink">Your quote list is empty.</p>
                  <p className="text-sm text-ink-2">
                    Use “Add to quote” on any product, set quantities here, and send everything as one request.
                  </p>
                  <Link href="/categories" onClick={() => setOpen(false)} className="btn btn-secondary mt-2">
                    Browse the catalog
                  </Link>
                </div>
              ) : (
                <>
                  <ul className="flex-1 divide-y divide-rule overflow-y-auto">
                    {list.map((item) => (
                      <li key={item.slug} className="flex gap-3 p-4">
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={() => setOpen(false)}
                          className="relative h-20 w-20 shrink-0 border border-rule bg-studio"
                        >
                          <Image src={item.image} alt="" fill sizes="80px" className="object-contain p-1.5 mix-blend-multiply" />
                        </Link>
                        <div className="flex min-w-0 flex-1 flex-col gap-2">
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              href={`/products/${item.slug}`}
                              onClick={() => setOpen(false)}
                              className="text-sm font-semibold leading-snug text-ink hover:text-accent-ink"
                            >
                              {item.name}
                            </Link>
                            <button
                              type="button"
                              onClick={() => removeFromQuote(item.slug)}
                              aria-label={`Remove ${item.name}`}
                              className="btn-tool h-9 w-9 shrink-0 p-0"
                            >
                              <Trash2 className="h-4 w-4" aria-hidden="true" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <QtyStepper qty={item.qty} name={item.name} onChange={(q) => setQuoteQty(item.slug, q)} />
                            <span className="type-data text-sm text-ink">{formatCurrency(item.price * item.qty)}</span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-col gap-3 border-t-2 border-ink p-5">
                    <div className="flex items-baseline justify-between">
                      <span className="type-label">Estimated subtotal</span>
                      <span className="type-data text-2xl font-medium text-ink">{formatCurrency(subtotal)}</span>
                    </div>
                    <p className="text-xs text-ink-3">List prices per unit. Bulk pricing and delivery are confirmed in your quote.</p>
                    <Link href="/?list=1#quote" onClick={() => setOpen(false)} className="btn btn-primary w-full">
                      Request a quote for these items
                    </Link>
                    <button type="button" onClick={clearQuote} className="self-start text-sm font-semibold text-ink-2 underline underline-offset-[3px] hover:text-ink">
                      Clear list
                    </button>
                  </div>
                </>
              )}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/** − [qty] + control; typing a number works too. */
export function QtyStepper({ qty, name, onChange }: { qty: number; name: string; onChange: (qty: number) => void }) {
  return (
    <div className="flex items-stretch" role="group" aria-label={`Quantity for ${name}`}>
      <button
        type="button"
        onClick={() => onChange(qty - 1)}
        disabled={qty <= 1}
        aria-label="Decrease quantity"
        className="btn-tool h-9 w-9 p-0"
      >
        <Minus className="h-4 w-4" aria-hidden="true" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={1}
        max={9999}
        value={qty}
        onChange={(e) => {
          const n = Number(e.target.value);
          if (Number.isFinite(n) && n >= 1) onChange(n);
        }}
        aria-label="Quantity"
        className="type-data h-9 w-16 border-y border-rule bg-well text-center text-sm text-ink [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button type="button" onClick={() => onChange(qty + 1)} aria-label="Increase quantity" className="btn-tool h-9 w-9 p-0">
        <Plus className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
