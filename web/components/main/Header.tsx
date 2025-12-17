'use client';
import { cn } from '@/lib/utils';
import UserButton from '../auth/UserButton';
import ThemeSwitch from '../ThemeSwitch';
import { Separator } from '../ui/separator';
import NavExpandToggle from './NavExpandToggle';
import BreadCrumb from './BreadCrumb';
import Notifications from './Notifications';
import Logo from '../Logo';
export default function Header() {
  return (
    <header
      className={cn(
        'bg-sidebar flex flex-row items-center space-x-3 border-b p-3',
      )}
    >
      <NavExpandToggle />

      <Separator orientation={'vertical'} />

      <BreadCrumb />

      <Logo className="mx-auto" />

      <Notifications className="ml-auto" />

      <ThemeSwitch />

      <UserButton />
    </header>
  );
}
