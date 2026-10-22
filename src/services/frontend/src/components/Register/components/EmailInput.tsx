import { useState } from 'react'
import type { ComponentProps } from 'react'
import styles from '../styles.module.css'
import { cn } from 'cn'
import { useBlurFunction, useErrorValue, useFocusFunction } from '../context'
import { Error } from './Error'

type Props = ComponentProps<'input'>

export function EmailField({ ...rest }: Props) {
  const [input, setInput] = useState('')
  const onBlur = useBlurFunction('email')
  const onFocus = useFocusFunction('email')
  const errorCode = useErrorValue('email')
  return (
    <Error name="email" className="px-2">
      <input
        id="input-email"
        placeholder="Email"
        {...rest}
        name="email"
        type="email"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className={cn(
          styles['input'],
          'h-full w-full',
          !!errorCode && 'border-destructive',
          rest.className,
        )}
        onBlur={onBlur}
        onFocus={onFocus}
      />
    </Error>
  )
}
