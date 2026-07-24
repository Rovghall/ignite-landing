import Link from 'next/link'
import { Wordmark } from '@/components/site-nav'

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of use', href: '/terms' },
]

const companyLinks = [{ label: 'Contact', href: 'mailto:support@ignitehub.app' }]

const socialLinks = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/igniteai-app',
    icon: LinkedInIcon,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/igniteai.app',
    icon: InstagramIcon,
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@igniteai.app',
    icon: TikTokIcon,
  },
]

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M6.5 9.5H4V20h2.5V9.5ZM5.25 4A1.75 1.75 0 1 0 5.25 7.5 1.75 1.75 0 0 0 5.25 4ZM20 20h-2.5v-5.3c0-1.55-.55-2.6-1.95-2.6-1.06 0-1.7.72-1.98 1.42-.1.25-.13.6-.13.95V20H11V9.5h2.4v1.43c.4-.7 1.12-1.7 2.72-1.7 1.98 0 3.88 1.3 3.88 4.1V20Z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="17.5" cy="6.5" r="1.25" fill="currentColor" />
    </svg>
  )
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M14.5 3c.3 2.4 1.7 4.1 4 4.5v2.4c-1.4-.05-2.6-.5-3.6-1.2v6.4c0 3.3-2.6 5.9-5.9 5.9S3.1 18.4 3.1 15.1 5.7 9.2 9 9.2c.4 0 .8 0 1.2.1v2.5c-.4-.15-.8-.2-1.2-.2-1.9 0-3.4 1.5-3.4 3.5S7.1 18.6 9 18.6s3.4-1.5 3.4-3.5V3h2.1Z" />
    </svg>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <Wordmark className="text-lg" />

          <div className="flex flex-wrap gap-12 sm:gap-16">
            <nav aria-label="Legal" className="flex min-w-[9rem] flex-col gap-3">
              <p className="font-brand text-sm font-semibold text-foreground">Legal</p>
              <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="link-ink link-ember transition-colors hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Company" className="flex min-w-[9rem] flex-col gap-3">
              <p className="font-brand text-sm font-semibold text-foreground">Company</p>
              <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="link-ink link-ember transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-border pt-6">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              {'© Copyright '}
              {new Date().getFullYear()}
              {', All rights reserved'}
            </p>
            <nav aria-label="Social" className="flex items-center gap-4">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-foreground transition-opacity hover:opacity-60"
                >
                  <Icon className="size-5" />
                </a>
              ))}
            </nav>
          </div>
          <p className="max-w-2xl text-xs leading-relaxed text-pretty text-muted-foreground">
            IGNITE AI provides general wellness and fitness information only. It is not medical advice. Consult a
            healthcare professional before making changes to your diet or exercise routine.
          </p>
        </div>
      </div>
    </footer>
  )
}
