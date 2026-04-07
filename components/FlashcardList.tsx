"use client";

import { useState, useEffect } from "react";
import { Flashcard } from "./Flashcard";
import { flashcards, FlashcardData } from "@/lib/data";
import { LayoutGrid, Shuffle } from "lucide-react";

export function FlashcardList() {
  const [filter, setFilter] = useState<string>("All");
  const [mode, setMode] = useState<"grid" | "study">("grid");
  const [studyCard, setStudyCard] = useState<FlashcardData | null>(null);
  const [flipKey, setFlipKey] = useState(0);

  const categories = ["All", ...Array.from(new Set(flashcards.map(c => c.category)))];

  const filteredCards = filter === "All" 
    ? flashcards 
    : flashcards.filter(c => c.category === filter);

  const pickRandomCard = () => {
    if (filteredCards.length === 0) return;
    const randomIndex = Math.floor(Math.random() * filteredCards.length);
    setStudyCard(filteredCards[randomIndex]);
    setFlipKey(prev => prev + 1); // Force remount to unflip
  };

  // When filter or mode changes, pick a new random card if in study mode
  useEffect(() => {
    if (mode === "study") {
      pickRandomCard();
    }
  }, [filter, mode]);

  return (
    <div className="w-full">
      {/* Controls: Mode and Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setMode("grid")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === "grid" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
          >
            <LayoutGrid className="w-4 h-4" />
            Grid View
          </button>
          <button
            onClick={() => setMode("study")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === "study" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
          >
            <Shuffle className="w-4 h-4" />
            Study Mode
          </button>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === cat 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {mode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCards.map(card => (
            <Flashcard key={card.id} card={card} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center max-w-2xl mx-auto">
          {studyCard ? (
            <>
              <div className="w-full mb-8">
                <Flashcard key={`${studyCard.id}-${flipKey}`} card={studyCard} className="h-80 md:h-96" />
              </div>
              <button
                onClick={pickRandomCard}
                className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm hover:shadow"
              >
                <Shuffle className="w-5 h-5" />
                Next Random Card
              </button>
              <p className="text-gray-500 text-sm mt-4">
                Showing random cards from: <span className="font-medium text-gray-700">{filter}</span>
              </p>
            </>
          ) : (
            <p className="text-gray-500">No cards found for this category.</p>
          )}
        </div>
      )}
    </div>
  );
}
