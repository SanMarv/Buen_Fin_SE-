import { Link } from '@tanstack/react-router'

// cuando ya tengamos los links se les agrega un `to`
const sections = [
  {
    title: 'Explora', // encabezado de la columna
    items: [
      { to: '/', label: 'Inicio' },
      { to: '/aboutus', label: 'Comercios' },
      { to: '/search-products', label: 'Productos' },
    ],
  },
  {
    title: 'Legal',
    items: [{ label: 'Aviso de privacidad' }, { label: 'Términos de uso' }],
  },
  {
    title: 'Ayuda',
    items: [{ to: '/faq', label: 'Preguntas frecuentes' }],
  },
] as const

const itemClass =
  'block border-b border-border pb-2 text-xs break-words text-muted-foreground'
const linkClass = `${itemClass} transition-colors hover:text-primary`

export function Footer() {
  return (
    <footer className="border-t border-border bg-card px-4 py-10 text-card-foreground">
      <p className="text-xl font-black">El Buen Fin</p>
      <p className="mt-2 max-w-xs text-sm opacity-80">
        Sitio oficial de la campaña comercial El Buen Fin 2026. Guarda, organiza
        y aprovecha las mejores ofertas del año.
      </p>

      <div className="mt-8 grid grid-cols-3 gap-3">
        {sections.map(({ title, items }) => (
          <nav key={title} aria-labelledby={`footer-${title}`}>
            <h2 id={`footer-${title}`} className="text-sm font-bold text-primary">
              {title}
            </h2>
            <ul className="mt-3 flex flex-col gap-2">
              {items.map((item) => (
                <li key={item.label}>
                  {'to' in item ? (
                    <Link to={item.to} className={linkClass}>
                      {item.label}
                    </Link>
                  ) : (
                    <span className={itemClass}>{item.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <hr className="mt-10 border-border" />
    </footer>
  )
}
