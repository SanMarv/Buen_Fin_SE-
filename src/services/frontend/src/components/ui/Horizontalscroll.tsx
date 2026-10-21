import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { Button } from '#/components/ui/button'

type Props = {
  title: string
  addLabel: string
  children: ReactNode // the cards are the children, any component between the openen and closing tags
  href: string
  isOwner?: boolean
}

export function HorizontalScroll({
  title,
  addLabel,
  children,
  href,
  isOwner = false,
}: Props) {
  // const scroller = useRef<HTMLDivElement>(null) // create the empty box

  // function scrollBy(direction: 1 | -1) {
  //   // 1 is for right, -1 is for left
  //   const el = scroller.current
  //   if (!el) return
  //   el.scrollBy({ left: direction * el.clientWidth + 0.8, behavior: 'smooth' })
  // }
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xl font-extrabold">{title}</h2>
        {isOwner && (
          <Button asChild size="icon-sm" className="rounded-full">
            <Link to={href} aria-label={addLabel}>
              <Plus className="size-5" />
            </Link>
          </Button>
        )}
      </div>
      <div className="mt-4 flex snap-x  snap-mandatory gap-3 overflow-x-auto pb-2 scrollbar-none [&::-webkit-scrollbar]:hidden">
        {children}
      </div>
    </div>
  )
}
