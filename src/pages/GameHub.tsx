
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "@/contexts/GameContext";
import { Button } from "@/components/ui/button";
import GameCard from "@/components/GameCard";
import TeamCodeDisplay from "@/components/TeamCodeDisplay";

const GameHub = () => {
  const { selectedTeam, games, hasWon, resetProgress } = useGame();
  const navigate = useNavigate();
  
  // Check if team is selected
  useEffect(() => {
    if (!selectedTeam) {
      navigate("/team-selection");
    } else if (hasWon()) {
      navigate("/victory");
    }
  }, [selectedTeam, navigate, hasWon]);

  const handlePlayGame = (gameId: number) => {
    // Navigate to the specific game page
    navigate(`/games/${gameId}`);
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
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default GameHub;
