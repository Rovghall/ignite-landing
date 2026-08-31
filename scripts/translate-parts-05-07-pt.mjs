/**
 * Translate content/en/blog-part-{05,06,07}.json → content/pt/
 * European Portuguese (pt-PT). Brand names preserved.
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()

/** Exact string map (EN → pt-PT). Longer / more specific first when applying via Map. */
const DICT = new Map(Object.entries({
  // Shared sections
  'Measurement and feedback loop': 'Medição e ciclo de feedback',
  'Protein, training, and recovery': 'Proteína, treino e recuperação',
  'A 7-day execution checklist': 'Lista de execução de 7 dias',
  'Where IGNITE AI fits': 'Onde o IGNITE AI se encaixa',
  'Bottom line': 'Conclusão',
  'Deeper context and edge cases': 'Contexto mais profundo e casos especiais',
  'How to use this list': 'Como usar esta lista',
  'Choosing without going crazy': 'Escolher sem enlouquecer',
  'Logging speed on mixed plates': 'Velocidade de registo em pratos mistos',
  'Adherence and underreporting': 'Adesão e subdeclaração',
  'Workouts and progress context': 'Treinos e contexto de progresso',
  'Verdict framework': 'Quadro de decisão',
  'What to save': 'O que guardar',
  'When to resnap': 'Quando voltar a fotografar',
  'Tactics': 'Táticas',
  'Targets': 'Objetivos',
  'Photo needs': 'Necessidades da foto',
  'Photo-log and adjust.': 'Registe por foto e ajuste.',
  'Defaults beat fancy macros you miss.': 'Defaults vencem macros elaboradas que falha.',
  'Daily protein in evidence-based lifting ranges.': 'Proteína diária nas gamas de musculação baseadas em evidência.',

  'The useful scoreboard is usually a two to four week trend: average bodyweight, waist or photos, training performance, and average intake.':
    'O placar útil é normalmente uma tendência de duas a quatro semanas: peso corporal médio, cintura ou fotos, desempenho no treino e ingestão média.',
  'Single-day scale spikes from sodium, carbohydrates, hard lower-body training, or menstrual fluid are noise. Act on slopes, not points.':
    'Picos de um dia na balança por sódio, hidratos de carbono, treino duro de pernas ou líquido menstrual são ruído. Aja sobre as tendências, não sobre pontos isolados.',
  'If you lift while changing bodyweight, keep progressive overload and a protein target you can hit on busy days. A practical evidence-based band for many lifters in a deficit is about 1.6 to 2.2 g/kg.':
    'Se treina com pesos enquanto muda o peso corporal, mantenha sobrecarga progressiva e um objetivo de proteína que consiga atingir em dias ocupados. Uma faixa prática baseada em evidência para muitos praticantes em défice é cerca de 1,6 a 2,2 g/kg.',
  'Sleep and steps are silent levers. A perfect macro plan fails when NEAT collapses and late-night snacking goes unlogged.':
    'O sono e os passos são alavancas silenciosas. Um plano de macros perfeito falha quando o NEAT colapsa e os snacks noturnos ficam por registar.',
  '1) Log every meal, photographing chaotic plates. 2) Edit oils and sauces on purpose. 3) Save one staple to Saved. 4) Log at least two workouts. 5) Weigh most mornings and average them. 6) Keep steps roughly steady. 7) Change only one lever next week if needed.':
    '1) Registe todas as refeições, fotografando pratos caóticos. 2) Edite óleos e molhos de propósito. 3) Guarde um básico em Saved. 4) Registe pelo menos dois treinos. 5) Pese-se na maioria das manhãs e faça a média. 6) Mantenha os passos mais ou menos estáveis. 7) Mude só uma alavanca na semana seguinte se for preciso.',
  'This checklist turns advice into data. Without it, articles stay entertainment.':
    'Esta lista transforma conselhos em dados. Sem ela, os artigos ficam só entretenimento.',
  'You can run this with any honest logger. IGNITE AI is built for the friction points that usually break plans: mixed meals, repeat staples, and training context in one place.':
    'Pode fazer isto com qualquer registador honesto. O IGNITE AI foi feito para os pontos de atrito que normalmente partem planos: refeições mistas, básicos repetidos e contexto de treino num só sítio.',
  'Snap → edit → confirm for new plates. Saved for repeats. Workouts beside food so you decide fueling on purpose.':
    'Snap → editar → confirmar para pratos novos. Saved para repetições. Treinos ao lado da comida para decidir o fueling de propósito.',
  'When logging has to stay honest on busy days, IGNITE AI helps with photo meal snaps, macro edits, Saved repeats, and workouts in one loop. Snap it. Log it. Crush it.':
    'Quando o registo tem de continuar honesto em dias ocupados, o IGNITE AI ajuda com fotos de refeições, edições de macros, repetições Saved e treinos num só ciclo. Snap it. Log it. Crush it.',
  'Execute with weekly averages and honest logging.':
    'Execute com médias semanais e registo honesto.',
  'Run a three-day bakeoff with real meals. Keep the less annoying honest logger. Brand pride does not burn fat.':
    'Faça um teste de três dias com refeições reais. Fique com o registador honesto menos irritante. Orgulho de marca não queima gordura.',
  'Edge cases include beginners vs advanced lifters, high-stress work weeks, travel, and medical constraints. Beginners can often progress near maintenance. Advanced lifters usually need clearer surplus or deficit phases.':
    'Casos especiais incluem principiantes vs praticantes avançados, semanas de trabalho com muito stress, viagens e restrições médicas. Principiantes podem muitas vezes progredir perto da manutenção. Praticantes avançados precisam normalmente de fases mais claras de excedente ou défice.',
  'If you have clinical symptoms, medication effects, or a history of disordered eating, get professional support. An app can improve measurement. It cannot replace care.':
    'Se tem sintomas clínicos, efeitos de medicação ou historial de alimentação desordenada, procure apoio profissional. Uma app pode melhorar a medição. Não substitui cuidados de saúde.',
  'When evidence is mixed, prefer the intervention you can repeat for 12 weeks. Adherence is part of the physiology in free-living humans.':
    'Quando a evidência é mista, prefira a intervenção que consegue repetir durante 12 semanas. A adesão faz parte da fisiologia em humanos no dia a dia.',

  // Comparison shared
  'Self-reported diaries underreport when logging is annoying. That research-shaped reality should sit above feature checklists.':
    'Os diários autorreportados subdeclaram quando o registo é aborrecido. Essa realidade moldada pela investigação deve estar acima das listas de funcionalidades.',
  'Ask whether its happy path matches your actual meals: packaged foods, keto math, psychology curriculum, or weigh-everything discipline.':
    'Pergunte se o caminho feliz corresponde às suas refeições reais: alimentos embalados, matemática keto, currículo de psicologia ou disciplina de pesar tudo.',
  'Test both on barcode breakfast, homemade lunch, and restaurant dinner before you pay annually.':
    'Teste ambos no pequeno-almoço com código de barras, almoço caseiro e jantar de restaurante antes de pagar anualmente.',
  'Database-first tools are excellent for labels and weak for unlabeled bowls unless you invest in custom foods.':
    'Ferramentas centradas em bases de dados são excelentes para rótulos e fracas para taças sem etiqueta, a menos que invista em alimentos personalizados.',
  'If most calories come from cooking and restaurants, camera speed plus editable macros often beats search bars.':
    'Se a maior parte das calorias vem da cozinha e de restaurantes, a velocidade da câmara mais macros editáveis muitas vezes bate as barras de pesquisa.',
  'The scientific-sounding feature set fails if weekend oils never enter the log. Speed and editability are accuracy features.':
    'O conjunto de funcionalidades com ar científico falha se os óleos do fim de semana nunca entram no registo. Velocidade e editabilidade são funcionalidades de precisão.',
  'Keep protein targets realistic if you lift, often around 1.6 to 2.2 g/kg in a cut, regardless of which brand you pick.':
    'Mantenha objetivos de proteína realistas se treina com pesos, muitas vezes cerca de 1,6 a 2,2 g/kg num cutting, independentemente da marca que escolher.',
  'Some apps are food-only. Others include activity. Few combine photo macros, training logs, and social progress cleanly.':
    'Algumas apps são só comida. Outras incluem atividade. Poucas combinam macros por foto, registos de treino e progresso social de forma limpa.',
  'If accountability matters, sharing progress with friends can beat another private streak counter.':
    'Se a responsabilização importa, partilhar o progresso com amigos pode bater outro contador de streak privado.',
  "Pick IGNITE AI if you need snap → edit → Saved plus workouts in one loop more than you need either brand's legacy workflow.":
    'Escolha o IGNITE AI se precisa de snap → editar → Saved mais treinos num só ciclo mais do que do fluxo legado de qualquer uma das marcas.',

  // Roundup shared
  'Underreporting rises when logging is annoying. Choose speed and honesty over feature hoarding.':
    'A subdeclaração sobe quando o registo é aborrecido. Escolha velocidade e honestidade em vez de acumular funcionalidades.',
  'Install two options max. Log barcode breakfast, homemade lunch, and restaurant dinner in both. Keep the one you still open on Friday.':
    'Instale no máximo duas opções. Registe pequeno-almoço com código de barras, almoço caseiro e jantar de restaurante em ambas. Fique com a que ainda abre na sexta-feira.',
  'Healthy weight change needs energy balance, protein, and training. Apps only make the math visible.':
    'Uma mudança de peso saudável precisa de balanço energético, proteína e treino. As apps só tornam a matemática visível.',
  'If mixed plates are your bottleneck, prioritize photo logging with editable macros and Saved repeats.':
    'Se pratos mistos são o seu gargalo, priorize registo por foto com macros editáveis e repetições Saved.',
  'If packaged foods dominate, database and barcode quality matter more.':
    'Se os alimentos embalados dominam, a qualidade da base de dados e do código de barras importa mais.',
  'Pick two, test three days, keep one. Then execute protein, calories, and training for weeks.':
    'Escolha duas, teste três dias, fique com uma. Depois execute proteína, calorias e treino durante semanas.',
  'Test edit speed on your meals, not on demo screenshots.':
    'Teste a velocidade de edição nas suas refeições, não em capturas de ecrã de demonstração.',
  'If you only need calories and hate dense screens, simpler apps may win on adherence.':
    'Se só precisa de calorias e odeia ecrãs densos, apps mais simples podem vencer na adesão.',
  'Chaotic plates may still need camera-first logging beside micros.':
    'Pratos caóticos podem continuar a precisar de registo com câmara em primeiro lugar, além dos micronutrientes.',

  // App blurbs
  'Photo meal logging with macro edits, Saved repeats, workouts, and progress sharing. Best when mixed plates kill adherence. Watch-outs: still edit oils.':
    'Registo de refeições por foto com edições de macros, repetições Saved, treinos e partilha de progresso. Melhor quando pratos mistos matam a adesão. Atenção: continue a editar óleos.',
  'Large food database and barcodes. Best for packaged diets. Watch-outs: slow on messy bowls.':
    'Grande base de dados de alimentos e códigos de barras. Melhor para dietas com embalados. Atenção: lento em taças confusas.',
  'Expenditure-style updates from your data. Best for disciplined lifters. Watch-outs: weighing culture.':
    'Atualizações ao estilo de gasto a partir dos seus dados. Melhor para praticantes disciplinados. Atenção: cultura de pesar.',
  'Micronutrient depth. Best for precision. Watch-outs: heavier UX.':
    'Profundidade em micronutrientes. Melhor para precisão. Atenção: UX mais pesada.',
  'Calmer classic calorie diary. Best for simplicity. Watch-outs: not camera-first.':
    'Diário clássico de calorias mais calmo. Melhor para simplicidade. Atenção: não é câmara em primeiro lugar.',
  'Camera-first estimates. Best for quick snaps. Watch-outs: compare full needs.':
    'Estimativas com câmara em primeiro lugar. Melhor para fotos rápidas. Atenção: compare as necessidades completas.',
  'Net-carb and keto workflows. Best for low-carb protocols. Watch-outs: not ideal for high-carb athletes.':
    'Fluxos de net-carb e keto. Melhor para protocolos low-carb. Atenção: não ideal para atletas high-carb.',
  'Dense diary features. Best for power users. Watch-outs: overwhelm for beginners.':
    'Funcionalidades densas de diário. Melhor para utilizadores avançados. Atenção: sobrecarga para principiantes.',
  'Lifestyle framing and meal ideas. Best for beginners. Watch-outs: less hardcore macro culture.':
    'Enquadramento de estilo de vida e ideias de refeições. Melhor para principiantes. Atenção: menos cultura hardcore de macros.',
  'Simple European-friendly tracking. Best for light diaries. Watch-outs: limited photo depth.':
    'Rastreio simples e amigável na Europa. Melhor para diários leves. Atenção: profundidade fotográfica limitada.',
  'Budget community database. Best for free-friendly tracking. Watch-outs: polish varies.':
    'Base de dados comunitária económica. Melhor para rastreio gratuito. Atenção: o acabamento varia.',
  'Psychology curriculum. Best for behavior change. Watch-outs: not a lifting macro OS.':
    'Currículo de psicologia. Melhor para mudança de comportamento. Atenção: não é um SO de macros para musculação.',
  'Points and community. Best for accountability. Watch-outs: different from gram macros.':
    'Pontos e comunidade. Melhor para responsabilização. Atenção: diferente de macros em gramas.',
  'Packaged food grades. Best for grocery quality. Watch-outs: weak mixed-plate logger.':
    'Classificações de alimentos embalados. Melhor para qualidade no supermercado. Atenção: fraco em pratos mistos.',
  'Coaching-oriented macros. Best for programmed targets. Watch-outs: not photo-first.':
    'Macros orientadas para coaching. Melhor para objetivos programados. Atenção: não é foto em primeiro lugar.',
  'UK barcode strength. Best for British packaged foods. Watch-outs: less useful elsewhere.':
    'Força em códigos de barras do Reino Unido. Melhor para embalados britânicos. Atenção: menos útil noutros sítios.',
  'Coaching plus tracking mix. Best in strong local markets. Watch-outs: test daily speed.':
    'Mistura de coaching e rastreio. Melhor em mercados locais fortes. Atenção: teste a velocidade diária.',
  'Pure photo estimators. Best for camera experiments. Watch-outs: edit quality is everything.':
    'Estimadores só por foto. Melhor para experiências com câmara. Atenção: a qualidade da edição é tudo.',
  'Activity satellite. Best beside a real food log. Watch-outs: not primary macros.':
    'Satélite de atividade. Melhor ao lado de um registo real de comida. Atenção: não é macros principais.',
  'Activity hub with partners. Best as satellite. Watch-outs: food depth varies.':
    'Hub de atividade com parceiros. Melhor como satélite. Atenção: a profundidade alimentar varia.',
  'Photo macros plus workouts so large surplus meals actually get logged. Best for mixed plates and Saved staples. Watch-outs: edit oils on dense bowls.':
    'Macros por foto mais treinos para que refeições grandes de excedente sejam mesmo registadas. Melhor para pratos mistos e básicos Saved. Atenção: edite óleos em taças densas.',
  'Huge database for packaged surplus foods and shakes. Best for barcode-heavy gains. Watch-outs: slow on unlabeled homemade mass meals.':
    'Base de dados enorme para embalados de excedente e shakes. Melhor para ganhos com muitos códigos de barras. Atenção: lento em refeições caseiras sem etiqueta.',
  'Updates targets from your weigh-ins and intake. Best for disciplined lifters. Watch-outs: assumes careful logging.':
    'Atualiza objetivos a partir das suas pesagens e ingestão. Melhor para praticantes disciplinados. Atenção: assume registo cuidadoso.',
  'Micronutrient quality while calories rise. Best if food quality matters during a bulk. Watch-outs: heavier UX.':
    'Qualidade de micronutrientes enquanto as calorias sobem. Melhor se a qualidade alimentar importa num bulk. Atenção: UX mais pesada.',
  'Simple calorie surplus tracking with a calmer UI. Best for straightforward goals. Watch-outs: not camera-first.':
    'Rastreio simples de excedente calórico com UI mais calma. Melhor para objetivos diretos. Atenção: não é câmara em primeiro lugar.',
  'Camera-first logging for people who hate databases. Best for quick estimates. Watch-outs: compare full feature needs.':
    'Registo com câmara em primeiro lugar para quem odeia bases de dados. Melhor para estimativas rápidas. Atenção: compare as necessidades completas de funcionalidades.',
  'Behavior layer if appetite psychology blocks eating enough. Best for mindset. Watch-outs: weak as pure macro engine.':
    'Camada de comportamento se a psicologia do apetite impede comer o suficiente. Melhor para mindset. Atenção: fraco como motor puro de macros.',
  'Packaged food quality checks while calories rise. Best for grocery decisions. Watch-outs: weak for unlabeled plates.':
    'Verificações de qualidade de embalados enquanto as calorias sobem. Melhor para decisões no supermercado. Atenção: fraco em pratos sem etiqueta.',
  'Simple diary and goals. Best for light tracking. Watch-outs: not a hardcore bulk coach.':
    'Diário simples e objetivos. Melhor para rastreio leve. Atenção: não é um coach hardcore de bulk.',
  'Budget tracking with community foods. Best when price matters. Watch-outs: uneven polish.':
    'Rastreio económico com alimentos da comunidade. Melhor quando o preço importa. Atenção: acabamento irregular.',
  'Points structure some people use to eat more consistently on purpose. Best for community. Watch-outs: not gram-precision macros.':
    'Estrutura de pontos que algumas pessoas usam para comer mais de forma consistente de propósito. Melhor para comunidade. Atenção: não são macros com precisão em gramas.',
  'Coaching-oriented macros. Best if you want programmed targets. Watch-outs: not photo-first chaos logging.':
    'Macros orientadas para coaching. Melhor se quiser objetivos programados. Atenção: não é registo caótico com foto em primeiro lugar.',
  'Template macros popular with lifters. Best for structured plans. Watch-outs: weighing culture assumed.':
    'Macros por template populares entre praticantes. Melhor para planos estruturados. Atenção: assume cultura de pesar.',
  'One-tap re-logs for repeat high-calorie bowls. Best for busy bulks. Watch-outs: calibrate once carefully.':
    'Re-registos com um toque para taças calóricas repetidas. Melhor para bulks ocupados. Atenção: calibre uma vez com cuidado.',
  'Progressive overload tracking. Best paired with any food logger. Watch-outs: not a nutrition diary alone.':
    'Rastreio de sobrecarga progressiva. Melhor emparelhado com qualquer registador de comida. Atenção: não é um diário nutricional sozinho.',
  'Progressive overload. Best paired with nutrition apps. Watch-outs: not calorie math.':
    'Sobrecarga progressiva. Melhor emparelhado com apps de nutrição. Atenção: não é matemática de calorias.',
  'Activity satellite for steps. Best as a companion. Watch-outs: not primary macro logger.':
    'Satélite de atividade para passos. Melhor como companheiro. Atenção: não é o registador principal de macros.',
  'Activity hub. Best as satellite. Watch-outs: food logging depth varies.':
    'Hub de atividade. Melhor como satélite. Atenção: a profundidade do registo alimentar varia.',
  'Meal ideas with tracking. Best for beginners needing structure. Watch-outs: less athlete-depth for some users.':
    'Ideias de refeições com rastreio. Melhor para principiantes que precisam de estrutura. Atenção: menos profundidade de atleta para alguns utilizadores.',
  'Easy calories when appetite lags. Best for hard gainers. Watch-outs: liquid calories still count.':
    'Calorias fáceis quando o apetite falha. Melhor para hard gainers. Atenção: calorias líquidas também contam.',
  'Batch high-calorie meal prep math. Best for Sunday cooks. Watch-outs: still need daily logging.':
    'Matemática de meal prep calórico em lote. Melhor para quem cozinha ao domingo. Atenção: ainda precisa de registo diário.',
  'Surplus fails when the fridge is empty. Best for consistency. Watch-outs: not calorie math.':
    'O excedente falha quando o frigorífico está vazio. Melhor para consistência. Atenção: não é matemática de calorias.',
  'Check off feedings and lifts. Best for adherence. Watch-outs: empty without a food log.':
    'Marque refeições e levantamentos. Melhor para adesão. Atenção: vazio sem um registo de comida.',
  'Trend weight while gaining. Best to stop dirty-bulk denial. Watch-outs: water noise.':
    'Tendência de peso enquanto ganha. Melhor para parar a negação do dirty bulk. Atenção: ruído da água.',
  'Dense classic diary. Best for power users. Watch-outs: cognitive load.':
    'Diário clássico denso. Melhor para utilizadores avançados. Atenção: carga cognitiva.',
  'Full control. Best for nerds. Watch-outs: abandonment risk.':
    'Controlo total. Melhor para nerds. Atenção: risco de abandono.',
  'Better photos, oil edits, weekly weigh-ins, conservative activity burns create accuracy enough.':
    'Melhores fotos, edições de óleo, pesagens semanais e gastos de atividade conservadores criam precisão suficiente.',

  // Guide unique intros / titles / descriptions
  'How to use Saved meals in IGNITE AI: calibrate once, re-log forever, when to re-snap.':
    'Como usar refeições Saved no IGNITE AI: calibra uma vez, re-regista para sempre, quando voltar a fotografar.',
  'How to Use Saved Meals in IGNITE AI for Faster Logging':
    'Como usar refeições Saved no IGNITE AI para registar mais depressa',
  'Saved meals turn calibrated plates into one-tap logs.':
    'As refeições Saved transformam pratos calibrados em registos com um toque.',
  'Snap, edit oils and protein, save, then reuse on repeat days.':
    'Fotografe, edite óleos e proteína, guarde e reutilize em dias repetidos.',
  'Oats, gym bowls, shakes, frequent sandwiches.':
    'Aveia, taças de ginásio, shakes, sandes frequentes.',
  'Recipe changes, new restaurant portions, sauce differences.':
    'Mudanças de receita, novas porções de restaurante, diferenças de molho.',

  'How to Build a Logging Streak Without Burning Out':
    'Como construir uma streak de registo sem esgotar',
  'Streaks help until missing one day destroys identity.':
    'As streaks ajudam até falhar um dia destruir a identidade.',
  'Use minimum viable logs on hard days.':
    'Use registos mínimos viáveis em dias difíceis.',
  'Photo snaps, Saved meals, weekly reviews, friend accountability instead of shame.':
    'Fotos rápidas, refeições Saved, revisões semanais, responsabilização de amigos em vez de vergonha.',

  'Protein-First Plate Method for Busy Lifters':
    'Método do prato proteína-primeiro para praticantes ocupados',
  'Protein first, then carbs for training, fats for calories.':
    'Proteína primeiro, depois hidratos para o treino, gorduras para as calorias.',

  'Weekend Calorie Damage Control Without Quitting Tracking':
    'Controlo de danos calóricos ao fim de semana sem abandonar o rastreio',
  'Weekends break averages when drinks and restaurants go unlogged.':
    'Os fins de semana partem as médias quando bebidas e restaurantes ficam por registar.',
  'Budget social meals, snap dinners, bias fats up, return Monday without revenge under-eating.':
    'Orçamente refeições sociais, fotografe jantares, incline as gorduras para cima, volte na segunda sem undereating de vingança.',

  'Meal Prep Macros: Batch Cook Without Guessing':
    'Macros de meal prep: cozinhar em lote sem adivinhar',
  'Weigh oils and starches for the whole batch.':
    'Pese óleos e amidos para o lote inteiro.',
  'Divide by real containers, save, reheat without re-math.':
    'Divida por recipientes reais, guarde, reaqueça sem refazer a matemática.',

  'High-Protein Snacks That Actually Fit Your Macros':
    'Snacks ricos em proteína que realmente cabem nas suas macros',
  'Yogurt, jerky, cottage cheese, shakes, edamame, and similar options.':
    'Iogurte, jerky, queijo cottage, shakes, edamame e opções semelhantes.',
  'Log extras; saves beat vending surprises.':
    'Registe extras; saves batem as surpresas das máquinas de venda.',

  'How Sleep Loss Raises Hunger and Scale Weight':
    'Como a falta de sono aumenta a fome e o peso na balança',
  'Sleep loss can alter appetite signaling and raise stress-related water weight.':
    'A falta de sono pode alterar o sinal do apetite e aumentar o peso de água ligado ao stress.',
  'Fix sleep before crash-cutting calories.':
    'Corrija o sono antes de cortar calorias de forma agressiva.',

  'Fiber, Macros, and Satiety: How to Get Fuller in a Deficit':
    'Fibra, macros e saciedade: como sentir-se mais cheio num défice',
  'Fiber-rich carbs and vegetables improve fullness for many people.':
    'Hidratos ricos em fibra e vegetais melhoram a saciedade para muita gente.',
  'Raise fiber gradually and still track total intake.':
    'Aumente a fibra gradualmente e continue a rastrear a ingestão total.',

  'Sugar Cravings in a Calorie Deficit: What Helps':
    'Desejos de açúcar num défice calórico: o que ajuda',
  'Cravings rise with sleep debt, low protein, and extreme restriction.':
    'Os desejos sobem com dívida de sono, pouca proteína e restrição extrema.',
  'Log desserts on purpose instead of accidentally.':
    'Registe sobremesas de propósito em vez de por acidente.',

  'How to Find Your Maintenance Calories in Two Weeks':
    'Como encontrar as suas calorias de manutenção em duas semanas',
  'Eat consistently, log, average intake, watch weekly weight.':
    'Coma de forma consistente, registe, faça a média da ingestão, observe o peso semanal.',
  'Flat weight means practical maintenance.':
    'Peso estável significa manutenção prática.',

  'Diet Breaks: When to Take One and How to Run It':
    'Pausas de dieta: quando fazer e como conduzir',
  'Diet breaks can restore training and adherence after long cuts.':
    'As pausas de dieta podem restaurar o treino e a adesão depois de cuttings longos.',
  'Keep protein high, raise carbs, keep lifting, then resume.':
    'Mantenha a proteína alta, suba os hidratos, continue a treinar e depois retome.',

  'Refeed Day vs Diet Break: What Is the Difference?':
    'Dia de refeed vs pausa de dieta: qual é a diferença?',
  'Refeed Day vs Diet Break: What Is the Difference':
    'Dia de refeed vs pausa de dieta: qual é a diferença',
  'Refeeds are short higher-carb days. Diet breaks last longer at maintenance.':
    'Os refeeds são dias curtos com mais hidratos. As pausas de dieta duram mais tempo na manutenção.',
  'Plan them; do not turn them into untracked chaos.':
    'Planeie-os; não os transforme em caos sem registo.',

  'How to Hit Macros While Traveling':
    'Como bater macros em viagem',
  'Travel wrecks databases.':
    'Viajar destroça bases de dados.',
  'Snap airport food, bias fats up, protect protein, keep a step floor.':
    'Fotografe comida do aeroporto, incline as gorduras para cima, proteja a proteína, mantenha um piso de passos.',

  'Late-Night Snacking Without Blowing Your Macros':
    'Snacks noturnos sem rebentar as macros',
  'Budget evening calories earlier if nights are dangerous.':
    'Orçamente calorias da noite mais cedo se as noites forem perigosas.',
  'High-protein snacks help; sleep fixes more than speeches.':
    'Snacks ricos em proteína ajudam; o sono corrige mais do que discursos.',

  'How Accurate Are Restaurant Menu Calories?':
    'Quão precisas são as calorias dos menus de restaurante?',
  'How Accurate Are Restaurant Menu Calories':
    'Quão precisas são as calorias dos menus de restaurante',
  'Published calories can be off because kitchens vary.':
    'As calorias publicadas podem falhar porque as cozinhas variam.',
  'Use as drafts, adjust for oils and portion size, photo-log.':
    'Use como rascunhos, ajuste para óleos e tamanho da porção, registe por foto.',

  'Protein Timing Myths vs What Matters':
    'Mitos do timing de proteína vs o que importa',
  'Total daily protein and stimulus matter more than anabolic window panic.':
    'A proteína diária total e o estímulo importam mais do que o pânico da janela anabólica.',
  'Spread doses when you can; shakes are convenient, not magic.':
    'Distribua doses quando puder; shakes são convenientes, não mágicos.',

  'Cardio vs Steps for Fat Loss: Which Should You Prioritize?':
    'Cardio vs passos para perda de gordura: o que priorizar?',
  'Cardio vs Steps for Fat Loss: Which Should You Prioritize':
    'Cardio vs passos para perda de gordura: o que priorizar',
  'Steps are low-stress NEAT. Cardio raises expenditure faster with more recovery cost.':
    'Os passos são NEAT de baixo stress. O cardio sobe o gasto mais depressa com mais custo de recuperação.',
  'Many cuts prefer a step floor plus lifting, adding cardio as needed.':
    'Muitos cuttings preferem um piso de passos mais musculação, adicionando cardio conforme necessário.',

  'How to Read Nutrition Labels for Macros':
    'Como ler rótulos nutricionais para macros',
  'Serving size first.':
    'Primeiro o tamanho da porção.',
  'Then macros. Watch multi-serving packages and net-carb marketing.':
    'Depois as macros. Atenção a embalagens com várias porções e marketing de net-carb.',

  'Best Time to Weigh Yourself for Accurate Trends':
    'Melhor altura para se pesar para tendências precisas',
  'Weigh most mornings after bathroom before food.':
    'Pese-se na maioria das manhãs depois da casa de banho e antes de comer.',
  'Average the week; ignore single spikes.':
    'Faça a média da semana; ignore picos isolados.',

  'Water Weight vs Fat Loss: How to Tell the Difference':
    'Peso de água vs perda de gordura: como distinguir',
  'Fast drops are often water and glycogen. Fat is slower.':
    'Quedas rápidas são muitas vezes água e glicogénio. A gordura é mais lenta.',
  'Use multi-week averages, waist, photos.':
    'Use médias de várias semanas, cintura, fotos.',

  'How to Log Shared Plates and Family-Style Meals':
    'Como registar pratos partilhados e refeições em família',
  'Photograph before the table destroys evidence.':
    'Fotografe antes de a mesa destruir as provas.',
  'Estimate your portion, bias fats up, save regular family meals.':
    'Estime a sua porção, incline as gorduras para cima, guarde refeições familiares habituais.',

  'IGNITE AI for Beginners: First Week Setup':
    'IGNITE AI para principiantes: configuração da primeira semana',
  'Set protein and calorie targets, snap every meal, edit misses, log a workout, save a staple, review day seven.':
    'Defina objetivos de proteína e calorias, fotografe cada refeição, edite falhas, registe um treino, guarde um básico, reveja no dia sete.',

  'Macros for Women Who Lift: A Practical Setup':
    'Macros para mulheres que treinam com pesos: uma configuração prática',
  'Enough protein and carbs to perform.':
    'Proteína e hidratos suficientes para performar.',
  'Use weekly averages; avoid crash deficits that crush training.':
    'Use médias semanais; evite défices agressivos que destroem o treino.',

  'Macro Tracking for Busy Parents':
    'Rastreio de macros para pais ocupados',
  'Bites from kids plates count.':
    'As dentadas dos pratos das crianças contam.',
  'Photo-log fast, use Saved staples, protein anchors, logged days over perfect days.':
    'Registe por foto depressa, use básicos Saved, âncoras de proteína, dias registados acima de dias perfeitos.',

  'Is Your Fitness App Accurate? How to Improve Reliability':
    'A sua app de fitness é precisa? Como melhorar a fiabilidade',
  'Apps estimate.':
    'As apps estimam.',

  'How to Track Macros Fast on Busy Days':
    'Como rastrear macros depressa em dias ocupados',
  'Photo snap, Saved meals, shakes, protein-first dinner decisions.':
    'Foto rápida, refeições Saved, shakes, decisões de jantar com proteína primeiro.',
  'A 20-second honest log beats a skipped day.':
    'Um registo honesto de 20 segundos bate um dia saltado.',

  'Is the Cronometer App Worth It?':
    'A app Cronometer vale a pena?',
  'Is the Cronometer App Worth It':
    'A app Cronometer vale a pena',
  'Cronometer shines for vitamins, minerals, and careful food data.':
    'O Cronometer brilha em vitaminas, minerais e dados alimentares cuidadosos.',
  'Worth it for precision-focused users.':
    'Vale a pena para utilizadores focados em precisão.',

  // Roundup titles
  '21 Best Food Journal Apps': '21 melhores apps de diário alimentar',
  '23 Best Carb Counting Apps': '23 melhores apps para contar hidratos',
  '13 Weight Gain Apps for Custom Plans': '13 apps de ganho de peso para planos personalizados',
  '14 Best Protein Tracker Apps': '14 melhores apps de rastreio de proteína',
  '16 Best Apps to Track Macros': '16 melhores apps para rastrear macros',
  '25 Best Apps for Diabetes and Weight Loss Support': '25 melhores apps para diabetes e apoio à perda de peso',
  '20 Best Fitness and Nutrition Apps for Results': '20 melhores apps de fitness e nutrição para resultados',
  '25 Best Apps to Help Gain Weight Effectively': '25 melhores apps para ajudar a ganhar peso de forma eficaz',
  '14 Best Free Calorie and Macro Trackers': '14 melhores rastreadores gratuitos de calorias e macros',
  '21 Best Weight Watchers Alternatives': '21 melhores alternativas ao WeightWatchers',
  '28 Fitness Apps Like MyFitnessPal': '28 apps de fitness como o MyFitnessPal',
  '15 Best Free Macro Tracking Apps': '15 melhores apps gratuitas de rastreio de macros',
  '19 Apps Like Weight Watchers': '19 apps como o WeightWatchers',
  '19 Best Noom Alternatives': '19 melhores alternativas ao Noom',

  // Comparison titles
  'Carb Manager vs MyFitnessPal for Keto Tracking': 'Carb Manager vs MyFitnessPal para rastreio keto',
  'Noom vs WeightWatchers Review': 'Análise Noom vs WeightWatchers',
  'Noom vs MyFitnessPal Comparison': 'Comparação Noom vs MyFitnessPal',
  'MyNetDiary vs MyFitnessPal Comparison': 'Comparação MyNetDiary vs MyFitnessPal',
  'Lose It vs MyFitnessPal Review': 'Análise Lose It vs MyFitnessPal',
  'MacroFactor vs MyFitnessPal for TDEE Tracking': 'MacroFactor vs MyFitnessPal para rastreio de TDEE',
  'FatSecret vs MyFitnessPal Review': 'Análise FatSecret vs MyFitnessPal',
  'Lifesum vs MyFitnessPal Guide': 'Guia Lifesum vs MyFitnessPal',
  'MacroFactor vs Cronometer Review': 'Análise MacroFactor vs Cronometer',
  'MyFitnessPal vs Cronometer Guide': 'Guia MyFitnessPal vs Cronometer',

  // Numbered headings that stay with brand names (translate surrounding words only where needed)
  '1. IGNITE AI': '1. IGNITE AI',
  '2. MyFitnessPal': '2. MyFitnessPal',
  '3. MacroFactor': '3. MacroFactor',
  '4. Cronometer': '4. Cronometer',
  '5. Lose It!': '5. Lose It!',
  '6. Cal AI': '6. Cal AI',
  '7. Cal AI': '7. Cal AI',
  '7. Carb Manager': '7. Carb Manager',
  '8. MyNetDiary': '8. MyNetDiary',
  '8. Lifesum': '8. Lifesum',
  '9. Lifesum': '9. Lifesum',
  '9. Yazio': '9. Yazio',
  '10. Yazio': '10. Yazio',
  '10. FatSecret': '10. FatSecret',
  '11. FatSecret': '11. FatSecret',
  '11. MyNetDiary': '11. MyNetDiary',
  '12. Noom': '12. Noom',
  '12. Carbon': '12. Carbon',
  '13. WeightWatchers': '13. WeightWatchers',
  '13. RP-style diet apps': '13. Apps de dieta ao estilo RP',
  '14. Fooducate': '14. Fooducate',
  '14. Noom': '14. Noom',
  '15. Carbon': '15. Carbon',
  '15. WeightWatchers': '15. WeightWatchers',
  '16. Nutracheck': '16. Nutracheck',
  '16. Fooducate': '16. Fooducate',
  '17. HealthifyMe': '17. HealthifyMe',
  '17. Samsung Health': '17. Samsung Health',
  '18. SnapCalorie-style tools': '18. Ferramentas ao estilo SnapCalorie',
  '18. Apple Fitness / Health stack': '18. Stack Apple Fitness / Health',
  '19. Samsung Health': '19. Samsung Health',
  '19. Recipe nutrition tools': '19. Ferramentas de nutrição de receitas',
  '20. Apple Health ecosystem': '20. Ecossistema Apple Health',
  '20. Grocery list apps': '20. Apps de lista de compras',
  '21. Strong/Hevy lift logs': '21. Registos de musculação Strong/Hevy',
  '21. Habit trackers': '21. Rastreadores de hábitos',
  '22. Scale apps with weekly averages': '22. Apps de balança com médias semanais',
  '23. Spreadsheet DIY': '23. Folha de cálculo DIY',
  '24. Shake-focused label workflows': '24. Fluxos focados em rótulos de shakes',
  '25. IGNITE AI Saved meals': '25. Refeições Saved do IGNITE AI',
  '6. Strong or Hevy-style lift logs': '6. Registos de musculação ao estilo Strong ou Hevy',
}))

/** Pattern translators applied when exact dict miss. */
function translateByPattern(text) {
  // Detailed science-aware guide descriptions
  let m = text.match(/^A detailed, science-aware guide to (.+): practical protocols, common mistakes, measurement methods, and a logging system you can keep on busy weeks\.$/)
  if (m) {
    const topic = translate(m[1])
    return `Um guia detalhado e com base científica sobre ${topic}: protocolos práticos, erros comuns, métodos de medição e um sistema de registo que consegue manter em semanas ocupadas.`
  }

  m = text.match(/^A detailed roundup for (.+): what each option does well, who it fits, and how to choose without installing ten apps\.$/)
  if (m) {
    const topic = translate(m[1])
    return `Uma análise detalhada das ${topic}: o que cada opção faz bem, a quem se adequa e como escolher sem instalar dez apps.`
  }

  m = text.match(/^An in-depth (.+) comparison for real-world logging, adherence, databases vs structure, and who should pick which tool\.$/)
  if (m) {
    return `Uma comparação aprofundada de ${m[1]} para registo no mundo real, adesão, bases de dados vs estrutura, e quem deve escolher cada ferramenta.`
  }

  m = text.match(/^(.+) only helps if the picks match how you eat and train\. This list explains the job of each option, not just the logo\.$/)
  if (m) {
    const topic = translate(m[1])
    return `A lista «${topic}» só ajuda se as escolhas corresponderem à forma como come e treina. Esta lista explica a função de cada opção, não só o logótipo.`
  }

  m = text.match(/^Choosing between (.+) and (.+) is less about brand loyalty and more about friction\. The best tracker is the one you still fill in on a tired Thursday\.$/)
  if (m) {
    return `Escolher entre ${m[1]} e ${m[2]} tem menos a ver com lealdade à marca e mais com atrito. O melhor rastreador é aquele que ainda preenche numa quinta-feira cansada.`
  }

  m = text.match(/^Below is a practical breakdown of (.+) versus (.+), then when a photo-first app like IGNITE AI is the better third option\.$/)
  if (m) {
    return `Abaixo está uma análise prática de ${m[1]} versus ${m[2]}, e depois quando uma app com foto em primeiro lugar como o IGNITE AI é a melhor terceira opção.`
  }

  m = text.match(/^What (.+) tends to optimize$/)
  if (m) {
    return `O que o ${m[1]} tende a otimizar`
  }

  m = text.match(/^(.+) usually wins for people whose workflow matches its core metaphor, whether that is databases, points, coaching lessons, or algorithm-guided targets\.$/)
  if (m) {
    return `O ${m[1]} costuma vencer para pessoas cujo fluxo corresponde à sua metáfora central, seja bases de dados, pontos, lições de coaching ou objetivos guiados por algoritmo.`
  }

  m = text.match(/^(.+) wins when its metaphor matches your habits better\. A calmer UI, a bigger database, stricter micros, or a different coaching frame can matter more than a marketing adjective\.$/)
  if (m) {
    return `O ${m[1]} vence quando a sua metáfora corresponde melhor aos seus hábitos. Uma UI mais calma, uma base de dados maior, micros mais rigorosos ou um enquadramento de coaching diferente podem importar mais do que um adjetivo de marketing.`
  }

  m = text.match(/^Pick (.+) if its core metaphor matches your daily friction\. Pick (.+) if the opposite is true\.$/)
  if (m) {
    return `Escolha o ${m[1]} se a metáfora central corresponder ao seu atrito diário. Escolha o ${m[2]} se for o contrário.`
  }

  return null
}

function translate(text) {
  if (text === '' || text == null) return text
  if (DICT.has(text)) return DICT.get(text)
  const patterned = translateByPattern(text)
  if (patterned != null) return patterned
  // Leave brand-only / already fine strings
  return text
}

function translateValue(value, keyHint = '') {
  if (typeof value === 'string') {
    if (keyHint === 'slug' || keyHint === 'date') return value
    return translate(value)
  }
  if (Array.isArray(value)) return value.map((v) => translateValue(v, keyHint))
  if (value && typeof value === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(value)) {
      out[k] = translateValue(v, k)
    }
    return out
  }
  return value
}

function main() {
  const parts = ['05', '06', '07']
  const missing = new Set()

  for (const p of parts) {
    const src = path.join(ROOT, 'content', 'en', `blog-part-${p}.json`)
    const dest = path.join(ROOT, 'content', 'pt', `blog-part-${p}.json`)
    const posts = JSON.parse(fs.readFileSync(src, 'utf8'))
    const translated = translateValue(posts)

    // Collect any English leftovers (heuristic: common English words)
    const check = (v, ctx) => {
      if (typeof v === 'string') {
        if (/^(The |If you |When |A detailed|Choosing between|Below is|Pick |What .+ tends|Underreporting|Install two|Photo meal|Large food|Test edit)/.test(v)) {
          missing.add(`${ctx}: ${v.slice(0, 100)}`)
        }
      } else if (Array.isArray(v)) v.forEach((x, i) => check(x, `${ctx}[${i}]`))
      else if (v && typeof v === 'object') {
        for (const [k, val] of Object.entries(v)) {
          if (k === 'slug' || k === 'date') continue
          check(val, `${ctx}.${k}`)
        }
      }
    }
    translated.forEach((post, i) => check(post, `part${p}[${i}]`))

    fs.writeFileSync(dest, JSON.stringify(translated, null, 2) + '\n', 'utf8')
    console.log('wrote', dest, 'posts', translated.length)
  }

  if (missing.size) {
    console.log('WARN possible untranslated:', missing.size)
    for (const s of [...missing].slice(0, 40)) console.log(' -', s)
  } else {
    console.log('no obvious English leftovers')
  }
}

main()
