"use client";

import { useState } from "react";
import { GoogleGenAI } from "@google/genai";
import { Search, Loader2, Sparkles } from "lucide-react";
import Markdown from "react-markdown";

export function AISearch() {
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
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gray-50/50">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-blue-600" />
          AI Search
        </h2>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., What is AWS Lambda?"
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            disabled={isLoading}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Searching...
              </>
            ) : (
              "Search"
            )}
          </button>
        </form>
      </div>

      {response && (
        <div className="p-6 bg-blue-50/30">
          <div className="prose prose-blue max-w-none prose-p:leading-relaxed prose-headings:font-semibold">
            <Markdown>{response}</Markdown>
          </div>
        </div>
      )}

      {error && (
        <div className="p-6 bg-red-50 text-red-600 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
