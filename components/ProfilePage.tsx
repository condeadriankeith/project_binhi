import React from 'react';
import { User, X, Mail, Shield, Calendar, Award } from 'lucide-react';
import { User as UserType } from '../types';

interface Props {
  user: UserType;
  onClose: () => void;
}

export const ProfilePage: React.FC<Props> = ({ user, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0B1120]/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-slate-900/80 border border-slate-700/50 rounded-[40px] shadow-[0_40px_80px_rgba(0,0,0,0.6)] overflow-hidden relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-3 hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white transition-all z-20"
        >
          <X size={20} />
        </button>

        {/* Profile Header */}
        <div className="h-32 bg-gradient-to-r from-emerald-600 to-blue-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 filter contrast-125 saturate-150 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          <div className="absolute -bottom-12 left-10 w-24 h-24 rounded-3xl bg-[#0B1120] border-4 border-slate-900 flex items-center justify-center shadow-xl">
            <User size={48} className="text-emerald-400" />
          </div>
        </div>

        <div className="pt-16 pb-10 px-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-serif text-white tracking-tight">{user.name}</h2>
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-widest mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {user.role === 'organization' ? 'Organization Admin' : 'Certified Individual Architect'}
              </div>
            </div>
            <Award size={32} className="text-amber-500/50" />
          </div>

          <div className="space-y-6">
            <InfoItem icon={<Mail size={16} />} label="Communications Uplink" value={user.email} />
            <InfoItem icon={<Shield size={16} />} label="Security Protocol" value="Encrypted (AES-256)" />
            <InfoItem icon={<Calendar size={16} />} label="Active Since" value="March 2026" />
          </div>

          <div className="mt-10 pt-8 border-t border-slate-800">
            <div className="p-6 bg-slate-800/40 rounded-3xl border border-slate-700/50">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Planetary Achievement</h3>
              <div className="flex gap-3">
                <Badge label="Early Adopter" color="bg-emerald-500/20 text-emerald-400" />
                <Badge label="Pioneer" color="bg-blue-500/20 text-blue-400" />
                <Badge label="Guardian" color="bg-orange-500/20 text-orange-400" />
              </div>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="w-full mt-10 bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg text-sm"
          >
            Return to Core Interface
          </button>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="flex items-center gap-4 group">
    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 transition-colors">
      {icon}
    </div>
    <div>
      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{label}</div>
      <div className="text-sm text-slate-300 font-medium">{value}</div>
    </div>
  </div>
);

const Badge = ({ label, color }: { label: string, color: string }) => (
  <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${color}`}>
    {label}
  </span>
);
