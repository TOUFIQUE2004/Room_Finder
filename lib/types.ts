export type Gender = "girls" | "boys" | "coed";
export type RoomType = "single" | "shared" | "pg" | "1bhk";
export type Furnishing = "unfurnished" | "semi-furnished" | "furnished";
export type ListingSource = "google-sheets" | "demo";
export type ListingOrigin = "owner" | "student-directory";

export interface Listing {
  id: string;
  title: string;
  area: string;
  address: string;
  rent: number;
  deposit: number;
  roomType: RoomType;
  gender: Gender;
  furnishing: Furnishing;
  availableFrom: string;
  description: string;
  amenities: string[];
  images: string[];
  ownerName: string;
  whatsapp: string;
  phone?: string;
  mapQuery: string;
  verified: boolean;
  featured: boolean;
  createdAt: string;
  source?: ListingOrigin;
}

export interface ListingFilters {
  q?: string;
  area?: string;
  roomType?: string;
  gender?: string;
  furnishing?: string;
  minRent?: number;
  maxRent?: number;
  sort?: "recommended" | "price-low" | "price-high" | "newest";
}

export interface ListingSubmission {
  title: string;
  area: string;
  address: string;
  rent: number;
  deposit: number;
  roomType: string;
  gender: string;
  furnishing: string;
  availableFrom: string;
  description: string;
  amenities: string[];
  images: string[];
  ownerName: string;
  whatsapp: string;
  phone?: string;
  mapQuery: string;
  consent: boolean;
  website?: string;
}
