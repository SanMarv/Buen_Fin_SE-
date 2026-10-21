import { Link, useNavigate } from '@tanstack/react-router'
import { Button } from '../ui/button'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { env } from '#/config/env'
import { toast } from 'sonner'

type Session = { isUser: boolean; isValidated: boolean }

async function getSession(): Promise<Session> {
  const res = await fetch(`${env.VITE_BACK_BASE}/auth/me`, { method: "GET", credentials: 'include' })
  if (!res.ok) return { isUser: false, isValidated: false }
  return res.json()
}

export function useSession() {
  return useQuery({
    queryKey: ['me'],
    queryFn: getSession,
    retry: false,
  })
}

export function MainContentNav() {

  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const handleLogout = async () => {
    try {
      const res = await fetch(`${env.VITE_BACK_BASE}/auth/logout`, { method: "POST", credentials: 'include' })
      if (!res.ok && res.status !== 401 && res.status !== 403){
        toast.error('No se pudo cerrar sesión')
        return
      }

      await queryClient.invalidateQueries({ queryKey: ['me'] })
      toast.success('Sesión cerrada satisfactoriamente', { position: 'bottom-center' })
      navigate({ to: "/" })
    }
    catch (e: unknown) {
      toast.error('Error de conexión')
      console.error(e)
    }
  }

  const { data: session, isPending } = useSession();

  if (isPending) return null

  return (
    <div className="flex flex-col gap-2 px-4">
      {!session?.isUser ? (
        <>
          <Button asChild variant="outline">
            <Link to="/login">Iniciar sesión</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/register-consumer"> Crear una cuenta de usuario</Link>
          </Button>
        </>
      ) : (<>{session.isValidated ? (
        <Button asChild variant="outline">
          <Link to="/register-company"> Crear una compañia</Link>
        </Button>
        ) : (
          <Button asChild variant="outline">
            <Link to="/verification"> Verifica tu cuenta</Link>
          </Button>
        )}
        <Button variant="outline" onClick={handleLogout}> Cerrar sesión </Button>
      </>
      )}
    </div>
  )
}
