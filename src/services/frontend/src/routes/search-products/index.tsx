import { createFileRoute } from '@tanstack/react-router'
import { Footer } from '#/components/Footer'
import { Header } from '#/components/Header'
import { ProductCard } from '#/components/ElementCard'
import { CATEGORIES_ENUM } from 'lib/types'
import type { CategoriesRecord, ProductPageItem } from 'lib/types'
import { env } from '#/config/env'
import { ApiError } from '#/components/Errors'

const fetchProduts = async (): Promise<ProductPageItem[]> => {
  const res = await fetch(`${env.VITE_BACK_BASE}/products`)
  const data = await res.json()
  if (res.status < 200 || res.status > 300)
    throw new ApiError(data.status, data.error)
  return data
}

export const Route = createFileRoute('/search-products/')({
  loader: async () => {
    const products = await fetchProduts()
    return { products }
  },
  component: SearchProducts,
})

const CATEGORIES: CategoriesRecord<string> = {
  [CATEGORIES_ENUM['tecnologies']]: 'Tecnología',
  [CATEGORIES_ENUM['home']]: 'Hogar',
  [CATEGORIES_ENUM['fashion']]: 'Moda',
  [CATEGORIES_ENUM['sports']]: 'Deportes',
  [CATEGORIES_ENUM['appliances']]: 'Electrodomésticos',
  [CATEGORIES_ENUM['toys']]: 'Juguetes',
}
// AUN NO FUNCIONA LOS FILTROS
function SearchProducts() {
  const { products } = Route.useLoaderData()
  return (
    <>
      <Header />
      <main>
        <section className="relative overflow-hidden bg-primary px-4 py-8 text-primary-foreground">
          <div className="absolute -top-10 -right-10 size-32 rounded-full bg-accent" />
          <div className="relative">
            <h1 className="text-3xl leading-tight font-extrabold">
              Encuentra productos participantes
            </h1>
          </div>
        </section>

        <section className=" px-4 py-6">
          <details className="rounded-xl bg-surface p-4">
            <summary className="cursor-pointer text-base font-bold">
              Filtros
            </summary>

            <fieldset className="mt-4">
              <legend className="text-sm font-bold">Categoría</legend>
              <div className="mt-2 flex flex-col gap-2">
                {Object.values(CATEGORIES).map((category) => (
                  <label
                    key={category}
                    className="flex items-center gap-2 text-sm"
                  >
                    <input type="checkbox" className="size-4 accent-primary" />
                    {category}
                  </label>
                ))}
              </div>
            </fieldset>
          </details>

          <h2 className="mt-6 text-xl font-medium">Productos:</h2>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
