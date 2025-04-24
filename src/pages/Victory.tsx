
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "@/contexts/GameContext";
import { Button } from "@/components/ui/button";

const Victory = () => {
  const { selectedTeam, hasWon, getCollectedDigits, resetProgress } = useGame();
  const navigate = useNavigate();
  
  // Check if team is selected and all games are won
  useEffect(() => {
    if (!selectedTeam) {
      navigate("/team-selection");
    } else if (!hasWon()) {
      navigate("/games");
    }
  }, [selectedTeam, navigate, hasWon]);

  if (!selectedTeam || !hasWon()) {
    return null;
  }

  const collectedDigits = getCollectedDigits().filter(digit => digit !== null);
  const teamCode = selectedTeam.code;
  
  const handlePlayAgain = () => {
    resetProgress();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-game-dark flex flex-col items-center justify-center text-center p-4">
      <div className="max-w-3xl w-full">
        <div className="mb-10 animate-float">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-game-neon-cyan neon-text">
            VICTORY!
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-game-neon-pink neon-text">
            {selectedTeam.name} TRIUMPHS!
          </h2>
        </div>
        
        <div className="bg-game-dark-surface rounded-lg border border-gray-800 p-8 mb-8">
          <div className="mb-6">
            <h3 className="text-xl text-gray-300 mb-3">Your Collected Code:</h3>
            <div className="grid grid-cols-6 gap-2 max-w-md mx-auto mb-6">
              {collectedDigits.map((digit, index) => (
                <div 
                  key={index}
                  className="aspect-square flex items-center justify-center rounded-md text-3xl font-bold bg-game-dark-card border-2 border-game-neon-cyan text-game-neon-cyan neon-text"
                >
                  {digit}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-xl text-gray-300 mb-3">The {selectedTeam.name} Code:</h3>
            <div className="grid grid-cols-6 gap-2 max-w-md mx-auto">
              {teamCode.split("").map((digit, index) => (
                <div 
                  key={index}
                  className="aspect-square flex items-center justify-center rounded-md text-3xl font-bold bg-game-dark-card border-2 border-game-neon-purple text-game-neon-purple neon-text"
                >
                  {digit}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="text-gray-300 mb-8">
          <p className="text-xl mb-4">
            Congratulations! You've completed all 6 games and discovered your team's secret code.
          </p>
          <p>
            Share your achievement with the rest of your team!
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Button
            className="bg-game-neon-cyan text-black hover:bg-game-neon-cyan/80 px-8 py-6"
            onClick={handlePlayAgain}
          >
            Play Again
          </Button>
          <Button 
            variant="outline"
            className="border-game-neon-purple text-game-neon-purple hover:bg-game-neon-purple/20 px-8 py-6"
            onClick={() => navigate("/")}
          >
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Victory;
