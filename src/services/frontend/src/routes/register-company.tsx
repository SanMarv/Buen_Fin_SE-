import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { Footer } from '#/components/Footer'
import { Header } from '#/components/Header'
import { Button } from '#/components/ui/button.tsx'
import { errorSchema } from 'lib/schemas'
import type { ApiError } from 'lib/schemas'
import { fail, success } from 'lib/types'
import type { PromiseResult } from 'lib/types'
import { env } from '#/config/env'
import { toast } from 'sonner'
import { Toaster } from '#/components/ui/sonner'

export const Route = createFileRoute('/register-company')({
  component: RouteComponent,
})

const errorMessages = {
  es_name: 'Hace falta el nombre de la empresa',
  es_rfc: 'Hace falta el RFC de la empresa',
  es_invalid_rfc: 'El RFC no es válido',
  es_unauthorized: 'Sin sesión',
  es_default: 'Ocurrió un error, revisa bien los parámetros',
}

const isValidRfc = (value: string) =>
  /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/i.test(value.trim())

const inputClass =
  'w-full rounded-xl border border-input bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50'

function RouteComponent() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [RFC, setRFC] = useState('')
  const [description, setDescription] = useState('')
  const [nameError, setNameError] = useState('')
  const [rfcError, setRfcError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function sendData(body: {
    name: string
    rfc: string
    description: string
  }): PromiseResult<{ id: string }, ApiError> {
    try {
      const json_body = JSON.stringify(body)
      const res = await fetch(`${env.VITE_BACK_BASE}/companies/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: json_body,
        credentials: 'include',
      })

      if (res.ok) {
        return success(await res.json())
      }

      const parsed = errorSchema.safeParse(await res.json().catch(() => null))

      if (parsed.success) return fail(parsed.data)

      return fail({ status: res.status, error: 'Error desconocido' })
    } catch {
      return fail({ status: 500, error: 'Error desconocido' })
    }
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitting) return

    const missingName = !name.trim()
    const missingRfc = !RFC.trim()
    const invalidRfc = !missingRfc && !isValidRfc(RFC)

    setNameError(missingName ? errorMessages.es_name : '')
    setRfcError(
      missingRfc
        ? errorMessages.es_rfc
        : invalidRfc
          ? errorMessages.es_invalid_rfc
          : '',
    )
    if (missingName || missingRfc || invalidRfc) return

    const body = { name: name, description: description, rfc: RFC }

    setIsSubmitting(true)

    try {
      const { success: ok, data, error } = await sendData(body)
      if (ok) {
        toast.success('Empresa registrada', { position: 'bottom-center' })
        navigate({
          to: '/business-profile/$companyId',
          params: { companyId: data.id },
        })
        return
      }

      switch (error.status) {
        case 401:
          toast.error(error.error, { position: 'bottom-center' })
          navigate({ to: '/login' })
          return
        case 403:
          toast.error(errorMessages.es_unauthorized, {
            position: 'bottom-center',
          })
          navigate({ to: '/login' })
          return
        case 400:
          toast.error(error.error, { position: 'bottom-center' })
          return
        default:
          toast.error(errorMessages.es_default, {
            position: 'bottom-center',
          })
          return
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Header />
      <section className="relative overflow-hidden bg-primary px-4 py-8 text-primary-foreground">
        <div className="absolute -top-10 -right-10 size-32 rounded-full bg-accent" />
        <div className="relative">
          <h1 className="text-3xl leading-tight font-extrabold">
            Registrar empresa
          </h1>
        </div>
      </section>
      <main className="bg-background px-4 py-8">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="mx-auto flex max-w-lg flex-col gap-5 rounded-3xl border border-border bg-card p-6 text-card-foreground"
        >
          <div className="flex flex-col gap-1.5">
            <label htmlFor="company-name" className="text-sm font-semibold">
              Nombre de la empresa <span aria-hidden="true"></span>
            </label>
            <input
              id="company-name"
              type="text"
              required
              className={`${inputClass} ${nameError ? 'border-destructive' : ''}`}
              placeholder="Ej. Coca Cola"
              value={name}
              aria-invalid={!!nameError}
              aria-describedby={nameError ? 'company-name-error' : undefined}
              onBlur={() => {
                if (!name.trim()) setNameError(errorMessages.es_name)
              }}
              onChange={(event) => {
                const value = event.target.value
                setName(value)
                if (value.trim()) setNameError('')
              }}
              maxLength={30}
            />
            {nameError && (
              <p
                id="company-name-error"
                role="alert"
                className="flex justify-center text-[11px] font-medium"
              >
                <span className="rounded-full bg-destructive px-[10px] py-[3px] leading-[1.2] text-center text-white">
                  {nameError}
                </span>
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="company-rfc" className="text-sm font-semibold">
              RFC de la empresa <span aria-hidden="true"></span>
            </label>
            <input
              id="company-rfc"
              type="text"
              required
              className={`${inputClass} ${rfcError ? 'border-destructive' : ''}`}
              value={RFC}
              aria-invalid={!!rfcError}
              aria-describedby={rfcError ? 'company-rfc-error' : undefined}
              onBlur={() => {
                if (!RFC.trim()) {
                  setRfcError(errorMessages.es_rfc)
                } else if (!isValidRfc(RFC)) {
                  setRfcError(errorMessages.es_invalid_rfc)
                }
              }}
              onChange={(event) => {
                const value = event.target.value.toUpperCase()
                setRFC(value)
                if (isValidRfc(value)) setRfcError('')
                else if (!value.trim()) setRfcError('')
              }}
            />
            {rfcError && (
              <p
                id="company-rfc-error"
                role="alert"
                className="flex justify-center text-[11px] font-medium"
              >
                <span className="rounded-full bg-destructive px-[10px] py-[3px] leading-[1.2] text-center text-white">
                  {rfcError}
                </span>
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="company-description"
              className="text-sm font-semibold"
            >
              Descripción <span aria-hidden="true"></span>
            </label>
            <textarea
              rows={1}
              className={`${inputClass} resize-none overflow-hidden`}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              onInput={(event) => {
                const textarea = event.currentTarget
                textarea.style.height = 'auto'
                textarea.style.height = `${textarea.scrollHeight}px`
              }}
              maxLength={280}
            />
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Registrando...' : 'Registrar empresa'}
          </Button>
        </form>
      </main>
      <Toaster />
      <Footer />
    </>
  )
}
