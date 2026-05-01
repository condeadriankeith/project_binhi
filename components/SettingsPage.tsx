import React, { useState, useEffect } from 'react';
import { X, Moon, Sun, Bell, Smartphone, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface Props {
  onClose: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  hapticsEnabled: boolean;
  onToggleHaptics: () => void;
  notificationsEnabled: boolean;
  onToggleNotifications: () => void;
}

export const SettingsPage: React.FC<Props> = ({ 
  onClose, 
  isDarkMode, 
  onToggleTheme,
  hapticsEnabled,
  onToggleHaptics,
  notificationsEnabled,
  onToggleNotifications
}) => {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    // Basic device detection to hide haptics on desktop
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-xl animate-in fade-in duration-300 ${isDarkMode ? 'bg-[#0B1120]/90' : 'bg-slate-200/90'}`}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className={`w-full max-w-lg border rounded-[32px] md:rounded-[40px] shadow-[0_40px_80px_rgba(0,0,0,0.6)] overflow-hidden relative mx-4 ${isDarkMode ? 'bg-slate-900/80 border-slate-700/50' : 'bg-white/90 border-slate-200'}`}
      >
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className={`absolute top-6 right-6 p-3 rounded-2xl transition-all z-20 ${isDarkMode ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-900/10 text-slate-500 hover:text-slate-900'}`}
        >
          <X size={20} />
        </button>

        <div className="p-6 md:p-10">
          <div className="flex items-center gap-3 mb-8 md:mb-10">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-emerald-500/20 flex items-center justify-center">
               <Shield size={22} className="text-emerald-500" />
            </div>
            <div>
              <h2 className={`text-xl md:text-2xl font-serif tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t('settings')}</h2>
              <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{t('app_configuration')}</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Theme Toggle */}
            <div className={`flex items-center justify-between p-4 md:p-6 rounded-[24px] md:rounded-3xl border transition-all ${isDarkMode ? 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
              <div className="flex gap-3 md:gap-4 items-center">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-amber-400 ${isDarkMode ? 'bg-slate-800' : 'bg-white shadow-sm'}`}>
                  {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
                </div>
                <div>
                  <h4 className={`text-[11px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t('app_theme')}</h4>
                  <p className={`text-[10px] font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{t('theme_desc')}</p>
                </div>
              </div>
              <button 
                onClick={onToggleTheme}
                className={`w-14 h-8 rounded-full transition-all relative ${isDarkMode ? 'bg-emerald-600' : 'bg-slate-700'}`}
              >
                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all ${isDarkMode ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            {/* Other Settings */}
            {isMobile && (
              <SettingItem 
                icon={<Smartphone size={18} />} 
                label={t('haptic_feedback')}
                isOn={hapticsEnabled} 
                onToggle={onToggleHaptics} 
                isDarkMode={isDarkMode} 
              />
            )}
            
            <SettingItem 
              icon={<Bell size={18} />} 
              label={t('push_notifications')}
              isOn={notificationsEnabled} 
              onToggle={onToggleNotifications} 
              isDarkMode={isDarkMode} 
            />
          </div>

          <div className="mt-12 text-center pb-6">
            <p className={`text-[9px] font-bold uppercase tracking-[0.3em] ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>Binhi v1.0.0</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const SettingItem = ({ icon, label, isOn, onToggle, isDarkMode }: { icon: React.ReactNode, label: string, isOn: boolean, onToggle: () => void, isDarkMode: boolean }) => {
  return (
    <div className="flex items-center justify-between px-2">
      <div className={`flex gap-4 items-center ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
        <div className="w-10 h-10 flex items-center justify-center">
          {icon}
        </div>
        <h4 className="text-[11px] font-bold uppercase tracking-widest">{label}</h4>
      </div>
      <button 
        onClick={onToggle}
        className={`w-10 h-6 rounded-full transition-all relative ${isOn ? 'bg-emerald-600/50' : isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}
      >
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-slate-400 shadow-md transition-all ${isOn ? 'left-5 bg-white' : 'left-1'}`} />
      </button>
    </div>
  );
};
