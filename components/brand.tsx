import Link from "next/link";
import { cn } from "@/lib/utils";

export function Brand({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label="Serampore Rooms home"
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[0.95rem] bg-ink text-cream transition-transform duration-300 group-hover:-rotate-3">
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3.5 10.3 12 3.5l8.5 6.8" />
          <path d="M5.5 9.3v10.2h13V9.3" />
          <path d="M10 19.5v-5.2h4v5.2" />
        </svg>
        <span className="absolute bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-butter" />
      </span>
      {!compact && (
        <span className="flex flex-col justify-center">
          <span className="font-display text-[1.16rem] leading-none font-semibold tracking-[-0.02em] text-ink">
            Serampore
          </span>
          <span className="mt-1 text-[0.58rem] leading-none font-bold tracking-[0.28em] text-ink-soft uppercase">
            Rooms
          </span>
        </span>
      )}
    </Link>
  );
}
