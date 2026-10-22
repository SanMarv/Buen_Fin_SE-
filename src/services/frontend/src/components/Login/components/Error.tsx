import type { UserLoginInput } from 'lib/schemas'
import * as messages from '../errorMessages'
import type { ComponentProps, PropsWithChildren } from 'react'
import styles from '../styles.module.css'
import { useErrorValue } from '../context'
import { cn } from 'cn'

type UserName = keyof UserLoginInput
const errors: Record<UserName, Record<string, string>> = {
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
  const showMessage = hasError && !(name === 'email' && errorCode === 'INVALID_CREDENTIALS')
  return (
    <label
      htmlFor={`input-${name}`}
      className={cn(styles['error-label'], rest.className)}
      data-error={hasError}
    >
      {showMessage && (
        <span className={styles['error-mss']}>
          <span>{errorMessages[errorCode]}</span>
        </span>
      )}
      {children}
    </label>
  )
}
