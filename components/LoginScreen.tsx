
import React, { useState } from 'react';

interface LoginScreenProps {
  onLogin: (email: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      // Simulação de autenticação
      onLogin(email);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 bg-grid">
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-emerald-500/20 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-block bg-emerald-600 text-white px-3 py-1 rounded italic font-black text-xl mb-2">NAV</div>
          <h1 className="text-2xl font-bold text-white">GLOBAL<span className="text-emerald-500">PRO</span></h1>
          <p className="text-slate-500 text-[10px] mono uppercase tracking-widest mt-2">Acesso ao Sistema de Telemetria</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] mono uppercase text-slate-400 mb-1 font-bold">Identificação (E-mail)</label>
            <input 
              type="email" 
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-all mono text-sm"
              placeholder="operador@globalnav.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[10px] mono uppercase text-slate-400 mb-1 font-bold">Chave de Acesso</label>
            <input 
              type="password" 
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-all mono text-sm"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all transform active:scale-95"
          >
            {isSignup ? 'CRIAR CONTA TÁTICA' : 'AUTENTICAR NO SISTEMA'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsSignup(!isSignup)}
            className="text-[10px] mono uppercase text-emerald-500 hover:text-emerald-400 font-bold tracking-wider"
          >
            {isSignup ? 'Já possui acesso? Entrar' : 'Não possui conta? Solicitar Acesso'}
          </button>
        </div>
        
        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-[9px] text-slate-600 mono uppercase">Encriptação de Nível Militar AES-256</p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
