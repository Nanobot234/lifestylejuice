import { CartItem } from "@/types";

// Simple US state-based shipping zones. Adjust later when you have a real carrier.
// Zone 1 ≈ in/near base (NY/NJ area), Zone 2 ≈ east coast / midwest, Zone 3 ≈ rest of US.
const ZONE_1 = new Set(["NY", "NJ", "CT", "PA", "MA", "RI", "DE"]);
const ZONE_2 = new Set([
  "MD", "DC", "VA", "NH", "VT", "ME", "OH", "MI", "IN", "IL", "WI",
  "KY", "WV", "NC", "SC", "GA", "TN", "FL", "AL", "MS",
]);

export function getShippableItems(cart: CartItem[]): CartItem[] {
  return cart.filter((i) => i.isShippable);
}

export function hasShippableItems(cart: CartItem[]): boolean {
  return cart.some((i) => i.isShippable);
}

/**
 * Returns the shipping fee in USD for the shippable portion of the cart.
 * - Free shipping when shippable subtotal is $75+
 * - Base $9.99 for the first jar, +$3 per additional jar
 * - Zone multiplier by US state (1.0 / 1.15 / 1.30)
 */
export function calculateShipping(cart: CartItem[], state?: string): number {
  const shippable = getShippableItems(cart);
  if (shippable.length === 0) return 0;

  const subtotal = shippable.reduce((s, i) => s + i.price * i.quantity, 0);
  if (subtotal >= 75) return 0;

  const totalUnits = shippable.reduce((s, i) => s + i.quantity, 0);
  const base = 9.99 + Math.max(0, totalUnits - 1) * 3;

  const code = (state || "").trim().toUpperCase();
  let zoneMultiplier = 1.3; // default to furthest zone until we know
  if (ZONE_1.has(code)) zoneMultiplier = 1.0;
  else if (ZONE_2.has(code)) zoneMultiplier = 1.15;

  return Math.round(base * zoneMultiplier * 100) / 100;
}

export const US_STATES: { code: string; name: string }[] = [
  { code: "AL", name: "Alabama" }, { code: "AK", name: "Alaska" }, { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" }, { code: "CA", name: "California" }, { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" }, { code: "DE", name: "Delaware" }, { code: "DC", name: "D.C." },
  { code: "FL", name: "Florida" }, { code: "GA", name: "Georgia" }, { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" }, { code: "IL", name: "Illinois" }, { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" }, { code: "KS", name: "Kansas" }, { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" }, { code: "ME", name: "Maine" }, { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" }, { code: "MI", name: "Michigan" }, { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" }, { code: "MO", name: "Missouri" }, { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" }, { code: "NV", name: "Nevada" }, { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" }, { code: "NM", name: "New Mexico" }, { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" }, { code: "ND", name: "North Dakota" }, { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" }, { code: "OR", name: "Oregon" }, { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" }, { code: "SC", name: "South Carolina" }, { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" }, { code: "TX", name: "Texas" }, { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" }, { code: "VA", name: "Virginia" }, { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" }, { code: "WI", name: "Wisconsin" }, { code: "WY", name: "Wyoming" },
];