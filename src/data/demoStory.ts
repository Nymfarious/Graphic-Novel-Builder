// MeKu Storybook Builder - Demo Story Data
// A sample story to test the story player

import type { StoryBook } from '@/types/story';

export const DEMO_STORY: StoryBook = {
  id: 'demo-story-1',
  title: 'The Magical Garden',
  author: 'MeKu Demo',
  coverImage: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=300&fit=crop',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  pages: [
    // ========== PAGE 1: Title Page ==========
    {
      id: 'page-1',
      pageNumber: 1,
      duration: 8,
      background: {
        type: 'gradient',
        value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      },
      textBlocks: [
        {
          id: 'title-text',
          content: '🌸 The Magical Garden 🌸',
          position: { x: 50, y: 35 },
          style: {
            fontFamily: 'Playfair Display',
            fontSize: 48,
            fontWeight: 700,
            color: '#ffffff',
            textShadow: '2px 2px 8px rgba(0,0,0,0.3)',
          },
          animation: {
            type: 'bounce',
            startTime: 0.5,
            duration: 0.8,
          },
          tappable: {
            enabled: true,
            reaction: 'sparkle',
          },
        },
        {
          id: 'subtitle-text',
          content: 'A story for Sia',
          position: { x: 50, y: 50 },
          style: {
            fontFamily: 'Lora',
            fontSize: 24,
            color: 'rgba(255,255,255,0.9)',
          },
          animation: {
            type: 'fadeIn',
            startTime: 1.5,
            duration: 0.6,
          },
        },
        {
          id: 'tap-hint',
          content: 'Tap anywhere to begin! ✨',
          position: { x: 50, y: 70 },
          style: {
            fontFamily: 'Poppins',
            fontSize: 18,
            color: 'rgba(255,255,255,0.7)',
          },
          animation: {
            type: 'fadeIn',
            startTime: 3,
            duration: 0.5,
          },
        },
      ],
      images: [],
      hotspots: [],
      timeline: [
        { id: 'e1', time: 0.5, targetId: 'title-text', action: { type: 'show', animation: 'bounce' } },
        { id: 'e2', time: 1.5, targetId: 'subtitle-text', action: { type: 'show', animation: 'fadeIn' } },
        { id: 'e3', time: 3, targetId: 'tap-hint', action: { type: 'show', animation: 'fadeIn' } },
      ],
    },

    // ========== PAGE 2: The Garden ==========
    {
      id: 'page-2',
      pageNumber: 2,
      duration: 12,
      background: {
        type: 'gradient',
        value: 'linear-gradient(180deg, #87CEEB 0%, #98FB98 100%)',
      },
      textBlocks: [
        {
          id: 'narration-1',
          content: 'Once upon a time, there was a beautiful garden...',
          position: { x: 50, y: 20 },
          style: {
            fontFamily: 'Crimson Text',
            fontSize: 28,
            fontWeight: 400,
            color: '#2d3748',
            textShadow: '1px 1px 2px rgba(255,255,255,0.8)',
          },
          animation: {
            type: 'slideUp',
            startTime: 0.5,
            duration: 0.6,
          },
        },
        {
          id: 'narration-2',
          content: '...where flowers could talk and butterflies sang songs.',
          position: { x: 50, y: 32 },
          style: {
            fontFamily: 'Crimson Text',
            fontSize: 28,
            fontWeight: 400,
            color: '#2d3748',
            textShadow: '1px 1px 2px rgba(255,255,255,0.8)',
          },
          animation: {
            type: 'slideUp',
            startTime: 2,
            duration: 0.6,
          },
        },
        {
          id: 'flower-1',
          content: '🌷',
          position: { x: 20, y: 70 },
          style: {
            fontFamily: 'sans-serif',
            fontSize: 64,
            color: '#ffffff',
          },
          animation: {
            type: 'bounce',
            startTime: 3,
            duration: 0.5,
          },
          tappable: {
            enabled: true,
            reaction: 'wiggle',
          },
        },
        {
          id: 'flower-2',
          content: '🌻',
          position: { x: 50, y: 75 },
          style: {
            fontFamily: 'sans-serif',
            fontSize: 72,
            color: '#ffffff',
          },
          animation: {
            type: 'bounce',
            startTime: 3.3,
            duration: 0.5,
          },
          tappable: {
            enabled: true,
            reaction: 'pop',
          },
        },
        {
          id: 'flower-3',
          content: '🌹',
          position: { x: 80, y: 70 },
          style: {
            fontFamily: 'sans-serif',
            fontSize: 64,
            color: '#ffffff',
          },
          animation: {
            type: 'bounce',
            startTime: 3.6,
            duration: 0.5,
          },
          tappable: {
            enabled: true,
            reaction: 'wiggle',
          },
        },
        {
          id: 'butterfly',
          content: '🦋',
          position: { x: 70, y: 45 },
          style: {
            fontFamily: 'sans-serif',
            fontSize: 48,
            color: '#ffffff',
          },
          animation: {
            type: 'fadeIn',
            startTime: 5,
            duration: 0.5,
          },
          tappable: {
            enabled: true,
            reaction: 'sparkle',
          },
        },
      ],
      images: [],
      hotspots: [],
      timeline: [
        { id: 'e1', time: 0.5, targetId: 'narration-1', action: { type: 'show', animation: 'slideUp' } },
        { id: 'e2', time: 2, targetId: 'narration-2', action: { type: 'show', animation: 'slideUp' } },
        { id: 'e3', time: 3, targetId: 'flower-1', action: { type: 'show', animation: 'bounce' } },
        { id: 'e4', time: 3.3, targetId: 'flower-2', action: { type: 'show', animation: 'bounce' } },
        { id: 'e5', time: 3.6, targetId: 'flower-3', action: { type: 'show', animation: 'bounce' } },
        { id: 'e6', time: 5, targetId: 'butterfly', action: { type: 'show', animation: 'fadeIn' } },
      ],
    },

    // ========== PAGE 3: The Discovery ==========
    {
      id: 'page-3',
      pageNumber: 3,
      duration: 10,
      background: {
        type: 'gradient',
        value: 'linear-gradient(180deg, #FFF5E6 0%, #FFE4C4 100%)',
      },
      textBlocks: [
        {
          id: 'narration-3',
          content: 'One sunny morning, a little girl named Sia',
          position: { x: 50, y: 15 },
          style: {
            fontFamily: 'Crimson Text',
            fontSize: 26,
            color: '#5D4037',
          },
          animation: {
            type: 'slideUp',
            startTime: 0.5,
            duration: 0.6,
          },
        },
        {
          id: 'narration-4',
          content: 'discovered the magical garden.',
          position: { x: 50, y: 25 },
          style: {
            fontFamily: 'Crimson Text',
            fontSize: 26,
            color: '#5D4037',
          },
          animation: {
            type: 'slideUp',
            startTime: 1.5,
            duration: 0.6,
          },
        },
        {
          id: 'girl-emoji',
          content: '👧',
          position: { x: 30, y: 60 },
          style: {
            fontFamily: 'sans-serif',
            fontSize: 80,
            color: '#ffffff',
          },
          animation: {
            type: 'slideRight',
            startTime: 2.5,
            duration: 0.8,
          },
          tappable: {
            enabled: true,
            reaction: 'bounce',
          },
        },
        {
          id: 'sparkles',
          content: '✨',
          position: { x: 55, y: 55 },
          style: {
            fontFamily: 'sans-serif',
            fontSize: 48,
            color: '#ffffff',
          },
          animation: {
            type: 'pop',
            startTime: 4,
            duration: 0.3,
          },
          tappable: {
            enabled: true,
            reaction: 'sparkle',
          },
        },
        {
          id: 'heart',
          content: '💖',
          position: { x: 45, y: 45 },
          style: {
            fontFamily: 'sans-serif',
            fontSize: 40,
            color: '#ffffff',
          },
          animation: {
            type: 'bounce',
            startTime: 4.5,
            duration: 0.5,
          },
          tappable: {
            enabled: true,
            reaction: 'pop',
          },
        },
      ],
      images: [],
      hotspots: [],
      timeline: [
        { id: 'e1', time: 0.5, targetId: 'narration-3', action: { type: 'show', animation: 'slideUp' } },
        { id: 'e2', time: 1.5, targetId: 'narration-4', action: { type: 'show', animation: 'slideUp' } },
        { id: 'e3', time: 2.5, targetId: 'girl-emoji', action: { type: 'show', animation: 'slideRight' } },
        { id: 'e4', time: 4, targetId: 'sparkles', action: { type: 'show', animation: 'pop' } },
        { id: 'e5', time: 4.5, targetId: 'heart', action: { type: 'show', animation: 'bounce' } },
      ],
    },

    // ========== PAGE 4: The End ==========
    {
      id: 'page-4',
      pageNumber: 4,
      duration: 8,
      background: {
        type: 'gradient',
        value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      },
      textBlocks: [
        {
          id: 'the-end',
          content: '🌈 The End 🌈',
          position: { x: 50, y: 40 },
          style: {
            fontFamily: 'Fredoka One',
            fontSize: 56,
            color: '#ffffff',
            textShadow: '3px 3px 10px rgba(0,0,0,0.3)',
          },
          animation: {
            type: 'bounce',
            startTime: 0.5,
            duration: 0.8,
          },
          tappable: {
            enabled: true,
            reaction: 'sparkle',
          },
        },
        {
          id: 'thank-you',
          content: 'Thank you for reading!',
          position: { x: 50, y: 55 },
          style: {
            fontFamily: 'Poppins',
            fontSize: 24,
            color: 'rgba(255,255,255,0.9)',
          },
          animation: {
            type: 'fadeIn',
            startTime: 2,
            duration: 0.6,
          },
        },
        {
          id: 'hearts-row',
          content: '💕 💖 💗 💕',
          position: { x: 50, y: 70 },
          style: {
            fontFamily: 'sans-serif',
            fontSize: 36,
            color: '#ffffff',
          },
          animation: {
            type: 'slideUp',
            startTime: 3,
            duration: 0.5,
          },
          tappable: {
            enabled: true,
            reaction: 'pop',
          },
        },
      ],
      images: [],
      hotspots: [],
      timeline: [
        { id: 'e1', time: 0.5, targetId: 'the-end', action: { type: 'show', animation: 'bounce' } },
        { id: 'e2', time: 2, targetId: 'thank-you', action: { type: 'show', animation: 'fadeIn' } },
        { id: 'e3', time: 3, targetId: 'hearts-row', action: { type: 'show', animation: 'slideUp' } },
      ],
    },
  ],
};
