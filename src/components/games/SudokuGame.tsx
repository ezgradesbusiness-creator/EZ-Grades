import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from '../Button';
import { GlassCard } from '../GlassCard';
import { CheckCircle, RotateCcw, Eraser } from 'lucide-react';

interface SudokuGameProps {
  onComplete: () => void;
}

type SudokuGrid = (number | null)[][];

// Easy Sudoku puzzle - 4x4 for simplicity
const initialPuzzle: SudokuGrid = [
  [null, 2, null, 4],
  [4, null, 1, null],
  [null, 1, null, 2],
  [3, null, 4, null]
];

const solution: SudokuGrid = [
  [1, 2, 3, 4],
  [4, 3, 1, 2],
  [2, 1, 4, 3],
  [3, 4, 2, 1]
];

export function SudokuGame({ onComplete }: SudokuGameProps) {
  const [grid, setGrid] = useState<SudokuGrid>(initialPuzzle.map(row => [...row]));
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [errors, setErrors] = useState<Set<string>>(new Set());

  const isInitialCell = (row: number, col: number): boolean => {
    return initialPuzzle[row][col] !== null;
  };

  const validateMove = (row: number, col: number, num: number): boolean => {
    const size = 4; // 4x4 grid
    
    // Check row
    for (let c = 0; c < size; c++) {
      if (c !== col && grid[row][c] === num) return false;
    }

    // Check column
    for (let r = 0; r < size; r++) {
      if (r !== row && grid[r][col] === num) return false;
    }

    // Check 2x2 box for 4x4 sudoku
    const boxRow = Math.floor(row / 2) * 2;
    const boxCol = Math.floor(col / 2) * 2;
    for (let r = boxRow; r < boxRow + 2; r++) {
      for (let c = boxCol; c < boxCol + 2; c++) {
        if ((r !== row || c !== col) && grid[r][c] === num) return false;
      }
    }

    return true;
  };

  const handleCellClick = (row: number, col: number) => {
    if (isInitialCell(row, col) || isComplete) return;
    setSelectedCell([row, col]);
  };

  const handleNumberInput = (num: number) => {
    if (!selectedCell || isComplete) return;
    
    const [row, col] = selectedCell;
    if (isInitialCell(row, col)) return;

    const newGrid = grid.map(r => [...r]);
    
    if (validateMove(row, col, num)) {
      newGrid[row][col] = num;
      setErrors(prev => {
        const newErrors = new Set(prev);
        newErrors.delete(`${row}-${col}`);
        return newErrors;
      });
    } else {
      newGrid[row][col] = num;
      setErrors(prev => new Set(prev).add(`${row}-${col}`));
    }

    setGrid(newGrid);
    
    // Check if solved
    checkCompletion(newGrid);
  };

  const clearCell = () => {
    if (!selectedCell || isComplete) return;
    
    const [row, col] = selectedCell;
    if (isInitialCell(row, col)) return;

    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = null;
    setGrid(newGrid);
    
    setErrors(prev => {
      const newErrors = new Set(prev);
      newErrors.delete(`${row}-${col}`);
      return newErrors;
    });
  };

  const checkCompletion = (currentGrid: SudokuGrid) => {
    // Check if all cells are filled
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (currentGrid[row][col] === null) return;
      }
    }

    // Check if solution is correct
    let isCorrect = true;
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (currentGrid[row][col] !== solution[row][col]) {
          isCorrect = false;
          break;
        }
      }
      if (!isCorrect) break;
    }

    if (isCorrect) {
      setIsComplete(true);
      setTimeout(onComplete, 1500);
    }
  };

  const resetGame = () => {
    setGrid(initialPuzzle.map(row => [...row]));
    setSelectedCell(null);
    setIsComplete(false);
    setErrors(new Set());
  };

  return (
    <GlassCard className="p-6 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-2">Mini Sudoku (4x4)</h2>
        <p className="text-muted-foreground">Fill each row, column, and 2x2 box with numbers 1-4</p>
      </div>

      {/* Sudoku Grid */}
      <div className="grid grid-cols-4 gap-1 mb-6 max-w-xs mx-auto border-2 border-border rounded-lg overflow-hidden p-2 bg-white/5">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isSelected = selectedCell && selectedCell[0] === rowIndex && selectedCell[1] === colIndex;
            const isInitial = isInitialCell(rowIndex, colIndex);
            const hasError = errors.has(`${rowIndex}-${colIndex}`);
            const isThickBorder = {
              right: colIndex === 1,
              bottom: rowIndex === 1
            };
            
            return (
              <motion.button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                className={`
                  aspect-square flex items-center justify-center text-lg font-medium
                  border border-border/30 rounded
                  ${isSelected ? 'bg-primary-solid/20 ring-2 ring-primary-solid' : 'bg-card/50'}
                  ${isInitial ? 'bg-muted/50 font-bold text-primary-solid' : 'hover:bg-primary-solid/10'}
                  ${hasError ? 'text-red-500 bg-red-500/10 ring-2 ring-red-500/50' : ''}
                  ${isThickBorder.right ? 'border-r-2 border-r-border' : ''}
                  ${isThickBorder.bottom ? 'border-b-2 border-b-border' : ''}
                  transition-all duration-200
                `}
                whileHover={!isInitial ? { scale: 1.05 } : {}}
                whileTap={!isInitial ? { scale: 0.95 } : {}}
                disabled={isInitial || isComplete}
              >
                {cell || ''}
              </motion.button>
            );
          })
        )}
      </div>

      {/* Success Message */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-green-500">Puzzle Solved!</h3>
          <p className="text-muted-foreground">Excellent work on completing the Sudoku!</p>
        </motion.div>
      )}

      {/* Number Input */}
      <div className="grid grid-cols-4 gap-2 mb-6 max-w-xs mx-auto">
        {[1, 2, 3, 4].map(num => (
          <Button
            key={num}
            variant="outline"
            onClick={() => handleNumberInput(num)}
            disabled={!selectedCell || isComplete}
            className="aspect-square"
          >
            {num}
          </Button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-3 justify-center">
        <Button
          variant="outline"
          onClick={clearCell}
          icon={<Eraser className="w-4 h-4" />}
          disabled={!selectedCell || isComplete}
        >
          Clear
        </Button>
        
        <Button
          variant="outline"
          onClick={resetGame}
          icon={<RotateCcw className="w-4 h-4" />}
        >
          Reset
        </Button>
      </div>
    </GlassCard>
  );
}