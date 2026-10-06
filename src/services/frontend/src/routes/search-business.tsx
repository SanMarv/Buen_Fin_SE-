import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/search-business')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/search-business"!</div>
}
