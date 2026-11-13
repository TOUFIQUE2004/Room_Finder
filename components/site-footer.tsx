import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-ink text-cream">
      <div className="container-page py-14 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1fr]">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-3"
              aria-label="Serampore Rooms home"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-butter text-ink">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3.5 10.3 12 3.5l8.5 6.8" />
                  <path d="M5.5 9.3v10.2h13V9.3" />
                  <path d="M10 19.5v-5.2h4v5.2" />
                </svg>
              </span>
              <span className="flex flex-col">
                <span className="font-display text-xl leading-none font-semibold">
                  Serampore
                </span>
                <span className="mt-1 text-[0.58rem] font-bold tracking-[0.28em] uppercase opacity-60">
                  Rooms
                </span>
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-6 text-cream/65">
              A student-first way to find a room in Serampore. Real listings,
              direct conversations, no brokerage.
            </p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-cream/15 px-3 py-1.5 text-xs text-cream/65">
              <MapPin className="h-3.5 w-3.5 text-butter" />
              Serampore, Hooghly, West Bengal
            </p>
          </div>

          <div>
            <p className="text-[0.65rem] font-bold tracking-[0.18em] text-cream/40 uppercase">
              Find a room
            </p>
            <ul className="mt-4 space-y-3 text-sm text-cream/75">
              <li>
                <Link className="transition hover:text-butter" href="/rooms">
                  All rooms
                </Link>
              </li>
              <li>
                <Link
                  className="transition hover:text-butter"
                  href="/rooms?area=Chatra"
                >
                  Rooms in Chatra
                </Link>
              </li>
              <li>
                <Link
                  className="transition hover:text-butter"
                  href="/rooms?area=Mahesh"
                >
                  Rooms in Mahesh
                </Link>
              </li>
              <li>
                <Link
                  className="transition hover:text-butter"
                  href="/rooms?roomType=pg"
                >
                  PGs &amp; hostels
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[0.65rem] font-bold tracking-[0.18em] text-cream/40 uppercase">
              For owners
            </p>
            <ul className="mt-4 space-y-3 text-sm text-cream/75">
              <li>
                <Link
                  className="transition hover:text-butter"
                  href="/list-room"
                >
                  List a room
                </Link>
              </li>
              <li>
                <Link
                  className="transition hover:text-butter"
                  href="/#how-it-works"
                >
                  How it works
                </Link>
              </li>
              <li>
                <Link
                  className="transition hover:text-butter"
                  href="/#safety"
                >
                  Safety guidelines
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[0.65rem] font-bold tracking-[0.18em] text-cream/40 uppercase">
              Get in touch
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-4 inline-flex items-center gap-2 text-sm text-cream/75 transition hover:text-butter"
            >
              <Mail className="h-4 w-4" />
              {CONTACT_EMAIL}
            </a>
            <p className="mt-4 text-xs leading-5 text-cream/45">
              Found a problem with a listing? Tell us and we&apos;ll review it.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=Listing report`}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-butter"
            >
              Report a listing
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-cream/10 pt-6 text-xs text-cream/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE_NAME}. Made for Serampore
            students.
          </p>
          <p>
            Always visit a room in person before paying any money. We never ask
            for advance payments.
          </p>
        </div>
      </div>
    </footer>
  );
}
