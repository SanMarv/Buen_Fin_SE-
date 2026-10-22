import type { SubmitEvent } from 'react'
import { MoreBtn } from '../EditPage/MoreBtn'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import styles from './styles.module.css'
import { Button } from '../ui/button'
import { toast } from 'sonner'
import { createProductSchema } from 'lib/schemas'
import { useNavigate } from '@tanstack/react-router'
import { env } from '#/config/env'
import { ApiError } from '../Errors'

export function CreateProduct() {
  const navigate = useNavigate()
  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.target)
    try {
      const formData = Object.fromEntries(data)
      const sending = createProductSchema.parse({
        ...formData,
        newPrice: Number(formData.newPrice),
        price: Number(formData.price),
      })
      const res = await fetch(`${env.VITE_BACK_BASE}/product`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify(sending),
      })
      if (res.status !== 200) {
        const erro = await res.json()
        throw new ApiError(erro.status, erro.error)
      }
      const resData = await res.json()
      const { id } = resData
      navigate({
        to: '/edit/product/$productId',
        params: {
          productId: id,
        },
      })
    } catch {
      toast.error('Error en el formato de tus datos', {
        position: 'bottom-center',
      })
    }
    console.log(Object.fromEntries(data))
  }
  return (
    <Dialog open>
      <DialogTrigger asChild>
        <MoreBtn />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">Crear Producto</DialogTitle>
        </DialogHeader>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <label htmlFor="nombre" className={styles['lable']}>
            <span>Nombre</span>
            <input id="nombre" className="px-5 py-2 rounded-sm" name="name" />
          </label>
          <label htmlFor="description" className={styles['lable']}>
            <span>Descripcion</span>
            <input
              id="description"
              className="px-5 py-2 rounded-sm"
              name="description"
            />
          </label>
          <label htmlFor="link" className={styles['lable']}>
            <span>Url al producto</span>
            <input id="link" className="px-5 py-2 rounded-sm" name="link" />
          </label>
          <div className="flex justify-between gap-5">
            <label htmlFor="description" className={styles['lable']}>
              <span>Precio</span>
              <input
                id="description"
                className="px-5 py-2 rounded-sm"
                name="price"
                type="number"
              />
            </label>
            <label htmlFor="description" className={styles['lable']}>
              <span>Nuevo Precio</span>
              <input
                id="description"
                type="number"
                className="px-5 py-2 rounded-sm"
                name="newPrice"
              />
            </label>
          </div>
          <Button>Crear</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
