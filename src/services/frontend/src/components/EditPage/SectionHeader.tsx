import { cn } from 'cn'
import type { ComponentProps, PropsWithChildren } from 'react'

type Props = ComponentProps<'header'> & PropsWithChildren
export function SectionHeader({ className, children, ...rest }: Props) {
  return (
    <header
      className={cn('flex items-center justify-between gap-2', className)}
      {...rest}
    >
      {children}
    </header>
  )
}
type PropsH2 = PropsWithChildren & ComponentProps<'h2'>
SectionHeader.H2 = ({ className, children, ...rest }: PropsH2) => (
  <h2 className={cn('text-xl font-extrabold', className)} {...rest}>
    {children}
  </h2>
)
