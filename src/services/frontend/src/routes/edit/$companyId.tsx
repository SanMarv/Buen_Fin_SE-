import { createFileRoute, redirect } from '@tanstack/react-router'
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

function BusinessProfile() {
  const { company } = Route.useLoaderData()
  return <CompanyDetail company={company} isOwner />
}
