import { createFileRoute, redirect } from '@tanstack/react-router'
import type { Branch } from '#/components/ElementCard'
import { fetchCompany, fetchIsOwner } from '#/lib/fetch'
import { CompanyDetail } from '#/sections/CompanyDetail'

export const Route = createFileRoute('/edit/$companyId')({
  loader: async ({ params }) => {
    const isOwner = await fetchIsOwner(params.companyId)
    if (!isOwner) throw redirect({ to: '/business-profile/$companyId', params })

    const company = await fetchCompany(params.companyId)
    return { company: company, isOwner }
  },
  component: BusinessProfile,
})

const branches: Branch[] = [
  { name: 'Sucursal Centro', address: 'Calle 27, Col.Lilas', region: 'CDMX' },
  { name: 'Sucursal Norte', address: 'Av.Reforma 120', region: 'Nuevo León' },
  {
    name: 'Sucursal Online',
    address: 'Compras por internet',
    region: 'Todo el país',
  },
]

function BusinessProfile() {
  const { company } = Route.useLoaderData()
  return <CompanyDetail company={company} isOwner />
}
