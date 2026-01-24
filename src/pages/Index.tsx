// Adicionar ao imports: import { Building2, ArrowRightLeft } from 'lucide-react';

const HeroNetworkMap = () => {
  return (
    <div className="relative w-full h-[400px] flex items-center justify-center">
      {/* Background Map Grid */}
      <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 gap-4 opacity-10">
        {[...Array(24)].map((_, i) => (
          <div key={i} className="border border-slate-400 border-dashed rounded-lg"></div>
        ))}
      </div>

      {/* CARD JOINVILLE */}
      <div className="absolute left-0 lg:left-10 top-1/2 -translate-y-1/2 bg-white p-4 rounded-xl shadow-xl border-l-4 border-[#008651] w-48 z-10 animate-float">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-green-50 rounded-lg text-[#008651]">
            <Building2 size={20} />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Unidade</div>
            <div className="text-sm font-bold text-slate-800">Madville</div>
          </div>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full w-[80%] bg-[#008651] animate-pulse"></div>
        </div>
        <div className="text-[10px] text-right mt-1 text-green-600 font-bold">Online</div>
      </div>

      {/* CARD CURITIBA */}
      <div className="absolute right-0 lg:right-10 top-1/2 -translate-y-1/2 bg-white p-4 rounded-xl shadow-xl border-l-4 border-slate-800 w-48 z-10 animate-float-delayed">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
            <Building2 size={20} />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Unidade</div>
            <div className="text-sm font-bold text-slate-800">Curitiba</div>
          </div>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full w-[60%] bg-slate-800 animate-pulse"></div>
        </div>
        <div className="text-[10px] text-right mt-1 text-slate-600 font-bold">Sincronizado</div>
      </div>

      {/* CENTRAL CONNECTOR */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#008651] text-white w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-2xl z-20 border-4 border-white">
        <ArrowRightLeft size={24} className="animate-spin-slow" />
        <span className="text-[8px] font-bold mt-1 uppercase tracking-widest">Central</span>
      </div>

      {/* Linhas de Conexão */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none -z-0">
        <path d="M 200 200 Q 400 100 600 200" stroke="#cbd5e1" strokeWidth="2" fill="none" strokeDasharray="5,5" />
        <path d="M 200 200 Q 400 300 600 200" stroke="#cbd5e1" strokeWidth="2" fill="none" strokeDasharray="5,5" />
      </svg>
    </div>
  );
};
