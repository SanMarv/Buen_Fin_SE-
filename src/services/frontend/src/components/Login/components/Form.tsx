import type { ComponentProps, PropsWithChildren, SubmitEvent } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import type { PromiseResult } from 'lib/types'
import type { UserLoginInput } from 'lib/schemas'
import { env } from '#/config/env'
import { fail, success } from 'lib/types'
import { useChangeErrorFn, useIsUploading } from '../context'
import { cn } from 'cn'
import { toast } from 'sonner'

type FormProps = PropsWithChildren & ComponentProps<'form'>

type Valid = {
  status: 201
}
type Error = {
  status: number
  error: string
}
async function SendData(submit: UserLoginInput): PromiseResult<Valid, Error> {
  try {
    const res = await fetch(`${env.VITE_BACK_BASE}/auth/login`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(submit),
    })
    if (res.status < 200 || res.status > 300) {
      console.error(await res.json())
      return fail({ error: 'Error sending info to server', status: res.status })
    }
    return success({ status: 201 })
  } catch (e) {
    console.error(e)
    return fail({ status: 500, error: 'Unexpected error' })
  }
}

export default function Form({ children, ...rest }: FormProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isSending, setIsSending] = useIsUploading()
  const changeErros = useChangeErrorFn()
  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isSending) return
    setIsSending(true)
    const form = new FormData(e.currentTarget)
    const email = String(form.get('email') ?? '').trim()
    const password = String(form.get('password') ?? '')
    const data: UserLoginInput = { email, password }
    try {
      const emailIsMissing = !email
      const passwordIsMissing = !password.trim()
      changeErros({
        email: emailIsMissing ? 'EMAIL_NOT_PROVIDED' : undefined,
        password: passwordIsMissing ? 'PASSWORD_NOT_PROVIDED' : undefined,
      })
      if (emailIsMissing || passwordIsMissing) {
        const missingField = emailIsMissing ? 'email' : 'password'
        const element = e.currentTarget.elements.namedItem(missingField)
        if (element instanceof HTMLElement) element.focus()
        return
      }
      const { success: wasCreated, error: errorCreating } = await SendData(data)
      if (wasCreated) {
        await queryClient.invalidateQueries({ queryKey: ['me'] })
        toast.success('Login de usuario satisfactorio', {
          position: 'bottom-center',
        })
        navigate({ to: '/' })
      } else if ([400, 401, 404].includes(errorCreating.status)) {
        changeErros({
          email: 'INVALID_CREDENTIALS',
          password: 'INVALID_CREDENTIALS',
        })
      } else {
        toast.error('No se pudo iniciar sesión. Intenta de nuevo.', {
          position: 'bottom-center',
        })
      }
    } finally {
      setIsSending(false)
    }
  }
  return (
    <form
      aria-label="Iniciar sesión"
      {...rest}
      noValidate
      onSubmit={handleSubmit}
      className={cn(rest.className, 'flex flex-col justify-center gap-y-3')}
    >
      {children}
    </form>
  )
}
