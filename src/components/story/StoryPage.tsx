// MeKu Storybook Builder - StoryPage Component
// Renders a single page with all its elements and handles playback

import React, { useCallback, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { StoryPage as StoryPageType, TimelineEvent } from '@/types/story';
import { useTimeline } from '@/hooks/useTimeline';
import { StoryText } from './StoryText';
import { StoryImage } from './StoryImage';

interface StoryPageProps {
  page: StoryPageType;
  isActive: boolean;
  autoPlay?: boolean;
  onComplete?: () => void;
  showControls?: boolean;
}

export const StoryPage: React.FC<StoryPageProps> = ({
  page,
  isActive,
  autoPlay = false,
  onComplete,
  showControls = true,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Handle timeline events
  const handleEventTrigger = useCallback((event: TimelineEvent) => {
    console.log('[StoryPage] Event triggered:', event);

    switch (event.action.type) {
      case 'playNarration':
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(console.error);
        }
        break;
      case 'playSound':
        const sound = new Audio(event.action.url);
        sound.volume = 0.6;
        sound.play().catch(console.error);
        break;
      // show/hide/animate are handled by the components themselves
      default:
        break;
    }
  }, []);

  // Timeline playback
  const timeline = useTimeline({
    duration: page.duration,
    events: page.timeline,
    onEventTrigger: handleEventTrigger,
    onComplete,
  });

  // Auto-play when page becomes active
  useEffect(() => {
    if (isActive && autoPlay) {
      timeline.reset();
      // Small delay to let animations settle
      setTimeout(() => timeline.play(), 100);
    } else if (!isActive) {
      timeline.pause();
      timeline.reset();
    }
  }, [isActive, autoPlay]);

  // Get background style
  const getBackgroundStyle = (): React.CSSProperties => {
    switch (page.background.type) {
      case 'image':
        return {
          backgroundImage: `url(${page.background.value})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        };
      case 'gradient':
        return {
          background: page.background.value,
        };
      case 'color':
      default:
        return {
          backgroundColor: page.background.value,
        };
    }
  };

  return (
    <div
      className={cn(
        'story-page-container relative w-full h-full',
        !isActive && 'hidden'
      )}
      style={getBackgroundStyle()}
    >
      {/* Story canvas - contains all elements */}
      <div className="story-canvas">
        {/* Text blocks */}
        {page.textBlocks.map((block) => (
          <StoryText
            key={block.id}
            block={block}
            isVisible={isActive}
            currentTime={timeline.currentTime}
          />
        ))}

        {/* Images */}
        {page.images.map((image) => (
          <StoryImage
            key={image.id}
            image={image}
            isVisible={isActive}
            currentTime={timeline.currentTime}
          />
        ))}
      </div>

      {/* Narration audio */}
      {page.narration?.audioUrl && (
        <audio
          ref={audioRef}
          src={page.narration.audioUrl}
          preload="auto"
        />
      )}

      {/* Progress bar */}
      <div className="story-progress-bar">
        <div
          className="story-progress-fill"
          style={{ width: `${timeline.progress}%` }}
        />
      </div>

      {/* Playback controls */}
      {showControls && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-black/40 backdrop-blur-sm rounded-full px-6 py-3">
          <button
            onClick={timeline.toggle}
            className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            {timeline.isPlaying ? (
              <PauseIcon className="w-6 h-6 text-white" />
            ) : (
              <PlayIcon className="w-6 h-6 text-white ml-1" />
            )}
          </button>

          <button
            onClick={timeline.reset}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <ResetIcon className="w-5 h-5 text-white" />
          </button>

          <span className="text-white/80 text-sm font-mono min-w-[80px]">
            {formatTime(timeline.currentTime)} / {formatTime(page.duration)}
          </span>
        </div>
      )}
    </div>
  );
};

// Helper: Format time as MM:SS
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Simple icon components
const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const PauseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
  </svg>
);

const ResetIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);
