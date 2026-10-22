import { OnePage } from '#/components/OnePage'
import { env } from '#/config/env'
import { ApiError } from '#/components/Errors'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { ArrowUpRight, Unlink } from 'lucide-react'
import { CATEGORIES_ENUM } from 'lib/types'
import type { CategoriesRecord, ProductImage, ProductPageItem } from 'lib/types'
import { Button } from '#/components/ui/button'
import { Suspense } from 'react'
import type { ComponentProps } from 'react'
import { Badge } from '#/components/ui/badge'
import { LoaderCards } from '#/components/LoaderCards'
import {
  QueryErrorResetBoundary,
  useSuspenseQuery,
} from '@tanstack/react-query'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '#/components/ui/breadcrumb'
import { ErrorPage } from '#/components/Errors/ErrorPage'

const CATEGORIES: CategoriesRecord<string> = {
  [CATEGORIES_ENUM['tecnologies']]: 'Tecnología',
  [CATEGORIES_ENUM['home']]: 'Hogar',
  [CATEGORIES_ENUM['fashion']]: 'Moda',
  [CATEGORIES_ENUM['sports']]: 'Deportes',
  [CATEGORIES_ENUM['appliances']]: 'Electrodomésticos',
  [CATEGORIES_ENUM['toys']]: 'Juguetes',
}

const getProduct = async (id: string): Promise<ProductPageItem> => {
  try {
    const url = `${env.VITE_BACK_BASE}/products/${id}`
    const res = await fetch(url)
    const data = await res.json()
    if (res.status < 200 || res.status > 300)
      throw new ApiError(data.status, data.error)
    return data
  } catch (e) {
    console.error(e)
    throw notFound()
  }
}
export const Route = createFileRoute('/search-products/$postid')({
  loader: async ({ params }) => {
    const id = params.postid
    const product = await getProduct(id)
    return { product }
  },
  component: RouteComponent,
  notFoundComponent: Error,
  errorComponent: ErrorPage,
})

function Error() {
  return (
    <OnePage className="bg-card  gap-y-5">
      <Unlink className="size-[20vh]" />
      <h1 className="text-balance font-fraunces text-2xl w-4/5 text-center font-bold">
        No encontramos el producto que buscas
      </h1>
      <Link
        to="/search-products"
        className="py-2 w-4/5 text-center bg-primary text-background rounded-md"
      >
        Ir a la lista de productos
      </Link>
    </OnePage>
  )
}

type PropsImageProduct = {
  image?: ProductImage
} & Omit<ComponentProps<'img'>, 'src' | 'alt'>
const ImageProduct = ({ image, ...rest }: PropsImageProduct) => {
  if (image) return <img src={image.url} alt={image.alt} {...rest} />
  return <span {...rest} />
}

const fetchProduts = async (company: string): Promise<ProductPageItem[]> => {
  const url = new URL(`${env.VITE_BACK_BASE}/products`)
  url.searchParams.append('company', company)
  const res = await fetch(url)
  const data = await res.json()
  if (res.status < 200 || res.status > 300)
    throw new ApiError(data.status, data.error)
  return data
}
const OtherPosts = () => {
  const { product } = Route.useLoaderData()
  const { data, isFetching } = useSuspenseQuery({
    queryKey: [product.id],
    queryFn: () => fetchProduts(product.company.name),
  })
  if (isFetching) return null
  return (
    <div className="flex gap-2 max-w-full overflow-x-scroll size-full scrollbar-none py-2">
      {data.slice(0, 10).map((v) => (
        <a
          href={`/search-products/${v.id}`}
          key={v.id}
          className="grid grid-rows-[1fr_auto] gap-2 h-full aspect-square"
        >
          <ImageProduct
            image={v.images[0]}
            className="size-full rounded-md bg-neutral-500/30 object-cover "
          />
          <span className="font-semibold text-md">{v.name}</span>
        </a>
      ))}
    </div>
  )
}
function RouteComponent() {
  const { product } = Route.useLoaderData()
  const { company } = product
  return (
    <OnePage className="grid bg-card grid-rows-[1fr_30dvh] grid-cols-1 gap-y-2">
      <article className="flex flex-col justify-start px-[5%] size-full py-2">
        <Breadcrumb>
          <BreadcrumbList className="py-2">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/search-products">Productos</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  to="/search-products/$postid"
                  params={{ postid: product.id }}
                >
                  {product.name}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <ImageProduct
          image={product.images[0]}
          className="row-span-2 bg-foreground/30 object-cover max-w-full overflow-hidden size-full rounded-md"
        />
        <div className="flex size-full flex-col gap-3">
          <h1 className="font-semibold text-3xl pt-2">{product.name}</h1>
          <Link
            to="/business-profile/$companyId"
            params={{ companyId: company.id }}
            className="flex h-7 items-center gap-x-2"
          >
            <img
              src={company.profile_picture}
              alt={`Logo de ${company.name}`}
              className="h-full aspect-square rounded-full "
            />
            <span className="font-semibold">{company.name}</span>
          </Link>
          <Button
            type="button"
            variant="outline"
            className="bg-transparent w-full border-primary font-bold text-primary hover:bg-primary hover:text-primary-foreground flex items-center"
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
          <div className="flex gap-x-2 items-baseline ">
            <span className="font-extrabold text-primary text-2xl">
              ${product.newPrice}
            </span>
            <small className="text-md line-through opacity-50">
              ${product.price}
            </small>
          </div>
          <div className="flex my-2 gap-x-2">
            {product.categories.map((category) => (
              <Badge variant={'outline'} key={category}>
                {CATEGORIES[category]}
              </Badge>
            ))}
          </div>
          <p className="font-light h-full text-sm min-h-10">
            {product.description}
          </p>
        </div>
      </article>
      <aside className="flex flex-col items-start justify-end h-full px-5 gap-2 mb-2 ">
        <h2 className="font-bold text-xl">Otros productos de {company.name}</h2>
        <QueryErrorResetBoundary>
          <Suspense fallback={<LoaderCards />}>
            <OtherPosts />
          </Suspense>
        </QueryErrorResetBoundary>
      </aside>
    </OnePage>
  )
}
