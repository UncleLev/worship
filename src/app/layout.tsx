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

// Applied before first paint so the page never flashes the wrong theme.
// Mirrors the OS setting live if the user changes it while the tab is open.
const THEME_SCRIPT = `(function () {
  try {
    var root = document.documentElement;
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var apply = function (isDark) {
      if (isDark) {
        root.setAttribute('dark', '');
      } else {
        root.removeAttribute('dark');
      }
    };
    apply(mq.matches);
    mq.addEventListener('change', function (e) { apply(e.matches); });
  } catch (e) {}
})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ua">
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
