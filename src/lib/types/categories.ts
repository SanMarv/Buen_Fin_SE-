
export const CATEGORIES = [
  'tecnologies',
  'home',
  'fashion',
  'sports',
  'appliances',
  'toys',
] as const

export const CATEGORIES_ENUM = {
  tecnologies: CATEGORIES[0],
  home: CATEGORIES[1],
  fashion: CATEGORIES[2],
  sports: CATEGORIES[3],
  appliances: CATEGORIES[4],
  toys: CATEGORIES[5],
} as const

export type Category = typeof CATEGORIES[number]

export type CategoriesRecord<T> = Record<Category, T>
