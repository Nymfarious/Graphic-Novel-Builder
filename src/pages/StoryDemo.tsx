// MeKu Storybook Builder - Story Demo Page
// Test page for the story player functionality

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoryPlayer } from '@/components/story';
import { DEMO_STORY } from '@/data/demoStory';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, BookOpen, Sparkles, ArrowLeft } from 'lucide-react';

// Import the story animations CSS
import '@/styles/story-animations.css';

const StoryDemo: React.FC = () => {
  const navigate = useNavigate();
  const [showPlayer, setShowPlayer] = useState(false);

  if (showPlayer) {
    return (
      <StoryPlayer
        book={DEMO_STORY}
        onClose={() => setShowPlayer(false)}
        onHome={() => navigate('/')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-8 h-8" />
              Story Player Demo
            </h1>
            <p className="text-purple-200">
              Phase 1: One Page That Plays
            </p>
          </div>
        </div>

        {/* Demo Story Card */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white mb-8">
          <CardHeader>
            <div className="flex items-start gap-6">
              {/* Cover image */}
              <div className="w-40 h-52 rounded-lg overflow-hidden bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow-xl">
                <div className="text-6xl">📚</div>
              </div>

              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">{DEMO_STORY.title}</CardTitle>
                <CardDescription className="text-purple-200 mb-4">
                  by {DEMO_STORY.author}
                </CardDescription>

                <div className="flex items-center gap-4 text-sm text-purple-300 mb-6">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {DEMO_STORY.pages.length} pages
                  </span>
                  <span>•</span>
                  <span>Interactive elements</span>
                  <span>•</span>
                  <span>Tap to react!</span>
                </div>

                <Button
                  size="lg"
                  onClick={() => setShowPlayer(true)}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold px-8"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Play Story
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <FeatureCard
            icon="✨"
            title="Animated Text"
            description="Text fades, slides, and bounces onto the page"
          />
          <FeatureCard
            icon="👆"
            title="Tap Reactions"
            description="Tap elements to see fun animations and particles"
          />
          <FeatureCard
            icon="⏱️"
            title="Timeline Control"
            description="Play, pause, and scrub through the story"
          />
        </div>

        {/* Instructions */}
        <Card className="bg-white/5 backdrop-blur border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-lg">How to Use</CardTitle>
          </CardHeader>
          <CardContent className="text-purple-200 space-y-2">
            <p>• <strong>Play/Pause:</strong> Use the controls at the bottom or press Space</p>
            <p>• <strong>Navigate:</strong> Click arrows or use Left/Right arrow keys</p>
            <p>• <strong>Tap elements:</strong> Click on emojis and text to see reactions</p>
            <p>• <strong>Exit:</strong> Click X or press Escape</p>
          </CardContent>
        </Card>

        {/* Phase 1 Checklist */}
        <div className="mt-8 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <h3 className="text-green-400 font-semibold mb-2">✅ Phase 1 Complete!</h3>
          <ul className="text-green-300 text-sm space-y-1">
            <li>✓ StoryText component with animations</li>
            <li>✓ StoryImage component with animations</li>
            <li>✓ Timeline hook for playback control</li>
            <li>✓ Tap reactions with particle effects</li>
            <li>✓ StoryPage renderer</li>
            <li>✓ StoryPlayer with navigation</li>
            <li>✓ CSS animations (fade, slide, bounce, pop, wiggle)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Feature card component
const FeatureCard: React.FC<{
  icon: string;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <Card className="bg-white/5 backdrop-blur border-white/10 text-white">
    <CardContent className="pt-6">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-purple-300">{description}</p>
    </CardContent>
  </Card>
);

export default StoryDemo;
