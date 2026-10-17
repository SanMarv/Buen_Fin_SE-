import { createFileRoute } from '@tanstack/react-router'
import { CATEGORIES_ENUM } from 'lib/types'
import type { CategoriesRecord } from 'lib/types'

export const Route = createFileRoute('/register-products')({
  component: RouteComponent,
})

// Nombre, Marca, Precio viejo, precio nuevo (ponerlo o seleccionar el porcentaje y mandarlo al backend), descripción, imagenes, categoría

const CATEGORIES: CategoriesRecord<string> = {
  [CATEGORIES_ENUM['tecnologies']]: 'Tecnología',
  [CATEGORIES_ENUM['home']]: 'Hogar',
  [CATEGORIES_ENUM['fashion']]: 'Moda',
  [CATEGORIES_ENUM['sports']]: 'Deportes',
  [CATEGORIES_ENUM['appliances']]: 'Electrodomésticos',
  [CATEGORIES_ENUM['toys']]: 'Juguetes',
}

function RouteComponent() {
  return <div>Hello "/register-products-positions"!</div>
}
