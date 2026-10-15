import {useRef, type ReactNode} from 'react'
import {Link} from '@tanstack/react-router'
import {ChevronLeft, ChevronRight, Plus} from 'lucide-react'

type Props = {
    title: string
    addLabel: string
    children: ReactNode
}

export function HorizontalScroll ({title, addLabel, children}:Props)
{   const scroller = useRef<HTMLDivElement> (null)

    function scrollBy (direction:1|-1){
        const el =scroller.current
        if (!el) return
        el.scrollBy({left:direction*el.clientWidth+0.8, behavior:'smooth'})
    }
    return (
        <div>
            <div className = "flex items-center justify-between gap-2">
                <h2 className = "text-xl font-extrabold">{title}</h2>
                <div className = "flex items-center gap-1.5">
                    <button type ="button" aria-label="Anterior" onClick= {()=>scrollBy(-1)} 
                        className ="flex size-8 items-center justify-center rouded-full border bg-white hover:bg-primary hover:text-primary-foreground">
                            <ChevronRight className ="size-4"/>
                    </button> 
                    <Link
                        to ="/register-products-locations-jobs"
                        aria-label = {addLabel}
                        className = "flex size-8 items-center justify-center round-full bg-primary text-primary-foregrounf hover: bg-primary/90">
                                <Plus className = "size-5"/>
                    </Link> 
                </div>
            </div>
            <div 
                ref={scroller}
                className ="mt-4 flex snap-x  snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {children}
                </div>
        </div>
    )
}