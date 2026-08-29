import { z } from "zod";
import { ScapeXPaginationMetaSchema } from "./common.schema";
/* ---------- Reusable Units ---------- */
const lengthSchema = z.object({
  meters: z.number().nullable().optional(),
  feet: z.number().nullable().optional(),
});

const thrustSchema = z.object({
  kN: z.number().nullable().optional(),
  lbf: z.number().nullable().optional(),
});

/* ---------- Rocket Schema ---------- */
export const RocketSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  type: z.string().optional(),
  active: z.boolean().optional(),
  stages: z.number().optional(),
  boosters: z.number().optional(),
  cost_per_launch: z.number().optional(),
  success_rate_pct: z.number().optional(),
  first_flight: z.string().optional(),
  country: z.string().optional(),
  company: z.string().optional(),

  height: lengthSchema.optional(),
  diameter: lengthSchema.optional(),

  mass: z
    .object({
      kg: z.number().nullable().optional(),
      lb: z.number().nullable().optional(),
    })
    .optional(),

  payload_weights: z.array(z.unknown()).optional(),

  first_stage: z
    .object({
      reusable: z.boolean().optional(),
      engines: z.number().optional(),
      fuel_amount_tons: z.number().optional(),
      burn_time_sec: z.number().nullable().optional(),
      thrust_sea_level: thrustSchema.optional(),
      thrust_vacuum: thrustSchema.optional(),
    })
    .optional(),

  second_stage: z
    .object({
      reusable: z.boolean().optional(),
      engines: z.number().optional(),
      fuel_amount_tons: z.number().optional(),
      burn_time_sec: z.number().nullable().optional(),
      thrust: thrustSchema.optional(),

      payloads: z
        .object({
          option_1: z.string().optional(),
          composite_fairing: z
            .object({
              height: lengthSchema.optional(),
              diameter: lengthSchema.optional(),
            })
            .optional(),
        })
        .optional(),
    })
    .optional(),

  engines: z
    .object({
      number: z.number().optional(),
      type: z.string().optional(),
      version: z.string().optional(),
      layout: z.string().nullable().optional(),
      isp: z
        .object({
          sea_level: z.number().optional(),
          vacuum: z.number().optional(),
        })
        .optional(),
      engine_loss_max: z.number().nullable().optional(),
      propellant_1: z.string().optional(),
      propellant_2: z.string().optional(),
      thrust_sea_level: thrustSchema.optional(),
      thrust_vacuum: thrustSchema.optional(),
      thrust_to_weight: z.number().optional(),
    })
    .optional(),

  landing_legs: z
    .object({
      number: z.number().optional(),
      material: z.unknown().optional(),
    })
    .optional(),

  flickr_images: z.array(z.string()).optional(),
  wikipedia: z.string().optional(),
  description: z.string().optional(),
});

export type Rocket = z.infer<typeof RocketSchema>;

export const RocketQuerySchema = z
  .object({
    docs: RocketSchema.array().default([]),
  })
  .merge(ScapeXPaginationMetaSchema);

export type RocketQuery = z.infer<typeof RocketQuerySchema>;

export const RocketSourceTypeSchema = z.enum(["LOCALE", "API"]);

export const DisplayRocketSchema = z
  .object({
    sourceType: RocketSourceTypeSchema.default("API"),
  })
  .merge(RocketSchema);

export type DisplayRocket = z.infer<typeof DisplayRocketSchema>;