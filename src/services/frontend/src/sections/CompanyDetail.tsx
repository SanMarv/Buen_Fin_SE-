import { Footer } from '#/components/Footer'
import { Header } from '#/components/Header'
import {
  JobCardCompany,
  ProductCardCompany,
} from '#/components/ProductCardCompany'
import { HorizontalScroll } from '#/components/ui/Horizontalscroll'
import type { CompanyPageItem } from 'lib/types'
import { Ticket } from 'lucide-react'
import type { PropsWithChildren } from 'react'

type Props = {
  company: CompanyPageItem
  isOwner?: boolean
} & PropsWithChildren

// import type { Branch } from '#/components/ElementCard'
// const branches: Branch[] = [
//   { name: 'Sucursal Centro', address: 'Calle 27, Col.Lilas', region: 'CDMX' },
//   { name: 'Sucursal Norte', address: 'Av.Reforma 120', region: 'Nuevo León' },
//   {
//     name: 'Sucursal Online',
//     address: 'Compras por internet',
//     region: 'Todo el país',
//   },
// ]

export function CompanyDetail({ company, isOwner = false, children }: Props) {
  const { products } = company
  return (
    <>
      <Header />
      <main className="relative">
        <section className="relative overflow-hidden bg-primary px-4 py-8">
          <div className="absolute -top-10 -right-10 size-32 rounded-full bg-accent" />

          <div className="relative rouded-2xl  bg-muted p-5 shadow-md">
            <div className="flex items-center gap-4">
              {company.profile_picture ? (
                <img
                  src={company.profile_picture}
                  alt={`Logo de ${company.name}`}
                  className="size-20 shrink-0 rounded-xl object-cover"
                />
              ) : (
                <div className="size-20 shrink-0 rounded-xl bg-card" />
              )}
              <h1 className="text-2xl leading-tight font-extrabold">
                {company.name}
              </h1>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              {company.description}
            </p>

            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-card px-3 py-1.5 text-xs font-bold">
              <Ticket className="size-4 text-primary" />
              Ha participado 3 veces en el sorteo
            </p>
          </div>
        </section>

        <section className="px-4 py-8">
          <HorizontalScroll
            title="Productos"
            addLabel="Agregar producto"
            href="/register-products"
            isOwner={isOwner}
          >
            {products.map((product) => (
              <div key={product.id} className="w-44 shrink-0 snap-start">
                <ProductCardCompany product={product} />
              </div>
            ))}
          </HorizontalScroll>
        </section>

        <section className="px-4 py-8">
          <HorizontalScroll
            title="Vacantes"
            addLabel="Agregar vacante"
            href="/register-job"
            isOwner={isOwner}
          >
            {company.jobs.map((job) => (
              <JobCardCompany job={job} key={job.id} />
            ))}
          </HorizontalScroll>
        </section>
        {children}

        {/*
          <section className="bg-card px-4 py-8">
          <HorizontalScroll
            title="Sucursales"
            addLabel="Agregar sucursal"
            href="/register-location"
          >
            {branches.map((branch) => (
              <div key={branch.name} className="w-40 shrink-0 snap-start">
                <BranchCard branch={branch} />
              </div>
            ))}
          </HorizontalScroll>
        </section>
        */}
      </main>
      <Footer />
    </>
  )
}
