import React from 'react';
import { Globe, BarChart3, Map as MapIcon, ChevronDown, ChevronRight, ChevronLeft, Sparkles, Coins, Droplet, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { WateringJournal } from './WateringJournal';
import { ExpandingIconButton } from './ExpandingIconButton';
import { User } from '../types';

interface Props {
  forestName: string;
  totalCo2: number;
  treesPlanted: number;
  balance: number;
  onCommunityClick: () => void;
  onTopUp: () => void;
  onLocalImpactClick?: () => void;
  onPrevOrg?: () => void;
  onNextOrg?: () => void;
  isWateringMode?: boolean;
  onToggleWatering?: () => void;
  isDarkMode?: boolean;
  level?: number;
  activeUI: 'none' | 'seedVault' | 'hudOrg' | 'hudStats' | 'hudFunds' | 'language';
  setActiveUI: (ui: 'none' | 'seedVault' | 'hudOrg' | 'hudStats' | 'hudFunds' | 'language') => void;
  user: User;
  wateringStats: { watered: number; total: number };
}

export const HUD: React.FC<Props> = ({ 
  forestName, 
  totalCo2, 
  treesPlanted, 
  balance, 
  onCommunityClick,
  onTopUp,
  onLocalImpactClick,
  onPrevOrg,
  onNextOrg,
  isWateringMode = false,
  onToggleWatering,
  isDarkMode = false,
  level = 1,
  activeUI,
  setActiveUI,
  user,
  wateringStats
}) => {
  const { t } = useTranslation();
  const flightHours = (totalCo2 / 0.8).toFixed(1);
  const progress = ((treesPlanted % 5) / 5) * 100;

  const toggleExpand = (card: 'hudOrg' | 'hudStats' | 'hudFunds' | 'language') => {
    setActiveUI(activeUI === card ? 'none' : card);
  };

  const isHiddenByOther = activeUI === 'seedVault';

  const LANGUAGES = [
    { code: 'en', key: 'lang_english' },
    { code: 'tl', key: 'lang_tagalog' },
    { code: 'hil', key: 'lang_hiligaynon' },
  ];

  const currentLang = i18n.language || 'en';

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`fixed inset-0 p-4 md:p-6 z-20 flex flex-col justify-between pointer-events-none`}
    >
      
      {/* Top Identity Card - Absolutely Centered */}
      <div className="absolute top-4 md:top-6 left-1/2 -translate-x-1/2 pointer-events-none z-30">
        <motion.div 
          animate={{ opacity: 1, scale: 1 }}
          className={`flex flex-col items-center backdrop-blur-2xl border shadow-xl px-6 md:px-8 py-2 md:py-3 rounded-[24px] pointer-events-auto max-w-[90vw] md:max-w-[40vw] text-center ${isDarkMode ? 'bg-slate-900/60 border-slate-700/50' : 'bg-white/70 border-slate-200/50'}`}
        >
           <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] mb-1 shrink-0 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
              <Sparkles size={12} className="text-emerald-500" />
              <span>{t('rank', { level })}</span>
           </div>
           <h1 className={`font-serif text-sm md:text-xl lg:text-2xl tracking-tight line-clamp-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{forestName}</h1>
        </motion.div>
      </div>

      {/* Top Side Actions */}
      <div className="flex justify-between items-start pointer-events-none w-full relative z-20">
        {/* Left Side: Settings/Profile (House icons here) */}
        <div className="flex flex-col gap-3 pointer-events-auto">
          {/* Icons already exist in App.tsx floating top-left */}
        </div>

        {/* Right Side: Language Selector */}
        <motion.div 
          animate={{ opacity: isHiddenByOther ? 0 : 1, scale: isHiddenByOther ? 0.95 : 1 }}
          className="flex flex-col gap-3 pointer-events-auto relative shrink-0"
        >
          <ExpandingIconButton 
            icon={<span className="text-lg">{currentLang === 'en' ? '🇺🇸' : currentLang === 'tl' ? '🇵🇭' : '🌺'}</span>}
            label={t(LANGUAGES.find(l => l.code === currentLang)?.key || 'lang_english')}
            onClick={() => toggleExpand('language')}
            isDarkMode={isDarkMode}
            side="right"
            className={activeUI === 'language' ? 'ring-2 ring-blue-500' : ''}
          />
          
          <AnimatePresence>
            {activeUI === 'language' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className={`absolute top-full right-0 mt-2 w-48 backdrop-blur-2xl border rounded-2xl shadow-xl overflow-hidden origin-top-right ${isDarkMode ? 'bg-slate-900/90 border-slate-700/50' : 'bg-white/90 border-slate-200'}`}
              >
                {LANGUAGES.map(({ code, key }) => (
                  <button 
                    key={code} 
                    onClick={() => { i18n.changeLanguage(code); setActiveUI('none'); }}
                    className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors flex items-center justify-between ${
                      currentLang === code 
                        ? (isDarkMode ? 'text-emerald-400 bg-emerald-500/10' : 'text-emerald-600 bg-emerald-50') 
                        : (isDarkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-50')
                    }`}
                  >
                    <span>{t(key)}</span>
                    {currentLang === code && <span className="text-emerald-500 text-xs font-bold">✓</span>}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Bottom Floating Interactive Modals (Left Side) */}
      <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 flex flex-col items-start gap-3 pointer-events-none">
          
          {/* Seed Vault (Botanist Kit) */}
          {user.role === 'individual' && (
            <motion.div animate={{ opacity: 1 }} className={`pointer-events-auto flex items-center`}>
              <ExpandingIconButton 
                icon={<Leaf size={22} className="text-emerald-500" />} 
                label={t('seed_vault')} 
                onClick={() => setActiveUI(activeUI === 'seedVault' ? 'none' : 'seedVault')} 
                isDarkMode={isDarkMode}
                layoutId="seed-vault-card"
                active={activeUI === 'seedVault'}
                activeClassName="ring-2 ring-emerald-500 bg-emerald-500/10"
              />
            </motion.div>
          )}

          {/* Local Impact */}
          {onLocalImpactClick && user.role === 'individual' && (
            <motion.div 
              animate={{ 
                opacity: isHiddenByOther ? 0 : 1,
                scale: isHiddenByOther ? 0.8 : 1,
                pointerEvents: isHiddenByOther ? 'none' : 'auto' 
              }} 
              className={`pointer-events-auto flex items-center`}
            >
              <ExpandingIconButton 
                icon={<MapIcon size={22} />} 
                label={t('local_impact')} 
                onClick={onLocalImpactClick} 
                isDarkMode={isDarkMode}
                layoutId="map-card"
              />
            </motion.div>
          )}

          {/* Water Button / Journal */}
          {onToggleWatering && user.role === 'individual' && (
            <motion.div 
              animate={{ 
                opacity: isHiddenByOther ? 0 : 1,
                scale: isHiddenByOther ? 0.8 : 1,
                pointerEvents: isHiddenByOther ? 'none' : 'auto' 
              }} 
              className={`pointer-events-auto flex items-center`}
            >
              {isWateringMode ? (
                <WateringJournal 
                  user={user} 
                  stats={wateringStats} 
                  onClose={onToggleWatering} 
                  isDarkMode={isDarkMode} 
                />
              ) : (
                <ExpandingIconButton 
                  icon={<Droplet size={22} />} 
                  label={t('water')} 
                  onClick={onToggleWatering} 
                  isDarkMode={isDarkMode}
                  layoutId="water-card"
                />
              )}
            </motion.div>
          )}
          
          {/* Other Expanded Cards */}
          <motion.div
            animate={{ 
              opacity: isHiddenByOther ? 0 : 1,
              scale: isHiddenByOther ? 0.8 : 1,
              pointerEvents: isHiddenByOther ? 'none' : 'auto' 
            }}
            className={`pointer-events-auto flex items-center`}
          >
              {activeUI === 'hudOrg' ? (
              <motion.div 
                layout 
                layoutId="org-card" 
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                className={`backdrop-blur-xl border p-4 rounded-[24px] shadow-xl w-64 ${isDarkMode ? 'bg-slate-900/80 border-slate-700/50' : 'bg-white/90 border-slate-200'}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <h3 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{t('restoration_hub')}</h3>
                  <div className="flex items-center gap-1">
                    {onPrevOrg && <button onClick={onPrevOrg} className={`p-1 rounded-full ${isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}><ChevronLeft size={14} /></button>}
                    <button onClick={() => toggleExpand('hudOrg')} className={`p-1 rounded-full ${isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}><ChevronDown size={14} /></button>
                    {onNextOrg && <button onClick={onNextOrg} className={`p-1 rounded-full ${isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}><ChevronRight size={14} /></button>}
                  </div>
                </div>
                <p className={`text-sm font-medium truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{forestName}</p>
                <button onClick={onCommunityClick} className="mt-3 w-full py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 text-xs font-bold rounded-xl shadow-sm flex items-center justify-center gap-1">
                  {t('view_community')} <ChevronRight size={14} />
                </button>
              </motion.div>
            ) : (
              <ExpandingIconButton 
                icon={<Globe size={22} />} 
                label={t('restoration_hub')} 
                onClick={() => toggleExpand('hudOrg')} 
                isDarkMode={isDarkMode}
                layoutId="org-card"
              />
            )}
          </motion.div>

          <motion.div 
            animate={{ 
              opacity: isHiddenByOther ? 0 : 1,
              scale: isHiddenByOther ? 0.8 : 1,
              pointerEvents: isHiddenByOther ? 'none' : 'auto' 
            }}
            className={`pointer-events-auto flex items-center`}
          >
            {activeUI === 'hudStats' ? (
              <motion.div 
                layout 
                layoutId="stats-card" 
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                className={`backdrop-blur-xl border p-4 rounded-[24px] shadow-xl w-56 ${isDarkMode ? 'bg-slate-900/80 border-slate-700/50' : 'bg-white/90 border-slate-200'}`}
              >
                <div className="flex justify-between items-center mb-3">
                  <span className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{t('stats')}</span>
                  <button onClick={() => toggleExpand('hudStats')} className={`p-1 rounded-full ${isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}><ChevronDown size={14} /></button>
                </div>
                <div className="flex justify-between items-end mb-1">
                  <span className={`text-[10px] font-semibold text-slate-500`}>{t('co2_offset')}</span>
                  <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{totalCo2.toFixed(1)}kg</span>
                </div>
                <div className="flex justify-between items-end mb-3">
                  <span className={`text-[10px] font-semibold text-slate-500`}>{t('flight_eq')}</span>
                  <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{flightHours}h</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <motion.div layout initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1 }} className="bg-emerald-500 h-full"></motion.div>
                </div>
              </motion.div>
            ) : (
              <ExpandingIconButton 
                icon={<BarChart3 size={22} />} 
                label={t('stats')} 
                onClick={() => toggleExpand('hudStats')} 
                isDarkMode={isDarkMode}
                layoutId="stats-card"
              />
            )}
          </motion.div>

          {user.role === 'individual' && (
            <motion.div 
              animate={{ 
                opacity: isHiddenByOther ? 0 : 1,
                scale: isHiddenByOther ? 0.8 : 1,
                pointerEvents: isHiddenByOther ? 'none' : 'auto' 
              }}
              className={`pointer-events-auto flex items-center`}
            >
              {activeUI === 'hudFunds' ? (
                <motion.div 
                  layout 
                  layoutId="funds-card" 
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  className={`backdrop-blur-xl border p-4 rounded-[24px] shadow-xl w-56 ${isDarkMode ? 'bg-slate-900/80 border-slate-700/50' : 'bg-white/90 border-slate-200'}`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{t('funds')}</span>
                    <button onClick={() => toggleExpand('hudFunds')} className={`p-1 rounded-full ${isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}><ChevronDown size={14} /></button>
                  </div>
                  <span className={`text-xl font-bold block mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>₱{balance.toLocaleString()}</span>
                  <button onClick={onTopUp} className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md">
                    {t('cash_in')}
                  </button>
                </motion.div>
              ) : (
                <ExpandingIconButton 
                  icon={<Coins size={22} />} 
                  label={t('funds')} 
                  onClick={() => toggleExpand('hudFunds')} 
                  isDarkMode={isDarkMode}
                  layoutId="funds-card"
                />
              )}
            </motion.div>
          )}

        </div>
    </motion.div>
  );
};
