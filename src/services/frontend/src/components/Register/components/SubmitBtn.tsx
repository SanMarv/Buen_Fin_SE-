import { Button } from '#/components/ui/button'
import { useIsUploading } from '../context'
import { Spinner } from '#/components/ui/spinner'

export function SubmitBtn() {
  const [isUploading] = useIsUploading()
  return (
    <Button
      variant="default"
      className="w-full py-2"
      disabled={isUploading}
    >
      {isUploading && <Spinner className="size-4" />}
      {isUploading ? 'Enviando' : 'Enviar'}
    </Button>
  )
}
