import { FURNISHINGS, GENDERS, ROOM_TYPES } from "@/lib/constants";
import { DEFAULT_IMAGES } from "@/lib/demo-listings";
import type { Listing, ListingOrigin } from "@/lib/types";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function rowText(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function rowNumber(value: unknown): number {
  const parsed = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function rowBool(value: unknown): boolean {
  return ["true", "yes", "1", "verified"].includes(
    rowText(value).toLowerCase(),
  );
}

function rowOrigin(value: unknown): ListingOrigin | undefined {
  const origin = rowText(value).toLowerCase();
  if (origin === "owner" || origin === "student-directory") return origin;
  return undefined;
}

function rowList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => rowText(item)).filter(Boolean);
  }

  return rowText(value)
    .split(/[|\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function oneOf<T extends string>(value: string, allowed: T[], fallback: T): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

function normalizeSheetListing(raw: unknown, index: number): Listing | null {
  if (!isRecord(raw)) return null;

  const status = rowText(raw.status).toLowerCase();
  if (status && status !== "active") return null;

  const title = rowText(raw.title);
  if (!title) return null;

  const roomType = oneOf(
    rowText(raw.roomType).toLowerCase(),
    ROOM_TYPES.map((item) => item.value),
    "single",
  );
  const gender = oneOf(
    rowText(raw.gender).toLowerCase(),
    GENDERS.map((item) => item.value),
    "coed",
  );
  const furnishing = oneOf(
    rowText(raw.furnishing).toLowerCase(),
    FURNISHINGS.map((item) => item.value),
    "semi-furnished",
  );
  const address = rowText(raw.address) || "Serampore, West Bengal";
  const images = rowList(raw.images);

  return {
    id: rowText(raw.id) || `sheet-listing-${index + 1}`,
    title,
    area: rowText(raw.area) || "Serampore",
    address,
    rent: rowNumber(raw.rent),
    deposit: rowNumber(raw.deposit),
    roomType,
    gender,
    furnishing,
    availableFrom: rowText(raw.availableFrom) || "Immediately",
    description: rowText(raw.description),
    amenities: rowList(raw.amenities),
    images: images.length ? images : DEFAULT_IMAGES[roomType],
    ownerName: rowText(raw.ownerName) || "Room owner",
    whatsapp: rowText(raw.whatsapp),
    phone: rowText(raw.phone) || undefined,
    mapQuery: rowText(raw.mapQuery) || `${address}, Serampore`,
    verified: rowBool(raw.verified),
    featured: rowBool(raw.featured),
    createdAt: rowText(raw.createdAt) || new Date().toISOString(),
    source: rowOrigin(raw.source),
  };
}

export function isGoogleSheetsConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_SHEETS_WEB_APP_URL?.trim() &&
      process.env.GOOGLE_SHEETS_WRITE_TOKEN?.trim(),
  );
}

export async function fetchSheetListings(): Promise<Listing[] | null> {
  const endpoint = process.env.GOOGLE_SHEETS_WEB_APP_URL?.trim();
  if (!endpoint) return null;

  try {
    const url = new URL(endpoint);
    url.searchParams.set("action", "list");

    const response = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(9000),
    });

    if (!response.ok) {
      throw new Error(`Google Sheets responded with ${response.status}.`);
    }

    const data: unknown = await response.json();
    if (!isRecord(data) || data.ok === false || !Array.isArray(data.listings)) {
      throw new Error("Google Sheets returned an unexpected response.");
    }

    return data.listings
      .map((item, index) => normalizeSheetListing(item, index))
      .filter((item): item is Listing => item !== null);
  } catch (error) {
    console.error("Could not load listings from Google Sheets:", error);
    return null;
  }
}

export interface SheetWriteResult {
  ok: boolean;
  error?: string;
  notConfigured?: boolean;
}

export async function createSheetListing(
  listing: Listing,
): Promise<SheetWriteResult> {
  const endpoint = process.env.GOOGLE_SHEETS_WEB_APP_URL?.trim();
  const token = process.env.GOOGLE_SHEETS_WRITE_TOKEN?.trim();

  if (!endpoint || !token) {
    return {
      ok: false,
      notConfigured: true,
      error:
        "The Google Sheet connection is not configured yet. Add GOOGLE_SHEETS_WEB_APP_URL and GOOGLE_SHEETS_WRITE_TOKEN to your environment.",
    };
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        type: "listing",
        listing,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });

    const data: unknown = await response.json().catch(() => null);
    if (!response.ok || !isRecord(data) || data.ok !== true) {
      const message =
        isRecord(data) && typeof data.error === "string"
          ? data.error
          : "The listing could not be saved. Please try again.";
      return { ok: false, error: message };
    }

    return { ok: true };
  } catch (error) {
    console.error("Could not save listing to Google Sheets:", error);
    return {
      ok: false,
      error:
        "Could not reach the Google Sheet. Check the Apps Script deployment and try again.",
    };
  }
}
