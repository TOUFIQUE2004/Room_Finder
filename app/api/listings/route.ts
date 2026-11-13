import { NextResponse } from "next/server";
import { DEFAULT_IMAGES } from "@/lib/demo-listings";
import {
  createSheetListing,
  isGoogleSheetsConfigured,
} from "@/lib/google-sheets";
import {
  filterListings,
  getListings,
  parseListingFilters,
} from "@/lib/listings";
import type {
  Furnishing,
  Gender,
  Listing,
  RoomType,
} from "@/lib/types";
import { makeListingId } from "@/lib/utils";
import {
  normalizePhone,
  parseListingSubmission,
  validateListing,
} from "@/lib/validation";

export const dynamic = "force-dynamic";

const RATE_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT = 6;
const recentSubmissions = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (recentSubmissions.get(ip) ?? []).filter(
    (time) => now - time < RATE_WINDOW_MS,
  );

  if (recent.length >= RATE_LIMIT) return true;

  recent.push(now);
  recentSubmissions.set(ip, recent);

  if (recentSubmissions.size > 500) {
    for (const [key, timestamps] of recentSubmissions) {
      if (!timestamps.some((time) => now - time < RATE_WINDOW_MS)) {
        recentSubmissions.delete(key);
      }
    }
  }

  return false;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filters = parseListingFilters(searchParams);
  const { listings, source } = await getListings();
  const results = filterListings(listings, filters);

  return NextResponse.json({
    ok: true,
    listings: results,
    total: results.length,
    source,
    filters,
  });
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Too many submissions from this connection. Please try again later.",
      },
      { status: 429 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "The request body is not valid JSON." },
      { status: 400 },
    );
  }

  const submission = parseListingSubmission(payload);
  const fieldErrors = validateListing(submission);

  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json(
      {
        ok: false,
        message: "Please check the highlighted fields and try again.",
        errors: fieldErrors,
      },
      { status: 422 },
    );
  }

  if (!isGoogleSheetsConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Listing submissions are not connected yet. Add the Google Sheets environment variables from README.md and try again.",
      },
      { status: 503 },
    );
  }

  const listing: Listing = {
    id: makeListingId(),
    title: submission.title,
    area: submission.area,
    address: submission.address,
    rent: submission.rent,
    deposit: submission.deposit,
    roomType: submission.roomType as RoomType,
    gender: submission.gender as Gender,
    furnishing: submission.furnishing as Furnishing,
    availableFrom: submission.availableFrom || "Immediately",
    description: submission.description,
    amenities: submission.amenities,
    images:
      submission.images.length > 0
        ? submission.images
        : DEFAULT_IMAGES[submission.roomType] ?? DEFAULT_IMAGES.single,
    ownerName: submission.ownerName,
    whatsapp: normalizePhone(submission.whatsapp),
    phone: submission.phone ? normalizePhone(submission.phone) : undefined,
    mapQuery: submission.mapQuery,
    verified: false,
    featured: false,
    createdAt: new Date().toISOString(),
    source: "owner",
  };

  const result = await createSheetListing(listing);

  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        message:
          result.error ?? "The listing could not be saved. Please try again.",
      },
      { status: result.notConfigured ? 503 : 502 },
    );
  }

  return NextResponse.json(
    {
      ok: true,
      message:
        "Your listing was submitted for review. It will appear once approved.",
      listing: { id: listing.id },
    },
    { status: 201 },
  );
}
