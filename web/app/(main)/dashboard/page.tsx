'use client';
import { useBusiness } from '@/providers/BusinessProvider';

export default function DashboardPage() {
  const { currentBusinessMembership } = useBusiness();
  return (
    <div>
      {currentBusinessMembership?.business.name ?? 'No Business Selected'}
    </div>
  );
}
