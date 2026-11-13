import { cache } from "react";
import { demoListings } from "@/lib/demo-listings";
import { fetchSheetListings } from "@/lib/google-sheets";
import type {
  Listing,
  ListingFilters,
  ListingSource,
} from "@/lib/types";

export interface ListingResult {
  listings: Listing[];
  source: ListingSource;
}

export const getListings = cache(async (): Promise<ListingResult> => {
  const sheetListings = await fetchSheetListings();

  if (sheetListings !== null) {
    return { listings: sheetListings, source: "google-sheets" };
  }

  return { listings: demoListings, source: "demo" };
});

export async function getListingById(id: string): Promise<Listing | null> {
  const { listings } = await getListings();
  return listings.find((listing) => listing.id === id) ?? null;
}

function parseNumber(value?: string): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

export function parseListingFilters(
  searchParams: URLSearchParams,
): ListingFilters {
  const sort = searchParams.get("sort");
  return {
    q: searchParams.get("q")?.trim() || undefined,
    area: searchParams.get("area") || undefined,
    roomType: searchParams.get("roomType") || undefined,
    gender: searchParams.get("gender") || undefined,
    furnishing: searchParams.get("furnishing") || undefined,
    minRent: parseNumber(searchParams.get("minRent") ?? undefined),
    maxRent: parseNumber(searchParams.get("maxRent") ?? undefined),
    sort:
      sort === "price-low" || sort === "price-high" || sort === "newest"
        ? sort
        : "recommended",
  };
}

export function filterListings(
  listings: Listing[],
  filters: ListingFilters = {},
): Listing[] {
  const query = filters.q?.toLowerCase().trim();

  const filtered = listings.filter((listing) => {
    if (filters.area && listing.area.toLowerCase() !== filters.area.toLowerCase()) {
      return false;
    }
    if (
      filters.roomType &&
      listing.roomType.toLowerCase() !== filters.roomType.toLowerCase()
    ) {
      return false;
    }
    if (
      filters.gender &&
      listing.gender.toLowerCase() !== filters.gender.toLowerCase()
    ) {
      return false;
    }
    if (
      filters.furnishing &&
      listing.furnishing.toLowerCase() !== filters.furnishing.toLowerCase()
    ) {
      return false;
    }
    if (filters.minRent && listing.rent < filters.minRent) return false;
    if (filters.maxRent && listing.rent > filters.maxRent) return false;

    if (query) {
      const haystack = [
        listing.title,
        listing.area,
        listing.address,
        listing.description,
        listing.ownerName,
        ...listing.amenities,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(query)) return false;
    }

    return true;
  });

  switch (filters.sort) {
    case "price-low":
      return filtered.sort((a, b) => a.rent - b.rent);
    case "price-high":
      return filtered.sort((a, b) => b.rent - a.rent);
    case "newest":
      return filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    default:
      return filtered.sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        if (a.verified !== b.verified) return a.verified ? -1 : 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }
}
