import { z } from 'zod'

/** Canonical shape of a portfolio project (single source of truth for the type). */
export const projectSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  tech: z.array(z.string()),
  url: z.url().optional(),
  repoUrl: z.url().optional(),
  featured: z.boolean().default(false),
  year: z.number().int(),
})

export const projectListSchema = z.array(projectSchema)

export type Project = z.infer<typeof projectSchema>
