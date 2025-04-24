
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(username, password);
      if (success) {
        navigate("/admin/dashboard");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-game-dark p-4">
      <div className="max-w-md w-full">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-game-neon-purple neon-text">Admin Access</h1>
          <p className="text-gray-400 mt-2">Enter your credentials to access the dashboard</p>
        </div>

        <Card className="border border-gray-800 bg-game-dark-surface">
          <CardHeader>
            <CardTitle className="text-white">Login</CardTitle>
            <CardDescription className="text-gray-400">
              Secure admin login for 6-Digit Challenge
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-game-dark-card border-gray-700 text-white"
                  placeholder="Enter your username"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-game-dark-card border-gray-700 text-white"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                className="border-gray-700 text-white hover:bg-gray-800"
                onClick={() => navigate("/")}
              >
                Back to Home
              </Button>
              <Button 
                type="submit" 
                className="bg-game-neon-purple text-white hover:bg-game-neon-purple/80"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>Default admin credentials for demo:</p>
          <p>Username: admin | Password: password123</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
