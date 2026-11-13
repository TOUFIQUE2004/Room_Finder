import {
  ArrowUpRight,
  CheckCircle2,
  CircleHelp,
  ImageIcon,
  Mail,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ListingForm } from "@/components/listing-form";
import { CONTACT_EMAIL } from "@/lib/constants";
import { isGoogleSheetsConfigured } from "@/lib/google-sheets";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "List your room",
  description:
    "List a student room, PG, or flat in Serampore for free. Reach students who are already searching in your neighbourhood.",
};

export default function ListRoomPage() {
  const connected = isGoogleSheetsConfigured();

  return (
    <>
      <section className="relative overflow-hidden border-b border-line/80 bg-paper">
        <div className="hero-grid absolute inset-0 opacity-50" aria-hidden="true" />
        <div
          className="absolute -top-24 right-[-5%] h-80 w-80 rounded-full bg-butter/30 blur-3xl"
          aria-hidden="true"
        />
        <div className="container-page relative py-10 sm:py-14">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-[0.68rem] font-semibold text-ink-soft"
          >
            <Link href="/" className="transition hover:text-terracotta">
              Home
            </Link>
            <span className="text-line">/</span>
            <span className="text-ink">List your room</span>
          </nav>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="eyebrow">For room owners</p>
              <h1 className="mt-3 max-w-3xl font-display text-[2.7rem] leading-[0.98] font-semibold tracking-[-0.04em] text-ink sm:text-[3.4rem]">
                Turn your spare room into someone&apos;s home.
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-ink-soft">
                List a room, PG, or flat in Serampore for free. Reach students
                who are already searching, and keep every conversation direct.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-cream px-3 py-2 text-[0.65rem] font-bold text-ink-soft">
                <Wallet className="h-3.5 w-3.5 text-terracotta" />
                Free to list
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-cream px-3 py-2 text-[0.65rem] font-bold text-ink-soft">
                <ShieldCheck className="h-3.5 w-3.5 text-terracotta" />
                Reviewed listings
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="container-page grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-12 lg:py-14">
        <ListingForm />

        <aside>
          <div className="sticky top-24 space-y-4">
            <div className="rounded-[1.4rem] border border-line bg-paper p-5">
              <p className="text-[0.62rem] font-bold tracking-[0.14em] text-ink-soft uppercase">
                What happens next
              </p>
              <ol className="mt-4 space-y-4">
                {[
                  {
                    title: "Send the details",
                    text: "Tell us about the room and how students can reach you.",
                  },
                  {
                    title: "We verify it",
                    text: "We review the listing and may WhatsApp you to confirm a detail.",
                  },
                  {
                    title: "It goes live",
                    text: "Approved rooms appear in search with a direct contact button.",
                  },
                ].map((item, index) => (
                  <li key={item.title} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage text-[0.62rem] font-bold text-ink">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-ink">{item.title}</p>
                      <p className="mt-0.5 text-[0.66rem] leading-5 text-ink-soft">
                        {item.text}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-[1.4rem] border border-line bg-sage/45 p-5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-terracotta" />
                <p className="text-xs font-bold text-ink">
                  Make your listing stand out
                </p>
              </div>
              <ul className="mt-3 space-y-2.5">
                {[
                  "Lead with the nearest college or landmark.",
                  "Say what the rent includes: water, WiFi, meals.",
                  "Add bright, current photos if you can.",
                  "Be clear about house rules and the deposit.",
                ].map((tip) => (
                  <li
                    key={tip}
                    className="flex gap-2 text-[0.68rem] leading-5 text-ink-soft"
                  >
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink/60" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {!connected && (
              <div className="rounded-[1.4rem] border border-butter bg-butter/25 p-5">
                <div className="flex items-center gap-2">
                  <CircleHelp className="h-4 w-4 text-terracotta" />
                  <p className="text-xs font-bold text-ink">
                    Google Sheet not connected
                  </p>
                </div>
                <p className="mt-2 text-[0.66rem] leading-5 text-ink-soft">
                  This preview is showing sample rooms. Add your Apps Script URL
                  and write token to <code>.env.local</code> to save new
                  listings. The setup guide is in <code>README.md</code>.
                </p>
              </div>
            )}

            <div className="rounded-[1.4rem] border border-line bg-paper p-5">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-terracotta" />
                <p className="text-xs font-bold text-ink">Photo tips</p>
              </div>
              <p className="mt-2 text-[0.66rem] leading-5 text-ink-soft">
                Use direct image links that end in .jpg, .png, or .webp. A
                Google Drive share link may not display, so use the direct
                image URL instead.
              </p>
            </div>

            <div className="flex items-start gap-2.5 rounded-[1.4rem] border border-line bg-cream p-4">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" />
              <p className="text-[0.66rem] leading-5 text-ink-soft">
                Need help with your listing?{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="font-bold text-ink underline decoration-line underline-offset-4"
                >
                  Email us
                </a>
              </p>
            </div>

            <Link
              href="/rooms"
              className="inline-flex items-center gap-1.5 px-1 text-xs font-semibold text-ink-soft transition hover:text-terracotta"
            >
              See how live listings look
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
