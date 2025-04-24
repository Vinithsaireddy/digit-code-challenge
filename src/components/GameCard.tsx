
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Game } from "@/contexts/GameContext";

type GameCardProps = {
  game: Game;
  onPlay: () => void;
  disabled?: boolean;
};

const GameCard: React.FC<GameCardProps> = ({ game, onPlay, disabled = false }) => {
  const { title, description, difficulty, completed, digit } = game;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-600 hover:bg-green-700";
      case "medium":
        return "bg-yellow-600 hover:bg-yellow-700";
      case "hard":
        return "bg-red-600 hover:bg-red-700";
      default:
        return "bg-blue-600 hover:bg-blue-700";
    }
  };

  return (
    <Card className="border border-gray-800 bg-game-dark-surface overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className={`text-xl ${completed ? "text-game-neon-cyan neon-text" : "text-white"}`}>
            {title}
          </CardTitle>
          <Badge 
            className={`${getDifficultyColor(difficulty)} text-xs uppercase tracking-wider`}
          >
            {difficulty}
          </Badge>
        </div>
        <CardDescription className="text-gray-400 mt-1">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        {completed && digit !== null && (
          <div className="mt-2 mb-2">
            <p className="text-sm text-gray-400">Digit Earned:</p>
            <p className="text-3xl font-bold text-game-neon-cyan neon-text">{digit}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-end">
        <Button
          variant={completed ? "outline" : "default"}
          className={completed ? "border border-game-neon-cyan text-game-neon-cyan" : "bg-primary"}
          onClick={onPlay}
          disabled={disabled}
        >
          {completed ? "Completed" : "Play Game"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GameCard;
