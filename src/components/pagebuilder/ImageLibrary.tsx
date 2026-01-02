// MeKu Storybook Builder - Image Library Component
// Upload and manage images for use in panels

import React, { useCallback, useState } from 'react';
import { cn } from '@/lib/utils';
import { usePageBuilderStore } from '@/stores/pageBuilderStore';
import { Upload, Trash2, Image as ImageIcon, Search, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ImageLibraryProps {
  className?: string;
}

export const ImageLibrary: React.FC<ImageLibraryProps> = ({ className }) => {
  const { imageLibrary, addToLibrary, removeFromLibrary } = usePageBuilderStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteImageId, setDeleteImageId] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Filter images by search
  const filteredImages = imageLibrary.filter(img =>
    img.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
    img.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Handle file upload
  const handleFileUpload = useCallback((files: FileList) => {
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const src = e.target?.result as string;
          addToLibrary({
            src,
            filename: file.name,
            tags: [],
          });
        };
        reader.readAsDataURL(file);
      }
    });
  }, [addToLibrary]);

  // Handle drag events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  // Handle image drag start (for dragging to panels)
  const handleImageDragStart = (e: React.DragEvent, image: typeof imageLibrary[0]) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ src: image.src }));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search images..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>

      {/* Upload area */}
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-4 mb-3 text-center transition-colors',
          isDraggingOver
            ? 'border-purple-500 bg-purple-50'
            : 'border-gray-300 hover:border-gray-400'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600 mb-2">
          Drag & drop images here
        </p>
        <label>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          />
          <Button variant="outline" size="sm" asChild>
            <span className="cursor-pointer">
              <FolderOpen className="w-4 h-4 mr-2" />
              Browse Files
            </span>
          </Button>
        </label>
      </div>

      {/* Image grid */}
      <ScrollArea className="flex-1">
        {filteredImages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">
              {imageLibrary.length === 0
                ? 'No images yet. Upload some!'
                : 'No images match your search.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="relative group aspect-square rounded overflow-hidden border cursor-grab active:cursor-grabbing"
                draggable
                onDragStart={(e) => handleImageDragStart(e, image)}
              >
                <img
                  src={image.src}
                  alt={image.filename}
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <p className="text-white text-xs px-2 text-center truncate w-full">
                    {image.filename}
                  </p>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteImageId(image.id)}
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>

                {/* Drag hint */}
                <div className="absolute bottom-1 right-1 bg-black/50 text-white text-[10px] px-1 rounded opacity-0 group-hover:opacity-100">
                  Drag to panel
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Image count */}
      <div className="text-xs text-gray-500 mt-2 pt-2 border-t">
        {imageLibrary.length} image{imageLibrary.length !== 1 ? 's' : ''} in library
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteImageId} onOpenChange={() => setDeleteImageId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the image from your library. Images already placed in panels will not be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteImageId) {
                  removeFromLibrary(deleteImageId);
                  setDeleteImageId(null);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
