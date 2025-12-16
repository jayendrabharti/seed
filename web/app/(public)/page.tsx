import UserButton from '@/components/auth/UserButton';

export default async function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <UserButton />
    </div>
  );
}
