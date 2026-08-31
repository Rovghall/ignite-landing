/**
 * One-off batch: EN blog posts → content/es/posts/*.json
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const OUT = path.join(ROOT, 'content', 'es', 'posts')

const COMMON = {
  'Measurement and feedback loop': 'Medición y bucle de feedback',
  'Protein, training, and recovery': 'Proteína, entrenamiento y recuperación',
  'A 7-day execution checklist': 'Lista de ejecución de 7 días',
  'Where IGNITE AI fits': 'Dónde encaja IGNITE AI',
  'Bottom line': 'Conclusión',
  'How to use this list': 'Cómo usar esta lista',
  'Choosing without going crazy': 'Elegir sin volverte loco',
  'Deeper context and edge cases': 'Contexto más profundo y casos límite',
  'What actually drives the burn': 'Qué impulsa realmente el gasto',
  'Order-of-magnitude expectations': 'Expectativas de orden de magnitud',
  'Muscle stimulus vs calorie theater': 'Estímulo muscular frente a teatro calórico',
  'Wearables and machine consoles': 'Wearables y consolas de máquinas',
  'A practical logging approach': 'Un enfoque práctico de registro',
  'Who should care less about the calorie number': 'Quién debería preocuparse menos por el número calórico',
}

const BODY = {
  measurement: [
    'El marcador útil suele ser una tendencia de dos a cuatro semanas: peso corporal medio, cintura o fotos, rendimiento en entrenamiento e ingesta media.',
    'Los picos de un solo día en la báscula por sodio, carbohidratos, entreno duro de tren inferior o retención menstrual son ruido. Actúa sobre pendientes, no sobre puntos.',
  ],
  protein: [
    'Si levantas mientras cambias el peso corporal, mantén la sobrecarga progresiva y un objetivo de proteína que puedas cumplir en días ocupados. Una banda práctica basada en evidencia para muchos lifters en déficit es de unos 1,6 a 2,2 g/kg.',
    'El sueño y los pasos son palancas silenciosas. Un plan de macros perfecto falla cuando el NEAT se hunde y el picoteo nocturno queda sin registrar.',
  ],
  checklist: [
    '1) Registra cada comida, fotografiando platos caóticos. 2) Edita aceites y salsas a propósito. 3) Guarda un básico en Saved. 4) Registra al menos dos entrenos. 5) Pésate la mayoría de mañanas y haz la media. 6) Mantén los pasos más o menos estables. 7) Cambia solo una palanca la semana que viene si hace falta.',
    'Esta lista convierte el consejo en datos. Sin ella, los artículos se quedan en entretenimiento.',
  ],
  ignite: [
    'Puedes hacer esto con cualquier registrador honesto. IGNITE AI está pensado para los puntos de fricción que suelen romper los planes: comidas mixtas, básicos repetidos y contexto de entrenamiento en un solo sitio.',
    'Snap → editar → confirmar para platos nuevos. Saved para repeticiones. Entrenos junto a la comida para que decidas la alimentación a propósito.',
  ],
  igniteCta:
    'Cuando el registro tiene que mantenerse honesto en días ocupados, IGNITE AI ayuda con fotos de comidas, edición de macros, repeticiones en Saved y entrenos en un solo bucle. Snap it. Log it. Crush it.',
  howToUse: [
    'Instala como máximo dos opciones. Registra desayuno con código de barras, comida casera y cena de restaurante en ambas. Quédate con la que sigues abriendo el viernes.',
    'Un cambio de peso saludable necesita balance energético, proteína y entrenamiento. Las apps solo hacen visible la matemática.',
  ],
  choosing: [
    'Si los platos mixtos son tu cuello de botella, prioriza el registro por foto con macros editables y repeticiones en Saved.',
    'Si dominan los alimentos envasados, importan más la base de datos y la calidad del código de barras.',
  ],
  underreport:
    'La subdeclaración sube cuando registrar es molesto. Elige velocidad y honestidad por encima de acumular funciones.',
  testEdit: 'Prueba la velocidad de edición con tus comidas, no con capturas de demo.',
}

const APPS = {
  '1. IGNITE AI': [
    'Registro de comidas por foto con edición de macros, repeticiones en Saved, entrenos y compartir progreso. Mejor cuando los platos mixtos matan la adherencia. Ojo: sigue editando los aceites.',
    BODY.testEdit,
  ],
  '2. MyFitnessPal': [
    'Gran base de datos de alimentos y códigos de barras. Mejor para dietas con productos envasados. Ojo: lento con bowls desordenados.',
    BODY.testEdit,
  ],
  '3. MacroFactor': [
    'Actualizaciones al estilo gasto a partir de tus datos. Mejor para lifters disciplinados. Ojo: cultura de pesarse.',
    BODY.testEdit,
  ],
  '4. Cronometer': [
    'Profundidad en micronutrientes. Mejor para precisión. Ojo: UX más pesada.',
    BODY.testEdit,
  ],
  '5. Lose It!': [
    'Diario clásico de calorías más tranquilo. Mejor para simplicidad. Ojo: no es cámara primero.',
    BODY.testEdit,
  ],
  '6. Cal AI': [
    'Estimaciones con cámara primero. Mejor para snaps rápidos. Ojo: compara necesidades completas.',
    BODY.testEdit,
  ],
  '7. Carb Manager': [
    'Flujos de carbohidratos netos y keto. Mejor para protocolos bajos en carbos. Ojo: no ideal para atletas altos en carbos.',
    BODY.testEdit,
  ],
  '8. MyNetDiary': [
    'Funciones densas de diario. Mejor para usuarios avanzados. Ojo: abruma a principiantes.',
    BODY.testEdit,
  ],
  '9. Lifesum': [
    'Enfoque lifestyle e ideas de comidas. Mejor para principiantes. Ojo: menos cultura macro hardcore.',
    BODY.testEdit,
  ],
  '10. Yazio': [
    'Seguimiento sencillo y amigable en Europa. Mejor para diarios ligeros. Ojo: profundidad fotográfica limitada.',
    BODY.testEdit,
  ],
  '11. FatSecret': [
    'Base de datos comunitaria económica. Mejor para seguimiento amigable y gratuito. Ojo: el acabado varía.',
    BODY.testEdit,
  ],
  '12. Noom': [
    'Currículo de psicología. Mejor para cambio de comportamiento. Ojo: no es un OS de macros para lifting.',
    BODY.testEdit,
  ],
  '13. WeightWatchers': [
    'Puntos y comunidad. Mejor para responsabilidad. Ojo: distinto de macros en gramos.',
    BODY.testEdit,
  ],
  '14. Fooducate': [
    'Calificaciones de alimentos envasados. Mejor para calidad en el super. Ojo: registrador débil para platos mixtos.',
    BODY.testEdit,
  ],
  '15. Carbon': [
    'Macros orientados a coaching. Mejor para objetivos programados. Ojo: no es foto primero.',
    BODY.testEdit,
  ],
  '16. Nutracheck': [
    'Fortaleza en códigos de barras del Reino Unido. Mejor para alimentos envasados británicos. Ojo: menos útil en otros sitios.',
    BODY.testEdit,
  ],
  '17. HealthifyMe': [
    'Mezcla de coaching y seguimiento. Mejor en mercados locales fuertes. Ojo: prueba la velocidad diaria.',
    BODY.testEdit,
  ],
  '18. SnapCalorie-style tools': [
    'Estimadores solo por foto. Mejor para experimentar con cámara. Ojo: la calidad de edición lo es todo.',
    BODY.testEdit,
  ],
  '19. Samsung Health': [
    'Satélite de actividad. Mejor junto a un registro de comida real. Ojo: no es macros principal.',
    BODY.testEdit,
  ],
  '20. Apple Health ecosystem': [
    'Hub de actividad con partners. Mejor como satélite. Ojo: la profundidad de comida varía.',
    BODY.testEdit,
  ],
}

function translateAppSection(section) {
  const h = section.heading
  if (APPS[h]) return { heading: h, body: APPS[h] }
  return section
}

function translateCommonSection(section) {
  const h = section.heading
  if (h === 'Measurement and feedback loop') return { heading: COMMON[h], body: BODY.measurement }
  if (h === 'Protein, training, and recovery') return { heading: COMMON[h], body: BODY.protein }
  if (h === 'A 7-day execution checklist') return { heading: COMMON[h], body: BODY.checklist }
  if (h === 'Where IGNITE AI fits') return { heading: COMMON[h], body: BODY.ignite }
  if (h === 'How to use this list') return { heading: COMMON[h], body: BODY.howToUse }
  if (h === 'Choosing without going crazy') return { heading: COMMON[h], body: BODY.choosing }
  if (h === 'Deeper context and edge cases')
    return {
      heading: COMMON[h],
      body: [
        'Los casos límite incluyen principiantes frente a lifters avanzados, semanas de mucho estrés laboral, viajes y limitaciones médicas. Los principiantes a menudo pueden progresar cerca del mantenimiento. Los avanzados suelen necesitar fases de superávit o déficit más claras.',
        'Si tienes síntomas clínicos, efectos de medicación o antecedentes de trastorno alimentario, busca apoyo profesional. Una app puede mejorar la medición. No sustituye la atención.',
        'Cuando la evidencia es mixta, prefiere la intervención que puedas repetir durante 12 semanas. La adherencia forma parte de la fisiología en humanos en vida libre.',
      ],
    }
  return null
}

const CALORIE_META = {
  'how-many-calories-running-mile': {
    title: '¿Cuántas calorías quema correr una milla?',
    activity: 'correr una milla',
    activityShort: 'correr una milla',
    activityLog: 'correr una milla',
    desc: 'Análisis detallado del gasto calórico al correr una milla: qué mueve la estimación, efectos de peso e intensidad, error de wearables, músculo frente a teatro calórico y cómo registrar el entreno sin comerte de vuelta todo el gasto.',
  },
  'how-many-calories-swimming': {
    title: '¿Cuántas calorías quema nadar?',
    activity: 'nadar',
    activityShort: 'nadar',
    activityLog: 'nadar',
    desc: 'Análisis detallado del gasto calórico al nadar: qué mueve la estimación, efectos de peso e intensidad, error de wearables, músculo frente a teatro calórico y cómo registrar el entreno sin comerte de vuelta todo el gasto.',
  },
  'how-many-calories-jumping-jacks': {
    title: '¿Cuántas calorías queman los jumping jacks?',
    activity: 'jumping jacks',
    activityShort: 'jumping jacks',
    activityLog: 'jumping jacks',
    desc: 'Análisis detallado del gasto calórico con jumping jacks: qué mueve la estimación, efectos de peso e intensidad, error de wearables, músculo frente a teatro calórico y cómo registrar el entreno sin comerte de vuelta todo el gasto.',
  },
  'how-many-calories-push-ups': {
    title: '¿Cuántas calorías queman las flexiones?',
    activity: 'flexiones',
    activityShort: 'flexiones',
    activityLog: 'flexiones',
    desc: 'Análisis detallado del gasto calórico con flexiones: qué mueve la estimación, efectos de peso e intensidad, error de wearables, músculo frente a teatro calórico y cómo registrar el entreno sin comerte de vuelta todo el gasto.',
  },
  'how-many-calories-sit-ups': {
    title: '¿Cuántas calorías queman los abdominales?',
    activity: 'abdominales',
    activityShort: 'abdominales',
    activityLog: 'abdominales',
    desc: 'Análisis detallado del gasto calórico con abdominales: qué mueve la estimación, efectos de peso e intensidad, error de wearables, músculo frente a teatro calórico y cómo registrar el entreno sin comerte de vuelta todo el gasto.',
  },
  'how-many-calories-squats': {
    title: '¿Cuántas calorías queman las sentadillas?',
    activity: 'sentadillas',
    activityShort: 'sentadillas',
    activityLog: 'sentadillas',
    desc: 'Análisis detallado del gasto calórico con sentadillas: qué mueve la estimación, efectos de peso e intensidad, error de wearables, músculo frente a teatro calórico y cómo registrar el entreno sin comerte de vuelta todo el gasto.',
  },
  'how-many-calories-weight-lifting': {
    title: '¿Cuántas calorías quema levantar pesas?',
    activity: 'levantar pesas',
    activityShort: 'levantar pesas',
    activityLog: 'levantar pesas',
    desc: 'Análisis detallado del gasto calórico al levantar pesas: qué mueve la estimación, efectos de peso e intensidad, error de wearables, músculo frente a teatro calórico y cómo registrar el entreno sin comerte de vuelta todo el gasto.',
  },
  'how-many-calories-pilates': {
    title: '¿Cuántas calorías quema el pilates?',
    activity: 'pilates',
    activityShort: 'pilates',
    activityLog: 'pilates',
    desc: 'Análisis detallado del gasto calórico con pilates: qué mueve la estimación, efectos de peso e intensidad, error de wearables, músculo frente a teatro calórico y cómo registrar el entreno sin comerte de vuelta todo el gasto.',
  },
  'how-many-calories-skiing': {
    title: '¿Cuántas calorías quema esquiar?',
    activity: 'esquiar',
    activityShort: 'esquiar',
    activityLog: 'esquiar',
    desc: 'Análisis detallado del gasto calórico al esquiar: qué mueve la estimación, efectos de peso e intensidad, error de wearables, músculo frente a teatro calórico y cómo registrar el entreno sin comerte de vuelta todo el gasto.',
  },
}

function translateCaloriePost(en) {
  const m = CALORIE_META[en.slug]
  if (!m) throw new Error('missing calorie meta ' + en.slug)
  const a = m.activity
  const al = m.activityLog
  return {
    slug: en.slug,
    title: m.title,
    date: en.date,
    description: m.desc,
    sections: [
      {
        body: [
          `La gente pregunta por las calorías de ${a} porque quiere que la sesión justifique la cena. El gasto de sesión es real, pero suele ser menor y más ruidoso de lo que sugieren los mitos del afterburn.`,
          `El peso corporal, la intensidad, los descansos y el tiempo total de trabajo dominan la estimación para ${a}. Dos personas haciendo el mismo entreno con nombre pueden quedar muy separadas.`,
          'La pérdida de grasa sigue el balance energético semanal. Usa el entreno para estímulo y salud primero, y trata los printouts calóricos con conservadurismo en un corte.',
        ],
      },
      {
        heading: COMMON['What actually drives the burn'],
        body: [
          `Para ${a}, la intensidad y el trabajo continuo importan más que el apodo del ejercicio. Esfuerzos duros con descansos largos no tienen el mismo coste energético que acondicionamiento continuo.`,
          'Los cuerpos más pesados suelen gastar más energía haciendo el mismo patrón de movimiento a la misma velocidad o carga.',
        ],
      },
      {
        heading: COMMON['Order-of-magnitude expectations'],
        body: [
          `Los dispositivos de consumo a menudo asignan números ordenados a ${a}. Trátalos como un rango con barras de error amplias, sobre todo en esfuerzos intermitentes.`,
          'Si una serie corta y fácil de algún modo imprime un total calórico enorme, asume optimismo y planifica la comida como si el gasto fuera menor.',
        ],
      },
      {
        heading: COMMON['Muscle stimulus vs calorie theater'],
        body: [
          `El valor de entrenamiento de ${a} puede importar más que la insignia de kcal de la sesión. Preservar o construir músculo apoya las necesidades energéticas a largo plazo y cómo te ves a un peso dado.`,
          'Mantén la proteína alrededor de 1,6 a 2,2 g/kg si estás en dieta y levantando.',
        ],
      },
      {
        heading: COMMON['Wearables and machine consoles'],
        body: [
          'Las estimaciones de muñeca luchan con carga, descanso y movimientos que no son pasos. Las pantallas de máquinas del gym son cómodas y a menudo infladas.',
          'En una fase de pérdida de grasa, no te comas automáticamente el número completo impreso.',
        ],
      },
      {
        heading: COMMON['A practical logging approach'],
        body: [
          `Registra sesiones de ${al} por consistencia y sobrecarga progresiva. Registra la comida por separado con fotos cuando las comidas son caóticas.`,
          'IGNITE AI mantiene entrenos y fotos de comidas en una sola línea temporal para que el entreno no se convierta en excusa para dejar de registrar la cena.',
        ],
      },
      {
        heading: COMMON['Who should care less about the calorie number'],
        body: [
          'Si tu objetivo es fuerza, habilidad o calidad física, el entrenamiento progresivo y la proteína ganan a perseguir un objetivo de gasto por sesión.',
          'Si tu objetivo es gasto puro, caminar y otras modalidades continuas suelen ser más fáciles de dosificar que series cortas intermitentes.',
        ],
      },
      { heading: COMMON['Measurement and feedback loop'], body: BODY.measurement },
      { heading: COMMON['Protein, training, and recovery'], body: BODY.protein },
      { heading: COMMON['A 7-day execution checklist'], body: BODY.checklist },
      { heading: COMMON['Where IGNITE AI fits'], body: BODY.ignite },
      {
        heading: COMMON['Bottom line'],
        body: [
          `Usa ${a} por valor de entrenamiento, interpreta el gasto con conservadurismo, cumple proteína y mantén el registro de comida honesto.`,
          BODY.igniteCta,
        ],
      },
    ],
  }
}

const LIST_META = {
  'best-protein-tracker-apps': {
    title: '14 mejores apps para registrar proteína',
    count: '14 mejores apps para registrar proteína',
    desc: 'Resumen detallado de las 14 mejores apps para registrar proteína: en qué destaca cada opción, a quién encaja y cómo elegir sin instalar diez apps.',
    bottom: 'Elige dos, prueba tres días, quédate con una. Luego ejecuta proteína, calorías y entrenamiento durante semanas.',
  },
  'best-carb-counting-apps': {
    title: '23 mejores apps para contar carbohidratos',
    count: '23 mejores apps para contar carbohidratos',
    desc: 'Resumen detallado de las 23 mejores apps para contar carbohidratos: en qué destaca cada opción, a quién encaja y cómo elegir sin instalar diez apps.',
    bottom: 'Elige dos, prueba tres días, quédate con una. Luego ejecuta proteína, calorías y entrenamiento durante semanas.',
  },
  'best-apps-to-track-macros': {
    title: '16 mejores apps para registrar macros',
    count: '16 mejores apps para registrar macros',
    desc: 'Resumen detallado de las 16 mejores apps para registrar macros: en qué destaca cada opción, a quién encaja y cómo elegir sin instalar diez apps.',
    bottom: 'Elige dos, prueba tres días, quédate con una. Luego ejecuta proteína, calorías y entrenamiento durante semanas.',
  },
  'best-free-macro-tracking-apps': {
    title: '15 mejores apps gratuitas para registrar macros',
    count: '15 mejores apps gratuitas para registrar macros',
    desc: 'Resumen detallado de las 15 mejores apps gratuitas para registrar macros: en qué destaca cada opción, a quién encaja y cómo elegir sin instalar diez apps.',
    bottom: 'Elige dos, prueba tres días, quédate con una. Luego ejecuta proteína, calorías y entrenamiento durante semanas.',
  },
  'best-free-calorie-macro-trackers': {
    title: '14 mejores registradores gratuitos de calorías y macros',
    count: '14 mejores registradores gratuitos de calorías y macros',
    desc: 'Resumen detallado de los 14 mejores registradores gratuitos de calorías y macros: en qué destaca cada opción, a quién encaja y cómo elegir sin instalar diez apps.',
    bottom: 'Elige dos, prueba tres días, quédate con una. Luego ejecuta proteína, calorías y entrenamiento durante semanas.',
  },
  'best-food-journal-apps': {
    title: '21 mejores apps de diario alimentario',
    count: '21 mejores apps de diario alimentario',
    desc: 'Resumen detallado de las 21 mejores apps de diario alimentario: en qué destaca cada opción, a quién encaja y cómo elegir sin instalar diez apps.',
    bottom: 'Elige dos, prueba tres días, quédate con una. Luego ejecuta proteína, calorías y entrenamiento durante semanas.',
  },
  'best-fitness-nutrition-apps': {
    title: '22 mejores apps de nutrición fitness',
    count: '22 mejores apps de nutrición fitness',
    desc: 'Resumen detallado de las 22 mejores apps de nutrición fitness: en qué destaca cada opción, a quién encaja y cómo elegir sin instalar diez apps.',
    bottom: 'Elige dos, prueba tres días, quédate con una. Luego ejecuta proteína, calorías y entrenamiento durante semanas.',
  },
  'best-diabetes-weight-loss-apps': {
    title: '19 mejores apps de pérdida de peso para diabetes',
    count: '19 mejores apps de pérdida de peso para diabetes',
    desc: 'Resumen detallado de las 19 mejores apps de pérdida de peso para diabetes: en qué destaca cada opción, a quién encaja y cómo elegir sin instalar diez apps.',
    bottom: 'Elige dos, prueba tres días, quédate con una. Luego ejecuta proteína, calorías y entrenamiento durante semanas.',
  },
  'best-weight-gain-apps': {
    title: '17 mejores apps para ganar peso',
    count: '17 mejores apps para ganar peso',
    desc: 'Resumen detallado de las 17 mejores apps para ganar peso: en qué destaca cada opción, a quién encaja y cómo elegir sin instalar diez apps.',
    bottom: 'Elige dos, prueba tres días, quédate con una. Luego ejecuta proteína, calorías y entrenamiento durante semanas.',
  },
  'best-apps-gain-weight-2026': {
    title: '26 mejores apps para ganar peso en 2026',
    count: '26 mejores apps para ganar peso en 2026',
    desc: 'Resumen detallado de las 26 mejores apps para ganar peso en 2026: en qué destaca cada opción, a quién encaja y cómo elegir sin instalar diez apps.',
    bottom: 'Elige dos, prueba tres días, quédate con una. Luego ejecuta superávit, proteína y entrenamiento durante semanas.',
  },
  'best-noom-alternatives': {
    title: '22 mejores alternativas a Noom',
    count: '22 mejores alternativas a Noom',
    desc: 'Resumen detallado de las 22 mejores alternativas a Noom: en qué destaca cada opción, a quién encaja y cómo elegir sin instalar diez apps.',
    bottom: 'Elige dos, prueba tres días, quédate con una. Luego ejecuta el plan que realmente vas a abrir cada día.',
  },
  'best-weight-watchers-alternatives': {
    title: '19 mejores alternativas a WeightWatchers',
    count: '19 mejores alternativas a WeightWatchers',
    desc: 'Resumen detallado de las 19 mejores alternativas a WeightWatchers: en qué destaca cada opción, a quién encaja y cómo elegir sin instalar diez apps.',
    bottom: 'Elige dos, prueba tres días, quédate con una. Luego ejecuta el plan que realmente vas a abrir cada día.',
  },
  'apps-like-weight-watchers': {
    title: '18 apps similares a WeightWatchers',
    count: '18 apps similares a WeightWatchers',
    desc: 'Resumen detallado de 18 apps similares a WeightWatchers: en qué destaca cada opción, a quién encaja y cómo elegir sin instalar diez apps.',
    bottom: 'Elige dos, prueba tres días, quédate con una. Luego ejecuta el plan que realmente vas a abrir cada día.',
  },
  'fitness-apps-like-myfitnesspal': {
    title: '20 apps fitness similares a MyFitnessPal',
    count: '20 apps fitness similares a MyFitnessPal',
    desc: 'Resumen detallado de 20 apps fitness similares a MyFitnessPal: en qué destaca cada opción, a quién encaja y cómo elegir sin instalar diez apps.',
    bottom: 'Elige dos, prueba tres días, quédate con una. Luego ejecuta el plan que realmente vas a abrir cada día.',
  },
}

function translateListPost(en) {
  const m = LIST_META[en.slug]
  if (!m) throw new Error('missing list meta ' + en.slug)
  const sections = en.sections.map((s) => {
    if (!s.heading) {
      return {
        body: [
          `${m.count} solo ayuda si las opciones encajan con cómo comes y entrenas. Esta lista explica el trabajo de cada opción, no solo el logo.`,
          BODY.underreport,
        ],
      }
    }
    const common = translateCommonSection(s)
    if (common) {
      if (s.heading === 'Bottom line') {
        return { heading: common.heading, body: [m.bottom, BODY.igniteCta] }
      }
      return common
    }
    return translateAppSection(s)
  })
  return { slug: en.slug, title: m.title, date: en.date, description: m.desc, sections }
}

const CARDIO = {
  slug: 'cardio-vs-steps-fat-loss',
  title: 'Cardio frente a pasos para perder grasa: ¿qué deberías priorizar?',
  date: '2026-02-05',
  description:
    'Guía detallada y basada en evidencia sobre cardio frente a pasos para perder grasa: protocolos prácticos, errores comunes, métodos de medición y un sistema de registro que puedes mantener en semanas ocupadas.',
  sections: [
    {
      body: [
        'Los pasos son NEAT de bajo estrés. El cardio sube el gasto más rápido con más coste de recuperación.',
        'Muchos cortes prefieren un suelo de pasos más lifting, añadiendo cardio según haga falta.',
      ],
    },
    { heading: COMMON['Measurement and feedback loop'], body: BODY.measurement },
    { heading: COMMON['Protein, training, and recovery'], body: BODY.protein },
    { heading: COMMON['A 7-day execution checklist'], body: BODY.checklist },
    { heading: COMMON['Where IGNITE AI fits'], body: BODY.ignite },
    { heading: COMMON['Deeper context and edge cases'], body: translateCommonSection({ heading: 'Deeper context and edge cases' }).body },
    {
      heading: COMMON['Bottom line'],
      body: [
        'Ejecuta con medias semanales y registro honesto.',
        BODY.igniteCta,
      ],
    },
  ],
}

const SPECIAL_APPS = {
  'best-noom-alternatives': {
    '14. WW (WeightWatchers)': [
      'Puntos y comunidad. Mejor si te gustó el marco de WW. Ojo: distinto de macros en gramos.',
      BODY.testEdit,
    ],
  },
  'best-weight-watchers-alternatives': {
    '1. IGNITE AI': APPS['1. IGNITE AI'],
    '14. Noom': APPS['12. Noom'],
  },
  'apps-like-weight-watchers': {
    '1. WeightWatchers': APPS['13. WeightWatchers'],
    '2. Noom': APPS['12. Noom'],
  },
  'fitness-apps-like-myfitnesspal': {
    '1. MyFitnessPal': APPS['2. MyFitnessPal'],
  },
  'best-weight-gain-apps': {
    '1. IGNITE AI': [
      'Registro por foto con edición de macros, Saved, entrenos y Share Cards. Mejor cuando subir peso requiere registrar de verdad cada día. Ojo: sigue editando aceites en comidas densas.',
      BODY.testEdit,
    ],
  },
  'best-apps-gain-weight-2026': {
    '1. IGNITE AI': [
      'Registro por foto con edición de macros, Saved, entrenos y Share Cards. Mejor cuando un superávit limpio necesita datos honestos. Ojo: edita aceites en platos calóricos.',
      BODY.testEdit,
    ],
  },
  'best-diabetes-weight-loss-apps': {
    '1. IGNITE AI': [
      'Registro por foto con macros editables y entrenos. Mejor cuando necesitas ver patrones de comida con contexto. Ojo: no sustituye consejo médico.',
      BODY.testEdit,
    ],
    '12. MyNetDiary': [
      'Funciones densas incluyendo glucosa en algunos planes. Mejor para usuarios avanzados. Ojo: abruma a principiantes.',
      BODY.testEdit,
    ],
  },
}

function applySpecialApps(slug, sections) {
  const spec = SPECIAL_APPS[slug]
  if (!spec) return sections
  return sections.map((s) => {
    if (s.heading && spec[s.heading]) return { heading: s.heading, body: spec[s.heading] }
    return s
  })
}

const SLUGS = [
  'cardio-vs-steps-fat-loss',
  'how-many-calories-running-mile',
  'how-many-calories-swimming',
  'how-many-calories-jumping-jacks',
  'how-many-calories-push-ups',
  'how-many-calories-sit-ups',
  'how-many-calories-squats',
  'how-many-calories-weight-lifting',
  'how-many-calories-pilates',
  'how-many-calories-skiing',
  'best-protein-tracker-apps',
  'best-carb-counting-apps',
  'best-apps-to-track-macros',
  'best-free-macro-tracking-apps',
  'best-free-calorie-macro-trackers',
  'best-food-journal-apps',
  'best-fitness-nutrition-apps',
  'best-diabetes-weight-loss-apps',
  'best-weight-gain-apps',
  'best-apps-gain-weight-2026',
  'best-noom-alternatives',
  'best-weight-watchers-alternatives',
  'apps-like-weight-watchers',
  'fitness-apps-like-myfitnesspal',
]

fs.mkdirSync(OUT, { recursive: true })

const succeeded = []
const skipped = []
const failed = []

for (const slug of SLUGS) {
  const dest = path.join(OUT, `${slug}.json`)
  if (fs.existsSync(dest)) {
    try {
      JSON.parse(fs.readFileSync(dest, 'utf8'))
      skipped.push(slug)
      continue
    } catch {
      /* rewrite invalid */
    }
  }
  const src = path.join(ROOT, 'content', '_tmp_en_' + slug + '.json')
  if (!fs.existsSync(src)) {
    failed.push(slug)
    continue
  }
  const en = JSON.parse(fs.readFileSync(src, 'utf8'))
  let es
  try {
    if (slug === 'cardio-vs-steps-fat-loss') es = CARDIO
    else if (CALORIE_META[slug]) es = translateCaloriePost(en)
    else if (LIST_META[slug]) {
      es = translateListPost(en)
      es.sections = applySpecialApps(slug, es.sections)
    } else throw new Error('no translator')
    fs.writeFileSync(dest, JSON.stringify(es, null, 2) + '\n')
    succeeded.push(slug)
  } catch (e) {
    console.error(slug, e.message)
    failed.push(slug)
  }
}

console.log('SUCCEEDED:', succeeded.length, succeeded.join(', '))
console.log('SKIPPED:', skipped.length, skipped.join(', ') || '(none)')
console.log('FAILED:', failed.length, failed.join(', ') || '(none)')
