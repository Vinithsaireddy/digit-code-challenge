
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Play } from "lucide-react";

type PatternMemoryProps = {
  onGameWin: () => void;
  onGameRestart: () => void;
};

const PatternMemory: React.FC<PatternMemoryProps> = ({ onGameWin, onGameRestart }) => {
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [isShowingSequence, setIsShowingSequence] = useState<boolean>(false);
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const [round, setRound] = useState<number>(1);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");

  // Number of rounds to win
  const roundsToWin = 5;

  // Colors for the buttons
  const colors = [
    "bg-red-600",
    "bg-blue-600",
    "bg-green-600",
    "bg-yellow-600"
  ];

  // Start a new game
  const startGame = () => {
    setGameStarted(true);
    setRound(1);
    setStatus("Watch the sequence...");
    startNewRound();
  };

  // Start a new round
  const startNewRound = () => {
    // Generate a new sequence for this round
    const newSequence = [...sequence];
    newSequence.push(Math.floor(Math.random() * 4));

    setSequence(newSequence);
    setUserSequence([]);

    // Show the sequence to the player
    showSequence(newSequence);
  };

  // Show the sequence to the player
  const showSequence = (seq: number[]) => {
    setIsShowingSequence(true);
    let i = 0;

    const intervalId = setInterval(() => {
      if (i < seq.length) {
        setActiveButton(seq[i]);
        setTimeout(() => setActiveButton(null), 500);
        i++;
      } else {
        clearInterval(intervalId);
        setIsShowingSequence(false);
        setStatus("Your turn! Repeat the sequence.");
      }
    }, 800);
  };

  // Handle button click
  const handleButtonClick = (index: number) => {
    if (isShowingSequence) return;

    const newUserSequence = [...userSequence, index];
    setUserSequence(newUserSequence);

    // Light up the button briefly
    setActiveButton(index);
    setTimeout(() => setActiveButton(null), 300);

    // Check if the user's sequence is correct so far
    if (newUserSequence[newUserSequence.length - 1] !== sequence[newUserSequence.length - 1]) {
      // Incorrect sequence
      setStatus("Wrong! Try again.");
      setTimeout(() => {
        setUserSequence([]);
        showSequence(sequence);
      }, 1000);
      return;
    }

    // If the user has completed the sequence correctly
    if (newUserSequence.length === sequence.length) {
      // Check if player has won the game
      if (round >= roundsToWin) {
        setStatus("You've won!");
        setGameWon(true);
      } else {
        // Move to the next round
        setRound(round + 1);
        setStatus(`Round ${round + 1} - Watch carefully...`);
        setTimeout(() => {
          startNewRound();
        }, 1000);
      }
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
    setGameWon(false);
    setSequence([]);
    setUserSequence([]);
    onGameRestart();
  };

  // Render start screen
  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <h3 className="text-xl font-bold text-game-neon-cyan mb-6">Pattern Memory Challenge</h3>
        <p className="text-gray-300 mb-6 text-center">
          Watch and repeat the pattern. Complete {roundsToWin} rounds to win!
        </p>
        <div className="bg-gray-800 p-4 rounded-md text-sm text-gray-300 mb-6 max-w-md">
          <h4 className="text-white font-semibold mb-2">How to Play:</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Watch the sequence of glowing buttons carefully.</li>
            <li>Repeat the exact pattern by clicking the buttons in the same order.</li>
            <li>If you make a mistake, the sequence will be shown again for you to retry.</li>
            <li>You must correctly repeat the pattern for <strong>5 rounds</strong> to win.</li>
            <li>Each round adds one more step to the pattern — good luck!</li>
          </ul>
        </div>
        <Button
          onClick={startGame}
          className="bg-game-neon-purple hover:bg-game-neon-purple/80 text-white"
        >
          <Play className="mr-2" size={16} />
          Start Game
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="flex justify-between w-full mb-6">
        <div className="text-gray-300">Round: {round}/{roundsToWin}</div>
        <div className="text-gray-300">Pattern Length: {sequence.length}</div>
      </div>

      <div className="mb-4 text-xl text-center text-gray-300">{status}</div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {[0, 1, 2, 3].map((index) => (
          <button
            key={index}
            disabled={isShowingSequence}
            onClick={() => handleButtonClick(index)}
            className={`w-24 h-24 rounded-md transition-all duration-100 border-2 ${activeButton === index
                ? `${colors[index]} border-white`
                : `${colors[index].replace("600", "900")} hover:${colors[index].replace("600", "800")} border-transparent`
              }`}
          />
        ))}
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

export default PatternMemory;
