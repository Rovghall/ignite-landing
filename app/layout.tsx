import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Inter, Syne } from 'next/font/google'
import { GoogleAnalytics } from '@/components/google-analytics'
import './globals.css'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700', '800'],
})

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['500', '600', '700', '800'],
  adjustFontFallback: false,
})

export const metadata: Metadata = {
  metadataBase: new URL('https://ignitehub.app'),
  icons: {
    icon: [{ url: '/favicon.png', type: 'image/png' }],
    apple: '/favicon.png',
    shortcut: '/favicon.png',
  },
  other: {
    'color-scheme': 'light only',
    'supported-color-schemes': 'light',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light',
  themeColor: '#FFFFFF',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`light bg-background ${geist.variable} ${inter.variable} ${syne.variable}`}
      style={{ colorScheme: 'only light', backgroundColor: '#ffffff' }}
      suppressHydrationWarning
    >
      <body
        className="bg-background font-sans text-foreground antialiased"
        style={{ colorScheme: 'only light', backgroundColor: '#ffffff' }}
      >
        {children}
        <GoogleAnalytics />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
