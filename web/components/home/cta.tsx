import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function CTA() {
  return (
    <section className="bg-primary text-primary-foreground border-y py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Ready to transform your business?
          </h2>
          <p className="text-primary-foreground/90 mb-10 text-lg text-balance">
            Join thousands of businesses using SEED to streamline operations,
            increase efficiency, and drive growth. Start your free trial today.
          </p>
          <div className="mx-auto flex w-full max-w-md flex-col items-center justify-center gap-4 sm:w-auto sm:max-w-none sm:flex-row">
            <Button
              size="lg"
              variant="secondary"
              className="w-full px-8 text-base sm:w-auto"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground w-full bg-transparent px-8 text-base sm:w-auto"
            >
              Schedule a Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
