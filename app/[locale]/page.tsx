import dynamic from 'next/dynamic'
import { SiteNav } from '@/components/site-nav'
import { Hero } from '@/components/hero'
import { HowItWorks } from '@/components/how-it-works'
import { SiteFooter } from '@/components/site-footer'

const FeatureRows = dynamic(
  () => import('@/components/feature-rows').then((m) => m.FeatureRows),
  { ssr: true },
)
const ThemeShowcase = dynamic(
  () => import('@/components/theme-showcase').then((m) => m.ThemeShowcase),
  { ssr: true },
)
const SocialProof = dynamic(
  () => import('@/components/social-proof').then((m) => m.SocialProof),
  { ssr: true },
)
const FinalCta = dynamic(
  () => import('@/components/final-cta').then((m) => m.FinalCta),
  { ssr: true },
)

export default function Page() {
  return (
    <>
      <SiteNav />
      <main className="overflow-x-clip">
        <Hero />
        <HowItWorks />
        <FeatureRows />
        <ThemeShowcase />
        <SocialProof />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  )
}
