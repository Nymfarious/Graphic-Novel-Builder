// MeKu Storybook Builder - Story Types
// Phase 1: Core data structures for interactive storybook pages

export type AnimationType = 
  | 'fadeIn' 
  | 'fadeOut'
  | 'slideUp' 
  | 'slideDown'
  | 'slideLeft' 
  | 'slideRight'
  | 'bounce' 
  | 'pop'
  | 'wiggle'
  | 'float'
  | 'typewriter'
  | 'none';

export type TapReactionType = 
  | 'pop' 
  | 'wiggle' 
  | 'sparkle' 
  | 'hearts' 
  | 'bounce'
  | 'spin';

// ============================================================================
// STORY TEXT
// ============================================================================
export interface TextStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight?: number;
  color: string;
  textShadow?: string;
  letterSpacing?: string;
  lineHeight?: number;
}

export interface StoryTextBlock {
  id: string;
  content: string;
  position: { x: number; y: number };  // Percentage-based (0-100)
  style: TextStyle;
  animation: {
    type: AnimationType;
    startTime: number;      // Seconds
    duration: number;       // Seconds
    delay?: number;         // Additional delay
  };
  tappable?: {
    enabled: boolean;
    reaction: TapReactionType;
    sound?: string;         // Audio URL
  };
}

// ============================================================================
// STORY IMAGE
// ============================================================================
export interface StoryImage {
  id: string;
  src: string;
  alt?: string;
  position: { x: number; y: number };  // Percentage-based
  size: { width: number; height: number };  // Percentage-based
  animation: {
    type: AnimationType;
    startTime: number;
    duration: number;
  };
  tappable?: {
    enabled: boolean;
    reaction: TapReactionType;
    sound?: string;
  };
}

// ============================================================================
// TAPPABLE ELEMENT
// ============================================================================
export interface TappableHotspot {
  id: string;
  hitArea: { 
    x: number; 
    y: number; 
    width: number; 
    height: number; 
  };
  reaction: {
    animation: TapReactionType;
    sound?: string;
    particleEffect?: 'sparkle' | 'hearts' | 'stars' | 'confetti';
  };
  visible: boolean;  // Show outline in editor, hide in reader
}

// ============================================================================
// NARRATION
// ============================================================================
export interface NarrationConfig {
  provider: 'elevenlabs' | 'upload' | 'none';
  voiceId?: string;
  audioUrl?: string;
  text?: string;           // Text to speak (for TTS generation)
  autoPlay: boolean;
  startTime: number;       // When narration starts
}

// ============================================================================
// TIMELINE EVENT
// ============================================================================
export interface TimelineEvent {
  id: string;
  time: number;            // Trigger time in seconds
  targetId: string;        // ID of element to affect
  action: 
    | { type: 'show'; animation: AnimationType }
    | { type: 'hide'; animation: AnimationType }
    | { type: 'animate'; animation: AnimationType }
    | { type: 'playSound'; url: string }
    | { type: 'playNarration' };
}

// ============================================================================
// STORY PAGE
// ============================================================================
export interface StoryPage {
  id: string;
  pageNumber: number;
  duration: number;        // Total page duration in seconds
  
  background: {
    type: 'color' | 'image' | 'gradient';
    value: string;         // Color, URL, or gradient CSS
  };
  
  textBlocks: StoryTextBlock[];
  images: StoryImage[];
  hotspots: TappableHotspot[];
  narration?: NarrationConfig;
  timeline: TimelineEvent[];
}

// ============================================================================
// STORY BOOK
// ============================================================================
export interface StoryBook {
  id: string;
  title: string;
  author?: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
  pages: StoryPage[];
}

// ============================================================================
// PLAYBACK STATE
// ============================================================================
export interface PlaybackState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  currentPageIndex: number;
}

// ============================================================================
// DEFAULT VALUES
// ============================================================================
export const DEFAULT_TEXT_STYLE: TextStyle = {
  fontFamily: 'Playfair Display',
  fontSize: 24,
  fontWeight: 400,
  color: '#1a1a2e',
  lineHeight: 1.5,
};

export const DEFAULT_ANIMATION = {
  type: 'fadeIn' as AnimationType,
  startTime: 0,
  duration: 0.5,
};

export const FONT_OPTIONS = [
  { value: 'Playfair Display', label: 'Playfair Display (Elegant)' },
  { value: 'Crimson Text', label: 'Crimson Text (Classic)' },
  { value: 'Lora', label: 'Lora (Readable)' },
  { value: 'Merriweather', label: 'Merriweather (Warm)' },
  { value: 'Open Sans', label: 'Open Sans (Clean)' },
  { value: 'Poppins', label: 'Poppins (Modern)' },
  { value: 'Fredoka One', label: 'Fredoka One (Playful)' },
  { value: 'Bangers', label: 'Bangers (Comic)' },
  { value: 'Righteous', label: 'Righteous (Bold)' },
];
