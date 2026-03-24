
import React from 'react';
import { X, Share2, Globe, Users, TrendingUp } from 'lucide-react';

interface Props {
  isVisible: boolean;
  onClose: () => void;
}

export const CommunityImpact: React.FC<Props> = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-500">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-slate-900/80 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-slate-700/50 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
        
        {/* Header Image/Gradient */}
        <div className="h-32 bg-gradient-to-br from-emerald-900/80 to-teal-950/80 relative overflow-hidden border-b border-emerald-900/50">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-slate-300 hover:text-white rounded-full transition-colors backdrop-blur-md"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="px-8 pb-8 pt-6 relative">
          
          {/* Floating Icon */}
          <div className="absolute -top-10 left-8 w-20 h-20 bg-slate-800 rounded-2xl shadow-xl flex items-center justify-center border border-slate-700/50">
            <Globe size={40} className="text-emerald-400" />
          </div>

          <div className="mt-12">
            <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] mb-2">
              <Users size={12} />
              Global Community
            </div>
            <h2 className="font-serif text-3xl text-white mb-4 tracking-tight">Every tree matters.</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              Individual action causes a ripple effect. Join thousands of planetary architects working together to restore the Earth's ecosystems.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Trees Planted</p>
                <p className="text-2xl font-serif text-white">33.6M</p>
                <div className="flex items-center gap-1 text-emerald-400 text-xs mt-1 font-medium">
                  <TrendingUp size={12} /> +12% this month
                </div>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">CO2 Offset (kg)</p>
                <p className="text-2xl font-serif text-white">1.8B</p>
                <div className="flex items-center gap-1 text-emerald-400 text-xs mt-1 font-medium">
                  <TrendingUp size={12} /> +8% this month
                </div>
              </div>
            </div>

            <button className="w-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-2xl py-4 font-bold flex items-center justify-center gap-2 hover:bg-emerald-600/30 transition-all active:scale-[0.98] shadow-lg hover:shadow-emerald-900/20">
               <Share2 size={18} />
               Share Impact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
