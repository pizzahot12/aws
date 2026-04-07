"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { FlashcardData } from "@/lib/data";
import { Lightbulb } from "lucide-react";

interface FlashcardProps {
  card: FlashcardData;
  className?: string;
  isFlipped?: boolean;
  onFlip?: () => void;
}

export function Flashcard({ card, className = "h-80", isFlipped: controlledIsFlipped, onFlip }: FlashcardProps) {
  const [internalIsFlipped, setInternalIsFlipped] = useState(false);

  const isFlipped = controlledIsFlipped !== undefined ? controlledIsFlipped : internalIsFlipped;

  const handleFlip = () => {
    if (onFlip) {
      onFlip();
    } else {
      setInternalIsFlipped(!internalIsFlipped);
    }
  };

  return (
    <div 
      className={`relative w-full cursor-pointer perspective-1000 ${className}`}
      onClick={handleFlip}
    >
      <motion.div
        className="w-full h-full relative preserve-3d duration-500"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* Front */}
        <div className="absolute w-full h-full backface-hidden bg-white border-2 border-slate-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all p-6 flex flex-col items-center justify-center text-center gap-6">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-6xl shadow-inner">
            {card.icon}
          </div>
          <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{card.name}</h3>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 absolute top-4 right-4 uppercase tracking-wider">
            {card.category}
          </span>
          <p className="text-slate-400 text-sm absolute bottom-6 font-medium">Tap to flip</p>
        </div>

        {/* Back */}
        <div 
          className="absolute w-full h-full backface-hidden bg-slate-900 text-white rounded-3xl shadow-xl p-6 flex flex-col items-center justify-center text-center overflow-y-auto"
          style={{ transform: "rotateY(180deg)" }}
        >
          <h3 className="text-xl font-bold mb-4 text-indigo-300">{card.name}</h3>
          <p className="text-base leading-relaxed text-slate-200 mb-6">{card.description}</p>
          
          <div className="w-full bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 text-left">
            <div className="flex items-center gap-2 mb-2 text-amber-400 font-semibold text-sm">
              <Lightbulb className="w-4 h-4" />
              Real-life Use Case
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {card.useCase}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
