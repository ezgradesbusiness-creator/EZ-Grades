import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from '../Button';
import { GlassCard } from '../GlassCard';
import { CheckCircle, RotateCcw, AlertTriangle } from 'lucide-react';

interface HangmanGameProps {
  onComplete: () => void;
}

const words = [
  'JAVASCRIPT', 'PYTHON', 'COMPUTER', 'KEYBOARD', 'MONITOR', 'INTERNET',
  'BROWSER', 'WEBSITE', 'DATABASE', 'NETWORK', 'SECURITY', 'PASSWORD',
  'ALGORITHM', 'FUNCTION', 'VARIABLE', 'LIBRARY', 'FRAMEWORK', 'DEVELOPMENT'
];

const hangmanStages = [
  '', // 0 wrong guesses
  '  |\n  |\n  |\n  |\n  |', // 1 wrong
  '  +---+\n  |   |\n      |\n      |\n      |\n  +---+', // 2 wrong
  '  +---+\n  |   |\n  O   |\n      |\n      |\n  +---+', // 3 wrong
  '  +---+\n  |   |\n  O   |\n  |   |\n      |\n  +---+', // 4 wrong
  '  +---+\n  |   |\n  O   |\n /|   |\n      |\n  +---+', // 5 wrong
  '  +---+\n  |   |\n  O   |\n /|\\  |\n      |\n  +---+', // 6 wrong
  '  +---+\n  |   |\n  O   |\n /|\\  |\n /    |\n  +---+', // 7 wrong
  '  +---+\n  |   |\n  O   |\n /|\\  |\n / \\  |\n  +---+' // 8 wrong (game over)
];

export function HangmanGame({ onComplete }: HangmanGameProps) {
  const [currentWord, setCurrentWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [hint, setHint] = useState('');

  const maxWrongGuesses = 8;
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(randomWord);
    setGuessedLetters(new Set());
    setWrongGuesses(0);
    setGameStatus('playing');
    setHint(getHint(randomWord));
  };

  const getHint = (word: string): string => {
    const hints: Record<string, string> = {
      'JAVASCRIPT': 'Popular programming language for web development',
      'PYTHON': 'Programming language named after a snake',
      'COMPUTER': 'Electronic device for processing data',
      'KEYBOARD': 'Input device with keys for typing',
      'MONITOR': 'Display screen for computers',
      'INTERNET': 'Global network connecting computers worldwide',
      'BROWSER': 'Software for accessing websites',
      'WEBSITE': 'Collection of web pages on the internet',
      'DATABASE': 'Organized collection of data',
      'NETWORK': 'Connected group of computers',
      'SECURITY': 'Protection of data and systems',
      'PASSWORD': 'Secret code for authentication',
      'ALGORITHM': 'Step-by-step problem-solving procedure',
      'FUNCTION': 'Block of reusable code',
      'VARIABLE': 'Container for storing data values',
      'LIBRARY': 'Collection of pre-written code',
      'FRAMEWORK': 'Structure for developing applications',
      'DEVELOPMENT': 'Process of creating software'
    };
    return hints[word] || 'Technology-related term';
  };

  const guessLetter = (letter: string) => {
    if (guessedLetters.has(letter) || gameStatus !== 'playing') return;

    const newGuessedLetters = new Set(guessedLetters).add(letter);
    setGuessedLetters(newGuessedLetters);

    if (!currentWord.includes(letter)) {
      const newWrongGuesses = wrongGuesses + 1;
      setWrongGuesses(newWrongGuesses);
      
      if (newWrongGuesses >= maxWrongGuesses) {
        setGameStatus('lost');
      }
    } else {
      // Check if word is complete
      const isComplete = currentWord.split('').every(char => newGuessedLetters.has(char));
      if (isComplete) {
        setGameStatus('won');
        setTimeout(onComplete, 1500);
      }
    }
  };

  const getDisplayWord = () => {
    return currentWord
      .split('')
      .map(letter => guessedLetters.has(letter) ? letter : '_')
      .join(' ');
  };

  const getLetterStatus = (letter: string) => {
    if (!guessedLetters.has(letter)) return 'available';
    return currentWord.includes(letter) ? 'correct' : 'wrong';
  };

  return (
    <GlassCard className="p-6 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-2">Hangman</h2>
        <p className="text-muted-foreground">Guess the word letter by letter</p>
        <p className="text-sm text-muted-foreground mt-1">
          Wrong guesses: {wrongGuesses}/{maxWrongGuesses}
        </p>
      </div>

      {/* Hangman Drawing */}
      <div className="text-center mb-6">
        <div className="glass-card p-4 inline-block">
          <pre className="text-sm font-mono leading-tight text-muted-foreground">
            {hangmanStages[wrongGuesses]}
          </pre>
        </div>
      </div>

      {/* Word Display */}
      <div className="text-center mb-6">
        <div className="text-3xl font-mono font-bold tracking-wider mb-4">
          {getDisplayWord()}
        </div>
        
        {/* Hint */}
        <div className="glass-card p-3 max-w-md mx-auto">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Hint:</span> {hint}
          </p>
        </div>
      </div>

      {/* Game Status */}
      {gameStatus === 'won' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-green-500">Congratulations!</h3>
          <p className="text-muted-foreground">You guessed the word: {currentWord}</p>
        </motion.div>
      )}

      {gameStatus === 'lost' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-red-500">Game Over!</h3>
          <p className="text-muted-foreground">The word was: {currentWord}</p>
        </motion.div>
      )}

      {/* Alphabet */}
      <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-9 gap-2 mb-6">
        {alphabet.map(letter => {
          const status = getLetterStatus(letter);
          return (
            <motion.button
              key={letter}
              onClick={() => guessLetter(letter)}
              disabled={guessedLetters.has(letter) || gameStatus !== 'playing'}
              className={`
                aspect-square flex items-center justify-center font-medium rounded-lg
                transition-all duration-200 border-2
                ${status === 'available' 
                  ? 'glass-card border-border hover:glow-primary hover:scale-105' 
                  : status === 'correct'
                  ? 'bg-green-500/20 border-green-500 text-green-500'
                  : 'bg-red-500/20 border-red-500 text-red-500 opacity-50'
                }
                ${gameStatus !== 'playing' ? 'cursor-not-allowed' : 'cursor-pointer'}
              `}
              whileHover={status === 'available' && gameStatus === 'playing' ? { scale: 1.05 } : {}}
              whileTap={status === 'available' && gameStatus === 'playing' ? { scale: 0.95 } : {}}
            >
              {letter}
            </motion.button>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex gap-3 justify-center">
        <Button
          variant="outline"
          onClick={startNewGame}
          icon={<RotateCcw className="w-4 h-4" />}
        >
          New Word
        </Button>
      </div>
    </GlassCard>
  );
}