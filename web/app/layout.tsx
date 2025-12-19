import './globals.css';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import SessionProvider from '@/providers/SessionProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { TRPCProvider } from '@/providers/TRPCProvider';
import { cn } from '@/lib/utils';
import ScrollToTop from '@/components/ScrollToTop';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SEED',
  description: 'All-in-One Business Management Solution',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          `${geistSans.variable} ${geistMono.variable} bg-background antialiased`,
          'min-h-dvh w-full',
        )}
      >
        <ThemeProvider>
          <TRPCProvider>
            <SessionProvider>
              {children}
              <Toaster richColors />
              <ScrollToTop />
            </SessionProvider>
          </TRPCProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
