"use client";

import { ArrowUpRight, Menu, Plus, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Brand } from "@/components/brand";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/rooms", label: "Find a room" },
  { href: "/#areas", label: "Areas" },
  { href: "/#how-it-works", label: "How it works" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-cream/85 backdrop-blur-xl">
      <div className="container-page flex h-[4.6rem] items-center justify-between gap-4">
        <Brand />

        <nav className="hidden items-center gap-7 md:flex" aria-label="Main">
          {navItems.map((item) => {
            const active =
              item.href === "/rooms" && pathname.startsWith("/rooms");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative py-2 text-[0.84rem] font-semibold text-ink-soft transition-colors hover:text-ink",
                  active && "text-ink",
                )}
              >
                {item.label}
                {active && (
                  <span className="absolute right-0 -bottom-0.5 left-0 h-0.5 rounded-full bg-terracotta" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/list-room"
            className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[0.82rem] font-bold text-cream transition-colors hover:bg-terracotta"
          >
            <Plus className="h-4 w-4" strokeWidth={2.2} />
            List your room
            <ArrowUpRight className="h-3.5 w-3.5 opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close menu" : "Open menu"}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper text-ink md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div
          id="mobile-navigation"
          className="border-t border-line bg-cream px-5 pt-4 pb-6 md:hidden"
        >
          <nav className="flex flex-col" aria-label="Mobile">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-line/70 py-3.5 text-base font-semibold text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/list-room"
            onClick={() => setOpen(false)}
            className="mt-5 flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-cream"
          >
            <Plus className="h-4 w-4" />
            List your room
          </Link>
        </div>
      )}
    </header>
  );
}
