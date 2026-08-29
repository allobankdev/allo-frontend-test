import { z } from "zod";

export const ScapeXPaginationMetaSchema = z.object({
  totalDocs: z.number(),
  offset: z.number(),
  limit: z.number(),
  totalPages: z.number(),
  page: z.number(),
  pagingCounter: z.number(),
  hasPrevPage: z.boolean(),
  hasNextPage: z.boolean(),
  prevPage: z.number().nullable(),
  nextPage: z.number().nullable(),
});

export type ScapeXPaginationMetaSchema = z.infer<typeof ScapeXPaginationMetaSchema>