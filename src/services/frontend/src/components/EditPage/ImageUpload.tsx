import { ImagePlus } from 'lucide-react'
import { Button } from '../ui/button'
import type { ProductPageItem } from 'lib/types'
import { useState } from 'react'
import type { ChangeEvent } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel'
import { getObjectURL } from '#/lib/utils'

type Props = {
  id: string
  initialImages: ProductPageItem['images']
}
async function submitImage(id: string, body: FormData): Promise<null | string> {
  try {
    const res = await fetch(`http://localhost:3000/image/upload/${id}`, {
      credentials: 'include',
      method: 'POST',
      body,
    })
    if (res.status !== 204) return 'Error in request'
    return null
  } catch {
    return 'Error in fetch'
  }
}
export function ImagesUpload({ id, initialImages }: Props) {
  const [images, setImages] = useState(initialImages)
  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    for (const file of files) {
      const url = await getObjectURL(file)
      const adding: ProductPageItem['images'][number] = { alt: 'Empty', url }
      const body = new FormData()
      body.append('file', file)
      submitImage(id, body).then(() => setImages((p) => [...p, adding]))
    }
  }
  return (
    <>
      <Button type="button" variant="outline" asChild>
        <label className="flex gap-x-2" htmlFor="images">
          <ImagePlus />
          <span>Subir imágenes</span>
          <input
            type="file"
            className="hidden"
            id="images"
            multiple
            accept="image/*"
            onChange={handleChange}
          />
        </label>
      </Button>
      {images.length > 0 && (
        <div className="py-2">
          <Carousel>
            <CarouselContent className="px-10">
              {images.map((v) => (
                <CarouselItem key={v.url}>
                  <img
                    src={v.url}
                    alt={v.alt}
                    className="size-full object-cover rounded-sm h-[25vh] aspect-square"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-2" />
            <CarouselNext className="-right-2" />
          </Carousel>
        </div>
      )}
    </>
  )
}
