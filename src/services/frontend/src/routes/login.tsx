import { createFileRoute } from '@tanstack/react-router'
import { Header } from '#/components/Header'
import Login from '#/components/Login'
import { Footer } from '#/components/Footer'
import { Toaster } from '#/components/ui/sonner'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <div className="min-h-[90dvh] grid grid-rows-[auto_1fr]">
        <Header />
        <main className="h-full">
          <Login />
          <Toaster />
        </main>
      </div>
      <Footer />
    </>
  )
}
