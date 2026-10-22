import { ApiError } from '#/components/Errors'
import { env } from '#/config/env'
import type { CompanyPageItem, ProductPageItem } from 'lib/types'

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

const fetchBack = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, options).catch((e) => {
    console.error(e)
    throw new ApiError(500, `Error in fetch ${url}`)
  })
  if (res.status === 204) return { status: 204 }
  const data = await res.json()
  if (res.status < 200 || res.status > 300) {
    if (import.meta.env.DEV) console.error(data)
    throw new ApiError(res.status, data.error)
  }
  return data
}

export const fetchCompany = async (id: string): Promise<CompanyPageItem> => {
  const url = `${env.VITE_BACK_BASE}/companies/info/${id}`
  return await fetchBack(url)
}

export const fetchDrafts = async (): Promise<ProductPageItem[]> => {
  const url = `${env.VITE_BACK_BASE}/products/drafts`
  return await fetchBack(url, { credentials: 'include' })
}

export const fetchProductSelect = async (
  id: string,
): Promise<{ status: number }> => {
  const url = `${env.VITE_BACK_BASE}/product/edit/${id}`
  await fetchBack(url, { credentials: 'include' })
  return { status: 204 }
}

export const fetchProduct = async (
  id: string,
  credentials = true,
): Promise<ProductPageItem> => {
  const url = `${env.VITE_BACK_BASE}/products/${id}`
  return await fetchBack(url, credentials ? { credentials: 'include' } : {})
}
