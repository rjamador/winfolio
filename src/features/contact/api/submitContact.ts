import type { ContactForm } from './schemas'

const SIMULATED_DELAY_MS = 500

/**
 * Simulated contact submission (hybrid). Resolves after a short delay so the UI
 * can show a pending → success flow.
 * (e.g. Formspree / an API endpoint) — the form and hook stay the same.
 */
export async function submitContact(_data: ContactForm): Promise<void> {
  // Phase 10: await apiPost('/contact', _data)
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS))
}
