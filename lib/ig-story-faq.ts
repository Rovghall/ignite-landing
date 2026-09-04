import { faqEn, faqPt } from '@/lib/i18n/messages/faq-content'

type FaqStorySlide = {
  id: string
  title: string
  ready: true
  blocks: string[]
}

function landingFaqToStories(
  categories: typeof faqEn.categories | typeof faqPt.categories,
): FaqStorySlide[] {
  const slides: FaqStorySlide[] = []
  categories.forEach((cat) => {
    if (cat.title === 'App issues' || cat.title === 'Problemas na app') return
    if (cat.title === 'Subscriptions & billing' || cat.title === 'Subscrições e faturação') return
    cat.items.forEach((item, itemIndex) => {
      if (
        (cat.title === 'Apple Health & Health Connect' || cat.title === 'Apple Health e Health Connect') &&
        itemIndex === 2
      ) {
        return
      }
      const blocks = [item.a]
      if ('bullets' in item && item.bullets) blocks.push(...item.bullets)
      if ('links' in item && item.links) {
        blocks.push(...item.links.map((link) => `${link.label}: ${link.href}`))
      }
      slides.push({
        id: `faq-${slides.length + 1}`,
        title: item.q,
        ready: true,
        blocks,
      })
    })
  })
  return slides
}

export const FAQ_STORY_SLIDES: Record<'EN' | 'PT', FaqStorySlide[]> = {
  EN: landingFaqToStories(faqEn.categories),
  PT: landingFaqToStories(faqPt.categories),
}
