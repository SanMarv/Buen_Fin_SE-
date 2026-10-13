import { createFileRoute } from '@tanstack/react-router'

import { Footer } from '#/components/Footer'
import { Header } from '#/components/Header'
import { ProductCard, type Product } from '#/components/ElementCard'


export const Route = createFileRoute('/search-products')({
  component: SearchProducts,
})

const CATEGORIES = [
  'Tecnología',
  'Hogar',
  'Moda',
  'Deportes',
  'Electrodomésticos',
  'Juguetes',
]

//AUN NO FUNCIONA LOS FILTROS

// Datos de prueba. Se reemplazan con la respuesta del backend.
const placeholderProducts: Product[] = [
  { name: 'Lavadora automática', category: 'Electrodomésticos', price: 18500, oldPrice: 25000, company: 'Marca X' },
  { name: 'Pantalla 50 pulgadas', category: 'Tecnología', price: 9800, oldPrice: 13000, company: 'Marca Y' },
  { name: 'Tenis para correr', category: 'Deportes', price: 1200, oldPrice: 1800, company: 'Marca Z' },
  { name: 'Chamarra de invierno', category: 'Moda', price: 950, oldPrice: 1500, company: 'Marca W' },
  { name: 'Refrigerador', category: 'Electrodomésticos', price: 22000, oldPrice: 28000, company: 'Marca X' },
  { name: 'Laptop 14 pulgadas', category: 'Tecnología', price: 14500, oldPrice: 19000, company: 'Marca Y' },
]

function SearchProducts() {
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

        <section className="bg-card px-4 py-6">
          <details className="rounded-xl bg-white p-4">
            <summary className="cursor-pointer text-base font-bold">
              Filtros
            </summary>

            <fieldset className="mt-4">
              <legend className="text-sm font-bold">Categoría</legend>
              <div className="mt-2 flex flex-col gap-2">
                {CATEGORIES.map((category) => (
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

            <div className="mt-4">
              <label htmlFor="price" className="text-sm font-bold">
                Rango de precio
              </label>
              <input
                id="price"
                type="range"
                min={0}
                max={30000}
                step={500}
                defaultValue={20000}
                className="mt-2 w-full accent-primary"/>

              <div className="flex justify-between text-xs text-muted-foreground">
                <span>$0</span>
                <span>$30,000</span>
              </div>
            </div>
          </details>

          <h2 className="mt-6 text-xl font-medium">Productos:</h2>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {placeholderProducts.map((product) => (
              <ProductCard key={product.name} product={product} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}