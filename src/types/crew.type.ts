import type { srcObject } from "vuetify/lib/components/VImg/VImg.mjs";

export interface Crew {
  id: string;
  name?: string | null;
  status: "active" | "inactive" | "retired" | "unknown";
  agency?: string | null;
  image?: string | srcObject;
  wikipedia?: string | null;
  launches: string[];
}
