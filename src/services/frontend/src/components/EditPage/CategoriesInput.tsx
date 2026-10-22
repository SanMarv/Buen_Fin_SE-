import { CATEGORIES_ENUM } from 'lib/types'
import type { Category, CategoriesRecord } from 'lib/types'
import { useEffect, useEffectEvent, useRef } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Badge } from '../ui/badge'
import { XIcon } from 'lucide-react'
import { env } from '#/config/env'
import { useRouter } from '@tanstack/react-router'

export const CATEGORIES_LABLE: CategoriesRecord<string> = {
  [CATEGORIES_ENUM['tecnologies']]: 'Tecnología',
  [CATEGORIES_ENUM['home']]: 'Hogar',
  [CATEGORIES_ENUM['fashion']]: 'Moda',
  [CATEGORIES_ENUM['sports']]: 'Deportes',
  [CATEGORIES_ENUM['appliances']]: 'Electrodomésticos',
  [CATEGORIES_ENUM['toys']]: 'Juguetes',
}
export type CategoryItem = { category: Category; name: string }

async function fetchUpdateCategories(id: string, categories: Category[]) {
  await fetch(`${env.VITE_BACK_BASE}/product/${id}/categories`, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    method: 'PUT',
    body: JSON.stringify({ categories }),
  })
}
type PropsCategoryInput = {
  categories: CategoryItem[]
  setCategory: Dispatch<SetStateAction<CategoryItem[]>>
  productId: string
}
export function CategoriesInput({
  categories,
  setCategory,
  productId,
}: PropsCategoryInput) {
  const isFirstRequest = useRef(true)
  const options = Object.entries(CATEGORIES_LABLE)
    .filter(([category]) => !categories.some((c) => c.category === category))
    .map<CategoryItem>(([k, v]) => ({ category: k as Category, name: v }))
  const handleChange = (value: Category) => {
    setCategory((p) => [
      ...p,
      { category: value, name: CATEGORIES_LABLE[value] },
    ])
  }
  const sendUpdate = useEffectEvent(() => {
    fetchUpdateCategories(
      productId,
      categories.map((v: CategoryItem) => v.category),
    ).finally(() => invalidate({ sync: true }))
  })
  const { invalidate } = useRouter()
  const handleDelete = (value: Category) => {
    setCategory((p) => p.filter(({ category }) => category !== value))
  }
  useEffect(() => {
    if (isFirstRequest.current) {
      isFirstRequest.current = false
      return
    }
    const timeout = setTimeout(sendUpdate, 2 * 1000)
    return () => {
      clearTimeout(timeout)
    }
  }, [categories])
  return (
    <>
      {options.length > 0 && (
        <Select value={''} onValueChange={handleChange} required={false}>
          <SelectTrigger
            id="product-category"
            className={
              'w-full rounded-xl border border-input bg-background px-4 text-base text-foreground data-[size=default]:h-12'
            }
          >
            <SelectValue placeholder="Selecciona una categoría" />
          </SelectTrigger>
          <SelectContent position="popper">
            {options.map(({ category, name }) => (
              <SelectItem key={category} value={category}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <div className="flex gap-2 flex-wrap max-w-full pt-2">
        {categories.map(({ category, name }) => (
          <Badge
            key={category}
            onClick={() => handleDelete(category)}
            className="flex items-center gap-x-3 justify-center px-2 text-sm"
          >
            <span>{name}</span>
            <XIcon className="size-5" />
          </Badge>
        ))}
      </div>
    </>
  )
}
