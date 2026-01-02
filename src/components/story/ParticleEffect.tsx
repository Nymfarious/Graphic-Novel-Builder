// MeKu Storybook Builder - ParticleEffect Component
// Visual effects for tap reactions (sparkles, hearts, stars)

import React, { useMemo } from 'react';

type ParticleType = 'sparkle' | 'hearts' | 'stars' | 'confetti';

interface ParticleEffectProps {
  type: ParticleType;
  count?: number;
}

export const ParticleEffect: React.FC<ParticleEffectProps> = ({
  type,
  count = 8,
}) => {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * 360;
      const distance = 30 + Math.random() * 40;
      const x = Math.cos((angle * Math.PI) / 180) * distance;
      const y = Math.sin((angle * Math.PI) / 180) * distance - 20; // Bias upward
      const delay = Math.random() * 0.2;
      const scale = 0.5 + Math.random() * 0.5;

      return { id: i, x, y, delay, scale, angle };
    });
  }, [count]);

  const getEmoji = (particleType: ParticleType, index: number): string => {
    switch (particleType) {
      case 'hearts':
        return ['❤️', '💕', '💖', '💗'][index % 4];
      case 'stars':
        return ['⭐', '✨', '🌟', '💫'][index % 4];
      case 'confetti':
        return ['🎉', '🎊', '✨', '🎈'][index % 4];
      case 'sparkle':
      default:
        return '✨';
    }
  };

  return (
    <div className="particle-container absolute inset-0 pointer-events-none overflow-visible">
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="absolute"
          style={{
            left: '50%',
            top: '50%',
            fontSize: `${16 * particle.scale}px`,
            animation: `sparkleFloat 0.8s ease-out forwards`,
            animationDelay: `${particle.delay}s`,
            '--x': `${particle.x}px`,
            '--y': `${particle.y}px`,
          } as React.CSSProperties}
        >
          {getEmoji(type, particle.id)}
        </span>
      ))}
    </div>
  );
};
