import { LanguageProvider } from '@/lib/i18n/provider'
import { resolveInvitePageLocale } from '@/lib/invite-page-locale'

export default async function CommunityInviteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await resolveInvitePageLocale()
  return <LanguageProvider locale={locale}>{children}</LanguageProvider>
}
