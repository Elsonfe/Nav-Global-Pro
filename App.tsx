
import React, { useState, useEffect, useCallback } from 'react';
import { LocationData } from './types';
import MapDisplay from './components/MapDisplay';
import WeatherPanel from './components/WeatherPanel';
import LoginScreen from './components/LoginScreen';
import SubscriptionScreen from './components/SubscriptionScreen';
import { getWeatherInfo, WeatherInfo } from './services/geminiService';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('nav_auth') === 'true');
  const [hasSubscription, setHasSubscription] = useState(() => localStorage.getItem('nav_sub') === 'true');
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem('nav_user') || '');

  const [location, setLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [isFetchingWeather, setIsFetchingWeather] = useState(false);

  const handleLogin = (email: string) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    localStorage.setItem('nav_auth', 'true');
    localStorage.setItem('nav_user', email);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setHasSubscription(false);
    localStorage.removeItem('nav_auth');
    localStorage.removeItem('nav_sub');
    localStorage.removeItem('nav_user');
  };

  const handleSubscriptionComplete = () => {
    setHasSubscription(true);
    localStorage.setItem('nav_sub', 'true');
  };

  const toDMS = (coord: number, isLat: boolean) => {
    const absolute = Math.abs(coord);
    const degrees = Math.floor(absolute);
    const minutesNotTruncated = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesNotTruncated);
    const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(1);
    const direction = isLat ? (coord >= 0 ? "N" : "S") : (coord >= 0 ? "E" : "W");
    return `${degrees}°${minutes}'${seconds}"${direction}`;
  };

  const handleFetchWeather = async () => {
    if (!location) return;
    setIsFetchingWeather(true);
    try {
      const data = await getWeatherInfo(location.latitude, location.longitude);
      setWeather(data);
    } catch (err) {
      console.error(err);
      alert("Erro ao buscar dados meteorológicos. Verifique a conexão.");
    } finally {
      setIsFetchingWeather(false);
    }
  };

  const updateLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Navegador sem suporte a GPS.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newData: LocationData = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          heading: pos.coords.heading,
          timestamp: pos.timestamp,
        };
        setLocation(newData);
        setError(null);
      },
      (err) => setError(`Erro GPS: ${err.message}`),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }, []);

  useEffect(() => {
    if (isLoggedIn && hasSubscription) {
      updateLocation();
      const intervalId = setInterval(updateLocation, 10000);
      return () => clearInterval(intervalId);
    }
  }, [updateLocation, isLoggedIn, hasSubscription]);

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (!hasSubscription) {
    return <SubscriptionScreen onComplete={handleSubscriptionComplete} />;
  }

  return (
    <div className="min-h-screen p-4 md:p-6 max-w-[1600px] mx-auto flex flex-col relative overflow-hidden">
      <header className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white tracking-tighter flex items-center gap-2">
            <span className="bg-emerald-600 text-white px-1.5 py-0.5 rounded italic">NAV</span>
            GLOBAL<span className="text-emerald-500">PRO</span>
          </h1>
          <p className="text-slate-500 text-[9px] mono uppercase tracking-widest font-bold">MONITORAMENTO DE FROTA FLUVIAL, MARITIMA E TERRESTRE VIA WI-FI</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col items-end mr-4">
            <span className="text-[8px] text-slate-500 mono uppercase">Operador Ativo</span>
            <span className="text-[10px] text-white mono font-bold">{userEmail}</span>
          </div>

          <button 
            onClick={handleFetchWeather}
            disabled={!location || isFetchingWeather}
            className="bg-slate-900 border border-slate-700 hover:border-emerald-500/50 hover:bg-slate-800 px-4 py-2 rounded-lg flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isFetchingWeather ? (
              <div className="w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="M20 12h2"></path><path d="m19.07 4.93-1.41 1.41"></path><path d="M15.947 12.65a4 4 0 0 0-5.925-4.128"></path><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"></path></svg>
            )}
            <span className="text-[9px] font-bold mono text-emerald-400 uppercase tracking-wider">Previsão do Tempo</span>
          </button>

          <button 
            onClick={handleLogout}
            className="bg-slate-950 border border-red-900/30 hover:bg-red-950/20 px-3 py-2 rounded-lg transition-colors"
            title="Encerrar Sessão"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          </button>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-4 min-h-0">
        <div className="xl:col-span-3 flex flex-col gap-4 pr-1">
          {/* Painel de Coordenadas Compacto */}
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow-xl">
            <h2 className="text-[10px] font-bold text-slate-400 mono uppercase mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="22" y1="12" x2="18" y2="12"></line><line x1="6" y1="12" x2="2" y2="12"></line><line x1="12" y1="6" x2="12" y2="2"></line><line x1="12" y1="22" x2="12" y2="18"></line></svg>
              Telemetria Ativa
            </h2>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col gap-1">
                <span className="text-[7px] text-slate-500 mono font-bold uppercase tracking-wider">Lat</span>
                <span className="text-[11px] font-bold mono text-emerald-400 truncate">
                  {location ? toDMS(location.latitude, true) : '---'}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[7px] text-slate-500 mono font-bold uppercase tracking-wider">Lon</span>
                <span className="text-[11px] font-bold mono text-emerald-400 truncate">
                  {location ? toDMS(location.longitude, false) : '---'}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[7px] text-slate-500 mono font-bold uppercase tracking-wider">Prec.</span>
                <span className="text-[11px] font-bold mono text-slate-300">
                  {location ? `${location.accuracy.toFixed(0)}m` : '---'}
                </span>
              </div>
            </div>
          </div>

          {/* Painel de Clima */}
          {weather && (
            <WeatherPanel weather={weather} onClose={() => setWeather(null)} />
          )}

          <div className="bg-slate-950/50 border border-slate-800/50 p-4 rounded-xl flex-1 flex flex-col justify-center items-center text-center">
            <div className="w-12 h-12 bg-emerald-950/20 rounded-full flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
            </div>
            <p className="text-[9px] text-slate-500 mono uppercase tracking-tight leading-relaxed">
              Sistema Global de Posicionamento e Meteorologia Avançada para frotas via WI-FI.
            </p>
          </div>
        </div>

        <div className="xl:col-span-9 h-full min-h-[450px]">
          {location ? (
            <MapDisplay 
              latitude={location.latitude} 
              longitude={location.longitude} 
              accuracy={location.accuracy} 
              onManualUpdate={updateLocation}
            />
          ) : (
            <div className="w-full h-full bg-slate-900 rounded-2xl flex flex-col items-center justify-center border border-slate-800">
              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-slate-500 mono text-[9px] uppercase tracking-[0.2em] animate-pulse">Sintonizando Satélites...</p>
              {error && <p className="mt-4 text-red-500/80 text-[8px] mono bg-red-950/20 px-3 py-1 rounded border border-red-900/30">{error}</p>}
            </div>
          )}
        </div>
      </main>

      <footer className="mt-4 pt-3 border-t border-slate-800/50 flex justify-between items-center text-[8px] text-slate-600 mono uppercase">
        <div className="flex items-center gap-4">
          <span>SISTEMA ATIVO • CICLO 10S</span>
          <span className="text-emerald-500/50">Cobertura: Global (Satélite)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-emerald-500/30">CONTA PREMIUM ATIVA</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
