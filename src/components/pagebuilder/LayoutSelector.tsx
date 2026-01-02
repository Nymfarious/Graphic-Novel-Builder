// MeKu Storybook Builder - Layout Selector Component
// Grid of layout presets for page design
// Icons MATCH the actual layout that will be applied

import React from 'react';
import { cn } from '@/lib/utils';
import { usePageBuilderStore } from '@/stores/pageBuilderStore';
import type { LayoutPreset, PageOrientation } from '@/types/pageBuilder';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface LayoutSelectorProps {
  className?: string;
}

// Layout icons as simple div representations
const LayoutIcon: React.FC<{ layout: LayoutPreset; isPortrait: boolean }> = ({ layout, isPortrait }) => {
  const baseClass = 'bg-white border border-gray-300';
  const containerClass = cn(
    'relative overflow-hidden rounded-sm',
    isPortrait ? 'w-8 h-10' : 'w-10 h-8'
  );

  const layoutConfigs: Record<LayoutPreset, React.ReactNode> = {
    'full': (
      <div className={cn(containerClass, baseClass)} />
    ),
    'half-h': (
      <div className={containerClass}>
        <div className={cn(baseClass, 'absolute top-0 left-0 right-0 h-1/2')} />
        <div className={cn(baseClass, 'absolute bottom-0 left-0 right-0 h-1/2')} />
      </div>
    ),
    'half-v': (
      <div className={containerClass}>
        <div className={cn(baseClass, 'absolute top-0 left-0 bottom-0 w-1/2')} />
        <div className={cn(baseClass, 'absolute top-0 right-0 bottom-0 w-1/2')} />
      </div>
    ),
    'thirds-h': (
      <div className={containerClass}>
        <div className={cn(baseClass, 'absolute top-0 left-0 right-0 h-1/3')} />
        <div className={cn(baseClass, 'absolute top-1/3 left-0 right-0 h-1/3')} />
        <div className={cn(baseClass, 'absolute bottom-0 left-0 right-0 h-1/3')} />
      </div>
    ),
    'thirds-v': (
      <div className={containerClass}>
        <div className={cn(baseClass, 'absolute top-0 left-0 bottom-0 w-1/3')} />
        <div className={cn(baseClass, 'absolute top-0 left-1/3 bottom-0 w-1/3')} />
        <div className={cn(baseClass, 'absolute top-0 right-0 bottom-0 w-1/3')} />
      </div>
    ),
    'hero-top': (
      <div className={containerClass}>
        <div className={cn(baseClass, 'absolute top-0 left-0 right-0')} style={{ height: '65%' }} />
        <div className={cn(baseClass, 'absolute bottom-0 left-0 right-0')} style={{ height: '35%' }} />
      </div>
    ),
    'hero-bottom': (
      <div className={containerClass}>
        <div className={cn(baseClass, 'absolute top-0 left-0 right-0')} style={{ height: '35%' }} />
        <div className={cn(baseClass, 'absolute bottom-0 left-0 right-0')} style={{ height: '65%' }} />
      </div>
    ),
    'hero-left': (
      <div className={containerClass}>
        <div className={cn(baseClass, 'absolute top-0 left-0 bottom-0')} style={{ width: '65%' }} />
        <div className={cn(baseClass, 'absolute top-0 right-0 bottom-0')} style={{ width: '35%' }} />
      </div>
    ),
    'hero-right': (
      <div className={containerClass}>
        <div className={cn(baseClass, 'absolute top-0 left-0 bottom-0')} style={{ width: '35%' }} />
        <div className={cn(baseClass, 'absolute top-0 right-0 bottom-0')} style={{ width: '65%' }} />
      </div>
    ),
    'quad': (
      <div className={containerClass}>
        <div className={cn(baseClass, 'absolute top-0 left-0 w-1/2 h-1/2')} />
        <div className={cn(baseClass, 'absolute top-0 right-0 w-1/2 h-1/2')} />
        <div className={cn(baseClass, 'absolute bottom-0 left-0 w-1/2 h-1/2')} />
        <div className={cn(baseClass, 'absolute bottom-0 right-0 w-1/2 h-1/2')} />
      </div>
    ),
    'comic-6': (
      <div className={containerClass}>
        {[0, 1, 2].map(row => (
          [0, 1].map(col => (
            <div 
              key={`${row}-${col}`}
              className={cn(baseClass, 'absolute w-1/2')} 
              style={{ 
                left: `${col * 50}%`, 
                top: `${row * 33.33}%`, 
                height: '33.33%' 
              }} 
            />
          ))
        ))}
      </div>
    ),
    'comic-9': (
      <div className={containerClass}>
        {[0, 1, 2].map(row => (
          [0, 1, 2].map(col => (
            <div 
              key={`${row}-${col}`}
              className={cn(baseClass, 'absolute')} 
              style={{ 
                left: `${col * 33.33}%`, 
                top: `${row * 33.33}%`, 
                width: '33.33%',
                height: '33.33%' 
              }} 
            />
          ))
        ))}
      </div>
    ),
    'custom': (
      <div className={cn(containerClass, 'border-2 border-dashed border-gray-300 flex items-center justify-center')}>
        <span className="text-[8px] text-gray-400">+</span>
      </div>
    ),
  };

  return layoutConfigs[layout] || null;
};

const LAYOUT_OPTIONS: { id: LayoutPreset; label: string }[] = [
  { id: 'full', label: 'Full' },
  { id: 'half-h', label: 'Half Horizontal' },
  { id: 'half-v', label: 'Half Vertical' },
  { id: 'thirds-h', label: 'Thirds Horizontal' },
  { id: 'thirds-v', label: 'Thirds Vertical' },
  { id: 'hero-top', label: 'Hero Top' },
  { id: 'hero-bottom', label: 'Hero Bottom' },
  { id: 'hero-left', label: 'Hero Left' },
  { id: 'hero-right', label: 'Hero Right' },
  { id: 'quad', label: 'Quad' },
  { id: 'comic-6', label: 'Comic 6' },
  { id: 'comic-9', label: 'Comic 9' },
];

export const LayoutSelector: React.FC<LayoutSelectorProps> = ({ className }) => {
  const {
    currentBook,
    currentPageIndex,
    setPageLayout,
    setPageOrientation,
  } = usePageBuilderStore();

  if (!currentBook) return null;

  const currentPage = currentBook.pages[currentPageIndex];
  const isPortrait = currentPage.orientation === 'portrait';

  const handleOrientationToggle = () => {
    const newOrientation: PageOrientation = isPortrait ? 'landscape' : 'portrait';
    setPageOrientation(currentPageIndex, newOrientation);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Orientation toggle */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Page Orientation</Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={handleOrientationToggle}
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                {isPortrait ? '↕ Portrait' : '↔ Landscape'}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Rotate page to {isPortrait ? 'Landscape' : 'Portrait'}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        
        {/* Visual orientation preview */}
        <div className="flex justify-center p-2 bg-gray-50 rounded">
          <div 
            className={cn(
              'border-2 border-purple-400 bg-white transition-all',
              isPortrait ? 'w-8 h-12' : 'w-12 h-8'
            )}
          />
        </div>
      </div>

      {/* Layout grid */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Panel Layout</Label>
        <p className="text-xs text-gray-500">Click to apply layout to current page</p>
        <div className="grid grid-cols-3 gap-2">
          {LAYOUT_OPTIONS.map(({ id, label }) => (
            <Tooltip key={id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setPageLayout(currentPageIndex, id)}
                  className={cn(
                    'p-2 rounded border-2 transition-all flex items-center justify-center aspect-square',
                    currentPage.layout === id
                      ? 'border-purple-500 bg-purple-50 shadow-md'
                      : 'border-gray-200 hover:border-purple-300 bg-white hover:bg-gray-50'
                  )}
                >
                  <LayoutIcon layout={id} isPortrait={isPortrait} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="font-medium">{label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>

      {/* Current layout info */}
      <div className="text-xs bg-gray-100 rounded p-3 space-y-1">
        <p><span className="font-medium">Layout:</span> {currentPage.layout}</p>
        <p><span className="font-medium">Orientation:</span> {currentPage.orientation}</p>
        <p><span className="font-medium">Panels:</span> {currentPage.panels.length}</p>
      </div>
    </div>
  );
};
