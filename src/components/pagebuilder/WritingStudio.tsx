// MeKu Storybook Builder - Writing Studio Component
// AI-powered text tools (OPTIONAL - opens behind a button)
// This is for writers who want AI assistance, not for AI to generate the story

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { usePageBuilderStore } from '@/stores/pageBuilderStore';
import {
  X,
  Sparkles,
  BookOpen,
  BarChart3,
  Hash,
  Languages,
  Wand2,
  GraduationCap,
  SpellCheck,
  MessageSquare,
  ChevronRight,
  AlertCircle,
  Key,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface WritingStudioProps {
  className?: string;
}

// Tool definitions - what AI can help with
const AI_TOOLS = [
  {
    id: 'expand',
    icon: Wand2,
    label: 'Expand Text',
    description: 'Make a passage longer with more detail',
  },
  {
    id: 'condense',
    icon: BarChart3,
    label: 'Condense Text',
    description: 'Shorten while keeping meaning',
  },
  {
    id: 'readingLevel',
    icon: GraduationCap,
    label: 'Adjust Reading Level',
    description: 'Rewrite for a specific age/grade',
  },
  {
    id: 'grammar',
    icon: SpellCheck,
    label: 'Grammar & Spelling',
    description: 'Check and fix errors',
  },
  {
    id: 'thesaurus',
    icon: BookOpen,
    label: 'Thesaurus',
    description: 'Find better word choices',
  },
  {
    id: 'translate',
    icon: Languages,
    label: 'Translation Helper',
    description: 'Add foreign language phrases',
  },
  {
    id: 'storyBeats',
    icon: BarChart3,
    label: 'Story Beat Analysis',
    description: 'Analyze narrative structure',
  },
  {
    id: 'wordCount',
    icon: Hash,
    label: 'Word Count & Stats',
    description: 'Detailed text statistics',
  },
];

export const WritingStudio: React.FC<WritingStudioProps> = ({ className }) => {
  const { writingStudioOpen, toggleWritingStudio, currentBook } = usePageBuilderStore();
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false); // Check for API key
  
  // Tool-specific state
  const [readingLevel, setReadingLevel] = useState('5th grade');
  const [languageStyle, setLanguageStyle] = useState<'en-US' | 'en-GB'>('en-US');
  const [targetLanguage, setTargetLanguage] = useState('spanish');

  // Get word count stats
  const getTextStats = (text: string) => {
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    
    return {
      words: words.length,
      sentences: sentences.length,
      paragraphs: paragraphs.length,
      characters,
      charactersNoSpaces,
      avgWordsPerSentence: sentences.length > 0 ? Math.round(words.length / sentences.length) : 0,
      readingTime: Math.ceil(words.length / 200), // ~200 WPM average
    };
  };

  // Simulate AI processing (placeholder - would connect to real API)
  const handleProcess = async () => {
    if (!inputText.trim() || !selectedTool) return;

    setIsProcessing(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Placeholder responses (would be real AI in production)
    switch (selectedTool) {
      case 'wordCount':
        const stats = getTextStats(inputText);
        setOutputText(
          `📊 Text Statistics:\n\n` +
          `Words: ${stats.words}\n` +
          `Sentences: ${stats.sentences}\n` +
          `Paragraphs: ${stats.paragraphs}\n` +
          `Characters: ${stats.characters}\n` +
          `Characters (no spaces): ${stats.charactersNoSpaces}\n` +
          `Avg words/sentence: ${stats.avgWordsPerSentence}\n` +
          `Est. reading time: ${stats.readingTime} min`
        );
        break;
      case 'grammar':
        setOutputText(
          `[Grammar check would analyze and suggest corrections]\n\n` +
          `Language style: ${languageStyle === 'en-US' ? 'American English' : 'British English'}\n\n` +
          `Your text:\n"${inputText}"\n\n` +
          `(Connect your API key to enable real grammar checking)`
        );
        break;
      default:
        setOutputText(
          `[${AI_TOOLS.find(t => t.id === selectedTool)?.label} would process here]\n\n` +
          `Connect your AI API key in Settings to enable this feature.\n\n` +
          `Input text:\n"${inputText.substring(0, 100)}${inputText.length > 100 ? '...' : ''}"`
        );
    }

    setIsProcessing(false);
  };

  const renderToolPanel = () => {
    switch (selectedTool) {
      case 'readingLevel':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Target Reading Level</Label>
              <Select value={readingLevel} onValueChange={setReadingLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3 year old">3 Year Old</SelectItem>
                  <SelectItem value="kindergarten">Kindergarten</SelectItem>
                  <SelectItem value="1st grade">1st Grade</SelectItem>
                  <SelectItem value="2nd grade">2nd Grade</SelectItem>
                  <SelectItem value="3rd grade">3rd Grade</SelectItem>
                  <SelectItem value="4th grade">4th Grade</SelectItem>
                  <SelectItem value="5th grade">5th Grade</SelectItem>
                  <SelectItem value="middle school">Middle School</SelectItem>
                  <SelectItem value="high school">High School</SelectItem>
                  <SelectItem value="adult">Adult</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'grammar':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Language Style</Label>
              <Select value={languageStyle} onValueChange={(v: 'en-US' | 'en-GB') => setLanguageStyle(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en-US">🇺🇸 American English</SelectItem>
                  <SelectItem value="en-GB">🇬🇧 British English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'translate':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Include Translation In</Label>
              <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spanish">🇪🇸 Spanish</SelectItem>
                  <SelectItem value="french">🇫🇷 French</SelectItem>
                  <SelectItem value="german">🇩🇪 German</SelectItem>
                  <SelectItem value="italian">🇮🇹 Italian</SelectItem>
                  <SelectItem value="japanese">🇯🇵 Japanese</SelectItem>
                  <SelectItem value="mandarin">🇨🇳 Mandarin</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Add words or phrases in another language for cross-teaching
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Sheet open={writingStudioOpen} onOpenChange={toggleWritingStudio}>
      <SheetContent side="right" className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Writing Studio
          </SheetTitle>
          <SheetDescription>
            AI-powered tools to help refine your writing. Your words, enhanced.
          </SheetDescription>
        </SheetHeader>

        {/* API Key Warning */}
        {!hasApiKey && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-amber-800">AI features require an API key</p>
              <p className="text-amber-700">
                Add your Gemini or other AI key in Settings to enable these tools.
              </p>
              <Button variant="link" size="sm" className="h-auto p-0 text-amber-700">
                <Key className="w-3 h-3 mr-1" />
                Configure API Key
              </Button>
            </div>
          </div>
        )}

        <Tabs defaultValue="tools" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="workspace">Workspace</TabsTrigger>
          </TabsList>

          {/* Tools Tab */}
          <TabsContent value="tools" className="mt-4">
            <ScrollArea className="h-[calc(100vh-300px)]">
              <div className="grid grid-cols-2 gap-2">
                {AI_TOOLS.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => setSelectedTool(tool.id)}
                    className={cn(
                      'p-3 rounded-lg border text-left transition-all',
                      selectedTool === tool.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <tool.icon className={cn(
                      'w-5 h-5 mb-1',
                      selectedTool === tool.id ? 'text-purple-600' : 'text-gray-600'
                    )} />
                    <p className="font-medium text-sm">{tool.label}</p>
                    <p className="text-xs text-gray-500">{tool.description}</p>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Workspace Tab */}
          <TabsContent value="workspace" className="mt-4 space-y-4">
            {selectedTool ? (
              <>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="gap-1">
                    {React.createElement(AI_TOOLS.find(t => t.id === selectedTool)?.icon || Sparkles, { className: 'w-3 h-3' })}
                    {AI_TOOLS.find(t => t.id === selectedTool)?.label}
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedTool(null)}>
                    Change Tool
                  </Button>
                </div>

                {/* Tool-specific options */}
                {renderToolPanel()}

                {/* Input */}
                <div className="space-y-2">
                  <Label>Your Text</Label>
                  <Textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Paste or type your text here..."
                    className="min-h-[120px]"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{inputText.split(/\s+/).filter(w => w).length} words</span>
                    <Button
                      onClick={handleProcess}
                      disabled={!inputText.trim() || isProcessing}
                      size="sm"
                    >
                      {isProcessing ? 'Processing...' : 'Process'}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>

                {/* Output */}
                {outputText && (
                  <div className="space-y-2">
                    <Label>Result</Label>
                    <div className="p-3 bg-gray-50 rounded-lg border min-h-[100px] whitespace-pre-wrap text-sm">
                      {outputText}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(outputText)}>
                        Copy
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setInputText(outputText)}>
                        Use as Input
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Select a tool from the Tools tab to get started</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Import from book source */}
        {currentBook?.sourceText && (
          <Accordion type="single" collapsible className="mt-4">
            <AccordionItem value="source">
              <AccordionTrigger className="text-sm">
                <BookOpen className="w-4 h-4 mr-2" />
                Import from Source Text
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-xs text-gray-500 mb-2">
                  Your imported manuscript is available. Select text to work with.
                </p>
                <ScrollArea className="h-32 border rounded p-2">
                  <p className="text-sm whitespace-pre-wrap">
                    {currentBook.sourceText.fullText.substring(0, 500)}
                    {currentBook.sourceText.fullText.length > 500 && '...'}
                  </p>
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </SheetContent>
    </Sheet>
  );
};
