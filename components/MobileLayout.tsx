"use client";

import { useState } from "react";
import { CardsTab } from "./CardsTab";
import { PracticeTab } from "./PracticeTab";
import { SearchTab } from "./SearchTab";
import { Library, BrainCircuit, Sparkles } from "lucide-react";

type Tab = "library" | "practice" | "ai";

export function MobileLayout() {
  const [activeTab, setActiveTab] = useState<Tab>("library");

  return (
    <div className="flex justify-center w-full min-h-screen bg-slate-100 sm:py-8">
      {/* Mobile Frame (Max Width) */}
      <div className="w-full sm:max-w-md bg-slate-50 sm:rounded-[2.5rem] sm:shadow-2xl sm:border-[8px] border-slate-800 overflow-hidden relative flex flex-col h-screen sm:h-[850px]">
        
        {/* Header / Status Bar Area */}
        <div className="pt-12 pb-4 px-6 bg-slate-50 z-10">
          <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">
            AWS<span className="text-indigo-600">Cards</span>
          </h1>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto hide-scrollbar relative">
          {activeTab === "library" && <CardsTab />}
          {activeTab === "practice" && <PracticeTab />}
          {activeTab === "ai" && <SearchTab />}
        </div>

        {/* Bottom Navigation Bar */}
        <div className="absolute bottom-0 w-full bg-white border-t border-slate-100 pb-safe pt-2 px-6 flex justify-between items-center z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
          <NavButton 
            icon={<Library className="w-6 h-6" />} 
            label="Library" 
            isActive={activeTab === "library"} 
            onClick={() => setActiveTab("library")} 
          />
          <NavButton 
            icon={<BrainCircuit className="w-6 h-6" />} 
            label="Practice" 
            isActive={activeTab === "practice"} 
            onClick={() => setActiveTab("practice")} 
          />
          <NavButton 
            icon={<Sparkles className="w-6 h-6" />} 
            label="AI Tutor" 
            isActive={activeTab === "ai"} 
            onClick={() => setActiveTab("ai")} 
          />
        </div>
      </div>
    </div>
  );
}

function NavButton({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-20 h-16 gap-1 transition-colors ${
        isActive ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
      }`}
    >
      <div className={`transition-transform duration-300 ${isActive ? "scale-110" : "scale-100"}`}>
        {icon}
      </div>
      <span className={`text-[10px] font-bold tracking-wide ${isActive ? "opacity-100" : "opacity-0 translate-y-1"} transition-all duration-300`}>
        {label}
      </span>
    </button>
  );
}
