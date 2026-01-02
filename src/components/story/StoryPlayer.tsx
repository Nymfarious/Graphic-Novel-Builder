// MeKu Storybook Builder - StoryPlayer Component
// Full-screen story playback with page navigation

import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import type { StoryBook } from '@/types/story';
import { StoryPage } from './StoryPage';
import { ChevronLeft, ChevronRight, X, Home } from 'lucide-react';

interface StoryPlayerProps {
  book: StoryBook;
  onClose?: () => void;
  onHome?: () => void;
  startPage?: number;
}

export const StoryPlayer: React.FC<StoryPlayerProps> = ({
  book,
  onClose,
  onHome,
  startPage = 0,
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(startPage);
  const [isPlaying, setIsPlaying] = useState(true);

  const currentPage = book.pages[currentPageIndex];
  const isFirstPage = currentPageIndex === 0;
  const isLastPage = currentPageIndex === book.pages.length - 1;

  // Navigate to next page
  const goNext = useCallback(() => {
    if (!isLastPage) {
      setCurrentPageIndex((prev) => prev + 1);
    }
  }, [isLastPage]);

  // Navigate to previous page
  const goPrev = useCallback(() => {
    if (!isFirstPage) {
      setCurrentPageIndex((prev) => prev - 1);
    }
  }, [isFirstPage]);

  // Handle page completion
  const handlePageComplete = useCallback(() => {
    console.log('[StoryPlayer] Page complete:', currentPageIndex);
    // Optionally auto-advance
    // goNext();
  }, [currentPageIndex]);

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          goNext();
          break;
        case 'ArrowLeft':
          goPrev();
          break;
        case 'Escape':
          onClose?.();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev, onClose]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center gap-2">
          {onHome && (
            <button
              onClick={onHome}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <Home className="w-5 h-5 text-white" />
            </button>
          )}
          <h1 className="text-white font-medium text-lg">{book.title}</h1>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-white/60 text-sm">
            Page {currentPageIndex + 1} of {book.pages.length}
          </span>
          {onClose && (
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          )}
        </div>
      </div>

      {/* Story page */}
      <div className="flex-1 relative">
        {currentPage && (
          <StoryPage
            key={currentPage.id}
            page={currentPage}
            isActive={true}
            autoPlay={isPlaying}
            onComplete={handlePageComplete}
            showControls={true}
          />
        )}
      </div>

      {/* Navigation arrows */}
      <div className="absolute inset-y-0 left-0 flex items-center p-4">
        <button
          onClick={goPrev}
          disabled={isFirstPage}
          className={cn(
            'w-14 h-14 rounded-full flex items-center justify-center transition-all',
            isFirstPage
              ? 'bg-white/5 text-white/30 cursor-not-allowed'
              : 'bg-white/10 hover:bg-white/20 text-white hover:scale-110'
          )}
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      </div>

      <div className="absolute inset-y-0 right-0 flex items-center p-4">
        <button
          onClick={goNext}
          disabled={isLastPage}
          className={cn(
            'w-14 h-14 rounded-full flex items-center justify-center transition-all',
            isLastPage
              ? 'bg-white/5 text-white/30 cursor-not-allowed'
              : 'bg-white/10 hover:bg-white/20 text-white hover:scale-110'
          )}
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>

      {/* Page dots */}
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 flex gap-2">
        {book.pages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPageIndex(index)}
            className={cn(
              'w-3 h-3 rounded-full transition-all',
              index === currentPageIndex
                ? 'bg-white scale-125'
                : 'bg-white/30 hover:bg-white/50'
            )}
          />
        ))}
      </div>
    </div>
  );
};
