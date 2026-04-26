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
  LogOut
} from 'lucide-react';
import { Organization, TileData } from '../types';

interface Props {
  org: Organization;
  onManageIslands: () => void;
  onPostUpdate: () => void;
  onLogout: () => void;
  isDarkMode?: boolean;
  uniqueSupporters?: number;
}

export const OrgDashboard: React.FC<Props> = ({ org, onManageIslands, onPostUpdate, onLogout, isDarkMode = false, uniqueSupporters = 2482 }) => {
  return (
    <div className={`w-full min-h-screen p-6 md:p-10 pb-32 overflow-y-auto transition-colors duration-500 ${isDarkMode ? 'bg-[#0B1120] text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] mb-2 px-3 py-1 rounded-full border w-fit ${isDarkMode ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-emerald-600 bg-emerald-50 border-emerald-200'}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Organization Command Center
            </div>
            <h1 className={`text-3xl md:text-5xl font-serif tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{org.name}</h1>
            <p className={`mt-2 font-medium italic ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>"{org.mission}"</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={onPostUpdate}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all shadow-lg active:scale-95 group"
            >
              <PlusCircle size={20} />
              Post Impact Update
            </button>
            <button 
              onClick={onLogout}
              className={`p-4 border rounded-2xl transition-all shadow-lg group ${isDarkMode ? 'bg-slate-900/60 border-slate-700/50 hover:bg-slate-800 text-slate-400 hover:text-red-400' : 'bg-white/80 border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-red-500'}`}
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            icon={<Leaf className="text-emerald-400" />} 
            label="Total Trees" 
            value={org.totalTrees.toLocaleString()} 
            sub="Planted to date"
            isDarkMode={isDarkMode}
          />
          <StatCard 
            icon={<TrendingUp className="text-blue-400" />} 
            label="CO2 Offset" 
            value={`${org.totalCo2.toLocaleString()}kg`} 
            sub="Annual capacity"
            isDarkMode={isDarkMode}
          />
          <StatCard 
            icon={<DollarSign className="text-amber-400" />} 
            label="Donations" 
            value={`₱${org.donations.toLocaleString()}`} 
            sub="Total contributions"
            isDarkMode={isDarkMode}
          />
          <StatCard 
            icon={<Users className="text-purple-400" />} 
            label="Supporters" 
            value={uniqueSupporters.toLocaleString()} 
            sub="Active community"
            isDarkMode={isDarkMode}
          />
        </div>

        {/* Action Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Island Management */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className={`text-xl font-serif ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Floating Archipelago Status</h2>
              <button 
                onClick={onManageIslands}
                className="text-xs font-bold uppercase tracking-widest text-emerald-400 hover:text-white transition-colors flex items-center gap-2"
              >
                View Map Instance <ChevronRight size={14} />
              </button>
            </div>
            
            <div className={`backdrop-blur-2xl border rounded-3xl overflow-hidden shadow-2xl ${isDarkMode ? 'bg-slate-900/60 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
              <div className="p-8 flex flex-col md:flex-row items-center gap-10">
                <div className={`w-40 h-40 rounded-3xl flex items-center justify-center shadow-inner shrink-0 relative overflow-hidden group ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                  <div className="absolute inset-0 bg-emerald-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <MapIcon size={64} className="text-emerald-400 relative z-10" />
                </div>
                <div>
                  <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Live Island Monitoring</h3>
                  <p className={`text-sm leading-relaxed mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Your floating island is currently at {Math.floor((org.totalTrees / 25) * 100)}% capacity. 
                    Manage individual tiles to optimize biodiversity and carbon sequestration.
                  </p>
                  <div className="flex gap-4">
                    <div className={`px-4 py-2 rounded-xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                       <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Health</span>
                       <span className="text-emerald-400 font-bold">Optimal</span>
                    </div>
                    <div className={`px-4 py-2 rounded-xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                       <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Tiles</span>
                       <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{org.tiles.filter(t => t.isPlanted).length} / 25</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity / Notifications */}
          <div className="space-y-6">
            <h2 className={`text-xl font-serif ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Recent Telemetry</h2>
            <div className={`backdrop-blur-2xl border rounded-3xl p-6 shadow-2xl h-[300px] overflow-y-auto space-y-4 ${isDarkMode ? 'bg-slate-900/60 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
              {(!org.recentDonations || org.recentDonations.length === 0) ? (
                <div className="text-slate-500 text-sm text-center py-10 italic">No telemetry data available yet. Waiting for individual architects to plant...</div>
              ) : (
                org.recentDonations.map(donation => {
                  const now = new Date();
                  const eventTime = new Date(donation.timestamp);
                  const diffMinutes = Math.floor((now.getTime() - eventTime.getTime()) / 60000);
                  const timeString = diffMinutes < 1 ? 'Just now' : diffMinutes < 60 ? `${diffMinutes}m ago` : `${Math.floor(diffMinutes / 60)}h ago`;

                  return (
                    <ActivityItem 
                      key={donation.id}
                      icon={<Leaf size={14} />} 
                      title={`${donation.treeName} Planted`} 
                      desc={`₱${donation.amount.toLocaleString()} from ${donation.userName}`} 
                      time={timeString}
                      isDarkMode={isDarkMode}
                    />
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Impact Updates Feed */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className={`text-xl font-serif ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Impact Updates Feed</h2>
            <div className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              {org.updates?.length || 0} Updates Published
            </div>
          </div>

          {(!org.updates || org.updates.length === 0) ? (
            <div className={`backdrop-blur-2xl border rounded-[2rem] p-12 text-center shadow-xl ${isDarkMode ? 'bg-slate-900/40 border-slate-700/50' : 'bg-white/60 border-slate-200'}`}>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${isDarkMode ? 'bg-slate-800 text-slate-600' : 'bg-slate-100 text-slate-400'}`}>
                <MessageSquare size={32} />
              </div>
              <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>No updates yet</h3>
              <p className={`text-sm max-w-md mx-auto ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                Share your progress with the community! Post your first update to show the real-world impact of your restoration efforts.
              </p>
              <button 
                onClick={onPostUpdate}
                className="mt-6 text-emerald-500 font-bold text-sm hover:underline"
              >
                Post an Update Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {org.updates.map((update) => (
                <UpdateCard key={update.id} update={update} isDarkMode={isDarkMode} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const UpdateCard = ({ update, isDarkMode }: { update: any, isDarkMode: boolean }) => {
  const categoryColors = {
    'field-work': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'community': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    'milestone': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  };

  const date = new Date(update.timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className={`backdrop-blur-2xl p-6 rounded-[2rem] border shadow-xl flex flex-col gap-4 transition-all hover:-translate-y-1 ${isDarkMode ? 'bg-slate-900/60 border-slate-700/50 hover:bg-slate-800/80' : 'bg-white/80 border-slate-200 hover:bg-slate-50'}`}>
      <div className="flex justify-between items-start">
        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${categoryColors[update.category as keyof typeof categoryColors]}`}>
          {update.category.replace('-', ' ')}
        </span>
        <span className={`text-[10px] font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{date}</span>
      </div>
      
      <div>
        <h4 className={`text-base font-bold mb-2 leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{update.title}</h4>
        <p className={`text-xs leading-relaxed line-clamp-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{update.content}</p>
      </div>

      <div className={`mt-auto pt-4 border-t flex items-center gap-2 ${isDarkMode ? 'border-slate-700/50' : 'border-slate-100'}`}>
        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400'}`}>
           <Clock size={12} />
        </div>
        <span className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Verified on Blockchain</span>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, sub, isDarkMode }: { icon: React.ReactNode, label: string, value: string, sub: string, isDarkMode: boolean }) => (
  <div className={`backdrop-blur-2xl p-6 rounded-3xl border shadow-xl transition-all group ${isDarkMode ? 'bg-slate-900/60 border-slate-700/50 hover:bg-slate-800/80' : 'bg-white/80 border-slate-200 hover:bg-slate-50'}`}>
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
      {icon}
    </div>
    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</div>
    <div className={`text-2xl font-serif mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{value}</div>
    <div className={`text-[11px] font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{sub}</div>
  </div>
);

const ActivityItem = ({ icon, title, desc, time, isDarkMode }: { icon: React.ReactNode, title: string, desc: string, time: string, isDarkMode: boolean }) => (
  <div className={`flex gap-4 items-start p-3 rounded-2xl transition-all border border-transparent ${isDarkMode ? 'hover:bg-slate-800/50 hover:border-slate-700/50' : 'hover:bg-slate-50 hover:border-slate-200'}`}>
    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-center mb-0.5">
        <h4 className={`text-xs font-bold uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{title}</h4>
        <span className="text-[9px] font-medium text-slate-500">{time}</span>
      </div>
      <p className={`text-[11px] truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{desc}</p>
    </div>
  </div>
);
