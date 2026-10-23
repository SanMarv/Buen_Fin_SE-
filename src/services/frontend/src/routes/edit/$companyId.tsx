import { createFileRoute, Link, redirect, useNavigate } from '@tanstack/react-router'
import { fetchCompany, fetchDrafts, fetchIsOwner } from '#/lib/fetch'
import { CompanyDetail } from '#/sections/CompanyDetail'
import { HorizontalScroll } from '#/components/ui/Horizontalscroll'
import {
  JobCardCompany,
  ProductCardCompany,
} from '#/components/ProductCardCompany'
import { ShieldAlert, Ticket , BadgeCheck} from 'lucide-react'
import { SectionHeader } from '#/components/EditPage/SectionHeader'
import { MoreBtn } from '#/components/EditPage/MoreBtn'
import { useEditProduct } from '#/components/EditPage/useEdtiProduct'
import { DeletePost } from '#/components/EditPage/DeletePost'
import { useState } from 'react'
import { CreateProduct } from '#/components/CreateProduct'

export const Route = createFileRoute('/edit/$companyId')({
  shouldReload: true,
  loader: async ({ params }) => {
    const isOwner = await fetchIsOwner(params.companyId)
    if (!isOwner) throw redirect({ to: '/business-profile/$companyId', params })

    const company = await fetchCompany(params.companyId)
    const drafts = await fetchDrafts()
    return { company: company, drafts }
  },
  component: BusinessProfile,
})

function BusinessProfile() {
  const { company, drafts } = Route.useLoaderData()
  const [products, updateProducts] = useState(company.products)
  const [clientDraft, updateDrafts] = useState(drafts)
  const editProduct = useEditProduct()
  const navigate = useNavigate()
  return (
    <CompanyDetail company={company} isOwner>
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
          {company.isValidated ? (
                        <p className='inline-flex items-center gap-2 rounded-full bg-card px-3 py-1.5 text-xs font-bold'>
                          <BadgeCheck className='size-4 text-primary' />
                          Empresa Verificada
                        </p>
                      ) : (
                         (
                            <Link to='/verification-company'
                              className='inline-flex items-center gap-2
                              rounded-full border border-primary px-3 py-1.5
                              text-xs font-bold text-primary hover:bg-primary
                              hover:text-primary-foreground'>
                              <ShieldAlert className='size-4'/>
                              Verificar empresa</Link>
                          )
                      )}
        </div>
      </section>
      <div className="px-4 flex flex-col gap-y-8 py-4">
        <section>
          <SectionHeader className="relative z-0">
            <SectionHeader.H2>Productos</SectionHeader.H2>
          </SectionHeader>
          <HorizontalScroll>
            {products.map((product) => (
              <div
                key={product.id}
                className="w-44 shrink-0 snap-start relative"
              >
                <ProductCardCompany
                  product={product}
                  onClick={() => editProduct(product)}
                />
                <DeletePost
                  id={product.id}
                  onClick={() =>
                    updateProducts((p) => p.filter((v) => v.id === product.id))
                  }
                  className="top-0 right-0 absolute"
                />
              </div>
            ))}
          </HorizontalScroll>
        </section>

        <section>
          <SectionHeader>
            <SectionHeader.H2>Borradores</SectionHeader.H2>
            <CreateProduct />
          </SectionHeader>
          <HorizontalScroll>
            {clientDraft.map((product) => (
              <div
                key={product.id}
                className="w-44 shrink-0 snap-start relative"
              >
                <ProductCardCompany
                  product={product}
                  onClick={() => editProduct(product)}
                />
                <DeletePost
                  id={product.id}
                  onClick={() =>
                    updateDrafts((p) => p.filter((v) => v.id === product.id))
                  }
                  className="top-0 right-0 absolute"
                />
              </div>
            ))}
          </HorizontalScroll>
        </section>

        <section>
          <SectionHeader>
            <SectionHeader.H2>Vacantes</SectionHeader.H2>
            <MoreBtn
              aria-label="Registrar trabajo"
              onClick={() =>
                navigate({
                  to: '/register-job',
                })
              }
            />
          </SectionHeader>
          <HorizontalScroll>
            {company.jobs.map((job) => (
              <JobCardCompany job={job} key={job.id} isOwner />
            ))}
          </HorizontalScroll>
        </section>
      </div>
    </CompanyDetail>
  )
}
