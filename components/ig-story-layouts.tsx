import type { IgStorySlide } from '@/lib/ig-story-highlights'

export const STORY_ACCENT = '#FF8B6A'
export const STORY_ACCENT_SOFT = '#7EB8FF'

function TitleLine({
  slide,
  print,
}: {
  slide: IgStorySlide
  print?: boolean
}) {
  const titleClass = print
    ? 'font-sans text-[7.4vw] font-semibold leading-tight tracking-tight text-white sm:text-4xl'
    : 'font-sans text-[26px] font-semibold leading-tight tracking-tight text-white sm:text-[30px]'
  return (
    <p className={titleClass}>
      {slide.title}
      {slide.titleAccent ? (
        <>
          {' '}
          <span style={{ color: STORY_ACCENT }}>{slide.titleAccent}</span>
        </>
      ) : null}
    </p>
  )
}

export function ResearchLayout({
  slide,
  print,
}: {
  slide: IgStorySlide
  print?: boolean
}) {
  const layout = slide.layout ?? 'text'
  if (layout === 'accuracy') return <AccuracyLayout slide={slide} print={print} />
  if (layout === 'news') return <NewsLayout slide={slide} print={print} />
  if (layout === 'how') return <HowLayout slide={slide} print={print} />
  if (layout === 'impact') return <ImpactLayout slide={slide} print={print} />
  return null
}

function AccuracyLayout({ slide, print }: { slide: IgStorySlide; print?: boolean }) {
  const bars = slide.bars ?? []
  return (
    <div className="w-full text-left">
      <TitleLine slide={slide} print={print} />
      {slide.subtitle ? (
        <p className={print ? 'mt-[2.5vh] text-[3.6vw] leading-snug text-white/80 sm:text-base' : 'mt-3 text-[15px] leading-snug text-white/80'}>
          {slide.subtitle}
        </p>
      ) : null}
      <div className={print ? 'mt-[4vh] space-y-[2.2vh] rounded-[22px] bg-white/8 px-[4vw] py-[3vh]' : 'mt-6 space-y-4 rounded-[22px] bg-white/8 px-4 py-5'}>
        {bars.map((bar) => (
          <div key={bar.label}>
            <div className="mb-1.5 flex items-baseline justify-between">
              <p className={print ? 'text-[3.4vw] font-semibold text-white sm:text-sm' : 'text-[13px] font-semibold text-white'}>
                {bar.label}
              </p>
              {bar.highlight ? (
                <p className={print ? 'text-[3.2vw] font-bold sm:text-sm' : 'text-[12px] font-bold'} style={{ color: STORY_ACCENT }}>
                  IGNITE
                </p>
              ) : null}
            </div>
            <div className={print ? 'h-[1.6vh] overflow-hidden rounded-full bg-white/10' : 'h-3 overflow-hidden rounded-full bg-white/10'}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${bar.pct}%`,
                  background: bar.highlight ? STORY_ACCENT : STORY_ACCENT_SOFT,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      {slide.callout ? (
        <div className={print ? 'mt-[3.5vh] rounded-full bg-white px-[5vw] py-[2vh]' : 'mt-5 rounded-full bg-white px-5 py-3.5'}>
          <p className={print ? 'text-center text-[3.5vw] font-semibold leading-snug text-zinc-900 sm:text-sm' : 'text-center text-[14px] font-semibold leading-snug text-zinc-900'}>
            {slide.callout}
          </p>
        </div>
      ) : null}
      {slide.footer ? (
        <p className={print ? 'mt-[3vh] text-center text-[3.3vw] leading-snug text-white/70 sm:text-sm' : 'mt-4 text-center text-[13px] leading-snug text-white/70'}>
          {slide.footer}
        </p>
      ) : null}
    </div>
  )
}

function NewsLayout({ slide, print }: { slide: IgStorySlide; print?: boolean }) {
  const macros = slide.macros
  return (
    <div className="w-full text-center">
      <TitleLine slide={slide} print={print} />
      {slide.subtitle ? (
        <p className={print ? 'mt-[1.8vh] text-[3.8vw] text-white/85 sm:text-base' : 'mt-3 text-[15px] text-white/85'}>
          {slide.subtitle}
        </p>
      ) : null}
      {macros ? (
        <div className={print ? 'mt-[5vh] flex justify-center gap-[4vw]' : 'mt-8 flex justify-center gap-4'}>
          {(
            [
              { label: 'Protein', value: macros.protein, color: '#FF6B6B' },
              { label: 'Carbs', value: macros.carbs, color: '#FFB020' },
              { label: 'Fat', value: macros.fat, color: STORY_ACCENT_SOFT },
            ] as const
          ).map((item) => (
            <div
              key={item.label}
              className={print ? 'flex h-[22vw] w-[22vw] max-h-28 max-w-28 flex-col items-center justify-center rounded-[22px] bg-white/10' : 'flex h-24 w-24 flex-col items-center justify-center rounded-[22px] bg-white/10'}
            >
              <p className={print ? 'text-[4.4vw] font-semibold text-white sm:text-xl' : 'text-[20px] font-semibold text-white'} style={{ color: item.color }}>
                {item.value}
              </p>
              <p className={print ? 'mt-1 text-[2.8vw] text-white/70 sm:text-xs' : 'mt-1 text-[11px] text-white/70'}>{item.label}</p>
            </div>
          ))}
        </div>
      ) : null}
      <div className={print ? 'mt-[5vh] space-y-[3vh] text-left' : 'mt-8 space-y-4 text-left'}>
        {slide.blocks.map((block) => (
          <p key={block} className={print ? 'text-[3.8vw] leading-snug text-white/90 sm:text-base' : 'text-[15px] leading-snug text-white/90'}>
            {block}
          </p>
        ))}
      </div>
    </div>
  )
}

function HowLayout({ slide, print }: { slide: IgStorySlide; print?: boolean }) {
  const steps = slide.steps ?? []
  return (
    <div className="w-full text-left">
      <div className="text-center">
        <TitleLine slide={slide} print={print} />
      </div>
      <div className={print ? 'relative mt-[4vh] space-y-[3.2vh] pl-[7vw]' : 'relative mt-7 space-y-5 pl-8'}>
        <div className="absolute bottom-2 top-2 w-px bg-white/25" style={{ left: print ? '2.2vw' : 11 }} />
        {steps.map((step, index) => (
          <div key={`${index}-${step.kicker}`} className="relative">
            <span
              className={print ? 'absolute left-[-5.6vw] top-1 h-[3.2vw] w-[3.2vw] rounded-full' : 'absolute -left-[21px] top-1 h-3 w-3 rounded-full'}
              style={{ background: index % 2 === 0 ? STORY_ACCENT : STORY_ACCENT_SOFT }}
            />
            <p className={print ? 'text-[3.5vw] font-semibold sm:text-sm' : 'text-[13px] font-semibold'} style={{ color: STORY_ACCENT }}>
              {step.kicker}
            </p>
            <p className={print ? 'mt-1 text-[3.5vw] leading-snug text-white/90 sm:text-sm' : 'mt-1 text-[14px] leading-snug text-white/90'}>
              {step.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function ImpactLayout({ slide, print }: { slide: IgStorySlide; print?: boolean }) {
  return (
    <div className="w-full text-center">
      <TitleLine slide={slide} print={print} />
      <div className={print ? 'mt-[4vh] grid grid-cols-2 gap-[3vw]' : 'mt-7 grid grid-cols-2 gap-3'}>
        {slide.leftCard ? (
          <div className={print ? 'rounded-[22px] bg-white/10 px-[3vw] py-[3vh]' : 'rounded-[22px] bg-white/10 px-3 py-5'}>
            <p className={print ? 'text-[3vw] font-semibold text-white/70 sm:text-xs' : 'text-[11px] font-semibold text-white/70'}>
              {slide.leftCard.kicker}
            </p>
            <p className={print ? 'mt-[1vh] text-[5.5vw] font-semibold text-white sm:text-2xl' : 'mt-2 text-[26px] font-semibold text-white'}>
              {slide.leftCard.value}
            </p>
            <p className={print ? 'mt-[1vh] text-[3vw] leading-snug text-white/75 sm:text-xs' : 'mt-2 text-[12px] leading-snug text-white/75'}>
              {slide.leftCard.sub}
            </p>
          </div>
        ) : null}
        {slide.rightCard ? (
          <div className={print ? 'rounded-[22px] bg-white px-[3vw] py-[3vh]' : 'rounded-[22px] bg-white px-3 py-5'}>
            <p className={print ? 'text-[3vw] font-semibold text-zinc-500 sm:text-xs' : 'text-[11px] font-semibold text-zinc-500'}>
              {slide.rightCard.kicker}
            </p>
            <p className={print ? 'mt-[1vh] text-[5.5vw] font-semibold text-zinc-900 sm:text-2xl' : 'mt-2 text-[26px] font-semibold text-zinc-900'}>
              {slide.rightCard.value}
            </p>
            <p className={print ? 'mt-[1vh] text-[3vw] leading-snug text-zinc-600 sm:text-xs' : 'mt-2 text-[12px] leading-snug text-zinc-600'}>
              {slide.rightCard.sub}
            </p>
          </div>
        ) : null}
      </div>
      <div className={print ? 'mt-[4vh] space-y-[2vh] text-left' : 'mt-6 space-y-3 text-left'}>
        {(slide.bullets ?? []).map((bullet) => (
          <p key={bullet} className={print ? 'text-[3.6vw] text-white/90 sm:text-sm' : 'text-[14px] text-white/90'}>
            · {bullet}
          </p>
        ))}
      </div>
      {slide.cta ? (
        <div className={print ? 'mt-[4vh] rounded-full bg-white py-[1.8vh]' : 'mt-7 rounded-full bg-white py-3'}>
          <p className={print ? 'text-[3.6vw] font-semibold text-zinc-900 sm:text-sm' : 'text-[14px] font-semibold text-zinc-900'}>
            {slide.cta}
          </p>
        </div>
      ) : null}
    </div>
  )
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    const next = current ? `${current} ${word}` : word
    if (current && ctx.measureText(next).width > maxWidth) {
      lines.push(current)
      current = word
    } else current = next
  }
  if (current) lines.push(current)
  return lines
}

function fillRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + w, y, x + w, y + h, radius)
  ctx.arcTo(x + w, y + h, x, y + h, radius)
  ctx.arcTo(x, y + h, x, y, radius)
  ctx.arcTo(x, y, x + w, y, radius)
  ctx.closePath()
  ctx.fill()
}

export function paintResearchSlide(
  ctx: CanvasRenderingContext2D,
  slide: IgStorySlide,
  width: number,
  height: number,
) {
  const pad = 86
  const maxW = width - pad * 2
  const font = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
  let y = 180

  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'

  const drawTitle = (center = false) => {
    ctx.font = `600 64px ${font}`
    const accent = slide.titleAccent
    const x = center ? width / 2 : pad
    if (!accent) {
      ctx.textAlign = center ? 'center' : 'left'
      ctx.fillStyle = '#ffffff'
      wrap(ctx, slide.title, maxW).forEach((line) => {
        ctx.fillText(line, x, y)
        y += 76
      })
      ctx.textAlign = 'left'
      return
    }
    ctx.textAlign = 'left'
    const gap = ' '
    const titleW = ctx.measureText(slide.title + gap).width
    const accentW = ctx.measureText(accent).width
    const start = center ? (width - titleW - accentW) / 2 : pad
    ctx.fillStyle = '#ffffff'
    ctx.fillText(slide.title + gap, start, y)
    ctx.fillStyle = STORY_ACCENT
    ctx.fillText(accent, start + titleW, y)
    y += 76
  }

  if (slide.layout === 'accuracy') {
    drawTitle()
    if (slide.subtitle) {
      ctx.font = `400 32px ${font}`
      ctx.fillStyle = 'rgba(255,255,255,0.8)'
      wrap(ctx, slide.subtitle, maxW).forEach((line) => {
        ctx.fillText(line, pad, y)
        y += 42
      })
    }
    y += 36
    ctx.fillStyle = 'rgba(255,255,255,0.08)'
    fillRoundRect(ctx, pad, y, maxW, 420, 28)
    let barY = y + 48
    ;(slide.bars ?? []).forEach((bar) => {
      ctx.font = `600 28px ${font}`
      ctx.fillStyle = '#ffffff'
      ctx.fillText(bar.label, pad + 36, barY)
      barY += 44
      ctx.fillStyle = 'rgba(255,255,255,0.12)'
      fillRoundRect(ctx, pad + 36, barY, maxW - 72, 22, 11)
      ctx.fillStyle = bar.highlight ? STORY_ACCENT : STORY_ACCENT_SOFT
      fillRoundRect(ctx, pad + 36, barY, (maxW - 72) * (bar.pct / 100), 22, 11)
      barY += 70
    })
    y += 460
    if (slide.callout) {
      ctx.fillStyle = '#ffffff'
      fillRoundRect(ctx, pad, y, maxW, 160, 80)
      ctx.fillStyle = '#18181b'
      ctx.font = `600 30px ${font}`
      ctx.textAlign = 'center'
      wrap(ctx, slide.callout, maxW - 80).forEach((line) => {
        ctx.fillText(line, width / 2, y + 44)
        y += 40
      })
      ctx.textAlign = 'left'
      y += 140
    }
    if (slide.footer) {
      ctx.font = `400 28px ${font}`
      ctx.fillStyle = 'rgba(255,255,255,0.7)'
      ctx.textAlign = 'center'
      wrap(ctx, slide.footer, maxW).forEach((line) => {
        ctx.fillText(line, width / 2, y)
        y += 38
      })
    }
    return
  }

  if (slide.layout === 'news') {
    ctx.textAlign = 'center'
    drawTitle(true)
    if (slide.subtitle) {
      ctx.font = `400 34px ${font}`
      ctx.fillStyle = 'rgba(255,255,255,0.85)'
      ctx.fillText(slide.subtitle, width / 2, y)
      y += 70
    }
    const macros = slide.macros
    if (macros) {
      const items = [
        { label: 'Protein', value: macros.protein, color: '#FF6B6B' },
        { label: 'Carbs', value: macros.carbs, color: '#FFB020' },
        { label: 'Fat', value: macros.fat, color: STORY_ACCENT_SOFT },
      ]
      const box = 200
      const gap = 36
      const startX = (width - (box * 3 + gap * 2)) / 2
      items.forEach((item, i) => {
        const x = startX + i * (box + gap)
        ctx.fillStyle = 'rgba(255,255,255,0.1)'
        fillRoundRect(ctx, x, y, box, box, 28)
        ctx.fillStyle = item.color
        ctx.font = `600 40px ${font}`
        ctx.fillText(item.value, x + box / 2, y + 62)
        ctx.fillStyle = 'rgba(255,255,255,0.7)'
        ctx.font = `400 24px ${font}`
        ctx.fillText(item.label, x + box / 2, y + 122)
      })
      y += 260
    }
    ctx.textAlign = 'left'
    ctx.font = `400 34px ${font}`
    ctx.fillStyle = 'rgba(255,255,255,0.9)'
    slide.blocks.forEach((block) => {
      wrap(ctx, block, maxW).forEach((line) => {
        ctx.fillText(line, pad, y)
        y += 44
      })
      y += 28
    })
    return
  }

  if (slide.layout === 'how') {
    drawTitle(true)
    y += 20
    ctx.textAlign = 'left'
    ;(slide.steps ?? []).forEach((step, index) => {
      ctx.fillStyle = index % 2 === 0 ? STORY_ACCENT : STORY_ACCENT_SOFT
      ctx.beginPath()
      ctx.arc(pad + 10, y + 16, 10, 0, Math.PI * 2)
      ctx.fill()
      ctx.font = `600 28px ${font}`
      ctx.fillStyle = STORY_ACCENT
      ctx.fillText(step.kicker, pad + 44, y)
      y += 40
      ctx.font = `400 30px ${font}`
      ctx.fillStyle = 'rgba(255,255,255,0.9)'
      wrap(ctx, step.text, maxW - 44).forEach((line) => {
        ctx.fillText(line, pad + 44, y)
        y += 40
      })
      y += 28
    })
    return
  }

  if (slide.layout === 'impact') {
    drawTitle(true)
    y += 20
    const cardW = (maxW - 28) / 2
    const cardH = 280
    if (slide.leftCard) {
      ctx.fillStyle = 'rgba(255,255,255,0.1)'
      fillRoundRect(ctx, pad, y, cardW, cardH, 28)
      ctx.textAlign = 'center'
      ctx.fillStyle = 'rgba(255,255,255,0.7)'
      ctx.font = `600 24px ${font}`
      ctx.fillText(slide.leftCard.kicker, pad + cardW / 2, y + 36)
      ctx.fillStyle = '#ffffff'
      ctx.font = `600 48px ${font}`
      ctx.fillText(slide.leftCard.value, pad + cardW / 2, y + 100)
      ctx.fillStyle = 'rgba(255,255,255,0.75)'
      ctx.font = `400 24px ${font}`
      wrap(ctx, slide.leftCard.sub, cardW - 40).forEach((line, i) => {
        ctx.fillText(line, pad + cardW / 2, y + 170 + i * 32)
      })
    }
    if (slide.rightCard) {
      const x = pad + cardW + 28
      ctx.fillStyle = '#ffffff'
      fillRoundRect(ctx, x, y, cardW, cardH, 28)
      ctx.fillStyle = '#71717a'
      ctx.font = `600 24px ${font}`
      ctx.fillText(slide.rightCard.kicker, x + cardW / 2, y + 36)
      ctx.fillStyle = '#18181b'
      ctx.font = `600 48px ${font}`
      ctx.fillText(slide.rightCard.value, x + cardW / 2, y + 100)
      ctx.fillStyle = '#52525b'
      ctx.font = `400 24px ${font}`
      wrap(ctx, slide.rightCard.sub, cardW - 40).forEach((line, i) => {
        ctx.fillText(line, x + cardW / 2, y + 170 + i * 32)
      })
    }
    y += cardH + 64
    ctx.textAlign = 'left'
    ctx.font = `400 32px ${font}`
    ctx.fillStyle = 'rgba(255,255,255,0.9)'
    ;(slide.bullets ?? []).forEach((bullet) => {
      wrap(ctx, `· ${bullet}`, maxW).forEach((line) => {
        ctx.fillText(line, pad, y)
        y += 42
      })
      y += 12
    })
    if (slide.cta) {
      y += 24
      ctx.fillStyle = '#ffffff'
      fillRoundRect(ctx, pad, y, maxW, 88, 44)
      ctx.fillStyle = '#18181b'
      ctx.font = `600 32px ${font}`
      ctx.textAlign = 'center'
      ctx.fillText(slide.cta, width / 2, y + 26)
    }
  }
}
