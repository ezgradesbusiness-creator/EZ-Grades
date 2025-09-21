import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Coffee, Zap } from 'lucide-react';
import { ProgressRing } from './ProgressRing';
import { Button } from './Button';

interface FocusSessionProps {
  initialDuration: number; // in minutes
  onEnd: () => void;
  onCancel?: () => void;
}

export function FocusSession({ initialDuration, onEnd, onCancel }: FocusSessionProps) {
  const [timeRemaining, setTimeRemaining] = useState(initialDuration * 60); // convert to seconds
  const [isRunning, setIsRunning] = useState(true);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const totalTime = initialDuration * 60;
  const progress = ((totalTime - timeRemaining) / totalTime) * 100;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            onEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeRemaining, onEnd]);

  // Prevent scrolling and navigation during focus session
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block most keyboard shortcuts except essential ones
      if (e.key === 'F5' || 
          (e.ctrlKey && ['r', 'n', 't', 'w'].includes(e.key.toLowerCase())) ||
          (e.altKey && e.key === 'Tab') ||
          e.key === 'F11') {
        e.preventDefault();
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCancel = () => {
    if (showCancelConfirm) {
      onCancel?.();
    } else {
      setShowCancelConfirm(true);
      // Auto-hide confirmation after 5 seconds
      setTimeout(() => setShowCancelConfirm(false), 5000);
    }
  };

  const getPhaseMessage = () => {
    const progressPercent = progress;
    if (progressPercent < 25) return "Getting into the zone...";
    if (progressPercent < 50) return "Deep focus mode activated";
    if (progressPercent < 75) return "You're in the flow state";
    if (progressPercent < 90) return "Final stretch - stay strong";
    return "Almost there - finish strong!";
  };

  return (
    <div className="fixed inset-0 bg-gradient z-[9999] flex items-center justify-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(125, 74, 225, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(58, 176, 160, 0.1) 0%, transparent 50%)`
        }} />
      </div>

      {/* Cancel Button */}
      <motion.button
        onClick={handleCancel}
        className={`
          fixed top-8 right-8 z-10 p-3 rounded-full transition-all duration-300
          ${showCancelConfirm 
            ? 'bg-error-solid text-white glow-error' 
            : 'glass-card hover:glow-primary'
          }
        `}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <X className="w-6 h-6" />
      </motion.button>

      {/* Cancel Confirmation */}
      {showCancelConfirm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-24 right-8 glass-card p-4 max-w-xs z-10"
        >
          <p className="text-sm text-error-solid mb-2">
            Are you sure you want to end your focus session?
          </p>
          <p className="text-xs text-mused-foreground">
            Click the X button again to confirm
          </p>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="text-center space-y-8">
        {/* Timer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <ProgressRing
            progress={progress}
            size={300}
            strokeWidth={16}
            gradient="primary"
          >
            <div className="text-center">
              <motion.div 
                className="text-6xl font-bold text-foreground mb-2"
                key={timeRemaining} // Re-trigger animation on time change
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {formatTime(timeRemaining)}
              </motion.div>
              <div className="text-lg text-muted-foreground">
                {isRunning ? 'Deep Focus Mode' : 'Paused'}
              </div>
            </div>
          </ProgressRing>
        </motion.div>

        {/* Phase Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="space-y-2"
        >
          <h2 className="text-2xl font-semibold text-gradient-primary">
            {getPhaseMessage()}
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Stay focused and avoid distractions. You're building your concentration muscle.
          </p>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex items-center justify-center gap-2"
        >
          {Array.from({ length: 4 }, (_, i) => (
            <motion.div
              key={i}
              className={`
                w-3 h-3 rounded-full transition-all duration-500
                ${progress > (i + 1) * 25 
                  ? 'gradient-primary glow-primary' 
                  : 'bg-muted'
                }
              `}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8 + i * 0.1 }}
            />
          ))}
        </motion.div>

        {/* Pause/Resume Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <Button
            variant={isRunning ? "outline" : "primary"}
            onClick={() => setIsRunning(!isRunning)}
            icon={isRunning ? <Coffee className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
            size="lg"
          >
            {isRunning ? 'Take a Break' : 'Resume Focus'}
          </Button>
        </motion.div>

        {/* Motivational Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="max-w-lg mx-auto"
        >
          <blockquote className="text-lg italic text-muted-foreground">
            "The successful warrior is the average person with laser-like focus."
          </blockquote>
          <cite className="text-sm text-muted-foreground mt-2 block">
            — Bruce Lee
          </cite>
        </motion.div>
      </div>

      {/* Session Complete Notification */}
      {timeRemaining === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10"
        >
          <div className="glass-card p-8 text-center max-w-md">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gradient-primary mb-2">
              Focus Session Complete!
            </h2>
            <p className="text-muted-foreground mb-6">
              Congratulations! You've successfully completed your {initialDuration}-minute focus session.
            </p>
            <Button
              variant="primary"
              onClick={onEnd}
              fullWidth
            >
              Continue
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}