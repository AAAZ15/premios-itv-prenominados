import type { Metadata, Viewport } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StageBackdrop from '@/components/StageBackdrop';
import MobileTabBar, { MobileTabBarSpacer } from '@/components/MobileTabBar';
import SmoothAnchors from '@/components/SmoothAnchors';
import { SITE } from '@/data/config';
import '@/styles/globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-montserrat',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `Prenominados | ${SITE.name} ${SITE.edition}`,
    template: `%s | ${SITE.name} ${SITE.edition}`,
  },
  description: SITE.description,
  applicationName: `${SITE.name} ${SITE.edition}`,
  keywords: [
    'Premios ITV',
    'Premios ITV 30 años',
    'prenominados',
    'nominados',
    'televisión Ecuador',
    'categorías',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: SITE.locale,
    siteName: `${SITE.name} ${SITE.edition}`,
    title: `Prenominados | ${SITE.name} ${SITE.edition}`,
    description: SITE.description,
    url: SITE.url,
  },
  twitter: {
    card: 'summary_large_image',
    title: `Prenominados | ${SITE.name} ${SITE.edition}`,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#02040a',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${montserrat.variable} ${inter.variable}`}>
      <body
        style={
          {
            '--font-display': 'var(--font-montserrat), Montserrat, sans-serif',
            '--font-body': 'var(--font-inter), Inter, sans-serif',
          } as React.CSSProperties
        }
      >
        <a className="skip-link" href="#contenido">
          Saltar al contenido
        </a>
        <SmoothAnchors />
        <StageBackdrop />
        <Header />
        <main id="contenido">{children}</main>
        <Footer />
        <MobileTabBarSpacer />
        <MobileTabBar />
      </body>
    </html>
  );
}
