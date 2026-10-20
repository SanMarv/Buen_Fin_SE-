import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { ImagePlus } from 'lucide-react'
import { Footer } from '#/components/Footer'
import {Header} from '#/components/Header'
import {Button} from '#/components/ui/button.tsx'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '#/components/ui/select.tsx'
import { CATEGORIES_ENUM } from 'lib/types'
import type { CategoriesRecord } from 'lib/types'

export const Route = createFileRoute('/register-products')({
  component: RouteComponent,
})

const CATEGORIES: CategoriesRecord<string> = {
  [CATEGORIES_ENUM['tecnologies']]: 'Tecnología',
  [CATEGORIES_ENUM['home']]: 'Hogar',
  [CATEGORIES_ENUM['fashion']]: 'Moda',
  [CATEGORIES_ENUM['sports']]: 'Deportes',
  [CATEGORIES_ENUM['appliances']]: 'Electrodomésticos',
  [CATEGORIES_ENUM['toys']]: 'Juguetes',
}

const categoryEntries = Object.entries(CATEGORIES)
const DISCOUNTS = [10, 15, 20, 25, 30, 35, 40]
const precioNuevo = (n : number) => String(Math.round(n*100)/100)

const inputClass =
  'w-full rounded-xl border border-input bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50'

const triggerClass =
  'w-full rounded-xl border border-input bg-background px-4 text-base text-foreground data-[size=default]:h-12'

function RouteComponent() {
  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [oldPrice, setOldPrice] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [percent, setPercent] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [formError, setFormError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const old = Number(oldPrice)
  const now = Number(newPrice)
  const savedPercent = old > 0 && now > 0 && now < old ? Math.round((1 - now / old) * 100) : null

  function handleOldPrice(value: string){
    setOldPrice(value)
    if (percent && Number(value) > 0){
      setNewPrice(precioNuevo(Number(value) * (1 - Number(percent)/100)))
    }
  }

  function handlePercent(value: string){
    if (value === 'none') {
      setPercent('')
      setNewPrice('')
      return
    }

    setPercent(value)
    if(old > 0){
      setNewPrice(precioNuevo(old * (1 - Number(value) / 100)))
    }
  }

  function handleNewPrice(value: string){
    setNewPrice(value)
    setPercent('')
  }

  function resetForm(){
    setName('')
    setBrand('')
    setOldPrice('')
    setNewPrice('')
    setPercent('')
    setDescription('')
    setCategory('')
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

  return(
    <>
    <Header/>
    <section className="relative overflow-hidden bg-primary px-4 py-8 text-primary-foreground">
        <div className="absolute -top-10 -right-10 size-32 rounded-full bg-accent" />
        <div className="relative">
          <h1 className="text-3xl leading-tight font-extrabold">
            Registrar producto
          </h1>
        </div>
      </section>
      <main className="bg-background px-4 py-8">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-lg flex-col gap-5 rounded-3xl border border-border bg-card p-6 text-card-foreground">
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
            <label htmlFor="product-brand" className="text-sm font-semibold">
              Marca <span aria-hidden="true"></span>
            </label>
            <input
              id="product-brand"
              type="text"
              required
              className={inputClass}
              placeholder="Ej. Samsung"
              value={brand}
              onChange={(event) => setBrand(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="product-old-price" className="text-sm font-semibold">
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
              onChange={(event) => handleOldPrice(event.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="product-percent"
                className="text-sm font-semibold">
                Descuento
              </label>
              <Select value={percent} onValueChange={handlePercent}>
                <SelectTrigger id="product-percent" className={triggerClass}>
                  <SelectValue placeholder="Elige un %" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="none">Sin descuento</SelectItem>
                  {DISCOUNTS.map((discount) => (
                    <SelectItem key={discount} value={String(discount)}>
                      {discount}%
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="product-new-price"
                className="text-sm font-semibold">
                Precio nuevo <span aria-hidden="true"></span>
              </label>
              <input
                id="product-new-price"
                type="number"
                required
                min={0}
                step="any"
                className={inputClass}
                placeholder="0.00"
                value={newPrice}
                onChange={(event) => handleNewPrice(event.target.value)}
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
            <Button type="button" variant="outline">
              <ImagePlus />
              Subir imágenes
            </Button>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="product-category" className="text-sm font-semibold">
              Categoría <span aria-hidden="true"></span>
            </label>
            <Select required value={category} onValueChange={setCategory}>
              <SelectTrigger id="product-category" className={triggerClass}>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent position="popper">
                {categoryEntries.map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
