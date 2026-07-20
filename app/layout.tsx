import type { Metadata } from 'next';
import Script from 'next/script';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import FloatingElements from '@/components/layout/FloatingElements';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://gajendramandal.in'),
  title: {
    default: 'Gajendra Mandal | AI Researcher & ML Engineer',
    template: '%s | Gajendra Mandal',
  },
  description:
    'Portfolio of Gajendra Mandal - AI Researcher and ML Engineer specializing in Computer Vision, NLP, and Deep Learning. B.Tech Data Science, CSVTU.',
  keywords: [
    'Gajendra Mandal',
    'AI Researcher',
    'ML Engineer',
    'Computer Vision',
    'NLP',
    'Deep Learning',
    'IIT Gandhinagar',
    'CSVTU',
    'Data Science',
    'Portfolio',
  ],
  authors: [{ name: 'Gajendra Mandal', url: 'https://gajendramandal.in' }],
  creator: 'Gajendra Mandal',
  openGraph: {
    title: 'Gajendra Mandal | AI Researcher & ML Engineer',
    description:
      'AI Researcher & ML Engineer specializing in Computer Vision, NLP, and Deep Learning.',
    url: 'https://gajendramandal.in',
    siteName: 'Gajendra Mandal Portfolio',
    type: 'website',
    locale: 'en_IN',
    images: [
      {
        url: '/images/profile_photo.jpg',
        width: 800,
        height: 800,
        alt: 'Gajendra Mandal - AI Researcher & ML Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gajendra Mandal | AI Researcher & ML Engineer',
    description:
      'AI Researcher & ML Engineer specializing in Computer Vision, NLP, and Deep Learning.',
    images: ['/images/profile_photo.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://gajendramandal.in',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-FGDL23N1C1"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FGDL23N1C1');
          `}
        </Script>

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Gajendra Mandal',
              url: 'https://gajendramandal.in',
              jobTitle: 'AI/ML Engineer',
              description:
                'AI Researcher & ML Engineer specializing in Computer Vision, NLP, and Deep Learning.',
              alumniOf: {
                '@type': 'CollegeOrUniversity',
                name: 'CSVTU Bhilai',
              },
              knowsAbout: [
                'Machine Learning',
                'Computer Vision',
                'Deep Learning',
                'NLP',
                'Python',
                'PyTorch',
              ],
              sameAs: [
                'https://linkedin.com/in/gajendra-mandal',
                'https://github.com/gajendramandal',
              ],
              image: 'https://gajendramandal.in/images/profile_photo.jpg',
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-[#030014] text-white">
        <FloatingElements />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
