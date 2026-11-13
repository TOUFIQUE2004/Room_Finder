import { SlidersHorizontal } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { RoomCard } from "@/components/room-card";
import {
  RoomFilterForm,
} from "@/components/room-filters";
import { SortSelect } from "@/components/sort-select";
import { roomTypeLabel } from "@/lib/constants";
import {
  filterListings,
  getListings,
  parseListingFilters,
} from "@/lib/listings";

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function toSearchParams(
  raw: Record<string, string | string[] | undefined>,
): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === "string") params.set(key, value);
    if (Array.isArray(value) && value[0]) params.set(key, value[0]);
  }
  return params;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const filters = parseListingFilters(toSearchParams(await searchParams));
  const title = filters.area
    ? `Student rooms in ${filters.area}`
    : filters.roomType
      ? `${roomTypeLabel(filters.roomType)}s in Serampore`
      : "Find a student room in Serampore";

  return {
    title,
    description:
      "Browse student rooms, PGs, and flats across Serampore. Filter by area, budget, room type, and furnishing, then contact the person who shared the room directly.",
  };
}

export default async function RoomsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const rawParams = await searchParams;
  const filters = parseListingFilters(toSearchParams(rawParams));
  const { listings } = await getListings();
  const results = filterListings(listings, filters);

  const heading = filters.area
    ? `Rooms in ${filters.area}`
    : filters.roomType
      ? `${roomTypeLabel(filters.roomType)}s in Serampore`
      : "Find a room in Serampore";

  const activeCount = [
    filters.q,
    filters.area,
    filters.roomType,
    filters.gender,
    filters.furnishing,
    filters.maxRent,
  ].filter(Boolean).length;

  return (
    <>
      <section className="relative overflow-hidden border-b border-line/80 bg-paper">
        <div className="hero-grid absolute inset-0 opacity-50" aria-hidden="true" />
        <div className="container-page relative py-10 sm:py-14">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-[0.68rem] font-semibold text-ink-soft"
          >
            <Link href="/" className="transition hover:text-terracotta">
              Home
            </Link>
            <span className="text-line">/</span>
            <span className="text-ink">Rooms</span>
          </nav>

          <div className="mt-6 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="eyebrow">Available now in Serampore</p>
              <h1 className="mt-3 max-w-3xl font-display text-[2.7rem] leading-[0.98] font-semibold tracking-[-0.04em] text-ink sm:text-[3.4rem]">
                {heading}
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-ink-soft">
                {filters.q
                  ? `Showing matches for “${filters.q}”. Filter further or contact the person who shared the room when something feels right.`
                  : "Compare rent, amenities, and locality in one place. Every conversation goes straight to the person who shared the room."}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-cream px-3 py-1.5 text-[0.65rem] font-bold text-ink-soft">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                {results.length} room{results.length === 1 ? "" : "s"} found
              </span>
              {activeCount > 0 && (
                <Link
                  href="/rooms"
                  className="rounded-full border border-terracotta/25 bg-terracotta/5 px-3 py-1.5 text-[0.65rem] font-bold text-terracotta transition hover:bg-terracotta/10"
                >
                  Clear {activeCount} filter{activeCount === 1 ? "" : "s"}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container-page grid gap-8 py-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-10 lg:py-10">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-[1.4rem] border border-line bg-paper p-5">
            <div className="mb-5 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sage text-ink">
                <SlidersHorizontal className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-bold text-ink">Filter rooms</p>
                <p className="text-[0.62rem] text-ink-soft">
                  Narrow it down
                </p>
              </div>
            </div>
            <RoomFilterForm filters={filters} />
          </div>
        </aside>

        <div>
          <details className="mb-5 rounded-2xl border border-line bg-paper lg:hidden">
            <summary className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3.5">
              <span className="inline-flex items-center gap-2 text-sm font-bold text-ink">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {activeCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-terracotta text-[0.62rem] text-white">
                    {activeCount}
                  </span>
                )}
              </span>
              <span className="text-[0.65rem] font-semibold text-ink-soft">
                Tap to open
              </span>
            </summary>
            <div className="border-t border-line p-4">
              <RoomFilterForm filters={filters} />
            </div>
          </details>

          <div className="flex items-center justify-between gap-4 border-b border-line/80 pb-4">
            <p className="text-xs font-semibold text-ink-soft">
              Showing{" "}
              <span className="font-bold text-ink">{results.length}</span>{" "}
              {results.length === 1 ? "room" : "rooms"}
              {filters.area ? ` in ${filters.area}` : " across Serampore"}
            </p>
            <Suspense fallback={<span className="text-xs">Sort</span>}>
              <SortSelect />
            </Suspense>
          </div>

          {results.length ? (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((listing, index) => (
                <RoomCard
                  key={listing.id}
                  listing={listing}
                  priority={index < 3}
                />
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-[1.5rem] border border-dashed border-line bg-paper px-6 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sage text-ink">
                <SlidersHorizontal className="h-5 w-5" />
              </div>
              <h2 className="mt-4 font-display text-2xl font-semibold text-ink">
                No rooms match those filters.
              </h2>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-ink-soft">
                Try raising your budget, choosing a different locality, or
                clearing a filter or two.
              </p>
              <Link
                href="/rooms"
                className="mt-5 inline-flex rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-cream transition hover:bg-terracotta"
              >
                Show all rooms
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
