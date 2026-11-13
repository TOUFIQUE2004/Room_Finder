import {
  ArrowRight,
  ArrowUpRight,
  Check,
  IndianRupee,
  KeyRound,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { RoomCard } from "@/components/room-card";
import { SearchForm } from "@/components/search-form";
import {
  SERAMPORE_AREAS,
} from "@/lib/constants";
import { DEFAULT_IMAGES } from "@/lib/demo-listings";
import { filterListings, getListings } from "@/lib/listings";
import { formatINR } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { listings } = await getListings();
  const featured = filterListings(listings, { sort: "recommended" }).slice(0, 6);
  const heroRoom = featured[0] ?? listings[0];
  const heroImage = heroRoom?.images[0] ?? DEFAULT_IMAGES.single[0];
  const lowestRent = listings.length
    ? Math.min(...listings.map((listing) => listing.rent))
    : 0;
  const neighbourhoodCount = new Set(listings.map((listing) => listing.area))
    .size;

  const areaCards = SERAMPORE_AREAS.slice(0, 8).map((area) => ({
    area,
    count: listings.filter((listing) => listing.area === area).length,
  }));

  return (
    <>
      <section className="relative overflow-hidden bg-cream">
        <div className="hero-grid absolute inset-0" aria-hidden="true" />
        <div
          className="absolute -top-36 right-[-10%] h-[32rem] w-[32rem] rounded-full bg-butter/40 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="absolute top-1/3 -left-32 h-80 w-80 rounded-full bg-sage/70 blur-3xl"
          aria-hidden="true"
        />

        <div className="container-page relative pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24">
          <div className="grid items-center gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
            <div className="animate-rise">
              <div className="inline-flex items-center gap-2 rounded-full border border-line bg-paper/80 px-3.5 py-1.5 text-[0.68rem] font-bold text-ink-soft shadow-sm backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-terracotta opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-terracotta" />
                </span>
                Student housing, sorted · Serampore
              </div>

              <h1 className="mt-6 max-w-[12ch] font-display text-[3.25rem] leading-[0.95] font-semibold tracking-[-0.04em] text-ink sm:text-[4.2rem] lg:text-[4.6rem]">
                Find your{" "}
                <span className="relative inline-block italic text-terracotta">
                  corner
                  <svg
                    viewBox="0 0 180 14"
                    className="absolute -bottom-1 left-0 w-full text-terracotta/30"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 10c38-7 93-9 174-4"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>{" "}
                of Serampore.
              </h1>

              <p className="mt-6 max-w-lg text-[0.97rem] leading-7 text-ink-soft sm:text-base">
                Student rooms, PGs, and flats across Chatra, Mahesh, and beyond.
                Compare real student leads, talk directly to the contact, and
                skip the brokerage.
              </p>

              <SearchForm />

              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-[0.72rem] font-semibold text-ink-soft">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-terracotta" />
                  Student-shared leads
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <IndianRupee className="h-4 w-4 text-terracotta" />
                  Zero brokerage
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MessageCircle className="h-4 w-4 text-terracotta" />
                  Direct contact
                </span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[30rem] lg:max-w-none">
              <div
                className="absolute -top-5 right-3 h-28 w-28 rounded-full border border-ink/10 bg-paper/50 backdrop-blur sm:h-36 sm:w-36"
                aria-hidden="true"
              />
              <div
                className="absolute top-6 right-10 flex h-16 w-16 rotate-12 items-center justify-center rounded-2xl bg-butter text-ink shadow-lg sm:h-20 sm:w-20"
                aria-hidden="true"
              >
                <Sparkles className="h-7 w-7 sm:h-8 sm:w-8" />
              </div>

              <div className="relative aspect-[4/5] max-h-[37rem] overflow-hidden rounded-[2.4rem] border-[6px] border-paper bg-mist shadow-[0_35px_80px_-30px_rgba(23,50,45,0.5)]">
                <img
                  src={heroImage}
                  alt={
                    heroRoom
                      ? heroRoom.title
                      : "A bright student room in Serampore"
                  }
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/5 to-transparent" />

                <div className="absolute top-5 left-5 inline-flex items-center gap-1.5 rounded-full bg-paper/95 px-3 py-1.5 text-[0.66rem] font-bold text-ink shadow-sm backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                  {listings.length} rooms across Serampore
                </div>

                {heroRoom ? (
                  <Link
                    href={`/rooms/${heroRoom.id}`}
                    className="group absolute right-5 bottom-5 left-5 rounded-[1.35rem] border border-white/20 bg-paper/95 p-4 shadow-xl backdrop-blur-xl transition hover:bg-paper"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="inline-flex items-center gap-1 text-[0.63rem] font-bold tracking-wide text-ink-soft uppercase">
                          <MapPin className="h-3 w-3 text-terracotta" />
                          {heroRoom.area}, Serampore
                        </p>
                        <p className="mt-1 truncate font-display text-[1.05rem] font-semibold text-ink">
                          {heroRoom.title}
                        </p>
                      </div>
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-cream transition group-hover:bg-terracotta">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                    <div className="mt-2.5 flex items-center justify-between border-t border-line/80 pt-2.5">
                      <span className="text-[0.68rem] font-semibold text-ink-soft">
                        {heroRoom.verified
                          ? "Verified listing"
                          : heroRoom.source === "student-directory"
                            ? "Student-shared lead"
                            : "New listing"}
                      </span>
                      <span className="font-display text-lg font-semibold text-ink">
                        {formatINR(heroRoom.rent)}
                        <span className="font-sans text-[0.6rem] font-medium text-ink-soft">
                          {" "}
                          /month
                        </span>
                      </span>
                    </div>
                  </Link>
                ) : null}
              </div>

              <div className="absolute top-1/2 -left-4 hidden w-[11.5rem] -translate-y-1/2 -rotate-3 rounded-2xl border border-line bg-paper p-3.5 shadow-xl sm:block lg:-left-10">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sage text-ink">
                    <KeyRound className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[0.6rem] font-bold tracking-[0.12em] text-ink-soft uppercase">
                      Starting at
                    </p>
                    <p className="font-display text-lg leading-tight font-semibold text-ink">
                      {lowestRent ? formatINR(lowestRent) : "₹3,800"}
                      <span className="font-sans text-[0.6rem] font-medium text-ink-soft">
                        /mo
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line/80 bg-paper">
        <div className="container-page grid grid-cols-2 divide-line/80 py-5 sm:grid-cols-4 sm:divide-x">
          {[
            { value: `${listings.length}`, label: "Rooms to explore" },
            { value: `${neighbourhoodCount}`, label: "Neighbourhoods" },
            {
              value: lowestRent ? formatINR(lowestRent) : "—",
              label: "Lowest monthly rent",
            },
            { value: "₹0", label: "Brokerage, always" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="px-3 py-3 text-center sm:px-6 sm:py-1"
            >
              <p className="font-display text-[1.6rem] font-semibold tracking-[-0.03em] text-ink sm:text-[1.8rem]">
                {stat.value}
              </p>
              <p className="mt-0.5 text-[0.62rem] font-bold tracking-[0.1em] text-ink-soft uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page pt-20 sm:pt-24">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Handpicked for students</p>
            <h2 className="mt-4 max-w-xl font-display text-[2.2rem] leading-[1.02] font-semibold tracking-[-0.035em] text-ink sm:text-[2.8rem]">
              Rooms worth a closer look.
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-6 text-ink-soft">
              Details come from students who have lived in or visited these
              places. Filter by what you need and contact the person who shared
              the room directly.
            </p>
          </div>
          <Link
            href="/rooms"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-ink/15 bg-paper px-5 py-2.5 text-[0.78rem] font-bold text-ink transition hover:border-ink hover:bg-ink hover:text-cream"
          >
            Browse all rooms
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {featured.length ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {featured.map((listing, index) => (
              <RoomCard
                key={listing.id}
                listing={listing}
                priority={index < 3}
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-[1.5rem] border border-dashed border-line bg-paper px-6 py-16 text-center">
            <Search className="mx-auto h-8 w-8 text-ink-soft" />
            <h3 className="mt-4 font-display text-2xl font-semibold text-ink">
              No rooms are live yet.
            </h3>
            <p className="mt-2 text-sm text-ink-soft">
              Be the first to list a student room in Serampore.
            </p>
            <Link
              href="/list-room"
              className="mt-5 inline-flex rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-cream"
            >
              List a room
            </Link>
          </div>
        )}
      </section>

      <section
        id="areas"
        className="mt-20 border-y border-line/80 bg-paper py-20 sm:mt-24 sm:py-24"
      >
        <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">Know your neighbourhood</p>
            <h2 className="mt-4 font-display text-[2.2rem] leading-[1.02] font-semibold tracking-[-0.035em] text-ink sm:text-[2.8rem]">
              Find your pocket of Serampore.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-ink-soft">
              From the college crowd in Chatra to the quieter lanes of Akna,
              every part of town has a different rhythm. Pick the one that fits
              your daily routine.
            </p>
            <div className="mt-7 flex items-center gap-3 rounded-2xl border border-line bg-cream p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-terracotta/10 text-terracotta">
                <MapPin className="h-4 w-4" />
              </span>
              <p className="text-xs leading-5 text-ink-soft">
                Not sure where to start?{" "}
                <Link
                  href="/rooms"
                  className="font-bold text-ink underline decoration-terracotta/40 underline-offset-4"
                >
                  Browse every locality
                </Link>{" "}
                and compare rent.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {areaCards.map(({ area, count }, index) => (
              <Link
                key={area}
                href={`/rooms?area=${encodeURIComponent(area)}`}
                className="group relative overflow-hidden rounded-2xl border border-line bg-cream p-4 transition duration-300 hover:-translate-y-0.5 hover:border-ink/25 hover:bg-sage/45 sm:p-5"
              >
                <span className="text-[0.6rem] font-bold tracking-[0.14em] text-ink-soft/70 uppercase">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="mt-5 font-display text-lg font-semibold tracking-[-0.02em] text-ink sm:text-xl">
                  {area}
                </p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <p className="text-[0.68rem] font-medium text-ink-soft">
                    {count > 0
                      ? `${count} room${count === 1 ? "" : "s"}`
                      : "Be the first"}
                  </p>
                  <ArrowUpRight className="h-4 w-4 text-ink-soft transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-terracotta" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="container-page pt-20 sm:pt-24">
        <div className="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-12 text-cream sm:px-10 sm:py-14 lg:px-14">
          <div
            className="absolute -top-24 -right-24 h-80 w-80 rounded-full border border-cream/10"
            aria-hidden="true"
          />
          <div
            className="absolute -right-10 -bottom-28 h-64 w-64 rounded-full bg-terracotta/20 blur-2xl"
            aria-hidden="true"
          />
          <div className="relative">
            <div className="max-w-xl">
              <p className="eyebrow !text-cream/55 before:!bg-butter">
                How it works
              </p>
              <h2 className="mt-4 font-display text-[2.2rem] leading-[1.02] font-semibold tracking-[-0.035em] sm:text-[2.8rem]">
                Less scrolling. More moving in.
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-6 text-cream/65">
                Three steps between you and a room that actually fits your
                student budget.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                {
                  icon: Search,
                  number: "01",
                  title: "Search what matters",
                  text: "Filter by locality, rent, room type, and who the room is for.",
                },
                {
                  icon: MessageCircle,
                  number: "02",
                  title: "Talk to the contact",
                  text: "Message on WhatsApp or call. No broker in the middle.",
                },
                {
                  icon: ShieldCheck,
                  number: "03",
                  title: "Visit & decide",
                  text: "See the room in person, ask questions, and use our safety checklist.",
                },
              ].map((step) => (
                <div
                  key={step.number}
                  className="rounded-[1.35rem] border border-cream/10 bg-cream/[0.04] p-5 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-butter text-ink">
                      <step.icon className="h-4 w-4" />
                    </span>
                    <span className="font-display text-2xl text-cream/25">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-5 text-cream/55">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="safety"
        className="container-page grid gap-8 pt-20 sm:pt-24 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12"
      >
        <div className="flex flex-col justify-center">
          <p className="eyebrow">Rent smart</p>
          <h2 className="mt-4 max-w-lg font-display text-[2.2rem] leading-[1.02] font-semibold tracking-[-0.035em] text-ink sm:text-[2.8rem]">
            A good room should feel safe, too.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-ink-soft">
            We keep the process direct, but the final decision is yours. Take
            your time, ask the awkward questions, and never rush a deposit.
          </p>
          <Link
            href="/list-room"
            className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-terracotta px-5 py-3 text-sm font-bold text-white transition hover:bg-terracotta-dark"
          >
            List your room
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="rounded-[1.8rem] border border-line bg-sage/55 p-6 sm:p-8">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-cream">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-lg font-semibold text-ink">
                Before you pay
              </p>
              <p className="text-[0.65rem] font-semibold tracking-wide text-ink-soft uppercase">
                A five-point check
              </p>
            </div>
          </div>
          <ul className="mt-6 space-y-4">
            {[
              "Visit the room in person and meet the owner.",
              "Confirm rent, deposit, electricity, and water charges in writing.",
              "Ask for the owner's ID and a rent agreement or receipt.",
              "Check the bathroom, water supply, locks, and phone signal.",
              "Never pay a deposit before you have seen the room.",
            ].map((tip) => (
              <li key={tip} className="flex gap-3 text-sm leading-6 text-ink/85">
                <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-ink text-cream">
                  <Check className="h-2.5 w-2.5" strokeWidth={3} />
                </span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-page pt-20 sm:pt-24">
        <div className="relative overflow-hidden rounded-[2.2rem] border border-line bg-butter p-7 sm:p-10 lg:p-14">
          <div
            className="absolute -top-16 right-10 h-56 w-56 rounded-full border-[24px] border-paper/30"
            aria-hidden="true"
          />
          <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-[0.62rem] font-bold tracking-[0.16em] text-ink/60 uppercase">
                For room owners
              </p>
              <h2 className="mt-4 max-w-2xl font-display text-[2.2rem] leading-[1.02] font-semibold tracking-[-0.035em] text-ink sm:text-[2.7rem]">
                A spare room is a student&apos;s perfect fit.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-ink/70">
                List it free, reach students who are already looking in your
                neighbourhood, and keep the conversation direct.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch">
              <Link
                href="/list-room"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-bold text-cream transition hover:bg-terracotta"
              >
                List a room for free
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <p className="flex items-center justify-center gap-1.5 text-center text-[0.65rem] font-semibold text-ink/60">
                <Check className="h-3.5 w-3.5" /> No listing fee. No commission.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
