import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, RefreshCcw } from "lucide-react";

type Card = {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
};

type MemoryMatchProps = {
  onGameWin: () => void;
  onGameRestart: () => void;
};

const MemoryMatch: React.FC<MemoryMatchProps> = ({ onGameWin, onGameRestart }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);

  const emojis = ["🚀", "🍕", "🌟", "🎮", "🎸", "🏆", "🎨", "🔥"];
  const totalPairs = emojis.length;

  // Initialize game
  const initializeGame = () => {
    const gameCards: Card[] = [];
    // Create pairs of cards
    emojis.forEach((emoji, index) => {
      gameCards.push({
        id: index * 2,
        value: emoji,
        isFlipped: false,
        isMatched: false,
      });
      gameCards.push({
        id: index * 2 + 1,
        value: emoji,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle the cards
    const shuffledCards = [...gameCards].sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setGameWon(false);
    setGameStarted(true);
  };

  // Handle card click
  const handleCardClick = (id: number) => {
    // Don't allow clicking if there are already 2 cards flipped
    if (flippedCards.length === 2) return;

    // Don't allow clicking on already matched or flipped cards
    const clickedCard = cards.find(card => card.id === id);
    if (!clickedCard || clickedCard.isMatched || flippedCards.includes(id)) return;

    // Flip the card
    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);

    // If this is the second card, check for a match
    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find(card => card.id === firstId);
      const secondCard = cards.find(card => card.id === secondId);

      if (firstCard && secondCard && firstCard.value === secondCard.value) {
        // Match found!
        const updatedCards = cards.map(card => {
          if (card.id === firstId || card.id === secondId) {
            return { ...card, isMatched: true };
          }
          return card;
        });
        setCards(updatedCards);
        setMatchedPairs(matchedPairs + 1);
        setFlippedCards([]);

        // Check if all pairs are matched
        if (matchedPairs + 1 === totalPairs) {
          setGameWon(true);
        }
      } else {
        // No match, flip cards back after delay
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // Effect to check if player has won
  useEffect(() => {
    if (gameWon) {
      onGameWin();
    }
  }, [gameWon, onGameWin]);

  const restartGame = () => {
    setGameStarted(false);
    onGameRestart();
  };

  // Render game start or the game itself
  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <h3 className="text-xl font-bold text-game-neon-cyan mb-6">Memory Match Game</h3>
        <p className="text-gray-300 mb-6 text-center">
          Match all pairs of cards to win! Find all {totalPairs} pairs to earn a digit.
        </p>
        <div className="bg-game-dark-card p-4 rounded-lg border border-gray-700 text-left max-w-md w-full mb-6">
          <h4 className="text-lg font-semibold text-game-neon-purple mb-2">📜 Rules</h4>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
          <li>Click on a card to flip it and reveal its emoji.</li>
            <li>Click on another card to try to find a matching pair.</li>
            <li>If the two cards match, they will stay flipped and you earn a pair.</li>
            <li>If they do not match, they will flip back after a short delay.</li>
            <li>Continue matching pairs until all pairs are found.</li>
            <li>The game ends when all pairs are matched.</li>
          </ul>
        </div>

        <Button
          onClick={initializeGame}
          className="bg-game-neon-purple hover:bg-game-neon-purple/80 text-white"
        >
          Start Game
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4">
      <div className="flex justify-between w-full mb-4">
        <div className="text-gray-300">Moves: {moves}</div>
        <div className="text-gray-300">Pairs: {matchedPairs}/{totalPairs}</div>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-6">
        {cards.map(card => (
          <div
            key={card.id}
            className={`w-16 h-16 flex items-center justify-center rounded-md cursor-pointer transition-all duration-300 transform ${card.isMatched
              ? "bg-green-600 text-white"
              : flippedCards.includes(card.id)
                ? "bg-game-dark-card border-2 border-game-neon-cyan"
                : "bg-game-dark-surface border border-gray-700"
              }`}
            onClick={() => handleCardClick(card.id)}
          >
            {(card.isMatched || flippedCards.includes(card.id)) ? (
              <span className="text-2xl">{card.value}</span>
            ) : null}
          </div>
        ))}
      </div>

      <Button
        onClick={restartGame}
        variant="outline"
        className="border-gray-600 text-gray-400 hover:bg-gray-800"
      >
        <RefreshCcw className="mr-2" size={16} />
        Restart
      </Button>
    </div>
  );
};

export default MemoryMatch;
