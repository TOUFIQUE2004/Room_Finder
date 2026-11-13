"use client";

import { ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const options = [
  { value: "recommended", label: "Recommended" },
  { value: "price-low", label: "Rent: low to high" },
  { value: "price-high", label: "Rent: high to low" },
  { value: "newest", label: "Newest first" },
];

export function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("sort") ?? "recommended";

  function change(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "recommended") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <label className="inline-flex items-center gap-2 text-xs font-semibold text-ink-soft">
      <span className="hidden sm:inline">Sort by</span>
      <span className="relative">
        <select
          value={current}
          onChange={(event) => change(event.target.value)}
          className="appearance-none rounded-full border border-line bg-paper py-2 pr-8 pl-3.5 text-xs font-bold text-ink outline-none transition focus:border-ink/40"
          aria-label="Sort rooms"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 h-3.5 w-3.5 -translate-y-1/2 text-ink-soft" />
      </span>
    </label>
  );
}
