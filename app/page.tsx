import { SiteNav } from '@/components/site-nav'
import { Hero } from '@/components/hero'
import { HowItWorks } from '@/components/how-it-works'
import { FeatureRows } from '@/components/feature-rows'
import { ThemeShowcase } from '@/components/theme-showcase'
import { SocialProof } from '@/components/social-proof'
import { FinalCta } from '@/components/final-cta'
import { SiteFooter } from '@/components/site-footer'

export default function Page() {
  return (
    <>
      <SiteNav />
      <main>
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
