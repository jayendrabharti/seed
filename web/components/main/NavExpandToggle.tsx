import { GoSidebarExpand } from 'react-icons/go';
import { GoSidebarCollapse } from 'react-icons/go';
import { useData } from '@/providers/DataProvider';
import { Button } from '../ui/button';

export default function NavExpandToggle({ className }: { className?: string }) {
  const { expanded, setExpanded } = useData();

  return (
    <Button
      variant={'ghost'}
      size={'icon'}
      onClick={() => setExpanded((prev) => !prev)}
      className={className}
    >
      {expanded ? <GoSidebarExpand /> : <GoSidebarCollapse />}
    </Button>
  );
}
