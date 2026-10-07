import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import { Button } from '#/components/ui/button'

export function SearchBox() {
  return (
    <section className="px-4 py-8">
      <div className="rounded-2xl bg-brand-ink px-5 py-6 text-brand-ink-foreground shadow-lg">
        <h2 className="text-2xl leading-tight font-extrabold">
          Encuentra comercios o productos participantes
        </h2>
        <p className="mt-2 text-sm">Busca un comercio o producto participante</p>

        <form
          className="mt-4 flex flex-col gap-3"
          onSubmit={(event) => event.preventDefault()}
        >
          <label htmlFor="search" className="sr-only">
            Nombre del comercio o categoría
          </label>
          <input
            id="search"
            type="search"
            placeholder="Nombre del comercio o categoría"
            className="w-full rounded-md bg-white px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-accent focus:outline-none"
          />
          <Button asChild className="w-full">
            <Link to="/search-products">
                Buscar
                <ArrowRight />
            </Link>
        </Button>
        </form>
      </div>
    </section>
  )
}