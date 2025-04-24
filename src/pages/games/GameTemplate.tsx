
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGame } from "@/contexts/GameContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Timer, Trophy } from "lucide-react";

const GameTemplate = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { games, completeGame } = useGame();
  const [showDigitDialog, setShowDigitDialog] = useState<boolean>(false);
  const [discoveredDigit, setDiscoveredDigit] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  
  const gameId = parseInt(id || "1");
  const game = games.find(g => g.id === gameId);
  
  if (!game) {
    return <div className="text-center p-8 text-white">Game not found</div>;
  }

  const handleStartGame = () => {
    setIsPlaying(true);
  };
  
  const handleEndGame = () => {
    // Simulate winning the game with a random digit
    const randomDigit = Math.floor(Math.random() * 10);
    setDiscoveredDigit(randomDigit);
    setShowDigitDialog(true);
    setIsPlaying(false);
  };

  const handleConfirmDigit = () => {
    if (discoveredDigit !== null) {
      completeGame(gameId, discoveredDigit);
      setShowDigitDialog(false);
      navigate("/games");
    }
  };
  
  // This would be replaced with the actual game content
  const renderGameContent = () => {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] bg-game-dark-surface border border-gray-700 rounded-lg p-4">
        <h3 className="text-xl font-bold text-game-neon-cyan mb-6">{game.title} Game</h3>
        
        {!isPlaying ? (
          <div className="text-center">
            <p className="text-gray-300 mb-8">Ready to play? Click the button to begin!</p>
            <Button 
              onClick={handleStartGame}
              className="bg-game-neon-purple hover:bg-game-neon-purple/80 text-white"
            >
              Start Game
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <div className="flex flex-col items-center justify-center gap-4">
              <p className="text-gray-300">Game in progress...</p>
              <div className="animate-pulse text-5xl text-game-neon-purple mb-4">
                <Timer className="h-16 w-16" />
              </div>
              <p className="text-sm text-gray-400 mb-8">
                This is a placeholder. In a real game, actual game content would appear here.
              </p>
              
              <Button
                onClick={handleEndGame}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Complete Game
              </Button>
            </div>
          </div>
        )}
      </div>
    );
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
          
          {renderGameContent()}
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
