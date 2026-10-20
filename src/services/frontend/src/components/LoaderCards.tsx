import { Skeleton } from './ui/skeleton'

function Card() {
  return (
    <div className="flex flex-col h-full aspect-square gap-2">
      <Skeleton className="h-full bg-neutral-500/50" />
      <Skeleton className="w-full h-10 bg-neutral-500/50" />
    </div>
  )
}
export function LoaderCards() {
  return (
    <div className="size-full max-w-full overflow-x-hidden flex gap-x-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i} />
      ))}
    </div>
  )
}
