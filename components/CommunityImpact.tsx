import React from 'react';
import { X, Share2, Globe, Users, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  isDarkMode?: boolean;
  totalTrees?: number;
  totalCo2?: number;
}

export const CommunityImpact: React.FC<Props> = ({ 
  isVisible, 
  onClose, 
  isDarkMode = false,
  totalTrees = 33600000,
  totalCo2 = 1800000000
}) => {
  const { t } = useTranslation();
  if (!isVisible) return null;

  const handleShare = () => {
    const text = t('share_text', { 
      trees: totalTrees.toLocaleString(), 
      co2: (totalCo2 / 1000000).toFixed(1) 
    });
    navigator.clipboard.writeText(text);
    alert(t('copied_to_clipboard'));
  };

  const formatLargeNumber = (num: number) => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    return num.toLocaleString();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-500">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 backdrop-blur-md ${isDarkMode ? 'bg-slate-900/40' : 'bg-slate-200/40'}`}
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className={`relative w-full max-w-lg backdrop-blur-2xl rounded-[32px] md:rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.5)] border overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 mx-4 ${isDarkMode ? 'bg-slate-900/80 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
        
        {/* Header Image/Gradient */}
        <div className={`h-32 relative overflow-hidden border-b ${isDarkMode ? 'bg-gradient-to-br from-emerald-900/80 to-teal-950/80 border-emerald-900/50' : 'bg-gradient-to-br from-emerald-400/80 to-teal-500/80 border-emerald-200'}`}>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          <button 
            onClick={onClose} 
            className={`absolute top-4 right-4 p-2 rounded-full transition-colors backdrop-blur-md ${isDarkMode ? 'bg-black/20 hover:bg-black/40 text-slate-300 hover:text-white' : 'bg-white/20 hover:bg-white/40 text-slate-700 hover:text-slate-900'}`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="px-6 md:px-10 pb-6 md:pb-10 pt-6 relative">
          
          {/* Floating Icon */}
          <div className={`absolute -top-10 left-6 md:left-10 w-16 h-16 md:w-20 md:h-20 rounded-2xl shadow-xl flex items-center justify-center border ${isDarkMode ? 'bg-slate-800 border-slate-700/50' : 'bg-white border-slate-200'}`}>
            <Globe size={32} className="text-emerald-400" />
          </div>

          <div className="mt-10 md:mt-12">
            <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
              <Users size={12} />
              {t('global_community')}
            </div>
            <h2 className={`font-serif text-xl md:text-3xl mb-4 tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t('every_tree_matters')}</h2>
            <p className={`text-sm leading-relaxed mb-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {t('individual_action_desc')}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
                <p className={`text-[10px] uppercase font-bold tracking-widest mb-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{t('global_trees')}</p>
                <p className={`text-2xl font-serif ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{formatLargeNumber(totalTrees)}</p>
                <div className={`flex items-center gap-1 text-xs mt-1 font-medium ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  <TrendingUp size={12} /> +12% {t('this_month')}
                </div>
              </div>
              <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
                <p className={`text-[10px] uppercase font-bold tracking-widest mb-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{t('global_co2')}</p>
                <p className={`text-2xl font-serif ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{formatLargeNumber(totalCo2)}</p>
                <div className={`flex items-center gap-1 text-xs mt-1 font-medium ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  <TrendingUp size={12} /> +8% {t('this_month')}
                </div>
              </div>
            </div>

            <button 
              onClick={handleShare}
              className="w-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-2xl py-4 font-bold flex items-center justify-center gap-2 hover:bg-emerald-600/30 transition-all active:scale-[0.98] shadow-lg hover:shadow-emerald-900/20"
            >
               <Share2 size={18} />
               {t('share_impact')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
