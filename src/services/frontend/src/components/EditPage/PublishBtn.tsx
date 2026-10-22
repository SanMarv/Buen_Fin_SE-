import type { ProductPageItem } from 'lib/types'
import { Button } from '../ui/button'
import { Cloud, EyeClosed } from 'lucide-react'
import type { LucideProps } from 'lucide-react'
import { useState } from 'react'
import type { ComponentProps } from 'react'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { env } from '#/config/env'

type Props = {
  visibility: ProductPageItem['visibility']
  productId: string
} & ComponentProps<'button'>

function Icon({ isVisible, ...rest }: { isVisible: boolean } & LucideProps) {
  if (isVisible) return <EyeClosed {...rest} />
  return <Cloud {...rest} />
}

export function PublishBtn({ visibility, productId, ...rest }: Props) {
  const { invalidate } = useRouter()
  const [isFetchin, setFetch] = useState(false)
  const [visible, setVisibility] = useState(visibility)
  const navigate = useNavigate()
  const handleClick = async () => {
    if (isFetchin) return
    setFetch(true)
    setVisibility((v) => {
      const newState = v === 'PRIVATE' ? 'PUBLIC' : 'PRIVATE'
      fetch(`${env.VITE_BACK_BASE}/product/visibility/${productId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        method: 'PUT',
        body: JSON.stringify({ visibility: newState }),
      })
        .then(() => {
          if (newState === 'PUBLIC')
            navigate({
              to: '/search-products/$postid',
              params: { postid: productId },
            })
        })
        .finally(() => {
          setFetch(false)
          invalidate({ sync: true })
        })
      return newState
    })
  }
  const isVisible = visible !== 'PRIVATE'

  return (
    <Button
      variant={'outline'}
      {...rest}
      disabled={isFetchin}
      onClick={handleClick}
    >
      <span>{isVisible ? 'Esconder' : 'Publicar'}</span>
      <Icon isVisible={isVisible} />
    </Button>
  )
}
