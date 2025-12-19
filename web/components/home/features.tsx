import {
  BarChart3,
  Package,
  DollarSign,
  TrendingUp,
  Users,
  Shield,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Reveal from '../animations/Reveal';

export function Features() {
  const features = [
    {
      icon: BarChart3,
      title: 'Point of Sale',
      description:
        'Lightning-fast checkout with support for multiple payment methods, offline mode, and real-time inventory updates.',
    },
    {
      icon: Package,
      title: 'Inventory Management',
      description:
        'Track stock levels, automate reordering, manage suppliers, and get alerts when inventory runs low.',
    },
    {
      icon: DollarSign,
      title: 'Accounting & Finance',
      description:
        'Automated bookkeeping, invoicing, expense tracking, and financial reports that keep you compliant.',
    },
    {
      icon: TrendingUp,
      title: 'Business Analytics',
      description:
        'Real-time dashboards with sales trends, performance metrics, and actionable insights to grow your business.',
    },
    {
      icon: Users,
      title: 'Team Management',
      description:
        'Role-based access controls, employee time tracking, and performance monitoring for your entire team.',
    },
    {
      icon: Shield,
      title: 'Security & Compliance',
      description:
        'Bank-level encryption, PCI compliance, automated backups, and audit trails for complete peace of mind.',
    },
  ];

  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal type="bottomUp">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
              Everything you need to manage your business
            </h2>
            <p className="text-muted-foreground text-lg text-balance">
              SEED brings together all your business operations into one
              seamless platform. No more juggling multiple tools.
            </p>
          </div>
        </Reveal>

        <div className="mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Reveal key={feature.title} type="bottomUp" delay={index * 0.1}>
                <Card className="h-full border-2">
                  <CardHeader>
                    <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                      <Icon className="text-primary h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
