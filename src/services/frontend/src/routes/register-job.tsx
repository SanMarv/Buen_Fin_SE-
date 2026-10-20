import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { Footer } from '#/components/Footer'
import { Header } from '#/components/Header'
import { Button } from '#/components/ui/button.tsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select.tsx'
import { CITIES } from 'lib/schemas'
import type { NewJob, State } from 'lib/schemas'

export const Route = createFileRoute('/register-job')({
  component: RouteComponent,
})

const estados = Object.keys(CITIES) as State[]

const inputClass =
  'w-full rounded-xl border border-input bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50'

const triggerClass =
  'w-full rounded-xl border border-input bg-background px-4 text-base text-foreground data-[size=default]:h-12'

function RouteComponent() {
  const [name, setName] = useState('')
  const [estado, setEstado] = useState<State | null>(null)
  const [ciudad, setCiudad] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const ciudades = estado ? (CITIES[estado] ?? []) : []

  function handleEstado(value: State) {
    setEstado(value)
    setCiudad('')
  }

  function resetForm() {
    setName('')
    setEstado(null)
    setCiudad('')
    setDescription('')
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitError('')
    setIsSuccess(false)
    setIsSubmitting(true)

    const job: NewJob = {
      name,
      description,
      location: { city: ciudad, state: estado as State },
    }
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(job),
      })
      if (response.ok) {
        setIsSuccess(true)
        resetForm()
        return
      }

      setSubmitError(
        response.status === 400
          ? 'Revisa los datos de la vacante.'
          : response.status === 401 || response.status === 403
            ? 'Inicia sesión para registrar una vacante.'
            : 'No se pudo registrar la vacante. Intenta de nuevo.',
      )
    } catch {
      setSubmitError('No hay conexión con el servidor. Intenta de nuevo.')
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
            Registrar vacante
          </h1>
        </div>
      </section>
      <main className="bg-background px-4 py-8">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-lg flex-col gap-5 rounded-3xl border border-border bg-card p-6 text-card-foreground"
        >
          <div className="flex flex-col gap-1.5">
            <label htmlFor="job-name" className="text-sm font-semibold">
              Nombre de la vacante <span aria-hidden="true"></span>
            </label>
            <input
              id="job-name"
              type="text"
              required
              className={inputClass}
              placeholder="Ej. Cajero"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="job-estado" className="text-sm font-semibold">
              Estado <span aria-hidden="true"></span>
            </label>
            <Select required value={estado ?? ''} onValueChange={handleEstado}>
              <SelectTrigger id="job-estado" className={triggerClass}>
                <SelectValue placeholder="Selecciona un estado" />
              </SelectTrigger>
              <SelectContent position="popper">
                {estados.map((nombre) => (
                  <SelectItem key={nombre} value={nombre}>
                    {nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="job-ciudad" className="text-sm font-semibold">
              Ciudad <span aria-hidden="true"></span>
            </label>
            <Select
              required
              value={ciudad}
              onValueChange={setCiudad}
              disabled={!estado}
            >
              <SelectTrigger id="job-ciudad" className={triggerClass}>
                <SelectValue
                  placeholder={
                    estado ? 'Selecciona una ciudad' : 'Primero elige un estado'
                  }
                />
              </SelectTrigger>
              <SelectContent position="popper">
                {ciudades.map(({ city }) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="job-description" className="text-sm font-semibold">
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
            />
          </div>

          {submitError && (
            <p role="alert" className="text-sm text-destructive">
              {submitError}
            </p>
          )}

          {isSuccess && (
            <p role="status" className="text-sm font-semibold text-success">
              Vacante registrada correctamente.
            </p>
          )}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Registrando...' : 'Registrar vacante'}
          </Button>
        </form>
      </main>

      <Footer />
    </>
  )
}
