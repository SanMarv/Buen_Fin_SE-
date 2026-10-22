import { useState } from 'react'
import type { ChangeEvent, SubmitEvent } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { Eye, EyeClosed, FileText, Upload, X } from 'lucide-react'
import { Footer } from '#/components/Footer'
import { Header } from '#/components/Header'
import { Button } from '#/components/ui/button'
import { env } from '#/config/env'
import { fail, success } from 'lib/types'
import type { PromiseResult } from 'lib/types'
import { errorSchema } from 'lib/schemas'
import type { ApiError } from 'lib/schemas'
import { toast } from 'sonner'
import { Toaster } from '#/components/ui/sonner'
import { Spinner } from '#/components/ui/spinner'

export const Route = createFileRoute('/verification')({
  component: VerificationPage,
})

function VerificationPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [fileError, setFileError] = useState('')

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.currentTarget.files ?? [])
    const validFiles = selectedFiles.filter((file) => {
      const extension = file.name.split('.').pop()?.toLowerCase()
      return extension === 'cer' || extension === 'key'
    })
    const hasInvalidFiles = validFiles.length !== selectedFiles.length
    setFiles((current) => [...current, ...validFiles])
    setFileError(
      hasInvalidFiles
        ? 'Archivo no válido. Solo se permiten archivos .cer y .key.'
        : '',
    )
    event.currentTarget.value = ''
  }

  function removeFile(indexToRemove: number) {
    setFiles((current) => current.filter((_, index) => index !== indexToRemove))
  }

  const getExt = (file: File) => file.name.split('.').pop()?.toLowerCase()

  async function sendValidation(body: FormData): PromiseResult<null, ApiError> {
    try {
      const res = await fetch(`${env.VITE_BACK_BASE}/auth/validate`, {
        method: 'PUT',
        body,
        credentials: 'include',
      })

      if (res.ok) {
        return success(null)
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
    if (isLoading) return
    const cer = files.find((f) => getExt(f) === 'cer')
    const key = files.find((f) => getExt(f) === 'key')
    const missingPassword = !password.trim()
    const missingFiles = !cer || !key || files.length !== 2

    setPasswordError(missingPassword ? 'Hace falta contraseña' : '')
    if (missingFiles && !fileError) {
      setFileError('Este campo es necesario; adjunta un archivo .cer y uno .key.')
    }
    if (missingPassword || missingFiles) return
    setFileError('')

    const body = new FormData()
    body.append('cer', cer)
    body.append('key', key)
    body.append('password', password)

    setIsLoading(true)

    try {
      const { success: ok, error } = await sendValidation(body)
      if (ok) {
        await queryClient.invalidateQueries({ queryKey: ['me'] })
        toast.success('Cuenta verificada', { position: 'bottom-center' })
        navigate({ to: '/' })
        return
      }

      switch (error.status) {
        case 401:
          toast.error(error.error, { position: 'bottom-center' })
          navigate({ to: '/login' })
          return
        case 403:
          if (error.error === 'Unauthorized') {
            toast.error('Sin sesión', { position: 'bottom-center' })
            navigate({ to: '/login' })
          } else {
            toast.error('Firma no válida', { position: 'bottom-center' })
          }
          return
        case 400:
          toast.error(error.error, { position: 'bottom-center' })
          return
        default:
          toast.error('Ocurrió un error, revisa bien los parámetros', {
            position: 'bottom-center',
          })
          return
      }
    } finally {
      setIsLoading(false)
      setPassword('')
    }
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="flex min-h-[60vh] items-start justify-center bg-background px-4 py-8">
        <section className="w-full max-w-md rounded-xl border border-border bg-card px-6 py-6 text-card-foreground shadow-md">
          <p className="text-[10px] font-extrabold uppercase tracking-wide text-primary">
            El Buen Fin 2026
          </p>

          <h1 className="mb-2 text-xl font-extrabold leading-tight text-foreground">
            Verificación de cuenta
          </h1>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
            <label className="flex flex-col gap-1 text-sm font-medium text-foreground">
              Contraseña efiel
              <span className="relative">
                <input
                  className={`w-full rounded-xl border ${passwordError ? 'border-destructive' : 'border-input'} bg-background px-4 py-3 pr-12 text-base text-foreground placeholder:text-muted-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50`}
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  placeholder="Contraseña"
                  value={password}
                  onBlur={() => {
                    if (!password.trim()) setPasswordError('Hace falta contraseña')
                  }}
                  onChange={(event) => {
                    const value = event.currentTarget.value
                    setPassword(value)
                    if (value.trim()) setPasswordError('')
                  }}
                />

                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="absolute inset-y-0 right-0 my-auto text-muted-foreground"
                  type="button"
                  aria-label={
                    showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                  }
                  onClick={() => setShowPassword((visible) => !visible)}
                >
                  {showPassword ? (
                    <Eye className="size-5" />
                  ) : (
                    <EyeClosed className="size-5" />
                  )}
                </Button>
              </span>
            </label>
            {passwordError && (
              <p role="alert" className="flex justify-center text-[11px] font-medium">
                <span className="rounded-full bg-destructive px-[10px] py-[3px] leading-[1.2] text-center text-white">
                  {passwordError}
                </span>
              </p>
            )}

            <div>
              <p className="mb-1 text-sm font-medium text-foreground">
                Documentos
              </p>
              <p className="mb-5 text-sm text-muted-foreground">
                Adjunta los documentos para verificar tu cuenta.
              </p>

              <label className="flex cursor-pointer flex-col items-center rounded-lg border-2 border-dashed border-input px-4 py-6 text-center hover:border-primary">
                <Upload className="mb-2 size-6 text-primary" />

                <span className="text-sm font-semibold text-foreground">
                  Selecciona tus documentos
                </span>

                <span className="mt-1 text-xs text-muted-foreground">
                  Selecciona solo tus archivos .cer y .key
                </span>

                <input
                  className="sr-only"
                  type="file"
                  name="documents"
                  multiple
                  aria-invalid={!!fileError}
                  onChange={handleFileChange}
                />
              </label>

              {fileError && (
                <p role="alert" className="mt-2 flex justify-center text-[11px] font-medium">
                  <span className="rounded-full bg-destructive px-[10px] py-[3px] leading-[1.2] text-center text-white">
                    {fileError}
                  </span>
                </p>
              )}

              {files.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {files.map((file, index) => (
                    <li
                      className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm text-foreground"
                      key={`${file.name}-${file.lastModified}-${index}`}
                    >
                      <FileText className="size-4 shrink-0 text-muted-foreground" />

                      <span className="min-w-0 flex-1 truncate">
                        {file.name}
                      </span>

                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="shrink-0 rounded-full text-muted-foreground"
                        type="button"
                        aria-label={`Quitar ${file.name}`}
                        onClick={() => removeFile(index)}
                      >
                        <X className="size-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <Button
              className="mt-1 w-full"
              type="submit"
              disabled={isLoading}
            >
              {isLoading && <Spinner />}
              {isLoading ? 'Validando…' : 'Enviar'}
            </Button>
          </form>
        </section>
        <Toaster />
      </main>

      <Footer />
    </div>
  )
}
