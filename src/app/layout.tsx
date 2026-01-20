import type { Metadata } from 'next';

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
      </body>
    </html>
  );
}
