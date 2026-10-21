import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { BusinessCard } from '#/components/ElementCard'
import type { BusinessCardItem } from '#/components/ElementCard'
import { Footer } from '#/components/Footer'
import { Header } from '#/components/Header'
import { env } from '#/config/env'

async function fetchUserCompanies(): Promise<BusinessCardItem[]> {
  const response = await fetch(`${env.VITE_BACK_BASE}/companies/user`, {
    method: 'GET',
    credentials: 'include',
  })

  if (response.status === 204) return []
  if (!response.ok) {
    throw new Error('No se pudieron cargar tus negocios.')
  }

  return (await response.json()) as BusinessCardItem[]
}

export const Route = createFileRoute('/businesses')({ component: Businesses })

function Businesses() {
  const {
    data: companies = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: ['userCompanies'],
    queryFn: fetchUserCompanies,
    retry: false,
  })

  return (
    <>
      <Header />
      <main>
        <section className="relative overflow-hidden bg-primary px-4 py-8 text-primary-foreground">
          <div className="absolute -top-10 -right-10 size-32 rounded-full bg-accent" />
          <div className="relative">
            <h1 className="text-3xl leading-tight font-extrabold">
              Mis negocios
            </h1>
          </div>
        </section>

        <section className="px-4 py-6">
          {isPending ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Cargando tus negocios...
            </p>
          ) : isError ? (
            <div
              role="alert"
              className="rounded-2xl border border-border bg-card px-5 py-10 text-center">
              <h2 className="text-lg font-bold">
                No se pudieron cargar tus negocios
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Intenta de nuevo más tarde.
              </p>
            </div>
          ) : companies.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {companies.map((company) => (
                <BusinessCard key={company.companyId} company={company} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-card px-5 py-10 text-center">
              <h2 className="text-lg font-bold">
                Aún no tienes negocios registrados
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Cuando registres un negocio, aparecerá aquí.
              </p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
