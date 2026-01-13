
import React from 'react';

interface ProximityAlertProps {
  type: 'approaching' | 'arrived' | null;
  cityName: string;
  distance: number;
}

const ProximityAlert: React.FC<ProximityAlertProps> = ({ type, cityName, distance }) => {
  if (!type) return null;

  const isArrived = type === 'arrived';

  return (
    <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[5000] w-full max-w-md p-1 animate-in zoom-in duration-300`}>
      <div className={`
        ${isArrived ? 'bg-red-950/90 border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.4)]' : 'bg-amber-950/90 border-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.4)]'}
        border-4 rounded-3xl backdrop-blur-xl p-6 text-center overflow-hidden relative
      `}>
        {/* Animação de radar no fundo */}
        <div className={`absolute inset-0 opacity-20 pointer-events-none`}>
          <div className={`absolute inset-0 border-2 rounded-full animate-ping ${isArrived ? 'border-red-500' : 'border-amber-500'}`} style={{ animationDuration: '2s' }}></div>
        </div>

        <div className="relative z-10">
          <div className={`text-[12px] font-black mono uppercase tracking-[0.3em] mb-2 ${isArrived ? 'text-red-400' : 'text-amber-400'}`}>
            {isArrived ? '⚠️ DESTINO ALCANÇADO' : '⚡ ALERTA DE PROXIMIDADE'}
          </div>
          
          <h2 className="text-3xl font-black text-white tracking-tighter mb-1 uppercase">
            {cityName}
          </h2>
          
          <p className="text-slate-300 text-sm mono mb-4">
            Distância atual: <span className="text-white font-bold">{distance} NM</span>
          </p>

          <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden mb-4">
            <div 
              className={`h-full animate-pulse ${isArrived ? 'bg-red-500' : 'bg-amber-500'}`}
              style={{ width: isArrived ? '100%' : `${Math.max(10, (5 - distance) / 5 * 100)}%` }}
            ></div>
          </div>

          <p className={`text-[10px] mono font-bold uppercase ${isArrived ? 'text-red-300' : 'text-amber-300'}`}>
            {isArrived ? 'Reduzir para velocidade de atracação' : 'Iniciando procedimentos de aproximação'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProximityAlert;
