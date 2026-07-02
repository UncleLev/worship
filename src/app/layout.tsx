import '@/shared/styles/global.scss';
import type { Metadata, Viewport } from 'next';
import { Montserrat } from 'next/font/google';

const inter = Montserrat({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Worship',
    template: '%s | Worship',
  },
  description: 'Міні пісеник',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#121212' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ua">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
