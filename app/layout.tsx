import type { Metadata } from 'next';
import './globals.css';
import Script from 'next/script';
import ToastProvider from './components/ToastProvider';
import { AuthProvider } from './lib/auth-context';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://ypstrategicresearch.com'),
  title: 'Y.P Strategic Research | Defence-Tech Intelligence Platform',
  description: 'Real-time defence & deep-tech intelligence. AI-curated signal. Public proxy mapping for private companies. Crypto, futures, macro intelligence.',
  keywords: 'defence tech, intelligence, Palantir, Lockheed Martin, RTX, crypto, Bitcoin, futures, NQ, ES, Federal Reserve, geopolitical risk',
  openGraph: {
    title: 'Y.P Strategic Research | Defence-Tech Intelligence Platform',
    description: 'Where Capital Flows, Before The Market Knows',
    type: 'website',
    siteName: 'Y.P Strategic Research',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Y.P Strategic Research',
    description: 'Defence-Tech Intelligence Platform',
  },
  robots: { index: true, follow: true },
  other: {
    'google-adsense-account': 'ca-pub-8574202486932134',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#020304" />
        {adsenseId && adsenseId !== 'ca-pub-XXXXXXXXXXXXXXXX' && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body>
        <AuthProvider>
          <div className="noise" />
          <div className="scanline-global" />
          {children}
          <ToastProvider />
        </AuthProvider>
      </body>
    </html>
  );
}
