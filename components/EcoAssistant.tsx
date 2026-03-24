
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, X, BrainCircuit, Loader2 } from 'lucide-react';
import { ItemType, TileData } from '../types';
import { TREE_SPECIES } from '../constants';

interface Props {
  tiles: TileData[];
  onClose: () => void;
}

export const EcoAssistant: React.FC<Props> = ({ tiles, onClose }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getAIInsight = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const plantedTrees = tiles
        .filter(t => t.plantType)
        .map(t => TREE_SPECIES.find(s => s.id === t.plantType)?.name)
        .filter(Boolean);

      const prompt = `Act as an Ancient Forest Spirit and Ecosystem Scientist. 
      I have a floating island with these trees: ${plantedTrees.join(', ') || 'None yet, just bare rock'}.
      Provide a 2-sentence poetic analysis of this ecosystem's soul and one practical "Eco-Tip" for the future. 
      Keep it high-end, inspiring, and concise.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setInsight(response.text || "The wind whispers through the voids where leaves should be. Begin your journey, Architect.");
    } catch (error) {
      console.error(error);
      setInsight("The ethereal connection is weak. The trees wait in silence.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-500">
      <div className="bg-slate-900 rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-slate-700/50 w-full max-w-lg overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
        <div className="bg-emerald-950/80 p-8 text-white relative overflow-hidden border-b border-emerald-900/50">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <BrainCircuit size={120} />
          </div>
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-500/20 rounded-xl">
              <Sparkles className="text-emerald-400" size={24} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-400">Ecosystem Intelligence</span>
          </div>
          <h2 className="text-3xl font-serif">Arboreal Wisdom</h2>
        </div>

        <div className="p-8">
          {!insight && !loading && (
            <div className="text-center py-8">
              <p className="text-slate-400 mb-8 leading-relaxed italic">
                Connect with the island's neural network to receive a deep-analysis of your current restoration efforts.
              </p>
              <button 
                onClick={getAIInsight}
                className="w-full bg-emerald-600 text-white rounded-2xl py-4 font-bold hover:bg-emerald-500 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] flex items-center justify-center gap-3 active:scale-95"
              >
                Commune with the Spirit
              </button>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center py-12 gap-4">
              <Loader2 className="animate-spin text-emerald-500" size={40} />
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Analyzing Biome...</p>
            </div>
          )}

          {insight && !loading && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
              <div className="bg-slate-800/50 border-l-4 border-emerald-500 p-6 rounded-r-2xl mb-8">
                <p className="text-slate-300 font-serif text-lg leading-relaxed italic">
                  "{insight.split('\n')[0]}"
                </p>
              </div>
              <div className="flex items-start gap-4 p-4 bg-emerald-950/30 border border-emerald-900/50 rounded-2xl">
                <div className="mt-1">🌿</div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider mb-1">Botanist Tip</p>
                  <p className="text-sm text-slate-300 leading-snug font-medium">
                    {insight.split('\n').slice(1).join(' ') || "Diversify your canopy to invite rare avian species."}
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-full mt-8 text-slate-500 font-bold text-xs uppercase tracking-widest hover:text-slate-300 transition-colors"
              >
                Close Report
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
