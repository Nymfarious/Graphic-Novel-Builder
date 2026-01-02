// MeKu Storybook Builder - StoryText Component
// Animated text block with tap reactions

import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import type { StoryTextBlock, AnimationType, TapReactionType } from '@/types/story';
import { ParticleEffect } from './ParticleEffect';

interface StoryTextProps {
  block: StoryTextBlock;
  isVisible: boolean;
  currentTime: number;
  onTap?: () => void;
}

export const StoryText: React.FC<StoryTextProps> = ({
  block,
  isVisible,
  currentTime,
  onTap,
}) => {
  const [showParticles, setShowParticles] = useState(false);
  const [tapReaction, setTapReaction] = useState<TapReactionType | null>(null);

  // Should this element be shown based on timeline?
  const shouldShow = currentTime >= block.animation.startTime;
  const showElement = isVisible && shouldShow;

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
      typewriter: 'animate-typewriter',
      none: '',
    };
    return animationMap[type] || '';
  };

  // Handle tap
  const handleTap = useCallback(() => {
    if (!block.tappable?.enabled) return;

    // Trigger reaction animation
    setTapReaction(block.tappable.reaction);
    setTimeout(() => setTapReaction(null), 500);

    // Show particles
    setShowParticles(true);
    setTimeout(() => setShowParticles(false), 1000);

    // Play sound if configured
    if (block.tappable.sound) {
      const audio = new Audio(block.tappable.sound);
      audio.volume = 0.5;
      audio.play().catch(console.error);
    }

    onTap?.();
  }, [block.tappable, onTap]);

  if (!showElement) return null;

  return (
    <div
      className={cn(
        'absolute story-element',
        showElement && 'visible',
        getAnimationClass(block.animation.type),
        block.tappable?.enabled && 'tappable-element',
        tapReaction && `tap-reaction-${tapReaction}`
      )}
      style={{
        left: `${block.position.x}%`,
        top: `${block.position.y}%`,
        transform: 'translate(-50%, -50%)',
        fontFamily: block.style.fontFamily,
        fontSize: `${block.style.fontSize}px`,
        fontWeight: block.style.fontWeight,
        color: block.style.color,
        textShadow: block.style.textShadow,
        letterSpacing: block.style.letterSpacing,
        lineHeight: block.style.lineHeight,
        '--animation-duration': `${block.animation.duration}s`,
        animationDelay: `${block.animation.delay || 0}s`,
      } as React.CSSProperties}
      onClick={block.tappable?.enabled ? handleTap : undefined}
    >
      {block.content}

      {/* Particle effects on tap */}
      {showParticles && (
        <ParticleEffect 
          type={block.tappable?.reaction === 'sparkle' ? 'sparkle' : 'hearts'} 
        />
      )}
    </div>
  );
};
