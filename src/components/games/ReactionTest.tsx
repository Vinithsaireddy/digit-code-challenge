
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

type ReactionTestProps = {
  onGameWin: () => void;
  onGameRestart: () => void;
};

const ReactionTest: React.FC<ReactionTestProps> = ({ onGameWin, onGameRestart }) => {
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameState, setGameState] = useState<"waiting" | "ready" | "clicked" | "tooEarly">("waiting");
  const [startTime, setStartTime] = useState<number>(0);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [attempts, setAttempts] = useState<number>(0);
  const [gameWon, setGameWon] = useState<boolean>(false);

  // Required attempts and target time to win
  const requiredAttempts = 5;
  const targetTime = 100; // milliseconds

  // Start game
  const startGame = () => {
    setGameStarted(true);
    setGameState("waiting");
    setReactionTime(null);
    setAttempts(0);
    setGameWon(false);
    prepareTest();
  };

  // Prepare for a new test
  const prepareTest = () => {
    setGameState("waiting");

    // Random delay between 1-5 seconds
    const delay = Math.floor(Math.random() * 4000) + 1000;

    setTimeout(() => {
      if (gameState !== "tooEarly") {
        setStartTime(Date.now());
        setGameState("ready");
      }
    }, delay);
  };

  // Handle click on the target
  const handleClick = () => {
    if (gameState === "waiting") {
      // Clicked too early
      setGameState("tooEarly");
      setTimeout(() => prepareTest(), 1000);
    } else if (gameState === "ready") {
      // Valid click, calculate reaction time
      const endTime = Date.now();
      const time = endTime - startTime;

      setReactionTime(time);
      setGameState("clicked");

      // Update best time if applicable
      if (bestTime === null || time < bestTime) {
        setBestTime(time);
      }

      // Check win condition if required attempts are completed
      if (attempts + 1 >= requiredAttempts) {
        if (bestTime !== null && bestTime <= targetTime) {
          setGameWon(true);
        }
      }

      setAttempts(prev => prev + 1);

      // Prepare for the next test after a delay
      setTimeout(() => {
        if (!gameWon && attempts + 1 >= requiredAttempts) {
          // Game over if attempts completed but didn't win
          setGameState("waiting");
        } else if (!gameWon) {
          prepareTest();
        }
      }, 1500);
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

  // Render start screen
  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <h3 className="text-xl font-bold text-game-neon-cyan mb-6">Reaction Test Challenge</h3>
        <p className="text-gray-300 mb-6 text-center">
          When the color changes to green, click as fast as you can! Complete {requiredAttempts} attempts with your best time under {targetTime}ms to win.
        </p>
        <div className="bg-game-dark-card p-4 rounded-lg border border-gray-700 text-left max-w-md w-full mb-6">
          <h4 className="text-lg font-semibold text-game-neon-purple mb-2">📜 Rules</h4>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            <li>Wait until the box turns <span className="text-game-neon-green font-bold">green</span>.</li>
            <li>Click as fast as you can when it turns green.</li>
            <li>If you click too early, it won’t count.</li>
            <li>Complete <span className="font-semibold text-game-neon-cyan">{requiredAttempts}</span> rounds.</li>
            <li>To win, your <span className="font-semibold text-game-neon-cyan">best reaction time</span> must be under <span className="font-semibold">{targetTime}ms</span>.</li>
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
        <div className="text-gray-300">Attempts: {attempts}/{requiredAttempts}</div>
        <div className="text-gray-300">
          Best: {bestTime !== null ? `${bestTime}ms` : "N/A"}
          {bestTime !== null && bestTime <= targetTime && " ✓"}
        </div>
      </div>

      <div
        className={`w-64 h-64 rounded-md flex items-center justify-center cursor-pointer transition-colors duration-200 mb-6 ${gameState === "waiting"
            ? "bg-red-600 hover:bg-red-700"
            : gameState === "ready"
              ? "bg-green-600 hover:bg-green-700"
              : gameState === "tooEarly"
                ? "bg-yellow-600"
                : "bg-blue-600"
          }`}
        onClick={handleClick}
      >
        <div className="text-white text-center p-4">
          {gameState === "waiting" && "Wait..."}
          {gameState === "ready" && "Click Now!"}
          {gameState === "clicked" && reactionTime !== null && `${reactionTime} ms`}
          {gameState === "tooEarly" && "Too early!"}
        </div>
      </div>

      <div className="text-gray-300 mb-4">
        {attempts >= requiredAttempts && !gameWon && (
          <p>Your best time wasn't fast enough. Try again!</p>
        )}
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

export default ReactionTest;
