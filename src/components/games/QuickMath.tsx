
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

type QuickMathProps = {
  onGameWin: () => void;
  onGameRestart: () => void;
};

const QuickMath: React.FC<QuickMathProps> = ({ onGameWin, onGameRestart }) => {
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [currentProblem, setCurrentProblem] = useState<{ question: string; answer: number }>({ question: "", answer: 0 });
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [gameWon, setGameWon] = useState<boolean>(false);

  // Required score to win
  const requiredScore = 10;
  
  // Generate a random math problem
  const generateProblem = () => {
    const operations = ["+", "-", "*"];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let num1: number, num2: number, answer: number;
    
    switch(operation) {
      case "+":
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        answer = num1 + num2;
        break;
      case "-":
        num1 = Math.floor(Math.random() * 50) + 10;
        num2 = Math.floor(Math.random() * num1) + 1;
        answer = num1 - num2;
        break;
      case "*":
        num1 = Math.floor(Math.random() * 12) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
        answer = num1 * num2;
        break;
      default:
        num1 = 0;
        num2 = 0;
        answer = 0;
    }
    
    const question = `${num1} ${operation} ${num2}`;
    return { question, answer };
  };
  
  // Start game
  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setTimeLeft(60);
    setUserAnswer("");
    setCurrentProblem(generateProblem());
  };
  
  // Handle user input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserAnswer(e.target.value);
  };
  
  // Handle answer submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const userNum = parseInt(userAnswer, 10);
    
    if (userNum === currentProblem.answer) {
      setScore(score + 1);
      
      // Check if player has won
      if (score + 1 >= requiredScore) {
        setGameWon(true);
        return;
      }
    }
    
    // Generate a new problem either way
    setCurrentProblem(generateProblem());
    setUserAnswer("");
  };
  
  // Timer effect
  useEffect(() => {
    if (gameStarted && !gameWon && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameStarted) {
      // Game over due to time
      setGameStarted(false);
    }
  }, [timeLeft, gameStarted, gameWon]);
  
  // Effect to check if player has won
  useEffect(() => {
    if (gameWon) {
      onGameWin();
    }
  }, [gameWon, onGameWin]);
  
  const restartGame = () => {
    setGameStarted(false);
    setGameWon(false);
    onGameRestart();
  };

  // Render start screen
  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <h3 className="text-xl font-bold text-game-neon-cyan mb-6">Quick Math Challenge</h3>
        <p className="text-gray-300 mb-6 text-center">
          Solve {requiredScore} math problems correctly within 60 seconds to win!
        </p>
        <Button 
          onClick={startGame}
          className="bg-game-neon-purple hover:bg-game-neon-purple/80 text-white"
        >
          Start Game
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="flex justify-between w-full mb-6">
        <div className="text-gray-300">Score: {score}/{requiredScore}</div>
        <div className={`${timeLeft <= 10 ? "text-red-500" : "text-gray-300"}`}>
          Time: {timeLeft}s
        </div>
      </div>
      
      <div className="bg-game-dark-card p-6 rounded-lg border border-gray-700 mb-6 w-full max-w-md">
        <div className="text-3xl text-center text-white mb-6">
          {currentProblem.question} = ?
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <input
            type="number"
            value={userAnswer}
            onChange={handleInputChange}
            className="w-full p-3 bg-game-dark-surface text-white border border-gray-700 rounded mb-4 text-center text-xl"
            placeholder="Your answer"
            autoFocus
          />
          
          <Button 
            type="submit"
            className="bg-game-neon-cyan text-black hover:bg-game-neon-cyan/80 w-full"
          >
            Submit
          </Button>
        </form>
      </div>
      
      <Button 
        onClick={restartGame}
        variant="outline"
        className="border-gray-600 text-gray-400 hover:bg-gray-800"
      >
        <RefreshCcw className="mr-2" size={16} />
        Restart
      </Button>
    </div>
  );
};

export default QuickMath;
