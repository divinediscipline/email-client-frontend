import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { EmailViewProvider } from '@/contexts/EmailViewContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Email Client',
  description: 'A modern email client built with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <EmailViewProvider>
            {children}
          </EmailViewProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
