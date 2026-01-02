// MeKu Storybook Builder - Timeline Hook
// Controls playback timing for story animations

import { useState, useRef, useCallback, useEffect } from 'react';
import type { TimelineEvent, PlaybackState } from '@/types/story';

interface UseTimelineOptions {
  duration: number;
  events: TimelineEvent[];
  onEventTrigger?: (event: TimelineEvent) => void;
  onComplete?: () => void;
}

export function useTimeline({
  duration,
  events,
  onEventTrigger,
  onComplete,
}: UseTimelineOptions) {
  const [state, setState] = useState<PlaybackState>({
    isPlaying: false,
    currentTime: 0,
    duration,
    currentPageIndex: 0,
  });

  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const triggeredEventsRef = useRef<Set<string>>(new Set());

  // Check and trigger events based on current time
  const checkEvents = useCallback((currentTime: number) => {
    events.forEach((event) => {
      if (
        currentTime >= event.time &&
        !triggeredEventsRef.current.has(event.id)
      ) {
        triggeredEventsRef.current.add(event.id);
        onEventTrigger?.(event);
      }
    });
  }, [events, onEventTrigger]);

  // Animation loop
  const tick = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) {
      lastTimeRef.current = timestamp;
    }

    const delta = (timestamp - lastTimeRef.current) / 1000; // Convert to seconds
    lastTimeRef.current = timestamp;

    setState((prev) => {
      const newTime = prev.currentTime + delta;

      if (newTime >= duration) {
        onComplete?.();
        return { ...prev, isPlaying: false, currentTime: duration };
      }

      checkEvents(newTime);
      return { ...prev, currentTime: newTime };
    });

    animationFrameRef.current = requestAnimationFrame(tick);
  }, [duration, checkEvents, onComplete]);

  // Play
  const play = useCallback(() => {
    if (state.currentTime >= duration) {
      // Reset if at end
      setState((prev) => ({ ...prev, currentTime: 0 }));
      triggeredEventsRef.current.clear();
    }
    
    setState((prev) => ({ ...prev, isPlaying: true }));
    lastTimeRef.current = 0;
    animationFrameRef.current = requestAnimationFrame(tick);
  }, [state.currentTime, duration, tick]);

  // Pause
  const pause = useCallback(() => {
    setState((prev) => ({ ...prev, isPlaying: false }));
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  // Toggle play/pause
  const toggle = useCallback(() => {
    if (state.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [state.isPlaying, play, pause]);

  // Seek to specific time
  const seek = useCallback((time: number) => {
    const clampedTime = Math.max(0, Math.min(time, duration));
    
    // Reset triggered events for events after seek point
    triggeredEventsRef.current = new Set(
      events
        .filter((e) => e.time < clampedTime)
        .map((e) => e.id)
    );

    // Re-trigger events up to current time
    events.forEach((event) => {
      if (event.time <= clampedTime && !triggeredEventsRef.current.has(event.id)) {
        triggeredEventsRef.current.add(event.id);
        onEventTrigger?.(event);
      }
    });

    setState((prev) => ({ ...prev, currentTime: clampedTime }));
  }, [duration, events, onEventTrigger]);

  // Reset
  const reset = useCallback(() => {
    pause();
    triggeredEventsRef.current.clear();
    setState((prev) => ({ ...prev, currentTime: 0 }));
  }, [pause]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Update duration if it changes
  useEffect(() => {
    setState((prev) => ({ ...prev, duration }));
  }, [duration]);

  return {
    ...state,
    play,
    pause,
    toggle,
    seek,
    reset,
    progress: duration > 0 ? (state.currentTime / duration) * 100 : 0,
  };
}
