'use client';
import RevealHero from '@/components/animations/RevealHero';
import PageTitle from '@/components/main/PageTitle';
import { Separator } from '@/components/ui/separator';
import { useBusiness } from '@/providers/BusinessProvider';

export default function DashboardPage() {
  const { currentBusinessMembership } = useBusiness();
  return (
    <>
      <div className="flex flex-row items-center justify-between px-3">
        <PageTitle />
      </div>
      <Separator />
      <div>
        {currentBusinessMembership?.business.name ?? 'No Business Selected'}
      </div>
    </>
  );
}
