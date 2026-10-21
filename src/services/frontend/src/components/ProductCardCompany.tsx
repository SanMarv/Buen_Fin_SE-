import { Button } from '#/components/ui/button'
import { useNavigate } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import type { Job, ProductPageItem } from 'lib/types'

const money = new Intl.NumberFormat(
  'es-MX', // herramienta para poner formato de dinero
  {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0, // le quita los centavos
  },
)

// se recibe el producto y se checa que tenga el formato correcto
export function ProductCardCompany({
  product,
}: {
  product: Omit<ProductPageItem, 'company'>
}) {
  const navigate = useNavigate()
  return (
    <article
      className="flex flex-col rounded-2xl bg-card p-2.5 cursor-pointer"
      onClick={() =>
        navigate({
          to: '/search-products/$postid',
          params: { postid: product.id },
        })
      }
    >
      {product.images.length > 0 ? (
        <img
          src={product.images[0].url}
          alt={product.images[0].alt}
          className="aspect-square w-full rounded-xl bg-card"
        />
      ) : (
        <div className="aspect-square w-full rounded-xl bg-card" />
      )}
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
  )
}
// este ultimo botón es el que despues va a mandar a un link de la compañia

export function JobCardCompany({ job }: { job: Job }) {
  return (
    <article className="flex flex-col rounded-2xl bg-card p-4 sdhadow-sm gap-y-2">
      <div className="flex flex-col gap-y-1">
        <h3 className="text-md leading-tight font-bold">{job.name}</h3>
        <span className="shrink-0 rounded bg-card text-[11px] font-medium">
          {job.location.city}, {job.location.state}
        </span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground min-h-20">
        {job.description}
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
