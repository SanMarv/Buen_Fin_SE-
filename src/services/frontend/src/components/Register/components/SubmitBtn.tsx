import { Button } from '#/components/ui/button'
import { cn } from 'cn'
import { useIsUploading } from '../context'
import { Spinner } from '#/components/ui/spinner'

export function SubmitBtn() {
  const [isUploading] = useIsUploading()
  return (
    <Button
      variant="outline"
      className={cn(
        'rounded-2xl w-full py-2',
        isUploading &&
          'opacity-10 bg-neutral-50 hover:bg-neutral-50 hover:dark:bg-input/30',
      )}
      disabled={isUploading}
    >
      {isUploading && <Spinner className="size-4" />}
      {isUploading ? 'Enviando' : 'Enviar'}
    </Button>
  )
}
