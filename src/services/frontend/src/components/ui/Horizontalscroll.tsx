import type { ComponentProps, PropsWithChildren, ReactNode } from 'react'
import { SectionHeader } from '../EditPage/SectionHeader'
import { cn } from 'cn'

type Props = {
  title: string
  children: ReactNode // the cards are the children, any component between the openen and closing tags
}

export function HorizontalScrollWithTitle({ title, children }: Props) {
  // const scroller = useRef<HTMLDivElement>(null) // create the empty box

  // function scrollBy(direction: 1 | -1) {
  //   // 1 is for right, -1 is for left
  //   const el = scroller.current
  //   if (!el) return
  //   el.scrollBy({ left: direction * el.clientWidth + 0.8, behavior: 'smooth' })
  // }
  return (
    <section>
      <SectionHeader>
        <SectionHeader.H2>{title}</SectionHeader.H2>
      </SectionHeader>
      <HorizontalScroll>{children}</HorizontalScroll>
    </section>
  )
}

export function HorizontalScroll({
  className,
  children,
}: PropsWithChildren & ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'mt-4 flex w-full min-h-[15dvh] snap-x  snap-mandatory gap-3 overflow-x-auto pb-2 scrollbar-none [&::-webkit-scrollbar]:hidden',
        className,
      )}
    >
      {children}
    </div>
  )
}
