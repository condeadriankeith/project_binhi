import React, { useState } from 'react';
import { Leaf, ArrowRight, User as UserIcon, Building2, ChevronLeft } from 'lucide-react';
import { UserRole, User } from '../types';
import { ORGANIZATIONS } from '../constants';

interface Props {
  onLogin: (user: User) => void;
  isDarkMode?: boolean;
}

export const Login: React.FC<Props> = ({ onLogin, isDarkMode = false }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [role, setRole] = useState<UserRole>('individual');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [orgId, setOrgId] = useState(ORGANIZATIONS[0].id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      onLogin({ 
        name, 
        email, 
        role, 
        orgId: role === 'organization' ? orgId : undefined 
      });
    }
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center font-sans overflow-y-auto py-10 transition-colors duration-500 ${isDarkMode ? 'bg-[#0B1120] text-white' : 'bg-slate-50 text-slate-900'}`}>
      {/* Background patterns */}
      <div className="fixed top-0 left-0 w-full h-full opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/30 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
      </div>

      <div className="w-full max-w-md p-8 animate-in fade-in zoom-in-95 duration-1000 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-3xl shadow-[0_0_40px_rgba(16,185,129,0.2)] mb-4 backdrop-blur-xl">
            <Leaf size={32} className="text-emerald-400" />
          </div>
          <h1 className={`font-serif text-4xl mb-2 tracking-tight drop-shadow-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>BINHI</h1>
          <p className={`font-medium text-[10px] uppercase tracking-[0.3em] ${isDarkMode ? 'text-emerald-400/70' : 'text-emerald-600/70'}`}>Planetary Restoration Protocol</p>
        </div>

        <form onSubmit={handleSubmit} className={`backdrop-blur-2xl p-8 rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.5)] border ${isDarkMode ? 'bg-slate-900/60 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
          <div className="space-y-6">
            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('individual')}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                  role === 'individual' 
                    ? isDarkMode ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-emerald-50 border-emerald-500 text-emerald-600'
                    : isDarkMode ? 'bg-slate-800/40 border-slate-700 text-slate-400 hover:bg-slate-800/60' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                }`}
              >
                <UserIcon size={20} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Individual</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('organization')}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                  role === 'organization' 
                    ? isDarkMode ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-blue-50 border-blue-500 text-blue-600'
                    : isDarkMode ? 'bg-slate-800/40 border-slate-700 text-slate-400 hover:bg-slate-800/60' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                }`}
              >
                <Building2 size={20} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Organization</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-[10px] font-bold uppercase tracking-widest mb-2 ml-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {role === 'organization' ? 'Organization Name' : 'Architect Designation'}
                </label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={role === 'organization' ? "Enter organization name" : "Your name"}
                  className={`w-full border rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-medium ${isDarkMode ? 'bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'}`}
                  required
                />
              </div>

              <div>
                <label className={`block text-[10px] font-bold uppercase tracking-widest mb-2 ml-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Telemetry Uplink (Email)</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="architect@binhi.com"
                  className={`w-full border rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-medium ${isDarkMode ? 'bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'}`}
                  required
                />
              </div>

              {role === 'organization' && (
                <div>
                  <label className={`block text-[10px] font-bold uppercase tracking-widest mb-2 ml-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Select Forest Hub</label>
                  <select
                    value={orgId}
                    onChange={(e) => setOrgId(e.target.value)}
                    className={`w-full border rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-medium appearance-none ${isDarkMode ? 'bg-slate-800/50 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                  >
                    {ORGANIZATIONS.map(org => (
                      <option key={org.id} value={org.id} className={isDarkMode ? 'bg-slate-900' : 'bg-white'}>{org.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            
            <button 
              type="submit"
              className="w-full bg-emerald-600 text-white rounded-2xl py-5 font-bold flex items-center justify-center gap-3 hover:bg-emerald-500 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] active:scale-95 group mt-4"
            >
              {isRegistering ? 'Register Protocol' : 'Initialize Archipelago'}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className={`w-full text-[10px] font-bold uppercase tracking-widest transition-colors py-2 ${isDarkMode ? 'text-slate-500 hover:text-emerald-400' : 'text-slate-500 hover:text-emerald-600'}`}
            >
              {isRegistering ? 'Already have an uplink? Login' : 'No account yet? Register here'}
            </button>
          </div>
        </form>

        <p className="text-center mt-8 text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-loose">
          Secure Link Established via <span className="text-emerald-500/60">Binhi Core</span><br />
          Verification Status: <span className="text-emerald-500/60">Encrypted</span>
        </p>
      </div>
    </div>
  );
};
