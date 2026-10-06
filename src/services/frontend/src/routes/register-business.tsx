import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/register-business')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/register-business"!</div>
}
