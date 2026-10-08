import { Link } from '@tanstack/react-router'
import { Languages, Moon } from 'lucide-react'
import type { ComponentProps } from 'react'

import { Button } from '#/components/ui/button'
import {Sheet,SheetClose,SheetContent,SheetDescription,SheetHeader,SheetTitle,SheetTrigger,} from '#/components/ui/sheet'

function Icon(props: ComponentProps<'svg'>) {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M37.3999 11H6.5999C5.38488 11 4.3999 11.985 4.3999 13.2C4.3999 14.415 5.38488 15.4 6.5999 15.4H37.3999C38.6149 15.4 39.5999 14.415 39.5999 13.2C39.5999 11.985 38.6149 11 37.3999 11Z"
        fill="currentColor"
      />
      <path
        d="M37.4001 19.8H14.5201C13.305 19.8 12.3201 20.785 12.3201 22C12.3201 23.2151 13.305 24.2 14.5201 24.2H37.4001C38.6151 24.2 39.6001 23.2151 39.6001 22C39.6001 20.785 38.6151 19.8 37.4001 19.8Z"
        fill="currentColor"
      />
      <path
        d="M37.3999 28.6H25.0799C23.8649 28.6 22.8799 29.5849 22.8799 30.8C22.8799 32.015 23.8649 33 25.0799 33H37.3999C38.6149 33 39.5999 32.015 39.5999 30.8C39.5999 29.5849 38.6149 28.6 37.3999 28.6Z"
        fill="currentColor"
      />
    </svg>
  )
}
function Logo () {
  return <img src="/logo.png" alt ="El Buen Fin Logo" className= "h-8 w-auto" />
}

export function Toggle() {
  return (
    <SheetTrigger asChild>
      <button type="button" aria-label="Abrir menú" className="text-primary">
        <Icon className="size-8" />
      </button>
    </SheetTrigger>
  )
}

const navLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/aboutus', label: 'Acerca De' },
  { to: '/faq', label: 'Preguntas frecuentes' },
] as const


export function Header() {
  return (
    <Sheet>
      <header className="sticky top-0 z-40 flex items-center justify-between border-b bg-background px-4 py-3">
        <Logo/>
        <Toggle />
      </header>

      <SheetContent side="right" className="flex flex-col">
        <SheetHeader>
          <SheetTitle>
            <Logo/>
          </SheetTitle>
          <SheetDescription className="sr-only">
            Menú de navegación
          </SheetDescription>
        </SheetHeader>

        <nav className="flex flex-col px-4">
          {navLinks.map((item) => (
            <SheetClose asChild key={item.to}>
              <Link to={item.to} className="border-b py-3 text-base font-medium hover:underline decoration-black">
                {item.label}
              </Link>
            </SheetClose>
          ))}
        </nav>

        <div className="flex flex-col gap-2 px-4">
          <SheetClose asChild>
            <Button asChild variant="outline">
              <Link to="/login">Iniciar sesión</Link>
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button asChild variant="outline">
              <Link to="/register-consumer">Registro de consumidor</Link>
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button asChild variant="outline">
              <Link to="/register-business">Registro de comercio</Link>
            </Button>
          </SheetClose>
        </div>

        <div className="mt-auto flex gap-2 px-4 pb-4">
          <Button variant="outline" size="icon" aria-label="Traducir">
            <Languages />
          </Button>
          <Button variant="outline" size="icon" aria-label="Modo oscuro">
            <Moon />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}