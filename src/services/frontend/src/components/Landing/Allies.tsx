const allies = [
  { id: 1, name: "Asociación bancaría de México", logo: "/logo_partners/abm.svg" },
  { id: 2, name: "AMVO", logo: "/logo_partners/amvo.svg"},
  { id: 3, name: "Asociación Nacional de Tiendas Autoservicio y Departamentales", logo: "/logo_partners/antad.svg" },
  { id: 4, name: "Asociación Internet MX", logo: "/logo_partners/asociacionInternetMX.svg" },
  { id: 5, name: "Consejo Coordinador Empresarial", logo: "/logo_partners/cce.svg" },
  { id: 6, name: "Radio y Televisión Mexicanas", logo: "/logo_partners/cirt.svg" },
  { id: 7, name: "Concanaco", logo: "/logo_partners/concanaco.svg" },
  { id: 8, name: "Profeco", logo: "/logo_partners/profeco.svg" },
  { id: 9, name: "SAT", logo: "/logo_partners/sat.svg"},
  { id: 10, name: "Secretaria de Economía", logo:"/logo_partners/se.svg" },
  { id: 11, name: "Secretaria de Hacienda", logo:"/logo_partners/shcp.svg" },
  { id: 12, name: "Secretaria de Turismo", logo:"/logo_partners/st.svg" },
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
            title={ally.name}
            className="flex aspect-square items-center justify-center rounded-lg border bg-card p-3"
          >
            <img
              src={ally.logo}
              alt={ally.name}
              loading="lazy"
              className="max-h-full max-w-full object-contain"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}