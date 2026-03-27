import React, { useState } from 'react';
import { User, Globe, TrendingUp, Sparkles, Leaf, ChevronDown, ChevronUp, ChevronRight, BarChart3 } from 'lucide-react';

interface Props {
  forestName: string;
  totalCo2: number;
  treesPlanted: number;
  balance: number;
  onCommunityClick: () => void;
  onAssistantClick: () => void;
}

export const HUD: React.FC<Props> = ({ 
  forestName, 
  totalCo2, 
  treesPlanted, 
  balance, 
  onCommunityClick,
  onAssistantClick 
}) => {
  const [isStatsCollapsed, setIsStatsCollapsed] = useState(true);
  
  const flightHours = (totalCo2 / 0.8).toFixed(1);
  const level = Math.floor(treesPlanted / 8) + 1;
  const progress = ((treesPlanted % 8) / 8) * 100;

  return (
    <div className="fixed inset-0 pointer-events-none p-4 md:p-8 z-20 flex flex-col justify-between">
      
      {/* Top Navigation Bar */}
      <div className="flex justify-between items-start pointer-events-none animate-in fade-in slide-in-from-top-8 duration-1000">
        
        {/* Left: User & AI */}
        <div className="flex flex-col gap-2 md:gap-3 pointer-events-auto">
          {/* Removed AI Insight button to prevent overlap with Profile button */}
        </div>

        {/* Center: Title & Level */}
        <div className="flex flex-col items-center bg-slate-900/60 backdrop-blur-2xl border border-slate-700/50 shadow-xl px-4 md:px-10 py-2 md:py-4 rounded-2xl md:rounded-3xl max-w-[180px] md:max-w-none pointer-events-auto">
           <div className="flex items-center gap-1.5 md:gap-2 text-[8px] md:text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] mb-0.5 md:mb-1">
              <Leaf size={12} className="text-emerald-500" />
              <span>Level {level}</span>
           </div>
           <h1 className="font-serif text-lg md:text-3xl text-white tracking-tight truncate w-full text-center">{forestName}</h1>
        </div>

        {/* Right: Community */}
        <div className="flex flex-col gap-3 pointer-events-auto">
          <button 
            onClick={onCommunityClick}
            className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 shadow-lg p-2 md:p-4 rounded-xl md:rounded-2xl hover:bg-slate-800 transition-all active:scale-95 group"
          >
            <Globe size={20} className="text-slate-300 group-hover:text-emerald-400 transition-colors" />
          </button>
        </div>
      </div>

      {/* Bottom Interface (Stats & Progress) */}
      <div className="flex flex-col items-start pointer-events-auto w-full mb-28 md:mb-28 gap-3 md:gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
        
        {/* Toggle Trigger */}
        <button 
          onClick={() => setIsStatsCollapsed(!isStatsCollapsed)}
          className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 hover:bg-slate-800 transition-colors group mb-[-8px] z-10"
        >
          <BarChart3 size={12} className="text-emerald-400" />
          <span className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest">Stats Overview</span>
          {isStatsCollapsed ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>

        <div className={`flex flex-col md:flex-row justify-between items-end md:items-center w-full gap-2 md:gap-4 transition-all duration-500 ease-in-out origin-bottom ${isStatsCollapsed ? 'max-h-0 opacity-0 scale-95 pointer-events-none' : 'max-h-96 opacity-100 scale-100'}`}>
          {/* Left: Balance & Stats */}
          <div className="flex flex-col gap-2 md:gap-3 w-full md:w-auto">
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 px-3 md:px-5 py-2 md:py-3 rounded-xl md:rounded-2xl shadow-lg flex items-center gap-2 md:gap-4">
              <div className="bg-emerald-900/50 p-1.5 md:p-2 rounded-lg md:rounded-xl">
                <TrendingUp size={18} className="text-emerald-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] md:text-[10px] uppercase font-bold text-slate-400 tracking-wider">Funds</span>
                <span className="text-base md:text-lg font-bold text-white">${balance.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 px-4 md:px-5 py-2 md:py-3 rounded-xl md:rounded-2xl shadow-lg flex justify-between md:justify-start gap-4 md:gap-6">
               <div className="flex flex-col">
                  <span className="text-[8px] md:text-[9px] uppercase font-bold text-emerald-400/70 tracking-wider">CO2</span>
                  <span className="text-sm md:text-base font-serif text-white">{totalCo2.toFixed(1)}kg</span>
               </div>
               <div className="w-px bg-slate-700/50"></div>
               <div className="flex flex-col">
                  <span className="text-[8px] md:text-[9px] uppercase font-bold text-emerald-400/70 tracking-wider">Flight</span>
                  <span className="text-sm md:text-base font-serif text-white">{flightHours}h</span>
               </div>
            </div>
          </div>

          {/* Right: Progress Bar */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-3 md:p-4 rounded-xl md:rounded-2xl shadow-lg w-full md:max-w-[240px]">
            <div className="flex justify-between items-end mb-1.5 md:mb-2">
              <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Milestone</span>
              <span className="text-[8px] md:text-[10px] font-bold text-white">{treesPlanted % 8}/8</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 md:h-2 rounded-full overflow-hidden">
               <div 
                 className="bg-emerald-500 h-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                 style={{ width: `${progress}%` }}
               />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
