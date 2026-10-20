import type { ComponentProps, PropsWithChildren } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import { cn } from '#/lib/utils.ts'

type Props = PropsWithChildren & ComponentProps<'main'>
export function OnePage({ children, className, ...rest }: Props) {
  return (
    <>
      <div className="min-h-[90dvh] grid grid-rows-[auto_1fr] grid-cols-1">
        <Header />
        <main
          className={cn(
            'flex flex-col justify-center items-center ',
            className,
          )}
          {...rest}
        >
          {children}
        </main>
      </div>
      <Footer />
    </>
  )
}
