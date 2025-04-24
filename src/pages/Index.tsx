
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-game-dark flex flex-col items-center justify-center text-center px-4">
      <div className="mb-8 animate-float">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-game-neon-cyan neon-text">
          6-DIGIT
        </h1>
        <h2 className="text-3xl md:text-5xl font-bold text-game-neon-pink neon-text">
          CHALLENGE
        </h2>
      </div>
      
      <div className="max-w-2xl mb-10 text-gray-300">
        <p className="text-lg mb-6">
          Complete 6 challenging games to discover your team's secret code.
          Work together, solve puzzles, and emerge victorious!
        </p>
        
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
          <div className="bg-game-dark-card p-4 rounded-lg border border-gray-800">
            <h3 className="font-bold text-lg text-game-neon-cyan mb-2">6 Games</h3>
            <p className="text-gray-400">Each game unlocks one digit of your team code</p>
          </div>
          <div className="bg-game-dark-card p-4 rounded-lg border border-gray-800">
            <h3 className="font-bold text-lg text-game-neon-purple mb-2">4 Teams</h3>
            <p className="text-gray-400">Join team A, B, C, or D and compete</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Button 
          className="text-black bg-game-neon-cyan hover:bg-game-neon-cyan/80 neon-border text-lg px-8 py-6"
          onClick={() => navigate("/team-selection")}
        >
          Start Challenge
        </Button>
        <Button 
          variant="outline" 
          className="border-game-neon-purple text-game-neon-purple hover:bg-game-neon-purple/20 text-lg px-8 py-6"
          onClick={() => navigate("/admin/login")}
        >
          Admin Access
        </Button>
      </div>
      
      <div className="mt-16 text-sm text-gray-500">
        <p>Complete all games to reveal your team's secret code</p>
      </div>
    </div>
  );
};

export default Index;
