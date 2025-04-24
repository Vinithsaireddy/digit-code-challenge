
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "@/contexts/GameContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import GameCard from "@/components/GameCard";
import TeamCodeDisplay from "@/components/TeamCodeDisplay";

const GameHub = () => {
  const { selectedTeam, games, completeGame, hasWon, resetProgress } = useGame();
  const navigate = useNavigate();
  const [currentGameId, setCurrentGameId] = useState<number | null>(null);
  const [showDigitDialog, setShowDigitDialog] = useState<boolean>(false);
  const [discoveredDigit, setDiscoveredDigit] = useState<number | null>(null);
  
  // Check if team is selected
  useEffect(() => {
    if (!selectedTeam) {
      navigate("/team-selection");
    } else if (hasWon()) {
      navigate("/victory");
    }
  }, [selectedTeam, navigate, hasWon]);

  const handlePlayGame = (gameId: number) => {
    setCurrentGameId(gameId);
    // Simulate winning a game
    const randomDigit = Math.floor(Math.random() * 10);
    setDiscoveredDigit(randomDigit);
    setShowDigitDialog(true);
  };

  const handleConfirmDigit = () => {
    if (currentGameId !== null && discoveredDigit !== null) {
      completeGame(currentGameId, discoveredDigit);
      setShowDigitDialog(false);
      setCurrentGameId(null);
      
      // Check if all games are completed after this one
      if (hasWon()) {
        setTimeout(() => navigate("/victory"), 1000);
      }
    }
  };

  if (!selectedTeam) {
    return null;
  }

  return (
    <div className="min-h-screen bg-game-dark flex flex-col">
      <header className="bg-game-dark-surface border-b border-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">
            <span className="text-game-neon-purple">{selectedTeam.name}</span> - 6-Digit Challenge
          </h1>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              className="border-red-600 text-red-600 hover:bg-red-600/20"
              onClick={() => {
                if (window.confirm("Are you sure you want to reset your progress?")) {
                  resetProgress();
                  navigate("/");
                }
              }}
            >
              Reset Progress
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="mb-8">
          <TeamCodeDisplay />
        </div>

        <h2 className="text-2xl font-bold mb-6 text-white">Available Games</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {games.map((game) => (
            <GameCard 
              key={game.id}
              game={game}
              onPlay={() => handlePlayGame(game.id)}
              disabled={game.completed}
            />
          ))}
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
            <p className="text-gray-400 text-center">
              This digit is part of the {selectedTeam.name} secret code.
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

export default GameHub;
