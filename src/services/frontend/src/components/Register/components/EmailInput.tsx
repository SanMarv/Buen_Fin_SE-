import { useState } from 'react'
import type { ComponentProps } from 'react'
import styles from '../styles.module.css'
import { cn } from 'cn'
import { useBlurFunction, useErrorValue, useFocusFunction } from '../context'

type Props = ComponentProps<'input'>

export function EmailField({ ...rest }: Props) {
  const [input, setInput] = useState('')
  const onBlur = useBlurFunction('email')
  const onFocus = useFocusFunction('email')
  const errorCode = useErrorValue('email')
  return (
    <label
      className={'h-[6vh] flex items-center justify-start px-2 text-[12px]'}
    >
      <input
        placeholder="Email"
        {...rest}
        name="email"
        type="email"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className={cn(
          styles['input'],
          'w-full px-4 border-input border h-full rounded-2xl',
          !!errorCode && 'border-destructive',
          rest.className,
        )}
        onBlur={onBlur}
        onFocus={onFocus}
      />
    </label>
  )
}
