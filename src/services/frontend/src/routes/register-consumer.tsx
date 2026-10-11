import { createFileRoute } from '@tanstack/react-router'
import Register from '#/components/Register'
import { Toaster } from '#/components/ui/sonner'

export const Route = createFileRoute('/register-consumer')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen">
      <Register />
      <Toaster />
    </div>
  )
}
