import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/search-products')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/search-products"!</div>
}
