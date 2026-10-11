import z from 'zod'

const envShema = z.object({
  VITE_BACK_BASE: z.url(),
})
export const env = envShema.parse(import.meta.env)
