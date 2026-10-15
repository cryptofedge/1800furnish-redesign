import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface NooksguardButtonProps {
  /** Visible text. Ignored when iconOnly. */
  label?: string;
  /** md fits the 72px header; lg is for page sections and the phone menu. */
  size?: "md" | "lg";
  /** Square emblem-only button (phones, tight headers). */
  iconOnly?: boolean;
  className?: string;
  onClick?: () => void;
}

/**
 * Link to the Nooksguard security catalog, branded with the Nooksguard emblem
 * as a tile flush against the left edge (see .btn-badge in globals.css).
 */
export function NooksguardButton({
  label = "Nooksguard",
  size = "md",
  iconOnly = false,
  className,
  onClick,
}: NooksguardButtonProps) {
  const tile = size === "lg" ? "h-[52px] w-[52px]" : "h-10 w-10";
  return (
    <Link
      href="/security"
      onClick={onClick}
      aria-label={iconOnly ? "Nooksguard Security Solutions" : undefined}
      className={cn(
        "btn btn-badge",
        size === "lg" && "min-h-14 text-base",
        iconOnly ? "h-11 w-11 min-w-11 p-0" : "pr-4",
        className
      )}
    >
      <Image
        src="/nooksguard/emblem.webp"
        alt=""
        width={104}
        height={104}
        className={cn(tile, "shrink-0 object-cover", !iconOnly && "border-r-2 border-ink")}
      />
      {!iconOnly && (
        <>
          <span>{label}</span>
          {size === "lg" && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
        </>
      )}
    </Link>
  );
}
