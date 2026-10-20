import type { NotFoundRouteProps } from '@tanstack/react-router'
import { Header } from './Header'
import { Footer } from './Footer'
import { Cable } from 'lucide-react'

export function NotFoundPage(_: NotFoundRouteProps) {
  return (
    <>
      <div className="grid grid-rows-[auto_1fr_auto] min-h-[90dvh]">
        <Header />
        <main className="size-full bg-muted flex flex-col justify-center items-center gap-10">
          <Cable className="size-[20vh]" />
          <h1 className="font-semibold text-2xl text-center font-fraunces text-balance">
            No encontramos el enlace que buscabas
          </h1>
          <a
            href="/"
            className="font-medium py-2 w-4/5 rounded-xl text-center text-secondary uppercase bg-primary"
          >
            Regresar
          </a>
        </main>
      </div>
      <Footer />
    </>
  )
}
