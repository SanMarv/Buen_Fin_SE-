import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/register-products-positions')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/register-products-positions"!</div>
}
