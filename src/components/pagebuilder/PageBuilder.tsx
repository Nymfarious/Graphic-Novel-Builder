// MeKu Storybook Builder - Page Builder Component
// The main storyboard builder interface

import React, { useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { usePageBuilderStore } from '@/stores/pageBuilderStore';
import { PageCanvas } from './PageCanvas';
import { PageStrip } from './PageStrip';
import { LayoutSelector } from './LayoutSelector';
import { ImageLibrary } from './ImageLibrary';
import { WritingStudio } from './WritingStudio';
import {
  LayoutGrid,
  Image as ImageIcon,
  FileText,
  Settings,
  Sparkles,
  BookOpen,
  ZoomIn,
  ZoomOut,
  Grid3X3,
  Columns,
  Square,
  Save,
  Download,
  Upload,
  Play,
  Undo,
  Redo,
  Keyboard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface PageBuilderProps {
  className?: string;
}

export const PageBuilder: React.FC<PageBuilderProps> = ({ className }) => {
  const {
    currentBook,
    currentPageIndex,
    viewMode,
    zoom,
    showGrid,
    sidebarTab,
    createBook,
    setViewMode,
    setZoom,
    toggleGrid,
    setSidebarTab,
    toggleWritingStudio,
    setSourceText,
    nextPage,
    prevPage,
    addPage,
  } = usePageBuilderStore();

  // Create a default book if none exists
  useEffect(() => {
    if (!currentBook) {
      createBook('My Storybook', 'Author');
    }
  }, [currentBook, createBook]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Do not capture if user is typing in an input/textarea
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        prevPage();
        break;
      case 'ArrowRight':
        e.preventDefault();
        nextPage();
        break;
      case 'n':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          addPage(currentPageIndex);
        }
        break;
      case '+':
      case '=':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          setZoom(zoom + 10);
        }
        break;
      case '-':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          setZoom(zoom - 10);
        }
        break;
      case 'g':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          toggleGrid();
        }
        break;
    }
  }, [prevPage, nextPage, addPage, currentPageIndex, zoom, setZoom, toggleGrid]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Sidebar content based on tab
  const renderSidebarContent = () => {
    switch (sidebarTab) {
      case 'layouts':
        return <LayoutSelector />;
      case 'images':
        return <ImageLibrary />;
      case 'text':
        return <TextImporter />;
      case 'settings':
        return <PageSettings />;
      default:
        return null;
    }
  };

  return (
    <div className={cn('flex flex-col h-screen bg-gray-100', className)}>
      {/* Top toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b">
        {/* Left: Book info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-600" />
            <span className="font-medium">{currentBook?.title || 'Untitled'}</span>
          </div>
          <Separator orientation="vertical" className="h-6" />
          <span className="text-sm text-gray-500">
            Page {currentPageIndex + 1} of {currentBook?.pages.length || 0}
          </span>
        </div>

        {/* Center: View controls */}
        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={viewMode === 'single' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('single')}
                >
                  <Square className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Single Page View</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={viewMode === 'spread' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('spread')}
                >
                  <Columns className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Book Spread View</TooltipContent>
            </Tooltip>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Zoom controls */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={() => setZoom(zoom - 10)}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom Out</TooltipContent>
            </Tooltip>
            <span className="text-sm w-12 text-center">{zoom}%</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={() => setZoom(zoom + 10)}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom In</TooltipContent>
            </Tooltip>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Grid toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={showGrid ? 'default' : 'ghost'}
                size="sm"
                onClick={toggleGrid}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle Grid (Ctrl+G)</TooltipContent>
          </Tooltip>

          {/* Keyboard shortcuts hint */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="text-gray-400">
                <Keyboard className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              <p className="font-medium mb-1">Keyboard Shortcuts</p>
              <ul className="text-xs space-y-0.5">
                <li>← → Navigate pages</li>
                <li>Ctrl+N New page</li>
                <li>Ctrl+G Toggle grid</li>
                <li>Ctrl++/- Zoom in/out</li>
              </ul>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* AI Writing Studio button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={toggleWritingStudio}>
                <Sparkles className="w-4 h-4 mr-2" />
                Writing Studio
              </Button>
            </TooltipTrigger>
            <TooltipContent>Open AI Writing Tools</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-6" />

          <Button variant="ghost" size="sm">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>

          <Button variant="default" size="sm">
            <Play className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r flex flex-col">
          {/* Sidebar tabs */}
          <div className="flex border-b">
            {[
              { id: 'layouts', icon: LayoutGrid, label: 'Layouts' },
              { id: 'images', icon: ImageIcon, label: 'Images' },
              { id: 'text', icon: FileText, label: 'Text' },
              { id: 'settings', icon: Settings, label: 'Settings' },
            ].map((tab) => (
              <Tooltip key={tab.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setSidebarTab(tab.id as typeof sidebarTab)}
                    className={cn(
                      'flex-1 p-3 flex flex-col items-center gap-1 transition-colors',
                      sidebarTab === tab.id
                        ? 'bg-purple-50 text-purple-600 border-b-2 border-purple-600'
                        : 'text-gray-500 hover:bg-gray-50'
                    )}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="text-xs">{tab.label}</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">{tab.label}</TooltipContent>
              </Tooltip>
            ))}
          </div>

          {/* Sidebar content */}
          <ScrollArea className="flex-1 p-4">
            {renderSidebarContent()}
          </ScrollArea>
        </div>

        {/* Canvas area */}
        <div className="flex-1 flex flex-col">
          <PageCanvas className="flex-1" />
        </div>
      </div>

      {/* Bottom page strip */}
      <PageStrip />

      {/* Writing Studio (slide-out panel) */}
      <WritingStudio />
    </div>
  );
};

// ============================================================================
// TEXT IMPORTER COMPONENT
// ============================================================================

const TextImporter: React.FC = () => {
  const { currentBook, setSourceText } = usePageBuilderStore();
  const [importText, setImportText] = React.useState('');
  const [showDialog, setShowDialog] = React.useState(false);

  const handleImport = () => {
    setSourceText(importText);
    setShowDialog(false);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Import Your Story</Label>
        <p className="text-xs text-gray-500">
          Paste your manuscript or story text here. You can then use it to fill text panels.
        </p>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full gap-2">
            <Upload className="w-4 h-4" />
            Import Text
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Import Your Story Text</DialogTitle>
            <DialogDescription>
              Paste your manuscript, story, or any text you want to turn into a storybook.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="Once upon a time..."
            className="min-h-[300px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleImport}>
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Show imported text preview */}
      {currentBook?.sourceText && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Imported Text</Label>
          <div className="p-3 bg-gray-50 rounded border text-sm max-h-40 overflow-auto">
            {currentBook.sourceText.fullText.substring(0, 300)}
            {currentBook.sourceText.fullText.length > 300 && '...'}
          </div>
          <p className="text-xs text-gray-500">
            {currentBook.sourceText.fullText.split(/\s+/).length} words imported
          </p>
        </div>
      )}

      <Separator />

      <div className="space-y-2">
        <Label className="text-sm font-medium">Quick Add</Label>
        <p className="text-xs text-gray-500">
          Click on a panel and start typing, or right-click to add text.
        </p>
      </div>
    </div>
  );
};

// ============================================================================
// PAGE SETTINGS COMPONENT
// ============================================================================

const PageSettings: React.FC = () => {
  const { currentBook, currentPageIndex, updatePage, updateBookSettings } = usePageBuilderStore();

  if (!currentBook) return null;

  const currentPage = currentBook.pages[currentPageIndex];

  return (
    <div className="space-y-4">
      {/* Page background */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Page Background</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={currentPage.backgroundColor}
            onChange={(e) => updatePage(currentPageIndex, { backgroundColor: e.target.value })}
            className="w-12 h-8 p-0 border-0"
          />
          <Input
            type="text"
            value={currentPage.backgroundColor}
            onChange={(e) => updatePage(currentPageIndex, { backgroundColor: e.target.value })}
            className="flex-1"
          />
        </div>
      </div>

      <Separator />

      {/* Book settings */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Book Title</Label>
        <Input
          value={currentBook.title}
          onChange={(e) => updateBookSettings({ ...currentBook.settings })}
          placeholder="Book title"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Author</Label>
        <Input
          value={currentBook.author}
          placeholder="Author name"
        />
      </div>

      <Separator />

      {/* Page notes */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Page Notes</Label>
        <Textarea
          value={currentPage.notes || ''}
          onChange={(e) => updatePage(currentPageIndex, { notes: e.target.value })}
          placeholder="Notes for this page (not shown in reader)"
          className="min-h-[80px]"
        />
      </div>
    </div>
  );
};

export default PageBuilder;
