import { Inter } from 'next/font/google';
import { Provider } from '@/components/provider';
import type { Metadata } from 'next';
import './global.css';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://docs.orqo.site'),
  title: { default: 'ORQO API', template: '%s' },
  description: 'Developer documentation for the ORQO REST API.',
  icons: {
    icon: [{ url: '/brand/orqo-icon-32.png', sizes: '32x32', type: 'image/png' }],
    apple: [{ url: '/brand/orqo-icon-180.png', sizes: '180x180', type: 'image/png' }],
  },
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
