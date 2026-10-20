import { createFileRoute } from '@tanstack/react-router'
import { Header } from '#/components/Header'
import { Footer } from '#/components/Footer'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "#/components/ui/accordion"

export const Route = createFileRoute('/faq')({
  component: Faq,
})

const accordionItems = [
  {
    value: "item-1",
    trigger: "¿Qué es “El Buen Fin” y para qué sirve?",
    content: "Es una iniciativa del sector público y privado que reúne promociones y descuentos en bienes y servicios durante noviembre. Busca impulsar el comercio formal, reactivar el mercado interno y apoyar la economía de las familias."
  },
  {
    value: "item-2",
    trigger: "¿Quiénes pueden usar la marca y el logotipo oficial?",
    content: "Solo las empresas y negocios inscritos en el portal oficial. El logotipo es una marca registrada de la Secretaría de Economía, por lo que no se debe alterar y su uso debe limitarse a las fechas del evento."
  },
  {
    value: "item-3",
    trigger: "¿Qué beneficios se obtienen al registrar un negocio?",
    content: "Visibilidad ante el público en el directorio oficial, uso respaldado del logotipo e identidad gráfica, acceso a recursos para ventas digitales, afiliarse a programas de PROFECO (como ConciliaExprés) y la oportunidad de participar en el Sorteo El Buen Fin del SAT. las empresas y negocios inscritos en el portal oficial. El logotipo es una marca registrada de la Secretaría de Economía, por lo que no se debe alterar y su uso debe limitarse a las fechas del evento."
  },
  {
    value: "item-4",
    trigger: "¿Cualquier empresa o negocio puede inscribirse?",
    content: "No. Es requisito indispensable ser persona física o moral legalmente constituida y contar con un RFC válido."
  },
   {
    value: "item-5",
    trigger: "¿Cuándo vence el plazo de registro en la plataforma?",
    content: "El registro en el sitio oficial permanece abierto hasta el día anterior a que comience el evento (hasta el 12 de noviembre a las 23:59 h)."
  },
   {
    value: "item-6",
    trigger: "¿El registro al evento incluye automáticamente la inscripción al Sorteo SAT?",
    content: "No de forma automática. Registrarse en la plataforma otorga el derecho a solicitar la inscripción al sorteo, pero el SAT valida de forma independiente que el negocio cumpla con sus bases y requisitos fiscales."
  },
   {
    value: "item-7",
    trigger: "¿Qué requisitos del SAT se deben cumplir para participar en el Sorteo El Buen Fin?",
    content: "Contar con Buzón Tributario activo, Opinión de cumplimiento de obligaciones fiscales positiva y disponer de al menos una Terminal Punto de Venta (TPV) bancaria activa para recibir cobros con tarjeta de crédito o débito."
  },
   {
    value: "item-8",
    trigger: "¿Cuántas sucursales o establecimientos se pueden dar de alta por cuenta?",
    content: "Se registra el RFC principal de la empresa y, bajo ese mismo perfil, se pueden registrar todas las sucursales físicas y/o plataformas digitales vinculadas a dicho RFC."
  }
]

function Faq() {
  return (
     <>
     <Header />
     <main>
     <section className="relative overflow-hidden bg-primary px-4 py-8 text-primary-foreground">
          <div className="absolute -top-10 -right-10 size-32 rounded-full bg-accent" />
          <div className="relative">
            <h1 className="text-3xl leading-tight font-extrabold">
              Preguntas frecuentes
            </h1>
          </div>
        </section>
      <section className = "px-4 py-8">
     <Accordion type="multiple" className="w-full text-foreground">
      {accordionItems.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
         <AccordionTrigger className="text-left text-base font-bold text-foreground">
                  {item.trigger}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {item.content}
                </AccordionContent>
              </AccordionItem>
            ))}

    </Accordion>
     </section>
     </main>
     <Footer />
     </> 
  )
}