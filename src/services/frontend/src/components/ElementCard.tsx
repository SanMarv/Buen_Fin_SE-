import { Button } from '#/components/ui/button'
import { Link } from '@tanstack/react-router'
import { ArrowUpRight, MapPin } from 'lucide-react'
import type { ProductPageItem } from 'lib/types'

export type vacancy = {
  name: string
  region: string
  description: string
}

export type Branch = {
  name: string
  address: string
  region: string
}

const money = new Intl.NumberFormat(
  'es-MX', // herramienta para poner formato de dinero
  {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0, // le quita los centavos
  },
)

// se recibe el producto y se checa que tenga el formato correcto
export function ProductCard({ product }: { product: ProductPageItem }) {
  return (
    <Link to={product.id}>
      <article className="flex flex-col rounded-2xl  bg-white p-2.5">
        {product.images.length > 0 ? (
          <img
            src={product.images[0].url}
            alt={product.images[0].alt}
            className="aspect-square w-full rounded-xl bg-card"
          />
        ) : (
          <div className="aspect-square w-full rounded-xl bg-card" />
        )}

        <Link
          to="/business-profile"
          className="mt-2 flex items-center gap-2 hover:text-primary"
        >
          <img
            src={product.company.profile_picture}
            className="size-6 shrink-0 rounded-full bg-muted-foreground/20"
          />
          <p className="truncate text-[11px] font-black uppercase">
            {product.company.name}
          </p>
        </Link>

        <h3 className="mt-1 text-sm leading-tight font-bold">{product.name}</h3>
        <p className="truncate text-[11px] text-muted-foreground">
          {product.categories[0]}
        </p>
        <p className="mt-1 text-xs text-muted-foreground line-through">
          {money.format(product.price)}
        </p>

        <p className="text-lg leading-none font-extrabold text-primary">
          {money.format(product.newPrice)}
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-3 w-full border-primary font-bold text-primary hover:bg-primary hover:text-primary-foreground flex items-center"
          asChild
        >
          <a
            href={product.link}
            target="_blank"
            onClick={(e) => e.stopPropagation()}
          >
            <span>Ir a la oferta</span>
            <ArrowUpRight />
          </a>
        </Button>
      </article>
    </Link>
  )
}
// este ultimo botón es el que despues va a mandar a un link de la compañia

export function VacancyCard({ vacancy }: { vacancy: vacancy }) {
  return (
    <article className="flex flex-col rouded-2x1 bg-white p-4 sdhadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base leading-tight font-bold">{vacancy.name}</h3>
        <span className="shrink-0 rounded bg-card px-2 py-0.5 text-[11px] font-bold">
          {vacancy.region}
        </span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        {vacancy.description}
      </p>

      <Button
        type="button"
        variant="outline"
        className="mt-4 w-full border-primary font-bold text-primary hover:bg-primary hover:text-primary-foreground"
      >
        Ver detalles
      </Button>
    </article>
  )
}

export function BranchCard({ branch }: { branch: Branch }) {
  return (
    <article className="flex aspect-square flex-col justify-between rounded-2x1 bg-white p-3 shadow-sm">
      <MapPin className="size-6 text-primary" />
      <div>
        <h3 className="text-sm leading-tight font-bold">{branch.name}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{branch.address}</p>
        <span className="mt-2 inline-block rounded bg-card px-2 py-0.5 text-[10px] font-bolt">
          {branch.region}
        </span>
      </div>
    </article>
  )
}
