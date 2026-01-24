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
  AlertCircle,
  Briefcase,
  MapPin,
  Phone,
  Grid,
} from "lucide-react";
import {
  UserGreeting,
  QuickStats,
  ActionCards,
  LogoMarquee,
  HeroFlowDiagram,
  WorkflowTimeline,
} from "@/components/home";

// ==========================================
// 1. COMPONENTES VISUAIS (MOCKS 3D)
// Design ajustado para ser mais "chapado" e técnico
// ==========================================

// MOCK 1: PAINEL DE REQUISIÇÕES (Fundo Cinza Técnico)
const MockPainelScreen = () => (
  <div className="w-full h-full bg-[#F5F7FA] flex flex-col rounded-t-xl overflow-hidden border-x border-t border-slate-300 shadow-2xl font-sans relative">
    {/* Header Institucional Verde GMAD */}
    <div className="h-10 bg-[#008651] flex items-center justify-between px-4 shrink-0 shadow-md z-20">
      <div className="flex items-center gap-2">
        <div className="bg-white/20 p-1 rounded">
          <Grid size={10} className="text-white" />
        </div>
        <div className="h-4 w-[1px] bg-white/30 mx-1"></div>
        <span className="text-[9px] font-bold text-white tracking-wide uppercase">Central de Compras</span>
      </div>
      <div className="flex gap-2 items-center">
        <div className="bg-white/10 px-2 py-1 rounded flex items-center gap-1.5 border border-white/20">
          <User size={8} className="text-white" />
          <span className="text-[7px] text-white font-bold">Ruan Wilt</span>
        </div>
      </div>
    </div>

    {/* Barra de Filtros Branca */}
    <div className="bg-white p-2 border-b border-slate-200 flex gap-2 shadow-sm z-10">
      <div className="flex-1 bg-slate-100 border border-slate-200 rounded flex items-center px-2 gap-2 h-6">
        <Search size={8} className="text-slate-400" />
        <div className="h-2 w-20 bg-slate-200 rounded"></div>
      </div>
      <div className="w-16 bg-white border border-slate-200 rounded h-6 flex items-center justify-center">
        <div className="h-2 w-8 bg-slate-200 rounded"></div>
      </div>
    </div>

    {/* Tabela Densa */}
    <div className="flex-1 p-2 space-y-1 overflow-hidden">
      {/* Header Tabela */}
      <div className="flex px-2 py-1 border-b-2 border-slate-200 mb-1">
        <div className="w-[40%] h-2 bg-slate-300 rounded"></div>
        <div className="w-[30%] h-2 bg-slate-300 rounded mx-2"></div>
        <div className="w-[30%] h-2 bg-slate-300 rounded"></div>
      </div>
      {/* Linhas */}
      {[1, 2, 3, 4, 5].map((_, i) => (
        <div key={i} className="bg-white border border-slate-200 rounded p-1.5 flex items-center shadow-sm">
          <div className="w-[40%]">
            <div className="h-2 w-24 bg-slate-700 rounded mb-1"></div>
            <div className="h-1.5 w-12 bg-slate-300 rounded"></div>
          </div>
          <div className="w-[30%] px-2">
            <div className="h-1.5 w-16 bg-slate-400 rounded"></div>
          </div>
          <div className="w-[30%] flex justify-end">
            <div
              className={`h-3 w-12 rounded ${i === 0 ? "bg-orange-100 border border-orange-200" : "bg-slate-100 border border-slate-200"}`}
            ></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// MOCK 2: DASHBOARD (Overlay Flutuante)
const MockChartScreen = () => (
  <div className="w-full h-full bg-white flex flex-col rounded-lg overflow-hidden border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.2)] p-4 font-sans">
    <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
      <span className="text-[10px] font-extrabold text-slate-800 uppercase tracking-tight">Performance Global</span>
      <div className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-[7px] font-bold border border-green-100">
        JANEIRO 2026
      </div>
    </div>

    <div className="flex gap-4 h-full">
      {/* Esquerda: Gráfico Barras */}
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex justify-between items-end h-full px-1 border-b border-slate-200 pb-1">
          {[40, 70, 30, 85, 50, 60].map((h, i) => (
            <div
              key={i}
              className="w-3 bg-[#008651] rounded-t-sm opacity-90 hover:opacity-100 transition-opacity"
              style={{ height: `${h}%` }}
            ></div>
          ))}
        </div>
        <div className="flex justify-between px-1">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="w-3 h-1 bg-slate-200 rounded-full"></div>
          ))}
        </div>
      </div>

      {/* Direita: KPIs */}
      <div className="w-[40%] flex flex-col gap-2">
        <div className="bg-slate-50 p-2 rounded border border-slate-100">
          <div className="text-[7px] text-slate-500 font-bold mb-1">ECONOMIA</div>
          <div className="text-[14px] font-black text-[#008651]">18%</div>
        </div>
        <div className="bg-slate-50 p-2 rounded border border-slate-100">
          <div className="text-[7px] text-slate-500 font-bold mb-1">SLA MÉDIO</div>
          <div className="text-[14px] font-black text-slate-800">2.4d</div>
        </div>
      </div>
    </div>
  </div>
);

// MOCK 3: FORMULÁRIO (Lateral)
const MockFormScreen = () => (
  <div className="w-full h-full bg-white flex flex-col rounded-xl overflow-hidden border border-slate-200 shadow-xl relative font-sans">
    <div className="h-1 bg-[#008651] w-full"></div>
    <div className="p-3 border-b border-slate-100">
      <div className="h-2 w-24 bg-slate-800 rounded mb-2"></div>
      <div className="flex gap-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i === 0 ? "bg-[#008651]" : "bg-slate-200"}`}></div>
        ))}
      </div>
    </div>
    <div className="p-3 flex-1 flex flex-col gap-3">
      <div className="space-y-1">
        <div className="h-2 w-10 bg-slate-400 rounded"></div>
        <div className="h-6 w-full bg-slate-50 border border-slate-200 rounded"></div>
      </div>
      <div className="space-y-1">
        <div className="h-2 w-16 bg-slate-400 rounded"></div>
        <div className="h-6 w-full bg-slate-50 border border-slate-200 rounded"></div>
      </div>
      <div className="mt-auto h-8 w-full bg-[#008651] rounded flex items-center justify-center text-white text-[8px] font-bold uppercase">
        Confirmar Pedido
      </div>
    </div>
  </div>
);

// ==========================================
// 2. COMPOSIÇÃO 3D (REORGANIZADA)
// ==========================================

const Hero3DComposition = () => {
  return (
    <div className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center [perspective:1500px] overflow-visible scale-[0.8] md:scale-[0.9] origin-center lg:origin-right">
      <div className="relative w-[600px] h-[400px] transform [transform-style:preserve-3d] [transform:rotateX(15deg)_rotateY(-20deg)_rotateZ(5deg)]">
        {/* Painel Principal (Base Sólida) */}
        <div className="absolute top-0 left-0 w-full h-full transform [transform:translateZ(0px)] bg-white rounded-xl shadow-[20px_20px_60px_rgba(0,0,0,0.15)] z-10 transition-all hover:[transform:translateZ(10px)]">
          <MockPainelScreen />
        </div>

        {/* Dashboard (Flutuante à frente e direita) */}
        <div className="absolute -bottom-10 -right-20 w-[300px] h-[220px] transform [transform:translateZ(80px)] bg-white rounded-lg shadow-[0_30px_60px_rgba(0,0,0,0.25)] z-30 border border-slate-100 transition-all hover:[transform:translateZ(100px)_scale(1.05)]">
          <MockChartScreen />
        </div>

        {/* Formulário (Flutuante à esquerda) */}
        <div className="absolute top-10 -left-16 w-[200px] h-[300px] transform [transform:translateZ(40px)] bg-white rounded-xl shadow-[0_30px_60px_rgba(0,0,0,0.2)] z-20 transition-all hover:[transform:translateZ(60px)]">
          <MockFormScreen />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. NOVO SUBPAINEL GMAD (ELEMENTO ESTRUTURAL)
// ==========================================
const GMADSubPanel = () => (
  <div className="w-full bg-[#F8F9FA] border-b border-slate-200 py-3 px-6 md:px-12 hidden lg:flex items-center justify-between">
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2 text-slate-600 hover:text-[#008651] cursor-pointer transition-colors group">
        <div className="bg-white p-1.5 rounded border border-slate-200 group-hover:border-[#008651]">
          <MapPin size={16} />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Unidade</span>
          <span className="text-sm font-bold leading-none">Madville Joinville</span>
        </div>
        <ChevronDown size={14} className="ml-1 opacity-50" />
      </div>
      <div className="h-8 w-[1px] bg-slate-200"></div>
      <div className="flex items-center gap-2 text-slate-600 hover:text-[#008651] cursor-pointer transition-colors group">
        <div className="bg-white p-1.5 rounded border border-slate-200 group-hover:border-[#008651]">
          <Briefcase size={16} />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Departamento</span>
          <span className="text-sm font-bold leading-none">Compras & TI</span>
        </div>
        <ChevronDown size={14} className="ml-1 opacity-50" />
      </div>
    </div>
    <div className="flex items-center gap-4">
      <div className="text-right hidden xl:block">
        <span className="text-[10px] font-bold text-slate-400 block">SUPORTE TÉCNICO</span>
        <span className="text-sm font-bold text-slate-700 flex items-center gap-1 justify-end">
          <Phone size={12} /> (47) 99921-8982
        </span>
      </div>
      <button className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded transition-colors flex items-center gap-2">
        <AlertCircle size={14} /> Relatar Problema
      </button>
    </div>
  </div>
);

// ==========================================
// 4. PÁGINA PRINCIPAL (REDESIGN AGRESSIVO)
// ==========================================

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#008651] selection:text-white">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
          body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #ffffff; }
        `}
      </style>

      {/* HEADER PRINCIPAL */}
      <div className="relative z-50 bg-white border-b border-slate-200">
        <Header />
      </div>

      {/* SUBPAINEL GMAD (NOVO) */}
      <GMADSubPanel />

      <main className="w-full">
        {/* === HERO SECTION BRUTALISTA === */}
        <section className="relative px-6 md:px-12 pt-16 pb-24 lg:pt-24 lg:pb-32 overflow-hidden">
          <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            {/* Texto Hero */}
            <div className="flex-1 relative z-20">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-100 rounded-full mb-6">
                <span className="w-2 h-2 rounded-full bg-[#008651] animate-pulse"></span>
                <span className="text-xs font-bold text-[#008651] uppercase tracking-wider">Sistema Interno v2.1</span>
              </div>

              <h1 className="font-jakarta text-5xl sm:text-6xl lg:text-[5.5rem] font-extrabold text-slate-900 tracking-tight leading-[1.05] mb-6">
                Central de <br />
                <span className="text-[#008651] relative">
                  Compras.
                  <svg
                    className="absolute w-full h-3 -bottom-1 left-0 text-green-200 -z-10"
                    viewBox="0 0 100 10"
                    preserveAspectRatio="none"
                  >
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                  </svg>
                </span>
              </h1>

              <p className="text-lg text-slate-600 font-medium leading-relaxed max-w-xl mb-10 border-l-4 border-[#008651] pl-6">
                Plataforma unificada para gestão de suprimentos e requisições corporativas. Controle total para{" "}
                <strong>Madville</strong> e <strong>Curitiba</strong>.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/painel" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto bg-[#008651] hover:bg-[#006e42] text-white text-lg font-bold px-10 py-4 rounded-md shadow-lg shadow-green-900/20 transition-all hover:-translate-y-1 flex items-center justify-center gap-3">
                    Acessar Painel <ArrowRight size={20} strokeWidth={3} />
                  </button>
                </Link>
                <button className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 text-lg font-bold px-8 py-4 rounded-md transition-colors flex items-center justify-center gap-2">
                  <FileText size={20} /> Documentação
                </button>
              </div>

              {/* Stats Integrados no Hero (Pop) */}
              <div className="mt-12 flex items-center gap-8 text-slate-500 text-sm font-semibold">
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-[#008651]" /> Sistema Operante
                </div>
                <div className="flex items-center gap-2">
                  <User size={18} className="text-[#008651]" /> +50 Usuários Ativos
                </div>
              </div>
            </div>

            {/* 3D Composition */}
            <div className="flex-1 w-full relative z-10 lg:h-[600px] flex items-center">
              <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-slate-50 rounded-full blur-3xl -z-10 opacity-60 translate-x-1/3 -translate-y-1/4"></div>
              <Hero3DComposition />
            </div>
          </div>
        </section>

        {/* === LOGOS (Borda Sólida) === */}
        <div className="border-y border-slate-200 bg-slate-50/50 py-10">
          <div className="max-w-[1600px] mx-auto px-6">
            <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
              Empresas Integradas
            </p>
            <LogoMarquee />
          </div>
        </div>

        {/* === SEÇÃO DE AÇÕES RÁPIDAS (REORDENADA) === */}
        <section className="py-24 bg-white">
          <div className="max-w-[1600px] mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <span className="text-[#008651] font-bold text-sm uppercase tracking-wider mb-2 block">Atalhos</span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">O que você precisa fazer hoje?</h2>
              </div>
              <Link to="/painel" className="text-[#008651] font-bold hover:underline flex items-center gap-1">
                Ver todas as ações <ArrowRight size={16} />
              </Link>
            </div>

            <ActionCards />
          </div>
        </section>

        {/* === WORKFLOW (Fundo Escuro para Contraste) === */}
        <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,134,81,0.1)_1px,transparent_1px)] [background-size:40px_40px] opacity-20"></div>

          <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="bg-[#008651] text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
                Processo
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold mt-6 mb-6">Fluxo de Aprovação Inteligente</h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Cada requisição segue um caminho automatizado, garantindo compliance, rastreabilidade e agilidade para o
                setor de compras.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 backdrop-blur-sm">
              <HeroFlowDiagram />
            </div>
          </div>
        </section>

        <WorkflowTimeline />

        <footer className="py-12 bg-white border-t border-slate-200">
          <div className="max-w-[1600px] mx-auto px-6 text-center">
            <div className="mb-6 flex justify-center">
              <div className="h-8 w-8 bg-[#008651] rounded flex items-center justify-center text-white font-extrabold text-xs">
                GM
              </div>
            </div>
            <p className="text-slate-900 text-sm font-bold mb-2">© 2026 GMAD Madville | Curitiba</p>
            <p className="text-slate-500 text-xs">Central de Compras Corporativas • Acesso Restrito</p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
