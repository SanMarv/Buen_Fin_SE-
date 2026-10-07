import { createFileRoute } from '@tanstack/react-router'

import { Header } from '#/components/Header'
import { Footer } from '#/components/Footer'
export const Route = createFileRoute('/aboutus')({component:aboutus,})

function aboutus() {
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
      </main>
        <Footer/>
    </>
  )
}