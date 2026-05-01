import React, { useState, useEffect } from 'react';
import { ShieldAlert, Trash2, Users, LogOut, Search, Activity } from 'lucide-react';
import { AdminService } from '../../services/AdminService';
import { User } from '../../types';
import { ORGANIZATIONS } from '../../constants';

interface Props {
  onLogout: () => void;
}

export const AdminDashboard: React.FC<Props> = ({ onLogout }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'orgs' | 'system'>('system');

  useEffect(() => {
    setUsers(AdminService.getAllUsers());
  }, []);

  const handleFactoryReset = () => {
    if (window.confirm("CRITICAL WARNING: This will permanently delete all user accounts, active sessions, and reset the database. Are you absolutely sure?")) {
      AdminService.factoryReset();
    }
  };

  const handleClearUser = (email: string) => {
    if (window.confirm(`Delete account for ${email}?`)) {
      AdminService.clearUser(email);
      setUsers(AdminService.getAllUsers());
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10 text-white">
          <ShieldAlert className="text-red-500" />
          <span className="font-serif font-bold text-lg tracking-wide">BINHI ADMIN</span>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${activeTab === 'users' ? 'bg-blue-500/10 text-blue-400' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <Users size={18} /> User Accounts
          </button>
          <button 
            onClick={() => setActiveTab('orgs')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${activeTab === 'orgs' ? 'bg-emerald-500/10 text-emerald-400' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <Activity size={18} /> Organization Activity
          </button>
          <button 
            onClick={() => setActiveTab('system')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${activeTab === 'system' ? 'bg-red-500/10 text-red-400' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <ShieldAlert size={18} /> System Controls
          </button>
        </nav>

        <button onClick={onLogout} className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-white transition-colors text-sm font-medium">
          <LogOut size={18} /> Sign Out
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          
          {activeTab === 'system' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-800 pb-4">System Controls</h2>
              
              <div className="bg-red-950/20 border border-red-900/50 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-500/20 rounded-xl text-red-500">
                    <Trash2 size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-red-400 mb-2">Factory Reset</h3>
                    <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                      Executing a factory reset will completely purge the application's local storage database. This includes all registered users, organization states, saved themes, and active sessions. The system will be restored to its original prototype state.
                    </p>
                    <button 
                      onClick={handleFactoryReset}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg transition-colors flex items-center gap-2"
                    >
                      <Trash2 size={16} /> Execute Data Purge
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-800 pb-4">Registered Accounts</h2>
              
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-800/50 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-4 font-medium">Name</th>
                      <th className="px-6 py-4 font-medium">Email</th>
                      <th className="px-6 py-4 font-medium">Role</th>
                      <th className="px-6 py-4 font-medium">Rank</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {users.map(u => (
                      <tr key={u.email} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4 text-white font-medium">{u.name}</td>
                        <td className="px-6 py-4">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${u.role === 'organization' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">{u.rank || '-'}</td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => handleClearUser(u.email)} className="text-red-400 hover:text-red-300 text-xs font-bold">Delete</button>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No users found in database.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'orgs' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-800 pb-4">Organization Activity</h2>
              <div className="grid grid-cols-1 gap-4">
                {ORGANIZATIONS.map(org => (
                  <div key={org.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">{org.name}</h3>
                      <p className="text-sm text-slate-500">Region: {org.location}</p>
                    </div>
                    <div className="flex gap-6 text-right">
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Trees Planted</div>
                        <div className="text-xl font-bold text-emerald-400">Mock Data</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Status</div>
                        <div className="text-sm font-bold text-blue-400">Active</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
