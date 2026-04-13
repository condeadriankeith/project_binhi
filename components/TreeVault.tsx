import React from 'react';
import { TREE_SPECIES } from '../constants';
import { ItemType } from '../types';
import { ChevronDown, ChevronUp, Lock } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onToggle: () => void;
  level: number;
  balance: number;
  onSelect: (type: ItemType) => void;
  plantedCounts: Record<ItemType, number>;
}

export const TreeVault: React.FC<Props> = ({ 
  isOpen, 
  onToggle, 
  level, 
  balance, 
  onSelect,
  plantedCounts 
}) => {
  return (
    <div className={`fixed bottom-0 left-0 w-full z-30 transition-transform duration-500 ease-in-out ${isOpen ? 'translate-y-0' : 'translate-y-[calc(100%-60px)]'}`}>
      <div className="max-w-md mx-auto bg-slate-900/80 backdrop-blur-2xl rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-x border-slate-700/50 overflow-hidden">
        
        {/* Handle */}
        <button 
          onClick={onToggle}
          className="w-full py-4 flex flex-col items-center gap-1 hover:bg-slate-800/50 transition-colors"
        >
          <div className="w-12 h-1 bg-slate-600 rounded-full"></div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
            {isOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            View Tree Types
          </span>
        </button>

        <div className="px-6 pb-12 pt-2 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-3 gap-4">
            {TREE_SPECIES.map((tree) => {
              const isLocked = level < tree.unlockLevel;
              const canAfford = balance >= tree.price;
              const count = plantedCounts[tree.id] || 0;

              return (
                <button
                  key={tree.id}
                  disabled={isLocked}
                  onClick={() => onSelect(tree.id)}
                  className={`relative flex flex-col items-center p-4 rounded-2xl border transition-all ${
                    isLocked 
                    ? 'bg-slate-800/30 border-transparent opacity-60' 
                    : 'bg-slate-800/50 border-slate-700/50 hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] active:scale-95'
                  }`}
                >
                  {count > 0 && (
                    <span className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {count}
                    </span>
                  )}
                  
                  <div className="text-3xl mb-2">{isLocked ? <Lock size={20} className="text-slate-600" /> : tree.icon}</div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">{tree.name}</span>
                  <span className="text-xs font-bold text-emerald-400">₱{tree.price.toLocaleString()}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
