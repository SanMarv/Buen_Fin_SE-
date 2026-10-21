import { ApiError } from '#/components/Errors'
import { env } from '#/config/env'
import type { CompanyPageItem } from 'lib/types'

export const fetchIsOwner = async (clientId: string): Promise<boolean> => {
  try {
    const res = await fetch(`${env.VITE_BACK_BASE}/auth/company/${clientId}`, {
      credentials: 'include',
    })
    return res.status === 204
  } catch {
    return false
  }
}

export const fetchCompany = async (id: string): Promise<CompanyPageItem> => {
  const res = await fetch(`${env.VITE_BACK_BASE}/companies/info/${id}`)
  const data = await res.json()
  if (res.status < 200 || res.status > 300)
    throw new ApiError(res.status, data.error)
  return data
}
