import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Check } from 'lucide-react';
import Reveal from '../animations/Reveal';

export function Pricing() {
  const plans = [
    {
      name: 'Starter',
      price: '49',
      description: 'Perfect for small businesses just getting started',
      features: [
        'Single location',
        'Up to 5 users',
        'Basic POS system',
        'Inventory tracking',
        'Email support',
        'Mobile app access',
      ],
      cta: 'Start Free Trial',
      popular: false,
    },
    {
      name: 'Professional',
      price: '149',
      description: 'For growing businesses that need more power',
      features: [
        'Up to 3 locations',
        'Unlimited users',
        'Advanced POS & analytics',
        'Inventory + accounting',
        'Priority support',
        'API access',
        'Custom reports',
        'Team management',
      ],
      cta: 'Start Free Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large organizations with complex needs',
      features: [
        'Unlimited locations',
        'Unlimited users',
        'Full platform access',
        'Dedicated account manager',
        '24/7 phone support',
        'Custom integrations',
        'Advanced security',
        'SLA guarantee',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal type="bottomUp">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
              Simple, transparent pricing
            </h2>
            <p className="text-muted-foreground text-lg text-balance">
              Choose the plan that fits your business. All plans include a
              14-day free trial.
            </p>
          </div>
        </Reveal>

        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-3 lg:items-start lg:gap-8">
          {plans.map((plan, index) => (
            <Reveal key={plan.name} type="bottomUp" delay={index * 0.15}>
              <Card
                className={`relative flex h-full flex-col ${plan.popular ? 'border-primary border-2 shadow-xl' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 right-0 left-0 mx-auto w-fit">
                    <div className="bg-primary text-primary-foreground rounded-full px-4 py-1.5 text-xs font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-base">
                    {plan.description}
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    {plan.price !== 'Custom' && (
                      <span className="text-muted-foreground">/month</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
