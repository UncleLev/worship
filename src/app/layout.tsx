import '@/shared/styles/global.scss'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Meta } from './meta'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Worship',
  description: '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Meta/>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
