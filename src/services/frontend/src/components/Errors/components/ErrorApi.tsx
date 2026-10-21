import type { ApiError } from '..'
import { UserLock, DatabaseSearch } from 'lucide-react'
import { Error, ErrorUnexpected } from './ErrorElement'

export function ErrorApi({ error }: { error: ApiError }) {
  if (import.meta.env.DEV)
    console.error({ status: error.status, error: error.message })
  if (error.status === 404)
    return (
      <Error Icon={DatabaseSearch} body="El recurso de buscas no se encontro" />
    )
  if (error.status === 403)
    return (
      <Error
        Icon={UserLock}
        body="No tienes las credenciales para acceder a este elemento"
      />
    )
  return <ErrorUnexpected />
}
