
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminTeamManager from "@/components/AdminTeamManager";
import { useGame } from "@/contexts/GameContext";

const AdminDashboard = () => {
  const { isAdmin, logout } = useAuth();
  const { resetGames } = useGame();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAdmin()) {
      navigate("/admin/login");
    }
  }, [isAdmin, navigate]);

  if (!isAdmin()) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-game-dark">
      <header className="bg-game-dark-surface border-b border-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-game-neon-cyan">
            Admin Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              className="border-gray-700 text-white hover:bg-gray-800"
              onClick={() => navigate("/")}
            >
              View Site
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <Tabs defaultValue="teams" className="w-full">
          <TabsList className="bg-game-dark-card w-full justify-start mb-8 border border-gray-800">
            <TabsTrigger value="teams" className="data-[state=active]:bg-game-neon-cyan data-[state=active]:text-black">
              Teams
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-game-neon-cyan data-[state=active]:text-black">
              Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="teams">
            <AdminTeamManager />
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="space-y-6">
              <div className="bg-game-dark-surface border border-gray-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Game Settings</h2>
                <div className="space-y-6">
                  <div className="bg-game-dark-card p-4 rounded-lg border border-gray-700">
                    <h3 className="text-lg text-white mb-2">Reset All Games</h3>
                    <p className="text-gray-400 mb-4">
                      This will reset all game progress for all users. Use with caution.
                    </p>
                    <Button 
                      variant="destructive"
                      onClick={() => {
                        if (window.confirm("Are you sure you want to reset all game progress? This cannot be undone.")) {
                          resetGames();
                        }
                      }}
                    >
                      Reset All Game Progress
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
