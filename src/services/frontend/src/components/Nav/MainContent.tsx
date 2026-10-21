import { Link } from '@tanstack/react-router'
import { Button } from '../ui/button'

export function MainContentNav() {
  return (
    <div className="flex flex-col gap-2 px-4">
      <Button asChild variant="outline">
        <Link to="/login">Iniciar sesión</Link>
      </Button>
      <Button asChild variant="outline">
        <Link to="/register-consumer"> Crear una cuenta de usuario</Link>
      </Button>
    </div>
  )
}
