"use client";

import { useSyncExternalStore } from "react";

/**
 * The buyer's quote list: products and quantities collected while browsing,
 * sent together as one request. Kept in this browser only (localStorage), so
 * nothing leaves the device until the buyer submits the quote form.
 */
export interface QuoteListItem {
  slug: string;
  name: string;
  price: number;
  image: string;
  qty: number;
}

export type QuoteListProduct = Omit<QuoteListItem, "qty">;

const STORAGE_KEY = "merkabanooks.quote-list.v1";
const MAX_QTY = 9999;
const EMPTY: QuoteListItem[] = [];

let items: QuoteListItem[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as QuoteListItem[]) : [];
    if (Array.isArray(parsed)) {
      items = parsed.filter((i) => i && typeof i.slug === "string" && Number.isFinite(i.qty) && i.qty > 0);
    }
  } catch {
    // Storage blocked or corrupt: start empty, the list still works in memory.
  }
}

function commit(next: QuoteListItem[]) {
  items = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Private mode / blocked storage: keep the in-memory list.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  load();
  listeners.add(listener);
  // Another tab changed the list.
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    loaded = false;
    load();
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  load();
  return items;
}

/** Current quote list; empty during server rendering. */
export function useQuoteList(): QuoteListItem[] {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
}

const clampQty = (qty: number) => Math.max(1, Math.min(MAX_QTY, Math.round(qty)));

export function addToQuote(product: QuoteListProduct, qty = 1) {
  load();
  const existing = items.find((i) => i.slug === product.slug);
  commit(
    existing
      ? items.map((i) => (i.slug === product.slug ? { ...i, qty: clampQty(i.qty + qty) } : i))
      : [...items, { ...product, qty: clampQty(qty) }]
  );
  window.dispatchEvent(new CustomEvent(QUOTE_LIST_ADDED_EVENT, { detail: product.slug }));
}

/** Add with quantity 1 unless already listed (links like `/?product=slug` may be reloaded). */
export function ensureInQuote(product: QuoteListProduct) {
  load();
  if (items.some((i) => i.slug === product.slug)) return;
  addToQuote(product, 1);
}

export function setQuoteQty(slug: string, qty: number) {
  load();
  commit(items.map((i) => (i.slug === slug ? { ...i, qty: clampQty(qty) } : i)));
}

export function removeFromQuote(slug: string) {
  load();
  commit(items.filter((i) => i.slug !== slug));
}

export function clearQuote() {
  commit([]);
}

/** Fired after an item is added (the header listens to pulse its counter). */
export const QUOTE_LIST_ADDED_EVENT = "quote-list:added";
/** Fire to open the quote-list drawer from anywhere. */
export const QUOTE_LIST_OPEN_EVENT = "quote-list:open";

export function openQuoteList() {
  window.dispatchEvent(new Event(QUOTE_LIST_OPEN_EVENT));
}

export function quoteListTotals(list: QuoteListItem[]) {
  return {
    lines: list.length,
    units: list.reduce((n, i) => n + i.qty, 0),
    subtotal: list.reduce((n, i) => n + i.qty * i.price, 0),
  };
}
