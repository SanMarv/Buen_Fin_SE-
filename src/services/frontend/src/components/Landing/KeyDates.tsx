import { useEffect, useState } from 'react'

const events = [
  {
    date: new Date('2026-09-08T00:00:00-06:00'),
    label: '08 SEP',
    title: 'Inicia el registro',
    description: 'Los comercios pueden registrarse sin costo.',
  },
  {
    date: new Date('2026-11-13T00:00:00-06:00'),
    label: '13 NOV',
    title: 'Comienza El Buen Fin',
    description: 'Inician las promociones oficiales.',
  },
  {
    date: new Date('2026-11-17T00:00:00-06:00'),
    label: '17 NOV',
    title: 'Último día',
    description: 'Cierre de la campaña 2026.',
  },
]

const BUEN_FIN_START = events[1].date.getTime()

function getTimeLeft(now: number) {
  const diff = Math.max(BUEN_FIN_START - now, 0)
  return [
    { label: 'días', value: Math.floor(diff / 86_400_000) },
    { label: 'hrs', value: Math.floor(diff / 3_600_000) % 24 },
    { label: 'min', value: Math.floor(diff / 60_000) % 60 },
    { label: 'seg', value: Math.floor(diff / 1000) % 60 },
  ]
}

function getProgress(now: number) {
  const last = events.length - 1
  if (now <= events[0].date.getTime()) return 0

  for (let i = 0; i < last; i++) {
    const start = events[i].date.getTime()
    const end = events[i + 1].date.getTime()
    if (now < end) return (i + (now - start) / (end - start)) / last
  }
  return 1
}

export function KeyDates() {
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const timeLeft = now === null ? null : getTimeLeft(now)
  const progress = now === null ? 0 : getProgress(now)
  const last = events.length - 1

  return (
    <section className="bg-white px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-wide text-primary uppercase">
            Agenda 2026
          </p>
          <h2 className="text-2xl font-extrabold">Fechas clave</h2>
        </div>

        <div>
          <div className="flex gap-1.5">
            {(timeLeft ?? getTimeLeft(0)).map((unit) => (
              <div
                key={unit.label}
                className="w-13 rounded-md bg-brand-ink py-1 text-center text-brand-ink-foreground"
              >
                <p className="text-base leading-none font-bold tabular-nums">
                  {timeLeft ? String(unit.value).padStart(2, '0') : '--'}
                </p>
                <p className="mt-0.9 text-[10px] opacity-80">{unit.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ol className="mt-8">
        {events.map((event, index) => {
          const fill = Math.min(Math.max(progress * last - index, 0), 1)
          const reached = fill > 0 || (index === 0 && progress > 0)

          return (
            <li key={event.label} className="relative pb-8 pl-8 last:pb-0">
              <span
                className={`absolute top-1 left-0 size-3 rounded-full ${
                  reached ? 'bg-primary' : 'bg-border'
                }`}
              />
              {index < last && (
                <span className="absolute top-2.5 left-[5px] h-full w-0.5 bg-border">
                  <span
                    className="block w-full bg-primary"
                    style={{ height: `${fill * 100}%` }}
                  />
                </span>
              )}

              <p className="text-xs font-bold text-primary">{event.label}</p>
              <h3 className="text-lg font-bold">{event.title}</h3>
              <p className="text-sm text-muted-foreground">
                {event.description}
              </p>
            </li>
          )
        })}
      </ol>
    </section>
  )
}