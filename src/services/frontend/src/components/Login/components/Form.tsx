import type { ComponentProps, PropsWithChildren, SubmitEvent } from 'react'
import type { PromiseResult } from 'lib/types'
import type { UserLoginInput } from 'lib/schemas'
import { env } from '#/config/env'
import { userLoginInput } from 'lib/schemas'
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
  submit: UserLoginInput,
): PromiseResult<Valid, Error> {
  try {
    await new Promise((res) => setTimeout(res, 5000))
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
  const [isSending, setIsSending] = useIsUploading()
  const changeErros = useChangeErrorFn()
  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isSending) return
    setIsSending(true)
    const form = new FormData(e.currentTarget)
    const {
      success: isValidInput,
      data,
      error,
    } = userLoginInput.safeParse(Object.fromEntries(form))
    try {
      if (!isValidInput) {
        const errorMessges = error.issues.reduce(
          (prev, curr) => ({ ...prev, [curr.path[0]]: curr.message }),
          {},
        )
        const eleme = e.currentTarget.elements.namedItem(
          String(error.issues[0].path[0]),
        )
        if (eleme instanceof HTMLElement) {
          eleme.focus()
        }
        changeErros(errorMessges)
        return
      }
      const { success: wasCreated, error: errorCreating } = await SendData(data)
      if (wasCreated) {
        toast.success('Login de usuario satisfactorio', { position: 'bottom-center' })
      } else {
        toast.error(
          `El usuario o la contraseña son incorrectos`,
          { position: 'bottom-center' },
        )
      }
    } finally {
      setIsSending(false)
    }
  }
  return (
    <form
      {...rest}
      onSubmit={handleSubmit}
      className={cn(
        rest.className,
        'flex flex-col justify-center gap-y-3',
      )}
    >
      {children}
    </form>
  )
}
