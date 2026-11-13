"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ImagePlus,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  AMENITIES,
  FURNISHINGS,
  GENDERS,
  ROOM_TYPES,
  SERAMPORE_AREAS,
} from "@/lib/constants";
import type { ListingSubmission } from "@/lib/types";
import { cn } from "@/lib/utils";
import { validateListing } from "@/lib/validation";

type FormState = {
  title: string;
  area: string;
  address: string;
  rent: string;
  deposit: string;
  roomType: string;
  gender: string;
  furnishing: string;
  availableFrom: string;
  description: string;
  amenities: string[];
  image1: string;
  image2: string;
  image3: string;
  ownerName: string;
  whatsapp: string;
  phone: string;
  mapQuery: string;
  consent: boolean;
  website: string;
};

const initialForm: FormState = {
  title: "",
  area: "",
  address: "",
  rent: "",
  deposit: "",
  roomType: "single",
  gender: "coed",
  furnishing: "semi-furnished",
  availableFrom: "",
  description: "",
  amenities: ["WiFi", "Bed", "Study table", "Wardrobe"],
  image1: "",
  image2: "",
  image3: "",
  ownerName: "",
  whatsapp: "",
  phone: "",
  mapQuery: "",
  consent: false,
  website: "",
};

const steps = [
  { title: "Room basics", caption: "The essentials" },
  { title: "Details & amenities", caption: "Help students picture it" },
  { title: "Contact & publish", caption: "How to reach you" },
];

const stepFields: (keyof FormState)[][] = [
  [
    "title",
    "area",
    "address",
    "rent",
    "deposit",
    "roomType",
    "gender",
    "furnishing",
  ],
  ["availableFrom", "description", "amenities", "image1", "image2", "image3"],
  ["ownerName", "whatsapp", "phone", "mapQuery", "consent"],
];

const inputClass =
  "mt-1.5 w-full rounded-xl border border-line bg-paper px-3.5 py-3 text-sm font-medium text-ink outline-none transition placeholder:text-ink-soft/50 focus:border-ink/40 focus:ring-2 focus:ring-ink/10";
const labelClass =
  "text-[0.64rem] font-bold tracking-[0.12em] text-ink-soft uppercase";

function toSubmission(form: FormState): ListingSubmission {
  return {
    title: form.title,
    area: form.area,
    address: form.address,
    rent: Number(form.rent),
    deposit: Number(form.deposit || 0),
    roomType: form.roomType,
    gender: form.gender,
    furnishing: form.furnishing,
    availableFrom: form.availableFrom,
    description: form.description,
    amenities: form.amenities,
    images: [form.image1, form.image2, form.image3]
      .map((value) => value.trim())
      .filter(Boolean),
    ownerName: form.ownerName,
    whatsapp: form.whatsapp,
    phone: form.phone,
    mapQuery: form.mapQuery,
    consent: form.consent,
    website: form.website,
  };
}

function Field({
  id,
  label,
  error,
  hint,
  required,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className={labelClass}>
        {label}
        {required && <span className="ml-1 text-terracotta">*</span>}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-[0.68rem] font-medium text-terracotta">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-[0.66rem] leading-4 text-ink-soft/80">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function ListingForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submittedId, setSubmittedId] = useState("");

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => {
      if (!previous[key]) return previous;
      const next = { ...previous };
      delete next[key];
      return next;
    });
    setSubmitError("");
  }

  function toggleAmenity(amenity: string) {
    setForm((previous) => ({
      ...previous,
      amenities: previous.amenities.includes(amenity)
        ? previous.amenities.filter((item) => item !== amenity)
        : [...previous.amenities, amenity],
    }));
    setErrors((previous) => {
      if (!previous.amenities) return previous;
      const next = { ...previous };
      delete next.amenities;
      return next;
    });
  }

  function validateAndCheckStep(): boolean {
    const allErrors = validateListing(toSubmission(form));
    setErrors(allErrors);
    return !stepFields[step].some((field) => allErrors[field]);
  }

  function goNext() {
    if (!validateAndCheckStep()) return;
    setStep((current) => Math.min(current + 1, steps.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    setStep((current) => Math.max(current - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (step < steps.length - 1) {
      goNext();
      return;
    }

    const submission = toSubmission(form);
    const allErrors = validateListing(submission);
    setErrors(allErrors);

    if (Object.keys(allErrors).length > 0) {
      const firstBadStep = stepFields.findIndex((fields) =>
        fields.some((field) => allErrors[field]),
      );
      if (firstBadStep >= 0) setStep(firstBadStep);
      setSubmitError("Please check the highlighted fields and try again.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      });

      const data = (await response.json().catch(() => null)) as {
        ok?: boolean;
        listing?: { id: string };
        errors?: Record<string, string>;
        message?: string;
      } | null;

      if (!response.ok || !data?.ok) {
        setErrors(data?.errors ?? {});
        setSubmitError(
          data?.message ||
            "We could not submit your room right now. Please try again.",
        );
        return;
      }

      setSubmittedId(data.listing?.id ?? "");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setSubmitError(
        "Could not reach the server. Check your connection and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submittedId) {
    return (
      <div className="overflow-hidden rounded-[1.6rem] border border-line bg-paper p-7 text-center soft-shadow sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sage text-ink">
          <CheckCircle2 className="h-8 w-8 text-terracotta" />
        </div>
        <p className="mt-5 text-[0.62rem] font-bold tracking-[0.16em] text-ink-soft uppercase">
          Listing received
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em] text-ink">
          Your room is in the queue.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink-soft">
          We review new listings before they go live. Your reference is{" "}
          <span className="font-bold text-ink">{submittedId}</span>. Keep an eye
          on your WhatsApp — we may reach out to confirm a detail.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-2.5 sm:flex-row">
          <Link
            href="/rooms"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-cream transition hover:bg-terracotta"
          >
            Browse rooms
            <ArrowRight className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => {
              setForm(initialForm);
              setStep(0);
              setSubmittedId("");
              setErrors({});
            }}
            className="inline-flex items-center justify-center rounded-full border border-line bg-paper px-5 py-3 text-sm font-bold text-ink transition hover:border-ink/30 hover:bg-cream"
          >
            List another room
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[1.6rem] border border-line bg-paper soft-shadow">
      <div className="border-b border-line bg-cream/60 px-5 py-5 sm:px-7">
        <ol className="grid grid-cols-3 gap-2">
          {steps.map((item, index) => (
            <li key={item.title} className="min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[0.66rem] font-bold transition",
                    index < step
                      ? "bg-ink text-cream"
                      : index === step
                        ? "bg-terracotta text-white"
                        : "border border-line bg-paper text-ink-soft",
                  )}
                >
                  {index < step ? (
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  ) : (
                    index + 1
                  )}
                </span>
                <span className="hidden min-w-0 flex-col sm:flex">
                  <span
                    className={cn(
                      "truncate text-[0.66rem] font-bold",
                      index <= step ? "text-ink" : "text-ink-soft",
                    )}
                  >
                    {item.title}
                  </span>
                  <span className="truncate text-[0.58rem] text-ink-soft/70">
                    {item.caption}
                  </span>
                </span>
              </div>
              <div
                className={cn(
                  "mt-3 h-1 rounded-full",
                  index <= step ? "bg-terracotta/60" : "bg-line/70",
                )}
              />
            </li>
          ))}
        </ol>
        <p className="mt-4 text-xs font-semibold text-ink sm:hidden">
          Step {step + 1} of {steps.length}: {steps[step].title}
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="p-5 sm:p-7">
          {step === 0 && (
            <div className="animate-rise space-y-5">
              <div>
                <h2 className="font-display text-2xl font-semibold tracking-[-0.02em] text-ink">
                  Tell us about the room.
                </h2>
                <p className="mt-1.5 text-xs leading-5 text-ink-soft">
                  Start with the details a student would scan first. You can
                  refine everything before publishing.
                </p>
              </div>

              <Field
                id="title"
                label="Listing title"
                required
                error={errors.title}
                hint="Example: Sunlit single room near Serampore College"
              >
                <input
                  id="title"
                  value={form.title}
                  onChange={(event) => update("title", event.target.value)}
                  placeholder="A clear, specific title"
                  className={cn(
                    inputClass,
                    errors.title && "border-terracotta/60",
                  )}
                  maxLength={120}
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="area" label="Area" required error={errors.area}>
                  <select
                    id="area"
                    value={form.area}
                    onChange={(event) => update("area", event.target.value)}
                    className={cn(
                      inputClass,
                      errors.area && "border-terracotta/60",
                    )}
                  >
                    <option value="">Choose a locality</option>
                    {SERAMPORE_AREAS.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field
                  id="roomType"
                  label="Room type"
                  required
                  error={errors.roomType}
                >
                  <select
                    id="roomType"
                    value={form.roomType}
                    onChange={(event) =>
                      update("roomType", event.target.value)
                    }
                    className={inputClass}
                  >
                    {ROOM_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field
                id="address"
                label="Address or landmark"
                required
                error={errors.address}
                hint="Don't include your exact door number publicly. A street and landmark are enough."
              >
                <input
                  id="address"
                  value={form.address}
                  onChange={(event) => update("address", event.target.value)}
                  placeholder="Street, landmark, Serampore"
                  className={cn(
                    inputClass,
                    errors.address && "border-terracotta/60",
                  )}
                  maxLength={200}
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  id="rent"
                  label="Monthly rent (₹)"
                  required
                  error={errors.rent}
                >
                  <input
                    id="rent"
                    type="number"
                    inputMode="numeric"
                    min="1000"
                    max="200000"
                    value={form.rent}
                    onChange={(event) => update("rent", event.target.value)}
                    placeholder="6500"
                    className={cn(
                      inputClass,
                      errors.rent && "border-terracotta/60",
                    )}
                  />
                </Field>

                <Field
                  id="deposit"
                  label="Security deposit (₹)"
                  required
                  error={errors.deposit}
                >
                  <input
                    id="deposit"
                    type="number"
                    inputMode="numeric"
                    min="0"
                    max="500000"
                    value={form.deposit}
                    onChange={(event) => update("deposit", event.target.value)}
                    placeholder="13000"
                    className={cn(
                      inputClass,
                      errors.deposit && "border-terracotta/60",
                    )}
                  />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  id="gender"
                  label="Who is it for?"
                  required
                  error={errors.gender}
                >
                  <select
                    id="gender"
                    value={form.gender}
                    onChange={(event) => update("gender", event.target.value)}
                    className={inputClass}
                  >
                    {GENDERS.map((gender) => (
                      <option key={gender.value} value={gender.value}>
                        {gender.label}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field
                  id="furnishing"
                  label="Furnishing"
                  required
                  error={errors.furnishing}
                >
                  <select
                    id="furnishing"
                    value={form.furnishing}
                    onChange={(event) =>
                      update("furnishing", event.target.value)
                    }
                    className={inputClass}
                  >
                    {FURNISHINGS.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="animate-rise space-y-5">
              <div>
                <h2 className="font-display text-2xl font-semibold tracking-[-0.02em] text-ink">
                  Make it feel real.
                </h2>
                <p className="mt-1.5 text-xs leading-5 text-ink-soft">
                  Honest descriptions and a few good photos save everyone a
                  wasted visit.
                </p>
              </div>

              <Field
                id="description"
                label="Description"
                required
                error={errors.description}
                hint={`${form.description.length}/2500 characters`}
              >
                <textarea
                  id="description"
                  value={form.description}
                  onChange={(event) =>
                    update("description", event.target.value)
                  }
                  rows={6}
                  maxLength={2500}
                  placeholder="What makes the room comfortable? Mention the bathroom, water supply, study space, house rules, and what the rent includes."
                  className={cn(
                    inputClass,
                    "resize-y leading-6",
                    errors.description && "border-terracotta/60",
                  )}
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  id="availableFrom"
                  label="Available from"
                  error={errors.availableFrom}
                  hint="Leave blank if it is available immediately."
                >
                  <input
                    id="availableFrom"
                    type="date"
                    value={form.availableFrom}
                    onChange={(event) =>
                      update("availableFrom", event.target.value)
                    }
                    className={cn(
                      inputClass,
                      errors.availableFrom && "border-terracotta/60",
                    )}
                  />
                </Field>
              </div>

              <fieldset>
                <legend className={labelClass}>
                  Amenities
                  <span className="ml-1 text-terracotta">*</span>
                </legend>
                <p className="mt-1 text-[0.66rem] text-ink-soft/80">
                  Select everything included in the rent or available in the
                  building.
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {AMENITIES.map((amenity) => {
                    const checked = form.amenities.includes(amenity);
                    return (
                      <label
                        key={amenity}
                        className={cn(
                          "flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-[0.7rem] font-semibold transition",
                          checked
                            ? "border-ink/25 bg-sage/60 text-ink"
                            : "border-line bg-paper text-ink-soft hover:border-ink/20",
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition",
                            checked
                              ? "border-ink bg-ink text-cream"
                              : "border-line bg-paper",
                          )}
                        >
                          {checked && (
                            <Check className="h-2.5 w-2.5" strokeWidth={3} />
                          )}
                        </span>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleAmenity(amenity)}
                          className="sr-only"
                        />
                        {amenity}
                      </label>
                    );
                  })}
                </div>
                {errors.amenities && (
                  <p className="mt-1.5 text-[0.68rem] font-medium text-terracotta">
                    {errors.amenities}
                  </p>
                )}
              </fieldset>

              <div>
                <div className="flex items-center gap-2">
                  <ImagePlus className="h-4 w-4 text-terracotta" />
                  <p className={labelClass}>Photo links (optional)</p>
                </div>
                <p className="mt-1.5 text-[0.66rem] leading-4 text-ink-soft/80">
                  Paste direct image URLs. The first photo becomes the cover.
                  If you skip this, a clean placeholder is used.
                </p>
                <div className="mt-3 space-y-2.5">
                  {[
                    { key: "image1" as const, label: "Cover photo URL" },
                    { key: "image2" as const, label: "Photo 2 URL" },
                    { key: "image3" as const, label: "Photo 3 URL" },
                  ].map((image) => (
                    <input
                      key={image.key}
                      value={form[image.key]}
                      onChange={(event) =>
                        update(image.key, event.target.value)
                      }
                      placeholder={`${image.label} — https://…`}
                      className={cn(
                        inputClass,
                        errors.images && "border-terracotta/60",
                      )}
                      type="url"
                    />
                  ))}
                </div>
                {errors.images && (
                  <p className="mt-1.5 text-[0.68rem] font-medium text-terracotta">
                    {errors.images}
                  </p>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-rise space-y-5">
              <div>
                <h2 className="font-display text-2xl font-semibold tracking-[-0.02em] text-ink">
                  How can students reach you?
                </h2>
                <p className="mt-1.5 text-xs leading-5 text-ink-soft">
                  Your contact details are only shown on the listing after it is
                  approved.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  id="ownerName"
                  label="Your name"
                  required
                  error={errors.ownerName}
                >
                  <input
                    id="ownerName"
                    value={form.ownerName}
                    onChange={(event) =>
                      update("ownerName", event.target.value)
                    }
                    placeholder="Full name"
                    autoComplete="name"
                    className={cn(
                      inputClass,
                      errors.ownerName && "border-terracotta/60",
                    )}
                    maxLength={80}
                  />
                </Field>

                <Field
                  id="whatsapp"
                  label="WhatsApp number"
                  required
                  error={errors.whatsapp}
                  hint="10-digit Indian numbers get +91 automatically."
                >
                  <input
                    id="whatsapp"
                    type="tel"
                    value={form.whatsapp}
                    onChange={(event) =>
                      update("whatsapp", event.target.value)
                    }
                    placeholder="98300 00000"
                    autoComplete="tel"
                    className={cn(
                      inputClass,
                      errors.whatsapp && "border-terracotta/60",
                    )}
                  />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  id="phone"
                  label="Phone number (optional)"
                  error={errors.phone}
                  hint="Shown only if you want students to call."
                >
                  <input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(event) => update("phone", event.target.value)}
                    placeholder="Same as WhatsApp or another number"
                    autoComplete="tel"
                    className={cn(
                      inputClass,
                      errors.phone && "border-terracotta/60",
                    )}
                  />
                </Field>

                <Field
                  id="mapQuery"
                  label="Map location"
                  required
                  error={errors.mapQuery}
                  hint="A landmark works better than a door number."
                >
                  <input
                    id="mapQuery"
                    value={form.mapQuery}
                    onChange={(event) =>
                      update("mapQuery", event.target.value)
                    }
                    placeholder="Serampore College, Serampore"
                    className={cn(
                      inputClass,
                      errors.mapQuery && "border-terracotta/60",
                    )}
                    maxLength={200}
                  />
                </Field>
              </div>

              <input
                type="text"
                name="website"
                value={form.website}
                onChange={(event) => update("website", event.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
              />

              <label
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition",
                  errors.consent
                    ? "border-terracotta/60 bg-terracotta/5"
                    : "border-line bg-cream/60",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition",
                    form.consent
                      ? "border-ink bg-ink text-cream"
                      : "border-line bg-paper",
                  )}
                >
                  {form.consent && (
                    <Check className="h-3 w-3" strokeWidth={3} />
                  )}
                </span>
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(event) =>
                    update("consent", event.target.checked)
                  }
                  className="sr-only"
                />
                <span className="text-[0.7rem] leading-5 text-ink-soft">
                  I confirm that these details are accurate, that I am
                  authorised to list this room, and that I will not ask for any
                  payment before a student visits.
                  {errors.consent && (
                    <span className="mt-1 block font-semibold text-terracotta">
                      {errors.consent}
                    </span>
                  )}
                </span>
              </label>

              <div className="flex items-start gap-2.5 rounded-xl border border-sage bg-sage/45 p-3.5">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" />
                <p className="text-[0.66rem] leading-5 text-ink-soft">
                  Listings are reviewed before going live. We may contact you on
                  WhatsApp to verify the room. We never charge a listing fee.
                </p>
              </div>
            </div>
          )}

          {submitError && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-terracotta/30 bg-terracotta/5 px-4 py-3 text-xs font-medium text-terracotta-dark"
            >
              {submitError}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-line bg-cream/50 px-5 py-4 sm:px-7">
          {step > 0 ? (
            <button
              type="button"
              onClick={goBack}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold text-ink-soft transition hover:text-ink"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          ) : (
            <span className="text-[0.62rem] text-ink-soft">
              Takes about 4 minutes
            </span>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-full bg-terracotta px-5 py-3 text-sm font-bold text-white transition hover:bg-terracotta-dark disabled:cursor-wait disabled:opacity-70"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting…
              </>
            ) : step === steps.length - 1 ? (
              <>
                Submit for review
                <CheckCircle2 className="h-4 w-4" />
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
