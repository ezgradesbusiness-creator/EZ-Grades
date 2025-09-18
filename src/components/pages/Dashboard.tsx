import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, Square, Plus, BookOpen, Target, TrendingUp, Star } from 'lucide-react';
import { GlassCard } from '../GlassCard';
import { ProgressRing } from '../ProgressRing';
import { LuxuryButton } from '../LuxuryButton';
import { LuxuryBadge } from '../LuxuryBadge';
import { unsplash_tool } from '../../tools/unsplash';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

export function Dashboard() {
  const [currentTime, setCurrentTime] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Complete React project', completed: false, priority: 'high' },
    { id: '2', title: 'Review mathematics notes', completed: true, priority: 'medium' },
    { id: '3', title: 'Prepare presentation slides', completed: false, priority: 'high' },
    { id: '4', title: 'Read chapter 5', completed: false, priority: 'low' },
  ]);
  const [newTask, setNewTask] = useState('');
  const [motivationQuote] = useState({
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  });

  const totalTime = 25 * 60;
  const progress = ((totalTime - currentTime) / totalTime) * 100;
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && currentTime > 0) {
      interval = setInterval(() => {
        setCurrentTime((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, currentTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimerToggle = () => {
    setIsRunning(!isRunning);
  };

  const handleTimerReset = () => {
    setIsRunning(false);
    setCurrentTime(25 * 60);
  };

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, {
        id: Date.now().toString(),
        title: newTask,
        completed: false,
        priority: 'medium'
      }]);
      setNewTask('');
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'highlight';
      case 'low': return 'secondary';
      default: return 'primary';
    }
  };

  return (
    <div className="min-h-screen pb-8 px-4 pt-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <motion.div 
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, <span className="text-gradient-primary">Scholar</span>
          </h1>
          <p className="text-lg text-muted-foreground">Ready to make today productive?</p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <GlassCard gradient="primary" className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="w-6 h-6 text-primary-solid mr-2" />
              <span className="text-2xl font-bold">{completedTasks}/{totalTasks}</span>
            </div>
            <p className="text-sm text-muted-foreground">Tasks Completed</p>
          </GlassCard>

          <GlassCard gradient="secondary" className="text-center">
            <div className="flex items-center justify-center mb-2">
              <BookOpen className="w-6 h-6 text-secondary-solid mr-2" />
              <span className="text-2xl font-bold">4.2h</span>
            </div>
            <p className="text-sm text-muted-foreground">Study Time Today</p>
          </GlassCard>

          <GlassCard gradient="highlight" className="text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-6 h-6 text-highlight-solid mr-2" />
              <span className="text-2xl font-bold">12</span>
            </div>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </GlassCard>

          <GlassCard gradient="primary" className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Star className="w-6 h-6 text-primary-solid mr-2" />
              <span className="text-2xl font-bold">850</span>
            </div>
            <p className="text-sm text-muted-foreground">Total Points</p>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pomodoro Timer */}
          <div className="lg:col-span-1">
            <GlassCard className="text-center" size="lg">
              <h2 className="text-xl font-semibold mb-6 text-gradient-primary">Pomodoro Timer</h2>
              
              <div className="mb-6">
                <ProgressRing 
                  progress={progress} 
                  size={160} 
                  strokeWidth={12}
                  gradient="primary"
                >
                  <div className="text-center">
                    <div className="text-3xl font-bold text-foreground mb-1">
                      {formatTime(currentTime)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {isRunning ? 'Focus Time' : 'Ready to Start'}
                    </div>
                  </div>
                </ProgressRing>
              </div>

              <div className="flex gap-3 justify-center">
                <LuxuryButton
                  variant="primary"
                  onClick={handleTimerToggle}
                  icon={isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                >
                  {isRunning ? 'Pause' : 'Start'}
                </LuxuryButton>
                <LuxuryButton
                  variant="outline"
                  onClick={handleTimerReset}
                  icon={<Square className="w-4 h-4" />}
                >
                  Reset
                </LuxuryButton>
              </div>
            </GlassCard>
          </div>

          {/* Task List */}
          <div className="lg:col-span-2">
            <GlassCard size="lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gradient-primary">Today's Tasks</h2>
                <LuxuryBadge variant="highlight" count={totalTasks - completedTasks}>
                  Remaining
                </LuxuryBadge>
              </div>

              {/* Add Task */}
              <div className="flex gap-3 mb-6">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Add a new task..."
                  className="flex-1 px-4 py-2 rounded-lg bg-input-background border border-border/50 focus:border-primary-solid focus:outline-none focus:ring-2 focus:ring-primary-solid/20 transition-all duration-300"
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                />
                <LuxuryButton
                  variant="primary"
                  onClick={addTask}
                  icon={<Plus className="w-4 h-4" />}
                >
                  Add
                </LuxuryButton>
              </div>

              {/* Task List */}
              <div className="space-y-3">
                {tasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`
                      flex items-center gap-3 p-4 rounded-lg border transition-all duration-300
                      ${task.completed 
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700' 
                        : 'bg-input-background border-border/50 hover:border-primary-solid/50'
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="w-5 h-5 rounded border-2 border-primary-solid text-primary-solid focus:ring-2 focus:ring-primary-solid/20"
                    />
                    <span className={`flex-1 ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {task.title}
                    </span>
                    <LuxuryBadge 
                      variant={getPriorityColor(task.priority) as any}
                      size="sm"
                    >
                      {task.priority}
                    </LuxuryBadge>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Motivation Quote */}
        <motion.div 
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <GlassCard className="text-center" gradient="highlight">
            <div className="mb-4">
              <div className="text-4xl mb-2">✨</div>
              <h3 className="text-lg font-semibold text-gradient-highlight mb-2">Daily Inspiration</h3>
            </div>
            <blockquote className="text-lg italic text-foreground mb-2">
              "{motivationQuote.text}"
            </blockquote>
            <cite className="text-sm text-muted-foreground">— {motivationQuote.author}</cite>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}