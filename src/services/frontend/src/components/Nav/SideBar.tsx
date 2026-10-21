import { Link } from '@tanstack/react-router'
import { SheetClose } from '../ui/sheet'

const navLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/aboutus', label: 'Acerca De' },
  { to: '/search-products', label: 'Productos' },
  { to: '/faq', label: 'Preguntas frecuentes' },
] as const

export function SideBar() {
  return (
    <nav className="flex flex-col px-4">
      {navLinks.map((item) => (
        <SheetClose asChild key={item.to}>
          <Link
            to={item.to}
            className="border-b py-3 text-base font-medium hover:underline decoration-foreground"
          >
            {item.label}
          </Link>
        </SheetClose>
      ))}
    </nav>
  )
}
