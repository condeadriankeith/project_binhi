import React from 'react';
import { User as UserIcon, X, Mail, Droplet, Calendar, Award, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { User } from '../types';
import { ORGANIZATIONS } from '../constants';

interface Props {
  user: User;
  onClose: () => void;
  onLogout?: () => void;
  isDarkMode?: boolean;
}

export const ProfilePage: React.FC<Props> = ({ user, onClose, onLogout, isDarkMode = false }) => {
  const { t } = useTranslation();

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

        {/* Profile Header */}
        <div className="h-32 bg-gradient-to-r from-emerald-500 to-cyan-500 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 filter contrast-125 saturate-150 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          <div className={`absolute -bottom-12 left-10 w-24 h-24 rounded-[24px] border-4 flex items-center justify-center shadow-xl ${isDarkMode ? 'bg-[#0B1120] border-slate-900' : 'bg-white border-slate-100'}`}>
            <UserIcon size={48} className="text-emerald-500" />
          </div>
        </div>

        <div className="pt-16 pb-8 md:pb-10 px-6 md:px-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className={`text-xl md:text-2xl font-serif tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{user.name}</h2>
              <div className="flex flex-col gap-1 mt-1">
                <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  {user.role === 'organization' ? t('org_account') : t('individual_account')}
                </div>
                {user.role === 'organization' && user.orgId && (
                  <div className={`text-[10px] font-bold uppercase tracking-[0.2em] ml-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {ORGANIZATIONS.find(o => o.id === user.orgId)?.name || 'Unknown Hub'}
                  </div>
                )}
              </div>
            </div>
            <Award size={32} className="text-amber-500/80" />
          </div>

          <div className="space-y-6">
            <InfoItem icon={<Mail size={16} />} label={t('email_address')} value={user.email} isDarkMode={isDarkMode} />
            <InfoItem icon={<Droplet size={16} />} label={t('watering_streak')} value={t('days', { count: user.wateringStreak || 0 })} isDarkMode={isDarkMode} />
            <InfoItem icon={<Award size={16} />} label={t('current_rank')} value={t(user.rank?.toLowerCase() || 'seedling')} isDarkMode={isDarkMode} />
            <InfoItem icon={<Calendar size={16} />} label={t('member_since')} value="May 2026" isDarkMode={isDarkMode} />
          </div>

          <div className={`mt-8 md:mt-10 pt-6 md:pt-8 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <div className={`p-4 md:p-6 rounded-[24px] md:rounded-3xl border ${isDarkMode ? 'bg-slate-800/40 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 md:mb-4">{t('achievements')}</h3>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {user.badges && user.badges.length > 0 ? (
                  user.badges.map(badge => (
                     <Badge key={badge} label={t(badge.toLowerCase().replace(' ', '_'))} color="bg-emerald-500/20 text-emerald-500" />
                  ))
                ) : (
                  <>
                    <Badge label={t('early_adopter')} color="bg-emerald-500/20 text-emerald-500" />
                    {user.role === 'organization' ? (
                      <>
                        <Badge label={t('partner')} color="bg-blue-500/20 text-blue-500" />
                        <Badge label={t('verified')} color="bg-purple-500/20 text-purple-500" />
                      </>
                    ) : (
                      <>
                        <Badge label={t('pioneer')} color="bg-blue-500/20 text-blue-500" />
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 mt-10">
            <button 
              onClick={onClose}
              className={`flex-1 py-4 rounded-2xl font-bold transition-all shadow-md text-sm ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-900'}`}
            >
              {t('close_profile')}
            </button>
            {onLogout && (
              <button 
                onClick={onLogout}
                className="px-6 py-4 rounded-2xl font-bold transition-all shadow-md text-sm bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 flex items-center gap-2"
              >
                <LogOut size={18} />
                {t('logout')}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const InfoItem = ({ icon, label, value, isDarkMode }: { icon: React.ReactNode, label: string, value: string, isDarkMode: boolean }) => (
  <div className="flex items-center gap-4 group">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors group-hover:text-emerald-500 ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
      {icon}
    </div>
    <div>
      <div className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{label}</div>
      <div className={`text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{value}</div>
    </div>
  </div>
);

const Badge = ({ label, color }: { label: string, color: string }) => (
  <span className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider ${color}`}>
    {label}
  </span>
);
