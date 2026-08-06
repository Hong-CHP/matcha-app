import { z } from 'zod'

export const suggestQueryParamsSchema = z.object({
    limit: z.number().int().min(1).max(100).default(20),
    offset: z.number().int().min(0).default(0),
    sort: z.enum(["age", "distance", "fame", "tags"]).optional(),
    order: z.enum(["asc", "desc"]).optional()
})

export type SuggestQueryParamsValues = z.infer<typeof suggestQueryParamsSchema>