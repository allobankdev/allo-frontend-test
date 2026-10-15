/**
 * src/features/rockets/types.ts
 */

export interface Rocket {
  id: number;
  name: string;
  description: string;
  imageUrl: string | null;
  launchCost: string | null;
  countryCode: string;
  maidenFlight: string | null;
}
