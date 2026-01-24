// Certifique-se de importar estes ícones do 'lucide-react' no topo do arquivo:
// import { Zap, CheckCircle, BarChart, Users, ArrowUpRight, Plus } from 'lucide-react';

const HeroBentoGrid = () => {
  return (
    <div className="w-full max-w-[580px] h-[420px] grid grid-cols-2 grid-rows-2 gap-4 lg:ml-auto scale-[0.85] md:scale-100 origin-center lg:origin-right select-none font-sans">
      {/* === BLOCO 1: AGILIDADE (PRINCIPAL) === */}
      <div className="row-span-2 bg-gradient-to-br from-[#008651] to-[#006039] rounded-3xl p-6 flex flex-col justify-between shadow-2xl shadow-green-900/20 relative overflow-hidden group border border-white/10 transition-all hover:scale-[1.02] duration-500">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-400/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

        {/* Header do Card */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-inner">
              <Zap className="text-white fill-current" size={20} />
            </div>
            <div className="px-2 py-1 bg-emerald-500/20 rounded-full border border-emerald-500/30 text-[10px] font-bold text-emerald-100 uppercase tracking-wider">
              Novo Sistema
            </div>
          </div>
          <h3 className="text-white text-3xl font-extrabold mb-2 tracking-tight leading-tight">
            Agilidade <br />
            Corporativa
          </h3>
          <p className="text-green-50 text-sm font-medium leading-relaxed opacity-90">
            Aprovação de requisições em tempo recorde.
          </p>
        </div>

        {/* Lista Flutuante (Glassmorphism) */}
        <div className="space-y-3 relative z-10 mt-4">
          {[
            { text: "Cotação Automática", delay: "0" },
            { text: "Fluxo Integrado", delay: "75" },
            { text: "Gestão Madville", delay: "150" },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`bg-white/10 hover:bg-white/20 p-3 rounded-xl flex items-center gap-3 text-white text-xs font-bold backdrop-blur-md border border-white/10 shadow-lg transform transition-all duration-300 hover:translate-x-1 group-hover:translate-x-0 cursor-default`}
              style={{ transitionDelay: `${item.delay}ms` }}
            >
              <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm">
                <CheckCircle size={12} strokeWidth={4} className="text-white" />
              </div>
              {item.text}
            </div>
          ))}
        </div>
      </div>

      {/* === BLOCO 2: GRÁFICO (PERFORMANCE) === */}
      <div className="bg-white rounded-3xl p-5 shadow-xl border border-slate-100 flex flex-col justify-between group relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-2xl duration-300">
        <div className="flex justify-between items-start relative z-10">
          <div className="flex flex-col">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Volume Mensal</span>
            <span className="text-3xl font-black text-slate-800 tracking-tight">854</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1 border border-emerald-100">
            <ArrowUpRight size={12} strokeWidth={3} /> +24%
          </span>
        </div>

        {/* Visualização de Gráfico com CSS */}
        <div className="relative h-24 flex items-end justify-between gap-1.5 mt-2 z-10 px-1">
          {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
            <div
              key={i}
              className="w-full bg-slate-100 rounded-t-sm relative group-hover:bg-slate-50 transition-colors overflow-hidden"
            >
              {/* Barra Colorida Animada */}
              <div
                className={`absolute bottom-0 left-0 w-full rounded-t-sm transition-all duration-1000 ease-out ${i === 5 ? "bg-[#008651]" : "bg-slate-300 group-hover:bg-emerald-400/60"}`}
                style={{ height: `${height}%` }}
              ></div>
            </div>
          ))}
          {/* Linha de tendência decorativa */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              d="M0 60 Q 20 30 40 50 T 80 10"
              fill="none"
              stroke="#008651"
              strokeWidth="2"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      </div>

      {/* === BLOCO 3: EQUIPE (CONEXÃO) === */}
      <div className="bg-white rounded-3xl p-5 shadow-xl border border-slate-100 flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
        {/* Pattern de Fundo */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:12px_12px] opacity-60"></div>

        <div className="relative z-10 flex justify-between items-center">
          <div className="bg-blue-50 w-fit p-2 rounded-xl text-blue-600 border border-blue-100">
            <Users size={20} />
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 rounded-full border border-green-100">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[9px] font-bold text-green-700 uppercase">Online</span>
          </div>
        </div>

        <div className="relative z-10 mt-3">
          <div className="flex items-center justify-between mb-2">
            <div className="text-3xl font-black text-slate-800">50+</div>
            <div className="text-xs text-slate-400 font-bold text-right">
              Usuários
              <br />
              Ativos
            </div>
          </div>

          {/* Avatares Modernos */}
          <div className="flex -space-x-3 pl-1">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-300 border-[3px] border-white flex items-center justify-center text-[10px] font-bold text-slate-600 shadow-sm relative z-0 transition-transform hover:scale-110 hover:z-10 hover:-translate-y-1"
              >
                <span className="opacity-50">U{i}</span>
              </div>
            ))}
            <div className="w-10 h-10 rounded-full bg-[#008651] border-[3px] border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm relative z-10">
              <Plus size={14} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
