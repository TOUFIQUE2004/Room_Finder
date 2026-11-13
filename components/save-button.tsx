"use client";

import { Heart } from "lucide-react";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

const FAVORITES_EVENT = "serampore:favorites";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(FAVORITES_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(FAVORITES_EVENT, callback);
  };
}

function readSaved(storageKey: string): boolean {
  try {
    return window.localStorage.getItem(storageKey) === "true";
  } catch {
    return false;
  }
}

export function SaveButton({
  listingId,
  className,
  expanded = false,
}: {
  listingId: string;
  className?: string;
  expanded?: boolean;
}) {
  const storageKey = `serampore-saved-${listingId}`;
  const saved = useSyncExternalStore(
    subscribe,
    () => readSaved(storageKey),
    () => false,
  );

  function toggle() {
    const next = !saved;
    try {
      if (next) {
        window.localStorage.setItem(storageKey, "true");
      } else {
        window.localStorage.removeItem(storageKey);
      }
      window.dispatchEvent(new Event(FAVORITES_EVENT));
    } catch {
      // Storage can be unavailable in private browsing.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={saved ? "Remove from saved rooms" : "Save this room"}
      aria-pressed={saved}
      className={cn(
        "inline-flex items-center justify-center gap-2 border border-white/70 bg-paper/90 text-ink shadow-sm backdrop-blur-md transition hover:bg-paper",
        expanded
          ? "h-11 w-full rounded-xl border-line px-4 text-xs font-bold hover:border-ink/30"
          : "h-9 w-9 rounded-full hover:scale-105",
        className,
      )}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition",
          saved && "fill-terracotta text-terracotta",
        )}
        strokeWidth={2}
      />
      {expanded && <span>{saved ? "Saved to your list" : "Save room"}</span>}
    </button>
  );
}
