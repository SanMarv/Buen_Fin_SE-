import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/register-job')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/register-jobs"!</div>
}
