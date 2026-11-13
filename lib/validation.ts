import {
  AMENITIES,
  FURNISHINGS,
  GENDERS,
  ROOM_TYPES,
  SERAMPORE_AREAS,
} from "@/lib/constants";
import type { ListingSubmission } from "@/lib/types";

export type ListingFieldErrors = Record<string, string>;

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function numberValue(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parseListingSubmission(input: unknown): ListingSubmission {
  const value =
    input && typeof input === "object"
      ? (input as Record<string, unknown>)
      : {};

  return {
    title: text(value.title),
    area: text(value.area),
    address: text(value.address),
    rent: numberValue(value.rent),
    deposit: numberValue(value.deposit),
    roomType: text(value.roomType),
    gender: text(value.gender),
    furnishing: text(value.furnishing),
    availableFrom: text(value.availableFrom),
    description: text(value.description),
    amenities: stringArray(value.amenities),
    images: stringArray(value.images),
    ownerName: text(value.ownerName),
    whatsapp: text(value.whatsapp),
    phone: text(value.phone),
    mapQuery: text(value.mapQuery),
    consent: value.consent === true,
    website: text(value.website),
  };
}

export function normalizePhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

export function validateListing(
  submission: ListingSubmission,
): ListingFieldErrors {
  const errors: ListingFieldErrors = {};

  if (submission.title.length < 10 || submission.title.length > 120) {
    errors.title = "Use a title between 10 and 120 characters.";
  }

  if (
    !SERAMPORE_AREAS.includes(
      submission.area as (typeof SERAMPORE_AREAS)[number],
    )
  ) {
    errors.area = "Choose an area in Serampore.";
  }

  if (submission.address.length < 5 || submission.address.length > 200) {
    errors.address = "Add a helpful address or landmark (5–200 characters).";
  }

  if (
    !Number.isInteger(submission.rent) ||
    submission.rent < 1000 ||
    submission.rent > 200000
  ) {
    errors.rent = "Enter a monthly rent between ₹1,000 and ₹2,00,000.";
  }

  if (
    !Number.isInteger(submission.deposit) ||
    submission.deposit < 0 ||
    submission.deposit > 500000
  ) {
    errors.deposit = "Enter a deposit between ₹0 and ₹5,00,000.";
  }

  if (!ROOM_TYPES.some((item) => item.value === submission.roomType)) {
    errors.roomType = "Choose a room type.";
  }

  if (!GENDERS.some((item) => item.value === submission.gender)) {
    errors.gender = "Choose who the room is for.";
  }

  if (!FURNISHINGS.some((item) => item.value === submission.furnishing)) {
    errors.furnishing = "Choose a furnishing option.";
  }

  if (
    submission.availableFrom &&
    !/^\d{4}-\d{2}-\d{2}$/.test(submission.availableFrom)
  ) {
    errors.availableFrom = "Choose a valid available-from date.";
  }

  if (
    submission.description.length < 20 ||
    submission.description.length > 2500
  ) {
    errors.description = "Write between 20 and 2,500 characters.";
  }

  if (submission.amenities.length > 15) {
    errors.amenities = "Select up to 15 amenities.";
  }

  if (
    submission.amenities.some(
      (item) =>
        item.length > 50 ||
        !AMENITIES.includes(item as (typeof AMENITIES)[number]),
    )
  ) {
    errors.amenities = "One of the selected amenities is not supported.";
  }

  if (submission.images.length > 4) {
    errors.images = "Add up to 4 image links.";
  }

  for (const imageUrl of submission.images) {
    try {
      const url = new URL(imageUrl);
      if (url.protocol !== "https:" && url.protocol !== "http:") {
        errors.images = "Image links must start with http:// or https://.";
      }
    } catch {
      errors.images = "One of the image links is not a valid URL.";
    }
  }

  if (
    submission.ownerName.length < 2 ||
    submission.ownerName.length > 80
  ) {
    errors.ownerName = "Enter the owner's name.";
  }

  const whatsappDigits = submission.whatsapp.replace(/\D/g, "");
  if (whatsappDigits.length < 10 || whatsappDigits.length > 15) {
    errors.whatsapp = "Enter a valid WhatsApp number with country code.";
  }

  const phoneDigits = submission.phone?.replace(/\D/g, "") ?? "";
  if (phoneDigits && (phoneDigits.length < 10 || phoneDigits.length > 15)) {
    errors.phone = "Enter a valid phone number.";
  }

  if (submission.mapQuery.length < 3 || submission.mapQuery.length > 200) {
    errors.mapQuery = "Add a locality or landmark for the map.";
  }

  if (!submission.consent) {
    errors.consent = "Please confirm that the details are accurate.";
  }

  if (submission.website) {
    errors.website = "Submission rejected.";
  }

  return errors;
}
