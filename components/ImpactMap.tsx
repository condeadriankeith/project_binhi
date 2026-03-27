import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ArrowLeft, MapPin, Target, Play, Pause, Filter, Clock, Leaf } from 'lucide-react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { IMPACT_GEOJSON } from '../data/impactGeoData';

const UNIQUE_ORGS = Array.from(new Set(IMPACT_GEOJSON.features.map(f => f.properties.organization_name)));

export const ImpactMap: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
  const [currentYear, setCurrentYear] = useState(2026);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(10);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const updateMapFilters = (orgName: string | null) => {
    if (!map.current || !isMapLoaded) return;

    let filter: any[] = orgName ? ['==', ['get', 'organization_name'], orgName] : ['all'];

    try {
      if (map.current.getLayer('biomass-glow')) {
        map.current.setFilter('biomass-glow', filter as any);
      }
      if (map.current.getLayer('impact-polygons-fill')) {
        map.current.setFilter('impact-polygons-fill', filter as any);
      }
      if (map.current.getLayer('impact-polygons-line')) {
        map.current.setFilter('impact-polygons-line', filter as any);
      }
    } catch (e) {
      console.warn("Filter update failed:", e);
    }
  };

  // Initialize Map
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json',
      center: [123.1, 10.6], // Negros Island center
      zoom: 10,
      attributionControl: false
    });
    map.current.addControl(new maplibregl.AttributionControl({ compact: true }));

    popupRef.current = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: true,
      className: 'glass-popup'
    });

    map.current.on('load', () => {
      if (!map.current) return;
      setIsMapLoaded(true);
      
      map.current.resize();

      // Add Sources
      map.current.addSource('impact-data', {
        type: 'geojson',
        data: IMPACT_GEOJSON as any
      });

      // Add Heatmap Layer
      map.current.addLayer({
        id: 'biomass-glow',
        type: 'heatmap',
        source: 'impact-data',
        paint: {
          'heatmap-weight': ['interpolate', ['linear'], ['get', 'area_ha'], 1, 0, 100, 1],
          'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 8, 1, 15, 3],
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(32, 214, 155, 0)',      
            0.2, 'rgba(15, 23, 42, 0.5)',    
            0.5, 'rgba(13, 148, 136, 0.8)',  
            0.8, 'rgba(32, 214, 155, 0.9)',  
            1, 'rgba(167, 253, 235, 1)'      
          ],
          'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 8, 10, 15, 40],
          'heatmap-opacity': 0.6
        }
      } as any);

      // Add Polygon Fill Layer
      map.current.addLayer({
        id: 'impact-polygons-fill',
        type: 'fill',
        source: 'impact-data',
        paint: {
          'fill-color': '#20d69b',
          'fill-opacity': 0.3
        }
      });

      // Add Polygon Line Layer
      map.current.addLayer({
        id: 'impact-polygons-line',
        type: 'line',
        source: 'impact-data',
        paint: {
          'line-color': '#20d69b',
          'line-width': 2
        }
      });

      updateMapFilters(selectedOrg);
    });

    map.current.on('click', 'impact-polygons-fill', (e) => {
      if (e.features && e.features[0] && map.current) {
        const props = e.features[0].properties;
        const orgName = props?.organization_name;
        const treesPlanted = props?.trees_planted;
        const areaHa = props?.area_ha;
        
        const coordinates = e.lngLat;
        
        const popupHtml = `
          <div class="bg-[#0b1120]/95 backdrop-blur-md p-4 rounded-2xl border border-[#20d69b]/30 text-white shadow-xl min-w-[200px]">
            <h4 class="text-sm font-black uppercase tracking-widest text-[#20d69b] mb-2">${orgName || 'Unknown Site'}</h4>
            <div class="flex justify-between items-center mb-1">
              <span class="text-xs text-slate-400">Trees Planted</span>
              <span class="text-sm font-bold text-white">${treesPlanted ? treesPlanted.toLocaleString() : 'N/A'}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs text-slate-400">Area Covered</span>
              <span class="text-sm font-bold text-white">${areaHa ? areaHa.toLocaleString() : 'N/A'} ha</span>
            </div>
          </div>
        `;

        if (popupRef.current) {
           popupRef.current.setLngLat(coordinates)
             .setHTML(popupHtml)
             .addTo(map.current);
        }
        
        if (orgName) {
          setSelectedOrg(orgName);
        }
      }
    });

    map.current.on('mouseenter', 'impact-polygons-fill', () => {
      if (map.current) map.current.getCanvas().style.cursor = 'pointer';
    });

    map.current.on('mouseleave', 'impact-polygons-fill', () => {
      if (map.current) map.current.getCanvas().style.cursor = '';
    });

    map.current.on('zoom', () => {
      if (map.current) setZoomLevel(map.current.getZoom());
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    updateMapFilters(selectedOrg);
  }, [selectedOrg, isMapLoaded]);

  // Time-lapse playback
  useEffect(() => {
    let timer: number;
    if (isPlaying) {
      timer = window.setInterval(() => {
        setCurrentYear(prev => {
          if (prev >= 2026) return 2024;
          return prev + 1;
        });
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const zoomToOrg = (orgName: string) => {
    if (!map.current || !isMapLoaded) return;
    const feature = IMPACT_GEOJSON.features.find(f => f.properties.organization_name === orgName);
    if (feature) {
      const coords = feature.geometry.coordinates[0][0];
      map.current.flyTo({
        center: [coords[0], coords[1]],
        zoom: 11,
        essential: true,
        duration: 3000
      });
      setSelectedOrg(orgName);
      if (popupRef.current) {
        popupRef.current.remove();
      }
    }
  };

  const selectedFeatureProps = useMemo(() => {
    if (!selectedOrg) return null;
    const feature = IMPACT_GEOJSON.features.find(f => f.properties.organization_name === selectedOrg);
    return feature?.properties;
  }, [selectedOrg]);

  return (
    <div className="fixed inset-0 z-50 bg-[#0B1120] flex flex-col text-white animate-in fade-in duration-500 font-sans overflow-hidden">
      {/* 1. Full-Screen Background Layout */}
      <div className="absolute inset-0 z-0 w-[100vw] h-[100vh] bg-[#0b1120]">
        <div 
          ref={mapContainer} 
          className="absolute inset-0 w-full h-full opacity-80 mix-blend-screen" 
        />
        {/* Fading Effect */}
        <div className="absolute bottom-0 left-0 right-0 h-48 md:h-64 bg-gradient-to-t from-[#0b1120] via-[#0b1120]/80 to-transparent pointer-events-none z-10" />
      </div>
      
      {/* Ensure UI sits on top of the map layer */}
      <div className="relative z-20 flex-1 flex flex-col pointer-events-none">
        <div className="w-full p-6 md:p-10 flex justify-between items-start z-30">
          <button 
            type="button"
            onClick={onBack}
            className="pointer-events-auto bg-[#0b1120]/80 backdrop-blur-xl border border-slate-700 p-3 md:p-4 rounded-2xl hover:bg-slate-800 transition-all flex items-center gap-3 shadow-2xl group"
          >
            <ArrowLeft size={18} className="text-[#20d69b] group-hover:-translate-x-1 transition-transform" />
            <span className="hidden md:inline text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Return to Axis</span>
          </button>

          <div className="text-right pointer-events-auto flex flex-col items-end">
            <div className="flex items-center gap-2 text-[10px] font-black text-[#20d69b] uppercase tracking-[0.4em] mb-2 bg-[#0b1120]/50 backdrop-blur-md px-3 py-1 rounded-full border border-[#20d69b]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#20d69b] animate-pulse"></span>
              Live Impact Satellite (OSS)
            </div>
            <h2 className="text-2xl md:text-5xl font-serif tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">Local Impact</h2>
          </div>
        </div>

        {/* Floating Controls Sidebar - z-50 */}
        <div className="absolute left-6 md:left-10 top-32 md:top-40 flex flex-col gap-4 pointer-events-auto max-w-[240px] z-50">
          <div className="bg-[#0b1120]/80 backdrop-blur-2xl p-5 rounded-3xl border border-slate-700/50 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-[0.2em] text-[#20d69b]/70">
              <div className="flex items-center gap-2">
                <Filter size={12} />
                Forest Hubs
              </div>
              {selectedOrg && (
                <button 
                  onClick={() => setSelectedOrg(null)}
                  className="text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {UNIQUE_ORGS.map(orgName => (
                <button 
                  key={orgName}
                  type="button"
                  onClick={() => zoomToOrg(orgName as string)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-[11px] font-bold transition-all text-left leading-tight ${selectedOrg === orgName ? 'bg-[#20d69b]/20 text-white border border-[#20d69b]/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                >
                  <MapPin size={14} className={selectedOrg === orgName ? 'text-[#20d69b]' : 'text-slate-500'} />
                  {orgName}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline Slider / Bottom Dock - z-50 */}
        <div className="mt-auto mx-auto w-full max-w-[800px] px-6 pb-10 pointer-events-auto z-50">
          <div className="bg-[#0b1120]/90 backdrop-blur-3xl p-6 rounded-[2.5rem] border border-slate-700/50 shadow-[0_30px_60px_rgba(0,0,0,0.5)] flex items-center gap-6">
            <button 
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-14 h-14 rounded-2xl bg-[#20d69b] flex items-center justify-center text-[#0b1120] hover:scale-105 transition-transform shadow-[0_0_20px_rgba(32,214,155,0.3)] shrink-0"
            >
              {isPlaying ? <Pause fill="currentColor" size={24} /> : <Play fill="currentColor" size={24} className="ml-1" />}
            </button>
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex justify-between items-center px-1">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#20d69b] flex items-center gap-2">
                   <Clock size={12} /> Time Propagation
                </span>
                <span className="text-xl font-serif italic text-white">{currentYear}</span>
              </div>
              <input 
                type="range" min="2024" max="2026" step="1"
                value={currentYear}
                onChange={(e) => setCurrentYear(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #20d69b ${(currentYear - 2024) / 2 * 100}%, #1e293b ${(currentYear - 2024) / 2 * 100}%)`
                }}
              />
              <div className="flex justify-between text-[10px] font-bold text-slate-500 px-1">
                <span>2024</span>
                <span>2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Org Side Info Card - z-40 */}
      {selectedFeatureProps && (
        <div className="absolute right-6 md:right-10 top-32 md:top-40 bottom-44 w-full max-w-[320px] md:max-w-[360px] bg-[#0b1120]/95 backdrop-blur-3xl border border-slate-700 p-8 rounded-[3rem] shadow-2xl z-40 flex flex-col animate-in slide-in-from-right-full duration-500 group pointer-events-auto">
          <button type="button" onClick={() => setSelectedOrg(null)} className="absolute top-6 right-6 p-3 hover:bg-slate-800 rounded-2xl text-slate-400 hover:text-white transition-colors">
            <Target size={20} className="rotate-45" />
          </button>
          
          <div className="flex items-center gap-4 mb-8">
             <div className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center bg-slate-800 border-2 border-slate-700 shadow-inner group-hover:scale-110 transition-transform duration-500 shrink-0">
               <Leaf size={32} className="text-[#20d69b]" />
             </div>
             <div>
               <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-[#20d69b] mb-1">
                 <MapPin size={12} /> Selected Scope
               </div>
               <h3 className="text-lg font-serif text-white tracking-tight leading-tight">{selectedFeatureProps.organization_name}</h3>
             </div>
          </div>
          
          <div className="space-y-4 flex-1">
            <div className="bg-slate-800/50 p-5 rounded-3xl border border-slate-700/50 shadow-inner flex flex-col items-center justify-center py-8">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-2 text-center">Trees Planted</span>
              <span className="text-4xl font-bold text-[#20d69b] font-serif">{selectedFeatureProps.trees_planted.toLocaleString()}</span>
            </div>
            <div className="bg-slate-800/50 p-5 rounded-3xl border border-slate-700/50 shadow-inner flex flex-col items-center justify-center py-8">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-2 text-center">Land Coverage (HA)</span>
              <span className="text-4xl font-bold text-white font-serif">{selectedFeatureProps.area_ha.toLocaleString()}</span>
            </div>
          </div>
          
        </div>
      )}

      <style>{`
        .maplibregl-ctrl-bottom-right, .maplibregl-ctrl-bottom-left { display: none !important; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; height: 16px; width: 16px; border-radius: 4px; background: #20d69b; cursor: pointer; border: 2px solid #000; box-shadow: 0 0 10px rgba(32,214,155,0.5); }
        .maplibregl-canvas { outline: none !important; }
        .glass-popup .maplibregl-popup-content { background: transparent; padding: 0; box-shadow: none; border-radius: 1rem; }
        .glass-popup .maplibregl-popup-tip { border-top-color: rgba(15, 23, 42, 0.9); }
      `}</style>
    </div>
  );
};
