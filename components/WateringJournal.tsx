import React from 'react';
import { motion } from 'framer-motion';
import { Droplet, Calendar, Trophy, ChevronRight, X, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { User } from '../types';

interface Props {
  user: User;
  onClose: () => void;
  stats: {
    watered: number;
    total: number;
  };
  isDarkMode: boolean;
}

export const WateringJournal: React.FC<Props> = ({ user, onClose, stats, isDarkMode }) => {
  const { t } = useTranslation();
  const today = new Date().toISOString().split('T')[0];
  const isComplete = stats.total > 0 && stats.watered === stats.total;
  
  // Weekly history logic
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const todayIdx = new Date().getDay();
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - todayIdx);

  const weeklyHistory = days.map((day, i) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    const isWatered = user.wateringHistory?.[dateStr];
    const isPast = date < new Date(today);
    const isCurrent = dateStr === today;

    return { day, isWatered, isPast, isCurrent };
  });

  return (
    <motion.div 
      layoutId="water-card"
      className={`backdrop-blur-3xl border p-6 md:p-8 rounded-[32px] shadow-2xl w-full max-w-md pointer-events-auto overflow-hidden relative ${isDarkMode ? 'bg-slate-900/90 border-slate-700/50' : 'bg-white/95 border-slate-200'}`}
    >
      {/* Background Decorative Glow */}
      <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-500">
            <Droplet size={24} fill="currentColor" className="animate-pulse" />
          </div>
          <div>
            <h2 className={`text-xl font-serif ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t('botanist_journal')}</h2>
            <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{t('daily_care_protocol')}</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className={`p-2 rounded-xl transition-all ${isDarkMode ? 'hover:bg-white/10 text-slate-500' : 'hover:bg-slate-100 text-slate-400'}`}
        >
          <X size={20} />
        </button>
      </div>

      <div className="space-y-8">
        {/* Progress Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <span className={`text-sm font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{t('todays_hydration')}</span>
            <span className={`text-sm font-black ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{t('trees_count', { watered: stats.watered, total: stats.total })}</span>
          </div>
          <div className={`w-full h-4 rounded-full p-1 overflow-hidden shadow-inner ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${stats.total > 0 ? (stats.watered / stats.total) * 100 : 0}%` }}
              transition={{ type: 'spring', stiffness: 50 }}
              className={`h-full rounded-full relative ${isComplete ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]'}`}
            >
               {isComplete && <Sparkles size={10} className="absolute right-1 top-0.5 text-white animate-spin" />}
            </motion.div>
          </div>
          {isComplete ? (
             <p className="text-[11px] text-emerald-500 font-bold flex items-center gap-1">
               <Trophy size={12} /> {t('all_flourishing')}
             </p>
          ) : stats.total > 0 ? (
             <p className={`text-[11px] font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
               {t('complete_watering_streak', { streak: user.wateringStreak || 0 })}
             </p>
          ) : (
             <p className={`text-[11px] font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
               {t('plant_first_tree')}
             </p>
          )}
        </div>

        {/* Weekly View */}
        <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-slate-800/40 border-slate-700/50' : 'bg-slate-50/50 border-slate-100'}`}>
          <div className="flex items-center gap-2 mb-6">
            <Calendar size={14} className="text-slate-500" />
            <span className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t('weekly_consistency')}</span>
          </div>
          <div className="flex justify-between items-center">
            {weeklyHistory.map((day, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <span className={`text-[9px] font-black ${day.isCurrent ? 'text-blue-500' : 'text-slate-500'}`}>{day.day}</span>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                  day.isWatered 
                    ? 'bg-blue-500 border-blue-400 text-white shadow-[0_4px_10px_rgba(59,130,246,0.4)] scale-110' 
                    : day.isCurrent
                      ? 'border-blue-500/50 border-dashed animate-pulse'
                      : isDarkMode ? 'border-slate-700 bg-slate-900/50' : 'border-slate-200 bg-white'
                }`}>
                  {day.isWatered && <Droplet size={14} fill="currentColor" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rewards / Badges Snippet */}
        <div className="flex items-center justify-between group cursor-pointer">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-slate-800' : 'bg-white border'}`}>
              <Trophy size={18} className="text-amber-400" />
            </div>
            <div>
              <span className={`text-xs font-bold block ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t('botanist_rank')}</span>
              <span className="text-[10px] font-medium text-slate-500">{t(user.rank ? user.rank.toLowerCase() : 'seedling')}</span>
            </div>
          </div>
          <ChevronRight size={16} className="text-slate-500 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
};
