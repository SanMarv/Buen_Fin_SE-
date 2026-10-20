import { OnePage } from '#/components/OnePage'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { Unlink } from 'lucide-react'

export const Route = createFileRoute('/search-products/$postid')({
  loader: ({ params }) => {
    throw notFound()
  },
  component: RouteComponent,
  notFoundComponent: Error,
})

function Error() {
  return (
    <OnePage className="bg-card  gap-y-5">
      <Unlink className="size-[20vh]" />
      <h1 className="text-balance font-fraunces text-2xl w-4/5 text-center font-bold">
        No encontramos el producto que buscas
      </h1>
      <Link
        to="/search-products"
        className="py-2 w-4/5 text-center bg-primary text-background rounded-md"
      >
        Ir a la lista de productos
      </Link>
    </OnePage>
  )
}

function RouteComponent() {
  return <div>Hello "/$postid"!</div>
}
