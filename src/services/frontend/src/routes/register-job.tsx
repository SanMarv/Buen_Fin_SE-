import { createFileRoute } from '@tanstack/react-router'
import * as React from 'react'
import { Footer } from '#/components/Footer'
import { Header } from '#/components/Header'
import { Button } from '#/components/ui/button.tsx'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '#/components/ui/select.tsx'
import { CITIES } from 'lib/schemas'
import type { NewJob, State } from 'lib/schemas'

export const Route = createFileRoute('/register-job')({
  component: RouteComponent,
})

const estados = Object.keys(CITIES)

const inputClass = 'w-full rounded-xl border-2 border-neutral-200 bh-white px-4 py-3 text-base text-neutral-900 outline-none placeholder:text-neutral-400 focus-visible:ring-[3px] focus-visible:ring-ring/50'
const triggerClass = 'w-full rounded-2xl border-2 border-neutral-300 bg-neutral-50 px-4 text-base data-[size=default]:h-12'

function RouteComponent() {
  const [name, setName] = React.useState('')
  const [estado, setEstado] = React.useState('')
  const [ciudad, setCiudad] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submitError, setSubmitError] = React.useState('')
  const [isSuccess, setIsSuccess] = React.useState(false)

  const ciudades = estado ? ((CITIES as Record<string,readonly string[]>)[estado] ?? []) : []

  function handleEstado(value: string){
    setEstado(value)
    setCiudad('')
  }

  function resetForm(){
    setName('')
    setEstado('')
    setCiudad('')
    setDescription('')
  }

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>){
    event.preventDefault()
    setSubmitError('')
    setIsSuccess(false)
    setIsSubmitting(true)

    const job: NewJob = {
      name,
      description,
      location: {city:ciudad, state: estado as State},
    }
    try{
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
    <Header/>
    <section className="relative overflow-hidden bg-primary px-4 py-8 text-primary-foreground">
        <div className="absolute -top-10 -right-10 size-32 rounded-full bg-accent" />
        <div className="relative">
          <h1 className="text-3xl leading-tight font-extrabold">
            Registrar vacante
          </h1>
        </div>
      </section>
      <main className="bg-[#fdf3f0] px-4 py-8">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-lg flex-col gap-5 rounded-3xl bg-white p-6 text-neutral-900"
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
            <Select required value={estado} onValueChange={handleEstado}>
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
                {ciudades.map((nombre) => (
                  <SelectItem key={nombre} value={nombre}>
                    {nombre}
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
              id="job-description"
              rows={5}
              required
              className={inputClass}
              placeholder="Describe las funciones y requisitos del puesto"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>

          {submitError && (
            <p role="alert" className="text-sm text-destructive">
              {submitError}
            </p>
          )}

          {isSuccess && (
            <p role="status" className="text-sm font-semibold text-green-700">
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