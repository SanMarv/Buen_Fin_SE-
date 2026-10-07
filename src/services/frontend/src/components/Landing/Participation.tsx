import { Link } from '@tanstack/react-router'
import { ArrowRight, ShoppingBag, Store } from 'lucide-react'

const options = [
  {
    to: '/register-consumer',
    icon: ShoppingBag,
    title: 'Soy consumidor',
    description:
      'Consulta tus derechos y compra de forma segura.',
    link: 'Ver recursos para consumidores',
  },
  {
    to: '/register-business',
    icon: Store,
    title: 'Tengo un comercio',
    description:
      'Registra tu comercio gratis, accede a herramientas para participar y conoce el sorteo.',
    link: 'Conocer requisitos de registro',
  },
] as const

export function Participation() {
  return (
    <section className="px-4 pb-8">
      <h2 className="text-2xl font-extrabold">¿Quieres participar?</h2>

      <div className="mt-4 flex flex-col gap-3">
        {options.map((option) => (
          <div
            key={option.to}
            className="flex gap-4 rounded-xl border bg-card p-5 text-card-foreground"
          >
            <option.icon className="mt-1 size-5 shrink-0 text-primary" />
            <div>
              <h3 className="text-lg font-bold">{option.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {option.description}
              </p>
              <Link
                to={option.to}
                className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary underline underline-offset-4"
              >
                {option.link}
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}