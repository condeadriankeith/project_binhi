import React, { useState } from 'react';
import { TreeType, ItemType } from '../types';
import { TREE_SPECIES } from '../constants';
import { Info, Sprout, ChevronDown, ChevronUp, Lock } from 'lucide-react';

interface Props {
  balance: number;
  selectedTool: ItemType | null;
  onSelect: (item: ItemType) => void;
  isDarkMode?: boolean;
  userLevel?: number;
}

export const BotanistKit: React.FC<Props> = ({ balance, selectedTool, onSelect, isDarkMode = false, userLevel = 1 }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 pointer-events-none flex justify-center pb-2 md:pb-8 px-2 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 fill-mode-both">
      <div className="pointer-events-auto flex flex-col items-center w-full max-w-3xl">
        
        {/* Header / Handle */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`backdrop-blur-xl border border-b-0 rounded-t-2xl px-4 md:px-6 py-1.5 md:py-2 flex items-center gap-2 md:gap-3 shadow-[0_-10px_40px_rgba(0,0,0,0.2)] transition-colors group ${isDarkMode ? 'bg-slate-900/95 border-slate-700/50 hover:bg-slate-800' : 'bg-white/95 border-slate-200 hover:bg-slate-100'}`}
        >
          <Sprout size={14} className="text-emerald-400 group-hover:scale-110 transition-transform" />
          <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-emerald-400 font-bold">
            Seed Vault
          </span>
          <span className={`w-1.5 h-1.5 rounded-full animate-pulse ml-0.5 md:ml-1 ${isDarkMode ? 'bg-emerald-500' : 'bg-emerald-400'}`}></span>
          <div className={`ml-2 transition-colors group-hover:text-emerald-400 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            {isCollapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
        </button>

        {/* The Dock */}
        <div className={`backdrop-blur-xl border rounded-2xl md:rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-500 ease-in-out w-full overflow-hidden ${isDarkMode ? 'bg-slate-900/95 border-slate-700/50' : 'bg-white/95 border-slate-200'} ${isCollapsed ? 'max-h-0 opacity-0' : 'max-h-96 opacity-100 p-2 md:p-4'}`}>
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 md:gap-4 min-w-max justify-start md:justify-center px-2 py-1">
              {TREE_SPECIES.map((item: TreeType) => {
                const isSelected = selectedTool === item.id;
                const canAfford = balance >= item.price;
                const isLocked = userLevel < item.unlockLevel;

                return (
                  <button
                    key={item.id}
                    onClick={() => !isLocked && canAfford && onSelect(item.id)}
                    disabled={isLocked || !canAfford}
                    className={`
                      relative group flex flex-col items-center p-2.5 md:p-4 rounded-xl md:rounded-2xl transition-all duration-300 w-24 md:w-36 shrink-0
                      ${isSelected 
                        ? (isDarkMode ? 'bg-emerald-950/50 border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)] -translate-y-1.5 md:-translate-y-2' : 'bg-emerald-50 border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)] -translate-y-1.5 md:-translate-y-2')
                        : (isDarkMode ? 'bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 hover:border-slate-600 hover:-translate-y-1' : 'bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 hover:-translate-y-1')}
                      ${isLocked || !canAfford ? 'opacity-40 grayscale cursor-not-allowed' : 'cursor-pointer'}
                      ${isLocked ? 'border-dashed border-slate-500/30' : ''}
                    `}
                  >
                    {/* Icon Container */}
                    <div className={`
                      w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-3xl mb-2 md:mb-3 transition-transform duration-300 relative
                      ${isSelected ? 'bg-emerald-500/20 scale-110' : (isDarkMode ? 'bg-slate-900/50 group-hover:scale-110' : 'bg-white shadow-sm group-hover:scale-110')}
                    `}>
                      {isLocked ? <Lock size={24} className="text-slate-500" /> : item.icon}
                      
                      {isLocked && (
                        <div className="absolute -top-1 -right-1 bg-slate-700 text-[8px] font-black px-1.5 py-0.5 rounded-full text-white uppercase tracking-tighter">
                          Lvl {item.unlockLevel}
                        </div>
                      )}
                    </div>
                    
                    <h3 className={`font-bold text-[10px] md:text-sm mb-0.5 md:mb-1 ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                      {isLocked ? 'Locked Species' : item.name}
                    </h3>
                    <span className={`font-mono font-bold text-[9px] md:text-xs mb-1.5 md:mb-2 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                      {isLocked ? '---' : `₱${item.price.toLocaleString()}`}
                    </span>
                    
                    {/* Tooltip / Extra Info */}
                    <div className={`
                      absolute -top-12 md:-top-14 left-1/2 -translate-x-1/2 text-[9px] md:text-[10px] px-2 md:px-3 py-1.5 md:py-2 rounded-lg md:rounded-xl 
                      opacity-0 md:group-hover:opacity-100 transition-all duration-300 whitespace-nowrap border shadow-xl pointer-events-none
                      flex flex-col items-center gap-0.5 md:gap-1
                      ${isDarkMode ? 'bg-slate-800 text-white border-slate-600' : 'bg-white text-slate-900 border-slate-200'}
                      ${isSelected ? 'opacity-100 -translate-y-1.5 md:-translate-y-2' : ''}
                    `}>
                      {isLocked ? (
                        <span className="font-bold text-amber-500">Unlocks at Level {item.unlockLevel}</span>
                      ) : (
                        <>
                          <span className={`font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>Offsets {item.co2Factor}kg CO2/yr</span>
                          <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Botanist Level {item.unlockLevel} required</span>
                        </>
                      )}
                      <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 md:w-2 md:h-2 border-b border-r rotate-45 ${isDarkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-slate-200'}`}></div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
