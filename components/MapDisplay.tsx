
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

interface MapDisplayProps {
  latitude: number;
  longitude: number;
  accuracy: number;
  onManualUpdate?: () => void;
}

type MapType = 'satellite' | 'streets';

const MapDisplay: React.FC<MapDisplayProps> = ({ latitude, longitude, accuracy, onManualUpdate }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markerRef = useRef<L.Circle | null>(null);
  const boatMarkerRef = useRef<L.Marker | null>(null);
  
  const [mapType, setMapType] = useState<MapType>('satellite');

  const tileUrls = {
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    streets: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  };

  useEffect(() => {
    if (mapInstanceRef.current && tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
      tileLayerRef.current = L.tileLayer(tileUrls[mapType], {
        attribution: mapType === 'satellite' ? 'Tiles &copy; Esri' : '&copy; OpenStreetMap'
      }).addTo(mapInstanceRef.current);
    }
  }, [mapType]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapContainerRef.current, {
        center: [latitude, longitude],
        zoom: 15,
        zoomControl: false,
        maxZoom: 20
      });

      tileLayerRef.current = L.tileLayer(tileUrls[mapType]).addTo(mapInstanceRef.current);

      markerRef.current = L.circle([latitude, longitude], {
        radius: accuracy,
        color: '#34d399',
        fillColor: '#34d399',
        fillOpacity: 0.15,
        weight: 1
      }).addTo(mapInstanceRef.current);

      const boatIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="w-5 h-5 bg-emerald-500 rounded-full border-2 border-white shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-pulse"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      boatMarkerRef.current = L.marker([latitude, longitude], { icon: boatIcon }).addTo(mapInstanceRef.current);
    } else {
      mapInstanceRef.current.setView([latitude, longitude]);
      
      if (markerRef.current) {
        markerRef.current.setLatLng([latitude, longitude]);
        markerRef.current.setRadius(accuracy);
      }
      
      if (boatMarkerRef.current) {
        boatMarkerRef.current.setLatLng([latitude, longitude]);
      }
    }
  }, [latitude, longitude, accuracy]);

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([latitude, longitude], 17);
    }
    if (onManualUpdate) onManualUpdate();
  };

  const toggleMapType = () => setMapType(prev => prev === 'satellite' ? 'streets' : 'satellite');

  return (
    <div className="w-full h-full relative group">
      <div ref={mapContainerRef} className="w-full h-full rounded-2xl border-2 border-emerald-900/30 shadow-2xl overflow-hidden" />
      
      <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2 pointer-events-none">
        <div className="bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] mono text-emerald-400 border border-emerald-500/30">
          OPERADOR GPS
        </div>
      </div>
      
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-3">
        <button 
          onClick={handleRecenter}
          className="bg-emerald-600 hover:bg-emerald-500 text-white w-12 h-12 rounded-full shadow-lg border-2 border-emerald-400/50 flex items-center justify-center transition-all active:scale-95"
          title="Minha Localização"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M12 2v3M12 19v3M2 12h3M19 12h3"></path><circle cx="12" cy="12" r="9" strokeOpacity="0.5"></circle></svg>
        </button>

        <button 
          onClick={toggleMapType}
          className="bg-slate-900/95 hover:bg-slate-800 text-white w-12 h-12 rounded-full shadow-lg border-2 border-slate-700 flex items-center justify-center transition-all active:scale-95"
        >
          {mapType === 'satellite' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 10a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-6a2 2 0 0 0-2 2Z"></path><path d="m10 8 2-2 2 2"></path><path d="M12 6V2"></path></svg>
          )}
        </button>
      </div>

      <div className="absolute bottom-4 right-4 z-[1000] flex flex-col gap-2">
        <button onClick={() => mapInstanceRef.current?.zoomIn()} className="bg-slate-900/90 text-white w-10 h-10 rounded-xl border border-slate-700 hover:bg-slate-800 flex items-center justify-center font-bold">+</button>
        <button onClick={() => mapInstanceRef.current?.zoomOut()} className="bg-slate-900/90 text-white w-10 h-10 rounded-xl border border-slate-700 hover:bg-slate-800 flex items-center justify-center font-bold">-</button>
      </div>
    </div>
  );
};

export default MapDisplay;
