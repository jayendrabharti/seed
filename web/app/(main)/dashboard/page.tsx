'use client';
import { useBusiness } from '@/providers/BusinessProvider';

export default function DashboardPage() {
  const { currentBusiness } = useBusiness();
  return <div>{currentBusiness?.name ?? 'No Business Selected'}</div>;
}
