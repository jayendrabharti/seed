import { Navigation } from '@/components/home/navigation';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background min-h-screen">
      <Navigation />
      {children}
    </div>
  );
}
