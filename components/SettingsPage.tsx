import React from 'react';
import { X, Moon, Sun, Bell, Globe, Shield, RefreshCw } from 'lucide-react';

interface Props {
  onClose: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const SettingsPage: React.FC<Props> = ({ onClose, isDarkMode, onToggleTheme }) => {
  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-xl animate-in fade-in duration-300 ${isDarkMode ? 'bg-[#0B1120]/90' : 'bg-slate-200/90'}`}>
      <div className={`w-full max-w-lg border rounded-[40px] shadow-[0_40px_80px_rgba(0,0,0,0.6)] overflow-hidden relative ${isDarkMode ? 'bg-slate-900/80 border-slate-700/50' : 'bg-white/90 border-slate-200'}`}>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className={`absolute top-6 right-6 p-3 rounded-2xl transition-all z-20 ${isDarkMode ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-900/10 text-slate-500 hover:text-slate-900'}`}
        >
          <X size={20} />
        </button>

        <div className="p-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
               <Shield size={24} className="text-emerald-400" />
            </div>
            <div>
              <h2 className={`text-2xl font-serif tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>System Settings</h2>
              <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>Interface Configuration</p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Theme Toggle */}
            <div className={`flex items-center justify-between p-6 rounded-3xl border transition-all ${isDarkMode ? 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
              <div className="flex gap-4 items-center">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-amber-400 ${isDarkMode ? 'bg-slate-800' : 'bg-white shadow-sm'}`}>
                  {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
                </div>
                <div>
                  <h4 className={`text-[11px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Interface Theme</h4>
                  <p className={`text-[10px] font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Toggle between Light/Dark mode</p>
                </div>
              </div>
              <button 
                onClick={onToggleTheme}
                className={`w-14 h-8 rounded-full transition-all relative ${isDarkMode ? 'bg-emerald-600' : 'bg-slate-700'}`}
              >
                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all ${isDarkMode ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            {/* Other Mock Settings */}
            <SettingItem icon={<Globe size={18} />} label="Haptic Feedback" defaultOn isDarkMode={isDarkMode} />
            <SettingItem icon={<Bell size={18} />} label="Protocol Notifications" defaultOn isDarkMode={isDarkMode} />
          </div>

          <div className="mt-12 text-center">
            <p className={`text-[9px] font-bold uppercase tracking-[0.3em] ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>Binhi System v0.4.2-α</p>
          </div>
          
          <button 
            onClick={onClose}
            className="w-full mt-10 bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl font-bold transition-all shadow-lg text-sm"
          >
            Apply & Terminate Session
          </button>
        </div>
      </div>
    </div>
  );
};

const SettingItem = ({ icon, label, defaultOn, isDarkMode }: { icon: React.ReactNode, label: string, defaultOn: boolean, isDarkMode: boolean }) => {
  const [isOn, setIsOn] = React.useState(defaultOn);
  return (
    <div className="flex items-center justify-between px-2">
      <div className={`flex gap-4 items-center ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
        <div className="w-10 h-10 flex items-center justify-center">
          {icon}
        </div>
        <h4 className="text-[11px] font-bold uppercase tracking-widest">{label}</h4>
      </div>
      <button 
        onClick={() => setIsOn(!isOn)}
        className={`w-10 h-6 rounded-full transition-all relative ${isOn ? 'bg-emerald-600/50' : isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}
      >
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-slate-400 shadow-md transition-all ${isOn ? 'left-5 bg-white' : 'left-1'}`} />
      </button>
    </div>
  );
};
