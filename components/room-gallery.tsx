"use client";

import { ChevronLeft, ChevronRight, Expand, Info, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function RoomGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const total = images.length;

  useEffect(() => {
    if (!lightbox) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setLightbox(false);
      if (event.key === "ArrowRight") setActive((index) => (index + 1) % total);
      if (event.key === "ArrowLeft")
        setActive((index) => (index - 1 + total) % total);
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lightbox, total]);

  const sideImages = images.slice(1, 3);

  return (
    <>
      <div className="grid overflow-hidden rounded-[1.5rem] border border-line bg-mist md:grid-cols-[1.65fr_1fr] md:gap-1.5">
        <button
          type="button"
          onClick={() => setLightbox(true)}
          className="group relative aspect-[4/3] overflow-hidden bg-mist md:aspect-auto md:min-h-[27rem]"
          aria-label="Open photo gallery"
        >
          <img
            src={images[active]}
            alt={`${title} — photo ${active + 1}`}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]"
          />
          <span className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-ink/80 px-3 py-1.5 text-[0.64rem] font-bold text-cream backdrop-blur">
            <Expand className="h-3.5 w-3.5" />
            View photos · {active + 1}/{total}
          </span>
        </button>

        <div className="hidden grid-rows-2 gap-1.5 md:grid">
          {sideImages.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => {
                setActive(index + 1);
                setLightbox(true);
              }}
              className="group relative min-h-[13rem] overflow-hidden bg-mist"
              aria-label={`Open photo ${index + 2}`}
            >
              <img
                src={src}
                alt={`${title} — photo ${index + 2}`}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
              />
              {index === sideImages.length - 1 && total > 3 && (
                <span className="absolute inset-0 flex items-center justify-center bg-ink/45 font-display text-lg font-semibold text-cream">
                  +{total - 3} more
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide md:hidden">
        {images.map((src, index) => (
          <button
            key={`${src}-thumb`}
            type="button"
            onClick={() => setActive(index)}
            className={cn(
              "relative h-16 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-mist transition",
              active === index ? "border-terracotta" : "border-transparent opacity-70",
            )}
            aria-label={`Show photo ${index + 1}`}
          >
            <img
              src={src}
              alt=""
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>

      <p className="mt-3 flex items-start gap-1.5 text-[0.68rem] leading-5 text-ink-soft">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Images are representative and may not show the actual room.
      </p>

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-ink/95 p-4 text-cream backdrop-blur-sm sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} photo gallery`}
        >
          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="text-xs font-semibold tracking-wide text-cream/65">
              {active + 1} / {total}
            </p>
            <button
              type="button"
              onClick={() => setLightbox(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 bg-cream/10 transition hover:bg-cream/20"
              aria-label="Close gallery"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center">
            <button
              type="button"
              onClick={() =>
                setActive((index) => (index - 1 + total) % total)
              }
              className="absolute left-0 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 bg-ink/50 transition hover:bg-cream/15 sm:left-3"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <img
              src={images[active]}
              alt={`${title} — enlarged photo ${active + 1}`}
              className="max-h-full max-w-full rounded-2xl object-contain"
            />
            <button
              type="button"
              onClick={() => setActive((index) => (index + 1) % total)}
              className="absolute right-0 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 bg-ink/50 transition hover:bg-cream/15 sm:right-3"
              aria-label="Next photo"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          <div className="mt-4 flex justify-center gap-2 overflow-x-auto pb-2">
            {images.map((src, index) => (
              <button
                key={`${src}-lightbox-thumb`}
                type="button"
                onClick={() => setActive(index)}
                className={cn(
                  "h-12 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition",
                  active === index
                    ? "border-butter"
                    : "border-transparent opacity-50 hover:opacity-80",
                )}
                aria-label={`Show photo ${index + 1}`}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>

          <p className="mt-2 text-center text-[0.68rem] text-cream/55">
            Representative image, not the actual room.
          </p>
        </div>
      )}
    </>
  );
}
