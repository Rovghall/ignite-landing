'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

export type InternalAdminPage = 'product' | 'referrals' | 'creators' | 'bots' | 'abusers'

const LINKS: { id: InternalAdminPage; href: string; label: string }[] = [
  { id: 'product', href: '/internal/product-ignite', label: 'Produto' },
  { id: 'referrals', href: '/internal/rc-payouts-ignite', label: 'Referrals' },
  { id: 'creators', href: '/internal/creator-program-ignite', label: 'Creators' },
  { id: 'bots', href: '/internal/bot-watch-ignite', label: 'Bots' },
  { id: 'abusers', href: '/internal/abusers-ignite', label: 'Abusers' },
]

export function InternalAdminNav({
  active,
  className,
}: {
  active: InternalAdminPage
  className?: string
}) {
  return (
    <nav
      className={cn('flex flex-wrap gap-1.5', className)}
      aria-label="Navegação admin interno"
    >
      {LINKS.map((link) => (
        <Link
          key={link.id}
          href={link.href}
          className={cn(
            'rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors',
            active === link.id
              ? 'border-foreground bg-foreground text-background'
              : 'border-border bg-card text-foreground/80 hover:border-foreground/30 hover:text-foreground',
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
