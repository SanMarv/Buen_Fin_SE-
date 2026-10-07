import { Link } from '@tanstack/react-router'

const exploreLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/search-business', label: 'Comercios' },
  { to: '/search-products', label: 'Productos' },
] as const

const itemClass = 'border-b border-white/20 pb-2 text-xs break-words'

export function Footer() {
  return (
    <footer className="bg-brand-ink px-4 py-10 text-brand-ink-foreground">
      <p className="text-xl font-black">El Buen Fin</p>
      <p className="mt-2 max-w-xs text-sm opacity-80">
        Sitio oficial de la campaña comercial El Buen Fin 2026. Guarda, organiza
        y aprovecha las mejores ofertas del año.
      </p>

      <div className="mt-8 grid grid-cols-3 gap-3">
        <nav aria-label="Explora">
          <h2 className="text-sm font-bold text-accent">Explora</h2>
          <ul className="mt-3 flex flex-col gap-2">
            {exploreLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`${itemClass} block hover:text-accent`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Legal">
          <h2 className="text-sm font-bold text-accent">Legal</h2>
          <ul className="mt-3 flex flex-col gap-2">
            <li>
              <span className={`${itemClass} block`}>Aviso de privacidad</span>
            </li>
            <li>
              <span className={`${itemClass} block`}>Términos de uso</span>
            </li>
          </ul>
        </nav>

        <nav aria-label="Ayuda">
          <h2 className="text-sm font-bold text-accent">Ayuda</h2>
          <ul className="mt-3 flex flex-col gap-2">
            <li>
              <Link
                to="/faq"
                className={`${itemClass} block hover:text-accent`}
              >
                Preguntas frecuentes
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <hr className="mt-10 border-white/20" />
    </footer>
  )
}