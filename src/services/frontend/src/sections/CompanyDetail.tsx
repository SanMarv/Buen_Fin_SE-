import { Footer } from '#/components/Footer'
import { Header } from '#/components/Header'
import {
  JobCardCompany,
  ProductCardProductPage,
} from '#/components/ProductCardCompany'
<<<<<<< HEAD
import { HorizontalScroll } from '#/components/ui/Horizontalscroll'
import { Toaster } from '#/components/ui/sonner'
import { Link } from '@tanstack/react-router'
=======
import { HorizontalScrollWithTitle } from '#/components/ui/Horizontalscroll'
>>>>>>> 5480fd0 (feat(upload): adding preliminary upload of images)
import type { CompanyPageItem } from 'lib/types'
import { BadgeCheck, ShieldAlert, Ticket } from 'lucide-react'
import type { PropsWithChildren } from 'react'

type Props = {
  company: CompanyPageItem
  isOwner?: boolean
} & PropsWithChildren

// import type { Branch } from '#/components/ElementCard'
// const branches: Branch[] = [
//   { name: 'Sucursal Centro', address: 'Calle 27, Col.Lilas', region: 'CDMX' },
//   { name: 'Sucursal Norte', address: 'Av.Reforma 120', region: 'Nuevo León' },
//   {
//     name: 'Sucursal Online',
//     address: 'Compras por internet',
//     region: 'Todo el país',
//   },
// ]

export function CompanyDetail({ company, isOwner = false, children }: Props) {
  const { products } = company
  return (
    <>
      <Header />
      <main className="relative">
        {children}
        {/*
          <section className="bg-card px-4 py-8">
          <HorizontalScroll
            title="Sucursales"
            addLabel="Agregar sucursal"
            href="/register-location"
          >
            {branches.map((branch) => (
              <div key={branch.name} className="w-40 shrink-0 snap-start">
                <BranchCard branch={branch} />
              </div>
            ))}
          </HorizontalScroll>
        </section>
        */}
      </main>
      <Toaster/>
      <Footer />
    </>
  )
}
