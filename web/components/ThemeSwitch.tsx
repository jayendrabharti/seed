'use client';
import { useTheme } from 'next-themes';
import { ChevronDownIcon, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from './ui/button-group';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { themePresets } from '@/utils/themes';
import { useThemePreset } from '@/providers/ThemeProvider';

interface ThemeSwitchProps {
  className?: string;
}

export default function ThemeSwitch({ className }: ThemeSwitchProps) {
  const { theme, setTheme } = useTheme();
  const { themePreset, changeThemePreset } = useThemePreset();

  const switchTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    e.stopPropagation();
  };

  const isDark = theme === 'dark';

  return (
    <ButtonGroup>
      <Button
        variant={'outline'}
        size={'icon'}
        onClick={switchTheme}
        className={cn('relative rounded-full', className)}
      >
        <Moon
          className={`absolute scale-0 rotate-180 transition-all duration-400 dark:scale-125 dark:rotate-0`}
        />
        <Sun
          className={`absolute scale-125 rotate-0 transition-all duration-400 dark:scale-0 dark:-rotate-180`}
        />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={'outline'}
            size={'icon'}
            className={cn('rounded-full')}
          >
            <ChevronDownIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="flex min-w-[200px] flex-col gap-2 p-2">
          {themePresets.map((preset) => {
            const colors = isDark ? preset.colors.dark : preset.colors.light;
            return (
              <Button
                key={preset.code}
                variant={themePreset === preset.code ? 'default' : 'outline'}
                onClick={() => changeThemePreset(preset.code)}
                className={cn(
                  'h-auto w-full justify-between gap-3 py-2.5',
                  preset.code,
                )}
              >
                <span>{preset.title}</span>
                <div className="flex items-center gap-1.5">
                  <div
                    className="border-border/50 h-4 w-4 rounded-full border"
                    style={{ backgroundColor: colors.primary }}
                  />
                  <div
                    className="border-border/50 h-4 w-4 rounded-full border"
                    style={{ backgroundColor: colors.secondary }}
                  />
                  <div
                    className="border-border/50 h-4 w-4 rounded-full border"
                    style={{ backgroundColor: colors.accent }}
                  />
                </div>
              </Button>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}
