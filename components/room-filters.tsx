import { Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import {
  BUDGET_OPTIONS,
  FURNISHINGS,
  GENDERS,
  ROOM_TYPES,
  SERAMPORE_AREAS,
} from "@/lib/constants";
import type { ListingFilters } from "@/lib/types";

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-sm font-medium text-ink outline-none transition focus:border-ink/40 focus:ring-2 focus:ring-ink/8";
const labelClass =
  "text-[0.62rem] font-bold tracking-[0.13em] text-ink-soft uppercase";

export function RoomFilterForm({
  filters,
}: {
  filters: ListingFilters;
}) {
  return (
    <form action="/rooms" method="get" className="space-y-4">
      <div>
        <label htmlFor="filter-q" className={labelClass}>
          Keyword
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-soft" />
          <input
            id="filter-q"
            name="q"
            type="search"
            defaultValue={filters.q}
            placeholder="College, landmark, amenity…"
            className={`${fieldClass} pl-9`}
          />
        </div>
      </div>

      <div>
        <label htmlFor="filter-area" className={labelClass}>
          Area
        </label>
        <select
          id="filter-area"
          name="area"
          defaultValue={filters.area ?? ""}
          className={fieldClass}
        >
          <option value="">All of Serampore</option>
          {SERAMPORE_AREAS.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="filter-type" className={labelClass}>
            Room type
          </label>
          <select
            id="filter-type"
            name="roomType"
            defaultValue={filters.roomType ?? ""}
            className={fieldClass}
          >
            <option value="">Any type</option>
            {ROOM_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="filter-gender" className={labelClass}>
            For
          </label>
          <select
            id="filter-gender"
            name="gender"
            defaultValue={filters.gender ?? ""}
            className={fieldClass}
          >
            <option value="">Anyone</option>
            {GENDERS.map((gender) => (
              <option key={gender.value} value={gender.value}>
                {gender.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="filter-budget" className={labelClass}>
          Monthly budget
        </label>
        <select
          id="filter-budget"
          name="maxRent"
          defaultValue={filters.maxRent ? String(filters.maxRent) : ""}
          className={fieldClass}
        >
          {BUDGET_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="filter-furnishing" className={labelClass}>
          Furnishing
        </label>
        <select
          id="filter-furnishing"
          name="furnishing"
          defaultValue={filters.furnishing ?? ""}
          className={fieldClass}
        >
          <option value="">Any furnishing</option>
          {FURNISHINGS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      {filters.sort && filters.sort !== "recommended" && (
        <input type="hidden" name="sort" value={filters.sort} />
      )}

      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm font-bold text-cream transition hover:bg-terracotta"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Apply filters
      </button>

      <Link
        href="/rooms"
        className="block text-center text-xs font-semibold text-ink-soft underline decoration-line underline-offset-4 transition hover:text-terracotta"
      >
        Clear all filters
      </Link>
    </form>
  );
}
