import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://ghostlayer-swart.vercel.app'),
  title: 'Ghostlayer | Business Workflow Intelligence',
  description:
    'Ghostlayer helps businesses uncover workflow friction, broken handoffs, approval bottlenecks, and hidden operational drag before it slows growth and costs revenue.',
  keywords: [
    'workflow intelligence',
    'operations dashboard',
    'business workflow scanner',
    'approval bottlenecks',
    'handoff issues',
    'operational drag',
    'Ghostlayer',
  ],
  openGraph: {
    title: 'Ghostlayer | Business Workflow Intelligence',
    description:
      'Find workflow friction before it slows growth, burns time, and costs revenue.',
    url: 'https://ghostlayer-swart.vercel.app',
    siteName: 'Ghostlayer',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Ghostlayer Business Workflow Intelligence',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ghostlayer | Business Workflow Intelligence',
    description:
      'Find workflow friction before it slows growth, burns time, and costs revenue.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
