export const metadata = {
  title: 'NMarkFire Sanity Studio',
  description: 'Backend management for NMarkFire website',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
