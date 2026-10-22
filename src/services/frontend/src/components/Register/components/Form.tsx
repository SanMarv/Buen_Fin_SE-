import type { ComponentProps, PropsWithChildren, SubmitEvent } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import type { PromiseResult } from 'lib/types'
import type { UserRegisterInput } from 'lib/schemas'
import { env } from '#/config/env'
import { userRegisterInput } from 'lib/schemas'
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
async function SendData(
  submit: UserRegisterInput,
): PromiseResult<Valid, Error> {
  try {
    await new Promise((res) => setTimeout(res, 5000))
    const res = await fetch(`${env.VITE_BACK_BASE}/auth/register`, {
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
    const formValues = Object.fromEntries(form)
    const {
      success: isValidInput,
      data,
      error,
    } = userRegisterInput.safeParse(formValues)
    try {
      if (!isValidInput) {
        const errorMessages: Partial<Record<keyof UserRegisterInput, string>> = {}
        for (const issue of error.issues) {
          const field = issue.path[0] as keyof UserRegisterInput
          errorMessages[field] = issue.message
        }
        if (!String(formValues.email).trim()) {
          errorMessages.email = 'EMAIL_NOT_PROVIDED'
        }
        if (!String(formValues.password).trim()) {
          errorMessages.password = 'PASSWORD_NOT_PROVIDED'
        }
        const eleme = e.currentTarget.elements.namedItem(
          String(error.issues[0].path[0]),
        )
        if (eleme instanceof HTMLElement) {
          eleme.focus()
        }
        changeErros(errorMessages)
        return
      }
      const { success: wasCreated, error: errorCreating } = await SendData(data)
      if (wasCreated) {
        await queryClient.invalidateQueries({ queryKey: ['me'] })
        toast.success('Usuario Registrado', { position: 'bottom-center' })
        navigate({ to: '/' })
      } else if (errorCreating.status === 409) {
        changeErros({ email: 'EMAIL_ALREADY_USED' })
      } else {
        toast.error(
          `Error registrando el usarios status: ${errorCreating.status}`,
          { position: 'bottom-center' },
        )
      }
    } finally {
      setIsSending(false)
    }
  }
  return (
    <form
      aria-label="Crear cuenta"
      {...rest}
      onSubmit={handleSubmit}
      className={cn(rest.className, 'flex flex-col justify-center gap-y-5')}
    >
      {children}
    </form>
  )
}
