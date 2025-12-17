import { Hero } from '@/components/home/hero';
import { Features } from '@/components/home/features';
import { Benefits } from '@/components/home/benefits';
import { SocialProof } from '@/components/home/social-proof';
import { Pricing } from '@/components/home/pricing';
import { CTA } from '@/components/home/cta';
import { Footer } from '@/components/home/footer';

export default function Page() {
  return (
    <>
      <Hero />
      <SocialProof />
      <Features />
      <Benefits />
      <Pricing />
      <CTA />
      <Footer />
    </>
  );
}
