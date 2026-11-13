import { ArrowRight, ChevronDown, MapPin, Search } from "lucide-react";
import {
  BUDGET_OPTIONS,
  ROOM_TYPES,
  SERAMPORE_AREAS,
} from "@/lib/constants";

const selectClass =
  "w-full appearance-none bg-transparent pr-6 text-sm font-semibold text-ink outline-none";

export function SearchForm() {
  return (
    <form
      action="/rooms"
      method="get"
      className="mt-8 rounded-[1.5rem] border border-white/70 bg-paper p-2 shadow-[0_24px_60px_-28px_rgba(23,50,45,0.42)] sm:mt-10"
    >
      <div className="grid sm:grid-cols-[1.1fr_1fr_1fr_auto]">
        <div className="relative px-4 py-3 sm:py-3.5">
          <label
            htmlFor="hero-area"
            className="flex items-center gap-1.5 text-[0.58rem] font-bold tracking-[0.16em] text-ink-soft uppercase"
          >
            <MapPin className="h-3 w-3 text-terracotta" />
            Area
          </label>
          <div className="mt-1.5 flex items-center gap-2">
            <select
              id="hero-area"
              name="area"
              defaultValue=""
              className={selectClass}
            >
              <option value="">All of Serampore</option>
              {SERAMPORE_AREAS.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none h-4 w-4 shrink-0 text-ink-soft" />
          </div>
        </div>

        <div className="relative border-t border-line/80 px-4 py-3 sm:border-t-0 sm:border-l sm:py-3.5">
          <label
            htmlFor="hero-budget"
            className="text-[0.58rem] font-bold tracking-[0.16em] text-ink-soft uppercase"
          >
            Monthly budget
          </label>
          <div className="mt-1.5 flex items-center gap-2">
            <select
              id="hero-budget"
              name="maxRent"
              defaultValue=""
              className={selectClass}
            >
              {BUDGET_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none h-4 w-4 shrink-0 text-ink-soft" />
          </div>
        </div>

        <div className="relative border-t border-line/80 px-4 py-3 sm:border-t-0 sm:border-l sm:py-3.5">
          <label
            htmlFor="hero-type"
            className="text-[0.58rem] font-bold tracking-[0.16em] text-ink-soft uppercase"
          >
            Room type
          </label>
          <div className="mt-1.5 flex items-center gap-2">
            <select
              id="hero-type"
              name="roomType"
              defaultValue=""
              className={selectClass}
            >
              <option value="">Any type</option>
              {ROOM_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none h-4 w-4 shrink-0 text-ink-soft" />
          </div>
        </div>

        <button
          type="submit"
          className="group m-1 inline-flex items-center justify-center gap-2 rounded-[1.15rem] bg-terracotta px-6 py-4 text-sm font-bold text-white transition hover:bg-terracotta-dark sm:ml-0"
        >
          <Search className="h-4 w-4 sm:hidden" />
          <span>Search rooms</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </form>
  );
}
