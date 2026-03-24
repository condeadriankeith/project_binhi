
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { X, LogOut, Map as MapIcon, ChevronLeft, ChevronRight, Activity, ChevronDown, ChevronUp } from 'lucide-react';
import { IslandScene } from './components/IslandScene';
import { HUD } from './components/HUD';
import { BotanistKit } from './components/BotantistKit';
import { CommunityImpact } from './components/CommunityImpact';
import { EcoAssistant } from './components/EcoAssistant';
import { ImpactMap } from './components/ImpactMap';
import { Login } from './components/Login';
import { ORGANIZATIONS, INITIAL_BALANCE, TREE_SPECIES } from './constants';
import { TileData, ItemType, GameState, Organization } from './types';

type View = 'island' | 'map';

const App: React.FC = () => {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [currentView, setCurrentView] = useState<View>('island');
  const [activeOrgIndex, setActiveOrgIndex] = useState(0);
  const [orgs, setOrgs] = useState<Organization[]>(ORGANIZATIONS);
  const [isHubCollapsed, setIsHubCollapsed] = useState(false);
  
  const [gameState, setGameState] = useState<GameState>({
    balance: INITIAL_BALANCE,
    level: 1,
    showCommunity: false,
    isVaultOpen: false,
    showAssistant: false,
  });

  const [selectedTree, setSelectedTree] = useState<ItemType | null>(null);

  const activeOrg = orgs[activeOrgIndex];

  const handleTileClick = useCallback((id: number) => {
    if (!selectedTree) return;

    const treeDef = TREE_SPECIES.find(t => t.id === selectedTree);
    if (!treeDef || gameState.balance < treeDef.price) return;

    setOrgs(prev => {
      const newOrgs = [...prev];
      const org = { ...newOrgs[activeOrgIndex] };
      const tiles = [...org.tiles];
      const idx = tiles.findIndex(t => t.id === id);
      
      if (tiles[idx].plantType) return prev;

      tiles[idx] = { ...tiles[idx], plantType: selectedTree, isPlanted: true };
      org.tiles = tiles;
      org.totalTrees += 1;
      org.totalCo2 += treeDef.co2Factor;
      
      newOrgs[activeOrgIndex] = org;
      return newOrgs;
    });

    setGameState(prev => ({
      ...prev,
      balance: prev.balance - treeDef.price,
    }));

    setSelectedTree(null);
  }, [selectedTree, activeOrgIndex, gameState.balance]);

  const activeTreeData = useMemo(() => TREE_SPECIES.find(t => t.id === selectedTree), [selectedTree]);

  const nextOrg = () => setActiveOrgIndex((prev) => (prev + 1) % orgs.length);
  const prevOrg = () => setActiveOrgIndex((prev) => (prev - 1 + orgs.length) % orgs.length);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div key={currentView} className="relative w-full h-screen bg-[#0B1120] overflow-hidden select-none font-sans">
      {currentView === 'island' ? (
        <>
          <IslandScene 
            tiles={activeOrg.tiles} 
            onTileClick={handleTileClick} 
            islandColor={activeOrg.islandColor}
            waterColor={activeOrg.waterColor}
            accentColor={activeOrg.accentColor}
            orgIndex={activeOrgIndex}
          />
          
          <HUD 
            forestName={activeOrg.name}
            balance={gameState.balance}
            treesPlanted={activeOrg.totalTrees}
            totalCo2={activeOrg.totalCo2}
            onCommunityClick={() => setGameState(p => ({ ...p, showCommunity: true }))}
            onAssistantClick={() => setGameState(p => ({ ...p, showAssistant: true }))}
          />

          {/* Organization Context Card with Integrated Switcher */}
          <div className="fixed top-40 md:top-44 left-4 md:left-8 z-30 pointer-events-none transition-all duration-500 animate-in fade-in slide-in-from-left-8 duration-1000 delay-700 fill-mode-both w-full max-w-[280px] md:max-w-[320px]">
            <div className="bg-slate-900/60 backdrop-blur-2xl p-4 md:p-6 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] border border-slate-700/50 pointer-events-auto flex flex-col gap-3 md:gap-4 group">
              
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 md:gap-3 cursor-pointer" onClick={() => setIsHubCollapsed(!isHubCollapsed)}>
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl flex items-center justify-center text-lg md:text-xl shadow-inner" style={{ backgroundColor: activeOrg.islandColor }}>
                      🌍
                  </div>
                  <div>
                     <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400/70">Restoration Hub</span>
                     <h2 className="text-base md:text-lg font-serif text-white leading-tight">{activeOrg.name}</h2>
                  </div>
                </div>
                <button 
                  onClick={() => setIsHubCollapsed(!isHubCollapsed)}
                  className="p-1 md:p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-400"
                >
                  {isHubCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                </button>
              </div>

              <div className={`grid transition-all duration-500 ease-in-out ${isHubCollapsed ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'}`}>
                <div className="overflow-hidden flex flex-col gap-3 md:gap-4">
                  <p className="text-xs md:text-sm text-slate-300 font-medium leading-relaxed italic line-clamp-2 md:line-clamp-none">"{activeOrg.mission}"</p>
                  
                  <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-slate-700/50">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">{activeOrg.location}</span>
                    </div>
                    
                    {/* Switcher Controls */}
                    <div className="flex items-center gap-1 bg-slate-800/50 rounded-full p-0.5 md:p-1">
                      <button onClick={prevOrg} className="p-1 md:p-1.5 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-emerald-400 shadow-sm">
                        <ChevronLeft size={16} />
                      </button>
                      <button onClick={nextOrg} className="p-1 md:p-1.5 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-emerald-400 shadow-sm">
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <BotanistKit 
            balance={gameState.balance}
            selectedTool={selectedTree}
            onSelect={(type) => setSelectedTree(type === selectedTree ? null : type)}
          />

          {/* Global Impact Button - Moved to top right below HUD */}
          <button 
            onClick={() => setCurrentView('map')}
            className="fixed top-24 md:top-32 right-4 md:right-8 z-30 pointer-events-auto bg-slate-900/90 backdrop-blur-xl p-3 md:p-5 rounded-2xl md:rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:bg-slate-800 transition-all flex items-center gap-3 group border border-slate-700/50 animate-in fade-in slide-in-from-right-8 duration-1000 delay-700 fill-mode-both"
          >
            <div className="bg-emerald-500/20 p-2 rounded-xl group-hover:scale-110 transition-transform">
              <MapIcon size={20} className="text-emerald-400" />
            </div>
            <div className="hidden md:flex flex-col items-start text-left">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-400/70">Network</span>
              <span className="text-sm font-bold text-white">Global Impact</span>
            </div>
          </button>
        </>
      ) : (
        <ImpactMap onBack={() => setCurrentView('island')} />
      )}

      {/* Logout Button */}
      <button 
        onClick={() => setUser(null)}
        className="fixed bottom-6 right-4 md:right-8 z-50 p-3 md:p-4 bg-slate-900/60 backdrop-blur-xl hover:bg-slate-800 text-slate-400 hover:text-red-400 rounded-2xl transition-all shadow-lg border border-slate-700/50"
        title="Logout"
      >
        <LogOut size={18} />
      </button>

      <CommunityImpact 
        isVisible={gameState.showCommunity}
        onClose={() => setGameState(p => ({ ...p, showCommunity: false }))}
      />

      {gameState.showAssistant && (
        <EcoAssistant 
          tiles={activeOrg.tiles}
          onClose={() => setGameState(p => ({ ...p, showAssistant: false }))}
        />
      )}

      {/* Planting Indicator */}
      {selectedTree && currentView === 'island' && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-slate-900/95 backdrop-blur-xl text-white px-6 py-3 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] border border-emerald-500/30 animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="text-2xl animate-bounce">{activeTreeData?.icon}</div>
          <div className="flex flex-col">
            <span className="text-[9px] uppercase font-black text-emerald-400 tracking-[0.2em]">Planting Protocol</span>
            <span className="text-sm font-bold">Select a tile on {activeOrg.name}</span>
          </div>
          <button 
            onClick={() => setSelectedTree(null)}
            className="ml-4 p-2 hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
