'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        'bg-primary border-primary-foreground fixed right-6 bottom-6 z-50 rounded-full border p-2 text-white shadow-lg transition-all duration-200 hover:scale-110 sm:right-8 sm:bottom-8',
        isVisible ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
      aria-label="Scroll to top"
    >
      <ArrowUp className="size-6 sm:size-8" />
    </button>
  );
}
