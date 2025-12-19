import Reveal from '@/components/animations/Reveal';

export function SocialProof() {
  const stats = [
    { value: '50K+', label: 'Active Businesses', company: 'Growing daily' },
    { value: '99.9%', label: 'Uptime', company: 'Always available' },
    { value: '4.9/5', label: 'Customer Rating', company: 'Highly rated' },
    { value: '$2B+', label: 'Processed', company: 'Transactions handled' },
  ];

  return (
    <section id="social-proof" className="bg-muted/30 border-b">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} type="bottomUp" delay={index * 0.1}>
              <div className="flex flex-col items-center text-center">
                <div className="mb-1 text-3xl font-bold lg:text-4xl">
                  {stat.value}
                </div>
                <div className="text-foreground text-sm font-medium">
                  {stat.label}
                </div>
                <div className="text-muted-foreground mt-1 text-xs">
                  {stat.company}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
