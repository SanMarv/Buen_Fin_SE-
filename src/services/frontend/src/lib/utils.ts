import { createClientOnlyFn } from '@tanstack/react-start'
import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import z from 'zod'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const heicSchema = z.file().mime(['image/heic', 'image/heif'])

export const getObjectURL = createClientOnlyFn(async (file: File) => {
  if (!heicSchema.safeParse(file).success) {
    return URL.createObjectURL(file)
  }
  const heic2any = (await import('heic2any')).default
  const converted = await heic2any({
    blob: file,
    toType: 'image/jpeg',
    quality: 0.9,
  })

  const blob = Array.isArray(converted) ? converted[0] : converted

  return URL.createObjectURL(blob)
})
