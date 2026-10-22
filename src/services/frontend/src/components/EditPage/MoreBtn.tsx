import type { ComponentProps } from 'react'
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'
import { cn } from 'cn'

type Props = ComponentProps<'button'>

export function MoreBtn({ className, ...rest }: Props) {
  return (
    <Button
      asChild
      size="icon-sm"
      className={cn('rounded-full p-1', className)}
      {...rest}
    >
      <Plus className="size-5" />
    </Button>
  )
}
