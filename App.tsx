import React, { useState, useCallback, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { X, LogOut, Map as MapIcon, ChevronLeft, ChevronRight, Activity, ChevronDown, ChevronUp, User as UserIcon, Settings as SettingsIcon, Droplet } from 'lucide-react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { IslandScene } from './components/IslandScene';
import { HUD } from './components/HUD';
import { BotanistKit } from './components/BotantistKit';
import { PaymentGatewayModal } from './components/PaymentGatewayModal';
import { CommunityImpact } from './components/CommunityImpact';
import { ImpactMap } from './components/ImpactMap';
import { Login } from './components/Login';
import { OrgDashboard } from './components/OrgDashboard';
import { ProfilePage } from './components/ProfilePage';
import { SettingsPage } from './components/SettingsPage';
import { PostUpdateModal } from './components/PostUpdateModal';
import { ExpandingIconButton } from './components/ExpandingIconButton';
import { ORGANIZATIONS, INITIAL_BALANCE, TREE_SPECIES, generateTiles } from './constants';
import { TileData, ItemType, GameState, Organization, User, ImpactUpdate, GrowthStage } from './types';

type View = 'island' | 'map' | 'dashboard';

const App: React.FC = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('island');
  const [activeOrgIndex, setActiveOrgIndex] = useState(0);
  const [orgs, setOrgs] = useState<Organization[]>(ORGANIZATIONS);
  const [isHubCollapsed, setIsHubCollapsed] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [showPostUpdateModal, setShowPostUpdateModal] = useState(false);
  const [isWateringMode, setIsWateringMode] = useState(false);
  const [activeUI, setActiveUI] = useState<'none' | 'seedVault' | 'hudOrg' | 'hudStats' | 'hudFunds' | 'language'>('none');
  const [focusedIslandIndex, setFocusedIslandIndex] = useState(0);
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
    if (user) {
      const savedUsers = localStorage.getItem('binhi_users');
      if (savedUsers) {
        const users: User[] = JSON.parse(savedUsers);
        const updatedUsers = users.map(u => u.email === user.email ? user : u);
        localStorage.setItem('binhi_users', JSON.stringify(updatedUsers));
        localStorage.setItem('binhi_session', JSON.stringify(user));
      }
    }
  }, [user]);

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

  const toggleWateringMode = useCallback(() => {
    setIsWateringMode(prev => {
      if (!prev) setSelectedTree(null); // Ensure planting mode is off
      return !prev;
    });
  }, []);

  const handleSelectTree = useCallback((type: ItemType | null) => {
    setSelectedTree(type);
    if (type) setIsWateringMode(false); // Ensure watering mode is off
  }, []);

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
      // Reset modals on login
      setShowProfile(false);
      setShowSettings(false);
      
      if (user.role === 'organization') {
        setCurrentView('dashboard');
        const idx = orgs.findIndex(o => o.id === user.orgId);
        if (idx !== -1) setActiveOrgIndex(idx);
      } else {
        setCurrentView('island');
      }
    }
  }, [user]); // Removed orgs from dependency to avoid unnecessary resets

  const handleLogout = useCallback(() => {
    localStorage.removeItem('binhi_session');
    setUser(null);
    setShowProfile(false);
    setShowSettings(false);
  }, []);

  const totalUsers = useMemo(() => {
    const saved = localStorage.getItem('binhi_users');
    if (!saved) return 0;
    try {
      const users = JSON.parse(saved);
      return Array.isArray(users) ? users.length : 0;
    } catch {
      return 0;
    }
  }, [user]); // Recalculate when user state changes (registration/login)

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
    if (isWateringMode) {
      setOrgs(prev => {
        const newOrgs = [...prev];
        const org = { ...newOrgs[activeOrgIndex] };
        const tiles = [...org.tiles];
        const idx = tiles.findIndex(t => t.id === id);
        
        const tile = tiles[idx];
        if (!tile || !tile.isPlanted || !tile.growthStage || tile.growthStage >= 4) {
           return prev; // Nothing to water
        }

        // Ownership check
        if (tile.plantedBy && user && tile.plantedBy !== user.email) {
          return prev; 
        }

        const today = new Date().toISOString().split('T')[0];

        // Increment growth stage
        tiles[idx] = { ...tile, growthStage: (tile.growthStage + 1) as GrowthStage, lastWatered: new Date().toISOString() };
        org.tiles = tiles;
        newOrgs[activeOrgIndex] = org;

        // Gamification streak logic
        setUser(u => {
          if (!u) return u;
          
          const newHistory = { ...(u.wateringHistory || {}), [today]: true };
          const streak = (u.wateringStreak || 0) + 1; // Simplistic streak for demo
          const badges = u.badges ? [...u.badges] : [];
          if (streak >= 7 && !badges.includes('7-Day Streak')) badges.push('7-Day Streak');
          
          let rank = u.rank || 'Seedling';
          if (streak > 3) rank = 'Sprout';
          if (streak > 7) rank = 'Sapling';
          if (streak > 14) rank = 'Tree Planter';
          if (streak > 30) rank = 'Forest Guardian';

          return { ...u, wateringStreak: streak, badges, rank, wateringHistory: newHistory };
        });

        return newOrgs;
      });
      return;
    }

    if (!selectedTree) return;
    const treeDef = TREE_SPECIES.find(t => t.id === selectedTree);
    if (!treeDef || gameState.balance < treeDef.price) return;

    let islandCreated = false;
    let nextIslandIndex = 0;

    setOrgs(prev => {
      const newOrgs = [...prev];
      const org = { ...newOrgs[activeOrgIndex] };
      const tiles = [...org.tiles];
      const idx = tiles.findIndex(t => t.id === id);
      
      if (tiles[idx].plantType) return prev;

      tiles[idx] = { 
        ...tiles[idx], 
        plantType: selectedTree, 
        isPlanted: true, 
        growthStage: 1,
        plantedBy: user?.email 
      };
      
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
      
      const allPlanted = org.tiles.every(t => t.isPlanted);
      if (allPlanted) {
        islandCreated = true;
        nextIslandIndex = org.tiles.length / 25;
        
        // --- Smart 3D Placement with Collision Avoidance ---
        const centers: {x: number, y: number, z: number}[] = [];
        for (let i = 0; i < org.tiles.length; i += 25) {
          const chunk = org.tiles.slice(i, i + 25);
          const avgX = chunk.reduce((sum, t) => sum + t.x, 0) / 25;
          const avgZ = chunk.reduce((sum, t) => sum + t.z, 0) / 25;
          const avgY = (chunk[0] as any).y || 0;
          centers.push({ x: avgX, y: avgY, z: avgZ });
        }

        let offsetX = 0;
        let offsetZ = 0;
        let offsetY = 0;
        let isSafe = false;
        let attempts = 0;

        while (!isSafe && attempts < 50) {
          attempts++;
          const angle = Math.random() * Math.PI * 2;
          const dist = 12 + Math.random() * 10;
          offsetX = Math.cos(angle) * dist;
          offsetZ = Math.sin(angle) * dist;
          offsetY = (Math.random() - 0.5) * 8;

          isSafe = centers.every(c => {
            const d = Math.sqrt(
              Math.pow(c.x - offsetX, 2) + 
              Math.pow(c.y - offsetY, 2) + 
              Math.pow(c.z - offsetZ, 2)
            );
            return d > 12;
          });
        }

        const newTiles = generateTiles().map(t => ({
          ...t, 
          x: t.x + offsetX, 
          z: t.z + offsetZ,
          y: offsetY,
          id: t.id + (nextIslandIndex * 1000)
        }));
        
        org.tiles = [...org.tiles, ...newTiles];
        
        setUser(u => {
          if (u && !u.badges?.includes('Island Pioneer')) {
             return { ...u, badges: [...(u.badges||[]), 'Island Pioneer'] };
          }
          return u;
        });
      }

      newOrgs[activeOrgIndex] = org;
      return newOrgs;
    });

    setGameState(prev => {
      const newBalance = prev.balance - treeDef.price;
      if (newBalance < treeDef.price) setSelectedTree(null);
      return { ...prev, balance: newBalance };
    });

    if (islandCreated) {
      setFocusedIslandIndex(nextIslandIndex);
    }
  }, [selectedTree, activeOrgIndex, gameState.balance, user, isWateringMode, orgs]);

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

  const wateringStats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const owned = activeOrg.tiles.filter(t => t.isPlanted && t.plantedBy === user?.email);
    const wateredToday = owned.filter(t => t.lastWatered?.startsWith(today)).length;
    return {
      total: owned.length,
      watered: wateredToday
    };
  }, [activeOrg.tiles, user]);


  const nextOrg = () => setActiveOrgIndex((prev) => (prev + 1) % orgs.length);
  const prevOrg = () => setActiveOrgIndex((prev) => (prev - 1 + orgs.length) % orgs.length);

  if (!user) {
    return <Login onLogin={setUser} isDarkMode={isDarkMode} />;
  }

  return (
    <div className={`relative w-full h-screen overflow-hidden select-none font-sans transition-colors duration-500 ${isDarkMode ? 'bg-[#0B1120] text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {user.role === 'organization' && currentView === 'dashboard' ? (
        <OrgDashboard 
          org={activeOrg} 
          onManageIslands={() => setCurrentView('island')}
          onEnterLocalImpact={() => setCurrentView('map')}
          onPostUpdate={() => setShowPostUpdateModal(true)}
          onLogout={handleLogout}
          isDarkMode={isDarkMode}
          totalArchitects={totalUsers}
        />
      ) : (
        <LayoutGroup id="main-experience">
          <AnimatePresence mode="popLayout">
            {currentView === 'island' ? (
              <motion.div 
                key="island"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full h-full"
              >
                <div className={`transition-opacity duration-1000 ${isSceneReady ? 'opacity-100' : 'opacity-0'}`}>
                  <IslandScene 
                    orgs={orgs}
                    onTileClick={handleTileClick} 
                    activeOrgIndex={activeOrgIndex}
                    isDarkMode={isDarkMode}
                    focusedIslandIndex={focusedIslandIndex}
                    onIslandFocus={setFocusedIslandIndex}
                    isWateringMode={isWateringMode}
                    currentUserEmail={user?.email}
                  />
                </div>
                
                <HUD 
                  forestName={activeOrg.name}
                  balance={gameState.balance}
                  treesPlanted={activeOrg.totalTrees}
                  totalCo2={activeOrg.totalCo2}
                  onCommunityClick={() => setGameState(p => ({ ...p, showCommunity: true }))}
                  onTopUp={() => setShowPaymentGateway(true)}
                  onLocalImpactClick={user.role === 'individual' ? () => setCurrentView('map') : undefined}
                  onPrevOrg={user.role === 'individual' ? prevOrg : undefined}
                  onNextOrg={user.role === 'individual' ? nextOrg : undefined}
                  onToggleWatering={toggleWateringMode}
                  isWateringMode={isWateringMode}
                  isDarkMode={isDarkMode}
                  level={gameState.level}
                  activeUI={activeUI}
                  setActiveUI={setActiveUI}
                  user={user}
                  wateringStats={wateringStats}
                />

                {user.role === 'individual' && (
                  <BotanistKit 
                    balance={gameState.balance}
                    selectedTool={selectedTree}
                    onSelect={handleSelectTree}
                    isDarkMode={isDarkMode}
                    userLevel={gameState.level}
                    isActive={activeUI === 'seedVault'}
                    onToggle={() => setActiveUI(activeUI === 'seedVault' ? 'none' : 'seedVault')}
                    isHidden={activeUI === 'language'}
                  />
                )}

                {/* Watering Indicator */}
                {isWateringMode && (
                  <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 backdrop-blur-xl px-6 py-3 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] border animate-in slide-in-from-top-4 fade-in duration-300 ${isDarkMode ? 'bg-slate-900/95 text-white border-blue-500/30' : 'bg-white/95 text-slate-900 border-blue-300'}`}>
                    <div className="text-blue-500 animate-bounce"><Droplet size={24} /></div>
                    <div className="flex flex-col">
                      <span className={`text-[9px] uppercase font-black tracking-[0.2em] ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{t('watering_mode_active')}</span>
                      <span className="text-sm font-bold">{t('click_tree_to_water')}</span>
                    </div>
                    <button 
                      onClick={() => setIsWateringMode(false)}
                      className={`ml-4 p-2 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100 text-slate-500'}`}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </motion.div>
            ) : (
              <ImpactMap 
                key="map"
                onBack={() => setCurrentView(user.role === 'organization' ? 'dashboard' : 'island')} 
                isDarkMode={isDarkMode} 
              />
            )}
          </AnimatePresence>
        </LayoutGroup>
      )}

      {/* Top Left Navigation: Profile & Settings */}
      {currentView !== 'map' && (
        <LayoutGroup id="top-nav">
          <div className={`fixed top-4 md:top-6 left-4 md:left-8 z-50 flex flex-col gap-2 md:gap-3 transition-all duration-300 ${activeUI === 'seedVault' ? 'opacity-0 pointer-events-none translate-x-[-20px]' : 'opacity-100 translate-x-0'}`}>
            <ExpandingIconButton 
              icon={<UserIcon size={20} />} 
              label={t('profile')} 
              onClick={() => setShowProfile(true)} 
              isDarkMode={isDarkMode}
            />
            <ExpandingIconButton 
              icon={<SettingsIcon size={20} />} 
              label={t('settings')} 
              onClick={() => setShowSettings(true)} 
              isDarkMode={isDarkMode}
            />
            {user.role === 'organization' && currentView === 'island' && (
              <ExpandingIconButton 
                icon={<ChevronLeft size={20} />} 
                label={t('dashboard')} 
                onClick={() => setCurrentView('dashboard')} 
                isDarkMode={isDarkMode}
                className="animate-in slide-in-from-left-4 duration-500"
                activeClassName={isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}
              />
            )}
          </div>
        </LayoutGroup>
      )}



      {/* Modals */}
      <AnimatePresence>
        {showProfile && user && (
          <ProfilePage key="profile" user={user} onClose={() => setShowProfile(false)} onLogout={handleLogout} isDarkMode={isDarkMode} />
        )}
      </AnimatePresence>

      <AnimatePresence>
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
      </AnimatePresence>

      <CommunityImpact 
        isVisible={gameState.showCommunity}
        onClose={() => setGameState(p => ({ ...p, showCommunity: false }))}
        isDarkMode={isDarkMode}
        totalTrees={orgs.reduce((sum, o) => sum + o.totalTrees, 0) + 33600000}
        totalCo2={orgs.reduce((sum, o) => sum + o.totalCo2, 0) + 1800000000}
      />

      <PostUpdateModal
        isVisible={showPostUpdateModal}
        onClose={() => setShowPostUpdateModal(false)}
        onSubmit={handlePostUpdate}
        isDarkMode={isDarkMode}
      />

      <AnimatePresence>
        {showPaymentGateway && (
          <PaymentGatewayModal 
            onClose={() => setShowPaymentGateway(false)}
            onSuccess={(amount) => {
              setGameState(p => ({ ...p, balance: p.balance + amount }));
            }}
            isDarkMode={isDarkMode}
          />
        )}
      </AnimatePresence>

      {/* Planting Indicator */}
      {selectedTree && currentView === 'island' && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 backdrop-blur-xl px-6 py-3 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] border animate-in slide-in-from-top-4 fade-in duration-300 ${isDarkMode ? 'bg-slate-900/95 text-white border-emerald-500/30' : 'bg-white/95 text-slate-900 border-emerald-300'}`}>
          <div className="text-2xl animate-bounce">{activeTreeData?.icon}</div>
          <div className="flex flex-col">
            <span className={`text-[9px] uppercase font-black tracking-[0.2em] ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{t('planting_protocol')}</span>
            <span className="text-sm font-bold">{t('select_tile', { org: activeOrg.name })}</span>
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
