import type { ProductPageItem } from 'lib/types'
import { Button } from '../ui/button'
import { Cloud, EyeClosed } from 'lucide-react'
import type { LucideProps } from 'lucide-react'
import type { ComponentProps } from 'react'

type Props = {
  visibility: ProductPageItem['visibility']
} & ComponentProps<'button'>
function Icon({ isVisible, ...rest }: { isVisible: boolean } & LucideProps) {
  if (isVisible) return <EyeClosed {...rest} />
  return <Cloud {...rest} />
}
export function PublishBtn({ visibility, ...rest }: Props) {
  const handleClick = () => {}
  const isVisible = visibility !== 'PRIVATE'

  return (
    <Button variant={'outline'} {...rest}>
      <span>{isVisible ? 'Esconder' : 'Publicar'}</span>
      <Icon isVisible={isVisible} />
    </Button>
  )
}
