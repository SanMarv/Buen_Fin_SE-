import { createFileRoute } from '@tanstack/react-router'
import {Ticket} from 'lucide-react'
import { Footer } from '#/components/Footer'
import { Header } from '#/components/Header'
import { BranchCard, ProductCard, VacancyCard, type Branch, type Product, type vacancy, } from '#/components/ElementCard'

export const Route = createFileRoute('/business-profile')({
  component: BusinessProfile,
})

type Business = {
  name: string
  logo?: string
  entries: number
  description: string
}

//Dummy data

const business: Business = {
  name: 'Marca X',
  entries: 3,
  description:
  'Descripción breve del comercio. Aquí irá un texto corto que cuente a qué se dedica.'
}

const vacancies: vacancy[] = [
  {name: 'Vendedor de piso', region: 'CDMX', description: 'Atención del cliente'},
  {name: 'Auxiliar de almacen', region: 'Jalisco', description: 'Recepción'},
]

const products: Product[] = [
  {name: 'Lavadora automática', category: 'Electrodomésticos', price:18500, oldPrice: 25000, company: 'Marca X'},
  {name: 'Refrigerador', category: 'Electrodomésticos', price:50, oldPrice: 5000, company: 'Marca Z'},
]
const branches: Branch[] = [
  {name: 'Sucursal Centro', address: 'Calle 27, Col.Lilas', region: 'CDMX'},
  {name: 'Sucursal Norte', address: 'Av.Reforma 120', region: 'Nuevo León'},
  {name: 'Sucursal Online', address: 'Compras por internet', region: 'Todo el país'},
]


function BusinessProfile() {
  return (
  <>
    <Header />
    <main>
      <section className = "relative overflow-hidden bg-primary px-4 py-8">
        <div className = "absolute -top-10 -right-10 size-32 rounded-full bg-accent"/>

         <div className ="relative rouded-2xl  bg-white p-5 shadow-md">
          <div className="flex items-center gap-4">
          {business.logo?(
            <img src = {business.logo} alt = {'Logo de ${business.name}'}
            className = "size-20 shrink-0 rounded-xl object-cover"/>
          ):(
            <div className = "size-20 shrink-0 rounded-xl bg-card"/>
          )}
          <h1 className = "text-2xl leading-tight font-extrabold">
            {business.name}
          </h1>
          </div>

          <p className = "mt-4 text-sm text-muted-foreground">
            {business.description}
          </p>

          <p className = "mt-4 inline-flex items-center gap-2 rounded-full bg-card px-3 py-1.5 text-xs font-bold">
            <Ticket className = "size-4 text-primary"/>
            Ha participado {business.entries} veces en el sorteo
          </p>
          </div>
      </section>

      <section className='bg-card px-4 py-8'>
        <h2 className = "text-xl font-extrabold">Vacantes</h2>
        <div className="mt-4 flex flex-col gap-3">
          {vacancies.map ((vacancy)=>(
            <VacancyCard key ={vacancy.name} vacancy = {vacancy}/>
          ))}
        </div>
      </section>

      <section className='px-4 py-8'>
        <h2 className = "text-xl font-extrabold">Productos</h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {products.map ((product)=>(
            <ProductCard key ={product.name} product = {product}/>
          ))}
        </div>
      </section>
      
      <section className='bg-card px-4 py-8'>
        <h2 className = "text-xl font-extrabold">Sucursales</h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {branches.map ((branch)=>(
            <BranchCard key ={branch.name} branch = {branch}/>
          ))}
        </div>
      </section>

    </main>
    <Footer/>
  </>
  )}
