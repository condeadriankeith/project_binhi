import React from 'react';
import { TreeType, ItemType } from '../types';
import { TREE_SPECIES } from '../constants';
import { Sprout, ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface Props {
  balance: number;
  selectedTool: ItemType | null;
  onSelect: (item: ItemType) => void;
  isDarkMode?: boolean;
  userLevel?: number;
  isActive: boolean;
  onToggle: () => void;
  isHidden: boolean; 
}

export const BotanistKit: React.FC<Props> = ({ 
  balance, 
  selectedTool, 
  onSelect, 
  isDarkMode = false, 
  userLevel = 1,
  isActive,
  onToggle,
  isHidden
}) => {
  const { t } = useTranslation();
  
  return (
    <AnimatePresence>
      {isActive && (
        <div className="fixed bottom-24 left-6 md:bottom-28 md:left-8 z-40 flex items-end pointer-events-none">
          <motion.div 
            layout 
            layoutId="seed-vault-card"
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`pointer-events-auto backdrop-blur-3xl border rounded-[32px] shadow-2xl py-6 px-4 w-[320px] flex flex-col ${isDarkMode ? 'bg-slate-900/90 border-slate-700/50' : 'bg-white/90 border-slate-200'}`}
          >
            <div className="flex items-center justify-between mb-6 px-2">
              <div className="flex items-center gap-2">
                <Sprout size={18} className="text-emerald-500" />
                <span className="text-xs uppercase tracking-widest text-emerald-500 font-bold">
                  {t('seed_vault')}
                </span>
              </div>
              <button 
                onClick={onToggle}
                className={`p-1.5 rounded-full transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
              >
                <ChevronLeft size={18} className="rotate-180" />
              </button>
            </div>

            {/* Container for Seedlings */}
            <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
              {TREE_SPECIES.map((item: TreeType, i) => {
                const isSelected = selectedTool === item.id;
                const canAfford = balance >= item.price;
                const isLocked = userLevel < item.unlockLevel;

                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => !isLocked && canAfford && onSelect(item.id)}
                    disabled={isLocked || !canAfford}
                    className={`
                      relative group flex items-center gap-4 p-3 rounded-2xl transition-colors duration-300 w-full shrink-0 text-left
                      ${isSelected 
                        ? (isDarkMode ? 'bg-emerald-950/50 border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'bg-emerald-50 border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]')
                        : (isDarkMode ? 'bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 hover:border-slate-600' : 'bg-slate-50 border border-slate-200 hover:bg-slate-100')}
                      ${isLocked || !canAfford ? 'opacity-50 grayscale cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    <div className={`
                      w-10 h-10 rounded-[12px] flex items-center justify-center text-xl shrink-0 transition-transform duration-300 relative
                      ${isSelected ? 'bg-emerald-500/20' : (isDarkMode ? 'bg-slate-900/50' : 'bg-white shadow-sm')}
                    `}>
                      {isLocked ? <Lock size={16} className="text-slate-500" /> : item.icon}
                    </div>
                    
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <h3 className={`font-bold text-xs truncate ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                        {isLocked ? t('locked_species') : t(`tree_${item.name.toLowerCase()}`)}
                      </h3>
                      <span className={`font-mono font-bold text-[9px] ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        {isLocked ? `${t('rank', { level: item.unlockLevel })}` : `₱${item.price.toLocaleString()}`}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
