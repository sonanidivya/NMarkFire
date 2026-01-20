import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css'; // Relative path since we are in (website)
import { cn } from '@/lib/utils';
import { Footer } from '@/components/layout/Footer';


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://nmarkfire.com'),
  title: {
    default: 'NMarkFire - Advanced Fire Safety Solutions',
    template: '%s | NMarkFire'
  },
  description: 'Leading provider of ISI/ISO certified fire extinguishers, suppression systems, and safety equipment. Protecting lives with precision engineering.',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://nmarkfire.com',
    siteName: 'NMarkFire',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NMarkFire Safety Solutions',
      }
    ]
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={cn(inter.className, "antialiased min-h-screen flex flex-col")}>
      <div className="flex-1">
        {children}
      </div>
      <Footer />

    </div>
  );
}
