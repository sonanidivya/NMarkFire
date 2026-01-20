import type { Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  title: 'NMarkFire Admin',
  description: 'NMarkFire Admin and Studio',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
          {children}
          <SpeedInsights />
      </body>
    </html>
  );
}
