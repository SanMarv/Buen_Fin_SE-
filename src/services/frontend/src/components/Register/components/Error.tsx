import type { UserRegisterInput } from 'lib/schemas'
import * as messages from '../errorMessages'
import type { ComponentProps, PropsWithChildren } from 'react'
import styles from '../styles.module.css'
import { useErrorValue } from '../context'
import { cn } from 'cn'

type UserName = keyof UserRegisterInput
const errors: Record<UserName, Partial<Record<string, string>>> = {
  lastname: messages.es_lastname,
  name: messages.es_name,
  password: messages.es_password,
  email: messages.es_email,
}

type Props = {
  name: UserName
} & PropsWithChildren &
  ComponentProps<'label'>
export function Error({ name, children, ...rest }: Props) {
  const errorMessages = errors[name]
  const errorCode = useErrorValue(name)
  const hasError = !!errorCode
  const errorMessage = errorCode ? errorMessages[errorCode] : undefined
  return (
    <label
      htmlFor={`input-${name}`}
      className={cn(styles['error-label'], rest.className)}
      data-error={hasError}
    >
      {hasError && errorMessage && (
        <span className={styles['error-mss']}>
          <span>{errorMessage}</span>
        </span>
      )}
      {children}
    </label>
  )
}
