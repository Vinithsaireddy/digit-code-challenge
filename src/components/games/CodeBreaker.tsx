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

  // Maximum attempts allowed
  const maxAttempts = 10;

  // Available colors
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
  ];

  // Generate a random code
  const generateCode = () => {
    const code = [];
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * colors.length);
      code.push(colors[randomIndex]);
    }
    return code;
  };

  // Start game
  const startGame = () => {
    const newCode = generateCode();
    setSecretCode(newCode);
    setGameStarted(true);
    setCurrentGuess(["", "", "", ""]);
    setGuessHistory([]);
    setSelectedPosition(0);
    setGameWon(false);
    setAttempts(0);
  };

  // Select a position to place a color
  const selectPosition = (position: number) => {
    setSelectedPosition(position);
  };

  // Select a color for the current position
  const selectColor = (color: string) => {
    const newGuess = [...currentGuess];
    newGuess[selectedPosition] = color;
    setCurrentGuess(newGuess);

    // Auto-advance to the next empty position
    const nextEmptyIndex = newGuess.findIndex(c => c === "");
    if (nextEmptyIndex !== -1) {
      setSelectedPosition(nextEmptyIndex);
    }
  };

  // Submit a guess
  const submitGuess = () => {
    // Ensure all positions have a color
    if (currentGuess.some(color => color === "")) return;

    // Calculate correct and misplaced
    let correct = 0;
    let misplaced = 0;

    const codeCopy = [...secretCode];
    const guessCopy = [...currentGuess];

    // First check for exact matches
    for (let i = 0; i < secretCode.length; i++) {
      if (guessCopy[i] === codeCopy[i]) {
        correct++;
        guessCopy[i] = "matched";
        codeCopy[i] = "matched";
      }
    }

    // Then check for misplaced matches
    for (let i = 0; i < secretCode.length; i++) {
      if (guessCopy[i] !== "matched") {
        const index = codeCopy.findIndex(color => color === guessCopy[i]);
        if (index !== -1) {
          misplaced++;
          codeCopy[index] = "counted";
        }
      }
    }

    // Add to history
    const newGuessEntry: Guess = {
      code: currentGuess,
      feedback: { correct, misplaced }
    };

    const newHistory = [...guessHistory, newGuessEntry];
    setGuessHistory(newHistory);
    setAttempts(attempts + 1);

    // Check if player has won
    if (correct === 4) {
      setGameWon(true);
    } else if (attempts + 1 >= maxAttempts) {
      // Player has lost if they've used all attempts
    } else {
      // Reset for next guess
      setCurrentGuess(["", "", "", ""]);
      setSelectedPosition(0);
    }
  };

  // Effect to check if player has won
  useEffect(() => {
    if (gameWon) {
      onGameWin();
    }
  }, [gameWon, onGameWin]);

  const restartGame = () => {
    setGameStarted(false);
    onGameRestart();
  };

  console.log("Correct pattern was:", secretCode);

  // Render start screen
  if (!gameStarted) {
    // Inside: if (!gameStarted) { return (...) }

    return (
      <div className="flex flex-col items-center justify-center p-6">
        <h3 className="text-xl font-bold text-game-neon-cyan mb-6">Code Breaker Challenge</h3>

        {/* 📌 Add rules section here */}
        <div className="bg-gray-800 p-4 rounded-md text-sm text-gray-300 mb-6 max-w-md">
          <h4 className="text-white font-semibold mb-2">How to Play:</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>The secret code is made up of 4 colors randomly selected.</li>
            <li>Select colors and assign them to each position in your guess.</li>
            <li>After submitting, you'll get feedback:</li>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Correct:</strong> Color is in the correct position.</li>
              <li><strong>Misplaced:</strong> Color is correct but in the wrong position.</li>
            </ul>
            <li>You have <strong>{maxAttempts} attempts</strong> to guess the correct code.</li>
            <li>If all 4 colors are correct and in the right order, you win!</li>
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

      {/* Color selection */}
      <div className="flex gap-2 mb-6">
        {colors.map((color, index) => (
          <button
            key={index}
            className={`w-8 h-8 rounded-full ${color} hover:scale-110 transition-transform`}
            onClick={() => selectColor(color)}
          />
        ))}
      </div>

      {/* Current guess */}
      <div className="flex gap-2 mb-6 p-2 bg-game-dark-card rounded-md border border-gray-700">
        {currentGuess.map((color, index) => (
          <button
            key={index}
            className={`w-10 h-10 rounded-full border-2 transition-all ${color || "bg-gray-800"
              } ${selectedPosition === index ? "border-white scale-110" : "border-transparent"}`}
            onClick={() => selectPosition(index)}
          />
        ))}

        <Button
          onClick={submitGuess}
          disabled={currentGuess.some(color => color === "")}
          className="ml-4 bg-game-neon-cyan text-black hover:bg-game-neon-cyan/80"
        >
          Submit
        </Button>
      </div>

      {/* Guess history */}
      <div className="w-full max-h-64 overflow-y-auto space-y-2 mb-6">
        {guessHistory.map((guess, index) => (
          <div key={index} className="flex items-center p-2 bg-game-dark-surface rounded-md justify-between">
            <div className="flex gap-2">
              {guess.code.map((color, cIndex) => (
                <div
                  key={cIndex}
                  className={`w-8 h-8 rounded-full ${color}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-1">
              {/* Display feedback: text for correct and misplaced */}
              <div className="text-gray-300">
                {guess.feedback.correct} correct, {guess.feedback.misplaced} misplaced
              </div>
            </div>
          </div>
        ))}
      </div>

      {attempts >= maxAttempts && !gameWon && (
        <div className="text-center mb-4 text-red-400">
          <p>Game over! You've used all your attempts.</p>
          <div className="flex gap-2 justify-center mt-2">
            {secretCode.map((color, index) => (
              <div key={index} className={`w-8 h-8 rounded-full ${color}`} />
            ))}
          </div>
        </div>
      )}

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

export default CodeBreaker;
