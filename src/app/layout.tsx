import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Genesis | Freshers Welcome Party',
  description: 'Join us for an afternoon of fun, food, and freshers activities.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
