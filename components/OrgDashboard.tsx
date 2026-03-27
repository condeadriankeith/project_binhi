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
  MessageSquare
} from 'lucide-react';
import { Organization, TileData } from '../types';

interface Props {
  org: Organization;
  onManageIslands: () => void;
  onPostUpdate: () => void;
}

export const OrgDashboard: React.FC<Props> = ({ org, onManageIslands, onPostUpdate }) => {
  return (
    <div className="w-full min-h-screen bg-[#0B1120] text-white p-6 md:p-10 pb-32 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Organization Command Center
            </div>
            <h1 className="text-3xl md:text-5xl font-serif text-white tracking-tight">{org.name}</h1>
            <p className="text-slate-400 mt-2 font-medium italic">"{org.mission}"</p>
          </div>
          
          <button 
            onClick={onPostUpdate}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all shadow-lg active:scale-95 group"
          >
            <PlusCircle size={20} />
            Post Impact Update
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            icon={<Leaf className="text-emerald-400" />} 
            label="Total Trees" 
            value={org.totalTrees.toLocaleString()} 
            sub="Planted to date"
          />
          <StatCard 
            icon={<TrendingUp className="text-blue-400" />} 
            label="CO2 Offset" 
            value={`${org.totalCo2.toLocaleString()}kg`} 
            sub="Annual capacity"
          />
          <StatCard 
            icon={<DollarSign className="text-amber-400" />} 
            label="Donations" 
            value={`₱${org.donations.toLocaleString()}`} 
            sub="Total contributions"
          />
          <StatCard 
            icon={<Users className="text-purple-400" />} 
            label="Supporters" 
            value="2,482" 
            sub="Active community"
          />
        </div>

        {/* Action Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Island Management */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-serif text-white">Floating Archipelago Status</h2>
              <button 
                onClick={onManageIslands}
                className="text-xs font-bold uppercase tracking-widest text-emerald-400 hover:text-white transition-colors flex items-center gap-2"
              >
                View Map Instance <ChevronRight size={14} />
              </button>
            </div>
            
            <div className="bg-slate-900/60 backdrop-blur-2xl border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-8 flex items-center gap-10">
                <div className="w-40 h-40 rounded-3xl flex items-center justify-center bg-slate-800 shadow-inner shrink-0 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-emerald-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <MapIcon size={64} className="text-emerald-400 relative z-10" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Live Island Monitoring</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    Your floating island is currently at {Math.floor((org.totalTrees / 25) * 100)}% capacity. 
                    Manage individual tiles to optimize biodiversity and carbon sequestration.
                  </p>
                  <div className="flex gap-4">
                    <div className="px-4 py-2 bg-slate-800 rounded-xl border border-slate-700">
                       <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Health</span>
                       <span className="text-emerald-400 font-bold">Optimal</span>
                    </div>
                    <div className="px-4 py-2 bg-slate-800 rounded-xl border border-slate-700">
                       <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Tiles</span>
                       <span className="text-white font-bold">{org.tiles.filter(t => t.isPlanted).length} / 25</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity / Notifications */}
          <div className="space-y-6">
            <h2 className="text-xl font-serif text-white">Recent Telemetry</h2>
            <div className="bg-slate-900/60 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-6 shadow-2xl h-[300px] overflow-y-auto space-y-4">
              <ActivityItem 
                icon={<DollarSign size={14} />} 
                title="New Donation" 
                desc="₱2,500 from J. Dela Cruz" 
                time="2m ago" 
              />
              <ActivityItem 
                icon={<Leaf size={14} />} 
                title="Tree Planted" 
                desc="Individual architect added a Cedar" 
                time="15m ago" 
              />
              <ActivityItem 
                icon={<MessageSquare size={14} />} 
                title="Community Comment" 
                desc="Great work on the Kanlaon project!" 
                time="1h ago" 
              />
              <ActivityItem 
                icon={<DollarSign size={14} />} 
                title="New Donation" 
                desc="₱10,000 corporate matching" 
                time="3h ago" 
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, sub }: { icon: React.ReactNode, label: string, value: string, sub: string }) => (
  <div className="bg-slate-900/60 backdrop-blur-2xl p-6 rounded-3xl border border-slate-700/50 shadow-xl hover:bg-slate-800/80 transition-all group">
    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</div>
    <div className="text-2xl font-serif text-white mb-2">{value}</div>
    <div className="text-[11px] text-slate-400 font-medium">{sub}</div>
  </div>
);

const ActivityItem = ({ icon, title, desc, time }: { icon: React.ReactNode, title: string, desc: string, time: string }) => (
  <div className="flex gap-4 items-start p-3 hover:bg-slate-800/50 rounded-2xl transition-all border border-transparent hover:border-slate-700/50">
    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-center mb-0.5">
        <h4 className="text-xs font-bold text-white uppercase">{title}</h4>
        <span className="text-[9px] font-medium text-slate-500">{time}</span>
      </div>
      <p className="text-[11px] text-slate-400 truncate">{desc}</p>
    </div>
  </div>
);
