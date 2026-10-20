import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import { Button } from '#/components/ui/button'

export function FreeParticipation() {
  return (
    <section className="bg-primary px-4 py-10 text-primary-foreground">
      <p className="text-xs font-bold tracking-wide text-accent uppercase">
        Para comercios
      </p>
      <h2 className="mt-1 text-3xl leading-tight font-extrabold">
        Participar es gratis
      </h2>
      <p className="mt-3 text-base leading-relaxed">
        El registro de comercios comienza el 8 de septiembre de 2026. Prepara
        tus datos y forma parte de la campaña nacional.
      </p>

      <Button
        asChild
        variant="secondary"
        className="mt-5"
      >
        <Link to="/register-consumer">
          Revisar requisitos y registrar
          <ArrowRight />
        </Link>
      </Button>

      <div className="mt-8 rounded-xl bg-surface p-5 text-foreground">
        <p className="text-xs font-medium tracking-wide text-primary uppercase">
          Premio del SAT para comercios
        </p>
        <p className="mt-1 text-4xl font-medium">$250,000</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Bolsa de premios para comercios participantes que cumplen las bases.
        </p>
      </div>
    </section>
  )
}
