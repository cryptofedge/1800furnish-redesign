import { NextResponse } from "next/server";
import { Resend } from "resend";
import { SITE_NAME } from "@/lib/site";
import { formatCurrency } from "@/lib/quote-data";

interface QuoteRequestBody {
  organization?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  notes?: string;
  roomLabel?: string;
  units?: number;
  estimateTotal?: number;
  /** Specific catalog item the buyer asked about (older single-item links). */
  product?: { slug?: string; name?: string; price?: number };
  /** The buyer's quote list: catalog items with quantities. */
  items?: { slug?: string; name?: string; price?: number; qty?: number }[];
}

/** Keep only well-formed list lines (the body comes from the browser). */
function cleanItems(items: QuoteRequestBody["items"]) {
  if (!Array.isArray(items)) return [];
  return items
    .filter((i) => i && typeof i.name === "string" && Number.isFinite(i.qty) && (i.qty ?? 0) > 0)
    .slice(0, 200)
    .map((i) => ({
      slug: String(i.slug ?? ""),
      name: String(i.name),
      price: typeof i.price === "number" && Number.isFinite(i.price) ? i.price : 0,
      qty: Math.min(99999, Math.round(i.qty as number)),
    }));
}

function itemsSummary(items: ReturnType<typeof cleanItems>): string {
  if (items.length === 0) return "—";
  return items.map((i) => `${i.name} × ${i.qty} (${formatCurrency(i.price)} / unit)`).join("; ");
}

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const NOTIFY_EMAIL = process.env.QUOTE_NOTIFICATION_EMAIL ?? "sales@merkabanooks.com";
const FROM_EMAIL = process.env.QUOTE_FROM_EMAIL ?? `${SITE_NAME} <onboarding@resend.dev>`;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildNotificationHtml(body: QuoteRequestBody, reference: string): string {
  const rows: [string, string][] = [
    ["Reference", reference],
    ["Organization", body.organization ?? ""],
    ["Contact", body.contactName ?? ""],
    ["Email", body.email ?? ""],
    ["Phone", body.phone || "—"],
    ["Room type", body.roomLabel ?? "—"],
    ["Units", body.units ? String(body.units) : "—"],
    ["Estimated total", body.estimateTotal ? formatCurrency(body.estimateTotal) : "—"],
    ["Quote list", itemsSummary(cleanItems(body.items))],
    [
      "Requested item",
      body.product?.name
        ? `${body.product.name}${typeof body.product.price === "number" ? ` (${formatCurrency(body.product.price)} / unit)` : ""}`
        : "—",
    ],
    ["Notes", body.notes || "—"],
  ];

  const rowsHtml = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 12px;color:#6b7280;font-size:13px;white-space:nowrap">${escapeHtml(
          label
        )}</td><td style="padding:6px 12px;font-size:14px;color:#111827">${escapeHtml(value)}</td></tr>`
    )
    .join("");

  return `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px">
      <h2 style="margin:0 0 12px">New quote request</h2>
      <table style="border-collapse:collapse;width:100%">${rowsHtml}</table>
    </div>
  `;
}

function buildConfirmationHtml(body: QuoteRequestBody, reference: string): string {
  return `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px">
      <h2 style="margin:0 0 12px">Thanks, ${escapeHtml(body.contactName ?? "")}.</h2>
      <p style="color:#374151;font-size:14px;line-height:1.5">
        We received your quote request${
          body.roomLabel
            ? ` for <strong>${escapeHtml(body.roomLabel)}</strong> (${escapeHtml(String(body.units ?? ""))} units, est. ${formatCurrency(body.estimateTotal ?? 0)})`
            : ""
        }${cleanItems(body.items).length ? `, including ${escapeHtml(itemsSummary(cleanItems(body.items)))}` : ""}. Reference <strong>${escapeHtml(reference)}</strong>.
      </p>
      <p style="color:#374151;font-size:14px;line-height:1.5">
        Our procurement team will follow up within one business day.
      </p>
      <p style="color:#9ca3af;font-size:12px">${escapeHtml(SITE_NAME)}</p>
    </div>
  `;
}

export async function POST(request: Request) {
  const body = (await request.json()) as QuoteRequestBody;

  if (!body.organization || !body.contactName || !body.email) {
    return NextResponse.json(
      { ok: false, error: "Missing required fields." },
      { status: 400 }
    );
  }

  const reference = `RFQ-${Date.now().toString(36).toUpperCase()}`;

  if (!resend) {
    // No RESEND_API_KEY yet — log instead of emailing so the form still
    // works end-to-end. Set RESEND_API_KEY (see .env.example) to switch
    // this over to real email delivery, no other code changes needed.
    console.log("[quote-request]", { reference, ...body });
    return NextResponse.json({ ok: true, reference });
  }

  const notification = await resend.emails.send({
    from: FROM_EMAIL,
    to: NOTIFY_EMAIL,
    replyTo: body.email,
    subject: `New quote request — ${body.organization} (${reference})`,
    html: buildNotificationHtml(body, reference),
  });

  if (notification.error) {
    console.error("[quote-request] Resend error:", notification.error);
    return NextResponse.json(
      { ok: false, error: "Failed to send quote request. Please try again." },
      { status: 502 }
    );
  }

  // Best-effort customer confirmation — failure here shouldn't fail the request,
  // the sales notification above already succeeded.
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: body.email,
      subject: `We received your quote request (${reference})`,
      html: buildConfirmationHtml(body, reference),
    });
  } catch (err) {
    console.error("[quote-request] confirmation email failed:", err);
  }

  return NextResponse.json({ ok: true, reference });
}
