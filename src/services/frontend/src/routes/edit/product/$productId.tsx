import { createFileRoute, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import type { Dispatch, SetStateAction, SubmitEvent } from 'react'
import { XIcon } from 'lucide-react'
import { Footer } from '#/components/Footer'
import { Header } from '#/components/Header'
import { Button } from '#/components/ui/button.tsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select.tsx'
import { CATEGORIES_ENUM } from 'lib/types'
import type { CategoriesRecord, Category } from 'lib/types'
import { fetchProduct, fetchProductSelect } from '#/lib/fetch'
import { ApiError } from '#/components/Errors'
import { ErrorPage } from '#/components/Errors/ErrorPage'
import { Badge } from '#/components/ui/badge'
import { ImagesUpload } from '#/components/EditPage/ImageUpload'

export const Route = createFileRoute('/edit/product/$productId')({
  ssr: false,
  component: RouteComponent,
  beforeLoad: async ({ params }) => {
    try {
      await fetchProductSelect(params.productId)
    } catch (e) {
      if (e instanceof ApiError) {
        throw redirect({
          to: '/search-products/$postid',
          params: { postid: params.productId },
        })
      }
      throw new ApiError(500, 'Unexpected Error')
    }
  },
  loader: async ({ params }) => {
    const product = await fetchProduct(params.productId)
    return { initialValues: product, productId: params.productId }
  },
  errorComponent: ErrorPage,
})

const CATEGORIES: CategoriesRecord<string> = {
  [CATEGORIES_ENUM['tecnologies']]: 'Tecnología',
  [CATEGORIES_ENUM['home']]: 'Hogar',
  [CATEGORIES_ENUM['fashion']]: 'Moda',
  [CATEGORIES_ENUM['sports']]: 'Deportes',
  [CATEGORIES_ENUM['appliances']]: 'Electrodomésticos',
  [CATEGORIES_ENUM['toys']]: 'Juguetes',
}
const DISCOUNTS = [10, 15, 20, 25, 30, 35, 40]
const precioNuevo = (n: number) => Math.round(n * 100) / 100

const inputClass =
  'w-full rounded-xl border border-input bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50'

const triggerClass =
  'w-full rounded-xl border border-input bg-background px-4 text-base text-foreground data-[size=default]:h-12'

type CategoryItem = { category: Category; name: string }
type PropsCategoryInput = {
  categories: CategoryItem[]
  setCategory: Dispatch<SetStateAction<CategoryItem[]>>
}
function CategoriesInput({ categories, setCategory }: PropsCategoryInput) {
  const options = Object.entries(CATEGORIES)
    .filter(([category]) => !categories.some((c) => c.category === category))
    .map<CategoryItem>(([k, v]) => ({ category: k as Category, name: v }))
  const handleChange = (value: Category) => {
    setCategory((p) => [...p, { category: value, name: CATEGORIES[value] }])
  }
  const handleDelete = (value: Category) => {
    setCategory((p) => p.filter(({ category }) => category !== value))
  }
  return (
    <>
      {options.length > 0 && (
        <Select required value={''} onValueChange={handleChange}>
          <SelectTrigger id="product-category" className={triggerClass}>
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
function RouteComponent() {
  const { initialValues, productId } = Route.useLoaderData()
  const [name, setName] = useState(initialValues.name)
  const [oldPrice, setOldPrice] = useState(initialValues.price)
  const [newPrice, setNewPrice] = useState(initialValues.newPrice)
  const [percent, setPercent] = useState('')
  const [description, setDescription] = useState(initialValues.description)
  const initialCategories: CategoryItem[] = initialValues.categories.map(
    (v) => ({
      category: v,
      name: CATEGORIES[v],
    }),
  )
  const [categories, setCategory] = useState<CategoryItem[]>([
    ...initialCategories,
  ])
  const [formError, setFormError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const old = Number(oldPrice)
  const now = Number(newPrice)
  const savedPercent =
    old > 0 && now > 0 && now < old ? Math.round((1 - now / old) * 100) : null

  function handleOldPrice(value: number) {
    setOldPrice(value)
    if (percent && value > 0) {
      setNewPrice(precioNuevo(value * (1 - Number(percent) / 100)))
    }
  }

  function handlePercent(value: string) {
    if (value === 'none') {
      setPercent('')
      setNewPrice(initialValues.newPrice)
      return
    }

    setPercent(value)
    if (old > 0) {
      setNewPrice(precioNuevo(old * (1 - Number(value) / 100)))
    }
  }

  function handleNewPrice(value: number) {
    setNewPrice(value)
    setPercent('')
  }

  function resetForm() {
    setName(initialValues.name)
    setOldPrice(initialValues.price)
    setNewPrice(initialValues.newPrice)
    setPercent('')
    setDescription(initialValues.description)
    setCategory([...initialCategories])
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSuccess(false)

    if (!(Number(newPrice) < Number(oldPrice))) {
      setFormError('El precio nuevo debe ser menor que el precio viejo.')
      return
    }

    setFormError('')
    setIsSuccess(true)
    resetForm()
  }

  return (
    <>
      <Header />
      <section className="relative overflow-hidden bg-primary px-4 py-8 text-primary-foreground">
        <div className="absolute -top-10 -right-10 size-32 rounded-full bg-accent" />
        <div className="relative">
          <h1 className="text-3xl leading-tight font-extrabold">
            Actualizar producto
          </h1>
        </div>
      </section>
      <main className="bg-background px-4 py-8">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-lg flex-col gap-5 rounded-3xl border border-border bg-card p-6 text-card-foreground"
        >
          <div className="flex flex-col gap-1.5">
            <label htmlFor="product-name" className="text-sm font-semibold">
              Nombre <span aria-hidden="true"></span>
            </label>
            <input
              id="product-name"
              type="text"
              required
              className={inputClass}
              placeholder="Ej. Audífonos inalámbricos"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="product-old-price"
              className="text-sm font-semibold"
            >
              Precio original <span aria-hidden="true"></span>
            </label>
            <input
              id="product-old-price"
              type="number"
              required
              min={0}
              step="any"
              className={inputClass}
              placeholder="0.00"
              value={oldPrice}
              onChange={(event) => handleOldPrice(Number(event.target.value))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="product-percent"
                className="text-sm font-semibold"
              >
                Descuento
              </label>
              <Select value={percent} onValueChange={handlePercent}>
                <SelectTrigger id="product-percent" className={triggerClass}>
                  <SelectValue placeholder="Elige un %" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="none">Sin descuento</SelectItem>
                  {DISCOUNTS.map((discount) => (
                    <SelectItem key={discount} value={discount.toString()}>
                      {discount}%
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="product-new-price"
                className="text-sm font-semibold"
              >
                Precio nuevo <span aria-hidden="true"></span>
              </label>
              <input
                id="product-new-price"
                type="number"
                required
                min={0}
                step="any"
                className={inputClass}
                placeholder="0"
                value={newPrice}
                onChange={(event) => handleNewPrice(Number(event.target.value))}
              />
            </div>
          </div>

          <p className="-mt-2 text-sm text-muted-foreground">
            {savedPercent !== null
              ? `Descuento de ${savedPercent}%.`
              : 'Escribe el precio nuevo o elige un porcentaje y lo calculamos.'}
          </p>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="product-description"
              className="text-sm font-semibold"
            >
              Descripción <span aria-hidden="true"></span>
            </label>
            <textarea
              rows={1}
              className={`${inputClass} resize-none overflow-hidden`}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              onInput={(event) => {
                const textarea = event.currentTarget
                textarea.style.height = 'auto'
                textarea.style.height = `${textarea.scrollHeight}px`
              }}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold">Imágenes</span>
            <ImagesUpload id={productId} initialImages={initialValues.images} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="product-category"
              className="text-sm font-semibold pb-2"
            >
              Categoría <span aria-hidden="true"></span>
            </label>
            <CategoriesInput
              categories={categories}
              setCategory={setCategory}
            />
          </div>
          {formError && (
            <p role="alert" className="text-sm text-destructive">
              {formError}
            </p>
          )}
          {isSuccess && (
            <p role="status" className="text-sm font-semibold text-success">
              Producto registrado correctamente.
            </p>
          )}
          <Button type="submit">Registrar producto</Button>
        </form>
      </main>

      <Footer />
    </>
  )
}
