// MeKu Storybook Builder - Editable Panel Component
// A panel that can contain text (editable directly) or image

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { usePageBuilderStore } from '@/stores/pageBuilderStore';
import type { Panel, PanelTextContent } from '@/types/pageBuilder';
import { Type, Image as ImageIcon, X, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from '@/components/ui/context-menu';

interface EditablePanelProps {
  panel: Panel;
  pageIndex: number;
  isSelected: boolean;
  onSelect: () => void;
}

export const EditablePanel: React.FC<EditablePanelProps> = ({
  panel,
  pageIndex,
  isSelected,
  onSelect,
}) => {
  const [isEditingText, setIsEditingText] = useState(false);
  const [textValue, setTextValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { 
    setPanelContent, 
    addTextToPanel, 
    addImageToPanel,
    clearPanel,
    addToLibrary,
  } = usePageBuilderStore();

  // Sync text value when panel content changes
  useEffect(() => {
    if (panel.content?.type === 'text') {
      setTextValue(panel.content.content);
    }
  }, [panel.content]);

  // Focus textarea when editing starts
  useEffect(() => {
    if (isEditingText && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditingText]);

  // Handle text save
  const saveText = () => {
    if (textValue.trim()) {
      if (panel.content?.type === 'text') {
        // Update existing text
        setPanelContent(pageIndex, panel.id, {
          ...panel.content,
          content: textValue,
        });
      } else {
        // Add new text
        addTextToPanel(pageIndex, panel.id, textValue);
      }
    } else {
      clearPanel(pageIndex, panel.id);
    }
    setIsEditingText(false);
  };

  // Handle key events in textarea
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditingText(false);
      setTextValue(panel.content?.type === 'text' ? panel.content.content : '');
    }
    // Ctrl/Cmd + Enter to save
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      saveText();
    }
  };

  // Handle image drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    // Handle dropped files
    if (e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const src = event.target?.result as string;
          addImageToPanel(pageIndex, panel.id, src);
          // Also add to library
          addToLibrary({ src, filename: file.name });
        };
        reader.readAsDataURL(file);
      }
    }
    
    // Handle dropped library image (data transfer)
    const imageData = e.dataTransfer.getData('application/json');
    if (imageData) {
      try {
        const { src } = JSON.parse(imageData);
        addImageToPanel(pageIndex, panel.id, src);
      } catch (err) {
        console.error('Failed to parse dropped image data');
      }
    }
  };

  // Handle click to add text
  const handleAddText = () => {
    setTextValue('');
    setIsEditingText(true);
  };

  // Handle double click to edit existing text
  const handleDoubleClick = () => {
    if (panel.content?.type === 'text') {
      setIsEditingText(true);
    }
  };

  // Render panel content
  const renderContent = () => {
    // Editing mode
    if (isEditingText) {
      const textStyle = (panel.content as PanelTextContent)?.style;
      return (
        <div className="absolute inset-0 p-2">
          <textarea
            ref={textareaRef}
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            onBlur={saveText}
            onKeyDown={handleKeyDown}
            className="w-full h-full resize-none border-2 border-purple-500 rounded bg-white/95 p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            style={{
              fontFamily: textStyle?.fontFamily || 'Crimson Text',
              fontSize: `${textStyle?.fontSize || 18}px`,
              color: textStyle?.color || '#1a1a2e',
              lineHeight: textStyle?.lineHeight || 1.6,
            }}
            placeholder="Type your text here..."
          />
          <div className="absolute bottom-4 right-4 text-xs text-gray-500">
            Ctrl+Enter to save • Esc to cancel
          </div>
        </div>
      );
    }

    // Display content
    if (!panel.content) {
      // Empty panel
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gray-400">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => { e.stopPropagation(); handleAddText(); }}
              className="gap-1"
            >
              <Type className="w-4 h-4" />
              Add Text
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => e.stopPropagation()}
              className="gap-1"
            >
              <ImageIcon className="w-4 h-4" />
              Add Image
            </Button>
          </div>
          <span className="text-xs">or drag & drop an image</span>
        </div>
      );
    }

    if (panel.content.type === 'text') {
      const { content, style } = panel.content;
      return (
        <div
          className="absolute inset-0 overflow-auto cursor-text"
          style={{
            fontFamily: style.fontFamily,
            fontSize: `${style.fontSize}px`,
            fontWeight: style.fontWeight,
            color: style.color,
            textAlign: style.textAlign,
            lineHeight: style.lineHeight,
            padding: `${style.padding}px`,
          }}
          onDoubleClick={handleDoubleClick}
        >
          {content}
        </div>
      );
    }

    if (panel.content.type === 'image') {
      const { src, alt, fit, position } = panel.content;
      return (
        <img
          src={src}
          alt={alt || ''}
          className="absolute inset-0 w-full h-full"
          style={{
            objectFit: fit,
            objectPosition: `${position.x}% ${position.y}%`,
          }}
          draggable={false}
        />
      );
    }

    return null;
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          className={cn(
            'absolute border transition-all cursor-pointer',
            isSelected 
              ? 'border-purple-500 border-2 shadow-lg shadow-purple-500/20' 
              : 'border-gray-200 hover:border-purple-300',
            !panel.content && 'border-dashed bg-gray-50/50'
          )}
          style={{
            left: `${panel.bounds.x}%`,
            top: `${panel.bounds.y}%`,
            width: `${panel.bounds.width}%`,
            height: `${panel.bounds.height}%`,
          }}
          onClick={onSelect}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          {renderContent()}
          
          {/* Selection indicator */}
          {isSelected && !isEditingText && (
            <div className="absolute -top-6 left-0 bg-purple-500 text-white text-xs px-2 py-0.5 rounded-t">
              Panel {panel.id.slice(-4)}
            </div>
          )}
        </div>
      </ContextMenuTrigger>

      <ContextMenuContent>
        <ContextMenuItem onClick={handleAddText}>
          <Type className="w-4 h-4 mr-2" />
          {panel.content?.type === 'text' ? 'Edit Text' : 'Add Text'}
        </ContextMenuItem>
        <ContextMenuItem>
          <ImageIcon className="w-4 h-4 mr-2" />
          {panel.content?.type === 'image' ? 'Replace Image' : 'Add Image'}
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem 
          onClick={() => clearPanel(pageIndex, panel.id)}
          disabled={!panel.content}
          className="text-red-600"
        >
          <X className="w-4 h-4 mr-2" />
          Clear Panel
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
