
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "@/contexts/GameContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TeamSelection = () => {
  const { teams, selectTeam, selectedTeam } = useGame();
  const navigate = useNavigate();
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  useEffect(() => {
    // If a team is already selected, redirect to games
    if (selectedTeam) {
      navigate("/games");
    }
  }, [selectedTeam, navigate]);

  const handleTeamSelect = (teamId: string) => {
    setSelectedTeamId(teamId);
  };

  const handleContinue = () => {
    if (selectedTeamId) {
      selectTeam(selectedTeamId);
      navigate("/games");
    }
  };

  const getTeamColor = (teamId: string) => {
    switch (teamId) {
      case "1": return "from-blue-500 to-blue-800 border-blue-400";
      case "2": return "from-red-500 to-red-800 border-red-400";
      case "3": return "from-green-500 to-green-800 border-green-400";
      case "4": return "from-yellow-500 to-yellow-800 border-yellow-400";
      default: return "from-gray-500 to-gray-800 border-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-game-dark flex flex-col">
      <header className="bg-game-dark-surface border-b border-gray-800 p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-white">Choose Your Team</h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4 text-game-neon-purple neon-text">
              Select Your Team
            </h2>
            <p className="text-gray-400">
              Choose a team to join for the 6-Digit Challenge. Each team has a unique code to discover.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {teams.map((team) => (
              <div 
                key={team.id} 
                onClick={() => handleTeamSelect(team.id)}
                className={`cursor-pointer transform transition-all duration-300 ${
                  selectedTeamId === team.id ? "scale-105" : "hover:scale-105"
                }`}
              >
                <Card 
                  className={`border-2 bg-gradient-to-br ${getTeamColor(team.id)} overflow-hidden ${
                    selectedTeamId === team.id 
                      ? "ring-4 ring-white/30" 
                      : ""
                  }`}
                >
                  <CardHeader className="bg-black/30">
                    <CardTitle className="text-2xl font-bold text-white">
                      {team.name}
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      Join this team to discover their secret code
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 flex justify-center items-center">
                    <div className="text-8xl font-bold text-white">
                      {team.name.split(" ")[1]}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            <Button 
              variant="outline" 
              className="border-gray-700 text-white hover:bg-gray-800"
              onClick={() => navigate("/")}
            >
              Back to Home
            </Button>
            
            <Button
              className="bg-game-neon-cyan text-black hover:bg-game-neon-cyan/80"
              disabled={!selectedTeamId}
              onClick={handleContinue}
            >
              Continue to Games
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeamSelection;
