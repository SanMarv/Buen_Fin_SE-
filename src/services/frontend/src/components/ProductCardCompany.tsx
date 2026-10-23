import { Button } from '#/components/ui/button'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import type { Job, ProductPageItem } from 'lib/types'
import { env } from '#/config/env'
import { toast } from 'sonner'
import { errorSchema } from 'lib/schemas'
import type { ComponentProps } from 'react'

const money = new Intl.NumberFormat(
  'es-MX', // herramienta para poner formato de dinero
  {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0, // le quita los centavos
  },
)
type Props = {
  product: Omit<ProductPageItem, 'company'>
} & ComponentProps<'article'>
// se recibe el producto y se checa que tenga el formato correcto
export function ProductCardCompany({ product, ...rest }: Props) {
  return (
    <article
      className="flex flex-col rounded-2xl bg-card p-2.5 cursor-pointer"
      {...rest}
    >
      {product.images.length > 0 ? (
        <img
          src={product.images[0].url}
          alt={product.images[0].alt}
          className="aspect-square w-full rounded-xl bg-card object-cover"
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

export const useNavigateProductPage = (
  product: Omit<ProductPageItem, 'company'>,
) => {
  const navigate = useNavigate()
  return () => {
    navigate({
      to: '/search-products/$postid',
      params: { postid: product.id },
    })
  }
}
export function ProductCardProductPage({
  product,
  ...rest
}: Omit<Props, 'onClick'>) {
  const nav = useNavigateProductPage(product)
  return <ProductCardCompany product={product} onClick={nav} {...rest} />
}
// este ultimo botón es el que despues va a mandar a un link de la compañia

export function JobCardCompany({
  job,
  isOwner,
}: {
  job: Job
  isOwner?: boolean
}) {
  const router = useRouter()
  const navigate = useNavigate()

  async function handleDelete() {
    try {
      const res = await fetch(`${env.VITE_BACK_BASE}/jobs/${job.id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (res.ok) {
        toast.success('Trabajo eliminado correctamente', {
          position: 'bottom-center',
        })
        await router.invalidate()
        return
      }

      const parsed = errorSchema.safeParse(await res.json().catch(() => null))
      const message = parsed.success ? parsed.data.error : ''

      switch (res.status) {
        case 401:
          toast.error('Inicia sesión para poder eliminar un trabajo', {
            position: 'bottom-center',
          })
          navigate({ to: '/login' })
          return
        case 403:
          if (message === 'Unauthorized') {
            toast.error('Inicia sesión para poder eliminar un puesto', {
              position: 'bottom-center',
            })
            navigate({ to: '/login' })
          } else if (message === 'Prohibited') {
            toast.error('Inicia sesión para poder eliminar un puesto', {
              position: 'bottom-center',
            })
            navigate({ to: `/business-profile/${job.id}` })
          } else {
            toast.error('Inicia sesión para poder eliminar un puesto', {
              position: 'bottom-center',
            })
          }
          return
        default:
          toast.error('No se pudo eliminar el puesto', {
            position: 'bottom-center',
          })
          return
      }
    } catch {
      toast.error('Error de conexión', { position: 'bottom-center' })
    }
  }
  return (
    <article className="grid grid-rows-[auto_1fr_auto] grid-cols-[minmax(1fr,25ch)] rounded-2xl bg-card p-4 shadow-sm gap-y-2">
      <div className="flex flex-col gap-y-1">
        <h3 className="text-md leading-tight font-bold">{job.name}</h3>
        <span className="text-[11px] font-medium">
          {job.location.city}, {job.location.state}
        </span>
      </div>
      <p className="text-sm text-muted-foreground h-full ">{job.description}</p>
      {isOwner ? (
        <Button
          type="button"
          variant="outline"
          className="mt-4 w-full border-primary font-bold text-primary hover:bg-primary hover:text-primary-foreground"
          onClick={handleDelete}
        >
          Eliminar
        </Button>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="mt-4 w-full border-primary font-bold text-primary hover:bg-primary hover:text-primary-foreground"
          asChild
        >
          <a href={job.link} target="_blank">
            Ver detalles
          </a>
        </Button>
      )}
    </article>
  )
}
