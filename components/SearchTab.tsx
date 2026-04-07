"use client";

import { useState } from "react";
import { GoogleGenAI } from "@google/genai";
import { Search, Loader2, Sparkles, Send } from "lucide-react";
import Markdown from "react-markdown";

export function SearchTab() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError("");
    setResponse("");

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("API key not configured.");
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Explain what this AWS service is and what it is used for: ${query}. Be concise, educational, and easy to understand.`,
        config: {
          tools: [{ googleSearch: {} }],
          systemInstruction: "You are an expert AWS instructor explaining concepts to students clearly and simply. Use analogies if helpful. Answer in English.",
        }
      });

      if (result.text) {
        setResponse(result.text);
      } else {
        throw new Error("No response received.");
      }
    } catch (err) {
      console.error(err);
      setError("There was an error searching for information. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col px-4 pt-6 pb-24">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-indigo-600" />
          AI Tutor
        </h2>
        <p className="text-slate-500 text-sm mt-1">Ask anything about AWS services.</p>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 hide-scrollbar">
        {response ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="prose prose-slate prose-indigo max-w-none prose-p:leading-relaxed prose-headings:font-bold prose-a:text-indigo-600">
              <Markdown>{response}</Markdown>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-medium">
            {error}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 px-8">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-slate-300" />
            </div>
            <p className="font-medium">Type an AWS service or concept below to get a simple explanation.</p>
          </div>
        )}
      </div>

      {/* Search Input fixed at bottom (above nav) */}
      <div className="mt-auto">
        <form onSubmit={handleSearch} className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., What is AWS Lambda?"
            className="w-full pl-6 pr-14 py-4 rounded-3xl border-2 border-slate-200 focus:border-indigo-600 focus:ring-0 outline-none transition-all text-slate-800 font-medium placeholder:text-slate-400 shadow-sm"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-2 w-10 h-10 flex items-center justify-center bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:bg-slate-300 transition-colors"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-4 h-4 ml-0.5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
