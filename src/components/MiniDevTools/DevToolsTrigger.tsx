// src/components/MiniDevTools/DevToolsTrigger.tsx
// Mëku Storybook Studio v2.1.0
// Wrench button to open Mini DevTools - toggle with CTRL+Alt+V

import React from 'react';
import { Wrench } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface DevToolsTriggerProps {
  visible: boolean;
  onClick: () => void;
  isDevToolsOpen?: boolean;
}

export const DevToolsTrigger: React.FC<DevToolsTriggerProps> = ({
  visible,
  onClick,
  isDevToolsOpen = false,
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          className={cn(
            'fixed bottom-4 right-4 w-10 h-10 rounded-full',
            'bg-card border border-border shadow-lg',
            'flex items-center justify-center cursor-pointer z-[9999]',
            'transition-all duration-200',
            'hover:bg-primary/10 hover:border-primary/50 hover:scale-105',
            !visible && 'opacity-0 pointer-events-none scale-75'
          )}
          onClick={onClick}
          aria-label="Toggle Mini DevTools"
          aria-expanded={isDevToolsOpen}
        >
          <Wrench 
            className={cn(
              'w-5 h-5 text-muted-foreground transition-transform duration-200',
              isDevToolsOpen && 'rotate-45 text-primary'
            )} 
          />
        </button>
      </TooltipTrigger>
      <TooltipContent side="left" sideOffset={8}>
        <p className="text-xs">
          {isDevToolsOpen ? 'Close' : 'Open'} DevTools
          <span className="ml-2 text-muted-foreground">Ctrl+Alt+V</span>
        </p>
      </TooltipContent>
    </Tooltip>
  );
};
