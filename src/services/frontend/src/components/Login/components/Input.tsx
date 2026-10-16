import type { UserLoginInput } from 'lib/schemas'
import type { ComponentProps, PropsWithChildren } from 'react'
import { useState } from 'react'
import { useBlurFunction, useFocusFunction } from '../context'
import styles from '../styles.module.css'
import { Error } from './Error'
import { cn } from 'cn'

type UserName = keyof Omit<UserLoginInput, 'email'>
type Props = {
  name: UserName
} & ComponentProps<'input'> &
  PropsWithChildren
export function Input({ name, ...rest }: Omit<Props, 'children'>) {
  const [input, setInput] = useState('')
  const onBlur = useBlurFunction(name)
  const onFocus = useFocusFunction(name)
  return (
    <input
      name={name}
      value={input}
      id={`input-${name}`}
      className={styles['input']}
      onChange={(e) => setInput(e.target.value)}
      onBlur={onBlur}
      onFocus={onFocus}
      {...rest}
    />
  )
}
export function InputWithError({ name, children, ...rest }: Props) {
  return (
    <Error name={name}>
      <Input
        name={name}
        className={cn(styles['input'], rest.className)}
        {...rest}
      />
      {children}
    </Error>
  )
}
