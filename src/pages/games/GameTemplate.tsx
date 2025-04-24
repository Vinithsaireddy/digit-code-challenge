import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGame } from "@/contexts/GameContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Trophy } from "lucide-react";

// Import game components
import MemoryMatch from "@/components/games/MemoryMatch";
import QuickMath from "@/components/games/QuickMath";
import WordScramble from "@/components/games/WordScramble";
import PatternMemory from "@/components/games/PatternMemory";
import ReactionTest from "@/components/games/ReactionTest";
import CodeBreaker from "@/components/games/CodeBreaker";

const GameTemplate = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { games, completeGame, selectedTeam } = useGame();
  const [showDigitDialog, setShowDigitDialog] = useState<boolean>(false);
  const [discoveredDigit, setDiscoveredDigit] = useState<number | null>(null);
  
  const gameId = parseInt(id || "1");
  const game = games.find(g => g.id === gameId);
  
  if (!game) {
    return <div className="text-center p-8 text-white">Game not found</div>;
  }

  const handleGameWin = () => {
    // Get the corresponding digit from team code based on game number
    if (selectedTeam) {
      const digit = parseInt(selectedTeam.code[gameId - 1]); // -1 because game IDs start at 1
      setDiscoveredDigit(digit);
      setShowDigitDialog(true);
    }
  };
  
  const handleGameRestart = () => {
    // Just restart the game without showing the digit dialog
  };

  const handleConfirmDigit = () => {
    if (discoveredDigit !== null) {
      completeGame(gameId, discoveredDigit);
      setShowDigitDialog(false);
      navigate("/games");
    }
  };
  
  // Render the appropriate game component based on gameId
  const renderGame = () => {
    switch (gameId) {
      case 1:
        return <MemoryMatch onGameWin={handleGameWin} onGameRestart={handleGameRestart} />;
      case 2:
        return <QuickMath onGameWin={handleGameWin} onGameRestart={handleGameRestart} />;
      case 3:
        return <WordScramble onGameWin={handleGameWin} onGameRestart={handleGameRestart} />;
      case 4:
        return <PatternMemory onGameWin={handleGameWin} onGameRestart={handleGameRestart} />;
      case 5:
        return <ReactionTest onGameWin={handleGameWin} onGameRestart={handleGameRestart} />;
      case 6:
        return <CodeBreaker onGameWin={handleGameWin} onGameRestart={handleGameRestart} />;
      default:
        return <div className="text-center p-8 text-white">Game not found</div>;
    }
  };
  
  return (
    <div className="min-h-screen bg-game-dark flex flex-col">
      <header className="bg-game-dark-surface border-b border-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-white">
            <span className="text-game-neon-cyan">{game.title}</span>
          </h1>
          <Button 
            variant="outline" 
            onClick={() => navigate("/games")}
            className="border-gray-600 text-gray-400 hover:bg-gray-800"
          >
            Back to Games
          </Button>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">{game.title}</h2>
              <p className="text-gray-400">{game.description}</p>
            </div>
          </div>
          
          <div className="bg-game-dark-surface border border-gray-700 rounded-lg p-4">
            {renderGame()}
          </div>
        </div>
      </main>
      
      {/* Game Win Dialog */}
      <Dialog open={showDigitDialog} onOpenChange={setShowDigitDialog}>
        <DialogContent className="bg-game-dark-surface border border-game-neon-cyan">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-game-neon-cyan">
              Game Complete!
            </DialogTitle>
            <DialogDescription className="text-lg text-gray-300">
              You've discovered a digit from your team code.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-8 flex flex-col items-center">
            <div className="text-7xl font-bold text-game-neon-cyan neon-text mb-4 animate-pulse-glow">
              {discoveredDigit}
            </div>
            <div className="flex justify-center mb-4 text-yellow-500">
              <Trophy className="h-8 w-8" />
            </div>
            <p className="text-gray-400 text-center">
              This digit is part of your team's secret code.
            </p>
          </div>
          
          <DialogFooter>
            <Button 
              className="bg-game-neon-cyan text-black hover:bg-game-neon-cyan/80 w-full"
              onClick={handleConfirmDigit}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GameTemplate;
