import { useEffect, useRef, useState } from 'react'
import Autoplay from 'embla-carousel-autoplay'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '#/components/ui/carousel'



const slides = [
  {
    id: 1,
    src: '/carousel/Aliados_de_difusion_banco.jpeg',
    alt: 'Aliados de difusión: banco',
  },
  {
    id: 2,
    src: '/carousel/Aliados_de_difusion_CFE.jpeg',
    alt: 'Aliados de difusión: CFE',
  },
  {
    id: 3,
    src: '/carousel/Registro_empresas.jpeg',
    alt: 'Registro de empresas',
  },
]

export function ImageCarousel() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const autoplay = useRef(Autoplay({ delay: 4000, stopOnInteraction: false }))


  useEffect(() => {
    if (!api) return

    const onSelect = () => setCurrent(api.selectedScrollSnap())

    onSelect()
    api.on('select', onSelect)
    api.on('reInit', onSelect)

    return () => {
      api.off('select', onSelect)
      api.off('reInit', onSelect)
    }
  }, [api])

  return (
    <section>
      <Carousel
        aria-label="Anuncios de El Buen Fin"
        opts={{ loop: true }}
        plugins={[autoplay.current]}
        setApi={setApi}
      >
        <CarouselContent className="ml-0">
          {slides.map((slide) => (
            <CarouselItem key={slide.id} className="pl-0">
              <img src={slide.src} alt={slide.alt} className="h-auto w-full" />
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Ir a la imagen ${index + 1} de ${slides.length}`}
              aria-current={index === current}
              onClick={() => api?.scrollTo(index)}
              className={`h-2 rounded-full shadow transition-all ${
                index === current ? 'w-6 bg-primary' : 'w-2 bg-white/80'
              }`}
            />
          ))}
        </div>
      </Carousel>
    </section>
  )
}