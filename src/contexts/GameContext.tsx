
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

// Team type
export type Team = {
  id: string;
  name: string;
  code: string;
};

// Game type
export type Game = {
  id: number;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  completed: boolean;
  digit: number | null;
};

// GameContextType
type GameContextType = {
  teams: Team[];
  selectedTeam: Team | null;
  games: Game[];
  completedGames: number;
  addTeam: (team: Omit<Team, "id">) => void;
  updateTeam: (id: string, team: Partial<Team>) => void;
  deleteTeam: (id: string) => void;
  selectTeam: (id: string) => void;
  completeGame: (gameId: number, digit: number) => void;
  resetProgress: () => void;
  resetGames: () => void;
  isGameCompleted: (gameId: number) => boolean;
  getCollectedDigits: () => (number | null)[];
  hasWon: () => boolean;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

// Initial games data
const initialGames: Game[] = [
  {
    id: 1,
    title: "Memory Match",
    description: "Match all pairs of cards to win",
    difficulty: "easy",
    completed: false,
    digit: null,
  },
  {
    id: 2,
    title: "Quick Math",
    description: "Solve math problems within the time limit",
    difficulty: "medium",
    completed: false,
    digit: null,
  },
  {
    id: 3,
    title: "Word Scramble",
    description: "Unscramble words before time runs out",
    difficulty: "medium",
    completed: false,
    digit: null,
  },
  {
    id: 4,
    title: "Pattern Memory",
    description: "Remember and repeat the pattern sequence",
    difficulty: "hard",
    completed: false,
    digit: null,
  },
  {
    id: 5,
    title: "Reaction Test",
    description: "Click as fast as you can when the color changes",
    difficulty: "easy",
    completed: false,
    digit: null,
  },
  {
    id: 6,
    title: "Code Breaker",
    description: "Guess the correct sequence of colors",
    difficulty: "hard",
    completed: false,
    digit: null,
  },
];

// Initial teams data
const initialTeams: Team[] = [
  { id: "1", name: "Team A", code: "123456" },
  { id: "2", name: "Team B", code: "789012" },
  { id: "3", name: "Team C", code: "345678" },
  { id: "4", name: "Team D", code: "901234" },
];

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [games, setGames] = useState<Game[]>(initialGames);
  const [completedGames, setCompletedGames] = useState<number>(0);
  const { toast } = useToast();

  // Load saved state from localStorage on component mount
  useEffect(() => {
    const savedTeams = localStorage.getItem("teams");
    const savedSelectedTeam = localStorage.getItem("selectedTeam");
    const savedGames = localStorage.getItem("games");
    const savedCompletedGames = localStorage.getItem("completedGames");

    if (savedTeams) setTeams(JSON.parse(savedTeams));
    if (savedSelectedTeam) setSelectedTeam(JSON.parse(savedSelectedTeam));
    if (savedGames) setGames(JSON.parse(savedGames));
    if (savedCompletedGames) setCompletedGames(Number(savedCompletedGames));
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("teams", JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem("selectedTeam", JSON.stringify(selectedTeam));
  }, [selectedTeam]);

  useEffect(() => {
    localStorage.setItem("games", JSON.stringify(games));
  }, [games]);

  useEffect(() => {
    localStorage.setItem("completedGames", String(completedGames));
  }, [completedGames]);

  const addTeam = (team: Omit<Team, "id">) => {
    const newTeam = {
      id: Date.now().toString(),
      ...team,
    };
    setTeams([...teams, newTeam]);
    toast({
      title: "Team Added",
      description: `${team.name} has been added successfully.`,
    });
  };

  const updateTeam = (id: string, updatedTeam: Partial<Team>) => {
    setTeams(teams.map((team) => (team.id === id ? { ...team, ...updatedTeam } : team)));
    toast({
      title: "Team Updated",
      description: `Team has been updated successfully.`,
    });
  };

  const deleteTeam = (id: string) => {
    setTeams(teams.filter((team) => team.id !== id));
    toast({
      title: "Team Deleted",
      description: "The team has been removed successfully.",
    });
  };

  const selectTeam = (id: string) => {
    const team = teams.find((t) => t.id === id);
    if (team) {
      setSelectedTeam(team);
      toast({
        title: "Team Selected",
        description: `You've joined ${team.name}.`,
      });
    }
  };

  const completeGame = (gameId: number, digit: number) => {
    setGames(
      games.map((game) =>
        game.id === gameId ? { ...game, completed: true, digit } : game
      )
    );
    setCompletedGames(completedGames + 1);
    toast({
      title: "Game Completed!",
      description: `You've discovered digit: ${digit}`,
    });
  };

  const resetProgress = () => {
    setGames(initialGames);
    setCompletedGames(0);
    setSelectedTeam(null);
    toast({
      title: "Progress Reset",
      description: "Your game progress has been reset.",
    });
  };

  const resetGames = () => {
    setGames(
      games.map((game) => ({
        ...game,
        completed: false,
        digit: null,
      }))
    );
    setCompletedGames(0);
    toast({
      title: "Games Reset",
      description: "All games have been reset.",
    });
  };

  const isGameCompleted = (gameId: number) => {
    const game = games.find((g) => g.id === gameId);
    return game ? game.completed : false;
  };

  const getCollectedDigits = () => {
    return games.map((game) => game.digit);
  };

  const hasWon = () => {
    return completedGames === games.length;
  };

  return (
    <GameContext.Provider
      value={{
        teams,
        selectedTeam,
        games,
        completedGames,
        addTeam,
        updateTeam,
        deleteTeam,
        selectTeam,
        completeGame,
        resetProgress,
        resetGames,
        isGameCompleted,
        getCollectedDigits,
        hasWon,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
