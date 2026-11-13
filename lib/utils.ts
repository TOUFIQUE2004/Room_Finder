export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

export function formatINR(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatAvailable(value: string): string {
  if (!value || value.toLowerCase() === "immediately") return "Available now";

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return `Available ${new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date)}`;
}

export function getWhatsAppUrl(phone: string, roomTitle: string): string {
  const digits = phone.replace(/\D/g, "");
  const message = `Hi! I found "${roomTitle}" on Serampore Rooms and would like to know more about the room.`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function getMapEmbedUrl(query: string): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

export function getMapLink(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function makeListingId(): string {
  return `SER-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;
}
