import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { Button } from '#/components/ui/button'

type Props = {
  title: string
  addLabel: string
  children: ReactNode 
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
      <div className="mt-4 flex w-full min-h-[15dvh] snap-x  snap-mandatory gap-3 overflow-x-auto pb-2 scrollbar-none [&::-webkit-scrollbar]:hidden">
        {children}
      </div>
    </div>
  )
}
