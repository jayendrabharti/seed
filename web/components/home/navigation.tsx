import Link from 'next/link';
import ThemeSwitch from '../ThemeSwitch';
import UserButton from '../auth/UserButton';

export function Navigation() {
  return (
    <header className="border-border/40 bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg font-bold">
              S
            </div>
            <span className="text-xl font-bold">SEED</span>
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="#features"
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              Features
            </Link>
            <Link
              href="#benefits"
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              Benefits
            </Link>
            <Link
              href="#pricing"
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              Pricing
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeSwitch />
          <UserButton />
        </div>
      </nav>
    </header>
  );
}
