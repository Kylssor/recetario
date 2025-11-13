import { useSpring, animated } from '@react-spring/web'

/**
 * Componente que renderiza la página "Acerca de Nosotros".
 * Explica el propósito y la misión de la plataforma Recetario Verde.
 */
export default function About() {
  const animation = useSpring({
    from: { opacity: 0, y: 15 },
    to: { opacity: 1, y: 0 },
    config: { tension: 220, friction: 30 },
  })

  return (
    <div className="flex justify-center py-8">
      <animated.div
        style={animation}
        className="w-full max-w-2xl space-y-6 rounded-2xl bg-white p-8 shadow"
      >
        <h1 className="text-3xl font-bold text-emerald-800">
          Acerca de Recetario Verde
        </h1>

        <div>
          <h2 className="mb-2 text-xl font-semibold text-emerald-700">
            Nuestro Objetivo
          </h2>
          <p className="text-slate-700 leading-relaxed">
            Esta plataforma nace para simplificar la búsqueda de recetas
            saludables y económicas. Queremos inspirarte a cocinar con
            ingredientes simples que probablemente ya tienes en casa.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-xl font-semibold text-emerald-700">
            Nuestra Misión
          </h2>
          <p className="text-slate-700 leading-relaxed">
            Creemos que comer sano no tiene por qué ser complicado ni costoso.
            Nuestra misión es proporcionar herramientas que te ayuden a planificar
            tus comidas, alcanzar tus metas nutricionales y descubrir nuevas y
            deliciosas formas de alimentarte bien, sin importar tu presupuesto o
            nivel de experiencia en la cocina.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-xl font-semibold text-emerald-700">
            ¿Cómo Funciona?
          </h2>
          <p className="text-slate-700 leading-relaxed">
            Usa nuestra barra de búsqueda para encontrar recetas por ingrediente,
            añade tus favoritas al planificador diario y lleva un control de tu
            consumo calórico de forma sencilla. ¡Explora, cocina y disfruta!
          </p>
        </div>
      </animated.div>
    </div>
  )
}