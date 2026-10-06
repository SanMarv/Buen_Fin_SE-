import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/business-profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/business-profile"!</div>
}
