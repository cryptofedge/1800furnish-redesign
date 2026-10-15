"use client";

import { useEffect, useState } from "react";
import { Check, ListPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { addToQuote, useQuoteList, type QuoteListProduct } from "@/lib/quote-list";

interface AddToQuoteButtonProps {
  product: QuoteListProduct;
  /** How many to add per click (product pages pass the chosen quantity). */
  qty?: number;
  /** "link" = small inline action on cards; "button" = full secondary button; "primary" = full primary button (product pages). */
  variant?: "link" | "button" | "primary";
  className?: string;
}

/** Adds a product to the buyer's quote list and confirms it in place. */
export function AddToQuoteButton({ product, qty = 1, variant = "link", className }: AddToQuoteButtonProps) {
  const list = useQuoteList();
  const inList = list.find((i) => i.slug === product.slug);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!justAdded) return;
    const t = window.setTimeout(() => setJustAdded(false), 1600);
    return () => window.clearTimeout(t);
  }, [justAdded]);

  function handleClick() {
    addToQuote(product, qty);
    setJustAdded(true);
  }

  const label = justAdded ? "Added to quote" : inList ? `Add more (${inList.qty} in quote)` : "Add to quote";
  const Icon = justAdded ? Check : ListPlus;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`${label}: ${product.name}`}
      className={cn(
        variant === "primary"
          ? "btn btn-primary w-full"
          : variant === "button"
          ? "btn btn-secondary w-full"
          : "inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-ink underline decoration-accent decoration-2 underline-offset-[3px] hover:text-accent-ink",
        className
      )}
    >
      <Icon className={cn("h-4 w-4 shrink-0", justAdded && "text-ok")} aria-hidden="true" />
      <span aria-live="polite">{label}</span>
    </button>
  );
}
