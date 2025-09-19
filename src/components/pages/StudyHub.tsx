import { useState } from 'react';
import { motion } from 'motion/react';
import { Bot, Star, Clock, BookOpen, Award, Play } from 'lucide-react';
import { GlassCard } from '../GlassCard';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

interface Course {
  id: string;
  title: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
}

export function StudyHub() {
  const [activeTab, setActiveTab] = useState<'certifications' | 'revision' | 'ai-helper'>('certifications');
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{type: 'user' | 'ai', message: string}>>([
    { type: 'ai', message: 'Hello! I\'m your AI study assistant. I can help you with questions, generate summaries, create study plans, and more. What would you like to work on today?' }
  ]);

  const courses: Course[] = [
    {
      id: '1',
      title: 'Advanced Mathematics',
      progress: 75,
      totalLessons: 24,
      completedLessons: 18,
      category: 'Mathematics',
      difficulty: 'Advanced',
      estimatedTime: '8 weeks'
    },
    {
      id: '2',
      title: 'Computer Science Fundamentals',
      progress: 45,
      totalLessons: 32,
      completedLessons: 14,
      category: 'Computer Science',
      difficulty: 'Intermediate',
      estimatedTime: '12 weeks'
    }
  ];

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    setChatHistory(prev => [...prev, { type: 'user', message: chatMessage }]);
    
    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I can help you create a personalized study plan. What subject are you focusing on?",
        "Here's a summary of the key concepts you should focus on. Would you like me to create flashcards?",
        "Based on your learning style, I recommend using spaced repetition for this topic.",
        "Let me generate a study schedule that fits your timeline. How many hours can you dedicate daily?"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setChatHistory(prev => [...prev, { type: 'ai', message: randomResponse }]);
    }, 1000);
    
    setChatMessage('');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-gradient-primary">Study Hub</h1>
        <p className="text-muted-foreground">
          Discover tools, courses, and AI-powered study assistance
        </p>
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard className="p-1">
          <div className="flex space-x-1">
            {[
              { key: 'certifications', label: 'Certifications', icon: Award },
              { key: 'revision', label: 'Revision', icon: Play },
              { key: 'ai-helper', label: 'AI Helper', icon: Bot }
            ].map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                variant={activeTab === key ? 'default' : 'ghost'}
                onClick={() => setActiveTab(key as any)}
                className={`flex-1 ${activeTab === key ? 'gradient-primary text-white' : ''}`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </Button>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* Certifications */}
        {activeTab === 'certifications' && (
          <div className="space-y-6">
            <GlassCard className="p-8 text-center">
              <Award className="w-16 h-16 mx-auto mb-4 text-primary-solid" />
              <h3 className="text-xl font-medium mb-2">Certification Center</h3>
              <p className="text-muted-foreground mb-6">
                Prepare for industry certifications with our comprehensive study materials
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="flex-col h-auto py-4">
                  <BookOpen className="w-6 h-6 mb-2" />
                  <span>Flashcards</span>
                </Button>
                <Button variant="outline" className="flex-col h-auto py-4">
                  <Clock className="w-6 h-6 mb-2" />
                  <span>Mock Tests</span>
                </Button>
                <Button variant="outline" className="flex-col h-auto py-4">
                  <Star className="w-6 h-6 mb-2" />
                  <span>Study Plans</span>
                </Button>
              </div>
            </GlassCard>
          </div>
        )}

        {/* My Courses */}
        {activeTab === 'revision' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {courses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-medium">{course.title}</h3>
                        <p className="text-sm text-muted-foreground">{course.category}</p>
                      </div>
                      <Badge 
                        variant="outline"
                        className={`${
                          course.difficulty === 'Beginner' ? 'border-green-500 text-green-600' :
                          course.difficulty === 'Intermediate' ? 'border-yellow-500 text-yellow-600' :
                          'border-red-500 text-red-600'
                        }`}
                      >
                        {course.difficulty}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {course.estimatedTime}
                        </span>
                      </div>
                    </div>

                    <Button className="w-full gradient-primary text-white">
                      Continue Learning
                    </Button>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* AI Helper */}
        {activeTab === 'ai-helper' && (
          <div className="space-y-6">
            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium">AI Study Assistant</h3>
                  <p className="text-sm text-muted-foreground">Get instant help with your studies</p>
                </div>
              </div>

              {/* Chat History */}
              <div className="h-64 overflow-y-auto space-y-3 mb-4 p-4 glass-card">
                {chatHistory.map((chat, index) => (
                  <div
                    key={index}
                    className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs p-3 rounded-lg ${
                        chat.type === 'user'
                          ? 'gradient-primary text-white'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {chat.message}
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Ask me anything about your studies..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="glass-card border-0"
                />
                <Button 
                  onClick={handleSendMessage}
                  className="gradient-primary text-white"
                >
                  Send
                </Button>
              </div>

              {/* Quick Actions */}
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">Quick Actions:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Create study plan',
                    'Generate summary',
                    'Make flashcards',
                    'Set milestones'
                  ].map(action => (
                    <Button
                      key={action}
                      variant="outline"
                      size="sm"
                      onClick={() => setChatMessage(action)}
                    >
                      {action}
                    </Button>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>
        )}
      </motion.div>
    </div>
  );
}