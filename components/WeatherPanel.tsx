
import React from 'react';
import { WeatherInfo } from '../services/geminiService';

interface WeatherPanelProps {
  weather: WeatherInfo;
  onClose: () => void;
}

const WeatherPanel: React.FC<WeatherPanelProps> = ({ weather, onClose }) => {
  return (
    <div className="bg-slate-900/98 border-2 border-emerald-500/40 rounded-2xl p-6 shadow-[0_0_50px_rgba(16,185,129,0.2)] animate-in slide-in-from-right-8 duration-500 max-h-[85vh] overflow-y-auto custom-scrollbar backdrop-blur-xl">
      <div className="flex justify-between items-center mb-6 border-b-2 border-emerald-500/20 pb-4 sticky top-0 bg-slate-900/98 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19a3.5 3.5 0 0 0 0-7h-1.5a7 7 0 1 0-11.91 4.91"></path><path d="M8.94 20.26a3.5 3.5 0 0 0 6.12 0"></path></svg>
          </div>
          <div>
            <h3 className="text-xs font-black mono text-emerald-400 uppercase tracking-[0.2em]">SISTEMA METAR V2.0</h3>
            <div className="text-xl font-bold text-white tracking-tight">{weather.locationName || 'Região Atual'}</div>
          </div>
        </div>
        <button onClick={onClose} className="bg-slate-800 hover:bg-red-500/20 p-2 rounded-full transition-all group">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:text-red-500"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      {/* Hero: Tempo Atual */}
      <div className="mb-8 relative overflow-hidden bg-gradient-to-br from-emerald-950/40 to-slate-950 p-6 rounded-2xl border border-emerald-500/30">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] text-emerald-500/70 mono font-black uppercase tracking-widest block mb-1">Temperatura Exterior</span>
            <span className="text-6xl font-black text-white mono tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              {weather.temp}
            </span>
            <div className="text-emerald-400 font-bold mt-2 uppercase text-sm mono tracking-wide">
              {weather.conditions}
            </div>
          </div>
          <div className="text-right">
             <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center animate-pulse border border-emerald-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.5"><path d="M12 2v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="M20 12h2"></path><path d="m19.07 4.93-1.41 1.41"></path><path d="M15.947 12.65a4 4 0 0 0-5.925-4.128"></path><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"></path></svg>
             </div>
          </div>
        </div>
      </div>

      {/* Grid de Métricas Secundárias */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-slate-950/80 p-4 rounded-xl border-l-4 border-l-blue-500 border border-slate-800 hover:border-blue-500/50 transition-all">
          <span className="text-[10px] text-slate-500 mono uppercase font-bold block mb-1 tracking-wider">Vento Real</span>
          <span className="text-2xl font-black text-blue-400 mono">{weather.windSpeed}</span>
        </div>
        <div className="bg-slate-950/80 p-4 rounded-xl border-l-4 border-l-cyan-500 border border-slate-800 hover:border-cyan-500/50 transition-all">
          <span className="text-[10px] text-slate-500 mono uppercase font-bold block mb-1 tracking-wider">Precipitação</span>
          <span className="text-2xl font-black text-cyan-400 mono">{weather.rainProbability}</span>
        </div>
        <div className="bg-slate-950/80 p-4 rounded-xl border-l-4 border-l-amber-500 border border-slate-800 hover:border-amber-500/50 transition-all">
          <span className="text-[10px] text-slate-500 mono uppercase font-bold block mb-1 tracking-wider">Visibilidade</span>
          <span className="text-2xl font-black text-amber-400 mono">{weather.visibility}</span>
        </div>
        <div className="bg-slate-950/80 p-4 rounded-xl border-l-4 border-l-purple-500 border border-slate-800 hover:border-purple-500/50 transition-all">
          <span className="text-[10px] text-slate-500 mono uppercase font-bold block mb-1 tracking-wider">Status Tático</span>
          <span className="text-xs font-black text-purple-400 mono uppercase">OPERACIONAL</span>
        </div>
      </div>

      {/* Previsão Futura */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-4 w-1 bg-emerald-500 rounded-full"></div>
          <h4 className="text-xs font-black text-white mono uppercase tracking-[0.3em]">PROJEÇÃO 7 DIAS</h4>
        </div>
        <div className="space-y-2">
          {weather.weeklyForecast?.map((day, idx) => (
            <div key={idx} className="flex items-center justify-between bg-slate-950/50 p-4 rounded-xl border border-slate-800 group hover:bg-emerald-500/5 hover:border-emerald-500/30 transition-all cursor-default">
              <div className="w-14">
                <div className="text-sm font-black text-emerald-400 mono uppercase">{day.day}</div>
              </div>
              <div className="flex-1 flex flex-col px-4">
                <div className="text-[10px] font-bold text-slate-300 mono uppercase tracking-tight">{day.conditions}</div>
                <div className="flex items-center gap-2 mt-1">
                   <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
                   <span className="text-[10px] text-cyan-400 mono font-bold">{day.rainProbability} CHUVA</span>
                </div>
              </div>
              <div className="text-right flex items-center gap-4">
                <div className="flex flex-col items-end">
                   <span className="text-lg font-black text-white mono leading-none">{day.tempMax}</span>
                   <span className="text-[10px] text-slate-500 mono font-bold mt-1">MIN {day.tempMin}</span>
                </div>
                <div className="w-1.5 h-8 bg-slate-800 rounded-full overflow-hidden">
                   <div className="w-full bg-emerald-500 h-1/2 mt-1"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alerta/Conselho Tático */}
      <div className="bg-emerald-500/10 border-2 border-emerald-500/50 p-5 rounded-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-2 opacity-10">
           <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
        </div>
        <div className="text-xs font-black text-emerald-400 mono uppercase mb-2 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          DIRETRIZ DE OPERAÇÃO
        </div>
        <p className="text-sm text-white leading-relaxed font-bold italic">
          &ldquo;{weather.advice}&rdquo;
        </p>
      </div>

      <div className="mt-8 text-[9px] text-slate-700 mono uppercase text-center font-black tracking-[0.4em] animate-pulse">
        ● SINCRONISMO SATELITAL ATIVO ●
      </div>
    </div>
  );
};

export default WeatherPanel;
