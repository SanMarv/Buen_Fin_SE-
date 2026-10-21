import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { env } from '#/config/env'
import { SheetClose } from '../ui/sheet'
import { useSession } from './MainContent'

type UserCompany = {
  companyId: string
  name: string
  certification: {
    rfc: string
    legal_name: string
    valid_until: string
  } | null
}

async function getVerifiedCompany(): Promise<UserCompany | null> {
  const response = await fetch(`${env.VITE_BACK_BASE}/companies/user`, {
    method: 'GET',
    credentials: 'include',
  })

  if (response.status === 204) return null
  if (!response.ok) return null

  const companies = (await response.json()) as UserCompany[]
  return companies.find((company) => company.certification !== null) ?? null
}

const navLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/aboutus', label: 'Acerca De' },
  { to: '/search-products', label: 'Productos' },
  { to: '/faq', label: 'Preguntas frecuentes' },
] as const

export function SideBar() {
  const { data: session, isPending: isSessionPending } = useSession()
  const { data: verifiedCompany, isPending: isCompanyPending } = useQuery({
    queryKey: ['userVerifiedCompany'],
    queryFn: getVerifiedCompany,
    enabled: !!session?.isUser && !!session.isValidated,
    retry: false,
  })

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
      {!isSessionPending &&
        session?.isUser &&
        session.isValidated &&
        !isCompanyPending &&
        verifiedCompany && (
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
