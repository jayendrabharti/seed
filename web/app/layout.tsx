import './globals.css';
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/sonner';
import SessionProvider from '@/providers/SessionProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { TRPCProvider } from '@/providers/TRPCProvider';
import { cn } from '@/lib/utils';
import ScrollToTop from '@/components/ScrollToTop';

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
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className={cn(`bg-background antialiased`, 'min-h-screen w-full')}>
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
