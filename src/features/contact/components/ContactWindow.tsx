import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button95, MessageBox, TextArea, TextInput } from '@/components/win95'
import { contactSchema, type ContactForm } from '../api/schemas'
import { useContactSubmit } from '../hooks/useContactSubmit'

type ResultDialog = 'success' | 'error' | null

/** Contact form: react-hook-form + Zod validation + a simulated submit mutation. */
export function ContactWindow() {
  const { control, handleSubmit, reset, formState } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', message: '' },
  })
  const mutation = useContactSubmit()
  const [dialog, setDialog] = useState<ResultDialog>(null)

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data, {
      onSuccess: () => {
        reset()
        setDialog('success')
      },
      onError: () => setDialog('error'),
    })
  })

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 text-w95" noValidate>
      <Field label="Name" htmlFor="contact-name" error={formState.errors.name?.message}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextInput
              id="contact-name"
              value={field.value}
              onChange={field.onChange}
              placeholder="Your name"
            />
          )}
        />
      </Field>

      <Field label="Email" htmlFor="contact-email" error={formState.errors.email?.message}>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextInput
              id="contact-email"
              type="email"
              value={field.value}
              onChange={field.onChange}
              placeholder="you@example.com"
            />
          )}
        />
      </Field>

      <Field
        label="Message"
        htmlFor="contact-message"
        error={formState.errors.message?.message}
      >
        <Controller
          name="message"
          control={control}
          render={({ field }) => (
            <TextArea
              id="contact-message"
              value={field.value}
              onChange={field.onChange}
              placeholder="Say hi…"
              rows={4}
            />
          )}
        />
      </Field>

      <div>
        <Button95 type="submit" variant="primary" disabled={mutation.isPending}>
          {mutation.isPending ? 'Sending…' : 'Send'}
        </Button95>
      </div>

      <MessageBox
        open={dialog === 'success'}
        title="Message sent"
        message="Thanks! Your message has been sent."
        onOk={() => setDialog(null)}
        onClose={() => setDialog(null)}
      />
      <MessageBox
        open={dialog === 'error'}
        title="Error"
        icon="✖"
        message="Something went wrong. Please try again."
        onOk={() => setDialog(null)}
        onClose={() => setDialog(null)}
      />
    </form>
  )
}

type FieldProps = {
  label: string
  htmlFor: string
  error?: string
  children: React.ReactNode
}

function Field({ label, htmlFor, error, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-0.5 block">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-0.5 text-w95-titlebar">
          {error}
        </p>
      )}
    </div>
  )
}
