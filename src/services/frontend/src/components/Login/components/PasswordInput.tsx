import { useState } from 'react'
import { Error } from './Error'
import { Input } from './Input'
import { EyeClosed, Eye } from 'lucide-react'
import type { LucideProps } from 'lucide-react'
import { Button } from '#/components/ui/button'

function Icon({ isVisble, ...props }: LucideProps & { isVisble: boolean }) {
  if (isVisble) return <Eye {...props} />
  return <EyeClosed {...props} />
}
export function PasswordInput() {
  const [isVisible, setVisibility] = useState(false)
  return (
    <Error name="password" className="px-2 mb-4 relative">
      <Input
        placeholder='Contraseña'
        name="password"
        type={!isVisible ? 'password' : 'text'}
        autoComplete="current-password"
      />
      <Button
        variant="ghost"
        size="icon-sm"
        className="[grid-area:label] order-3 justify-self-end mr-2 rounded-full"
        type="button"
        aria-label={isVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        onClick={() => setVisibility((p) => !p)}
      >
        <Icon isVisble={isVisible} className="size-5" />
      </Button>
    </Error>
  )
}
