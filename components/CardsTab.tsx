"use client";

import { useState } from "react";
import { Flashcard } from "./Flashcard";
import { flashcards } from "@/lib/data";

export function CardsTab() {
  const [filter, setFilter] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(flashcards.map(c => c.category)))];

  const filteredCards = filter === "All" 
    ? flashcards 
    : flashcards.filter(c => c.category === filter);

  return (
    <div className="w-full pb-24 px-4 pt-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Library</h2>
        <p className="text-slate-500 text-sm">Explore all {flashcards.length} AWS services.</p>
      </div>

      <div className="flex overflow-x-auto pb-4 mb-4 -mx-4 px-4 hide-scrollbar gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`whitespace-nowrap px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
              filter === cat 
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" 
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-6">
        {filteredCards.map(card => (
          <Flashcard key={card.id} card={card} className="h-96" />
        ))}
      </div>
    </div>
  );
}
