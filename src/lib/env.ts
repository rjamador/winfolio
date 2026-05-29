import { z } from 'zod'

/**
 * Runtime environment schema.
 *
 * Every client-exposed variable is validated here ONCE at startup so the app
 * fails fast with a clear message instead of breaking deep in a component.
 * Add new `VITE_*` vars to this schema as features need them
 * connects a real API via `VITE_API_BASE_URL`).
 */
const envSchema = z.object({
  // Optional until a real backend is wired up (hybrid data approach).
  VITE_API_BASE_URL: z.url().optional(),
})

const parsed = envSchema.safeParse(import.meta.env)

if (!parsed.success) {
  // Fail fast and loud: misconfigured env should never reach the UI.
  console.error('Invalid environment variables:', z.treeifyError(parsed.error))
  throw new Error('Invalid environment variables. See .env.example.')
}

export const env = parsed.data
