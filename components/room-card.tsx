import {
  BedDouble,
  CalendarCheck,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { SaveButton } from "@/components/save-button";
import {
  furnishingLabel,
  genderLabel,
  roomTypeLabel,
} from "@/lib/constants";
import type { Listing } from "@/lib/types";
import { formatAvailable, formatINR } from "@/lib/utils";

export function RoomCard({
  listing,
  priority = false,
}: {
  listing: Listing;
  priority?: boolean;
}) {
  const studentLead = listing.source === "student-directory";

  return (
    <article className="group relative overflow-hidden rounded-[1.55rem] border border-line/85 bg-paper transition duration-300 hover:-translate-y-1 hover:border-ink/20 hover:shadow-[0_24px_60px_-32px_rgba(23,50,45,0.4)]">
      <Link href={`/rooms/${listing.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-mist">
          {/* User-supplied image URLs can come from any host in Google Sheets. */}
          <img
            src={listing.images[0]}
            alt={listing.title}
            loading={priority ? "eager" : "lazy"}
            className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
          />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink/25 to-transparent" />
          <div className="absolute top-3 left-3 flex flex-wrap gap-2 pr-12">
            {listing.verified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-paper/95 px-2.5 py-1 text-[0.63rem] font-bold text-ink shadow-sm backdrop-blur">
                <ShieldCheck className="h-3.5 w-3.5 text-terracotta" />
                Verified
              </span>
            ) : studentLead ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-paper/95 px-2.5 py-1 text-[0.63rem] font-bold text-ink shadow-sm backdrop-blur">
                <Users className="h-3.5 w-3.5 text-terracotta" />
                Student tip
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-paper/95 px-2.5 py-1 text-[0.63rem] font-bold text-ink shadow-sm backdrop-blur">
                New listing
              </span>
            )}
            {listing.featured && (
              <span className="inline-flex items-center rounded-full bg-butter px-2.5 py-1 text-[0.63rem] font-bold text-ink shadow-sm">
                Student pick
              </span>
            )}
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <p className="inline-flex items-center gap-1.5 text-[0.72rem] font-semibold text-ink-soft">
              <MapPin className="h-3.5 w-3.5 text-terracotta" />
              {listing.area}, Serampore
            </p>
            <p className="shrink-0 text-right">
              <span className="font-display text-[1.4rem] leading-none font-semibold tracking-[-0.03em] text-ink">
                {formatINR(listing.rent)}
              </span>
              <span className="ml-0.5 text-[0.65rem] font-medium text-ink-soft">
                /mo
              </span>
            </p>
          </div>

          <h3 className="mt-2.5 line-clamp-2 min-h-[2.7rem] font-display text-[1.16rem] leading-[1.32] font-semibold tracking-[-0.015em] text-ink">
            {listing.title}
          </h3>

          <div className="mt-3.5 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[0.71rem] font-medium text-ink-soft">
            <span className="inline-flex items-center gap-1.5">
              <BedDouble className="h-3.5 w-3.5" />
              {roomTypeLabel(listing.roomType)}
            </span>
            <span className="text-line">•</span>
            <span>{furnishingLabel(listing.furnishing)}</span>
            <span className="text-line">•</span>
            <span>{genderLabel(listing.gender)}</span>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-line/75 pt-3.5">
            <span className="inline-flex items-center gap-1.5 text-[0.7rem] font-semibold text-ink-soft">
              <CalendarCheck className="h-3.5 w-3.5" />
              {formatAvailable(listing.availableFrom)}
            </span>
            <span className="inline-flex items-center gap-1 text-[0.72rem] font-bold text-ink transition group-hover:text-terracotta">
              View room
              <svg
                viewBox="0 0 20 20"
                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path d="M4 10h11M11 5l5 5-5 5" />
              </svg>
            </span>
          </div>
        </div>
      </Link>

      <SaveButton
        listingId={listing.id}
        className="absolute top-3 right-3 z-10"
      />
    </article>
  );
}
