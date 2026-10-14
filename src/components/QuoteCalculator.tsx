"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, FileText, Loader2, CheckCircle2, Box } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ADDON_KITS,
  BED_GRADES,
  ROOM_TYPES,
  calculateEstimate,
  formatCurrency,
  type AddonId,
  type GradeId,
  type RoomTypeId,
} from "@/lib/quote-data";

/** Minimal product info the calculator needs to attach a requested item to an RFQ. */
export interface QuoteProductRef {
  slug: string;
  name: string;
  price: number;
}

interface QuoteCalculatorProps {
  /** Flat catalog so `/?product=<slug>#quote` (from the 360° viewer) can preselect an item. */
  catalog?: QuoteProductRef[];
}

export function QuoteCalculator({ catalog = [] }: QuoteCalculatorProps) {
  const [roomType, setRoomType] = useState<RoomTypeId>(ROOM_TYPES[0].id);
  const [units, setUnits] = useState(ROOM_TYPES[0].defaultUnits);
  const [grade, setGrade] = useState<GradeId>(BED_GRADES[0].id);
  const [addons, setAddons] = useState<AddonId[]>(["linens"]);
  const [modalOpen, setModalOpen] = useState(false);
  const [requestedProduct, setRequestedProduct] = useState<QuoteProductRef | null>(null);

  // Read `?product=` once on the client (window isn't available during prerender).
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("product");
    if (!slug) return;
    const match = catalog.find((p) => p.slug === slug);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (match) setRequestedProduct(match);
  }, [catalog]);

  const activeRoomType = ROOM_TYPES.find((r) => r.id === roomType)!;

  const estimate = useMemo(
    () => calculateEstimate({ roomType, units, grade, addons }),
    [roomType, units, grade, addons]
  );

  function toggleAddon(id: AddonId) {
    setAddons((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));
  }

  function handleRoomTypeChange(id: RoomTypeId) {
    setRoomType(id);
    const next = ROOM_TYPES.find((r) => r.id === id)!;
    setUnits(next.defaultUnits);
  }

  return (
    <section className="relative mx-auto w-full max-w-7xl px-6 py-24 sm:px-10">
      <div className="mb-10 flex flex-col gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
          Facility Package Calculator
        </span>
        <h2 className="font-display text-3xl font-medium text-slate-200 sm:text-4xl">
          Spec a facility, get a number in seconds.
        </h2>
        <p className="max-w-2xl text-slate-400">
          Built for bulk institutional buyers. Select a room type, scale to your
          unit count, and get a real-time estimate you can turn into a formal RFQ.
        </p>
      </div>

      {requestedProduct && (
        <div className="glass-pill mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl px-5 py-3">
          <p className="flex items-center gap-2 text-sm text-slate-200">
            <Box className="h-4 w-4 text-amber-400" />
            <span>
              Requested item: <strong>{requestedProduct.name}</strong>
              <span className="text-slate-400"> · {formatCurrency(requestedProduct.price)} / unit</span>
            </span>
          </p>
          <button
            onClick={() => setRequestedProduct(null)}
            className="text-xs text-slate-400 underline-offset-2 hover:text-slate-200 hover:underline"
          >
            Remove
          </button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="glass-panel flex flex-col gap-8 rounded-2xl p-6 sm:p-8">
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-200">
              Room Type
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {ROOM_TYPES.map((room) => (
                <button
                  key={room.id}
                  onClick={() => handleRoomTypeChange(room.id)}
                  className={cn(
                    "rounded-xl border px-4 py-3 text-left transition-colors",
                    roomType === room.id
                      ? "border-amber-400/50 bg-amber-400/10"
                      : "border-slate-200/10 hover:border-slate-200/30"
                  )}
                >
                  <p className="text-sm font-semibold text-slate-200">{room.label}</p>
                  <p className="mt-1 text-xs text-slate-400">{room.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
                Unit Count
              </h3>
              <span className="font-display text-xl text-amber-300">{units}</span>
            </div>
            <input
              type="range"
              min={1}
              max={activeRoomType.maxUnits}
              value={units}
              onChange={(e) => setUnits(Number(e.target.value))}
              className="w-full accent-amber-400"
            />
            <div className="mt-1 flex justify-between text-xs text-slate-500">
              <span>1</span>
              <span>{activeRoomType.maxUnits} units</span>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-200">
              Mattress / Furniture Grade
            </h3>
            <div className="flex flex-col gap-2">
              {BED_GRADES.map((g) => (
                <label
                  key={g.id}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition-colors",
                    grade === g.id
                      ? "border-amber-400/50 bg-amber-400/10"
                      : "border-slate-200/10 hover:border-slate-200/30"
                  )}
                >
                  <input
                    type="radio"
                    name="grade"
                    className="mt-1 accent-amber-400"
                    checked={grade === g.id}
                    onChange={() => setGrade(g.id)}
                  />
                  <span>
                    <span className="block text-sm font-semibold text-slate-200">
                      {g.label}
                    </span>
                    <span className="block text-xs text-slate-400">{g.description}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-200">
              Add-On Kits
            </h3>
            <div className="grid gap-2 sm:grid-cols-3">
              {ADDON_KITS.map((kit) => (
                <label
                  key={kit.id}
                  className={cn(
                    "flex cursor-pointer flex-col gap-1 rounded-xl border px-4 py-3 transition-colors",
                    addons.includes(kit.id)
                      ? "border-amber-400/50 bg-amber-400/10"
                      : "border-slate-200/10 hover:border-slate-200/30"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="accent-amber-400"
                      checked={addons.includes(kit.id)}
                      onChange={() => toggleAddon(kit.id)}
                    />
                    <span className="text-sm font-semibold text-slate-200">{kit.label}</span>
                  </span>
                  <span className="text-xs text-slate-400">{kit.description}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-panel flex flex-col gap-5 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-2 text-slate-200">
            <FileText className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-semibold uppercase tracking-wide">Estimated Spec Sheet</h3>
          </div>

          <ul className="flex flex-col gap-2 text-sm">
            {estimate.lineItems.map((item) => (
              <li key={item.label} className="flex items-start justify-between gap-3 text-slate-400">
                <span>
                  {item.label}
                  <span className="text-slate-500"> × {item.quantity}</span>
                </span>
                <span className="shrink-0 text-slate-200">{formatCurrency(item.total)}</span>
              </li>
            ))}
          </ul>

          <div className="border-t border-slate-200/10 pt-4 text-sm">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal</span>
              <span>{formatCurrency(estimate.subtotal)}</span>
            </div>
            {estimate.volumeDiscountRate > 0 && (
              <div className="mt-1 flex justify-between text-amber-300">
                <span>Volume discount ({Math.round(estimate.volumeDiscountRate * 100)}%)</span>
                <span>-{formatCurrency(estimate.volumeDiscount)}</span>
              </div>
            )}
          </div>

          <div className="border-t border-slate-200/10 pt-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Estimated Total</p>
            <p className="font-display text-3xl text-amber-300">
              {formatCurrency(estimate.estimatedTotal)}
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="btn-gradient-border mt-2 rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-charcoal-950 transition-colors hover:bg-amber-400"
          >
            Request This Quote
          </button>
          <p className="text-center text-xs text-slate-500">
            Estimate only. Final pricing confirmed by our procurement team.
          </p>
        </div>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <QuoteModal
            roomLabel={activeRoomType.label}
            units={units}
            estimateTotal={estimate.estimatedTotal}
            requestedProduct={requestedProduct}
            onClose={() => setModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function QuoteModal({
  roomLabel,
  units,
  estimateTotal,
  requestedProduct,
  onClose,
}: {
  roomLabel: string;
  units: number;
  estimateTotal: number;
  requestedProduct: QuoteProductRef | null;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organization: formData.get("organization"),
          contactName: formData.get("contactName"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          notes: formData.get("notes"),
          roomLabel,
          units,
          estimateTotal,
          product: requestedProduct ?? undefined,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error || "Request failed");
      }
      setStatus("success");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-950/80 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="glass-panel relative w-full max-w-md rounded-2xl p-6 sm:p-8"
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-500 hover:text-slate-200"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {status === "success" ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2 className="h-10 w-10 text-amber-400" />
            <p className="text-lg font-semibold text-slate-200">Quote request sent</p>
            <p className="text-sm text-slate-400">
              Our procurement team will follow up within one business day.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <h3 className="font-display text-xl text-slate-200">Instant Quote Request</h3>
              <p className="mt-1 text-sm text-slate-400">
                {roomLabel} · {units} units · Est. {formatCurrency(estimateTotal)}
              </p>
              {requestedProduct && (
                <p className="mt-1 text-xs text-amber-300">
                  + Requested item: {requestedProduct.name}
                </p>
              )}
            </div>

            <input
              name="organization"
              required
              placeholder="Organization name"
              className="rounded-lg border border-slate-200/15 bg-charcoal-900/60 px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:border-amber-400/50 focus:outline-none"
            />
            <input
              name="contactName"
              required
              placeholder="Contact name"
              className="rounded-lg border border-slate-200/15 bg-charcoal-900/60 px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:border-amber-400/50 focus:outline-none"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                name="email"
                type="email"
                required
                placeholder="Email"
                className="rounded-lg border border-slate-200/15 bg-charcoal-900/60 px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:border-amber-400/50 focus:outline-none"
              />
              <input
                name="phone"
                placeholder="Phone"
                className="rounded-lg border border-slate-200/15 bg-charcoal-900/60 px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:border-amber-400/50 focus:outline-none"
              />
            </div>
            <textarea
              name="notes"
              placeholder="Delivery timeline, site details, or special requirements"
              defaultValue={requestedProduct ? `Interested in: ${requestedProduct.name}. ` : ""}
              rows={3}
              className="rounded-lg border border-slate-200/15 bg-charcoal-900/60 px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:border-amber-400/50 focus:outline-none"
            />

            {status === "error" && (
              <p className="text-sm text-red-400">
                {errorMessage || "Something went wrong. Please try again or email us directly."}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="btn-gradient-border mt-1 flex items-center justify-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-charcoal-950 transition-colors hover:bg-amber-400 disabled:opacity-60"
            >
              {status === "submitting" && <Loader2 className="h-4 w-4 animate-spin" />}
              Send Request
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}
