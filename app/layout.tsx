import type { Metadata } from 'next'
import './globals.css'
import { SolanaWalletProvider } from '@/components/WalletProvider'
import SmoothScroll from '@/components/SmoothScroll'
import { Navbar } from '@/components/Navbar'
import { ThemeProvider } from '@/contexts/ThemeContext'

export const metadata: Metadata = {
  title: 'Collective Intelligence | Enterprise Prediction Markets',
  description: 'Harness your team\'s wisdom through on-chain prediction markets. Real stakes. Real transparency. Real results.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <SolanaWalletProvider>
            <SmoothScroll>
              <Navbar />
              {children}
            </SmoothScroll>
          </SolanaWalletProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
