import { z } from 'zod'

/** Shape + validation for the contact form (shared by the form and the type). */
export const contactSchema = z.object({
  name: z.string().min(1, 'Please enter your name.'),
  email: z.email('Please enter a valid email.'),
  message: z.string().min(1, 'Please enter a message.'),
})

export type ContactForm = z.infer<typeof contactSchema>
