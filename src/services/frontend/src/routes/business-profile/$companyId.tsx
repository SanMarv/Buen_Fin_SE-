import { createFileRoute } from '@tanstack/react-router'
import { fetchCompany, fetchIsOwner } from '#/lib/fetch'
import { CompanyDetail } from '#/sections/CompanyDetail'
import { GoEdit } from '#/components/ui/GoEdit'

export const Route = createFileRoute('/business-profile/$companyId')({
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
  return (
    <CompanyDetail company={company}>
      <GoEdit isOwner={isOwner} companyId={companyId} />
    </CompanyDetail>
  )
}
