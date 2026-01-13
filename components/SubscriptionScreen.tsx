
import React, { useState } from 'react';

interface SubscriptionScreenProps {
  onComplete: () => void;
}

const SubscriptionScreen: React.FC<SubscriptionScreenProps> = ({ onComplete }) => {
  const [selectedPlan, setSelectedPlan] = useState<'trial' | 'monthly' | 'annual' | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const pixKey = "05967900000126";

  const plans = [
    {
      id: 'trial',
      name: 'Teste Grátis',
      price: 'R$ 0',
      period: '30 Dias',
      features: ['Acesso Total', 'Sem cobrança inicial', 'Cancelamento grátis'],
      highlight: false,
      link: null
    },
    {
      id: 'monthly',
      name: 'Plano Mensal',
      price: 'R$ 79',
      period: '/mês',
      features: ['Acesso Ilimitado', 'Suporte Tático 24h', 'Cancelamento flexível'],
      highlight: true,
      link: 'https://pag.ae/81pBYHWM4'
    },
    {
      id: 'annual',
      name: 'Plano Anual',
      price: 'R$ 799',
      period: '/ano',
      features: ['Economize R$ 149', 'Acesso Prioritário', 'Atualizações Vitalícias'],
      highlight: false,
      link: 'https://pag.ae/81pBZynM9'
    }
  ];

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCheckout = () => {
    const plan = plans.find(p => p.id === selectedPlan);
    
    setIsProcessing(true);
    
    // Se houver um link externo, redireciona após um pequeno delay simulando processamento
    setTimeout(() => {
      if (plan?.link) {
        window.open(plan.link, '_blank');
      }
      setIsProcessing(false);
      onComplete(); // Libera o acesso ao app (assumindo que o usuário completará o pagamento no link)
    }, 1500);
  };

  if (selectedPlan && !isProcessing) {
    const currentPlan = plans.find(p => p.id === selectedPlan);
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 bg-grid">
        <div className="w-full max-w-md bg-slate-900 border border-emerald-500/30 rounded-3xl p-8 shadow-2xl">
          <button onClick={() => { setSelectedPlan(null); setPaymentMethod(null); }} className="text-slate-500 text-xs mono mb-4 hover:text-emerald-500 transition-colors">← VOLTAR AOS PLANOS</button>
          <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-tight">MÉTODO DE PAGAMENTO</h2>
          
          <div className="space-y-3 mb-8">
            <button 
              onClick={() => setPaymentMethod('pix')}
              className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all group ${paymentMethod === 'pix' ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-800 bg-slate-950 hover:border-slate-600'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${paymentMethod === 'pix' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-emerald-500'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 11l5 5 5-5M7 13l5 5 5-5"/></svg>
                </div>
                <span className="text-white font-bold mono">PIX</span>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 transition-all ${paymentMethod === 'pix' ? 'border-emerald-500 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'border-slate-700'}`}></div>
            </button>

            {paymentMethod === 'pix' && (
              <div className="bg-slate-950 border border-emerald-500/20 p-4 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
                <p className="text-[10px] text-slate-500 mono uppercase mb-2">Chave PIX (CNPJ)</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-slate-900 p-2 rounded border border-slate-800 text-emerald-400 font-bold mono text-sm overflow-hidden text-ellipsis">
                    {pixKey}
                  </code>
                  <button 
                    onClick={handleCopyPix}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded transition-all active:scale-90"
                    title="Copiar Chave"
                  >
                    {copied ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    )}
                  </button>
                </div>
                {copied && <p className="text-[8px] text-emerald-500 mono uppercase mt-2 font-bold animate-pulse">Copiado para a área de transferência!</p>}
              </div>
            )}

            <button 
              onClick={() => setPaymentMethod('card')}
              className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all group ${paymentMethod === 'card' ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-800 bg-slate-950 hover:border-slate-600'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${paymentMethod === 'card' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-emerald-500'}`}>
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                </div>
                <span className="text-white font-bold mono">CARTÃO DE CRÉDITO</span>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 transition-all ${paymentMethod === 'card' ? 'border-emerald-500 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'border-slate-700'}`}></div>
            </button>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full -mr-8 -mt-8"></div>
            <div className="flex justify-between text-[10px] mono text-slate-500 uppercase">
              <span>Plano Selecionado</span>
              <span>Total</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-white font-bold uppercase tracking-widest">{currentPlan?.name}</span>
              <span className="text-emerald-500 font-black text-2xl">
                {currentPlan?.price},00
              </span>
            </div>
          </div>

          <button 
            disabled={!paymentMethod}
            onClick={handleCheckout}
            className="group w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-white font-black py-5 rounded-2xl shadow-[0_10px_30px_rgba(16,185,129,0.3)] transition-all transform active:scale-95 flex items-center justify-center gap-3"
          >
            <span>{selectedPlan === 'trial' ? 'INICIAR TESTE GRÁTIS' : 'PAGAR E ATIVAR AGORA'}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="group-hover:translate-x-1 transition-transform"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
          
          <p className="text-[9px] text-slate-500 mt-6 text-center mono uppercase leading-relaxed font-bold">
            🔒 Processamento seguro via gateway certificado. <br/> Seu acesso será liberado imediatamente.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 bg-grid">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-12 animate-in fade-in duration-700">
          <div className="inline-block bg-emerald-600 text-white px-4 py-1 rounded-md italic font-black text-2xl mb-4 shadow-lg">NAV</div>
          <h1 className="text-5xl font-black text-white tracking-tighter mb-4 uppercase">SISTEMA DE MONITORAMENTO PROFISSIONAL</h1>
          <p className="text-slate-400 mono text-xs uppercase tracking-[0.3em] font-bold">Selecione seu nível de acesso para telemetria global em tempo real</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`relative bg-slate-900/50 backdrop-blur-md border-2 rounded-[2rem] p-10 flex flex-col transition-all transform hover:-translate-y-3 hover:scale-[1.02] ${plan.highlight ? 'border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.2)] bg-emerald-950/5' : 'border-slate-800'}`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 text-[10px] font-black px-6 py-1.5 rounded-full mono uppercase tracking-widest shadow-xl">MELHOR ESCOLHA</div>
              )}
              <div className="mb-8">
                <h3 className="text-emerald-400 font-black mono text-sm uppercase mb-4 tracking-widest">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-white tracking-tighter">{plan.price}</span>
                  <span className="text-slate-500 mono text-base font-bold">{plan.period}</span>
                </div>
              </div>
              <ul className="space-y-5 mb-10 flex-1">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-4 text-slate-300 text-sm font-semibold">
                    <div className="mt-1 bg-emerald-500/20 p-1 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="4"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => setSelectedPlan(plan.id as any)}
                className={`w-full py-5 rounded-2xl font-black text-[11px] mono uppercase tracking-[0.2em] transition-all active:scale-95 shadow-lg ${plan.highlight ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'}`}
              >
                ASSINAR ESTE PLANO
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center space-y-4">
          <p className="text-[10px] text-slate-500 mono uppercase tracking-[0.4em] font-bold">
            💳 CARTÃO DE CRÉDITO • PIX • BOLETO
          </p>
          <p className="text-[9px] text-slate-700 mono uppercase max-w-2xl mx-auto leading-relaxed">
            Ao assinar, você concorda com nossos termos de uso de telemetria via satélite. <br/> 
            Cancelamento flexível disponível em todas as modalidades pagas.
          </p>
        </div>
      </div>

      {isProcessing && (
        <div className="fixed inset-0 bg-slate-950/95 z-[9999] flex flex-col items-center justify-center backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative">
            <div className="w-24 h-24 border-8 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-12 h-12 bg-emerald-500 rounded-full animate-ping opacity-20"></div>
            </div>
          </div>
          <h2 className="text-white font-black text-2xl tracking-tighter mt-10 animate-pulse uppercase">INICIANDO GATEWAY SEGURO</h2>
          <p className="text-emerald-500 mono text-[10px] mt-4 font-bold uppercase tracking-[0.3em]">Sincronizando chave de acesso criptografada...</p>
          
          <div className="mt-12 flex gap-2">
            {[1,2,3].map(i => (
              <div key={i} className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: `${i*0.2}s` }}></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionScreen;
