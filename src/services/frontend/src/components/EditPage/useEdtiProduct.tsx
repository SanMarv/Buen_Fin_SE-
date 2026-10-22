import { useNavigate } from '@tanstack/react-router'
import type { ProductPageItem } from 'lib/types'

export const useEditProduct = () => {
  const nav = useNavigate()
  return (product: Omit<ProductPageItem, 'company'>) => {
    nav({
      to: '/edit/product/$productId',
      params: {
        productId: product.id,
      },
    })
  }
}
