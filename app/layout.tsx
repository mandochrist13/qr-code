import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Cartes Professionnelles FEG',
  description: 'Gérez les cartes professionnelles de vos employés avec QR codes et vCards',
  generator: 'Christ-of-fair MANDO',
  icons: {
    icon: [
      {
        url: '/logo-feg-32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/logo-feg-32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/logo-feg-32.png',
        type: 'image/svg+xml',
      },
    ],
    apple: '/logo FEG revectoriser.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className="bg-background">
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
