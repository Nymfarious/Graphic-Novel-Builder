// MeKu Storybook Builder - Page Builder Store
// Zustand store for managing the storyboard builder state

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  Book, 
  BookPage, 
  Panel, 
  PanelContent,
  LayoutPreset,
  PageOrientation,
  LibraryImage,
  LAYOUT_DEFINITIONS,
  DEFAULT_PAGE,
  DEFAULT_BOOK
} from '@/types/pageBuilder';

// Generate unique IDs
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Deep clone panels from layout definition
const createPanelsFromLayout = (layout: LayoutPreset): Panel[] => {
  const { LAYOUT_DEFINITIONS } = require('@/types/pageBuilder');
  return LAYOUT_DEFINITIONS[layout].map((panel: Panel) => ({
    ...panel,
    id: generateId(),
    content: null,
  }));
};

interface PageBuilderStore {
  // Current book being edited
  currentBook: Book | null;
  
  // Navigation
  currentPageIndex: number;
  selectedPanelId: string | null;
  
  // View settings
  viewMode: 'single' | 'spread';
  zoom: number;
  showGrid: boolean;
  
  // UI state
  sidebarTab: 'layouts' | 'images' | 'text' | 'settings';
  aiPanelOpen: boolean;
  writingStudioOpen: boolean;
  
  // Image library
  imageLibrary: LibraryImage[];
  
  // Actions - Book
  createBook: (title: string, author: string) => void;
  loadBook: (book: Book) => void;
  updateBookSettings: (settings: Partial<Book['settings']>) => void;
  setSourceText: (text: string) => void;
  
  // Actions - Pages
  addPage: (afterIndex?: number) => void;
  deletePage: (pageIndex: number) => void;
  duplicatePage: (pageIndex: number) => void;
  reorderPages: (fromIndex: number, toIndex: number) => void;
  setCurrentPage: (index: number) => void;
  updatePage: (pageIndex: number, updates: Partial<BookPage>) => void;
  
  // Actions - Layout
  setPageLayout: (pageIndex: number, layout: LayoutPreset) => void;
  setPageOrientation: (pageIndex: number, orientation: PageOrientation) => void;
  
  // Actions - Panels
  selectPanel: (panelId: string | null) => void;
  updatePanel: (pageIndex: number, panelId: string, updates: Partial<Panel>) => void;
  setPanelContent: (pageIndex: number, panelId: string, content: PanelContent) => void;
  addTextToPanel: (pageIndex: number, panelId: string, text: string) => void;
  addImageToPanel: (pageIndex: number, panelId: string, imageSrc: string) => void;
  clearPanel: (pageIndex: number, panelId: string) => void;
  
  // Actions - Narration
  setPageNarration: (pageIndex: number, text: string) => void;
  setPageAudio: (pageIndex: number, audioUrl: string) => void;
  
  // Actions - Image Library
  addToLibrary: (image: Omit<LibraryImage, 'id' | 'uploadedAt'>) => void;
  removeFromLibrary: (imageId: string) => void;
  
  // Actions - UI
  setViewMode: (mode: 'single' | 'spread') => void;
  setZoom: (zoom: number) => void;
  toggleGrid: () => void;
  setSidebarTab: (tab: 'layouts' | 'images' | 'text' | 'settings') => void;
  toggleAiPanel: () => void;
  toggleWritingStudio: () => void;
  
  // Navigation helpers
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (pageNumber: number) => void;
  
  // Computed
  getCurrentPage: () => BookPage | null;
  getSelectedPanel: () => Panel | null;
  getTotalPages: () => number;
}

export const usePageBuilderStore = create<PageBuilderStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentBook: null,
      currentPageIndex: 0,
      selectedPanelId: null,
      viewMode: 'single',
      zoom: 100,
      showGrid: false,
      sidebarTab: 'layouts',
      aiPanelOpen: false,
      writingStudioOpen: false,
      imageLibrary: [],

      // Book actions
      createBook: (title, author) => {
        const newBook: Book = {
          id: generateId(),
          title,
          author,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          settings: {
            defaultOrientation: 'portrait',
            pageSize: 'letter',
            language: 'en-US',
          },
          pages: [
            {
              id: generateId(),
              pageNumber: 1,
              orientation: 'portrait',
              layout: 'full',
              panels: createPanelsFromLayout('full'),
              backgroundColor: '#ffffff',
            }
          ],
        };
        set({ currentBook: newBook, currentPageIndex: 0, selectedPanelId: null });
      },

      loadBook: (book) => {
        set({ currentBook: book, currentPageIndex: 0, selectedPanelId: null });
      },

      updateBookSettings: (settings) => {
        const { currentBook } = get();
        if (!currentBook) return;
        set({
          currentBook: {
            ...currentBook,
            settings: { ...currentBook.settings, ...settings },
            updatedAt: new Date().toISOString(),
          }
        });
      },

      setSourceText: (text) => {
        const { currentBook } = get();
        if (!currentBook) return;
        set({
          currentBook: {
            ...currentBook,
            sourceText: { fullText: text },
            updatedAt: new Date().toISOString(),
          }
        });
      },

      // Page actions
      addPage: (afterIndex) => {
        const { currentBook, currentPageIndex } = get();
        if (!currentBook) return;
        
        const insertIndex = afterIndex !== undefined ? afterIndex + 1 : currentBook.pages.length;
        const newPage: BookPage = {
          id: generateId(),
          pageNumber: insertIndex + 1,
          orientation: currentBook.settings.defaultOrientation,
          layout: 'full',
          panels: createPanelsFromLayout('full'),
          backgroundColor: '#ffffff',
        };

        const newPages = [...currentBook.pages];
        newPages.splice(insertIndex, 0, newPage);
        
        // Renumber pages
        newPages.forEach((page, i) => {
          page.pageNumber = i + 1;
        });

        set({
          currentBook: { ...currentBook, pages: newPages, updatedAt: new Date().toISOString() },
          currentPageIndex: insertIndex,
        });
      },

      deletePage: (pageIndex) => {
        const { currentBook, currentPageIndex } = get();
        if (!currentBook || currentBook.pages.length <= 1) return;

        const newPages = currentBook.pages.filter((_, i) => i !== pageIndex);
        newPages.forEach((page, i) => {
          page.pageNumber = i + 1;
        });

        set({
          currentBook: { ...currentBook, pages: newPages, updatedAt: new Date().toISOString() },
          currentPageIndex: Math.min(currentPageIndex, newPages.length - 1),
          selectedPanelId: null,
        });
      },

      duplicatePage: (pageIndex) => {
        const { currentBook } = get();
        if (!currentBook) return;

        const pageToDuplicate = currentBook.pages[pageIndex];
        const newPage: BookPage = {
          ...JSON.parse(JSON.stringify(pageToDuplicate)),
          id: generateId(),
          pageNumber: pageIndex + 2,
        };
        // Generate new IDs for panels
        newPage.panels = newPage.panels.map(panel => ({ ...panel, id: generateId() }));

        const newPages = [...currentBook.pages];
        newPages.splice(pageIndex + 1, 0, newPage);
        newPages.forEach((page, i) => {
          page.pageNumber = i + 1;
        });

        set({
          currentBook: { ...currentBook, pages: newPages, updatedAt: new Date().toISOString() },
          currentPageIndex: pageIndex + 1,
        });
      },

      reorderPages: (fromIndex, toIndex) => {
        const { currentBook } = get();
        if (!currentBook) return;

        const newPages = [...currentBook.pages];
        const [moved] = newPages.splice(fromIndex, 1);
        newPages.splice(toIndex, 0, moved);
        newPages.forEach((page, i) => {
          page.pageNumber = i + 1;
        });

        set({
          currentBook: { ...currentBook, pages: newPages, updatedAt: new Date().toISOString() },
        });
      },

      setCurrentPage: (index) => {
        const { currentBook } = get();
        if (!currentBook) return;
        const safeIndex = Math.max(0, Math.min(index, currentBook.pages.length - 1));
        set({ currentPageIndex: safeIndex, selectedPanelId: null });
      },

      updatePage: (pageIndex, updates) => {
        const { currentBook } = get();
        if (!currentBook) return;

        const newPages = [...currentBook.pages];
        newPages[pageIndex] = { ...newPages[pageIndex], ...updates };

        set({
          currentBook: { ...currentBook, pages: newPages, updatedAt: new Date().toISOString() },
        });
      },

      // Layout actions
      setPageLayout: (pageIndex, layout) => {
        const { currentBook } = get();
        if (!currentBook) return;

        const newPages = [...currentBook.pages];
        newPages[pageIndex] = {
          ...newPages[pageIndex],
          layout,
          panels: createPanelsFromLayout(layout),
        };

        set({
          currentBook: { ...currentBook, pages: newPages, updatedAt: new Date().toISOString() },
          selectedPanelId: null,
        });
      },

      setPageOrientation: (pageIndex, orientation) => {
        const { currentBook } = get();
        if (!currentBook) return;

        const newPages = [...currentBook.pages];
        newPages[pageIndex] = { ...newPages[pageIndex], orientation };

        set({
          currentBook: { ...currentBook, pages: newPages, updatedAt: new Date().toISOString() },
        });
      },

      // Panel actions
      selectPanel: (panelId) => {
        set({ selectedPanelId: panelId });
      },

      updatePanel: (pageIndex, panelId, updates) => {
        const { currentBook } = get();
        if (!currentBook) return;

        const newPages = [...currentBook.pages];
        const page = newPages[pageIndex];
        page.panels = page.panels.map(panel =>
          panel.id === panelId ? { ...panel, ...updates } : panel
        );

        set({
          currentBook: { ...currentBook, pages: newPages, updatedAt: new Date().toISOString() },
        });
      },

      setPanelContent: (pageIndex, panelId, content) => {
        const { updatePanel } = get();
        updatePanel(pageIndex, panelId, { content });
      },

      addTextToPanel: (pageIndex, panelId, text) => {
        const { setPanelContent } = get();
        setPanelContent(pageIndex, panelId, {
          type: 'text',
          content: text,
          style: {
            fontFamily: 'Crimson Text',
            fontSize: 18,
            fontWeight: 400,
            color: '#1a1a2e',
            textAlign: 'left',
            lineHeight: 1.6,
            padding: 16,
          },
        });
      },

      addImageToPanel: (pageIndex, panelId, imageSrc) => {
        const { setPanelContent } = get();
        setPanelContent(pageIndex, panelId, {
          type: 'image',
          src: imageSrc,
          fit: 'cover',
          position: { x: 50, y: 50 },
        });
      },

      clearPanel: (pageIndex, panelId) => {
        const { setPanelContent } = get();
        setPanelContent(pageIndex, panelId, null);
      },

      // Narration actions
      setPageNarration: (pageIndex, text) => {
        const { currentBook, updatePage } = get();
        if (!currentBook) return;
        const page = currentBook.pages[pageIndex];
        updatePage(pageIndex, {
          narration: { ...page.narration, text },
        });
      },

      setPageAudio: (pageIndex, audioUrl) => {
        const { currentBook, updatePage } = get();
        if (!currentBook) return;
        const page = currentBook.pages[pageIndex];
        updatePage(pageIndex, {
          narration: { ...page.narration, text: page.narration?.text || '', audioUrl },
        });
      },

      // Image library actions
      addToLibrary: (image) => {
        const newImage: LibraryImage = {
          ...image,
          id: generateId(),
          uploadedAt: new Date().toISOString(),
        };
        set(state => ({
          imageLibrary: [...state.imageLibrary, newImage],
        }));
      },

      removeFromLibrary: (imageId) => {
        set(state => ({
          imageLibrary: state.imageLibrary.filter(img => img.id !== imageId),
        }));
      },

      // UI actions
      setViewMode: (mode) => set({ viewMode: mode }),
      setZoom: (zoom) => set({ zoom: Math.max(25, Math.min(200, zoom)) }),
      toggleGrid: () => set(state => ({ showGrid: !state.showGrid })),
      setSidebarTab: (tab) => set({ sidebarTab: tab }),
      toggleAiPanel: () => set(state => ({ aiPanelOpen: !state.aiPanelOpen })),
      toggleWritingStudio: () => set(state => ({ writingStudioOpen: !state.writingStudioOpen })),

      // Navigation
      nextPage: () => {
        const { currentBook, currentPageIndex } = get();
        if (!currentBook) return;
        if (currentPageIndex < currentBook.pages.length - 1) {
          set({ currentPageIndex: currentPageIndex + 1, selectedPanelId: null });
        }
      },

      prevPage: () => {
        const { currentPageIndex } = get();
        if (currentPageIndex > 0) {
          set({ currentPageIndex: currentPageIndex - 1, selectedPanelId: null });
        }
      },

      goToPage: (pageNumber) => {
        const { currentBook } = get();
        if (!currentBook) return;
        const index = pageNumber - 1;
        if (index >= 0 && index < currentBook.pages.length) {
          set({ currentPageIndex: index, selectedPanelId: null });
        }
      },

      // Computed
      getCurrentPage: () => {
        const { currentBook, currentPageIndex } = get();
        return currentBook?.pages[currentPageIndex] || null;
      },

      getSelectedPanel: () => {
        const { currentBook, currentPageIndex, selectedPanelId } = get();
        if (!currentBook || !selectedPanelId) return null;
        return currentBook.pages[currentPageIndex]?.panels.find(p => p.id === selectedPanelId) || null;
      },

      getTotalPages: () => {
        const { currentBook } = get();
        return currentBook?.pages.length || 0;
      },
    }),
    {
      name: 'meku-page-builder',
      partialize: (state) => ({
        currentBook: state.currentBook,
        imageLibrary: state.imageLibrary,
        viewMode: state.viewMode,
        zoom: state.zoom,
        showGrid: state.showGrid,
      }),
    }
  )
);
