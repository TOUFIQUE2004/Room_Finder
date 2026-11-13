import type { Furnishing, Gender, RoomType } from "@/lib/types";

export const SITE_NAME = "Serampore Rooms";
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@seramporerooms.in";

export const SERAMPORE_AREAS = [
  "Chatra",
  "Mahesh",
  "Kuntighat",
  "Bara Bazar",
  "Mallickpara",
  "Akna",
  "Rajbari",
  "Station Road",
  "GT Road",
  "Maniktala",
  "Ballavpur",
  "Sheoraphuli",
] as const;

export const ROOM_TYPES: { value: RoomType; label: string }[] = [
  { value: "single", label: "Single room" },
  { value: "shared", label: "Shared room" },
  { value: "pg", label: "PG / hostel" },
  { value: "1bhk", label: "1 BHK flat" },
];

export const GENDERS: { value: Gender; label: string }[] = [
  { value: "girls", label: "Girls only" },
  { value: "boys", label: "Boys only" },
  { value: "coed", label: "Co-ed / anyone" },
];

export const FURNISHINGS: { value: Furnishing; label: string }[] = [
  { value: "unfurnished", label: "Unfurnished" },
  { value: "semi-furnished", label: "Semi-furnished" },
  { value: "furnished", label: "Fully furnished" },
];

export const AMENITIES = [
  "WiFi",
  "Attached bathroom",
  "Geyser",
  "Study table",
  "Wardrobe",
  "Bed",
  "AC",
  "Kitchen",
  "Washing machine",
  "Parking",
  "Water purifier",
  "Power backup",
  "Balcony",
  "CCTV",
  "Housekeeping",
  "Meals",
] as const;

export const BUDGET_OPTIONS = [
  { value: "", label: "Any budget" },
  { value: "4000", label: "Under ₹4,000" },
  { value: "6000", label: "Under ₹6,000" },
  { value: "9000", label: "Under ₹9,000" },
  { value: "12000", label: "Under ₹12,000" },
  { value: "20000", label: "Under ₹20,000" },
] as const;

export function roomTypeLabel(value: string) {
  return ROOM_TYPES.find((item) => item.value === value)?.label ?? value;
}

export function genderLabel(value: string) {
  return GENDERS.find((item) => item.value === value)?.label ?? value;
}

export function furnishingLabel(value: string) {
  return FURNISHINGS.find((item) => item.value === value)?.label ?? value;
}
