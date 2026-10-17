import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/register-location')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/register-location"!</div>
}
