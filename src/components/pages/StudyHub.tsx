import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  Star, 
  Clock, 
  BookOpen, 
  Award, 
  Play, 
  Target,
  TrendingUp,
  Users,
  CheckCircle,
  AlertCircle,
  FileText,
  Brain,
  Calendar,
  BarChart3,
  Settings,
  Lightbulb,
  Trophy,
  GraduationCap,
  Zap,
  Search,
  Filter,
  Bookmark,
  Heart,
  Share2,
  Download,
  Pause,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize2,
  ChevronRight,
  ChevronLeft,
  MessageSquare,
  Sparkles,
  Target as TargetIcon,
  TrendingDown,
  Plus,
  Minus,
  RotateCcw,
  Timer,
  Globe,
  Code,
  Database,
  Shield,
  Cloud,
  Smartphone,
  PieChart,
  BarChart,
  LineChart
} from 'lucide-react';
import { GlassCard } from '../GlassCard';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Separator } from '../ui/separator';
import { 
  ExamAPI, 
  QuestionAPI, 
  FlashcardAPI, 
  AIHelperAPI,
  TestSessionAPI 
} from '../lib/studyhub_complete_api';

interface StudyHubProps {
  user: { id: string; email: string; name?: string }
}

interface Exam {
  id: string
  name: string
  description: string
  category: string
  provider: string
  total_questions: number
  duration_minutes: number
  passing_score: number
  exam_fee_usd: number
  icon_url?: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
}

interface UserExam {
  id: string
  exam_id: string
  user_id: string
  enrolled_at: string
  progress: number
  last_study_session?: string
  total_study_time: number
}

interface Question {
  id: string
  question_text: string
  options: Record<string, string>
  correct_answer: string
  difficulty: 'easy' | 'medium' | 'hard'
  points: number
  explanation?: string
}

interface FlashcardSet {
  id: string
  name: string
  description: string
  card_count: number
  difficulty_filter: 'easy' | 'medium' | 'hard'
  is_ai_generated: boolean
  created_at: string
  progress?: number
}

interface Conversation {
  id: string
  title: string
  created_at: string
  updated_at: string
}

interface ChatMessage {
  id: string
  conversation_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

interface TestSession {
  id: string
  questions: Question[]
  session_type: 'practice' | 'mock_exam'
  time_limit: number
  started_at: string
}

export function StudyHub({ user }: StudyHubProps) {
  const [activeTab, setActiveTab] = useState<'certifications' | 'revision' | 'ai-helper'>('certifications');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isGeneratingFlashcards, setIsGeneratingFlashcards] = useState(false);

  // Certifications tab state
  const [exams, setExams] = useState<Exam[]>([]);
  const [userExams, setUserExams] = useState<UserExam[]>([]);
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [practiceResults, setPracticeResults] = useState<{ correct: number; total: number; score: number; feedback: string } | null>(null);
  const [sessionTimer, setSessionTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Revision tab state
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [currentQuiz, setCurrentQuiz] = useState<TestSession | null>(null);
  const [studyStats, setStudyStats] = useState({
    totalStudyTime: 0,
    streakDays: 0,
    completedSets: 0,
    averageScore: 0,
    weeklyGoal: 20,
    weeklyProgress: 12
  });

  // AI Helper state
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSessionTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAITyping]);

  useEffect(() => {
    loadInitialData();
  }, [activeTab, user]);

  const loadInitialData = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      if (activeTab === 'certifications') {
        const [allExams, enrolledExams] = await Promise.all([
          ExamAPI.getAllExams(),
          ExamAPI.getUserExams(user.id)
        ]);
        setExams(allExams);
        setUserExams(enrolledExams);
      } else if (activeTab === 'revision') {
        const [sets, stats] = await Promise.all([
          FlashcardAPI.getFlashcardSets(user.id, true),
          // Enhanced mock stats
          Promise.resolve({
            totalStudyTime: 1250,
            streakDays: 7,
            completedSets: 12,
            averageScore: 87,
            weeklyGoal: 20,
            weeklyProgress: 12
          })
        ]);
        setFlashcardSets(sets);
        setStudyStats(stats);
      } else if (activeTab === 'ai-helper') {
        const convs = await AIHelperAPI.getConversations(user.id);
        setConversations(convs);

        if (convs.length > 0) {
          setCurrentConversation(convs[0]);
          const messages = await AIHelperAPI.getConversationMessages(convs[0].id);
          setChatMessages(messages);
        } else {
          // Create first conversation
          const newConv = await AIHelperAPI.createConversation(user.id);
          setCurrentConversation(newConv);
          setChatMessages([{
            id: 'welcome',
            conversation_id: newConv.id,
            role: 'assistant',
            content: `Hello ${user.name || 'Scholar'}! ✨ I'm your AI study assistant. I can help you with questions, generate summaries, create study plans, explain concepts, and much more. What would you like to work on today?`,
            created_at: new Date().toISOString()
          }]);
        }

        // Set initial AI suggestions
        setAiSuggestions([
          'Create a study plan for AWS certification',
          'Generate flashcards for networking concepts',
          'Explain cloud computing basics',
          'Schedule my study sessions this week'
        ]);
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Enhanced certification handlers
  const handleEnrollInExam = async (examId: string) => {
    try {
      setLoading(true);
      await ExamAPI.enrollUserInExam(user.id, examId);
      await loadInitialData();
    } catch (err) {
      console.error('Error enrolling in exam:', err);
      setError('Failed to enroll in exam');
    } finally {
      setLoading(false);
    }
  };

  const handleStartPractice = async (examId: string, difficulty?: 'easy' | 'medium' | 'hard') => {
    try {
      setLoading(true);
      const examQuestions = await QuestionAPI.getQuestions({
        exam_id: examId,
        difficulty,
        limit: 10,
        random: true
      });
      setQuestions(examQuestions);
      setSelectedExam(examId);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setShowResults(false);
      setPracticeResults(null);
      setSessionTimer(0);
      setIsTimerRunning(true);
    } catch (err) {
      console.error('Error loading questions:', err);
      setError('Failed to load practice questions');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmitPractice = async () => {
    try {
      setLoading(true);
      setIsTimerRunning(false);
      let correct = 0;

      for (const question of questions) {
        const userAnswer = selectedAnswers[question.id];
        if (userAnswer) {
          const result = await QuestionAPI.submitAnswer(
            user.id,
            question.id,
            userAnswer,
            'practice'
          );
          if (result.isCorrect) correct++;
        }
      }

      const score = Math.round((correct / questions.length) * 100);
      let feedback = '';
      if (score >= 90) feedback = '🎉 Outstanding! You\'re ready for the real exam!';
      else if (score >= 80) feedback = '👏 Great job! You\'re on the right track!';
      else if (score >= 70) feedback = '👍 Good work! Keep practicing to improve!';
      else feedback = '📚 Keep studying! Focus on the areas you missed.';

      setPracticeResults({ correct, total: questions.length, score, feedback });
      setShowResults(true);
    } catch (err) {
      console.error('Error submitting practice:', err);
      setError('Failed to submit answers');
    } finally {
      setLoading(false);
    }
  };

  // Enhanced revision handlers
  const handleGenerateFlashcards = async (examId: string, topicId?: string) => {
    try {
      setIsGeneratingFlashcards(true);
      const result = await FlashcardAPI.generateFlashcardsFromQuestions(
        user.id,
        examId,
        topicId,
        'medium',
        20
      );
      await loadInitialData();
      return result.flashcards.length;
    } catch (err) {
      console.error('Error generating flashcards:', err);
      setError('Failed to generate flashcards');
      return 0;
    } finally {
      setIsGeneratingFlashcards(false);
    }
  };

  const handleStartMockTest = async (examId: string, questionCount: number) => {
    try {
      setLoading(true);
      const session = await TestSessionAPI.startTestSession(
        user.id,
        examId,
        'mock_exam',
        questionCount,
        120 // 2 hours
      );
      setCurrentQuiz(session);
    } catch (err) {
      console.error('Error starting mock test:', err);
      setError('Failed to start mock test');
    } finally {
      setLoading(false);
    }
  };

  // Enhanced AI Helper handlers
  const handleSendMessage = async (message?: string) => {
    const messageToSend = message || inputMessage;
    if (!messageToSend.trim() || !currentConversation) return;

    try {
      setIsAITyping(true);
      const result = await AIHelperAPI.sendMessage(
        currentConversation.id,
        messageToSend
      );

      setChatMessages(prev => [...prev, result.userMessage, result.aiMessage]);
      setInputMessage('');
      
      // Update suggestions based on conversation
      setAiSuggestions([
        'Explain this concept in more detail',
        'Create a quiz based on this topic',
        'Suggest related study materials',
        'Help me plan my next study session'
      ]);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    } finally {
      setIsAITyping(false);
    }
  };

  const quickActions = [
    { text: 'Create a study plan for AWS certification', icon: Calendar },
    { text: 'Generate summary of cloud computing basics', icon: Cloud },
    { text: 'Help me understand network security concepts', icon: Shield },
    { text: 'Create flashcards for database fundamentals', icon: Database },
    { text: 'Schedule my study sessions this week', icon: Timer }
  ];

  const examCategories = [
    { id: 'cloud', name: 'Cloud Computing', icon: Cloud, color: 'from-blue-500 to-cyan-500' },
    { id: 'security', name: 'Cybersecurity', icon: Shield, color: 'from-red-500 to-pink-500' },
    { id: 'data', name: 'Data & Analytics', icon: Database, color: 'from-green-500 to-emerald-500' },
    { id: 'dev', name: 'Development', icon: Code, color: 'from-purple-500 to-violet-500' },
    { id: 'mobile', name: 'Mobile', icon: Smartphone, color: 'from-orange-500 to-amber-500' },
    { id: 'network', name: 'Networking', icon: Globe, color: 'from-indigo-500 to-blue-500' }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
      case 'easy':
        return 'border-green-500 text-green-600 bg-green-50 dark:bg-green-950/30';
      case 'Intermediate':
      case 'medium':
        return 'border-yellow-500 text-yellow-600 bg-yellow-50 dark:bg-yellow-950/30';
      case 'Advanced':
      case 'hard':
        return 'border-red-500 text-red-600 bg-red-50 dark:bg-red-950/30';
      default:
        return 'border-gray-500 text-gray-600 bg-gray-50 dark:bg-gray-950/30';
    }
  };

  const getExamProgress = (examId: string) => {
    const userExam = userExams.find(ue => ue.exam_id === examId);
    return userExam?.progress || 0;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exam.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || exam.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || exam.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  if (loading && !exams.length && !flashcardSets.length && !conversations.length) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-4 border-primary-solid border-t-transparent rounded-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gradient-primary">
              Study Hub
            </h1>
            <p className="text-muted-foreground">
              Master certifications with AI-powered study tools and comprehensive practice materials
            </p>
          </div>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="hidden md:flex items-center gap-4"
          >
            <GlassCard className="p-3">
              <div className="flex items-center gap-2 text-sm">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="font-medium">Level 3 Scholar</span>
              </div>
            </GlassCard>
            <GlassCard className="p-3">
              <div className="flex items-center gap-2 text-sm">
                <Target className="w-4 h-4 text-green-500" />
                <span className="font-medium">87% Avg Score</span>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Enhanced Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="relative overflow-hidden"
            >
              <GlassCard className="p-4 border-red-200 bg-red-50/50 dark:bg-red-950/20">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setError(null)}
                    className="ml-auto text-red-600 hover:bg-red-100 dark:hover:bg-red-950/40"
                  >
                    ×
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Enhanced Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard className="p-1">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-transparent gap-1">
              <TabsTrigger 
                value="certifications" 
                className="flex items-center gap-2 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
              >
                <Award className="w-4 h-4" />
                Certifications
              </TabsTrigger>
              <TabsTrigger 
                value="revision" 
                className="flex items-center gap-2 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
              >
                <BookOpen className="w-4 h-4" />
                Revision
              </TabsTrigger>
              <TabsTrigger 
                value="ai-helper" 
                className="flex items-center gap-2 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
              >
                <Bot className="w-4 h-4" />
                AI Assistant
              </TabsTrigger>
            </TabsList>

            {/* Certifications Tab */}
            <TabsContent value="certifications" className="space-y-6 mt-6">
              <AnimatePresence mode="wait">
                {/* Practice Session */}
                {selectedExam && questions.length > 0 && !showResults && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <GlassCard className="p-6 space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold">Practice Session</h3>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Timer className="w-4 h-4" />
                            <span className="font-mono">{formatTime(sessionTimer)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              Question {currentQuestionIndex + 1} of {questions.length}
                            </span>
                            <Progress 
                              value={((currentQuestionIndex + 1) / questions.length) * 100} 
                              className="w-32 h-2" 
                            />
                          </div>
                        </div>
                      </div>

                      {questions[currentQuestionIndex] && (
                        <div className="space-y-6">
                          <motion.div
                            key={currentQuestionIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-6 bg-muted/30 rounded-xl space-y-4"
                          >
                            <h4 className="font-medium text-lg leading-relaxed">
                              {questions[currentQuestionIndex].question_text}
                            </h4>
                            <div className="flex items-center gap-4 text-sm">
                              <Badge className={getDifficultyColor(questions[currentQuestionIndex].difficulty)}>
                                {questions[currentQuestionIndex].difficulty}
                              </Badge>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Star className="w-3 h-3 text-yellow-500" />
                                <span>{questions[currentQuestionIndex].points} points</span>
                              </div>
                            </div>
                          </motion.div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(questions[currentQuestionIndex].options).map(([key, value], index) => (
                              <motion.div
                                key={key}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <Button
                                  variant="outline"
                                  className={`p-4 h-auto text-left justify-start w-full transition-all duration-200 ${
                                    selectedAnswers[questions[currentQuestionIndex].id] === key
                                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 shadow-lg'
                                      : 'hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-950/10'
                                  }`}
                                  onClick={() => handleAnswerSelect(questions[currentQuestionIndex].id, key)}
                                >
                                  <span className="font-semibold mr-3 text-blue-600">{key}.</span>
                                  <span className="flex-1">{value}</span>
                                </Button>
                              </motion.div>
                            ))}
                          </div>

                          <div className="flex justify-between">
                            <Button
                              variant="outline"
                              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                              disabled={currentQuestionIndex === 0}
                              className="flex items-center gap-2"
                            >
                              <ChevronLeft className="w-4 h-4" />
                              Previous
                            </Button>

                            {currentQuestionIndex === questions.length - 1 ? (
                              <Button
                                onClick={handleSubmitPractice}
                                className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg flex items-center gap-2"
                                disabled={loading || Object.keys(selectedAnswers).length !== questions.length}
                              >
                                {loading ? (
                                  <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Submitting...
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="w-4 h-4" />
                                    Submit Practice
                                  </>
                                )}
                              </Button>
                            ) : (
                              <Button
                                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                                disabled={currentQuestionIndex >= questions.length - 1}
                                className="flex items-center gap-2"
                              >
                                Next
                                <ChevronRight className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </GlassCard>
                  </motion.div>
                )}

                {/* Enhanced Practice Results */}
                {showResults && practiceResults && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <GlassCard className="p-8 text-center space-y-6">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex justify-center"
                      >
                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center">
                          <Trophy className="w-10 h-10 text-white" />
                        </div>
                      </motion.div>
                      
                      <div className="space-y-2">
                        <h3 className="text-3xl font-bold">Practice Complete!</h3>
                        <p className="text-muted-foreground">{practiceResults.feedback}</p>
                      </div>

                      <div className="grid grid-cols-3 gap-6">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-green-600">{practiceResults.correct}</div>
                          <div className="text-sm text-muted-foreground">Correct</div>
                        </div>
                        <div className="text-center">
                          <div className="text-4xl font-bold text-blue-600">{practiceResults.score}%</div>
                          <div className="text-sm text-muted-foreground">Score</div>
                        </div>
                        <div className="text-center">
                          <div className="text-4xl font-bold text-purple-600">{formatTime(sessionTimer)}</div>
                          <div className="text-sm text-muted-foreground">Time</div>
                        </div>
                      </div>

                      <div className="flex gap-4 justify-center">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedExam(null);
                            setQuestions([]);
                            setShowResults(false);
                          }}
                          className="flex items-center gap-2"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Back to Exams
                        </Button>
                        <Button
                          onClick={() => handleStartPractice(selectedExam!, 'medium')}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg flex items-center gap-2"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Practice Again
                        </Button>
                      </div>
                    </GlassCard>
                  </motion.div>
                )}

                {/* Enhanced Exam Grid */}
                {!selectedExam && (
                  <div className="space-y-6">
                    {/* Search and Filters */}
                    <GlassCard className="p-4">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            placeholder="Search certifications..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger className="w-full md:w-48">
                            <SelectValue placeholder="Category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {examCategories.map(category => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                          <SelectTrigger className="w-full md:w-48">
                            <SelectValue placeholder="Difficulty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Levels</SelectItem>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </GlassCard>

                    {/* Category Pills */}
                    <div className="flex flex-wrap gap-3">
                      {examCategories.map((category, index) => (
                        <motion.div
                          key={category.id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Button
                            variant={selectedCategory === category.id ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedCategory(category.id)}
                            className={`flex items-center gap-2 transition-all duration-200 ${
                              selectedCategory === category.id 
                                ? `bg-gradient-to-r ${category.color} text-white shadow-lg` 
                                : ''
                            }`}
                          >
                            <category.icon className="w-4 h-4" />
                            {category.name}
                          </Button>
                        </motion.div>
                      ))}
                    </div>

                    {/* Enhanced Exam Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredExams.map((exam, index) => {
                        const isEnrolled = userExams.some(ue => ue.exam_id === exam.id);
                        const progress = getExamProgress(exam.id);

                        return (
                          <motion.div
                            key={exam.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="group"
                          >
                            <GlassCard className="p-6 space-y-4 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                              {/* Gradient Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-purple-50/20 dark:from-blue-950/20 dark:to-purple-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              
                              <div className="relative z-10">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                                      <GraduationCap className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                      <h3 className="font-semibold group-hover:text-blue-600 transition-colors">
                                        {exam.name}
                                      </h3>
                                      <p className="text-sm text-muted-foreground">{exam.provider}</p>
                                    </div>
                                  </div>
                                  <Badge className={getDifficultyColor(exam.difficulty || 'Intermediate')}>
                                    {exam.difficulty || 'Intermediate'}
                                  </Badge>
                                </div>

                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {exam.description}
                                </p>

                                <div className="grid grid-cols-2 gap-3 text-xs">
                                  <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                                    <FileText className="w-3 h-3 text-blue-500" />
                                    <span>{exam.total_questions} questions</span>
                                  </div>
                                  <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                                    <Clock className="w-3 h-3 text-green-500" />
                                    <span>{exam.duration_minutes} min</span>
                                  </div>
                                  <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                                    <Target className="w-3 h-3 text-purple-500" />
                                    <span>{exam.passing_score}% to pass</span>
                                  </div>
                                  <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                                    <span className="text-green-600 font-semibold">${exam.exam_fee_usd}</span>
                                  </div>
                                </div>

                                {isEnrolled && progress > 0 && (
                                  <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                      <span className="font-medium">Progress</span>
                                      <span className="text-blue-600 font-semibold">{progress}%</span>
                                    </div>
                                    <Progress value={progress} className="h-2" />
                                  </div>
                                )}

                                <div className="space-y-2">
                                  {!isEnrolled ? (
                                    <Button
                                      onClick={() => handleEnrollInExam(exam.id)}
                                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                                      disabled={loading}
                                    >
                                      {loading ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                      ) : (
                                        <>
                                          <Sparkles className="w-4 h-4 mr-2" />
                                          Enroll Now
                                        </>
                                      )}
                                    </Button>
                                  ) : (
                                    <div className="grid grid-cols-2 gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleStartPractice(exam.id, 'easy')}
                                        disabled={loading}
                                        className="flex items-center gap-1 hover:bg-green-50 hover:border-green-300 dark:hover:bg-green-950/20"
                                      >
                                        <Play className="w-3 h-3" />
                                        Easy
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleStartPractice(exam.id, 'medium')}
                                        disabled={loading}
                                        className="flex items-center gap-1 hover:bg-yellow-50 hover:border-yellow-300 dark:hover:bg-yellow-950/20"
                                      >
                                        <Zap className="w-3 h-3" />
                                        Medium
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleStartPractice(exam.id, 'hard')}
                                        disabled={loading}
                                        className="flex items-center gap-1 hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-950/20"
                                      >
                                        <TargetIcon className="w-3 h-3" />
                                        Hard
                                      </Button>
                                      <Button
                                        size="sm"
                                        onClick={() => handleStartMockTest(exam.id, 50)}
                                        className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg flex items-center gap-1"
                                        disabled={loading}
                                      >
                                        <Trophy className="w-3 h-3" />
                                        Mock
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </GlassCard>
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </TabsContent>

            {/* Enhanced Revision Tab */}
            <TabsContent value="revision" className="space-y-6 mt-6">
              {/* Enhanced Study Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { 
                    icon: Clock, 
                    value: `${Math.floor(studyStats.totalStudyTime / 60)}h`, 
                    label: 'Study Time', 
                    color: 'text-blue-500',
                    gradient: 'from-blue-500 to-blue-600'
                  },
                  { 
                    icon: TrendingUp, 
                    value: studyStats.streakDays, 
                    label: 'Day Streak', 
                    color: 'text-green-500',
                    gradient: 'from-green-500 to-green-600'
                  },
                  { 
                    icon: CheckCircle, 
                    value: studyStats.completedSets, 
                    label: 'Sets Done', 
                    color: 'text-purple-500',
                    gradient: 'from-purple-500 to-purple-600'
                  },
                  { 
                    icon: BarChart3, 
                    value: `${studyStats.averageScore}%`, 
                    label: 'Avg Score', 
                    color: 'text-yellow-500',
                    gradient: 'from-yellow-500 to-yellow-600'
                  }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <GlassCard className="p-4 text-center group hover:shadow-lg transition-all duration-200">
                      <div className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-lg`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold mb-1">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>

              {/* Weekly Goal Progress */}
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Weekly Goal</h3>
                  <Badge variant="outline" className="text-xs">
                    {studyStats.weeklyProgress}/{studyStats.weeklyGoal} hours
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Progress 
                    value={(studyStats.weeklyProgress / studyStats.weeklyGoal) * 100} 
                    className="h-3" 
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{Math.round((studyStats.weeklyProgress / studyStats.weeklyGoal) * 100)}% complete</span>
                    <span>{studyStats.weeklyGoal - studyStats.weeklyProgress} hours remaining</span>
                  </div>
                </div>
              </GlassCard>

              {/* Enhanced Flashcard Sets */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Flashcard Sets</h3>
                  <Button
                    variant="outline"
                    onClick={() => handleGenerateFlashcards(exams[0]?.id)}
                    disabled={isGeneratingFlashcards || exams.length === 0}
                    className="flex items-center gap-2"
                  >
                    {isGeneratingFlashcards ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate New Set
                      </>
                    )}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {flashcardSets.map((set, index) => (
                    <motion.div
                      key={set.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="group"
                    >
                      <GlassCard className="p-4 space-y-3 hover:shadow-lg transition-all duration-200 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-50/20 to-blue-50/20 dark:from-green-950/20 dark:to-blue-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        <div className="relative z-10">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium group-hover:text-blue-600 transition-colors">
                              {set.name}
                            </h4>
                            {set.is_ai_generated && (
                              <Badge variant="outline" className="text-xs bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
                                <Bot className="w-3 h-3 mr-1" />
                                AI
                              </Badge>
                            )}
                          </div>

                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {set.description}
                          </p>

                          <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-3 h-3" />
                              {set.card_count} cards
                            </span>
                            <Badge className={getDifficultyColor(set.difficulty_filter)}>
                              {set.difficulty_filter}
                            </Badge>
                          </div>

                          {set.progress !== undefined && (
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>Progress</span>
                                <span className="font-semibold">{set.progress}%</span>
                              </div>
                              <Progress value={set.progress} className="h-1" />
                            </div>
                          )}

                          <Button 
                            size="sm" 
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg flex items-center gap-2"
                            onClick={() => window.open(`/flashcards/${set.id}`, '_blank')}
                          >
                            <Play className="w-3 h-3" />
                            Study Cards
                          </Button>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Quick Generate Section */}
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold mb-4">Generate Study Materials</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {exams.slice(0, 6).map((exam, index) => (
                    <motion.div
                      key={exam.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Button
                        variant="outline"
                        onClick={() => handleGenerateFlashcards(exam.id)}
                        disabled={isGeneratingFlashcards}
                        className="justify-start w-full p-3 h-auto hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-950/20 transition-all duration-200"
                      >
                        <Lightbulb className="w-4 h-4 mr-2 text-yellow-500" />
                        <div className="text-left">
                          <div className="font-medium text-sm">{exam.name}</div>
                          <div className="text-xs text-muted-foreground">Generate Cards</div>
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </TabsContent>

            {/* Enhanced AI Helper Tab */}
            <TabsContent value="ai-helper" className="space-y-6 mt-6">
              <GlassCard className="p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">AI Study Assistant</h3>
                    <p className="text-sm text-muted-foreground">
                      Get personalized help with your certification journey
                    </p>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600 font-medium">Online</span>
                  </div>
                </div>

                {/* Enhanced Chat History */}
                <div className="h-96 overflow-y-auto space-y-3 p-4 bg-muted/20 rounded-xl border">
                  <AnimatePresence>
                    {chatMessages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-4 rounded-2xl shadow-lg ${
                            message.role === 'user'
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                              : 'bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-200 border backdrop-blur-sm'
                          }`}
                        >
                          <div className="text-sm leading-relaxed">{message.content}</div>
                          <div className={`text-xs mt-2 flex items-center gap-1 ${
                            message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {message.role === 'assistant' && <Bot className="w-3 h-3" />}
                            {new Date(message.created_at).toLocaleTimeString()}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {isAITyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white/90 dark:bg-gray-800/90 border p-4 rounded-2xl backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                          <Bot className="w-4 h-4 text-purple-600" />
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* AI Suggestions */}
                {aiSuggestions.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Suggestions:</p>
                    <div className="flex flex-wrap gap-2">
                      {aiSuggestions.map((suggestion, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSendMessage(suggestion)}
                            disabled={isAITyping}
                            className="text-xs hover:bg-purple-50 hover:border-purple-300 dark:hover:bg-purple-950/20 transition-all duration-200"
                          >
                            {suggestion}
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Enhanced Message Input */}
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Ask me anything about your studies..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                      className="bg-white/50 dark:bg-gray-800/50 border-0 focus:bg-white/80 dark:focus:bg-gray-800/80 rounded-xl pr-12 backdrop-blur-sm"
                      disabled={isAITyping}
                    />
                    {inputMessage && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setInputMessage('')}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                      >
                        ×
                      </Button>
                    )}
                  </div>
                  <Button 
                    onClick={() => handleSendMessage()}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg flex items-center gap-2 rounded-xl"
                    disabled={isAITyping || !inputMessage.trim()}
                  >
                    {isAITyping ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <MessageSquare className="w-4 h-4" />
                    )}
                    Send
                  </Button>
                </div>

                {/* Quick Actions */}
                <div className="space-y-3">
                  <p className="text-sm font-medium">Quick Actions:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {quickActions.map((action, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Button
                          variant="outline"
                          onClick={() => handleSendMessage(action.text)}
                          className="justify-start text-left h-auto p-4 w-full hover:bg-purple-50 hover:border-purple-300 dark:hover:bg-purple-950/20 transition-all duration-200"
                          disabled={isAITyping}
                        >
                          <action.icon className="w-4 h-4 mr-3 flex-shrink-0 text-purple-600" />
                          <span className="text-sm">{action.text}</span>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </TabsContent>
          </Tabs>
        </GlassCard>
      </motion.div>
    </div>
  );
}