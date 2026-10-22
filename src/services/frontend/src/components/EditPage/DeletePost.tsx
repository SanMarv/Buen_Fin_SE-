import { useRouter } from '@tanstack/react-router'
import { MoreBtn } from './MoreBtn'
import { useState } from 'react'
import type { ComponentProps, MouseEvent } from 'react'
import { cn } from 'cn'
import { env } from '#/config/env'

const fetchDelete = async (id: string): Promise<{ status: number }> => {
  try {
    const res = await fetch(`${env.VITE_BACK_BASE}/product/${id}`, {
      credentials: 'include',
      method: 'DELETE',
    })
    const data = await res.json()
    if (res.status < 200 || res.status > 300) {
      if (import.meta.env.DEV) console.error(data)
      return { status: data.status }
    }
    return { status: 200 }
  } catch {
    return { status: 500 }
  }
}
type Props = {
  id: string
} & ComponentProps<'button'>
export function DeletePost({ id, className, onClick, ...rest }: Props) {
  const { invalidate } = useRouter()
  const [isFetching, setFetch] = useState(false)
  const handleClick = async (e: MouseEvent<HTMLButtonElement>) => {
    if (isFetching) return
    setFetch(true)
    onClick?.(e)
    try {
      fetchDelete(id)
    } finally {
      setFetch(false)
      invalidate({ sync: true })
    }
  }
  return (
    <MoreBtn
      className={cn('rotate-45', className)}
      onClick={handleClick}
      disabled={isFetching}
      {...rest}
    />
  )
}
