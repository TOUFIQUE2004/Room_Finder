import { ArrowLeft, Search } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-page flex min-h-[62vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-display text-[5rem] leading-none font-semibold tracking-[-0.06em] text-terracotta/25 sm:text-[7rem]">
        404
      </p>
      <h1 className="-mt-3 font-display text-3xl font-semibold tracking-[-0.03em] text-ink sm:text-4xl">
        This room has moved on.
      </h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-ink-soft">
        The page you were looking for is not here. It may have been rented out,
        removed by the owner, or the link may be incomplete.
      </p>
      <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
        <Link
          href="/rooms"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-cream transition hover:bg-terracotta"
        >
          <Search className="h-4 w-4" />
          Find another room
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-paper px-5 py-3 text-sm font-bold text-ink transition hover:border-ink/30"
        >
          <ArrowLeft className="h-4 w-4" />
          Back home
        </Link>
      </div>
    </section>
  );
}
