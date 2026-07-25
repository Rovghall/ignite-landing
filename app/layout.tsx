import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Inter, Syne } from 'next/font/google'
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
  // Avoid size-adjusted fallback metrics that clip Syne descenders (g, y, p).
  adjustFontFallback: false,
})

export const metadata: Metadata = {
  title: 'IGNITE AI: Built to make progress look easy.',
  description:
    'Snap a photo of your meal, get calories and macros instantly, track workouts, and share progress with friends. Free to start on iOS and Android.',
  metadataBase: new URL('https://ignitehub.app'),
  openGraph: {
    title: 'IGNITE AI: Built to make progress look easy.',
    description:
      'Snap it. Log it. Crush it. AI meal logging, macros, workouts, and social progress sharing.',
    url: 'https://ignitehub.app',
    siteName: 'IGNITE AI',
  },
  icons: {
    icon: [{ url: '/favicon.png', type: 'image/png' }],
    apple: '/favicon.png',
    shortcut: '/favicon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#FFFFFF' },
  ],
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
      style={{ colorScheme: 'light only' }}
      suppressHydrationWarning
    >
      <body className="bg-background font-sans text-foreground antialiased" style={{ colorScheme: 'light only' }}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
