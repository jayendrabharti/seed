import { Spinner } from '@/components/ui/spinner';

export default function Loading() {
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center gap-4">
      <Spinner />
    </div>
  );
}
