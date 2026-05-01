import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Leaf, 
  Map as MapIcon, 
  DollarSign, 
  Clock, 
  ChevronRight,
  PlusCircle,
  MessageSquare,
  LogOut,
  Activity
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Organization, TileData } from '../types';

interface Props {
  org: Organization;
  onManageIslands: () => void;
  onEnterLocalImpact: () => void;
  onPostUpdate: () => void;
  onLogout: () => void;
  isDarkMode?: boolean;
  totalArchitects?: number;
}

export const OrgDashboard: React.FC<Props> = ({ 
  org, 
  onManageIslands, 
  onEnterLocalImpact,
  onPostUpdate, 
  onLogout, 
  isDarkMode = false, 
  totalArchitects = 0 
}) => {
  const { t } = useTranslation();
  const plantedCount = org.tiles.filter(t => t.isPlanted).length;
  const totalCapacity = org.tiles.length;
  const healthPercentage = Math.floor((plantedCount / totalCapacity) * 100);

  return (
    <div className={`w-full h-screen p-6 md:p-10 pb-32 overflow-y-auto transition-colors duration-500 custom-scrollbar ${isDarkMode ? 'bg-[#0B1120] text-white' : 'bg-slate-50 text-slate-900'}`}>
      {/* Ambient Background Glows */}
      {isDarkMode && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className={`inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] mb-4 px-4 py-1.5 rounded-full border transition-all ${isDarkMode ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'text-emerald-600 bg-emerald-50 border-emerald-200'}`}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              {t('live_network')}
            </div>
            <h1 className={`text-4xl md:text-6xl font-serif tracking-tight leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {org.name}
              <span className="text-emerald-500 block text-lg font-sans font-bold tracking-widest uppercase mt-2 opacity-80">{t('command_center')}</span>
            </h1>
            <p className={`mt-4 font-medium italic text-lg max-w-2xl leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              "{org.mission}"
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={onPostUpdate}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-[2rem] font-bold flex items-center gap-3 transition-all shadow-[0_10px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_40px_rgba(16,185,129,0.4)] hover:-translate-y-1 active:scale-95 group"
            >
              <PlusCircle size={20} className="group-hover:rotate-90 transition-transform duration-500" />
              {t('post_impact')}
            </button>
            <button 
              onClick={onLogout}
              className={`p-4 border rounded-2xl transition-all shadow-lg group hover:scale-105 active:scale-95 ${isDarkMode ? 'bg-slate-900/60 border-slate-700/50 hover:bg-red-500/20 text-slate-400 hover:text-red-400' : 'bg-white/80 border-slate-200 hover:bg-red-50 text-slate-500 hover:text-red-500'}`}
              title={t('logout')}
            >
              <LogOut size={22} />
            </button>
          </div>
        </div>

        {/* Dynamic Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            icon={<Leaf className="text-emerald-400" />} 
            label={t('total_trees')} 
            value={org.totalTrees.toLocaleString()} 
            sub={t('ref_progress')}
            trend="+12% this week"
            isDarkMode={isDarkMode}
          />
          <StatCard 
            icon={<TrendingUp className="text-blue-400" />} 
            label={t('sequestered')} 
            value={`${org.totalCo2.toLocaleString()}kg`} 
            sub={t('env_impact')}
            trend="Growing Daily"
            isDarkMode={isDarkMode}
          />
          <StatCard 
            icon={<DollarSign className="text-amber-400" />} 
            label={t('project_funding')} 
            value={`₱${org.donations.toLocaleString()}`} 
            sub={t('total_contrib')}
            trend={t('direct_soil')}
            isDarkMode={isDarkMode}
          />
          <StatCard 
            icon={<Users className="text-purple-400" />} 
            label={t('total_archs')} 
            value={totalArchitects.toLocaleString()} 
            sub={t('reg_community')}
            trend="Expanding Hub"
            isDarkMode={isDarkMode}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Advanced Island Monitoring */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className={`text-2xl font-serif ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t('archipelago_top')}</h2>
              <div className="flex items-center gap-3">
                <button 
                  onClick={onEnterLocalImpact}
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 hover:text-white transition-all flex items-center gap-2 group bg-blue-500/5 px-4 py-2 rounded-full border border-blue-500/20"
                >
                  {t('enter_local')} <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={onManageIslands}
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 hover:text-white transition-all flex items-center gap-2 group bg-emerald-500/5 px-4 py-2 rounded-full border border-emerald-500/20"
                >
                  {t('enter_arch')} <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
            
            <div className={`backdrop-blur-3xl border rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.3)] relative group ${isDarkMode ? 'bg-slate-900/40 border-slate-700/30' : 'bg-white/80 border-slate-200'}`}>
              {/* Scanline Effect */}
              {isDarkMode && <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-emerald-500/5 to-transparent h-[200%] animate-scanline"></div>}
              
              <div className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-12 relative z-10">
                <div className={`w-48 h-48 rounded-[2.5rem] flex items-center justify-center shadow-2xl shrink-0 relative overflow-hidden transition-transform duration-700 group-hover:scale-105 ${isDarkMode ? 'bg-slate-800/80' : 'bg-slate-50'}`}>
                  <div className="absolute inset-0 bg-emerald-500/10 blur-[40px] animate-pulse"></div>
                  <MapIcon size={80} className="text-emerald-500 relative z-10 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                </div>
                
                <div className="flex-1 space-y-6">
                  <div>
                    <h3 className={`text-2xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t('monitoring')}</h3>
                    <p className={`text-base leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      System integrity is <span className="text-emerald-400 font-bold uppercase tracking-widest text-xs ml-1">{t('optimal')}</span>. 
                      {t('monitoring_desc', { count: org.tiles.length / 25 })}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className={`p-5 rounded-3xl border transition-all hover:border-emerald-500/30 ${isDarkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">{t('utilization')}</span>
                       <div className="flex items-end gap-2">
                         <span className={`text-3xl font-serif ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{plantedCount}</span>
                         <span className="text-slate-500 font-bold mb-1.5">/ {totalCapacity} Tiles</span>
                       </div>
                       <div className="w-full h-1.5 bg-slate-700 rounded-full mt-3 overflow-hidden">
                         <div 
                           className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-1000" 
                           style={{ width: `${healthPercentage}%` }}
                         ></div>
                       </div>
                    </div>
                    <div className={`p-5 rounded-3xl border transition-all hover:border-blue-500/30 ${isDarkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">{t('network_load')}</span>
                       <div className="flex items-end gap-2">
                         <span className={`text-3xl font-serif ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{healthPercentage}%</span>
                         <span className="text-slate-500 font-bold mb-1.5">{t('efficiency')}</span>
                       </div>
                       <div className="w-full h-1.5 bg-slate-700 rounded-full mt-3 overflow-hidden">
                         <div 
                           className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-1000" 
                           style={{ width: `${Math.min(healthPercentage + 20, 100)}%` }}
                         ></div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Telemetry Stream */}
          <div className="space-y-6">
            <h2 className={`text-2xl font-serif px-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t('telemetry')}</h2>
            <div className={`backdrop-blur-3xl border rounded-[2.5rem] p-6 shadow-2xl h-[420px] overflow-y-auto space-y-4 custom-scrollbar ${isDarkMode ? 'bg-slate-900/40 border-slate-700/30' : 'bg-white/80 border-slate-200'}`}>
              {(!org.recentDonations || org.recentDonations.length === 0) ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4 text-center px-6">
                  <Activity size={40} className="opacity-20 animate-pulse" />
                  <p className="text-xs italic leading-relaxed">{t('telemetry_empty')}</p>
                </div>
              ) : (
                org.recentDonations.map(donation => {
                  const now = new Date();
                  const eventTime = new Date(donation.timestamp);
                  const diffMinutes = Math.floor((now.getTime() - eventTime.getTime()) / 60000);
                  const timeString = diffMinutes < 1 ? t('just_now') : diffMinutes < 60 ? t('mins_ago', { count: diffMinutes }) : t('hours_ago', { count: Math.floor(diffMinutes / 60) });

                  return (
                    <ActivityItem 
                      key={donation.id}
                      icon={<Leaf size={14} />} 
                      title={t('deployed', { tree: donation.treeName })} 
                      desc={t('architect', { name: donation.userName })} 
                      time={timeString}
                      isDarkMode={isDarkMode}
                    />
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Impact Updates Stream */}
        <div className="space-y-8 pb-20">
          <div className="flex items-end justify-between px-2">
            <div>
              <h2 className={`text-3xl font-serif ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t('comm_protocol')}</h2>
              <p className={`text-sm mt-1 font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{t('broadcast_desc')}</p>
            </div>
            <div className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl border ${isDarkMode ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' : 'text-emerald-600 border-emerald-200 bg-emerald-50'}`}>
              {t('reports_published', { count: org.updates?.length || 0 })}
            </div>
          </div>

          {(!org.updates || org.updates.length === 0) ? (
            <div className={`backdrop-blur-3xl border rounded-[3rem] p-16 text-center shadow-2xl relative overflow-hidden group ${isDarkMode ? 'bg-slate-900/20 border-slate-700/30' : 'bg-white/40 border-slate-200'}`}>
              <div className="absolute inset-0 bg-emerald-500/5 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl ${isDarkMode ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400'}`}>
                <MessageSquare size={36} />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{t('feed_empty')}</h3>
              <p className={`text-base max-w-md mx-auto leading-relaxed mb-8 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                {t('feed_empty_desc')}
              </p>
              <button 
                onClick={onPostUpdate}
                className="inline-flex items-center gap-2 text-emerald-400 font-black text-[10px] uppercase tracking-[0.3em] hover:text-white transition-colors"
              >
                {t('init_broadcast')} <ChevronRight size={14} />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {org.updates.map((update) => (
                <UpdateCard key={update.id} update={update} isDarkMode={isDarkMode} />
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scanline {
          animation: scanline 8s linear infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.2);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

const UpdateCard = ({ update, isDarkMode }: { update: any, isDarkMode: boolean }) => {
  const { t } = useTranslation();
  const categoryColors = {
    'field-work': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'community': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    'milestone': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  };

  const date = new Date(update.timestamp).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  return (
    <div className={`backdrop-blur-3xl p-8 rounded-[2.5rem] border shadow-2xl flex flex-col gap-5 transition-all hover:-translate-y-2 group relative overflow-hidden ${isDarkMode ? 'bg-slate-900/60 border-slate-700/30 hover:bg-slate-800/80' : 'bg-white/80 border-slate-200 hover:bg-slate-50'}`}>
      <div className="flex justify-between items-start relative z-10">
        <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-xl border ${categoryColors[update.category as keyof typeof categoryColors]}`}>
          {t(update.category.replace('-', '_'))}
        </span>
        <span className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>{date}</span>
      </div>
      
      <div className="relative z-10">
        <h4 className={`text-lg font-bold mb-3 leading-tight group-hover:text-emerald-400 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{update.title}</h4>
        <p className={`text-sm leading-relaxed line-clamp-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{update.content}</p>
      </div>

      <div className={`mt-auto pt-6 border-t flex items-center gap-3 relative z-10 ${isDarkMode ? 'border-slate-700/50' : 'border-slate-100'}`}>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-slate-800 text-slate-500 shadow-inner' : 'bg-slate-100 text-slate-400'}`}>
           <Clock size={14} />
        </div>
        <div className="flex flex-col">
          <span className={`text-[9px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{t('verification')}</span>
          <span className={`text-[9px] font-bold ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>{t('secured_node')}</span>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, sub, trend, isDarkMode }: { icon: React.ReactNode, label: string, value: string, sub: string, trend: string, isDarkMode: boolean }) => (
  <div className={`backdrop-blur-3xl p-7 rounded-[2rem] border shadow-2rem transition-all group relative overflow-hidden ${isDarkMode ? 'bg-slate-900/60 border-slate-700/30 hover:bg-slate-800/80 hover:border-emerald-500/20' : 'bg-white/80 border-slate-200 hover:bg-slate-50'}`}>
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 ${isDarkMode ? 'bg-slate-800 shadow-inner' : 'bg-slate-100'}`}>
      {icon}
    </div>
    <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{label}</div>
    <div className={`text-3xl font-serif mb-2 tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{value}</div>
    <div className="flex justify-between items-center mt-4">
      <div className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{sub}</div>
      <div className={`text-[9px] font-black uppercase tracking-widest ${isDarkMode ? 'text-emerald-400/80' : 'text-emerald-600/80'}`}>{trend}</div>
    </div>
  </div>
);

const ActivityItem = ({ icon, title, desc, time, isDarkMode }: { icon: React.ReactNode, title: string, desc: string, time: string, isDarkMode: boolean }) => (
  <div className={`flex gap-5 items-start p-4 rounded-[1.5rem] transition-all border border-transparent hover:shadow-lg ${isDarkMode ? 'hover:bg-slate-800/40 hover:border-slate-700/50' : 'hover:bg-slate-50 hover:border-slate-200'}`}>
    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-center mb-1">
        <h4 className={`text-xs font-black uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{title}</h4>
        <span className="text-[9px] font-bold text-slate-600 bg-slate-800/50 px-2 py-0.5 rounded-full">{time}</span>
      </div>
      <p className={`text-xs truncate font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>{desc}</p>
    </div>
  </div>
);
