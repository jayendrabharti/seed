import Header from '@/components/main/Header';
import Navbar from '@/components/main/NavBar';
import { ReactNode } from 'react';
import { DataProvider } from '@/providers/DataProvider';
import { BusinessProvider } from '@/providers/BusinessProvider';
import AuthGuard from '@/auth/AuthGuard';

/**
 * Main Application Layout
 *
 * Layout for authenticated users accessing the main application features.
 * Provides the core application structure with:
 * - Business context for multi-tenant operations
 * - Data provider for UI state management
 * - Responsive sidebar navigation
 * - Top header with user controls
 * - Main content area with scrolling
 */

export default async function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AuthGuard>
      <main className="bg-background text-foreground min-h-screen w-full">
        <DataProvider>
          <BusinessProvider>
            <div className="flex min-h-screen w-full">
              {/* Sidebar: fixed width, always visible, no overlap */}
              <div className="sticky top-0 z-30 h-screen shrink-0">
                <Navbar />
              </div>
              {/* Main content: flex column, header sticky, content scrollable */}
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="bg-background sticky top-0 z-20">
                  <Header />
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
              </div>
            </div>
          </BusinessProvider>
        </DataProvider>
      </main>
    </AuthGuard>
  );
}
