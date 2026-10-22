import { createFileRoute } from '@tanstack/react-router'
import { fetchCompany, fetchIsOwner } from '#/lib/fetch'
import { CompanyDetail } from '#/sections/CompanyDetail'
import { GoEdit } from '#/components/ui/GoEdit'
import { Ticket } from 'lucide-react'
import { HorizontalScrollWithTitle } from '#/components/ui/Horizontalscroll'
import {
  JobCardCompany,
  ProductCardProductPage,
} from '#/components/ProductCardCompany'

const ttlCookieHours = 2
const ttlCookieMilliseconds = ttlCookieHours * 60 * 60 * 1000

export const Route = createFileRoute('/business-profile/$companyId')({
  staleTime: ttlCookieMilliseconds,
  beforeLoad: async ({ params }) => {
    const company = await fetchCompany(params.companyId)
    return { company }
  },
  loader: async ({ params, context }) => {
    const isOwner = await fetchIsOwner(params.companyId)
    return { company: context.company, isOwner, companyId: params.companyId }
  },
  component: BusinessProfile,
})

function BusinessProfile() {
  const { company, companyId, isOwner } = Route.useLoaderData()
  const { products } = company
  return (
    <CompanyDetail company={company}>
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
        <HorizontalScrollWithTitle title="Productos">
          {products.map((product) => (
            <div key={product.id} className="w-44 shrink-0 snap-start">
              <ProductCardProductPage product={product} />
            </div>
          ))}
        </HorizontalScrollWithTitle>
      </section>

      <section className="px-4 py-8">
        <HorizontalScrollWithTitle title="Vacantes">
          {company.jobs.map((job) => (
            <JobCardCompany job={job} key={job.id} />
          ))}
        </HorizontalScrollWithTitle>
      </section>
      <GoEdit isOwner={isOwner} companyId={companyId} />
    </CompanyDetail>
  )
}
