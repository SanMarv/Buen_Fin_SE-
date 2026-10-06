import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/register-consumer')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/register_consumer"!</div>
}
