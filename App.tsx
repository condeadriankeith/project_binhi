import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { X, LogOut, Map as MapIcon, ChevronLeft, ChevronRight, Activity, ChevronDown, ChevronUp, User as UserIcon, Settings as SettingsIcon } from 'lucide-react';
import { IslandScene } from './components/IslandScene';
import { HUD } from './components/HUD';
import { BotanistKit } from './components/BotantistKit';
import { CommunityImpact } from './components/CommunityImpact';
import { ImpactMap } from './components/ImpactMap';
import { Login } from './components/Login';
import { OrgDashboard } from './components/OrgDashboard';
import { ProfilePage } from './components/ProfilePage';
import { SettingsPage } from './components/SettingsPage';
import { PostUpdateModal } from './components/PostUpdateModal';
import { ORGANIZATIONS, INITIAL_BALANCE, TREE_SPECIES } from './constants';
import { TileData, ItemType, GameState, Organization, User, ImpactUpdate } from './types';

type View = 'island' | 'map' | 'dashboard';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('island');
  const [activeOrgIndex, setActiveOrgIndex] = useState(0);
  const [orgs, setOrgs] = useState<Organization[]>(ORGANIZATIONS);
  const [isHubCollapsed, setIsHubCollapsed] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPostUpdateModal, setShowPostUpdateModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('binhi_theme');
    return saved ? JSON.parse(saved) : false;
  });
  
  const [hapticsEnabled, setHapticsEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('binhi_haptics');
    return saved ? JSON.parse(saved) : true;
  });
  
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('binhi_notifications');
    return saved ? JSON.parse(saved) : true;
  });

  const [isSceneReady, setIsSceneReady] = useState(false);

  // Auto-login from session
  useEffect(() => {
    const savedSession = localStorage.getItem('binhi_session');
    if (savedSession) {
      setUser(JSON.parse(savedSession));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('binhi_theme', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('binhi_haptics', JSON.stringify(hapticsEnabled));
  }, [hapticsEnabled]);

  useEffect(() => {
    localStorage.setItem('binhi_notifications', JSON.stringify(notificationsEnabled));
  }, [notificationsEnabled]);
  
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('binhi_game_state');
    return saved ? JSON.parse(saved) : {
      balance: INITIAL_BALANCE,
      level: 1,
      showCommunity: false,
    };
  });

  useEffect(() => {
    localStorage.setItem('binhi_game_state', JSON.stringify({
      ...gameState,
      showCommunity: false // Don't persist modal state
    }));
  }, [gameState]);

  // Load orgs from localStorage initially if available
  useEffect(() => {
    const savedOrgs = localStorage.getItem('binhi_orgs');
    if (savedOrgs) {
      setOrgs(JSON.parse(savedOrgs));
    }
  }, []);

  // Save orgs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('binhi_orgs', JSON.stringify(orgs));
  }, [orgs]);

  const [selectedTree, setSelectedTree] = useState<ItemType | null>(null);

  // Real-time Sync across browser instances
  useEffect(() => {
    const channel = new BroadcastChannel('binhi_sync');
    channel.onmessage = (event) => {
      if (event.data.type === 'SYNC_ORGS') {
        setOrgs(prev => {
          if (JSON.stringify(prev) === JSON.stringify(event.data.payload)) return prev;
          return event.data.payload;
        });
      }
    };
    return () => channel.close();
  }, []);

  // Sync state changes to other instances
  useEffect(() => {
    const channel = new BroadcastChannel('binhi_sync');
    channel.postMessage({ type: 'SYNC_ORGS', payload: orgs });
    return () => channel.close();
  }, [orgs]);

  // Fix for IslandScene loading bug - more robust initialization
  useEffect(() => {
    if (user && currentView === 'island') {
      const handleReady = () => {
        setIsSceneReady(true);
        // Force a resize event to ensure Three.js canvas matches its container
        setTimeout(() => window.dispatchEvent(new Event('resize')), 50);
      };
      
      const timer = setTimeout(handleReady, 150);
      return () => clearTimeout(timer);
    } else {
      setIsSceneReady(false);
    }
  }, [user, currentView]);

  useEffect(() => {
    if (user) {
      if (user.role === 'organization') {
        setCurrentView('dashboard');
        const idx = orgs.findIndex(o => o.id === user.orgId);
        if (idx !== -1) setActiveOrgIndex(idx);
      } else {
        setCurrentView('island');
      }
    }
  }, [user, orgs]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('binhi_session');
    setUser(null);
  }, []);

  const activeOrg = orgs[activeOrgIndex];

  // Calculate current level based on total trees planted across all islands
  const totalTreesPlanted = useMemo(() => orgs.reduce((sum, org) => sum + org.totalTrees, 0), [orgs]);
  const currentLevel = useMemo(() => Math.floor(totalTreesPlanted / 5) + 1, [totalTreesPlanted]);

  useEffect(() => {
    if (gameState.level !== currentLevel) {
      setGameState(prev => ({ ...prev, level: currentLevel }));
    }
  }, [currentLevel, gameState.level]);

  const handleTileClick = useCallback((id: number) => {
    if (!selectedTree) return;

    const treeDef = TREE_SPECIES.find(t => t.id === selectedTree);
    if (!treeDef) return;

    if (gameState.balance < treeDef.price) {
      alert(`Insufficient funds for ${treeDef.name}. Protocol requires ₱${treeDef.price.toLocaleString()}.`);
      setSelectedTree(null);
      return;
    }

    setOrgs(prev => {
      const newOrgs = [...prev];
      const org = { ...newOrgs[activeOrgIndex] };
      const tiles = [...org.tiles];
      const idx = tiles.findIndex(t => t.id === id);
      
      if (tiles[idx].plantType) return prev;

      tiles[idx] = { ...tiles[idx], plantType: selectedTree, isPlanted: true };
      
      const newDonation = {
        id: Math.random().toString(36).substring(7),
        userName: user?.name || 'Individual Architect',
        treeType: selectedTree,
        treeName: treeDef.name,
        amount: treeDef.price,
        timestamp: new Date().toISOString()
      };

      org.tiles = tiles;
      org.totalTrees += 1;
      org.totalCo2 += treeDef.co2Factor;
      org.donations += treeDef.price;
      org.recentDonations = [newDonation, ...(org.recentDonations || [])].slice(0, 20);
      
      newOrgs[activeOrgIndex] = org;
      return newOrgs;
    });

    setGameState(prev => ({
      ...prev,
      balance: prev.balance - treeDef.price,
    }));

    setSelectedTree(null);
  }, [selectedTree, activeOrgIndex, gameState.balance, user]);

  const activeTreeData = useMemo(() => TREE_SPECIES.find(t => t.id === selectedTree), [selectedTree]);

  const handlePostUpdate = useCallback((update: ImpactUpdate) => {
    setOrgs(prev => {
      const newOrgs = [...prev];
      const org = { ...newOrgs[activeOrgIndex] };
      org.updates = [update, ...(org.updates || [])];
      newOrgs[activeOrgIndex] = org;
      return newOrgs;
    });
  }, [activeOrgIndex]);

  const nextOrg = () => setActiveOrgIndex((prev) => (prev + 1) % orgs.length);
  const prevOrg = () => setActiveOrgIndex((prev) => (prev - 1 + orgs.length) % orgs.length);

  if (!user) {
    return <Login onLogin={setUser} isDarkMode={isDarkMode} />;
  }

  return (
    <div className={`relative w-full h-screen overflow-hidden select-none font-sans transition-colors duration-500 ${isDarkMode ? 'bg-[#0B1120] text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {currentView === 'dashboard' && user.role === 'organization' ? (
        <OrgDashboard 
          org={activeOrg} 
          onManageIslands={() => setCurrentView('island')}
          onPostUpdate={() => setShowPostUpdateModal(true)}
          onLogout={() => setUser(null)}
          isDarkMode={isDarkMode}
          uniqueSupporters={Array.from(new Set(activeOrg.recentDonations?.map(d => d.userName) || [])).length + 2482} // Base + session
        />
      ) : currentView === 'island' ? (
        <>
          <div className={`transition-opacity duration-1000 ${isSceneReady ? 'opacity-100' : 'opacity-0'}`}>
            <IslandScene 
              tiles={activeOrg.tiles} 
              onTileClick={handleTileClick} 
              islandColor={activeOrg.islandColor}
              waterColor={activeOrg.waterColor}
              accentColor={activeOrg.accentColor}
              orgIndex={activeOrgIndex}
              isDarkMode={isDarkMode}
            />
          </div>
          
          <HUD 
            forestName={activeOrg.name}
            balance={gameState.balance}
            treesPlanted={activeOrg.totalTrees}
            totalCo2={activeOrg.totalCo2}
            onCommunityClick={() => setGameState(p => ({ ...p, showCommunity: true }))}
            onTopUp={() => setGameState(p => ({ ...p, balance: p.balance + 1000 }))}
            isDarkMode={isDarkMode}
            level={gameState.level}
          />

          {/* Organization Context Card with Integrated Switcher */}
          <div className="fixed top-40 md:top-44 left-4 md:left-8 z-30 pointer-events-none transition-all duration-500 animate-in fade-in slide-in-from-left-8 duration-1000 delay-700 fill-mode-both w-full max-w-[280px] md:max-w-[320px]">
            <div className={`backdrop-blur-2xl p-4 md:p-6 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] border pointer-events-auto flex flex-col gap-3 md:gap-4 group ${isDarkMode ? 'bg-slate-900/60 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
              
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-2 md:gap-3 cursor-pointer overflow-hidden" onClick={() => setIsHubCollapsed(!isHubCollapsed)}>
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl flex items-center justify-center text-lg md:text-xl shadow-inner shrink-0" style={{ backgroundColor: activeOrg.islandColor }}>
                      🌍
                  </div>
                  <div className="truncate">
                     <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500/70 block">Restoration Hub</span>
                     <h2 className="text-sm md:text-lg font-serif leading-tight truncate">{activeOrg.name}</h2>
                  </div>
                </div>
                <button 
                  onClick={() => setIsHubCollapsed(!isHubCollapsed)}
                  className={`p-1 md:p-2 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                >
                  {isHubCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                </button>
              </div>

              <div className={`grid transition-all duration-500 ease-in-out ${isHubCollapsed ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'}`}>
                <div className="overflow-hidden flex flex-col gap-3 md:gap-4">
                  <p className={`text-xs md:text-sm font-medium leading-relaxed italic line-clamp-2 md:line-clamp-none ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>"{activeOrg.mission}"</p>
                  
                  <div className={`flex items-center justify-between pt-3 md:pt-4 border-t ${isDarkMode ? 'border-slate-700/50' : 'border-slate-100'}`}>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{activeOrg.location}</span>
                    </div>
                    
                    {/* Switcher Controls */}
                    {user.role === 'individual' && (
                      <div className={`flex items-center gap-1 rounded-full p-0.5 md:p-1 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-100'}`}>
                        <button onClick={prevOrg} className="p-1 md:p-1.5 hover:bg-emerald-500/10 rounded-full transition-colors text-slate-400 hover:text-emerald-400 shadow-sm">
                          <ChevronLeft size={16} />
                        </button>
                        <button onClick={nextOrg} className="p-1 md:p-1.5 hover:bg-emerald-500/10 rounded-full transition-colors text-slate-400 hover:text-emerald-400 shadow-sm">
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <BotanistKit 
            balance={gameState.balance}
            selectedTool={selectedTree}
            onSelect={(type) => setSelectedTree(type === selectedTree ? null : type)}
            isDarkMode={isDarkMode}
            userLevel={gameState.level}
          />

          {/* Secondary Actions: Impact & Logout */}
          <div className="fixed top-24 md:top-32 right-4 md:right-8 z-30 flex flex-col items-end gap-2 md:gap-3 pointer-events-none animate-in fade-in slide-in-from-right-8 duration-1000 delay-700 fill-mode-both">
            {user.role === 'organization' ? (
              <button 
                onClick={() => setCurrentView('dashboard')}
                className={`pointer-events-auto backdrop-blur-xl p-2.5 md:p-5 rounded-xl md:rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-all flex items-center gap-2 md:gap-3 group border ${isDarkMode ? 'bg-slate-900/90 border-slate-700/50 hover:bg-slate-800' : 'bg-white/90 border-slate-200 hover:bg-slate-50'}`}
              >
                <div className="bg-emerald-500/20 p-1.5 md:p-2 rounded-lg md:rounded-xl group-hover:scale-110 transition-transform">
                  <Activity size={18} className="text-emerald-400" />
                </div>
                <div className="hidden md:flex flex-col items-start text-left">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-400/70">Return To</span>
                  <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Dashboard</span>
                </div>
              </button>
            ) : (
              <button 
                onClick={() => setCurrentView('map')}
                className={`pointer-events-auto backdrop-blur-xl p-2.5 md:p-5 rounded-xl md:rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-all flex items-center gap-2 md:gap-3 group border ${isDarkMode ? 'bg-slate-900/90 border-slate-700/50 hover:bg-slate-800' : 'bg-white/90 border-slate-200 hover:bg-slate-50'}`}
              >
                <div className="bg-emerald-500/20 p-1.5 md:p-2 rounded-lg md:rounded-xl group-hover:scale-110 transition-transform">
                  <MapIcon size={18} className="text-emerald-400" />
                </div>
                <div className="hidden md:flex flex-col items-start text-left">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-400/70">Restoration</span>
                  <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Local Impact</span>
                </div>
              </button>
            )}

            <button 
              onClick={handleLogout}
              className={`p-2.5 md:p-4 backdrop-blur-xl border rounded-xl md:rounded-2xl transition-all shadow-lg pointer-events-auto group ${isDarkMode ? 'bg-slate-900/60 border-slate-700/50 hover:bg-slate-800 text-slate-400 hover:text-red-400' : 'bg-white/80 border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-red-500'}`}
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </>
      ) : (
        <ImpactMap onBack={() => setCurrentView(user.role === 'organization' ? 'dashboard' : 'island')} isDarkMode={isDarkMode} />
      )}

      {/* Top Left Navigation: Profile & Settings */}
      {currentView !== 'map' && (
        <div className="fixed top-4 md:top-6 left-4 md:left-8 z-50 flex flex-col gap-2 md:gap-3">
        <button 
          onClick={() => setShowProfile(true)}
          className={`p-2.5 md:p-4 backdrop-blur-xl border rounded-xl md:rounded-2xl transition-all shadow-lg group ${isDarkMode ? 'bg-slate-900/60 border-slate-700/50 hover:bg-slate-800 text-slate-400 hover:text-emerald-400' : 'bg-white/80 border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-emerald-500'}`}
          title="Profile"
        >
          <UserIcon size={20} />
        </button>
        <button 
          onClick={() => setShowSettings(true)}
          className={`p-2.5 md:p-4 backdrop-blur-xl border rounded-xl md:rounded-2xl transition-all shadow-lg group ${isDarkMode ? 'bg-slate-900/60 border-slate-700/50 hover:bg-slate-800 text-slate-400 hover:text-blue-400' : 'bg-white/80 border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-blue-500'}`}
          title="Settings"
        >
          <SettingsIcon size={20} />
        </button>
      </div>
    )}



      {/* Modals */}
      {showProfile && user && (
        <ProfilePage user={user} onClose={() => setShowProfile(false)} isDarkMode={isDarkMode} />
      )}

      {showSettings && (
        <SettingsPage 
          onClose={() => setShowSettings(false)} 
          isDarkMode={isDarkMode} 
          onToggleTheme={() => setIsDarkMode(!isDarkMode)} 
          hapticsEnabled={hapticsEnabled}
          onToggleHaptics={() => setHapticsEnabled(!hapticsEnabled)}
          notificationsEnabled={notificationsEnabled}
          onToggleNotifications={() => setNotificationsEnabled(!notificationsEnabled)}
        />
      )}

      <CommunityImpact 
        isVisible={gameState.showCommunity}
        onClose={() => setGameState(p => ({ ...p, showCommunity: false }))}
        isDarkMode={isDarkMode}
        totalTrees={orgs.reduce((sum, o) => sum + o.totalTrees, 0) + 33600000} // Global base + session
        totalCo2={orgs.reduce((sum, o) => sum + o.totalCo2, 0) + 1800000000} // Global base + session
      />

      <PostUpdateModal
        isVisible={showPostUpdateModal}
        onClose={() => setShowPostUpdateModal(false)}
        onSubmit={handlePostUpdate}
        isDarkMode={isDarkMode}
      />



      {/* Planting Indicator */}
      {selectedTree && currentView === 'island' && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 backdrop-blur-xl px-6 py-3 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] border animate-in slide-in-from-top-4 fade-in duration-300 ${isDarkMode ? 'bg-slate-900/95 text-white border-emerald-500/30' : 'bg-white/95 text-slate-900 border-emerald-300'}`}>
          <div className="text-2xl animate-bounce">{activeTreeData?.icon}</div>
          <div className="flex flex-col">
            <span className={`text-[9px] uppercase font-black tracking-[0.2em] ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>Planting Protocol</span>
            <span className="text-sm font-bold">Select a tile on {activeOrg.name}</span>
          </div>
          <button 
            onClick={() => setSelectedTree(null)}
            className={`ml-4 p-2 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100 text-slate-500'}`}
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
