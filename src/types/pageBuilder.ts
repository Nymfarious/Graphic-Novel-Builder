// MeKu Storybook Builder - Page Builder Types
// Core data structures for the manual storyboard builder

// ============================================================================
// PANEL LAYOUTS
// ============================================================================

export type LayoutPreset = 
  | 'full'           // Single full-page panel
  | 'half-h'         // Two panels, horizontal split
  | 'half-v'         // Two panels, vertical split
  | 'thirds-h'       // Three panels, horizontal
  | 'thirds-v'       // Three panels, vertical
  | 'hero-top'       // Large top, small bottom
  | 'hero-bottom'    // Small top, large bottom
  | 'hero-left'      // Large left, small right
  | 'hero-right'     // Small left, large right
  | 'quad'           // 2x2 grid
  | 'comic-6'        // 2x3 comic grid
  | 'comic-9'        // 3x3 comic grid
  | 'custom';        // User-defined

export type PageOrientation = 'portrait' | 'landscape';

// ============================================================================
// PANEL CONTENT
// ============================================================================

export interface PanelTextContent {
  type: 'text';
  content: string;
  style: {
    fontFamily: string;
    fontSize: number;
    fontWeight: number;
    color: string;
    textAlign: 'left' | 'center' | 'right' | 'justify';
    lineHeight: number;
    padding: number;
  };
}

export interface PanelImageContent {
  type: 'image';
  src: string;
  alt?: string;
  fit: 'cover' | 'contain' | 'fill';
  position: { x: number; y: number };  // Percentage offset
  // AI Enhancement flags (for later)
  aiEnhancements?: {
    removeBackground?: boolean;
    animation?: AnimationPath | null;
  };
}

export interface AnimationPath {
  type: 'walk' | 'move' | 'gesture';
  waypoints: { x: number; y: number; action?: string }[];
  duration: number;
}

export type PanelContent = PanelTextContent | PanelImageContent | null;

// ============================================================================
// PANEL
// ============================================================================

export interface Panel {
  id: string;
  // Position within the page (percentage-based)
  bounds: {
    x: number;      // Left position (0-100)
    y: number;      // Top position (0-100)
    width: number;  // Width (0-100)
    height: number; // Height (0-100)
  };
  content: PanelContent;
  zIndex: number;
  // Animation settings for Reader playback
  animation?: {
    enterAnimation: 'none' | 'fadeIn' | 'slideUp' | 'slideLeft' | 'bounce';
    enterDelay: number;   // Seconds
    duration: number;     // How long visible (0 = until page ends)
  };
}

// ============================================================================
// PAGE
// ============================================================================

export interface BookPage {
  id: string;
  pageNumber: number;
  orientation: PageOrientation;
  layout: LayoutPreset;
  panels: Panel[];
  backgroundColor: string;
  backgroundImage?: string;
  // Narration for this page
  narration?: {
    text: string;           // The text to be read
    audioUrl?: string;      // Pre-recorded or AI-generated audio
    wordTimings?: {         // For word-by-word highlight
      word: string;
      startTime: number;
      endTime: number;
    }[];
  };
  // Page notes (for author reference, not shown in Reader)
  notes?: string;
}

// ============================================================================
// BOOK
// ============================================================================

export interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
  // Book settings
  settings: {
    defaultOrientation: PageOrientation;
    pageSize: 'letter' | 'a4' | 'square' | 'wide';
    readingLevel?: string;
    language: 'en-US' | 'en-GB' | string;
  };
  pages: BookPage[];
  // Imported source text (the author's original manuscript)
  sourceText?: {
    fullText: string;
    chapters?: {
      title: string;
      content: string;
    }[];
  };
}

// ============================================================================
// IMAGE LIBRARY
// ============================================================================

export interface LibraryImage {
  id: string;
  src: string;
  filename: string;
  uploadedAt: string;
  tags?: string[];
  // AI-processed versions
  variants?: {
    original: string;
    noBg?: string;        // Background removed
    thumbnail?: string;
  };
}

// ============================================================================
// EDITOR STATE
// ============================================================================

export interface PageBuilderState {
  currentBook: Book | null;
  currentPageIndex: number;
  selectedPanelId: string | null;
  viewMode: 'single' | 'spread';  // Single page or book spread
  zoom: number;
  showGrid: boolean;
  // UI state
  sidebarTab: 'layouts' | 'images' | 'text' | 'settings';
  aiPanelOpen: boolean;
}

// ============================================================================
// LAYOUT DEFINITIONS
// ============================================================================

export const LAYOUT_DEFINITIONS: Record<LayoutPreset, Panel[]> = {
  'full': [
    { id: 'p1', bounds: { x: 0, y: 0, width: 100, height: 100 }, content: null, zIndex: 0 }
  ],
  'half-h': [
    { id: 'p1', bounds: { x: 0, y: 0, width: 100, height: 50 }, content: null, zIndex: 0 },
    { id: 'p2', bounds: { x: 0, y: 50, width: 100, height: 50 }, content: null, zIndex: 0 }
  ],
  'half-v': [
    { id: 'p1', bounds: { x: 0, y: 0, width: 50, height: 100 }, content: null, zIndex: 0 },
    { id: 'p2', bounds: { x: 50, y: 0, width: 50, height: 100 }, content: null, zIndex: 0 }
  ],
  'thirds-h': [
    { id: 'p1', bounds: { x: 0, y: 0, width: 100, height: 33.33 }, content: null, zIndex: 0 },
    { id: 'p2', bounds: { x: 0, y: 33.33, width: 100, height: 33.33 }, content: null, zIndex: 0 },
    { id: 'p3', bounds: { x: 0, y: 66.66, width: 100, height: 33.34 }, content: null, zIndex: 0 }
  ],
  'thirds-v': [
    { id: 'p1', bounds: { x: 0, y: 0, width: 33.33, height: 100 }, content: null, zIndex: 0 },
    { id: 'p2', bounds: { x: 33.33, y: 0, width: 33.33, height: 100 }, content: null, zIndex: 0 },
    { id: 'p3', bounds: { x: 66.66, y: 0, width: 33.34, height: 100 }, content: null, zIndex: 0 }
  ],
  'hero-top': [
    { id: 'p1', bounds: { x: 0, y: 0, width: 100, height: 65 }, content: null, zIndex: 0 },
    { id: 'p2', bounds: { x: 0, y: 65, width: 100, height: 35 }, content: null, zIndex: 0 }
  ],
  'hero-bottom': [
    { id: 'p1', bounds: { x: 0, y: 0, width: 100, height: 35 }, content: null, zIndex: 0 },
    { id: 'p2', bounds: { x: 0, y: 35, width: 100, height: 65 }, content: null, zIndex: 0 }
  ],
  'hero-left': [
    { id: 'p1', bounds: { x: 0, y: 0, width: 65, height: 100 }, content: null, zIndex: 0 },
    { id: 'p2', bounds: { x: 65, y: 0, width: 35, height: 100 }, content: null, zIndex: 0 }
  ],
  'hero-right': [
    { id: 'p1', bounds: { x: 0, y: 0, width: 35, height: 100 }, content: null, zIndex: 0 },
    { id: 'p2', bounds: { x: 35, y: 0, width: 65, height: 100 }, content: null, zIndex: 0 }
  ],
  'quad': [
    { id: 'p1', bounds: { x: 0, y: 0, width: 50, height: 50 }, content: null, zIndex: 0 },
    { id: 'p2', bounds: { x: 50, y: 0, width: 50, height: 50 }, content: null, zIndex: 0 },
    { id: 'p3', bounds: { x: 0, y: 50, width: 50, height: 50 }, content: null, zIndex: 0 },
    { id: 'p4', bounds: { x: 50, y: 50, width: 50, height: 50 }, content: null, zIndex: 0 }
  ],
  'comic-6': [
    { id: 'p1', bounds: { x: 0, y: 0, width: 50, height: 33.33 }, content: null, zIndex: 0 },
    { id: 'p2', bounds: { x: 50, y: 0, width: 50, height: 33.33 }, content: null, zIndex: 0 },
    { id: 'p3', bounds: { x: 0, y: 33.33, width: 50, height: 33.33 }, content: null, zIndex: 0 },
    { id: 'p4', bounds: { x: 50, y: 33.33, width: 50, height: 33.33 }, content: null, zIndex: 0 },
    { id: 'p5', bounds: { x: 0, y: 66.66, width: 50, height: 33.34 }, content: null, zIndex: 0 },
    { id: 'p6', bounds: { x: 50, y: 66.66, width: 50, height: 33.34 }, content: null, zIndex: 0 }
  ],
  'comic-9': [
    { id: 'p1', bounds: { x: 0, y: 0, width: 33.33, height: 33.33 }, content: null, zIndex: 0 },
    { id: 'p2', bounds: { x: 33.33, y: 0, width: 33.33, height: 33.33 }, content: null, zIndex: 0 },
    { id: 'p3', bounds: { x: 66.66, y: 0, width: 33.34, height: 33.33 }, content: null, zIndex: 0 },
    { id: 'p4', bounds: { x: 0, y: 33.33, width: 33.33, height: 33.33 }, content: null, zIndex: 0 },
    { id: 'p5', bounds: { x: 33.33, y: 33.33, width: 33.33, height: 33.33 }, content: null, zIndex: 0 },
    { id: 'p6', bounds: { x: 66.66, y: 33.33, width: 33.34, height: 33.33 }, content: null, zIndex: 0 },
    { id: 'p7', bounds: { x: 0, y: 66.66, width: 33.33, height: 33.34 }, content: null, zIndex: 0 },
    { id: 'p8', bounds: { x: 33.33, y: 66.66, width: 33.33, height: 33.34 }, content: null, zIndex: 0 },
    { id: 'p9', bounds: { x: 66.66, y: 66.66, width: 33.34, height: 33.34 }, content: null, zIndex: 0 }
  ],
  'custom': []
};

// ============================================================================
// DEFAULT VALUES
// ============================================================================

export const DEFAULT_TEXT_STYLE: PanelTextContent['style'] = {
  fontFamily: 'Crimson Text',
  fontSize: 18,
  fontWeight: 400,
  color: '#1a1a2e',
  textAlign: 'left',
  lineHeight: 1.6,
  padding: 16,
};

export const DEFAULT_PAGE: Omit<BookPage, 'id' | 'pageNumber'> = {
  orientation: 'portrait',
  layout: 'full',
  panels: [],
  backgroundColor: '#ffffff',
};

export const DEFAULT_BOOK: Omit<Book, 'id' | 'createdAt' | 'updatedAt' | 'pages'> = {
  title: 'Untitled Book',
  author: '',
  settings: {
    defaultOrientation: 'portrait',
    pageSize: 'letter',
    language: 'en-US',
  },
};
