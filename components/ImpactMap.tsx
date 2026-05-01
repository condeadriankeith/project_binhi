import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, MapPin, Target, Play, Pause, Filter, Clock, Leaf } from 'lucide-react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { IMPACT_GEOJSON } from '../data/impactGeoData';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const UNIQUE_ORGS = Array.from(new Set(IMPACT_GEOJSON.features.map(f => f.properties.organization_name)));

export const ImpactMap: React.FC<{ onBack: () => void, isDarkMode?: boolean }> = ({ onBack, isDarkMode = false }) => {
  const { t } = useTranslation();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
  const [selectedFeatureProps, setSelectedFeatureProps] = useState<any>(null);
  const [currentYear, setCurrentYear] = useState(2026);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Sync Map Filters
  const updateMapFilters = (orgName: string | null, year: number) => {
    if (!map.current || !isMapLoaded) return;

    let orgFilter: any[] = orgName ? ['==', ['get', 'organization_name'], orgName] : ['all'];
    let yearFilter: any[] = ['<=', ['get', 'year'], year];
    const combinedFilter = ['all', orgFilter, yearFilter];

    try {
      if (map.current.getLayer('impact-polygons-fill')) {
        map.current.setFilter('impact-polygons-fill', combinedFilter as any);
      }
      if (map.current.getLayer('impact-polygons-line')) {
        map.current.setFilter('impact-polygons-line', combinedFilter as any);
      }
      if (map.current.getLayer('carbon-markers')) {
        map.current.setFilter('carbon-markers', combinedFilter as any);
      }
    } catch (e) {
      console.warn("Filter update failed:", e);
    }
  };

  // Zoom to Org
  const zoomToOrg = (orgName: string) => {
    if (!map.current) return;
    const features = IMPACT_GEOJSON.features.filter(f => f.properties.organization_name === orgName);
    if (features.length > 0) {
      const coords = (features[0].geometry as any).coordinates[0][0];
      map.current.flyTo({
        center: coords,
        zoom: 11,
        essential: true,
        duration: 3000
      });
      setSelectedOrg(orgName);
      setSelectedFeatureProps(features[0].properties);
    }
  };

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: isDarkMode ? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json' : 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [123.1, 10.6], 
      zoom: 10,
      attributionControl: false
    });

    map.current.on('load', () => {
      if (!map.current) return;
      setIsMapLoaded(true);

      map.current.addSource('impact-data', {
        type: 'geojson',
        data: IMPACT_GEOJSON as any
      });

      map.current.addLayer({
        id: 'impact-polygons-fill',
        type: 'fill',
        source: 'impact-data',
        paint: {
          'fill-color': isDarkMode ? '#10b981' : '#059669',
          'fill-opacity': 0.6
        }
      });

      map.current.addLayer({
        id: 'impact-polygons-line',
        type: 'line',
        source: 'impact-data',
        paint: {
          'line-color': isDarkMode ? '#34d399' : '#047857',
          'line-width': 4
        }
      });

      map.current.on('click', 'impact-polygons-fill', (e) => {
        if (e.features && e.features[0]) {
          const props = e.features[0].properties;
          setSelectedOrg(props?.organization_name);
          setSelectedFeatureProps(props);
        }
      });
    });

    return () => {
      if (map.current) map.current.remove();
    };
  }, [isDarkMode]);

  useEffect(() => {
    updateMapFilters(selectedOrg, currentYear);
  }, [selectedOrg, currentYear, isMapLoaded]);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentYear(prev => prev >= 2026 ? 2024 : prev + 1);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <motion.div 
      layoutId="map-card"
      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
      className={`fixed inset-0 z-50 flex flex-col font-sans overflow-hidden ${isDarkMode ? 'bg-[#0B1120] text-white' : 'bg-slate-50 text-slate-900'}`}
    >
      {/* Background Map Container */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
      </div>
      
      {/* UI Overlay */}
      <div className="relative z-20 flex-1 flex flex-col pointer-events-none">
        <div className="w-full p-6 md:p-10 flex justify-between items-start z-30">
          <button 
            type="button"
            onClick={onBack}
            className={`pointer-events-auto backdrop-blur-xl border p-3 md:p-4 rounded-2xl transition-all flex items-center gap-3 shadow-2xl group ${isDarkMode ? 'bg-[#0b1120]/80 border-slate-700 hover:bg-slate-800' : 'bg-white/80 border-slate-200 hover:bg-slate-100'}`}
          >
            <ArrowLeft size={18} className={`group-hover:-translate-x-1 transition-transform ${isDarkMode ? 'text-[#20d69b]' : 'text-emerald-600'}`} />
            <span className={`hidden md:inline text-[10px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-slate-300' : 'text-slate-500'}`}>{t('return_to_axis')}</span>
          </button>

          <div className="text-right pointer-events-auto flex flex-col items-end">
            <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] mb-2 backdrop-blur-md px-3 py-1 rounded-full border ${isDarkMode ? 'text-[#20d69b] bg-[#0b1120]/50 border-[#20d69b]/20' : 'text-emerald-600 bg-white/50 border-emerald-200'}`}>
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isDarkMode ? 'bg-[#20d69b]' : 'bg-emerald-500'}`}></span>
              {t('live_impact_satellite')}
            </div>
            <h2 className={`text-2xl md:text-5xl font-serif tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t('local_impact')}</h2>
          </div>
        </div>

        {/* Sidebar: Forest Hubs */}
        <div className="absolute left-6 md:left-10 top-32 md:top-40 flex flex-col gap-4 pointer-events-auto max-w-[240px] z-50">
          <div className={`backdrop-blur-2xl p-5 rounded-3xl border shadow-2xl flex flex-col gap-4 ${isDarkMode ? 'bg-[#0b1120]/80 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
            <div className={`flex items-center justify-between text-[9px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-[#20d69b]/70' : 'text-emerald-600/70'}`}>
              <div className="flex items-center gap-2">
                <Filter size={12} />
                {t('forest_hubs')}
              </div>
              {selectedOrg && (
                <button 
                  onClick={() => { setSelectedOrg(null); setSelectedFeatureProps(null); }}
                  className="hover:text-white"
                >
                  {t('clear')}
                </button>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {UNIQUE_ORGS.map(orgName => (
                <button 
                  key={orgName}
                  type="button"
                  onClick={() => zoomToOrg(orgName as string)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-[11px] font-bold transition-all text-left leading-tight ${selectedOrg === orgName ? (isDarkMode ? 'bg-[#20d69b]/20 text-white border border-[#20d69b]/30' : 'bg-emerald-100 text-emerald-900 border border-emerald-200') : (isDarkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-50')}`}
                >
                  <MapPin size={14} className={selectedOrg === orgName ? (isDarkMode ? 'text-[#20d69b]' : 'text-emerald-600') : 'text-slate-500'} />
                  {orgName}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline Slider */}
        <div className="mt-auto mx-auto w-full max-w-[800px] px-6 pb-10 pointer-events-auto z-50">
          <div className={`backdrop-blur-3xl p-6 rounded-[2.5rem] border shadow-[0_30px_60px_rgba(0,0,0,0.5)] flex items-center gap-6 ${isDarkMode ? 'bg-[#0b1120]/90 border-slate-700/50' : 'bg-white/90 border-slate-200'}`}>
            <button 
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center text-white hover:scale-105 transition-transform shrink-0"
            >
              {isPlaying ? <Pause fill="currentColor" size={24} /> : <Play fill="currentColor" size={24} className="ml-1" />}
            </button>
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex justify-between items-center px-1">
                <span className={`text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                   <Clock size={12} /> {t('time_propagation')}
                </span>
                <span className={`text-xl font-serif italic ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{currentYear}</span>
              </div>
              <input 
                type="range" min="2024" max="2026" step="1"
                value={currentYear}
                onChange={(e) => setCurrentYear(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer overflow-hidden"
                style={{
                  accentColor: '#10b981'
                }}
              />
              <div className={`flex justify-between text-[10px] font-bold px-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                <span>2024</span>
                <span>2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Org Info Card */}
      {selectedFeatureProps && (
        <div className={`absolute right-6 md:right-10 top-32 md:top-40 bottom-44 w-full max-w-[320px] md:max-w-[360px] backdrop-blur-3xl border p-8 rounded-[3rem] shadow-2xl z-40 flex flex-col animate-in slide-in-from-right-full duration-500 group pointer-events-auto ${isDarkMode ? 'bg-[#0b1120]/95 border-slate-700' : 'bg-white/95 border-slate-200'}`}>
          <button type="button" onClick={() => { setSelectedOrg(null); setSelectedFeatureProps(null); }} className={`absolute top-6 right-6 p-3 rounded-2xl transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'}`}>
            <Target size={20} className="rotate-45" />
          </button>
          
          <div className="flex items-center gap-4 mb-8">
             <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center border-2 shadow-inner group-hover:scale-110 transition-transform duration-500 shrink-0 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-emerald-50 border-emerald-100'}`}>
               <Leaf size={32} className="text-emerald-500" />
             </div>
             <div>
               <div className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest mb-1 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                 <MapPin size={12} /> {t('selected_scope')}
               </div>
               <h3 className={`text-lg font-serif tracking-tight leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedFeatureProps.organization_name}</h3>
             </div>
          </div>
          
          <div className="space-y-4 flex-1">
            <div className={`p-5 rounded-3xl border shadow-inner flex flex-col items-center justify-center py-8 ${isDarkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50 border-slate-100'}`}>
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] block mb-2 text-center ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{t('trees_planted_impact')}</span>
              <span className={`text-4xl font-bold font-serif ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{selectedFeatureProps.trees_planted.toLocaleString()}</span>
            </div>
            <div className={`p-5 rounded-3xl border shadow-inner flex flex-col items-center justify-center py-8 ${isDarkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50 border-slate-100'}`}>
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] block mb-2 text-center ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{t('land_coverage')}</span>
              <span className={`text-4xl font-bold font-serif ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedFeatureProps.area_ha.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .maplibregl-ctrl-bottom-right, .maplibregl-ctrl-bottom-left { display: none !important; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; height: 16px; width: 16px; border-radius: 4px; background: #10b981; cursor: pointer; border: 2px solid #fff; box-shadow: 0 0 10px rgba(16,185,129,0.5); }
        .maplibregl-canvas { outline: none !important; }
        .glass-popup .maplibregl-popup-content { background: transparent; padding: 0; box-shadow: none; border-radius: 1rem; }
      `}</style>
      </motion.div>
  );
};
