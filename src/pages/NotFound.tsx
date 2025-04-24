
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-game-dark p-4">
      <div className="text-center max-w-md">
        <h1 className="text-7xl font-bold mb-4 text-game-neon-purple neon-text">404</h1>
        <h2 className="text-2xl font-bold mb-6 text-game-neon-cyan">Code Not Found</h2>
        <p className="text-xl text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved to another dimension.
        </p>
        <Button 
          className="bg-game-neon-cyan text-black hover:bg-game-neon-cyan/80 px-8 py-6"
          onClick={() => navigate("/")}
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
