"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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

/** Numbered part heading for the order form ("01 Room type"). The order is real form order. */
function PartHeading({ n, children }: { n: number; children: ReactNode }) {
  return (
    <>
      <span className="type-data mr-2 text-sm text-ink-3">{String(n).padStart(2, "0")}</span>
      <span className="type-label">{children}</span>
    </>
  );
}

/** Selectable option row: hairline border; selected = ink border + orange bar along the bottom. */
function optionRowClass(selected: boolean) {
  return cn(
    "relative flex min-h-11 cursor-pointer items-start gap-3 border bg-well px-4 py-3 transition-colors duration-150",
    selected ? "border-ink" : "border-rule hover:border-ink-3"
  );
}

function SelectedBar({ show }: { show: boolean }) {
  if (!show) return null;
  return <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[3px] bg-accent" />;
}

export function QuoteCalculator({ catalog = [] }: QuoteCalculatorProps) {
  const [roomType, setRoomType] = useState<RoomTypeId>(ROOM_TYPES[0].id);
  const [units, setUnits] = useState(ROOM_TYPES[0].defaultUnits);
  const [grade, setGrade] = useState<GradeId>(BED_GRADES[0].id);
  const [addons, setAddons] = useState<AddonId[]>(["linens"]);
  const [modalOpen, setModalOpen] = useState(false);
  const [requestedProduct, setRequestedProduct] = useState<QuoteProductRef | null>(null);
  const unitsId = useId();

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
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-8 sm:py-24">
      <header className="section-rule grid gap-6 pt-6 md:grid-cols-[1fr_minmax(0,26rem)] md:items-end">
        <h2 className="type-display text-4xl text-ink sm:text-5xl lg:text-6xl">
          Spec a facility, get a number in seconds.
        </h2>
        <p className="max-w-[62ch] text-ink-2">
          Facility package calculator. Built for bulk institutional buyers. Select a room type, scale to your
          unit count, and get a real-time estimate you can turn into a formal RFQ.
        </p>
      </header>

      {requestedProduct && (
        <div className="mt-8 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-y border-rule border-l-[3px] border-l-ink bg-well py-2 pl-4 pr-2">
          <p className="flex min-w-0 items-start gap-2 text-sm text-ink">
            <Box className="mt-0.5 h-4 w-4 shrink-0 text-ink-3" aria-hidden="true" />
            <span>
              <span className="type-label mr-2">Requested item</span>
              <strong className="font-semibold">{requestedProduct.name}</strong>
              <span className="text-ink-2">
                {" · "}
                <span className="type-data">{formatCurrency(requestedProduct.price)}</span> / unit
              </span>
            </span>
          </p>
          <button
            type="button"
            onClick={() => setRequestedProduct(null)}
            className="btn-tool min-h-11"
          >
            Remove
          </button>
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
        {/* Order form: numbered parts in real form order. */}
        <div className="panel divide-y divide-rule">
          <fieldset className="p-5 sm:p-6">
            <legend className="float-left mb-4 w-full">
              <PartHeading n={1}>Room type</PartHeading>
            </legend>
            <div className="clear-both grid gap-2 sm:grid-cols-2">
              {ROOM_TYPES.map((room) => {
                const selected = roomType === room.id;
                return (
                  <label key={room.id} className={optionRowClass(selected)}>
                    <input
                      type="radio"
                      name="roomType"
                      value={room.id}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-accent"
                      checked={selected}
                      onChange={() => handleRoomTypeChange(room.id)}
                    />
                    <span>
                      <span className="block text-sm font-semibold text-ink">{room.label}</span>
                      <span className="mt-1 block text-xs text-ink-2">{room.description}</span>
                    </span>
                    <SelectedBar show={selected} />
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="p-5 sm:p-6">
            <div className="flex items-baseline justify-between gap-4">
              <label htmlFor={unitsId}>
                <PartHeading n={2}>Unit count</PartHeading>
              </label>
              <output htmlFor={unitsId} className="type-data text-2xl font-medium text-ink">
                {units}
              </output>
            </div>
            <input
              id={unitsId}
              type="range"
              min={1}
              max={activeRoomType.maxUnits}
              value={units}
              onChange={(e) => setUnits(Number(e.target.value))}
              className="mt-2 h-11 w-full cursor-pointer accent-accent"
            />
            <div className="type-data flex justify-between text-xs text-ink-3">
              <span>1</span>
              <span>{activeRoomType.maxUnits} units</span>
            </div>
          </div>

          <fieldset className="p-5 sm:p-6">
            <legend className="float-left mb-4 w-full">
              <PartHeading n={3}>Mattress / furniture grade</PartHeading>
            </legend>
            <div className="clear-both flex flex-col gap-2">
              {BED_GRADES.map((g) => {
                const selected = grade === g.id;
                return (
                  <label key={g.id} className={optionRowClass(selected)}>
                    <input
                      type="radio"
                      name="grade"
                      value={g.id}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-accent"
                      checked={selected}
                      onChange={() => setGrade(g.id)}
                    />
                    <span>
                      <span className="block text-sm font-semibold text-ink">{g.label}</span>
                      <span className="mt-1 block text-xs text-ink-2">{g.description}</span>
                    </span>
                    <SelectedBar show={selected} />
                  </label>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="p-5 sm:p-6">
            <legend className="float-left mb-4 w-full">
              <PartHeading n={4}>Add-on kits</PartHeading>
            </legend>
            <div className="clear-both grid gap-2 sm:grid-cols-3">
              {ADDON_KITS.map((kit) => {
                const selected = addons.includes(kit.id);
                return (
                  <label key={kit.id} className={optionRowClass(selected)}>
                    <input
                      type="checkbox"
                      className="mt-0.5 h-4 w-4 shrink-0 accent-accent"
                      checked={selected}
                      onChange={() => toggleAddon(kit.id)}
                    />
                    <span>
                      <span className="block text-sm font-semibold text-ink">{kit.label}</span>
                      <span className="mt-1 block text-xs text-ink-2">{kit.description}</span>
                    </span>
                    <SelectedBar show={selected} />
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>

        {/* Spec sheet / estimate */}
        <aside className="panel flex flex-col lg:sticky lg:top-24">
          <div className="flex items-center gap-2 border-b border-ink px-5 py-4 sm:px-6">
            <FileText className="h-4 w-4 text-ink-3" aria-hidden="true" />
            <h3 className="type-label text-ink">Estimated spec sheet</h3>
          </div>

          <div className="px-5 sm:px-6">
            <table className="w-full border-collapse text-sm">
              <caption className="sr-only">Estimate line items</caption>
              <thead>
                <tr className="border-b border-rule">
                  <th scope="col" className="type-label py-2 pr-3 text-left font-bold">
                    Item
                  </th>
                  <th scope="col" className="type-label py-2 pr-3 text-right font-bold">
                    Qty
                  </th>
                  <th scope="col" className="type-label py-2 text-right font-bold">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {estimate.lineItems.map((item) => (
                  <tr key={item.label} className="border-b border-rule align-top">
                    <td className="py-2.5 pr-3 text-ink-2">{item.label}</td>
                    <td className="type-data py-2.5 pr-3 text-right text-ink-2">{item.quantity}</td>
                    <td className="type-data whitespace-nowrap py-2.5 text-right text-ink">
                      {formatCurrency(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row" colSpan={2} className="pb-1 pr-3 pt-3 text-left font-normal text-ink-2">
                    Subtotal
                  </th>
                  <td className="type-data whitespace-nowrap pb-1 pt-3 text-right text-ink">
                    {formatCurrency(estimate.subtotal)}
                  </td>
                </tr>
                {estimate.volumeDiscountRate > 0 && (
                  <tr>
                    <th scope="row" colSpan={2} className="py-1 pr-3 text-left font-normal text-ink-2">
                      Volume discount (
                      <span className="type-data">{Math.round(estimate.volumeDiscountRate * 100)}%</span>)
                    </th>
                    <td className="type-data whitespace-nowrap py-1 text-right text-ink">
                      -{formatCurrency(estimate.volumeDiscount)}
                    </td>
                  </tr>
                )}
              </tfoot>
            </table>
          </div>

          <div className="mx-5 mt-3 border-t-2 border-ink pt-3 sm:mx-6">
            <p className="type-label">Estimated total</p>
            <p className="type-data mt-1 break-words text-4xl font-medium leading-tight text-ink">
              {formatCurrency(estimate.estimatedTotal)}
            </p>
          </div>

          <div className="flex flex-col gap-3 p-5 sm:p-6">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="btn btn-primary w-full"
            >
              Request this quote
            </button>
            <p className="text-xs text-ink-3">
              Estimate only. Final pricing confirmed by our procurement team.
            </p>
          </div>
        </aside>
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
  const fieldId = useId();
  const reduceMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const successHeadingRef = useRef<HTMLParagraphElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // On open: focus the first field, close on Escape; on close: restore focus to the trigger.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    firstFieldRef.current?.focus();
    function onKeyDown(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, []);

  // The form (and its focused submit button) unmounts on success; move focus to the confirmation.
  useEffect(() => {
    if (status === "success") successHeadingRef.current?.focus();
  }, [status]);

  // Keep Tab / Shift+Tab inside the dialog while it is open.
  function handleTrapKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "Tab" || !dialogRef.current) return;
    const focusable = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || !dialogRef.current.contains(active))) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && (active === last || !dialogRef.current.contains(active))) {
      e.preventDefault();
      first.focus();
    }
  }

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-mist/90 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      onClick={onClose}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={status === "success" ? `${fieldId}-success` : `${fieldId}-title`}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleTrapKeyDown}
        className="panel relative max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto border-ink p-5 sm:p-8"
        initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
        <button
          type="button"
          onClick={onClose}
          className="btn-tool absolute right-3 top-3 h-11 w-11"
          aria-label="Close"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        {status === "success" ? (
          <div className="flex flex-col items-start gap-3 py-4 pr-12" role="status">
            <CheckCircle2 className="h-8 w-8 text-ok" aria-hidden="true" />
            <p
              ref={successHeadingRef}
              id={`${fieldId}-success`}
              tabIndex={-1}
              className="type-display text-3xl text-ink"
            >
              Quote request sent
            </p>
            <p className="text-sm text-ink-2">
              Our procurement team will follow up within one business day.
            </p>
            <button type="button" onClick={onClose} className="btn btn-secondary mt-2">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="section-rule mr-12 pt-3">
              <h3 id={`${fieldId}-title`} className="type-display text-3xl text-ink">
                Instant quote request
              </h3>
              <p className="type-data mt-2 text-sm text-ink-2">
                {roomLabel} · {units} units · Est. {formatCurrency(estimateTotal)}
              </p>
              {requestedProduct && (
                <p className="mt-2 border-l-[3px] border-ink pl-2 text-xs text-ink">
                  + Requested item: <span className="font-semibold">{requestedProduct.name}</span>
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor={`${fieldId}-org`} className="type-label">
                Organization name
              </label>
              <input
                ref={firstFieldRef}
                id={`${fieldId}-org`}
                name="organization"
                required
                autoComplete="organization"
                className="field"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor={`${fieldId}-contact`} className="type-label">
                Contact name
              </label>
              <input
                id={`${fieldId}-contact`}
                name="contactName"
                required
                autoComplete="name"
                className="field"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`${fieldId}-email`} className="type-label">
                  Email
                </label>
                <input
                  id={`${fieldId}-email`}
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="field"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`${fieldId}-phone`} className="type-label">
                  Phone
                </label>
                <input
                  id={`${fieldId}-phone`}
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  className="field"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor={`${fieldId}-notes`} className="type-label">
                Notes
              </label>
              <textarea
                id={`${fieldId}-notes`}
                name="notes"
                placeholder="Delivery timeline, site details, or special requirements"
                defaultValue={requestedProduct ? `Interested in: ${requestedProduct.name}. ` : ""}
                rows={3}
                className="field"
              />
            </div>

            {status === "error" && (
              <p role="alert" className="border-l-[3px] border-danger pl-2 text-sm text-danger">
                {errorMessage || "Something went wrong. Please try again or email us directly."}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="btn btn-primary mt-1 w-full"
            >
              {status === "submitting" && (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              )}
              Send request
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}
