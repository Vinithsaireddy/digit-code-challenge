
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

type WordScrambleProps = {
  onGameWin: () => void;
  onGameRestart: () => void;
};

const WordScramble: React.FC<WordScrambleProps> = ({ onGameWin, onGameRestart }) => {
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [currentWord, setCurrentWord] = useState<string>("");
  const [scrambledWord, setScrambledWord] = useState<string>("");
  const [userGuess, setUserGuess] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  // Required score to win
  const requiredScore = 5;

  // List of words for the game
  const words = [
    "REACT", "CODE", "JAVASCRIPT", "DEVELOPER",
    "PROGRAMMING", "WEB", "CHALLENGE", "GAME",
    "INTERFACE", "COMPUTER", "SOFTWARE", "DIGITAL",
    "FUNCTION", "MODULE", "ALGORITHM", "ENCRYPTION"
  ];

  // Scramble a word
  const scrambleWord = (word: string) => {
    const letters = word.split("");

    // Fisher-Yates shuffle algorithm
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }

    // Make sure the scrambled word is different from the original
    const scrambled = letters.join("");
    if (scrambled === word) {
      return scrambleWord(word);
    }

    return scrambled;
  };

  // Get a new word
  const getNewWord = () => {
    const randomIndex = Math.floor(Math.random() * words.length);
    const word = words[randomIndex];
    const scrambled = scrambleWord(word);

    setCurrentWord(word);
    setScrambledWord(scrambled);
  };

  // Start game
  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setTimeLeft(60);
    setUserGuess("");
    setMessage("");
    setMessageType("");
    getNewWord();
  };

  // Handle user input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserGuess(e.target.value.toUpperCase());
  };

  // Handle guess submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (userGuess.toUpperCase() === currentWord) {
      // Correct guess
      setScore(prev => prev + 1);
      setMessage("Correct!");
      setMessageType("success");

      // Check if player has won
      if (score + 1 >= requiredScore) {
        setGameWon(true);
        return;
      }

      // Get a new word after a brief delay
      setTimeout(() => {
        getNewWord();
        setUserGuess("");
        setMessage("");
      }, 1000);
    } else {
      // Incorrect guess
      setMessage("Try again!");
      setMessageType("error");
    }
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
        <h3 className="text-xl font-bold text-game-neon-cyan mb-6">Word Scramble Challenge</h3>
        <p className="text-gray-300 mb-6 text-center">
          Unscramble {requiredScore} words correctly within 60 seconds to win!
        </p>
        <div className="bg-game-dark-card p-4 rounded-lg border border-gray-700 text-left max-w-md w-full mb-6">
          <h4 className="text-lg font-semibold text-game-neon-purple mb-2">📜 Rules</h4>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            <li>You’ll be shown a <span className="text-game-neon-cyan font-bold">scrambled word</span>.</li>
            <li>Type your guess and hit <span className="font-semibold text-game-neon-cyan">Submit</span>.</li>
            <li>You earn 1 point for every correct guess.</li>
            <li>You have <span className="font-semibold text-game-neon-cyan">60 seconds</span> to score at least <span className="font-semibold">{requiredScore}</span> points.</li>
            <li>Guesses are <span className="text-game-neon-green font-bold">case-insensitive</span>.</li>
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
      <div className="flex justify-between w-full mb-6">
        <div className="text-gray-300">Score: {score}/{requiredScore}</div>
        <div className={`${timeLeft <= 10 ? "text-red-500" : "text-gray-300"}`}>
          Time: {timeLeft}s
        </div>
      </div>

      <div className="bg-game-dark-card p-6 rounded-lg border border-gray-700 mb-6 w-full max-w-md">
        <div className="text-3xl text-center text-game-neon-purple mb-6">
          {scrambledWord}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <input
            type="text"
            value={userGuess}
            onChange={handleInputChange}
            className="w-full p-3 bg-game-dark-surface text-white border border-gray-700 rounded mb-4 text-center text-xl"
            placeholder="Your guess"
            autoFocus
            autoComplete="off"
          />

          {message && (
            <div className={`w-full mb-4 p-2 text-center rounded ${messageType === "success" ? "bg-green-600/20 text-green-400" :
                messageType === "error" ? "bg-red-600/20 text-red-400" : ""
              }`}>
              {message}
            </div>
          )}

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

export default WordScramble;
