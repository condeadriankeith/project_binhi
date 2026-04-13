import React, { useState } from 'react';
import { User, Globe, TrendingUp, Sparkles, Leaf, ChevronDown, ChevronUp, ChevronRight, BarChart3 } from 'lucide-react';

interface Props {
  forestName: string;
  totalCo2: number;
  treesPlanted: number;
  balance: number;
  onCommunityClick: () => void;
  onAssistantClick: () => void;
  onTopUp: () => void;
  isDarkMode?: boolean;
}

export const HUD: React.FC<Props> = ({ 
  forestName, 
  totalCo2, 
  treesPlanted, 
  balance, 
  onCommunityClick,
  onAssistantClick,
  onTopUp,
  isDarkMode = false
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
        <div className={`flex flex-col items-center backdrop-blur-2xl border shadow-xl px-4 md:px-10 py-2 md:py-4 rounded-2xl md:rounded-3xl max-w-[180px] md:max-w-none pointer-events-auto ${isDarkMode ? 'bg-slate-900/60 border-slate-700/50' : 'bg-white/60 border-slate-200'}`}>
           <div className={`flex items-center gap-1.5 md:gap-2 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] mb-0.5 md:mb-1 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
              <Leaf size={12} className="text-emerald-500" />
              <span>Level {level}</span>
           </div>
           <h1 className={`font-serif text-lg md:text-3xl tracking-tight truncate w-full text-center ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{forestName}</h1>
        </div>

        {/* Right: Community */}
        <div className="flex flex-col gap-3 pointer-events-auto">
          <button 
            onClick={onCommunityClick}
            className={`backdrop-blur-xl border shadow-lg p-2 md:p-4 rounded-xl md:rounded-2xl transition-all active:scale-95 group ${isDarkMode ? 'bg-slate-900/60 border-slate-700/50 hover:bg-slate-800' : 'bg-white/60 border-slate-200 hover:bg-slate-100'}`}
          >
            <Globe size={20} className={`transition-colors group-hover:text-emerald-400 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`} />
          </button>
        </div>
      </div>

      {/* Bottom Interface (Stats & Progress) */}
      <div className="flex flex-col items-start pointer-events-auto w-full mb-28 md:mb-28 gap-3 md:gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
        
        {/* Toggle Trigger */}
        <button 
          onClick={() => setIsStatsCollapsed(!isStatsCollapsed)}
          className={`backdrop-blur-xl border px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 transition-colors group mb-[-8px] z-10 ${isDarkMode ? 'bg-slate-900/60 border-slate-700/50 hover:bg-slate-800' : 'bg-white/60 border-slate-200 hover:bg-slate-100'}`}
        >
          <BarChart3 size={12} className={isDarkMode ? 'text-emerald-400' : 'text-emerald-600'} />
          <span className={`text-[8px] md:text-[9px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Stats Overview</span>
          {isStatsCollapsed ? <ChevronUp size={12} className={isDarkMode ? 'text-white' : 'text-slate-800'} /> : <ChevronDown size={12} className={isDarkMode ? 'text-white' : 'text-slate-800'} />}
        </button>

        <div className={`flex flex-col md:flex-row justify-between items-end md:items-center w-full gap-2 md:gap-4 transition-all duration-500 ease-in-out origin-bottom ${isStatsCollapsed ? 'max-h-0 opacity-0 scale-95 pointer-events-none' : 'max-h-96 opacity-100 scale-100'}`}>
          {/* Left: Balance & Stats */}
          <div className="flex flex-col gap-2 md:gap-3 w-full md:w-auto">
            <div className={`backdrop-blur-xl border px-3 md:px-5 py-2 md:py-3 rounded-xl md:rounded-2xl shadow-lg flex items-center gap-2 md:gap-4 ${isDarkMode ? 'bg-slate-900/60 border-slate-700/50' : 'bg-white/60 border-slate-200'}`}>
              <div className={`p-1.5 md:p-2 rounded-lg md:rounded-xl ${isDarkMode ? 'bg-emerald-900/50' : 'bg-emerald-100'}`}>
                <TrendingUp size={18} className={isDarkMode ? 'text-emerald-400' : 'text-emerald-600'} />
              </div>
              <div className="flex flex-col">
                <span className={`text-[8px] md:text-[10px] uppercase font-bold tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Funds</span>
                <span className={`text-base md:text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>₱{balance.toLocaleString()}</span>
              </div>
              <button 
                onClick={onTopUp}
                className={`ml-2 w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all shadow-md active:scale-95 ${isDarkMode ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700'}`}
                title="Mock Top-Up"
              >
                +
              </button>
            </div>

            <div className={`backdrop-blur-xl border px-4 md:px-5 py-2 md:py-3 rounded-xl md:rounded-2xl shadow-lg flex justify-between md:justify-start gap-4 md:gap-6 ${isDarkMode ? 'bg-slate-900/60 border-slate-700/50' : 'bg-white/60 border-slate-200'}`}>
               <div className="flex flex-col">
                  <span className={`text-[8px] md:text-[9px] uppercase font-bold tracking-wider ${isDarkMode ? 'text-emerald-400/70' : 'text-emerald-600/70'}`}>CO2</span>
                  <span className={`text-sm md:text-base font-serif ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{totalCo2.toFixed(1)}kg</span>
               </div>
               <div className={`w-px ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-200'}`}></div>
               <div className="flex flex-col">
                  <span className={`text-[8px] md:text-[9px] uppercase font-bold tracking-wider ${isDarkMode ? 'text-emerald-400/70' : 'text-emerald-600/70'}`}>Flight</span>
                  <span className={`text-sm md:text-base font-serif ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{flightHours}h</span>
               </div>
            </div>
          </div>

          {/* Right: Progress Bar */}
          <div className={`backdrop-blur-xl border p-3 md:p-4 rounded-xl md:rounded-2xl shadow-lg w-full md:max-w-[240px] ${isDarkMode ? 'bg-slate-900/60 border-slate-700/50' : 'bg-white/60 border-slate-200'}`}>
            <div className="flex justify-between items-end mb-1.5 md:mb-2">
              <span className={`text-[8px] md:text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Milestone</span>
              <span className={`text-[8px] md:text-[10px] font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{treesPlanted % 8}/8</span>
            </div>
            <div className={`w-full h-1.5 md:h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
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
