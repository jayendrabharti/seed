import { Clock, Zap, LineChart } from 'lucide-react';
import Reveal from '@/components/animations/Reveal';

export function Benefits() {
  const benefits = [
    {
      icon: Clock,
      stat: '10 hours',
      label: 'saved per week',
      description:
        'Automate repetitive tasks and focus on growing your business instead of managing spreadsheets.',
    },
    {
      icon: Zap,
      stat: '3x faster',
      label: 'checkout process',
      description:
        'Process transactions in seconds with our optimized POS system designed for speed and reliability.',
    },
    {
      icon: LineChart,
      stat: '40% increase',
      label: 'in visibility',
      description:
        'Get real-time insights into your business performance with comprehensive analytics and reporting.',
    },
  ];

  return (
    <section id="benefits" className="bg-muted/30 border-y py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal type="bottomUp">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <div className="bg-background mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm">
              <Zap className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-muted-foreground">Results that matter</span>
            </div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
              Built for efficiency. Designed for growth.
            </h2>
            <p className="text-muted-foreground text-lg text-balance">
              Join thousands of businesses that have transformed their
              operations with SEED. Here's what you can expect.
            </p>
          </div>
        </Reveal>

        <div className="mx-auto grid gap-8 md:grid-cols-3">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Reveal key={benefit.label} type="scaleOut" delay={index * 0.15}>
                <div className="flex flex-col items-center text-center">
                  <div className="bg-primary/10 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl">
                    <Icon className="text-primary h-8 w-8" />
                  </div>
                  <div className="mb-1 text-4xl font-bold">{benefit.stat}</div>
                  <div className="text-muted-foreground mb-4 text-sm font-medium">
                    {benefit.label}
                  </div>
                  <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
