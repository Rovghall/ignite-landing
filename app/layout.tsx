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
  generator: 'v0.app',
  metadataBase: new URL('https://ignitehub.app'),
  openGraph: {
    title: 'IGNITE AI: Built to make progress look easy.',
    description:
      'Snap it. Log it. Crush it. AI meal logging, macros, workouts, and social progress sharing.',
    url: 'https://ignitehub.app',
    siteName: 'IGNITE AI',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#FFFFFF',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`light bg-background ${geist.variable} ${inter.variable} ${syne.variable}`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
