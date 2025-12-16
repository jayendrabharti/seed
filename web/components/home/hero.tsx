import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b">
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-24 text-center sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="bg-muted/50 mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
          <span className="text-muted-foreground">
            Now available — Start your free trial
          </span>
        </div>

        <h1 className="mb-6 max-w-5xl text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-7xl">
          The complete platform to run your business
        </h1>

        <p className="text-muted-foreground mb-10 max-w-2xl text-lg text-balance sm:text-xl">
          Streamline operations with POS, inventory management, accounting, and
          business analytics — all in one powerful platform built for modern
          businesses.
        </p>

        <div className="mx-auto flex w-full max-w-md flex-col items-center justify-center gap-4 sm:w-auto sm:max-w-none sm:flex-row">
          <Button size="lg" className="w-full px-8 text-base sm:w-auto">
            Get Started Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full px-8 text-base sm:w-auto"
          >
            Watch Demo
          </Button>
        </div>

        <p className="text-muted-foreground mt-6 text-sm">
          No credit card required • 14-day free trial • Cancel anytime
        </p>
      </div>
    </section>
  );
}
