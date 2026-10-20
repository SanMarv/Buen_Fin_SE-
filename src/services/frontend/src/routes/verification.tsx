import { useState } from 'react'
import type { ChangeEvent, SubmitEvent } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Eye, EyeClosed, FileText, Upload, X } from 'lucide-react'
import { Footer } from '#/components/Footer'
import { Header } from '#/components/Header'

export const Route = createFileRoute('/verification')({
  component: VerificationPage,
})

function VerificationPage() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [files, setFiles] = useState<File[]>([])

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.currentTarget.files ?? [])
    setFiles((current) => [...current, ...selectedFiles])
    event.currentTarget.value = ''
  }

  function removeFile(indexToRemove: number) {
    setFiles((current) => current.filter((_, index) => index !== indexToRemove))
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="flex min-h-[60vh] items-start justify-center bg-[#f6f1ed] px-4 py-8">
        <section className="w-full max-w-md rounded-xl bg-surface px-6 py-6 shadow-md">
          <p className="text-[10px] font-extrabold uppercase tracking-wide text-red-800">
            El Buen Fin 2026
          </p>

          <h1 className="mb-2 text-xl font-extrabold leading-tight text-neutral-900">
            Verificación de cuenta
          </h1>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-1 text-sm font-medium text-neutral-800">
              Contraseña
              <span className="relative">
                <input
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 pr-11 outline-none focus:border-red-800 focus:ring-2 focus:ring-red-800/20"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(event) => setPassword(event.currentTarget.value)}
                  required
                />

                <button
                  className="absolute inset-y-0 right-0 grid w-11 place-items-center text-neutral-600 hover:text-neutral-900"
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
                </button>
              </span>
            </label>

            <div>
              <p className="mb-1 text-sm font-medium text-neutral-800">
                Documentos
              </p>
              <p className="mb-5 text-sm text-neutral-600">
                Adjunta los documentos para verificar tu comercio.
            </p>

              <label className="flex cursor-pointer flex-col items-center rounded-lg border-2 border-dashed border-neutral-300 px-4 py-6 text-center hover:border-red-800">
                <Upload className="mb-2 size-6 text-red-800" />

                <span className="text-sm font-semibold text-neutral-800">
                  Selecciona tus documentos
                </span>

                <span className="mt-1 text-xs text-neutral-500">
                  Puedes seleccionar más de un archivo
                </span>

                <input
                  className="sr-only"
                  type="file"
                  name="documents"
                  multiple
                  onChange={handleFileChange}
                />
              </label>

              {files.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {files.map((file, index) => (
                    <li
                      className="flex items-center gap-2 rounded-md bg-neutral-50 px-3 py-2 text-sm"
                      key={`${file.name}-${file.lastModified}-${index}`}
                    >
                      <FileText className="size-4 shrink-0 text-neutral-500" />

                      <span className="min-w-0 flex-1 truncate">
                        {file.name}
                      </span>

                      <button
                        className="grid size-8 shrink-0 place-items-center rounded-full text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900"
                        type="button"
                        aria-label={`Quitar ${file.name}`}
                        onClick={() => removeFile(index)}
                      >
                        <X className="size-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              className="mt-1 rounded-md bg-red-800 px-4 py-2.5 font-semibold text-white hover:bg-red-900 disabled:cursor-not-allowed disabled:opacity-50"
              type="submit"
              disabled={!password || files.length === 0}
            >
              Enviar 
            </button>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  )
}
