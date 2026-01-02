// MeKu Storybook Builder - Page Strip Component
// Thumbnail navigation for pages at the bottom of the editor
// EXPANDABLE with drag handle

import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { usePageBuilderStore } from '@/stores/pageBuilderStore';
import { ChevronLeft, ChevronRight, Plus, Copy, Trash2, ChevronUp, ChevronDown, GripHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface PageStripProps {
  className?: string;
}

export const PageStrip: React.FC<PageStripProps> = ({ className }) => {
  const {
    currentBook,
    currentPageIndex,
    setCurrentPage,
    addPage,
    deletePage,
    duplicatePage,
    prevPage,
    nextPage,
  } = usePageBuilderStore();

  const stripRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Expandable state
  const [isExpanded, setIsExpanded] = useState(false);
  const [stripHeight, setStripHeight] = useState(100); // Default height
  const [isDragging, setIsDragging] = useState(false);

  // Scroll selected page into view when page changes
  useEffect(() => {
    if (selectedRef.current && stripRef.current) {
      const strip = stripRef.current;
      const selected = selectedRef.current;
      const stripRect = strip.getBoundingClientRect();
      const selectedRect = selected.getBoundingClientRect();

      if (selectedRect.left < stripRect.left) {
        strip.scrollLeft -= stripRect.left - selectedRect.left + 20;
      } else if (selectedRect.right > stripRect.right) {
        strip.scrollLeft += selectedRect.right - stripRect.right + 20;
      }
    }
  }, [currentPageIndex]);

  // Handle resize drag
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const startY = e.clientY;
    const startHeight = stripHeight;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const delta = startY - moveEvent.clientY;
      const newHeight = Math.max(80, Math.min(300, startHeight + delta));
      setStripHeight(newHeight);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  if (!currentBook) return null;

  const { pages } = currentBook;

  // Calculate thumbnail size based on strip height
  const thumbScale = Math.max(0.8, Math.min(1.5, stripHeight / 100));
  const baseThumbWidth = 48 * thumbScale;
  const baseThumbHeight = 64 * thumbScale;

  // Get thumbnail preview - CORRECTLY reflects orientation and layout
  const getThumbnailPreview = (page: typeof pages[0]) => {
    const isPortrait = page.orientation === 'portrait';
    const thumbWidth = isPortrait ? baseThumbWidth : baseThumbHeight;
    const thumbHeight = isPortrait ? baseThumbHeight : baseThumbWidth;
    
    return (
      <div 
        className="relative bg-white border border-gray-400 rounded-sm overflow-hidden shadow-sm"
        style={{ 
          width: thumbWidth,
          height: thumbHeight,
          backgroundColor: page.backgroundColor,
        }}
      >
        {/* Mini panel layout preview - shows actual panels */}
        {page.panels.map((panel) => (
          <div
            key={panel.id}
            className={cn(
              'absolute border-[0.5px] border-gray-300',
              panel.content?.type === 'text' && 'bg-blue-200/60',
              panel.content?.type === 'image' && 'bg-green-200/60',
              !panel.content && 'bg-gray-100/80'
            )}
            style={{
              left: `${panel.bounds.x}%`,
              top: `${panel.bounds.y}%`,
              width: `${panel.bounds.width}%`,
              height: `${panel.bounds.height}%`,
            }}
          >
            {panel.content?.type === 'image' && (
              <img 
                src={panel.content.src} 
                alt="" 
                className="w-full h-full object-cover"
              />
            )}
            {panel.content?.type === 'text' && (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-[6px] text-gray-500">T</span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        'flex flex-col bg-gray-900 border-t border-gray-700 transition-all',
        isDragging && 'select-none',
        className
      )}
      style={{ height: stripHeight }}
    >
      {/* Resize handle at top */}
      <div 
        className="flex items-center justify-center h-4 cursor-ns-resize hover:bg-gray-700 transition-colors group"
        onMouseDown={handleMouseDown}
      >
        <GripHorizontal className="w-6 h-3 text-gray-500 group-hover:text-gray-300" />
      </div>

      {/* Main strip content */}
      <div className="flex-1 flex items-center gap-2 px-3 pb-2 min-h-0">
        {/* Left navigation arrow */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={prevPage}
              disabled={currentPageIndex === 0}
              className="shrink-0 text-white hover:bg-gray-700 disabled:opacity-30"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Previous Page (←)</TooltipContent>
        </Tooltip>

        {/* Page thumbnails */}
        <div 
          ref={stripRef}
          className="flex-1 flex items-center gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 py-2"
          style={{ scrollBehavior: 'smooth' }}
        >
          {pages.map((page, index) => (
            <Tooltip key={page.id}>
              <TooltipTrigger asChild>
                <div
                  ref={index === currentPageIndex ? selectedRef : undefined}
                  className={cn(
                    'relative shrink-0 cursor-pointer transition-all group',
                    index === currentPageIndex 
                      ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-gray-900 rounded-sm scale-105' 
                      : 'opacity-70 hover:opacity-100'
                  )}
                  onClick={() => setCurrentPage(index)}
                >
                  {getThumbnailPreview(page)}
                  
                  {/* Page number badge */}
                  <div className={cn(
                    'absolute -bottom-2 left-1/2 -translate-x-1/2 text-white text-[10px] px-1.5 rounded',
                    index === currentPageIndex ? 'bg-purple-600' : 'bg-gray-700'
                  )}>
                    {page.pageNumber}
                  </div>

                  {/* Hover actions */}
                  <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5 z-10">
                    <button
                      onClick={(e) => { e.stopPropagation(); duplicatePage(index); }}
                      className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 shadow"
                      title="Duplicate page"
                    >
                      <Copy className="w-3 h-3 text-white" />
                    </button>
                    {pages.length > 1 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); deletePage(index); }}
                        className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 shadow"
                        title="Delete page"
                      >
                        <Trash2 className="w-3 h-3 text-white" />
                      </button>
                    )}
                  </div>

                  {/* Layout indicator */}
                  <div className="absolute top-0 left-0 bg-black/50 text-[6px] text-white px-0.5 rounded-br">
                    {page.orientation === 'landscape' ? 'L' : 'P'}
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="font-medium">Page {page.pageNumber}</p>
                <p className="text-xs text-gray-400">
                  {page.layout} • {page.orientation}
                </p>
              </TooltipContent>
            </Tooltip>
          ))}

          {/* Add page button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => addPage(currentPageIndex)}
                className="shrink-0 border-2 border-dashed border-gray-600 rounded-sm flex items-center justify-center text-gray-500 hover:border-purple-500 hover:text-purple-500 transition-colors"
                style={{ 
                  width: baseThumbWidth, 
                  height: baseThumbHeight 
                }}
              >
                <Plus className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Add page after current</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Right navigation arrow */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextPage}
              disabled={currentPageIndex === pages.length - 1}
              className="shrink-0 text-white hover:bg-gray-700 disabled:opacity-30"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Next Page (→)</TooltipContent>
        </Tooltip>

        {/* Page counter and expand toggle */}
        <div className="shrink-0 flex flex-col items-center gap-1">
          <div className="text-white text-sm font-mono bg-gray-800 px-3 py-1 rounded">
            {currentPageIndex + 1} / {pages.length}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStripHeight(stripHeight === 100 ? 180 : 100)}
            className="text-gray-400 hover:text-white h-6 px-2"
          >
            {stripHeight > 100 ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
