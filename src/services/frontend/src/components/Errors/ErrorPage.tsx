import type { ErrorComponentProps } from '@tanstack/react-router'
import { ErrorUnexpected } from './components/ErrorElement'
import { ErrorApi } from './components/ErrorApi'
import { ApiError } from '.'

export function ErrorPage({ error }: ErrorComponentProps) {
  if (error instanceof ApiError) return <ErrorApi error={error} />
  return <ErrorUnexpected />
}
