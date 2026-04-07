"use client";

import { useState, useEffect } from "react";
import { Flashcard } from "./Flashcard";
import { flashcards, FlashcardData } from "@/lib/data";
import { Check, X, RotateCcw, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function PracticeTab() {
  const [deck, setDeck] = useState<FlashcardData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [score, setScore] = useState({ known: 0, learning: 0 });
  const [isFinished, setIsFinished] = useState(false);

  // Initialize deck
  useEffect(() => {
    startNewSession();
  }, []);

  const startNewSession = () => {
    // Shuffle the deck
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setScore({ known: 0, learning: 0 });
    setIsFinished(false);
  };

  const handleNext = (knewIt: boolean) => {
    if (knewIt) {
      setScore(s => ({ ...s, known: s.known + 1 }));
    } else {
      setScore(s => ({ ...s, learning: s.learning + 1 }));
    }

    if (currentIndex < deck.length - 1) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 150); // Small delay to allow flip animation to start
    } else {
      setIsFinished(true);
    }
  };

  if (deck.length === 0) return null;

  if (isFinished) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
          <Trophy className="w-12 h-12 text-indigo-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Session Complete!</h2>
        <p className="text-slate-500 mb-8">You reviewed {deck.length} cards.</p>
        
        <div className="flex gap-8 mb-12">
          <div className="flex flex-col items-center">
            <span className="text-4xl font-bold text-emerald-500">{score.known}</span>
            <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Mastered</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl font-bold text-amber-500">{score.learning}</span>
            <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Learning</span>
          </div>
        </div>

        <button 
          onClick={startNewSession}
          className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-colors shadow-lg"
        >
          <RotateCcw className="w-5 h-5" />
          Practice Again
        </button>
      </div>
    );
  }

  const currentCard = deck[currentIndex];
  const progress = ((currentIndex) / deck.length) * 100;

  return (
    <div className="w-full h-full flex flex-col px-4 pt-6 pb-24">
      <div className="mb-6">
        <div className="flex justify-between items-end mb-2">
          <h2 className="text-2xl font-bold text-slate-800">Practice</h2>
          <span className="text-sm font-bold text-slate-400">{currentIndex + 1} / {deck.length}</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
          <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-sm"
          >
            <Flashcard 
              card={currentCard} 
              className="h-[420px]" 
              isFlipped={isFlipped}
              onFlip={() => setIsFlipped(!isFlipped)}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="h-24 mt-8 flex justify-center items-center gap-4">
        {isFlipped ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4 w-full max-w-sm"
          >
            <button 
              onClick={() => handleNext(false)}
              className="flex-1 flex flex-col items-center justify-center gap-1 bg-white border-2 border-amber-100 text-amber-600 py-4 rounded-2xl font-bold hover:bg-amber-50 transition-colors shadow-sm"
            >
              <X className="w-6 h-6" />
              Learning
            </button>
            <button 
              onClick={() => handleNext(true)}
              className="flex-1 flex flex-col items-center justify-center gap-1 bg-emerald-500 text-white py-4 rounded-2xl font-bold hover:bg-emerald-600 transition-colors shadow-md shadow-emerald-200"
            >
              <Check className="w-6 h-6" />
              Got It
            </button>
          </motion.div>
        ) : (
          <p className="text-slate-400 font-medium animate-pulse">Tap the card to reveal the answer</p>
        )}
      </div>
    </div>
  );
}
