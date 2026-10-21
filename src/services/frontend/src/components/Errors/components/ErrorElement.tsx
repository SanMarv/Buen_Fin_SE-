import { OnePage } from '#/components/OnePage'
import { Link } from '@tanstack/react-router'
import { ServerCrash } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface Props {
  Icon: LucideIcon
  body: string
}

export function Error({ Icon, body }: Props) {
  return (
    <OnePage>
      <Icon className="size-[20vh]" />
      <h1 className="font-semibold text-2xl text-center font-fraunces text-balance">
        {body}
      </h1>
      <Link
        to="/"
        className="font-medium py-2 w-4/5 rounded-xl text-center text-secondary uppercase bg-primary"
      >
        Regresar
      </Link>
    </OnePage>
  )
}

export function ErrorUnexpected() {
  return (
    <Error Icon={ServerCrash} body="El servidor tiene un problema inesperado" />
  )
}
