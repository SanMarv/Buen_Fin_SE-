import { useState } from 'react'
import { Error } from './Error'
import { Input } from './Input'
import { EyeClosed, Eye } from 'lucide-react'
import type { LucideProps } from 'lucide-react'

function Icon({ isVisble, ...props }: LucideProps & { isVisble: boolean }) {
  if (isVisble) return <Eye {...props} />
  return <EyeClosed {...props} />
}
export function PasswordInput() {
  const [isVisible, setVisibility] = useState(false)
  return (
    <Error name="password" className="px-2 relative">
      <Input
        placeholder="Contraseña"
        name="password"
        type={!isVisible ? 'password' : 'text'}
        autoComplete="current-password"
      />
      <button
        className="aspect-square [grid-area:label] grid place-content-center order-3 justify-self-end h-3/5 mr-2 rounded-md"
        type="button"
        onClick={() => setVisibility((p) => !p)}
      >
        <Icon isVisble={isVisible} className="size-5" />
      </button>
    </Error>
  )
}
