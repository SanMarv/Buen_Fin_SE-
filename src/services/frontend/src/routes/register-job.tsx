import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
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
import { CITIES, errorSchema, validateJobInput } from 'lib/schemas'
import type { NewJob, State } from 'lib/schemas'
import { env } from '#/config/env'
import { Toaster } from '#/components/ui/sonner'
import { noContentError, successNoContent, type NoContentResult } from '../../../../lib/types/generics'
import { toast } from 'sonner'

export const Route = createFileRoute('/register-job')({
  component: RouteComponent,
})

const estados = Object.keys(CITIES) as State[]

const JOB_ERROR_MESSAGES: Record<string, string> = {
  NOT_PROVIDED: 'Completa todos los campos',
  MAX_LENGTH: 'Uno de los campos es muy largo',
  ERROR_LINK: 'El enlace no es válido',
  MISMATCH: 'La ciudad no pertenece al estado seleccionado',
  INVALID_STATE: 'Selecciona un estado válido'
}

const inputClass =
  'w-full rounded-xl border border-input bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50'

const triggerClass =
  'w-full rounded-xl border border-input bg-background px-4 text-base text-foreground data-[size=default]:h-12'

function RouteComponent() {
  const router = useRouter()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [estado, setEstado] = useState<State | null>(null)
  const [ciudad, setCiudad] = useState('')
  const [description, setDescription] = useState('')
  const [link, setLink] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    setLink('')
  }

  async function sendJobData(job: NewJob): Promise<NoContentResult>{
    try {
      const res = await fetch(`${env.VITE_BACK_BASE}/jobs/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(job),
      })

      if (res.ok) return successNoContent()

      const parsedError = errorSchema.safeParse(await res.json().catch(() => null))
      return noContentError({
        status: res.status,
        error: parsedError.success ? parsedError.data.error: 'Error desconocido'
      })
    }
    catch {
      return noContentError({
        status: 500,
        error: 'Error interno del servidor'
      })
    }
  }

  const toJobMessage = (error: string) => {
    const code = error.split(': ').at(-1) ?? error
    return JOB_ERROR_MESSAGES[code]?? 'Revisa que los datos de el puesto sean correctos'
  }
  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    const job: NewJob = {
      name,
      description,
      location: { city: ciudad, state: estado as State },
      link,
    }

    const parsed = validateJobInput.safeParse(job)
    if (!parsed.success) {
      toast.error(toJobMessage(parsed.error.issues[0].message), { position: 'bottom-center' })
      return
    }
    try {
      const { success: ok, status, error } = await sendJobData(job);
      if (ok) {
        toast.success('Puesto registrado', {position: 'bottom-center'})
        resetForm()
        router.history.back()
        return
      }

      switch (status) {
        case 400:
          toast.error(toJobMessage(error), { position: 'bottom-center' })
          return
        case 401:
          toast.error('Inicia sesión para registrar un puesto', { position: 'bottom-center' })
          navigate({ to: '/login' })
          return
        case 403:
          if (error === 'Unauthorized') {
            toast.error('Tu sesión expiró', { position: 'bottom-center' })
            navigate({to: '/login'})
          }
          else {
            toast.error('Vuelve a entrar desde la página de tu empresa', {position: 'bottom-center'})
          }
          return
        default:
          toast.error('No se pudo registrar un puesto, intenta de nuevo', { position: 'bottom-center' })
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

          <div className="flex flex-col gap-1.5">
            <label htmlFor="job-link" className="text-sm font-semibold">
              Enlace para postularse <span aria-hidden="true"></span>
            </label>
            <input
              id="job-link"
              type="url"
              required
              className={inputClass}
              placeholder="https://ejemplo.com/vacante"
              value={link}
              onChange={(event) => setLink(event.target.value)}/>
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Registrando...' : 'Registrar vacante'}
          </Button>
        </form>
      </main>
      <Toaster/>
      <Footer />
    </>
  )
}
