import React, { useState } from 'react';
import { Shield, Lock } from 'lucide-react';
import { AdminService } from '../../services/AdminService';
import { motion } from 'framer-motion';

interface Props {
  onLogin: () => void;
}

export const AdminLogin: React.FC<Props> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await AdminService.login(password);
    if (success) {
      onLogin();
    } else {
      setError('Invalid admin credentials.');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950 flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl"
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20">
            <Shield className="text-red-500" size={32} />
          </div>
        </div>
        
        <h1 className="text-2xl font-serif font-bold text-center text-white mb-2">System Override</h1>
        <p className="text-slate-400 text-center text-sm mb-8">Authorized personnel only.</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Access Code"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-red-500 transition-colors"
                autoFocus
              />
            </div>
            {error && <p className="text-red-400 text-xs mt-2 text-center">{error}</p>}
          </div>
          
          <button 
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-red-900/50"
          >
            Authenticate
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 flex justify-center">
          <a href="/" className="text-xs text-slate-500 hover:text-slate-300">Return to Public Interface</a>
        </div>
      </motion.div>
    </div>
  );
};
