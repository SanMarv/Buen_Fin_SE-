import { createFileRoute, Link } from '@tanstack/react-router'
import {ArrowRight,Check,ExternalLink,TrendingUp,Trophy,} from 'lucide-react'

import { Footer } from '#/components/Footer'
import { Header } from '#/components/Header'
import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/aboutus')({
  component: AboutUs,
})

const requirements = ['Nombre del comercio', 'RFC', 'Cuenta de Consumidor'] as const

function AboutUs() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-card px-4 py-10">
          <p className="text-xs font-bold tracking-wide text-primary uppercase">
            Campaña nacional · Edición 2026
          </p>
          <h1 className="mt-2 text-4xl leading-tight font-normal">
            El Buen Fin 2026
          </h1>
          <p className="mt-2 text-xl text-primary">Del 13 al 17 de noviembre</p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            La campaña comercial más importante de México. Encuentra comercios
            participantes, compra con información y aprovecha beneficios de
            forma segura.
          </p>

          <div className="relative mt-8 overflow-hidden rounded-2xl bg-primary px-6 py-10">
            <div className="absolute -top-12 -right-12 size-44 rounded-full bg-accent" />

            <div className="relative rounded-xl bg-white p-5 text-foreground">
              <p className="text-xs font-bold tracking-wide text-primary uppercase">
                Cinco días para elegir bien
              </p>
              <p className="mt-2 text-3xl leading-tight font-normal">
                <span className="block">Compara.</span>
                <span className="block">Decide.</span>
                <span className="block">Disfruta.</span>
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                Información oficial para consumidores y comercios.
              </p>
            </div>
          </div>
        </section>

        <section id="registro-comercio" className="px-4 py-10">
          <p className="text-xs font-bold tracking-wide text-primary uppercase">
            Para comercios
          </p>
          <h2 className="mt-2 text-3xl leading-tight font-extrabold">
            Registra tu comercio en El Buen Fin
          </h2>

          <div className="mt-6 flex flex-col gap-3">
            <article className="rounded-xl border bg-card p-5">
              <Trophy className="size-6 text-primary" />
              <h3 className="mt-3 text-lg font-bold">
                Gana con el Sorteo El Buen Fin
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Aprovecha los premios que el Servicio de Administración
                Tributaria ofrece a los comercios participantes. Hay
                $100,000,000 pesos en premios.
              </p>
            </article>

            <article className="rounded-xl border bg-card p-5">
              <TrendingUp className="size-6 text-primary" />
              <h3 className="mt-3 text-lg font-bold">Haz crecer tu comercio</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Utiliza las herramientas gratuitas y de dominio público que el
                programa MIPYMES MX de la Secretaría de Economía ha preparado
                para ti.
              </p>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary underline underline-offset-4"
              >
                Conocer MIPYMES MX
                <ExternalLink className="size-4" />
              </a>
            </article>
          </div>

          <h3 className="mt-8 text-xl font-extrabold">
            ¿Qué necesitas para registrarte?
          </h3>
          <ul className="mt-4 flex flex-col gap-3">
            {requirements.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="size-4" />
                </span>
                <span className="text-base font-medium">{item}</span>
              </li>
            ))}
          </ul>

          <Button asChild className="mt-8 w-full">
            <Link to="/register-business">
              Únete
              <ArrowRight />
            </Link>
          </Button>
        </section>
      </main>
      <Footer />
    </>
  )
}