const allies = [
  { id: 1, name: 'Secretaría de Economía' },
  { id: 2, name: 'SAT' },
  { id: 3, name: 'PROFECO' },
  { id: 4, name: 'CONCANACO SERVYTUR' },
  { id: 5, name: 'Consejo Coordinador Empresarial' },
  { id: 6, name: 'ABM' },
]

export function Allies() {
  return (
    <section className="px-4 py-10">
      <p className="text-xs font-bold tracking-wide text-primary uppercase">
        Grupo de trabajo oficial
      </p>
      <h2 className="mt-1 text-2xl leading-tight font-extrabold">
        Una campaña coordinada para México
      </h2>
      <p className="mt-3 text-sm text-muted-foreground">
        Instituciones públicas y organismos empresariales colaboran para
        ofrecer información confiable y una participación responsable.
      </p>

      <ul className="mt-6 grid grid-cols-3 gap-2">
        {allies.map((ally) => (
            <li
                key={ally.id}
                className="flex aspect-square items-center justify-center rounded-lg border bg-card p-1.5 text-center text-[10px] leading-tight font-medium text-muted-foreground"
            >
                {ally.name}
            </li>
        ))}
        </ul>
    </section>
  )
}