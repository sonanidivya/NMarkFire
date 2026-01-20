
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fire Safety Services & Audits | NMarkFire',
  description: 'Certified maintenance, refilling, and safety audits for fire protection systems. ISO 9001 certified service team available 24/7.',
  openGraph: {
    title: 'Fire Safety Services & Audits | NMarkFire',
    description: 'Certified maintenance, refilling, and safety audits for fire protection systems. ISO 9001 certified service team available 24/7.',
    url: 'https://nmarkfire.com/services',
  }
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
