import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/register-location')({
  component: RouteComponent,
})

// Estado, Direción, Ciudad

function RouteComponent() {
  return <div>Hello "/register-location"!</div>
}
