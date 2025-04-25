import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

type CodeBreakerProps = {
  onGameWin: () => void;
  onGameRestart: () => void;
};

type Guess = {
  code: string[];
  feedback: { correct: number; misplaced: number };
};

const CodeBreaker: React.FC<CodeBreakerProps> = ({ onGameWin, onGameRestart }) => {
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [secretCode, setSecretCode] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string[]>(["", "", "", ""]);
  const [guessHistory, setGuessHistory] = useState<Guess[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<number>(0);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);
  const [hintsUsed, setHintsUsed] = useState<boolean>(false);

  const maxAttempts = 15;
  const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  const generateCode = () => {
    const code: string[] = [];
    for (let i = 0; i < 4; i++) {
      const randomDigit = digits[Math.floor(Math.random() * digits.length)];
      code.push(randomDigit);
    }
    return code;
  };

  const startGame = () => {
    const newCode = generateCode();
    console.log("Secret Code:", newCode);
    setSecretCode(newCode);
    setGameStarted(true);
    setCurrentGuess(["", "", "", ""]);
    setGuessHistory([]);
    setSelectedPosition(0);
    setGameWon(false);
    setAttempts(0);
    setHintsUsed(false);
  };

  const selectPosition = (position: number) => {
    setSelectedPosition(position);
  };

  const selectDigit = (digit: string) => {
    const newGuess = [...currentGuess];
    newGuess[selectedPosition] = digit;
    setCurrentGuess(newGuess);

    const nextEmptyIndex = newGuess.findIndex(d => d === "");
    if (nextEmptyIndex !== -1) {
      setSelectedPosition(nextEmptyIndex);
    }
  };

  const submitGuess = () => {
    if (currentGuess.some(d => d === "")) return;

    let correct = 0;
    let misplaced = 0;

    const codeCopy = [...secretCode];
    const guessCopy = [...currentGuess];

    // Check for exact matches
    for (let i = 0; i < secretCode.length; i++) {
      if (guessCopy[i] === codeCopy[i]) {
        correct++;
        guessCopy[i] = "matched";
        codeCopy[i] = "matched";
      }
    }

    // Check for misplaced digits
    for (let i = 0; i < secretCode.length; i++) {
      if (guessCopy[i] !== "matched") {
        const index = codeCopy.findIndex(d => d === guessCopy[i]);
        if (index !== -1) {
          misplaced++;
          codeCopy[index] = "counted";
        }
      }
    }

    const newGuessEntry: Guess = {
      code: currentGuess,
      feedback: { correct, misplaced }
    };

    setGuessHistory([...guessHistory, newGuessEntry]);
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    if (correct === 4) {
      setGameWon(true);
    } else if (nextAttempts >= maxAttempts) {
      // Game over handled below
    } else {
      setCurrentGuess(["", "", "", ""]);
      setSelectedPosition(0);
    }
  };

  useEffect(() => {
    if (gameWon) {
      onGameWin();
    }
  }, [gameWon, onGameWin]);

  const restartGame = () => {
    setGameStarted(false);
    onGameRestart();
  };

  const sumOfSecretCode = secretCode.reduce((sum, digit) => sum + Number(digit), 0);

  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <h3 className="text-xl font-bold text-game-neon-cyan mb-6">Code Breaker Challenge</h3>
        <div className="bg-gray-800 p-4 rounded-md text-sm text-gray-300 mb-6 max-w-md">
          <h4 className="text-white font-semibold mb-2">How to Play:</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>The secret code is made up of 4 digits (0-9).</li>
            <li>Select digits and assign them to each position in your guess.</li>
            <li>You'll get feedback after each guess:</li>
            <ul className="pl-6 list-disc">
              <li><strong>Correct:</strong> Digit is in the correct position.</li>
              <li><strong>Misplaced:</strong> Digit is correct but in the wrong position.</li>
            </ul>
            <li>You have <strong>{maxAttempts} attempts</strong> to guess the code.</li>
            <li>After 10 attempts, a hint will be revealed: the sum of the code digits.</li>
          </ul>
        </div>

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
      <div className="flex justify-between w-full mb-4">
        <div className="text-gray-300">Attempts: {attempts}/{maxAttempts}</div>
      </div>

      {/* Digit selection */}
      <div className="grid grid-cols-5 gap-2 mb-6">
        {digits.map((digit, index) => (
          <button
            key={index}
            className="w-10 h-10 rounded-md bg-gray-700 text-white hover:bg-gray-600"
            onClick={() => selectDigit(digit)}
          >
            {digit}
          </button>
        ))}
      </div>

      {/* Current guess */}
      <div className="flex gap-2 mb-6 p-2 bg-game-dark-card rounded-md border border-gray-700">
        {currentGuess.map((digit, index) => (
          <button
            key={index}
            className={`w-10 h-10 rounded-md text-white font-bold text-lg border-2 
              ${selectedPosition === index ? "border-white bg-gray-800" : "border-transparent bg-gray-700"}`}
            onClick={() => selectPosition(index)}
          >
            {digit}
          </button>
        ))}

        <Button
          onClick={submitGuess}
          disabled={currentGuess.some(d => d === "")}
          className="ml-4 bg-game-neon-cyan text-black hover:bg-game-neon-cyan/80"
        >
          Submit
        </Button>
      </div>

      {/* Guess history */}
      <div className="w-full max-h-64 overflow-y-auto space-y-2 mb-6">
        {guessHistory.map((guess, index) => (
          <div key={index} className="flex items-center p-2 bg-game-dark-surface rounded-md justify-between">
            <div className="flex gap-2 text-white">
              {guess.code.map((digit, i) => (
                <div
                  key={i}
                  className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-md"
                >
                  {digit}
                </div>
              ))}
            </div>

            <div className="text-gray-300 text-sm">
              {guess.feedback.correct} correct, {guess.feedback.misplaced} misplaced
            </div>
          </div>
        ))}
      </div>

      {/* Hint */}
      {attempts >= 10 && !hintsUsed && (
        <div className="text-yellow-400 font-semibold mb-4">
          🔍 Hint: The sum of the digits in the secret code is <strong>{sumOfSecretCode}</strong>
        </div>
      )}

      {/* Game Over */}
      {attempts >= maxAttempts && !gameWon && (
        <div className="text-center mb-4 text-red-400">
          <p>Game over! You've used all your attempts.</p>
          <div className="flex gap-2 justify-center mt-2 text-white">
            {secretCode.map((digit, index) => (
              <div key={index} className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-md">
                {digit}
              </div>
            ))}
          </div>
        </div>
      )}

      <Button
        onClick={restartGame}
        variant="outline"
        className="border-gray-600 text-gray-400 hover:bg-gray-800 mt-2"
      >
        <RefreshCcw className="mr-2" size={16} />
        Restart
      </Button>
    </div>
  );
};

export default CodeBreaker;
