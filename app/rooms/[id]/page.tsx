import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  House,
  IndianRupee,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sofa,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RoomCard } from "@/components/room-card";
import { RoomGallery } from "@/components/room-gallery";
import { SaveButton } from "@/components/save-button";
import { ShareButton } from "@/components/share-button";
import {
  CONTACT_EMAIL,
  furnishingLabel,
  genderLabel,
  roomTypeLabel,
} from "@/lib/constants";
import { getListingById, getListings } from "@/lib/listings";
import {
  formatAvailable,
  formatINR,
  getMapEmbedUrl,
  getMapLink,
  getWhatsAppUrl,
} from "@/lib/utils";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const listing = await getListingById(id);

  if (!listing) return { title: "Room not found" };

  return {
    title: listing.title,
    description: `${roomTypeLabel(listing.roomType)} in ${listing.area}, Serampore for ${formatINR(listing.rent)}/month. ${listing.description.slice(0, 140)}`,
    openGraph: {
      title: listing.title,
      description: `${roomTypeLabel(listing.roomType)} in ${listing.area}, Serampore for ${formatINR(listing.rent)}/month.`,
      images: listing.images[0] ? [listing.images[0]] : undefined,
    },
  };
}

export default async function RoomDetailPage({ params }: PageProps) {
  const { id } = await params;
  const { listings } = await getListings();
  const listing = listings.find((item) => item.id === id);

  if (!listing) notFound();

  const sameArea = listings.filter(
    (item) => item.id !== listing.id && item.area === listing.area,
  );
  const otherRooms = listings.filter(
    (item) =>
      item.id !== listing.id &&
      !sameArea.some((same) => same.id === item.id),
  );
  const similar = [...sameArea, ...otherRooms].slice(0, 3);
  const studentLead = listing.source === "student-directory";
  const contactHref = listing.whatsapp
    ? getWhatsAppUrl(listing.whatsapp, listing.title)
    : `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
        `Question about ${listing.title}`,
      )}&body=${encodeURIComponent(
        `Hi! I found "${listing.title}" on Serampore Rooms and would like to know more about the room.`,
      )}`;

  const quickFacts = [
    {
      icon: IndianRupee,
      label: "Monthly rent",
      value: `${formatINR(listing.rent)} / month`,
    },
    {
      icon: ShieldCheck,
      label: "Security deposit",
      value: listing.deposit ? formatINR(listing.deposit) : "No deposit",
    },
    {
      icon: House,
      label: "Room type",
      value: roomTypeLabel(listing.roomType),
    },
    {
      icon: Sofa,
      label: "Furnishing",
      value: furnishingLabel(listing.furnishing),
    },
    {
      icon: Users,
      label: "Preferred tenants",
      value: genderLabel(listing.gender),
    },
    {
      icon: CalendarDays,
      label: "Move-in",
      value: formatAvailable(listing.availableFrom),
    },
  ];

  return (
    <div className="pb-4">
      <div className="container-page pt-6 sm:pt-8">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-[0.68rem] font-semibold text-ink-soft"
        >
          <Link href="/" className="transition hover:text-terracotta">
            Home
          </Link>
          <span className="text-line">/</span>
          <Link href="/rooms" className="transition hover:text-terracotta">
            Rooms
          </Link>
          <span className="text-line">/</span>
          <Link
            href={`/rooms?area=${encodeURIComponent(listing.area)}`}
            className="transition hover:text-terracotta"
          >
            {listing.area}
          </Link>
          <span className="text-line">/</span>
          <span className="max-w-[14rem] truncate text-ink">
            {listing.title}
          </span>
        </nav>

        <div className="mt-6 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {listing.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-sage px-2.5 py-1 text-[0.63rem] font-bold text-ink">
                  <ShieldCheck className="h-3.5 w-3.5 text-terracotta" />
                  Verified listing
                </span>
              )}
              {studentLead && (
                <span className="inline-flex items-center gap-1 rounded-full bg-butter px-2.5 py-1 text-[0.63rem] font-bold text-ink">
                  <Users className="h-3.5 w-3.5 text-terracotta" />
                  Student tip
                </span>
              )}
              {listing.featured && (
                <span className="inline-flex items-center rounded-full bg-butter px-2.5 py-1 text-[0.63rem] font-bold text-ink">
                  Student pick
                </span>
              )}
              <span className="inline-flex items-center rounded-full border border-line bg-paper px-2.5 py-1 text-[0.63rem] font-bold text-ink-soft">
                {genderLabel(listing.gender)}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-line bg-paper px-2.5 py-1 text-[0.63rem] font-bold text-ink-soft">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                {formatAvailable(listing.availableFrom)}
              </span>
            </div>

            <h1 className="mt-4 max-w-3xl font-display text-[2.25rem] leading-[1.02] font-semibold tracking-[-0.04em] text-ink sm:text-[3rem]">
              {listing.title}
            </h1>

            <a
              href={getMapLink(listing.mapQuery)}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition hover:text-terracotta"
            >
              <MapPin className="h-4 w-4 text-terracotta" />
              {listing.address}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="flex items-end gap-4 md:flex-col md:items-end md:gap-1">
            <p className="font-display text-[2rem] leading-none font-semibold tracking-[-0.03em] text-ink">
              {formatINR(listing.rent)}
              <span className="font-sans text-xs font-medium text-ink-soft">
                {" "}
                /month
              </span>
            </p>
            <p className="text-xs font-medium text-ink-soft">
              {listing.deposit
                ? `${formatINR(listing.deposit)} deposit`
                : "No deposit"}
            </p>
          </div>
        </div>

        <div className="mt-7">
          <RoomGallery images={listing.images} title={listing.title} />
        </div>
      </div>

      <div className="container-page mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-12">
        <div>
          <section className="border-b border-line pb-8">
            <div className="flex items-center gap-2 text-[0.62rem] font-bold tracking-[0.14em] text-ink-soft uppercase">
              <span className="h-px w-5 bg-terracotta" />
              About this room
            </div>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-[-0.02em] text-ink">
              A closer look
            </h2>
            <p className="mt-4 max-w-3xl whitespace-pre-line text-sm leading-7 text-ink-soft">
              {listing.description}
            </p>
            {studentLead && (
              <div className="mt-5 flex items-start gap-2.5 rounded-2xl border border-line bg-cream p-4">
                <Users className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" />
                <p className="text-xs leading-5 text-ink-soft">
                  This lead was shared by a student for the hostel and PG
                  directory. Confirm the rent, availability, facilities, and
                  contact details directly before visiting or paying anything.
                </p>
              </div>
            )}
          </section>

          <section className="border-b border-line py-8">
            <h2 className="font-display text-2xl font-semibold tracking-[-0.02em] text-ink">
              The details
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {quickFacts.map((fact) => (
                <div
                  key={fact.label}
                  className="rounded-2xl border border-line bg-paper p-4"
                >
                  <fact.icon className="h-4 w-4 text-terracotta" />
                  <p className="mt-3 text-[0.6rem] font-bold tracking-[0.1em] text-ink-soft uppercase">
                    {fact.label}
                  </p>
                  <p className="mt-1 text-sm font-bold text-ink">
                    {fact.value}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="border-b border-line py-8">
            <h2 className="font-display text-2xl font-semibold tracking-[-0.02em] text-ink">
              What this place offers
            </h2>
            {listing.amenities.length ? (
              <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-3.5 sm:grid-cols-3">
                {listing.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-2.5 text-sm font-medium text-ink/85"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage text-ink">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    {amenity}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-ink-soft">
                Ask the contact about the amenities available in this room.
              </p>
            )}
          </section>

          <section className="border-b border-line py-8">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-display text-2xl font-semibold tracking-[-0.02em] text-ink">
                Location
              </h2>
              <a
                href={getMapLink(listing.mapQuery)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-terracotta"
              >
                Open in Maps
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
            <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-mist">
              <iframe
                src={getMapEmbedUrl(listing.mapQuery)}
                title={`Map of ${listing.address}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[18rem] w-full border-0"
              />
            </div>
            <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-ink-soft">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-terracotta" />
              {listing.address}. Use the map to check the walk to your college,
              station, or daily market before you visit.
            </p>
          </section>

          <section className="pt-8">
            <div className="rounded-2xl border border-butter/80 bg-butter/25 p-5 sm:p-6">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-cream">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <h2 className="font-display text-lg font-semibold text-ink">
                  Before you pay anything
                </h2>
              </div>
              <ul className="mt-4 space-y-2.5 text-xs leading-5 text-ink/75">
                <li className="flex gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-terracotta" />
                  Visit in person and meet the owner before transferring money.
                </li>
                <li className="flex gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-terracotta" />
                  Ask what rent includes — electricity, water, WiFi, and meals
                  can change the real monthly cost.
                </li>
                <li className="flex gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-terracotta" />
                  Get the deposit and notice period in writing. Never pay more
                  than you can afford to lose.
                </li>
              </ul>
            </div>
          </section>
        </div>

        <aside>
          <div className="sticky top-24">
            <div className="rounded-[1.5rem] border border-line bg-paper p-5 shadow-[0_24px_60px_-36px_rgba(23,50,45,0.45)] sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[0.62rem] font-bold tracking-[0.13em] text-ink-soft uppercase">
                  Monthly rent
                </p>
                {listing.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-sage px-2 py-1 text-[0.58rem] font-bold text-ink">
                    <ShieldCheck className="h-3 w-3 text-terracotta" />
                    Verified
                  </span>
                )}
              </div>
              <p className="mt-1 font-display text-[2.1rem] font-semibold tracking-[-0.03em] text-ink">
                {formatINR(listing.rent)}
                <span className="font-sans text-xs font-medium text-ink-soft">
                  {" "}
                  /month
                </span>
              </p>
              <div className="mt-3 flex items-center justify-between rounded-xl bg-cream px-3.5 py-2.5 text-xs">
                <span className="font-medium text-ink-soft">
                  Security deposit
                </span>
                <span className="font-bold text-ink">
                  {listing.deposit ? formatINR(listing.deposit) : "None"}
                </span>
              </div>

              <div className="mt-5 flex items-center gap-3 border-y border-line py-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink font-display text-base font-semibold text-cream">
                  {listing.ownerName.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="text-[0.6rem] font-bold tracking-[0.12em] text-ink-soft uppercase">
                    {studentLead ? "Shared by" : "Listed by"}
                  </p>
                  <p className="truncate text-sm font-bold text-ink">
                    {listing.ownerName}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2.5">
                <a
                  href={contactHref}
                  target={listing.whatsapp ? "_blank" : undefined}
                  rel={listing.whatsapp ? "noreferrer" : undefined}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3.5 text-sm font-bold text-cream transition hover:bg-terracotta"
                >
                  {listing.whatsapp ? (
                    <MessageCircle className="h-4 w-4" />
                  ) : (
                    <Mail className="h-4 w-4" />
                  )}
                  {listing.whatsapp
                    ? "WhatsApp the contact"
                    : "Ask about this room"}
                </a>
                {listing.phone && (
                  <a
                    href={`tel:+${listing.phone.replace(/\D/g, "")}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-paper px-4 py-3 text-sm font-bold text-ink transition hover:border-ink/30 hover:bg-cream"
                  >
                    <Phone className="h-4 w-4" />
                    Call contact
                  </a>
                )}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2.5">
                <SaveButton listingId={listing.id} expanded />
                <ShareButton
                  title={listing.title}
                  className="h-11 w-full rounded-xl"
                />
              </div>

              <p className="mt-4 text-center text-[0.62rem] leading-4 text-ink-soft">
                Mention <span className="font-semibold">Serampore Rooms</span>{" "}
                when you message. Never pay a booking fee to anyone claiming to
                be from this site.
              </p>
            </div>

            <div className="mt-4 rounded-2xl border border-line bg-sage/45 p-4">
              <div className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" />
                <div>
                  <p className="text-xs font-bold text-ink">
                    Exploring {listing.area}?
                  </p>
                  <p className="mt-1 text-[0.68rem] leading-5 text-ink-soft">
                    Compare other rooms in the same neighbourhood before you
                    decide.
                  </p>
                  <Link
                    href={`/rooms?area=${encodeURIComponent(listing.area)}`}
                    className="mt-2 inline-flex items-center gap-1 text-[0.68rem] font-bold text-ink underline decoration-ink/25 underline-offset-4"
                  >
                    See rooms in {listing.area}
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>

            <Link
              href="/rooms"
              className="mt-4 inline-flex items-center gap-1.5 px-1 text-xs font-semibold text-ink-soft transition hover:text-terracotta"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to all rooms
            </Link>
          </div>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="container-page mt-20 border-t border-line pt-14">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Still looking?</p>
              <h2 className="mt-3 font-display text-[2rem] font-semibold tracking-[-0.03em] text-ink sm:text-[2.4rem]">
                More rooms nearby.
              </h2>
            </div>
            <Link
              href={`/rooms?area=${encodeURIComponent(listing.area)}`}
              className="hidden shrink-0 rounded-full border border-line bg-paper px-4 py-2 text-xs font-bold text-ink transition hover:border-ink sm:inline-flex"
            >
              See all in {listing.area}
            </Link>
          </div>
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((item) => (
              <RoomCard key={item.id} listing={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
