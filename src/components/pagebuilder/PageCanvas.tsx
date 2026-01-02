// MeKu Storybook Builder - Page Canvas Component
// The main canvas showing the current page(s) with panels
// Supports single page and book spread (side-by-side) view

import React from 'react';
import { cn } from '@/lib/utils';
import { usePageBuilderStore } from '@/stores/pageBuilderStore';
import { EditablePanel } from './EditablePanel';
import type { BookPage } from '@/types/pageBuilder';

interface PageCanvasProps {
  className?: string;
}

export const PageCanvas: React.FC<PageCanvasProps> = ({ className }) => {
  const {
    currentBook,
    currentPageIndex,
    selectedPanelId,
    viewMode,
    zoom,
    showGrid,
    selectPanel,
  } = usePageBuilderStore();

  if (!currentBook) {
    return (
      <div className={cn('flex items-center justify-center h-full bg-gray-200', className)}>
        <div className="text-center">
          <p className="text-gray-500 text-lg">No book loaded</p>
          <p className="text-gray-400 text-sm">Create or open a book to start building</p>
        </div>
      </div>
    );
  }

  const currentPage = currentBook.pages[currentPageIndex];

  // Get page dimensions based on orientation and zoom
  const getPageDimensions = (page: BookPage) => {
    const isPortrait = page.orientation === 'portrait';
    // Base dimensions for a standard page
    const baseWidth = isPortrait ? 400 : 560;
    const baseHeight = isPortrait ? 560 : 400;
    return {
      width: (baseWidth * zoom) / 100,
      height: (baseHeight * zoom) / 100,
    };
  };

  // Render a single page
  const renderPage = (page: BookPage, pageIndex: number, side?: 'left' | 'right') => {
    const dimensions = getPageDimensions(page);
    const isCurrentPage = pageIndex === currentPageIndex;
    
    return (
      <div
        key={page.id}
        className={cn(
          'relative bg-white transition-all',
          // Rounded corners based on position in spread
          side === 'left' && 'rounded-l-md shadow-[-4px_0_12px_rgba(0,0,0,0.1)]',
          side === 'right' && 'rounded-r-md shadow-[4px_0_12px_rgba(0,0,0,0.1)]',
          !side && 'rounded-md shadow-xl',
          // Highlight current page in spread view
          viewMode === 'spread' && isCurrentPage && 'ring-2 ring-purple-400 ring-offset-2 ring-offset-gray-200'
        )}
        style={{
          width: dimensions.width,
          height: dimensions.height,
          backgroundColor: page.backgroundColor,
          backgroundImage: page.backgroundImage ? `url(${page.backgroundImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        onClick={() => selectPanel(null)}
      >
        {/* Grid overlay for alignment help */}
        {showGrid && (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(rgba(150,150,150,0.15) 1px, transparent 1px),
                linear-gradient(90deg, rgba(150,150,150,0.15) 1px, transparent 1px)
              `,
              backgroundSize: '10% 10%',
            }}
          />
        )}

        {/* Panels */}
        {page.panels.map((panel) => (
          <EditablePanel
            key={panel.id}
            panel={panel}
            pageIndex={pageIndex}
            isSelected={selectedPanelId === panel.id && isCurrentPage}
            onSelect={() => selectPanel(panel.id)}
          />
        ))}

        {/* Page number indicator */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/30 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded">
          Page {page.pageNumber}
        </div>

        {/* Orientation indicator (corner badge) */}
        <div className="absolute top-2 right-2 bg-black/20 text-white text-[10px] px-1.5 py-0.5 rounded">
          {page.orientation === 'portrait' ? '↕ Portrait' : '↔ Landscape'}
        </div>
      </div>
    );
  };

  return (
    <div className={cn(
      'flex items-center justify-center h-full overflow-auto p-8 bg-gray-200',
      className
    )}>
      {/* Single page view */}
      {viewMode === 'single' && currentPage && (
        <div className="flex flex-col items-center gap-4">
          {renderPage(currentPage, currentPageIndex)}
        </div>
      )}

      {/* Book spread view (side-by-side pages like an open book) */}
      {viewMode === 'spread' && (
        <div className="flex items-stretch gap-0">
          {/* Left page (previous page, or placeholder if on first page) */}
          {currentPageIndex > 0 ? (
            renderPage(currentBook.pages[currentPageIndex - 1], currentPageIndex - 1, 'left')
          ) : (
            // Empty left page placeholder (like inside front cover)
            <div 
              className="bg-gray-100 rounded-l-md flex items-center justify-center"
              style={getPageDimensions(currentPage)}
            >
              <div className="text-center text-gray-400">
                <p className="text-sm">Inside Cover</p>
                <p className="text-xs">(No previous page)</p>
              </div>
            </div>
          )}
          
          {/* Book spine */}
          <div 
            className="w-3 bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 shadow-inner flex-shrink-0"
            style={{ height: getPageDimensions(currentPage).height }}
          >
            <div className="h-full w-full bg-gradient-to-b from-transparent via-gray-500/20 to-transparent" />
          </div>
          
          {/* Right page (current page) */}
          {currentPage && renderPage(currentPage, currentPageIndex, 'right')}
        </div>
      )}
    </div>
  );
};
