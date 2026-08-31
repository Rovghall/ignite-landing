/**
 * Write European Portuguese translations for blog posts index 60–79
 * (the missing slice within en blog.json indices 40–89).
 */
import fs from 'node:fs'
import path from 'node:path'

const DIR = path.join(process.cwd(), 'content', 'pt', 'posts')
fs.mkdirSync(DIR, { recursive: true })

const SHARED = {
  measurement: {
    heading: 'Medição e ciclo de feedback',
    body: [
      'O placar útil é normalmente uma tendência de duas a quatro semanas: peso corporal médio, cintura ou fotos, desempenho no treino e ingestão média.',
      'Picos de um dia na balança por sódio, hidratos de carbono, treino duro de pernas ou líquido menstrual são ruído. Aja sobre as tendências, não sobre pontos isolados.',
    ],
  },
  protein: {
    heading: 'Proteína, treino e recuperação',
    body: [
      'Se treina com pesos enquanto muda o peso corporal, mantenha sobrecarga progressiva e um objetivo de proteína que consiga atingir em dias ocupados. Uma faixa prática baseada em evidência para muitos praticantes em défice é cerca de 1,6 a 2,2 g/kg.',
      'O sono e os passos são alavancas silenciosas. Um plano de macros perfeito falha quando o NEAT colapsa e os snacks noturnos ficam por registar.',
    ],
  },
  checklist: {
    heading: 'Lista de execução de 7 dias',
    body: [
      '1) Registe todas as refeições, fotografando pratos caóticos. 2) Edite óleos e molhos de propósito. 3) Guarde um básico em Saved. 4) Registe pelo menos dois treinos. 5) Pese-se na maioria das manhãs e faça a média. 6) Mantenha os passos mais ou menos estáveis. 7) Mude só uma alavanca na semana seguinte se for preciso.',
      'Esta lista transforma conselhos em dados. Sem ela, os artigos ficam só entretenimento.',
    ],
  },
  ignite: {
    heading: 'Onde o IGNITE AI se encaixa',
    body: [
      'Pode fazer isto com qualquer registador honesto. O IGNITE AI foi feito para os pontos de atrito que normalmente partem planos: refeições mistas, básicos repetidos e contexto de treino num só sítio.',
      'Snap → editar → confirmar para pratos novos. Saved para repetições. Treinos ao lado da comida para decidir o fueling de propósito.',
    ],
  },
  deeper: {
    heading: 'Contexto mais profundo e casos especiais',
    body: [
      'Casos especiais incluem principiantes vs praticantes avançados, semanas de trabalho com muito stress, viagens e restrições médicas. Principiantes podem muitas vezes progredir perto da manutenção. Praticantes avançados precisam normalmente de fases mais claras de excedente ou défice.',
      'Se tem sintomas clínicos, efeitos de medicação ou historial de alimentação desordenada, procure apoio profissional. Uma app pode melhorar a medição. Não substitui cuidados de saúde.',
      'Quando a evidência é mista, prefira a intervenção que consegue repetir durante 12 semanas. A adesão faz parte da fisiologia em humanos no dia a dia.',
    ],
  },
  bottomExecute: {
    heading: 'Conclusão',
    body: [
      'Execute com médias semanais e registo honesto.',
      'Quando o registo tem de continuar honesto em dias ocupados, o IGNITE AI ajuda com fotos de refeições, edições de macros, repetições Saved e treinos num só ciclo. Snap it. Log it. Crush it.',
    ],
  },
  bottomBakeoff: {
    heading: 'Conclusão',
    body: [
      'Faça um teste de três dias com refeições reais. Fique com o registador honesto menos irritante. Orgulho de marca não queima gordura.',
      'Quando o registo tem de continuar honesto em dias ocupados, o IGNITE AI ajuda com fotos de refeições, edições de macros, repetições Saved e treinos num só ciclo. Snap it. Log it. Crush it.',
    ],
  },
}

function withShared(sections, { deeper = true, bottom = 'execute' } = {}) {
  const out = [
    ...sections,
    SHARED.measurement,
    SHARED.protein,
    SHARED.checklist,
    SHARED.ignite,
  ]
  if (deeper) out.push(SHARED.deeper)
  out.push(bottom === 'bakeoff' ? SHARED.bottomBakeoff : SHARED.bottomExecute)
  return out
}

function comparison(a, b, { slug, title, date, descriptionExtra }) {
  const desc =
    descriptionExtra ||
    `Uma comparação aprofundada de ${a} vs ${b} para registo no mundo real, adesão, bases de dados vs estrutura, e quem deve escolher cada ferramenta.`
  return {
    slug,
    title,
    date,
    description: desc,
    sections: withShared(
      [
        {
          body: [
            `Escolher entre ${a} e ${b} tem menos a ver com lealdade à marca e mais com atrito. O melhor rastreador é aquele que ainda preenche numa quinta-feira cansada.`,
            'Os diários autorreportados subdeclaram quando o registo é aborrecido. Essa realidade moldada pela investigação deve estar acima das listas de funcionalidades.',
            `Abaixo está uma análise prática de ${a} versus ${b}, e depois quando uma app com foto em primeiro lugar como o IGNITE AI é a melhor terceira opção.`,
          ],
        },
        {
          heading: `O que o ${a} tende a otimizar`,
          body: [
            `O ${a} costuma vencer para pessoas cujo fluxo corresponde à sua metáfora central, seja bases de dados, pontos, lições de coaching ou objetivos guiados por algoritmo.`,
            'Pergunte se o caminho feliz corresponde às suas refeições reais: alimentos embalados, matemática keto, currículo de psicologia ou disciplina de pesar tudo.',
          ],
        },
        {
          heading: `O que o ${b} tende a otimizar`,
          body: [
            `O ${b} vence quando a sua metáfora corresponde melhor aos seus hábitos. Uma UI mais calma, uma base de dados maior, micros mais rigorosos ou um enquadramento de coaching diferente podem importar mais do que um adjetivo de marketing.`,
            'Teste ambos no pequeno-almoço com código de barras, almoço caseiro e jantar de restaurante antes de pagar anualmente.',
          ],
        },
        {
          heading: 'Velocidade de registo em pratos mistos',
          body: [
            'Ferramentas centradas em bases de dados são excelentes para rótulos e fracas para taças sem etiqueta, a menos que invista em alimentos personalizados.',
            'Se a maior parte das calorias vem da cozinha e de restaurantes, a velocidade da câmara mais macros editáveis muitas vezes bate as barras de pesquisa.',
          ],
        },
        {
          heading: 'Adesão e subdeclaração',
          body: [
            'O conjunto de funcionalidades com ar científico falha se os óleos do fim de semana nunca entram no registo. Velocidade e editabilidade são funcionalidades de precisão.',
            'Mantenha objetivos de proteína realistas se treina com pesos, muitas vezes cerca de 1,6 a 2,2 g/kg num cutting, independentemente da marca que escolher.',
          ],
        },
        {
          heading: 'Treinos e contexto de progresso',
          body: [
            'Algumas apps são só comida. Outras incluem atividade. Poucas combinam macros por foto, registos de treino e progresso social de forma limpa.',
            'Se a responsabilização importa, partilhar o progresso com amigos pode bater outro contador de streak privado.',
          ],
        },
        {
          heading: 'Quadro de decisão',
          body: [
            `Escolha o ${a} se a metáfora central corresponder ao seu atrito diário. Escolha o ${b} se for o contrário.`,
            'Escolha o IGNITE AI se precisa de snap → editar → Saved mais treinos num só ciclo mais do que do fluxo legado de qualquer uma das marcas.',
          ],
        },
      ],
      { deeper: false, bottom: 'bakeoff' },
    ),
  }
}

const posts = [
  {
    slug: 'track-alcohol-macros',
    title: 'Como registar as macros do álcool',
    date: '2026-04-07',
    description:
      'Registe a energia do álcool com cerca de 7 kcal/g, misturas, efeitos no sono e orçamento semanal.',
    sections: withShared([
      {
        body: [
          'O álcool tem cerca de 7 kcal por grama e não é uma macro clássica como a proteína.',
          'As misturas contam. O sono e a adesão no dia seguinte costumam ser o maior impacto.',
        ],
      },
      {
        heading: 'Registe',
        body: ['Introduza as calorias da bebida como comida. Orçamente nas médias semanais.'],
      },
      {
        heading: 'Dias de treino',
        body: ['Sessões duras e consumo pesado de álcool combinam mal.'],
      },
    ]),
  },
  {
    slug: 'protein-carnivore-diet',
    title: 'Quanta proteína numa dieta carnívora?',
    date: '2026-04-06',
    description:
      'Proteína em dietas ao estilo carnívoro para quem treina com pesos, densidade energética de cortes gordos e honestidade no registo.',
    sections: withShared([
      {
        body: [
          'Padrões carnívoros são altos em proteína e gordura por desenho.',
          'Quem treina com pesos continua a beneficiar de objetivos intencionais de proteína em faixas elevadas.',
        ],
      },
      {
        heading: 'Armadilhas de energia',
        body: ['Cortes gordos escondem calorias. Registe com honestidade.'],
      },
      {
        heading: 'Sustentabilidade',
        body: [
          'Questões médicas e de variedade alimentar precisam de juízo individual e input profissional quando for relevante.',
        ],
      },
    ]),
  },
  {
    slug: 'track-macros-on-keto',
    title: 'Como registar macros em keto',
    date: '2026-04-05',
    description:
      'Registe macros keto com hidratos líquidos vs totais, proteína para músculo e vigilância com óleos.',
    sections: withShared([
      {
        body: [
          'O keto prioriza hidratos muito baixos, proteína moderada e gordura mais alta.',
          'Escolha hidratos líquidos ou totais e mantenha-se consistente.',
        ],
      },
      {
        heading: 'Proteína',
        body: ['Continua a importar para o músculo; não a deixe colapsar.'],
      },
      {
        heading: 'Óleos',
        body: [
          'Registe obsessivamente; edições por foto ajudam em pratos mistos que quebram a cetose em silêncio.',
        ],
      },
    ]),
  },
  {
    slug: 'counting-macros-vs-calories',
    title: 'Contar macros vs calorias: o que deve registar?',
    date: '2026-04-04',
    description:
      'Um guia detalhado e baseado em ciência sobre Contar macros vs calorias: o que deve registar: protocolos práticos, erros comuns, métodos de medição e um sistema de registo que consegue manter em semanas ocupadas.',
    sections: withShared([
      {
        body: [
          'As calorias impulsionam a mudança de gordura. As macros moldam a fome, o músculo e o desempenho.',
          'Principiantes podem começar com calorias mais proteína.',
        ],
      },
      {
        heading: 'Adicione macros completas',
        body: ['Quando o treino exige controlo mais apertado de hidratos e gordura.'],
      },
      {
        heading: 'Ferramentas',
        body: ['Registo rápido bate folhas de cálculo perfeitas abandonadas.'],
      },
    ]),
  },
  {
    slug: 'does-collagen-count-as-protein',
    title: 'O colagénio conta para as macros de proteína?',
    date: '2026-04-03',
    description:
      'O colagénio conta como gramas de proteína, mas é incompleto para MPS em comparação com proteínas completas.',
    sections: withShared([
      {
        body: [
          'O colagénio é proteína, mas é baixo em aminoácidos-chave para a síntese proteica muscular face a whey, carne, ovos ou soja.',
          'Registe as gramas se quiser, mas não dependa só do colagénio para os objetivos de proteína no treino com pesos.',
        ],
      },
      {
        heading: 'Uso',
        body: ['Papel de suplemento, não combustível primário de MPS.'],
      },
    ]),
  },
  {
    slug: 'can-eat-carbs-lose-weight',
    title: 'Posso comer hidratos e perder peso?',
    date: '2026-04-02',
    description:
      'Um guia detalhado e baseado em ciência sobre Posso comer hidratos e perder peso: protocolos práticos, erros comuns, métodos de medição e um sistema de registo que consegue manter em semanas ocupadas.',
    sections: withShared([
      {
        body: [
          'A perda de gordura precisa de um défice calórico, não de zero hidratos.',
          'Os hidratos podem apoiar o treino e a adesão.',
        ],
      },
      {
        heading: 'Medo da insulina',
        body: ['Não é um atalho à volta do balanço energético num défice.'],
      },
      {
        heading: 'Qualidade alimentar',
        body: ['Hidratos ricos em fibra ajudam a saciedade para muitas pessoas.'],
      },
    ]),
  },
  {
    slug: 'do-resting-calories-count-in-deficit',
    title: 'As calorias em repouso contam para o seu défice?',
    date: '2026-04-01',
    description:
      'Um guia detalhado e baseado em ciência sobre As calorias em repouso contam para o seu défice: protocolos práticos, erros comuns, métodos de medição e um sistema de registo que consegue manter em semanas ocupadas.',
    sections: withShared([
      {
        body: [
          'O gasto em repouso é a maior parte do TDEE de muitas pessoas.',
          'O seu défice é ingestão versus gasto total, incluindo as calorias em repouso.',
        ],
      },
      {
        heading: 'Sem orçamento separado',
        body: ['Não come as calorias em repouso como uma segunda carteira.'],
      },
      {
        heading: 'Defina a ingestão',
        body: ['Abaixo do gasto total estimado, validado pelo peso semanal.'],
      },
    ]),
  },
  {
    slug: 'do-carbs-make-you-fat',
    title: 'Os hidratos engordam?',
    date: '2026-03-31',
    description:
      'Um guia detalhado e baseado em ciência sobre Os hidratos engordam: protocolos práticos, erros comuns, métodos de medição e um sistema de registo que consegue manter em semanas ocupadas.',
    sections: withShared([
      {
        body: [
          'Os hidratos não criam gordura de forma única independentemente de um excedente energético.',
          'Padrões ultraprocessados podem aumentar a ingestão para algumas pessoas.',
        ],
      },
      {
        heading: 'Mecanismo',
        body: ['O excedente é o mecanismo de ganho de gordura.'],
      },
      {
        heading: 'Prática',
        body: ['Defina calorias, atinja a proteína, escolha hidratos a que consiga aderir.'],
      },
    ]),
  },
  {
    slug: 'does-protein-turn-into-carbs',
    title: 'A proteína transforma-se em hidratos?',
    date: '2026-03-30',
    description:
      'Um guia detalhado e baseado em ciência sobre A proteína transforma-se em hidratos: protocolos práticos, erros comuns, métodos de medição e um sistema de registo que consegue manter em semanas ocupadas.',
    sections: withShared([
      {
        body: [
          'O corpo pode produzir glucose a partir de aminoácidos quando precisa.',
          'Isso não é motivo para tratar a proteína como massa.',
        ],
      },
      {
        heading: 'Prática',
        body: [
          'Atinja a proteína para saciedade e músculo; defina os hidratos pelas necessidades de treino.',
        ],
      },
    ]),
  },
  {
    slug: 'why-not-gaining-muscle',
    title: 'Porque não estou a ganhar músculo? 14 correções que importam',
    date: '2026-03-29',
    description:
      'Um guia detalhado e baseado em ciência sobre Porque não estou a ganhar músculo? 14 correções que importam: protocolos práticos, erros comuns, métodos de medição e um sistema de registo que consegue manter em semanas ocupadas.',
    sections: withShared([
      {
        body: [
          'A maioria dos ganhos estagnados vem de sobrecarga progressiva fraca, pouca proteína, ausência de excedente quando é preciso, mau sono e impaciência.',
          'As correções abrangem treino, nutrição, recuperação e honestidade no registo.',
        ],
      },
      {
        heading: 'Lista de verificação',
        body: [
          'Carga progressiva, proteína 1,6 a 2,2 g/kg, excedente se for avançado, sono, pare de saltar de programas, registe a comida, dê meses às fases.',
        ],
      },
    ]),
  },
  {
    slug: 'does-counting-macros-work',
    title: 'Contar macros funciona a longo prazo?',
    date: '2026-03-28',
    description:
      'Um guia detalhado e baseado em ciência sobre Contar macros funciona a longo prazo: protocolos práticos, erros comuns, métodos de medição e um sistema de registo que consegue manter em semanas ocupadas.',
    sections: withShared([
      {
        body: [
          'Contar macros funciona quando melhora a consciência e a adesão.',
          'Falha como teatro de perfeccionismo.',
        ],
      },
      {
        heading: 'Periodize',
        body: ['Mais rigoroso em cuttings, mais solto na manutenção para muitas pessoas.'],
      },
      {
        heading: 'Ferramentas de velocidade',
        body: ['O registo por foto reduz o custo de se manter consistente.'],
      },
    ]),
  },
  {
    slug: 'how-to-hit-your-macros',
    title: 'Como atingir as suas macros de forma consistente',
    date: '2026-03-27',
    description:
      'Sistemas para atingir macros: proteína primeiro, padrões por defeito, shakes, refeições Saved, verificações antes do jantar.',
    sections: withShared([
      {
        body: [
          'A consistência bate a caça exacta a cada grama em todos os almoços.',
          'Construa padrões por defeito e decida o jantar com as macros restantes à vista.',
        ],
      },
      {
        heading: 'Táticas',
        body: [
          'Proteína primeiro, shakes de reserva, guarde repetições, reveja antes do jantar, fotografe o caos.',
        ],
      },
    ]),
  },
  {
    slug: 'ww-vs-keto',
    title: 'Weight Watchers vs keto para perda de gordura',
    date: '2026-03-26',
    description:
      'WeightWatchers vs keto: mecanismos, adesão, necessidades de quem treina com pesos e para quem cada um serve.',
    sections: withShared([
      {
        body: [
          'O WW usa pontos e comunidade. O keto usa restrição de hidratos.',
          'Ambos podem reduzir calorias através de regras diferentes.',
        ],
      },
      {
        heading: 'Quem treina com pesos',
        body: ['Muitas vezes precisa de mais flexibilidade de hidratos do que o keto estrito permite.'],
      },
      {
        heading: 'Escolha',
        body: ['A adesão e o contexto médico batem a identidade tribal.'],
      },
    ]),
  },
  {
    slug: 'ww-vs-macros-tracking',
    title: 'Weight Watchers vs registo de macros',
    date: '2026-03-25',
    description:
      'Um guia detalhado e baseado em ciência sobre Weight Watchers vs registo de macros: protocolos práticos, erros comuns, métodos de medição e um sistema de registo que consegue manter em semanas ocupadas.',
    sections: withShared([
      {
        body: [
          'Os pontos simplificam decisões. As macros dão precisão ao treino.',
          'Se a proteína e o desempenho importam, as macros costumam encaixar melhor.',
        ],
      },
      {
        heading: 'Se a comunidade é a cola, o WW pode vencer.',
        body: ['Híbrido'],
      },
      {
        heading:
          'Algumas pessoas usam o WW socialmente e macros em privado para os treinos.',
        body: [],
      },
    ]),
  },
  {
    slug: 'ww-vs-calorie-counting',
    title: 'Weight Watchers vs contagem de calorias',
    date: '2026-03-24',
    description:
      'Um guia detalhado e baseado em ciência sobre Weight Watchers vs contagem de calorias: protocolos práticos, erros comuns, métodos de medição e um sistema de registo que consegue manter em semanas ocupadas.',
    sections: withShared([
      {
        body: [
          'Ambos criam estrutura de ingestão.',
          'As calorias são transparentes; os pontos acrescentam regras de preferência.',
        ],
      },
      {
        heading:
          'Qualquer um funciona se a ingestão média baixar e o registo continuar honesto.',
        body: [],
      },
    ]),
  },
  comparison('MyPlate', 'MyFitnessPal', {
    slug: 'myplate-vs-myfitnesspal',
    title: 'MyPlate vs MyFitnessPal: que rastreador lhe serve?',
    date: '2026-03-23',
  }),
  comparison('Nutrisystem', 'WeightWatchers', {
    slug: 'nutrisystem-vs-weightwatchers',
    title: 'Nutrisystem vs WeightWatchers: qual é melhor para perda de gordura?',
    date: '2026-03-22',
  }),
  comparison('MacroFactor', 'RP Diet', {
    slug: 'macrofactor-vs-rp-diet',
    title: 'MacroFactor vs app RP Diet: comparação prática',
    date: '2026-03-21',
  }),
  comparison('Cronometer', 'Carb Manager', {
    slug: 'cronometer-vs-carb-manager',
    title: 'Cronometer vs Carb Manager: qual deve usar?',
    date: '2026-03-20',
  }),
  comparison('Cronometer', 'Lose It!', {
    slug: 'cronometer-vs-lose-it',
    title: 'Cronometer vs Lose It: comparação detalhada',
    date: '2026-03-19',
    descriptionExtra:
      'Uma comparação aprofundada de Cronometer vs Lose It! para registo no mundo real, adesão, bases de dados vs estrutura, e quem deve escolher cada ferramenta.',
  }),
]

let written = 0
let skipped = 0
for (const post of posts) {
  const file = path.join(DIR, `${post.slug}.json`)
  if (fs.existsSync(file)) {
    try {
      JSON.parse(fs.readFileSync(file, 'utf8'))
      skipped++
      continue
    } catch {
      // rewrite invalid
    }
  }
  fs.writeFileSync(file, JSON.stringify(post, null, 2) + '\n')
  written++
}

console.log(JSON.stringify({ written, skipped, total: posts.length }))
