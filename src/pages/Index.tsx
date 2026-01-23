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
  MoreHorizontal,
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
// 1. COMPONENTES VISUAIS (MOCKS) - INTERNOS
// ==========================================

// MOCK 1: TELA DE LOGIN (Fiel ao padrão)
const MockAuthScreen = () => (
  <div className="w-full h-full bg-[#107c50] flex flex-col rounded-xl border-[3px] border-white/50 shadow-2xl relative overflow-hidden">
    <div className="bg-[#0d6942] h-7 flex items-center px-3 text-white text-[8px] font-bold">
      <LogIn size={10} className="mr-1" /> Portal GMAD
    </div>
    <div className="flex-1 flex items-center justify-center p-3">
      <div className="w-full bg-white rounded-lg shadow-lg p-3 transform scale-95">
        <div className="flex bg-slate-100 p-0.5 rounded-md mb-2">
          <div className="flex-1 py-1 text-center text-[7px] font-bold bg-white text-[#107c50] shadow-sm rounded">
            Login
          </div>
          <div className="flex-1 py-1 text-center text-[7px] font-bold text-slate-400">Cadastro</div>
        </div>
        <div className="space-y-1.5">
          <div className="h-6 w-full bg-slate-50 border border-slate-200 rounded"></div>
          <div className="h-6 w-full bg-slate-50 border border-slate-200 rounded flex items-center justify-end px-2">
            <div className="w-2 h-2 rounded-full bg-slate-200"></div>
          </div>
          <div className="h-6 w-full bg-[#107c50] rounded mt-1 flex items-center justify-center text-white text-[8px] font-bold">
            Entrar
          </div>
        </div>
      </div>
    </div>
  </div>
);

// MOCK 2: PAINEL CENTRAL (RÉPLICA DA IMAGEM 6bb315.png)
const MockPainelScreen = () => (
  <div className="w-full h-full bg-[#107c50] flex flex-col rounded-xl overflow-hidden border-[4px] border-white shadow-2xl font-sans">
    {/* Header Verde */}
    <div className="h-8 flex items-center justify-between px-3 shrink-0">
      <div className="flex items-center gap-1.5">
        <div className="text-[8px] font-bold text-white tracking-tighter">GMAD</div>
        <div className="h-2 w-[1px] bg-white/30"></div>
        <span className="text-[7px] font-medium text-white">Central de Compras Madville | Curitiba</span>
      </div>
      <div className="flex gap-1.5 items-center">
        <Bell size={8} className="text-white/80" />
        <div className="flex items-center gap-1 bg-white/10 px-1.5 py-0.5 rounded-full">
          <User size={8} className="text-white" />
          <span className="text-[6px] text-white font-medium">Ruan Wilt</span>
        </div>
      </div>
    </div>

    {/* Cards de Stats (Linha superior) */}
    <div className="px-3 pb-2 flex gap-1.5">
      <div className="bg-white rounded p-1.5 flex-1 shadow-sm">
        <div className="flex justify-between items-start mb-0.5">
          <span className="text-[5px] text-slate-400 font-bold">TOTAL</span>
          <FileText size={6} className="text-slate-300" />
        </div>
        <div className="text-[10px] font-bold text-slate-800">76</div>
      </div>
      <div className="bg-white rounded p-1.5 flex-1 shadow-sm">
        <div className="flex justify-between items-start mb-0.5">
          <span className="text-[5px] text-orange-400 font-bold">PENDENTES</span>
          <Clock size={6} className="text-orange-300" />
        </div>
        <div className="text-[10px] font-bold text-orange-600">11</div>
      </div>
      <div className="bg-white rounded p-1.5 flex-1 shadow-sm">
        <div className="flex justify-between items-start mb-0.5">
          <span className="text-[5px] text-blue-400 font-bold">EM ANÁLISE</span>
          <TrendingUp size={6} className="text-blue-300" />
        </div>
        <div className="text-[10px] font-bold text-blue-600">0</div>
      </div>
      <div className="bg-white rounded p-1.5 flex-1 shadow-sm">
        <div className="flex justify-between items-start mb-0.5">
          <span className="text-[5px] text-green-400 font-bold">APROVADOS</span>
          <CheckCircle size={6} className="text-green-300" />
        </div>
        <div className="text-[10px] font-bold text-green-600">1</div>
      </div>
    </div>

    {/* Área Branca Principal (Tabela) */}
    <div className="bg-[#F8FAFC] flex-1 mx-3 mb-3 rounded-t-lg overflow-hidden flex flex-col">
      {/* Toolbar */}
      <div className="bg-white p-1.5 border-b flex gap-1.5 items-center">
        <div className="h-4 w-24 bg-slate-50 border rounded flex items-center px-1">
          <Search size={6} className="text-slate-300" />
        </div>
        <div className="h-4 w-12 bg-white border rounded"></div>
        <div className="h-4 w-12 bg-white border rounded"></div>
        <div className="ml-auto h-4 w-12 bg-white border rounded flex items-center justify-center gap-0.5 text-[5px] font-bold text-slate-600">
          <Filter size={6} /> Filtros
        </div>
      </div>

      {/* Cabeçalho Tabela */}
      <div className="flex bg-white px-2 py-1.5 border-b">
        <div className="w-1/4 text-[5px] font-bold text-slate-400">ITEM</div>
        <div className="w-1/4 text-[5px] font-bold text-slate-400">SOLICITANTE</div>
        <div className="w-1/6 text-[5px] font-bold text-slate-400 text-center">STATUS</div>
        <div className="w-1/6 text-[5px] font-bold text-slate-400 text-center">PRIORIDADE</div>
        <div className="w-1/6 text-[5px] font-bold text-slate-400 text-right">DATA</div>
      </div>

      {/* Linhas (Baseado no print) */}
      <div className="flex-1 bg-white p-1 space-y-1">
        {/* Row 1 */}
        <div className="flex px-1 py-1.5 border-b border-slate-50 items-center">
          <div className="w-1/4">
            <div className="text-[6px] font-bold text-slate-700">Notebook</div>
            <div className="text-[4px] text-slate-400">REQ-20260123...</div>
          </div>
          <div className="w-1/4">
            <div className="text-[6px] font-medium text-slate-600">Willian Henrique</div>
            <div className="text-[4px] text-slate-400">Comercial</div>
          </div>
          <div className="w-1/6 text-center">
            <span className="bg-orange-100 text-orange-700 text-[4px] font-bold px-1 py-0.5 rounded">PENDENTE</span>
          </div>
          <div className="w-1/6 text-center">
            <span className="text-[5px] font-bold text-yellow-600 flex items-center justify-center gap-0.5">
              <div className="w-1 h-1 rounded-full bg-yellow-500"></div> Média
            </span>
          </div>
          <div className="w-1/6 text-[5px] text-slate-500 text-right">23/01/2026</div>
        </div>

        {/* Row 2 */}
        <div className="flex px-1 py-1.5 border-b border-slate-50 items-center">
          <div className="w-1/4">
            <div className="text-[6px] font-bold text-slate-700">Anti-aderente rosa</div>
            <div className="text-[4px] text-slate-400">REQ-20260123...</div>
          </div>
          <div className="w-1/4">
            <div className="text-[6px] font-medium text-slate-600">Eliane Cristina</div>
            <div className="text-[4px] text-slate-400">Almoxarifado</div>
          </div>
          <div className="w-1/6 text-center">
            <span className="bg-orange-100 text-orange-700 text-[4px] font-bold px-1 py-0.5 rounded">PENDENTE</span>
          </div>
          <div className="w-1/6 text-center">
            <span className="text-[5px] font-bold text-yellow-600 flex items-center justify-center gap-0.5">
              <div className="w-1 h-1 rounded-full bg-yellow-500"></div> Média
            </span>
          </div>
          <div className="w-1/6 text-[5px] text-slate-500 text-right">23/01/2026</div>
        </div>

        {/* Row 3 */}
        <div className="flex px-1 py-1.5 border-b border-slate-50 items-center">
          <div className="w-1/4">
            <div className="text-[6px] font-bold text-slate-700">Alicate universal</div>
            <div className="text-[4px] text-slate-400">REQ-20260122...</div>
          </div>
          <div className="w-1/4">
            <div className="text-[6px] font-medium text-slate-600">Kesia de Souza</div>
            <div className="text-[4px] text-slate-400">Almoxarifado</div>
          </div>
          <div className="w-1/6 text-center">
            <span className="bg-blue-100 text-blue-700 text-[4px] font-bold px-1 py-0.5 rounded">COTANDO</span>
          </div>
          <div className="w-1/6 text-center">
            <span className="text-[5px] font-bold text-yellow-600 flex items-center justify-center gap-0.5">
              <div className="w-1 h-1 rounded-full bg-yellow-500"></div> Média
            </span>
          </div>
          <div className="w-1/6 text-[5px] text-slate-500 text-right">22/01/2026</div>
        </div>
      </div>
    </div>
  </div>
);

// MOCK 3: FORMULÁRIO (Simplificado)
const MockFormScreen = () => (
  <div className="w-full h-full bg-white flex flex-col rounded-xl overflow-hidden border-[3px] border-white shadow-2xl relative">
    <div className="bg-slate-50 border-b p-2">
      <div className="flex items-center gap-1.5 mb-1.5">
        <div className="w-3.5 h-3.5 bg-[#107c50] rounded flex items-center justify-center text-white">
          <Plus size={8} />
        </div>
        <div className="text-[6px] font-bold text-slate-700">Nova Solicitação</div>
      </div>
      <div className="flex justify-between items-center px-1 mb-1">
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[6px] font-bold ${step <= 1 ? "bg-[#107c50] text-white" : "bg-slate-200 text-slate-400"}`}
          >
            {step}
          </div>
        ))}
      </div>
      <div className="h-0.5 w-full bg-slate-200 rounded-full overflow-hidden">
        <div className="h-full w-[33%] bg-[#107c50]"></div>
      </div>
    </div>
    <div className="p-2.5 flex-1 flex flex-col gap-2">
      <div className="space-y-0.5">
        <div className="h-1 w-1/3 bg-slate-200 rounded"></div>
        <div className="h-5 w-full bg-white border rounded"></div>
      </div>
      <div className="space-y-0.5">
        <div className="h-1 w-1/4 bg-slate-200 rounded"></div>
        <div className="h-5 w-full bg-white border rounded"></div>
      </div>
      <div className="mt-auto w-full h-6 bg-[#107c50] rounded flex items-center justify-center text-white text-[8px] font-bold">
        Próximo
      </div>
    </div>
  </div>
);

// MOCK 4: DASHBOARD GRÁFICOS (Fundo)
const MockChartScreen = () => (
  <div className="w-full h-full bg-white flex flex-col rounded-xl overflow-hidden border-[3px] border-white shadow-2xl">
    <div className="p-2.5 border-b flex justify-between items-center h-8 shrink-0">
      <div className="text-[7px] font-bold text-slate-700 flex gap-1 items-center">
        <BarChart3 size={8} /> Indicadores
      </div>
      <div className="w-8 h-2 bg-slate-100 rounded"></div>
    </div>
    <div className="p-2.5 flex-1 flex flex-col gap-2">
      <div className="flex items-end justify-between gap-0.5 h-16 px-1 pb-1 border-b border-l border-slate-100">
        {[30, 50, 40, 70, 50, 80, 60, 90].map((h, i) => (
          <div key={i} className="w-full bg-[#107c50]/80 rounded-t-sm" style={{ height: `${h}%` }}></div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        <div className="h-8 bg-slate-50 rounded border p-1 flex items-center gap-1">
          <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <PieChart size={8} />
          </div>
          <div>
            <div className="w-4 h-1 bg-slate-300 mb-0.5 rounded"></div>
            <div className="w-6 h-1.5 bg-slate-800 rounded"></div>
          </div>
        </div>
        <div className="h-8 bg-slate-50 rounded border p-1 flex items-center gap-1">
          <div className="w-4 h-4 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
            <TrendingUp size={8} />
          </div>
          <div>
            <div className="w-4 h-1 bg-slate-300 mb-0.5 rounded"></div>
            <div className="w-6 h-1.5 bg-slate-800 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ==========================================
// 2. COMPOSIÇÃO 3D (MINI - COM O PAINEL VERDE EM DESTAQUE)
// ==========================================

const Hero3DComposition = () => {
  return (
    <div className="relative w-full h-[250px] md:h-[350px] flex items-center justify-center [perspective:1000px] overflow-visible mt-4 lg:mt-0 scale-[0.45] md:scale-[0.65] origin-center lg:origin-right">
      <div className="relative w-[280px] md:w-[550px] lg:w-[650px] h-[300px] md:h-[400px] transform [transform-style:preserve-3d] [transform:rotateX(10deg)_rotateY(-15deg)_rotateZ(2deg)] transition-transform duration-700 ease-out hover:[transform:rotateX(5deg)_rotateY(-5deg)_rotateZ(0deg)]">
        {/* 1. FUNDO (GRÁFICOS) */}
        <div className="absolute top-[-20px] right-[-40px] w-[240px] md:w-[320px] h-[200px] md:h-[260px] transform [transform:translateZ(-80px)] opacity-70 bg-white rounded-xl shadow-xl border border-slate-200">
          <MockChartScreen />
        </div>

        {/* 2. CENTRO (PAINEL OFICIAL VERDE) - O destaque */}
        <div className="absolute top-0 left-0 w-full h-full transform [transform:translateZ(20px)] shadow-[0_25px_50px_-12px_rgba(16,124,80,0.4)] bg-white rounded-xl z-20 border-white ring-2 ring-[#107c50]/20">
          <MockPainelScreen />
        </div>

        {/* 3. FLUTUANTE ESQUERDA (LOGIN) */}
        <div className="absolute top-[10%] -left-[10%] w-[160px] md:w-[200px] h-[200px] md:h-[260px] transform [transform:translateZ(60px)] shadow-[0_20px_40px_rgba(0,0,0,0.15)] z-30 animate-float">
          <MockAuthScreen />
        </div>

        {/* 4. FLUTUANTE DIREITA (FORMULÁRIO) */}
        <div className="absolute bottom-[-5%] -right-[5%] w-[180px] md:w-[220px] h-[240px] md:h-[300px] transform [transform:translateZ(90px)] shadow-[0_20px_40px_rgba(0,0,0,0.15)] z-40 animate-float-delayed">
          <MockFormScreen />
        </div>
      </div>

      {/* Sombra de chão */}
      <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 w-[60%] h-[20px] bg-black/20 blur-xl rounded-[100%] transform rotate-x-60"></div>
    </div>
  );
};

// ==========================================
// 3. PÁGINA PRINCIPAL (INDEX) - TIPOGRAFIA E LAYOUT CORRIGIDOS
// ==========================================

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative overflow-x-hidden font-sans selection:bg-green-100 selection:text-green-900">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
          body { font-family: 'Plus Jakarta Sans', sans-serif; }
        `}
      </style>

      {/* Background Limpo */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-50/40 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="relative z-10">
        <Header />

        <main className="max-w-[1440px] mx-auto">
          {/* === 1. HERO SECTION === */}
          <section className="px-6 md:px-12 pt-10 pb-8 lg:pt-16 lg:pb-16 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-12 min-h-[420px]">
            {/* Texto Hero - TÍTULO ESCURO E FONTE EXTRABOLD */}
            <div className="flex-1 text-center lg:text-left max-w-[650px] relative z-30">
              <h1 className="font-jakarta text-[2.75rem] sm:text-5xl lg:text-[4rem] font-extrabold text-[#0F172A] mb-5 tracking-tight leading-[1.15]">
                Portal de Solicitações <br />
                de Suprimentos.
              </h1>

              <p className="text-slate-500 text-base md:text-lg font-medium leading-relaxed max-w-lg mx-auto lg:mx-0 mb-8">
                Centralize seus pedidos de compra em um único lugar. Mais agilidade, transparência e controle para sua
                gestão.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link to="/painel">
                  <button className="bg-[#107c50] hover:bg-[#0d6942] text-white text-base font-bold px-8 py-3.5 rounded-full shadow-lg shadow-green-900/10 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
                    Acessar o Painel <ArrowRight size={18} />
                  </button>
                </Link>
              </div>
            </div>

            {/* Composição 3D */}
            <div className="flex-1 w-full flex justify-center lg:justify-end relative z-20">
              <Hero3DComposition />
            </div>
          </section>

          {/* Logos */}
          <div className="pb-10 relative z-20 border-b border-slate-100/50">
            <LogoMarquee />
          </div>

          {/* === 2. SAUDAÇÃO E STATS (ACIMA DAS AÇÕES) === */}
          {user && (
            <section className="mt-10 mb-8 px-6 md:px-12 animate-fade-in relative z-20">
              <UserGreeting />
              <div className="mt-6">
                <QuickStats />
              </div>
            </section>
          )}

          {/* === 3. AÇÕES RÁPIDAS (ABAIXO DOS STATS) === */}
          <div className="mb-16 px-6 md:px-12 relative z-20">
            <ActionCards />
          </div>

          {/* === 4. COMO FUNCIONA === */}
          <section className="py-16 bg-white relative overflow-hidden border-t border-slate-100">
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>

            <div className="max-w-[1280px] mx-auto px-6 md:px-12 relative z-10">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <span className="text-[#107c50] font-bold tracking-wider text-xs uppercase bg-green-50 px-3 py-1 rounded-full border border-green-100">
                  Workflow
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold font-jakarta text-slate-900 mt-4 mb-4 tracking-tight">
                  Fluxo Inteligente
                </h2>
                <p className="text-base text-slate-600 font-medium leading-relaxed">
                  Entenda como o portal conecta solicitantes, compradores e aprovadores.
                </p>
              </div>

              <div className="flex justify-center scale-90 sm:scale-100">
                <HeroFlowDiagram />
              </div>
            </div>
          </section>

          <WorkflowTimeline />

          <footer className="py-10 text-center mt-12 border-t border-slate-200 bg-white">
            <p className="text-slate-500 text-sm font-medium font-jakarta">
              © 2026 GMAD Madville | Curitiba - Portal de Solicitações de Suprimentos
            </p>
            <p className="text-slate-400 text-xs mt-2 font-jakarta">
              Versão Beta 2.1 | Suporte:{" "}
              <a
                href="https://wa.me/5547992189824"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#107c50] hover:underline font-bold transition-colors"
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
