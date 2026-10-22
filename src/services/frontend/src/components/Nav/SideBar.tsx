import { Link } from '@tanstack/react-router'
import { SheetClose } from '../ui/sheet'
import { useSession } from './MainContent'

const navLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/aboutus', label: 'Acerca De' },
  { to: '/search-products', label: 'Productos' },
  { to: '/faq', label: 'Preguntas frecuentes' },
] as const

export function SideBar() {
  const { data: session, isPending: isSessionPending } = useSession()
  const isVerfied = session && session.isUser && session.isValidated
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
      {!isSessionPending && isVerfied && (
        <SheetClose asChild>
          <Link
            to="/businesses"
            className="border-b py-3 text-base font-medium hover:underline decoration-foreground"
          >
            Mis negocios
          </Link>
        </SheetClose>
      )}
    </nav>
  )
}
