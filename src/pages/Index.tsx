import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import {
  FileText,
  CheckCircle,
  Clock,
  ShoppingCart,
  TrendingUp,
  XCircle,
  Bell,
  User,
  ArrowRight,
  LogIn,
  Search,
  Filter,
  Menu,
  Calculator,
  Package,
  BarChart3,
  PieChart,
  Plus,
  ChevronDown,
  DollarSign,
  LayoutGrid,
  Calendar,
  MoreHorizontal,
  Download,
  List,
  MapPin,
  Briefcase,
  Heart,
  ShoppingBag,
  Phone,
  AlertCircle,
  ShieldCheck,
  Zap,
  BarChart,
  Users,
  ArrowUpRight,
  Building2,
  ArrowRightLeft,
  Wifi,
} from "lucide-react";
import {
  UserGreeting,
  QuickStats,
  ActionCards,
  LogoMarquee,
  HeroFlowDiagram,
  WorkflowTimeline,
} from "@/components/home";

// ==================================================================================
// OPÇÃO 3: ABSTRACT NETWORK (ATIVA)
// Foco: Conexão Madville - Curitiba e Institucional
// ==================================================================================
const HeroNetworkMap = () => {
  return (
    <div className="relative w-full h-[400px] flex items-center justify-center scale-[0.85] lg:scale-100 origin-center lg:origin-right">
      {/* Background Map Grid (Técnico) */}
      <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 gap-6 opacity-20 pointer-events-none">
        {[...Array(48)].map((_, i) => (
          <div key={i} className="flex items-center justify-center">
            <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
          </div>
        ))}
      </div>

      {/* CARD 1: MADVILLE (Esquerda) */}
      <div className="absolute left-0 lg:left-0 top-1/2 -translate-y-1/2 bg-white p-5 rounded-2xl shadow-xl border border-slate-100 w-52 z-10 animate-float">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 bg-green-50 rounded-lg text-[#008651] border border-green-100">
            <Building2 size={24} />
          </div>
          <div>
            <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Unidade</div>
            <div className="text-sm font-extrabold text-slate-800">Madville</div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-medium text-slate-500">
            <span>Status</span>
            <span className="text-green-600 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>Online
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full w-[85%] bg-[#008651] rounded-full"></div>
          </div>
        </div>
      </div>

      {/* CARD 2: CURITIBA (Direita) */}
      <div className="absolute right-0 lg:right-0 top-1/2 -translate-y-1/2 bg-white p-5 rounded-2xl shadow-xl border border-slate-100 w-52 z-10 animate-float-delayed">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 bg-slate-50 rounded-lg text-slate-600 border border-slate-200">
            <Building2 size={24} />
          </div>
          <div>
            <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Unidade</div>
            <div className="text-sm font-extrabold text-slate-800">Curitiba</div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-medium text-slate-500">
            <span>Sincronia</span>
            <span className="text-blue-600 font-bold flex items-center gap-1">
              <Wifi size={10} /> Ativo
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full w-[92%] bg-slate-600 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* CONECTOR CENTRAL (O Coração do Sistema) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        {/* Halo Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-green-100/50 rounded-full blur-3xl -z-10 animate-pulse"></div>

        <div className="bg-[#008651] text-white w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-[0_0_40px_-10px_rgba(0,134,81,0.6)] border-[6px] border-white relative">
          <ArrowRightLeft size={32} className="animate-spin-slow mb-1" />
          <span className="text-[9px] font-black uppercase tracking-widest">Central</span>
        </div>
      </div>

      {/* Linhas de Conexão SVG Animadas */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none -z-0 overflow-visible">
        <defs>
          <linearGradient id="gradientLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#008651" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        {/* Linha Curva Esquerda */}
        <path
          d="M 120 200 Q 250 200 300 200"
          stroke="url(#gradientLine)"
          strokeWidth="3"
          fill="none"
          strokeDasharray="6,6"
          className="animate-dash"
        />
        {/* Linha Curva Direita */}
        <path
          d="M 480 200 Q 350 200 300 200"
          stroke="url(#gradientLine)"
          strokeWidth="3"
          fill="none"
          strokeDasharray="6,6"
          className="animate-dash-reverse"
        />
      </svg>
    </div>
  );
};

// ==================================================================================
// OUTRAS OPÇÕES (DEFINIDAS MAS INATIVAS PARA FÁCIL TROCA)
// ==================================================================================

const HeroGlassInterface = () => {
  return (
    <div className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center lg:justify-end scale-[0.85] md:scale-100 origin-center lg:origin-right">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-100/40 rounded-full blur-3xl -z-10"></div>
      <div className="relative w-[550px] h-[360px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform rotate-y-[-6deg] rotate-x-[4deg] transition-all hover:rotate-0 duration-700 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] group">
        <div className="h-9 bg-slate-50 border-b border-slate-100 flex items-center px-4 gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
          </div>
          <div className="mx-auto h-5 w-48 bg-white border border-slate-200 rounded-md text-[9px] flex items-center justify-center text-slate-400 font-mono">
            central.gmad.com.br/dashboard
          </div>
        </div>
        <div className="p-6 grid grid-cols-3 gap-4 bg-white/50 backdrop-blur-sm h-full">
          <div className="col-span-2 h-32 bg-gradient-to-br from-[#f0fdf4] to-white rounded-xl border border-green-100 p-5 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 p-3 opacity-5">
              <TrendingUp size={100} className="text-[#008651]" />
            </div>
            <div className="text-xs text-green-700 font-bold uppercase tracking-wider mb-1">Economia Gerada</div>
            <div className="text-3xl font-extrabold text-[#008651] tracking-tight">R$ 142.500</div>
            <div className="mt-4 flex flex-col gap-1">
              <div className="flex justify-between text-[9px] text-green-600 font-bold">
                <span>Meta</span>
                <span>82%</span>
              </div>
              <div className="h-1.5 w-full bg-green-100 rounded-full overflow-hidden">
                <div className="h-full w-[82%] bg-[#008651]"></div>
              </div>
            </div>
          </div>
          <div className="col-span-1 h-32 bg-white rounded-xl border border-slate-100 p-4 flex flex-col justify-center items-center shadow-sm relative">
            <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-600 mb-2 border border-slate-100">
              <Clock size={20} />
            </div>
            <div className="text-2xl font-extrabold text-slate-800">1.2d</div>
            <div className="text-[9px] text-slate-400 font-bold text-center uppercase mt-1">Tempo Médio</div>
          </div>
          <div className="col-span-3 space-y-2.5 mt-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-10 w-full border border-slate-100 bg-white rounded-lg flex items-center px-3 gap-3 shadow-sm hover:border-green-200 transition-colors"
              >
                <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-500">
                  #{420 + i}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="h-1.5 w-24 bg-slate-200 rounded"></div>
                  <div className="h-1 w-12 bg-slate-100 rounded"></div>
                </div>
                <div className="ml-auto px-2 py-0.5 bg-green-50 text-green-700 text-[8px] font-bold rounded border border-green-100">
                  Aprovado
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const HeroBentoGrid = () => {
  return (
    <div className="w-full max-w-[550px] h-[400px] grid grid-cols-2 grid-rows-2 gap-4 lg:ml-auto scale-[0.9] md:scale-100 origin-center lg:origin-right">
      <div className="row-span-2 bg-[#008651] rounded-2xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden group border border-green-700/50">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-all duration-500"></div>
        <div>
          <div className="bg-white/20 w-fit p-2.5 rounded-lg mb-4 backdrop-blur-md shadow-inner">
            <Zap className="text-white fill-current" size={24} />
          </div>
          <h3 className="text-white text-2xl font-bold mb-1 tracking-tight">Agilidade</h3>
          <p className="text-green-100 text-sm font-medium leading-relaxed">
            Processos de compra reduzidos de dias para minutos.
          </p>
        </div>
        <div className="space-y-2 relative z-10">
          <div className="bg-black/20 p-2.5 rounded-lg flex items-center gap-3 text-white text-xs font-bold backdrop-blur-sm border border-white/5 transform transition-transform group-hover:translate-x-1 duration-300">
            <CheckCircle size={14} className="text-green-300" /> Cotação Automática
          </div>
          <div className="bg-black/20 p-2.5 rounded-lg flex items-center gap-3 text-white text-xs font-bold backdrop-blur-sm border border-white/5 transform transition-transform group-hover:translate-x-1 duration-300 delay-75">
            <CheckCircle size={14} className="text-green-300" /> Fluxo Integrado
          </div>
          <div className="bg-black/20 p-2.5 rounded-lg flex items-center gap-3 text-white text-xs font-bold backdrop-blur-sm border border-white/5 transform transition-transform group-hover:translate-x-1 duration-300 delay-100">
            <CheckCircle size={14} className="text-green-300" /> Gestão Madville
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-5 shadow-xl border border-slate-100 flex flex-col justify-between group hover:-translate-y-1 transition-transform duration-300">
        <div className="flex justify-between items-start">
          <div className="bg-orange-50 p-2.5 rounded-lg text-orange-600 border border-orange-100">
            <BarChart size={22} />
          </div>
          <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1 border border-green-100">
            <ArrowUpRight size={10} /> +24%
          </span>
        </div>
        <div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">850+</div>
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wide">Pedidos Processados/Mês</div>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-5 shadow-xl border border-slate-100 flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 delay-75">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-70"></div>
        <div className="bg-blue-50 w-fit p-2.5 rounded-lg text-blue-600 relative z-10 border border-blue-100">
          <Users size={22} />
        </div>
        <div className="relative z-10">
          <div className="flex -space-x-3 mb-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-9 h-9 rounded-full bg-slate-100 border-[3px] border-white flex items-center justify-center text-[10px] font-bold text-slate-600 shadow-sm"
              >
                U{i}
              </div>
            ))}
            <div className="w-9 h-9 rounded-full bg-slate-800 border-[3px] border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
              +50
            </div>
          </div>
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wide">Equipes Conectadas</div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. NOVO SUBPAINEL GMAD (ADAPTADO PARA O CONTEXTO)
// ==========================================
const GMADHeaderBar = () => (
  <div className="w-full bg-[#006746] font-sans">
    <div className="max-w-[1600px] mx-auto px-6 h-8 flex items-center justify-between text-[10px] text-white/90 border-b border-white/10 hidden md:flex">
      <div className="flex gap-4">
        <span className="hover:text-white cursor-pointer">Grupo GMAD</span>
        <span className="hover:text-white cursor-pointer">Soluções Financeiras G+</span>
        <span className="hover:text-white cursor-pointer">Combinações MDF</span>
      </div>
      <div className="flex gap-4">
        <span className="hover:text-white cursor-pointer">Atendimento</span>
        <span className="hover:text-white cursor-pointer">Chamados</span>
        <span className="hover:text-white cursor-pointer font-bold">Suporte TI</span>
      </div>
    </div>
    <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between gap-8">
      <div className="text-3xl font-extrabold text-white tracking-tighter italic">GMAD</div>
      <div className="flex-1 max-w-2xl relative hidden md:block">
        <input
          type="text"
          placeholder="O que você está procurando?"
          className="w-full h-10 pl-4 pr-10 rounded text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <Search className="absolute right-3 top-2.5 text-slate-400" size={18} />
      </div>
      <div className="flex items-center gap-6 text-white">
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80">
          <MapPin size={24} />
          <div className="flex flex-col leading-tight">
            <span className="text-[10px] font-medium opacity-80">Unidade</span>
            <span className="text-xs font-bold">Madville Joinville</span>
          </div>
        </div>
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80">
          <User size={24} />
          <div className="flex flex-col leading-tight">
            <span className="text-[10px] font-medium opacity-80">Departamento</span>
            <span className="text-xs font-bold">Compras & TI</span>
          </div>
        </div>
        <div className="flex items-center gap-4 ml-2 border-l border-white/20 pl-6">
          <Heart size={24} className="hover:opacity-80 cursor-pointer" />
          <div className="relative cursor-pointer hover:opacity-80">
            <ShoppingBag size={24} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
              3
            </span>
          </div>
        </div>
      </div>
    </div>
    <div className="bg-[#005c3e] border-t border-white/10 hidden md:block">
      <div className="max-w-[1600px] mx-auto px-6 h-10 flex items-center justify-between text-white text-xs font-bold">
        <div className="flex items-center gap-2 cursor-pointer hover:bg-white/10 px-2 py-1 rounded transition-colors">
          <Menu size={16} />
          <span>Todas as Categorias</span>
        </div>
        <div className="flex items-center gap-8">
          <span className="cursor-pointer hover:text-green-200 transition-colors">Material de Escritório</span>
          <span className="cursor-pointer hover:text-green-200 transition-colors">Informática & TI</span>
          <span className="cursor-pointer hover:text-green-200 transition-colors">EPIs e Segurança</span>
          <span className="cursor-pointer hover:text-green-200 transition-colors">Ferramentas</span>
          <span className="cursor-pointer hover:text-green-200 transition-colors">Limpeza e Copa</span>
        </div>
        <div className="flex items-center gap-6">
          <button className="bg-[#E85D4E] hover:bg-[#d64d3e] text-white px-4 py-1 rounded transition-colors text-xs font-bold shadow-sm flex items-center gap-1">
            <AlertCircle size={12} /> Solicitação Urgente
          </button>
          <span className="cursor-pointer hover:text-green-200 transition-colors">Itens Recorrentes</span>
        </div>
      </div>
    </div>
  </div>
);

// ==========================================
// 4. PÁGINA PRINCIPAL
// ==========================================

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white relative overflow-x-hidden font-sans selection:bg-green-100 selection:text-green-900">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap'); .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; } body { font-family: 'Plus Jakarta Sans', sans-serif; }`}</style>

      <div className="relative z-50 shadow-md">
        <GMADHeaderBar />
      </div>
      <div className="relative z-10">
        <Header />
        <main className="max-w-[1440px] mx-auto">
          {/* === 1. HERO SECTION === */}
          <section className="px-6 md:px-12 pt-12 pb-16 lg:pt-24 lg:pb-24 flex flex-col lg:flex-row items-center justify-between gap-12 min-h-[500px]">
            <div className="flex-1 text-center lg:text-left max-w-[650px] relative z-30">
              <h1 className="font-jakarta text-[3rem] sm:text-5xl lg:text-[4.5rem] font-extrabold text-[#1A1A1A] mb-6 tracking-tight leading-[1.1] max-w-[700px]">
                Central de <br />
                <span className="text-[#008651]">Compras.</span>
              </h1>
              <p className="text-slate-600 text-lg md:text-xl font-medium leading-relaxed max-w-lg mx-auto lg:mx-0 mb-10">
                Centralize seus pedidos de compra em um único lugar. Mais agilidade, transparência e controle para sua
                gestão.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/painel">
                  <button className="bg-[#008651] hover:bg-[#006e42] text-white text-lg font-bold px-10 py-4 rounded-md transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2 shadow-sm">
                    Acessar o Painel <ArrowRight size={20} />
                  </button>
                </Link>
              </div>
            </div>
            <div className="flex-1 w-full flex justify-center lg:justify-end relative z-20 lg:-mr-10">
              {/* === OPÇÃO 3 ATIVA === */}
              <HeroNetworkMap />
            </div>
          </section>

          <div className="pb-12 relative z-20 border-b border-slate-200">
            <LogoMarquee />
          </div>
          {user && (
            <section className="mt-12 mb-12 px-6 md:px-12 animate-fade-in relative z-20">
              <UserGreeting />
              <div className="mt-8">
                <QuickStats />
              </div>
            </section>
          )}
          <div className="mb-20 px-6 md:px-12 relative z-20">
            <ActionCards />
          </div>
          <section className="py-24 bg-[#F5F5F5] relative overflow-hidden border-t border-slate-200">
            <div className="max-w-[1280px] mx-auto px-6 md:px-12 relative z-10">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-[#008651] font-bold tracking-wider text-sm uppercase bg-white px-4 py-1.5 rounded-md border border-green-100 shadow-sm">
                  Workflow
                </span>
                <h2 className="text-3xl md:text-5xl font-extrabold font-jakarta text-[#1A1A1A] mt-6 mb-6 tracking-tight">
                  Fluxo Inteligente
                </h2>
                <p className="text-lg text-slate-600 font-medium leading-relaxed">
                  Entenda como o portal conecta solicitantes, compradores e aprovadores de forma eficiente.
                </p>
              </div>
              <div className="flex justify-center scale-90 sm:scale-100 bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                <HeroFlowDiagram />
              </div>
            </div>
          </section>
          <WorkflowTimeline />
          <footer className="py-12 text-center mt-0 border-t border-slate-200 bg-white">
            <p className="text-slate-600 text-sm font-bold font-jakarta">
              © 2026 GMAD Madville | Curitiba - Central de Compras
            </p>
            <p className="text-slate-500 text-xs mt-3 font-jakarta">
              Versão Beta 2.1 | Suporte:{" "}
              <a
                href="https://wa.me/5547992189824"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#008651] hover:underline font-bold transition-colors"
              >
                WhatsApp
              </a>
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Index;
