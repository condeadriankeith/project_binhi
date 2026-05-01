import React, { useState, useEffect } from 'react';
import { Leaf, ArrowRight, User as UserIcon, Building2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { UserRole, User } from '../types';
import { ORGANIZATIONS } from '../constants';

interface Props {
  onLogin: (user: User) => void;
  isDarkMode?: boolean;
}

export const Login: React.FC<Props> = ({ onLogin, isDarkMode = false }) => {
  const { t } = useTranslation();
  const [isRegistering, setIsRegistering] = useState(false);
  const [role, setRole] = useState<UserRole>('individual');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clear error when switching modes
  useEffect(() => {
    setError(null);
  }, [isRegistering, role]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError(t('login_error'));
      return;
    }

    if (isRegistering && role === 'individual' && !name) {
      setError(t('name_required'));
      return;
    }

    if (password.length < 6) {
      setError(t('password_min_length'));
      return;
    }

    const savedUsers = localStorage.getItem('binhi_users');
    const users: User[] = savedUsers ? JSON.parse(savedUsers) : [];

    if (isRegistering) {
      // Check if user already exists
      const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        setError(t('signup_error'));
        return;
      }

      let assignedOrgId: string | undefined = undefined;
      let assignedName = name;

      // Organization Auto-assignment Logic
      if (role === 'organization') {
        const lowerEmail = email.toLowerCase();
        if (lowerEmail.includes('bcc')) {
          assignedOrgId = 'bakuran';
          assignedName = 'BCC Advocates for Kalikasan (BAKURAN)';
        } else if (lowerEmail.includes('earthguard')) {
          assignedOrgId = 'earthguards';
          assignedName = 'EarthGuards USLS';
        } else {
          setError(t('org_domain_error'));
          return;
        }
      }

      // Register new user
      const newUser: User = { 
        name: assignedName, 
        email, 
        password, // In a real app, hash this!
        role, 
        orgId: assignedOrgId,
        rank: 'Seedling',
        badges: [],
        wateringStreak: 0
      };
      
      const updatedUsers = [...users, newUser];
      localStorage.setItem('binhi_users', JSON.stringify(updatedUsers));
      
      // Auto-login after registration
      localStorage.setItem('binhi_session', JSON.stringify(newUser));
      onLogin(newUser);
    } else {
      // Login attempt
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!user) {
        setError(t('account_not_found'));
        return;
      }

      if (user.password !== password) {
        setError(t('login_error'));
        return;
      }

      // Verify Role
      if (user.role !== role) {
        setError(t('incorrect_portal', { role: t(role === 'individual' ? 'individual' : 'organization') }));
        return;
      }

      // Update session
      localStorage.setItem('binhi_session', JSON.stringify(user));
      onLogin(user);
    }
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center font-sans overflow-y-auto py-10 transition-colors duration-500`}>
      {/* Dynamic Procedural Gradient Background */}
      <div 
        className="fixed inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: isDarkMode 
            ? 'linear-gradient(135deg, #0B1120 0%, #064E3B 50%, #0F172A 100%)' 
            : 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 50%, #F0FDF4 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradientBG 15s ease infinite',
        }}
      >
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none overflow-hidden mix-blend-overlay">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/30 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }}></div>
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '12s' }}></div>
        </div>
      </div>

      <style>{`
        @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      <div className="w-full max-w-[420px] p-6 animate-in fade-in zoom-in-95 duration-1000 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 rounded-[20px] shadow-[0_0_40px_rgba(16,185,129,0.2)] mb-6 backdrop-blur-xl transition-transform hover:scale-105 duration-300">
            <Leaf size={32} className="text-emerald-500" />
          </div>
          <h1 className={`font-serif text-3xl mb-1 tracking-tight drop-shadow-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {t('welcome')}
          </h1>
          <p className={`font-medium text-xs ${isDarkMode ? 'text-emerald-400/80' : 'text-emerald-600/80'}`}>
            {t('login_subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className={`backdrop-blur-3xl p-6 md:p-8 rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.1)] border transition-all duration-500 ${isDarkMode ? 'bg-slate-900/70 border-slate-700/50' : 'bg-white/70 border-slate-200/50'}`}>
          <div className="space-y-5">
            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-3 p-1 rounded-[20px] bg-black/5 dark:bg-white/5 backdrop-blur-sm">
              <button
                type="button"
                onClick={() => setRole('individual')}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl transition-all duration-300 ${
                  role === 'individual' 
                    ? isDarkMode ? 'bg-slate-800 shadow-md text-white' : 'bg-white shadow-md text-slate-900'
                    : isDarkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-600'
                }`}
              >
                <UserIcon size={16} />
                <span className="text-xs font-semibold">{t('individual')}</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('organization')}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl transition-all duration-300 ${
                  role === 'organization' 
                    ? isDarkMode ? 'bg-slate-800 shadow-md text-white' : 'bg-white shadow-md text-slate-900'
                    : isDarkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-600'
                }`}
              >
                <Building2 size={16} />
                <span className="text-xs font-semibold">{t('organization')}</span>
              </button>
            </div>

            {error && (
              <div className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-medium border animate-in slide-in-from-top-2 duration-300 ${isDarkMode ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-red-50 border-red-100 text-red-600'}`}>
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-4">
              {isRegistering && role === 'individual' && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className={`block text-xs font-semibold mb-1.5 ml-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    {t('full_name')}
                  </label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('name_placeholder')}
                    className={`w-full border rounded-[20px] px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-medium text-sm ${isDarkMode ? 'bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'}`}
                    required={isRegistering && role === 'individual'}
                  />
                </div>
              )}

              <div>
                <label className={`block text-xs font-semibold mb-1.5 ml-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  {t('email_address')}
                </label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === 'organization' ? "org@example.com" : "you@example.com"}
                  className={`w-full border rounded-[20px] px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-medium text-sm ${isDarkMode ? 'bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'}`}
                  required
                />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1.5 ml-1 flex justify-between ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  <span>{t('password')}</span>
                  {!isRegistering && (
                    <a href="#" className="text-emerald-500 hover:text-emerald-600 transition-colors font-medium">{t('forgot_password')}</a>
                  )}
                </label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full border rounded-[20px] px-5 py-3.5 pr-12 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-medium text-sm ${isDarkMode ? 'bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'}`}
                    required
                    minLength={6}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 p-1 transition-colors ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>
            
            <button 
              type="submit"
              className="w-full bg-emerald-600 text-white rounded-[20px] py-4 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-emerald-500 transition-all shadow-[0_8px_20px_rgba(16,185,129,0.2)] hover:shadow-[0_8px_25px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 active:translate-y-0 group mt-6"
            >
              {isRegistering ? t('signup') : t('login')}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="text-center mt-6">
              <button
                type="button"
                onClick={() => setIsRegistering(!isRegistering)}
                className={`text-xs font-semibold transition-colors py-2 ${isDarkMode ? 'text-slate-400 hover:text-emerald-400' : 'text-slate-500 hover:text-emerald-600'}`}
              >
                {isRegistering ? t('have_account') : t('no_account')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
