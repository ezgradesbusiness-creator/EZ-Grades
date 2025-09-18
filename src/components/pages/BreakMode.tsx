import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Headphones, 
  Play, 
  Pause, 
  SkipForward, 
  Volume2, 
  Gamepad2,
  Dumbbell,
  Coffee,
  Shuffle
} from 'lucide-react';
import { GlassCard } from '../GlassCard';
import { LuxuryButton } from '../LuxuryButton';
import { LuxuryBadge } from '../LuxuryBadge';

interface MiniGame {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: 'memory' | 'puzzle' | 'reflex';
}

interface StretchExercise {
  id: string;
  name: string;
  duration: number;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export function BreakMode() {
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathingTimer, setBreathingTimer] = useState(0);
  const [currentTrack, setCurrentTrack] = useState('Relaxing Piano');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeLevel] = useState(70);

  const miniGames: MiniGame[] = [
    {
      id: '1',
      title: 'Memory Cards',
      description: 'Match pairs of cards to improve memory',
      duration: '3-5 min',
      category: 'memory'
    },
    {
      id: '2',
      title: 'Quick Math',
      description: 'Solve simple equations quickly',
      duration: '2-3 min',
      category: 'puzzle'
    },
    {
      id: '3',
      title: 'Color Match',
      description: 'Match colors as fast as you can',
      duration: '1-2 min',
      category: 'reflex'
    },
    {
      id: '4',
      title: 'Word Puzzle',
      description: 'Find words in a letter grid',
      duration: '5-7 min',
      category: 'puzzle'
    }
  ];

  const stretchExercises: StretchExercise[] = [
    {
      id: '1',
      name: 'Neck Rolls',
      duration: 30,
      description: 'Gently roll your neck in circles',
      difficulty: 'easy'
    },
    {
      id: '2',
      name: 'Shoulder Shrugs',
      duration: 20,
      description: 'Lift shoulders up and release tension',
      difficulty: 'easy'
    },
    {
      id: '3',
      name: 'Spinal Twist',
      duration: 45,
      description: 'Rotate your spine while seated',
      difficulty: 'medium'
    },
    {
      id: '4',
      name: 'Eye Movement',
      duration: 15,
      description: 'Focus far and near to rest your eyes',
      difficulty: 'easy'
    }
  ];

  const relaxingTracks = [
    'Relaxing Piano',
    'Nature Sounds',
    'Meditation Bell',
    'Ocean Waves',
    'Forest Rain',
    'Ambient Space'
  ];

  // Breathing exercise logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (breathingActive) {
      interval = setInterval(() => {
        setBreathingTimer((prev) => {
          if (breathingPhase === 'inhale' && prev >= 4) {
            setBreathingPhase('hold');
            return 0;
          } else if (breathingPhase === 'hold' && prev >= 7) {
            setBreathingPhase('exhale');
            return 0;
          } else if (breathingPhase === 'exhale' && prev >= 8) {
            setBreathingPhase('inhale');
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [breathingActive, breathingPhase]);

  const getGameCategoryColor = (category: string) => {
    switch (category) {
      case 'memory': return 'primary';
      case 'puzzle': return 'secondary';
      case 'reflex': return 'highlight';
      default: return 'primary';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'secondary';
      case 'medium': return 'highlight';
      case 'hard': return 'error';
      default: return 'primary';
    }
  };

  const nextTrack = () => {
    const currentIndex = relaxingTracks.indexOf(currentTrack);
    const nextIndex = (currentIndex + 1) % relaxingTracks.length;
    setCurrentTrack(relaxingTracks[nextIndex]);
  };

  const shuffleTrack = () => {
    const otherTracks = relaxingTracks.filter(track => track !== currentTrack);
    const randomTrack = otherTracks[Math.floor(Math.random() * otherTracks.length)];
    setCurrentTrack(randomTrack);
  };

  return (
    <div className="min-h-screen pb-8 px-4 pt-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-gradient-secondary">Break Time</span> ☕
          </h1>
          <p className="text-lg text-muted-foreground">Recharge your mind and body</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Breathing Guide */}
          <GlassCard size="lg" gradient="secondary">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-6 text-gradient-secondary">
                Breathing Exercise
              </h2>
              
              <div className="relative mb-8">
                <motion.div
                  className="w-32 h-32 mx-auto rounded-full gradient-secondary flex items-center justify-center relative overflow-hidden"
                  animate={{
                    scale: breathingActive 
                      ? breathingPhase === 'inhale' ? 1.2 
                        : breathingPhase === 'hold' ? 1.2 
                        : 0.8
                      : 1
                  }}
                  transition={{ 
                    duration: breathingPhase === 'inhale' ? 4 
                            : breathingPhase === 'hold' ? 7 
                            : 8,
                    ease: 'easeInOut'
                  }}
                >
                  <div className="text-white font-semibold text-center">
                    <div className="text-lg capitalize">{breathingPhase}</div>
                    <div className="text-2xl">{breathingTimer}s</div>
                  </div>
                </motion.div>
                
                {breathingActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    animate={{ 
                      boxShadow: `0 0 ${20 + breathingTimer * 5}px rgba(46, 215, 176, 0.4)` 
                    }}
                  />
                )}
              </div>

              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-2">
                  4-7-8 Breathing Technique
                </p>
                <p className="text-xs text-muted-foreground">
                  Inhale for 4s, Hold for 7s, Exhale for 8s
                </p>
              </div>

              <LuxuryButton
                variant={breathingActive ? "outline" : "secondary"}
                onClick={() => setBreathingActive(!breathingActive)}
                fullWidth
              >
                {breathingActive ? 'Stop Exercise' : 'Start Breathing'}
              </LuxuryButton>
            </div>
          </GlassCard>

          {/* Music Player */}
          <GlassCard size="lg">
            <h2 className="text-xl font-semibold mb-6 text-gradient-primary">
              <Headphones className="inline w-5 h-5 mr-2" />
              Relaxing Sounds
            </h2>
            
            <div className="text-center mb-6">
              <div className="w-24 h-24 mx-auto rounded-full gradient-primary flex items-center justify-center mb-4">
                <motion.div
                  animate={{ rotate: isPlaying ? 360 : 0 }}
                  transition={{ duration: 20, repeat: isPlaying ? Infinity : 0, ease: 'linear' }}
                >
                  <Volume2 className="w-8 h-8 text-white" />
                </motion.div>
              </div>
              
              <h3 className="font-semibold text-lg mb-2">{currentTrack}</h3>
              <LuxuryBadge variant="primary">Now Playing</LuxuryBadge>
            </div>

            <div className="flex justify-center gap-3 mb-6">
              <LuxuryButton
                variant="outline"
                size="sm"
                onClick={shuffleTrack}
                icon={<Shuffle className="w-4 h-4" />}
              >
                Shuffle
              </LuxuryButton>
              <LuxuryButton
                variant="primary"
                onClick={() => setIsPlaying(!isPlaying)}
                icon={isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              >
                {isPlaying ? 'Pause' : 'Play'}
              </LuxuryButton>
              <LuxuryButton
                variant="outline"
                size="sm"
                onClick={nextTrack}
                icon={<SkipForward className="w-4 h-4" />}
              >
                Next
              </LuxuryButton>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Volume</span>
                <span>{volume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolumeLevel(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </GlassCard>
        </div>

        {/* Mini Games */}
        <motion.div 
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Gamepad2 className="w-6 h-6 text-highlight-solid" />
            <h2 className="text-2xl font-semibold text-gradient-highlight">Quick Games</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {miniGames.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard 
                  gradient={getGameCategoryColor(game.category) as any}
                  className="h-full"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold">{game.title}</h3>
                    <LuxuryBadge 
                      variant={getGameCategoryColor(game.category) as any}
                      size="sm"
                    >
                      {game.category}
                    </LuxuryBadge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {game.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{game.duration}</span>
                    <LuxuryButton size="sm" variant="outline">
                      Play
                    </LuxuryButton>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stretch Prompts */}
        <motion.div 
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Dumbbell className="w-6 h-6 text-secondary-solid" />
            <h2 className="text-2xl font-semibold text-gradient-secondary">Quick Stretches</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stretchExercises.map((exercise, index) => (
              <motion.div
                key={exercise.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard gradient="secondary">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold">{exercise.name}</h3>
                    <div className="flex gap-2">
                      <LuxuryBadge 
                        variant={getDifficultyColor(exercise.difficulty) as any}
                        size="sm"
                      >
                        {exercise.difficulty}
                      </LuxuryBadge>
                      <LuxuryBadge variant="secondary" size="sm">
                        {exercise.duration}s
                      </LuxuryBadge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {exercise.description}
                  </p>
                  <LuxuryButton size="sm" variant="secondary" fullWidth>
                    Start Exercise
                  </LuxuryButton>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}