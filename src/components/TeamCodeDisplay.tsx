
import React from "react";
import { useGame } from "@/contexts/GameContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const TeamCodeDisplay: React.FC = () => {
  const { selectedTeam, getCollectedDigits, completedGames, games } = useGame();
  
  const collectedDigits = getCollectedDigits();
  const remainingGames = games.length - completedGames;
  const progress = (completedGames / games.length) * 100;

  if (!selectedTeam) {
    return null;
  }

  return (
    <Card className="w-full border border-gray-800 bg-game-dark-card overflow-hidden">
      <CardHeader className="bg-game-dark-surface p-4 pb-2">
        <CardTitle className="text-xl text-game-neon-purple">Team Code Progress</CardTitle>
        <CardDescription className="text-gray-400">
          {selectedTeam.name} | {completedGames} of {games.length} Games Completed
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="w-full bg-gray-800 rounded-full h-2.5 mb-6">
          <div 
            className="bg-game-neon-purple h-2.5 rounded-full animate-pulse-glow" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="grid grid-cols-6 gap-2 mb-4">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <div 
              key={index} 
              className={`aspect-square flex items-center justify-center rounded-md text-2xl font-bold border-2 ${
                collectedDigits[index] !== null
                ? "border-game-neon-cyan bg-secondary/20 text-game-neon-cyan neon-text"
                : "border-gray-700 bg-gray-900/30 text-gray-700"
              }`}
            >
              {collectedDigits[index] !== null ? collectedDigits[index] : "?"}
            </div>
          ))}
        </div>

        <p className="text-center text-gray-400 mt-2">
          {remainingGames > 0
            ? `Complete ${remainingGames} more game${remainingGames > 1 ? "s" : ""} to reveal your team code!`
            : "Team code complete! Head to the victory page!"}
        </p>
      </CardContent>
    </Card>
  );
};

export default TeamCodeDisplay;
