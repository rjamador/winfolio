import { useMutation } from '@tanstack/react-query'
import { submitContact } from '../api/submitContact'

/** Mutation for sending the contact form. */
export function useContactSubmit() {
  return useMutation({ mutationFn: submitContact })
}
