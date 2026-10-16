import { createFileRoute } from '@tanstack/react-router'
import { Header } from '#/components/Header'
import Register from '#/components/Register'
import { Footer } from '#/components/Footer'
import { Toaster } from '#/components/ui/sonner'

export const Route = createFileRoute('/register-consumer')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
      <Register />
      <Toaster />
      </main> 
      <Footer />
    
    </div>
  )
}
