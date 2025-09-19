import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Shield, 
  Volume2, 
  VolumeX, 
  Timer, 
  Users, 
  Coffee,
  Zap,
  Eye,
  EyeOff,
  Settings
} from 'lucide-react';
import { GlassCard } from '../GlassCard';
import { ProgressRing } from '../ProgressRing';
import { Button } from '../Button';
import { Badge } from '../Badge';

interface AmbientSound {
  id: string;
  name: string;
  volume: number;
  enabled: boolean;
  icon: string;
}

interface StudyRoomParticipant {
  id: string;
  name: string;
  avatar: string;
  status: 'studying' | 'break' | 'away';
  studyTime: number;
}

export function FocusMode() {
  const [focusTimer, setFocusTimer] = useState(50 * 60); // 50 minutes
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [distractionBlockEnabled, setDistractionBlockEnabled] = useState(false);
  const [showBlockedSites, setShowBlockedSites] = useState(false);
  
  const [ambientSounds, setAmbientSounds] = useState<AmbientSound[]>([
    { id: '1', name: 'Rain', volume: 50, enabled: false, icon: '🌧️' },
    { id: '2', name: 'Forest', volume: 30, enabled: true, icon: '🌲' },
    { id: '3', name: 'Coffee Shop', volume: 40, enabled: false, icon: '☕' },
    { id: '4', name: 'Ocean Waves', volume: 60, enabled: false, icon: '🌊' },
    { id: '5', name: 'White Noise', volume: 35, enabled: false, icon: '⚪' },
    { id: '6', name: 'Fireplace', volume: 45, enabled: false, icon: '🔥' },
  ]);

  const [studyRoomParticipants] = useState<StudyRoomParticipant[]>([
    { id: '1', name: 'Alex Chen', avatar: '👨‍💻', status: 'studying', studyTime: 125 },
    { id: '2', name: 'Sarah Kim', avatar: '👩‍📚', status: 'studying', studyTime: 98 },
    { id: '3', name: 'Mike Johnson', avatar: '👨‍🎓', status: 'break', studyTime: 87 },
    { id: '4', name: 'Emma Davis', avatar: '👩‍💼', status: 'studying', studyTime: 156 },
    { id: '5', name: 'David Wilson', avatar: '👨‍🔬', status: 'away', studyTime: 45 },
  ]);

  const blockedSites = [
    'social-media.com',
    'news-website.com',
    'entertainment.com',
    'gaming-site.com',
    'video-platform.com'
  ];

  const totalFocusTime = 50 * 60;
  const focusProgress = ((totalFocusTime - focusTimer) / totalFocusTime) * 100;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && focusTimer > 0) {
      interval = setInterval(() => {
        setFocusTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, focusTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleSound = (id: string) => {
    setAmbientSounds(sounds => sounds.map(sound => 
      sound.id === id ? { ...sound, enabled: !sound.enabled } : sound
    ));
  };

  const updateSoundVolume = (id: string, volume: number) => {
    setAmbientSounds(sounds => sounds.map(sound => 
      sound.id === id ? { ...sound, volume } : sound
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'studying': return 'text-green-500';
      case 'break': return 'text-yellow-500';
      case 'away': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'studying': return 'secondary';
      case 'break': return 'highlight';
      case 'away': return 'error';
      default: return 'primary';
    }
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
            <span className="text-gradient-primary">Deep Focus</span> 🎯
          </h1>
          <p className="text-lg text-muted-foreground">Enter the zone of maximum productivity</p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Focus Timer */}
          <div className="xl:col-span-1">
            <GlassCard size="lg" gradient="primary">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-6 text-gradient-primary">
                  <Timer className="inline w-5 h-5 mr-2" />
                  Focus Session
                </h2>
                
                <div className="mb-6">
                  <ProgressRing 
                    progress={focusProgress} 
                    size={180} 
                    strokeWidth={12}
                    gradient="primary"
                  >
                    <div className="text-center">
                      <div className="text-3xl font-bold text-foreground mb-1">
                        {formatTime(focusTimer)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {isTimerRunning ? 'Deep Focus' : 'Ready'}
                      </div>
                    </div>
                  </ProgressRing>
                </div>

                <div className="space-y-3">
                  <Button
                    variant="primary"
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    fullWidth
                    icon={isTimerRunning ? <Timer className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                  >
                    {isTimerRunning ? 'Pause Focus' : 'Start Focus'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsTimerRunning(false);
                      setFocusTimer(50 * 60);
                    }}
                    fullWidth
                  >
                    Reset Timer
                  </Button>
                </div>
              </div>
            </GlassCard>

            {/* Distraction Blocker */}
            <GlassCard className="mt-6" gradient="secondary">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-secondary-solid" />
                  <h3 className="font-semibold text-gradient-secondary">Distraction Blocker</h3>
                </div>
                <motion.button
                  onClick={() => setDistractionBlockEnabled(!distractionBlockEnabled)}
                  className={`
                    relative w-12 h-6 rounded-full transition-all duration-300
                    ${distractionBlockEnabled ? 'gradient-secondary' : 'bg-muted'}
                  `}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                    animate={{ x: distractionBlockEnabled ? 26 : 2 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  />
                </motion.button>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                Block distracting websites during focus sessions
              </p>

              <div className="flex items-center justify-between">
                <Badge 
                  variant={distractionBlockEnabled ? 'secondary' : 'error'}
                  size="sm"
                >
                  {distractionBlockEnabled ? 'Active' : 'Inactive'}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBlockedSites(!showBlockedSites)}
                  icon={showBlockedSites ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                >
                  {showBlockedSites ? 'Hide' : 'Show'} Sites
                </Button>
              </div>

              {showBlockedSites && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 space-y-2"
                >
                  {blockedSites.slice(0, 3).map((site, index) => (
                    <div key={index} className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                      {site}
                    </div>
                  ))}
                  <div className="text-xs text-muted-foreground text-center">
                    +{blockedSites.length - 3} more sites
                  </div>
                </motion.div>
              )}
            </GlassCard>
          </div>

          {/* Ambient Sounds */}
          <div className="xl:col-span-2">
            <GlassCard size="lg">
              <div className="flex items-center gap-2 mb-6">
                <Volume2 className="w-5 h-5 text-highlight-solid" />
                <h2 className="text-xl font-semibold text-gradient-highlight">Ambient Sounds</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ambientSounds.map((sound) => (
                  <motion.div
                    key={sound.id}
                    className={`
                      p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer
                      ${sound.enabled 
                        ? 'bg-highlight-solid/10 border-highlight-solid/50 glow-highlight' 
                        : 'bg-muted/30 border-muted hover:border-muted-foreground/30'
                      }
                    `}
                    onClick={() => toggleSound(sound.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{sound.icon}</span>
                        <span className="font-medium">{sound.name}</span>
                      </div>
                      {sound.enabled ? (
                        <Volume2 className="w-4 h-4 text-highlight-solid" />
                      ) : (
                        <VolumeX className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>

                    {sound.enabled && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-2"
                      >
                        <div className="flex items-center justify-between text-sm">
                          <span>Volume</span>
                          <span>{sound.volume}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={sound.volume}
                          onChange={(e) => {
                            e.stopPropagation();
                            updateSoundVolume(sound.id, Number(e.target.value));
                          }}
                          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Study Together Room */}
        <motion.div 
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <GlassCard size="lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary-solid" />
                <h2 className="text-xl font-semibold text-gradient-primary">Study Together Room</h2>
              </div>
              <Badge variant="primary" count={studyRoomParticipants.length}>
                Online
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {studyRoomParticipants.map((participant, index) => (
                <motion.div
                  key={participant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-muted/20 rounded-lg p-4 border border-muted/50"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-solid to-secondary-solid flex items-center justify-center text-lg">
                      {participant.avatar}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{participant.name}</h3>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(participant.status).replace('text-', 'bg-')}`} />
                        <span className="text-xs text-muted-foreground capitalize">
                          {participant.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant={getStatusBadge(participant.status) as any}
                      size="sm"
                    >
                      {participant.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {Math.floor(participant.studyTime / 60)}h {participant.studyTime % 60}m
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Button variant="primary" icon={<Users className="w-4 h-4" />}>
                Join Study Room
              </Button>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}