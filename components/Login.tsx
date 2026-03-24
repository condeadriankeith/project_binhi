
import React, { useState } from 'react';
import { Leaf, ArrowRight } from 'lucide-react';

interface Props {
  onLogin: (user: { name: string; email: string }) => void;
}

export const Login: React.FC<Props> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      onLogin({ name, email });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0B1120] text-white font-sans">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/30 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
      </div>

      <div className="w-full max-w-md p-8 animate-in fade-in zoom-in-95 duration-1000 relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-3xl shadow-[0_0_40px_rgba(16,185,129,0.2)] mb-6 backdrop-blur-xl">
            <Leaf size={32} className="text-emerald-400" />
          </div>
          <h1 className="font-serif text-4xl text-white mb-2 tracking-tight drop-shadow-lg">BINHI</h1>
          <p className="text-emerald-400/70 font-medium text-sm uppercase tracking-widest">Planetary Restoration Protocol</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-900/60 backdrop-blur-2xl p-8 rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-slate-700/50">
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Architect Designation</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-6 py-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Telemetry Uplink (Email)</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="architect@binhi.com"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-6 py-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                required
              />
            </div>
            
            <button 
              type="submit"
              className="w-full bg-emerald-600 text-white rounded-2xl py-5 font-bold flex items-center justify-center gap-3 hover:bg-emerald-500 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] active:scale-95 group"
            >
              Initialize Archipelago
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>

        <p className="text-center mt-8 text-xs text-slate-500 font-medium leading-relaxed">
          By continuing, you agree to the <span className="text-emerald-400/70 hover:text-emerald-400 underline cursor-pointer transition-colors">Eco-Mandate</span><br />
          and the digital reforestation protocol.
        </p>
      </div>
    </div>
  );
};
