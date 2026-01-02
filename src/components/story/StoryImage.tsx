// MeKu Storybook Builder - StoryImage Component
// Animated image with tap reactions

import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import type { StoryImage as StoryImageType, AnimationType, TapReactionType } from '@/types/story';
import { ParticleEffect } from './ParticleEffect';

interface StoryImageProps {
  image: StoryImageType;
  isVisible: boolean;
  currentTime: number;
  onTap?: () => void;
}

export const StoryImage: React.FC<StoryImageProps> = ({
  image,
  isVisible,
  currentTime,
  onTap,
}) => {
  const [showParticles, setShowParticles] = useState(false);
  const [tapReaction, setTapReaction] = useState<TapReactionType | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Should this element be shown based on timeline?
  const shouldShow = currentTime >= image.animation.startTime;
  const showElement = isVisible && shouldShow && imageLoaded;

  // Get animation class
  const getAnimationClass = (type: AnimationType): string => {
    const animationMap: Record<AnimationType, string> = {
      fadeIn: 'animate-fadeIn',
      fadeOut: 'animate-fadeOut',
      slideUp: 'animate-slideUp',
      slideDown: 'animate-slideDown',
      slideLeft: 'animate-slideLeft',
      slideRight: 'animate-slideRight',
      bounce: 'animate-bounce',
      pop: 'animate-pop',
      wiggle: 'animate-wiggle',
      float: 'animate-float',
      typewriter: '',
      none: '',
    };
    return animationMap[type] || '';
  };

  // Handle tap
  const handleTap = useCallback(() => {
    if (!image.tappable?.enabled) return;

    // Trigger reaction animation
    setTapReaction(image.tappable.reaction);
    setTimeout(() => setTapReaction(null), 500);

    // Show particles
    setShowParticles(true);
    setTimeout(() => setShowParticles(false), 1000);

    // Play sound if configured
    if (image.tappable.sound) {
      const audio = new Audio(image.tappable.sound);
      audio.volume = 0.5;
      audio.play().catch(console.error);
    }

    onTap?.();
  }, [image.tappable, onTap]);

  return (
    <div
      className={cn(
        'absolute story-element',
        showElement && 'visible',
        showElement && getAnimationClass(image.animation.type),
        image.tappable?.enabled && 'tappable-element',
        tapReaction && `tap-reaction-${tapReaction}`
      )}
      style={{
        left: `${image.position.x}%`,
        top: `${image.position.y}%`,
        width: `${image.size.width}%`,
        height: `${image.size.height}%`,
        transform: 'translate(-50%, -50%)',
        '--animation-duration': `${image.animation.duration}s`,
      } as React.CSSProperties}
      onClick={image.tappable?.enabled ? handleTap : undefined}
    >
      <img
        src={image.src}
        alt={image.alt || ''}
        className="w-full h-full object-contain"
        onLoad={() => setImageLoaded(true)}
        draggable={false}
      />

      {/* Particle effects on tap */}
      {showParticles && (
        <ParticleEffect 
          type={image.tappable?.reaction === 'sparkle' ? 'sparkle' : 'stars'} 
        />
      )}
    </div>
  );
};
