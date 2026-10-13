import {Button} from '#/components/ui/button'
import { Link } from '@tanstack/react-router'

export type Product = {
    name: string
    category: string
    price: number
    oldPrice: number
    company: string
    image?: string  //means the image is optional
}

const money = new Intl.NumberFormat ('es-MX', //herramienta para poner formato de dinero
    {
        style: 'currency',
        currency: 'MXN',
        maximumFractionDigits: 0, //le quita los centavos
    }
)

//se recibe el producto y se checa que tenga el formato correcto 
export function ProductCard ({product}: {product:Product }) 
{ return (
    <article className = "flex flex-col round-2x1 bg-white p-2.5">
        {product.image ? (
            <img src = {product.image} alt = {product.name} className ="aspect-square w-full rouded-x1 bg-card"/>
        ):(
        <div className="aspect-square w-full rounded-xl bg-card" />
      )}

      <Link
        to="/business-profile"
        className="mt-2 flex items-center gap-2 hover:text-primary"
      >
        <span className="size-6 shrink-0 rounded-full bg-muted-foreground/20" />
        <p className="truncate text-[11px] font-black uppercase">
        {product.company}
        </p>
        </Link>

      <h3 className="mt-1 text-sm leading-tight font-bold">{product.name}</h3>
        <p className="truncate text-[11px] text-muted-foreground">
        {product.category}
        </p>
      <p className="mt-1 text-xs text-muted-foreground line-through">
        {money.format(product.oldPrice)}
      </p>

      <p className="text-lg leading-none font-extrabold text-primary">
        {money.format(product.price)}
      </p>
      
      <Button
        type="button"
        variant="outline"
        className="mt-3 w-full border-primary font-bold text-primary hover:bg-primary hover:text-primary-foreground">
        Ver oferta
      </Button>
    </article>
  )
}
//este ultimo botón es el que despues va a mandar a un link de la compañia