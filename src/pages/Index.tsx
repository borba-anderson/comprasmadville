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

// MOCK 1: TELA DE LOGIN
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

// MOCK 2: PAINEL CENTRAL (Dashboard)
const MockPainelScreen = () => (
  <div className="w-full h-full bg-slate-50 flex flex-col rounded-xl overflow-hidden border-[3px] border-white shadow-2xl">
    <div className="bg-white h-9 flex items-center justify-between px-3 shrink-0 border-b">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-[#107c50] rounded flex items-center justify-center text-white">
          <FileText size={10} />
        </div>
        <div className="h-2 w-16 bg-slate-200 rounded"></div>
      </div>
      <div className="flex gap-1.5">
        <div className="w-5 h-5 bg-slate-100 rounded-full"></div>
        <div className="w-5 h-5 bg-[#107c50] rounded-full text-white flex items-center justify-center">
          <User size={8} />
        </div>
      </div>
    </div>
    <div className="p-2 bg-slate-50 flex-1 overflow-hidden flex flex-col gap-2">
      <div className="flex gap-1.5">
        <div className="bg-white p-1.5 rounded border shadow-sm flex-1">
          <div className="h-1.5 w-6 bg-slate-200 rounded mb-1"></div>
          <div className="h-3 w-4 bg-slate-800 rounded"></div>
        </div>
        <div className="bg-white p-1.5 rounded border shadow-sm flex-1 border-l-2 border-orange-400">
          <div className="h-1.5 w-6 bg-orange-100 rounded mb-1"></div>
          <div className="h-3 w-3 bg-orange-500 rounded"></div>
        </div>
        <div className="bg-white p-1.5 rounded border shadow-sm flex-1 border-l-2 border-green-400">
          <div className="h-1.5 w-6 bg-green-100 rounded mb-1"></div>
          <div className="h-3 w-4 bg-green-500 rounded"></div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border flex-1 p-1.5 space-y-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between p-1 border rounded bg-slate-50">
            <div className="flex gap-1.5 items-center">
              <div className="w-4 h-4 rounded bg-white border flex items-center justify-center text-[6px] font-bold text-slate-400">
                #{i}
              </div>
              <div>
                <div className="w-10 h-1 bg-slate-300 rounded mb-0.5"></div>
                <div className="w-6 h-1 bg-slate-200 rounded"></div>
              </div>
            </div>
            <div className="w-8 h-2.5 bg-slate-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// MOCK 3: FORMULÁRIO
const MockFormScreen = () => (
  <div className="w-full h-full bg-white flex flex-col rounded-xl overflow-hidden border-[3px] border-white shadow-2xl relative">
    <div className="bg-slate-50 border-b p-2">
      <div className="flex items-center gap-1.5 mb-1.5">
        <div className="w-3.5 h-3.5 bg-[#107c50] rounded flex items-center justify-center text-white">
          <Plus size={8} />
        </div>
        <div className="h-1.5 w-12 bg-slate-300 rounded"></div>
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

// MOCK 4: DASHBOARD GRÁFICOS
const MockChartScreen = () => (
  <div className="w-full h-full bg-white flex flex-col rounded-xl overflow-hidden border-[3px] border-white shadow-2xl">
    <div className="p-2.5 border-b flex justify-between items-center h-8 shrink-0">
      <div className="h-1.5 w-16 bg-slate-300 rounded"></div>
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
          <div className="w-4 h-4 rounded-full bg-blue-100"></div>
          <div>
            <div className="w-4 h-1 bg-slate-300 mb-0.5 rounded"></div>
            <div className="w-6 h-1.5 bg-slate-800 rounded"></div>
          </div>
        </div>
        <div className="h-8 bg-slate-50 rounded border p-1 flex items-center gap-1">
          <div className="w-4 h-4 rounded-full bg-orange-100"></div>
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
// 2. COMPOSIÇÃO 3D (MINI)
// ==========================================

const Hero3DComposition = () => {
  return (
    // Escala muito reduzida para ser discreto (0.45 mobile / 0.65 desktop)
    <div className="relative w-full h-[250px] md:h-[350px] flex items-center justify-center [perspective:1000px] overflow-visible mt-4 lg:mt-0 scale-[0.45] md:scale-[0.65] origin-center lg:origin-right">
      <div className="relative w-[280px] md:w-[550px] lg:w-[650px] h-[300px] md:h-[400px] transform [transform-style:preserve-3d] [transform:rotateX(10deg)_rotateY(-15deg)_rotateZ(2deg)] transition-transform duration-700 ease-out hover:[transform:rotateX(5deg)_rotateY(-5deg)_rotateZ(0deg)]">
        {/* Camadas (Z-Index ajustado) */}
        <div className="absolute top-[-20px] right-[-40px] w-[240px] md:w-[320px] h-[200px] md:h-[260px] transform [transform:translateZ(-80px)] opacity-70 bg-white rounded-xl shadow-xl border border-slate-200">
          <MockChartScreen />
        </div>

        <div className="absolute top-0 left-0 w-full h-full transform [transform:translateZ(20px)] shadow-[0_25px_50px_-12px_rgba(16,124,80,0.25)] bg-white rounded-xl z-20 border-[3px] border-white ring-2 ring-[#107c50]/10">
          <MockPainelScreen />
        </div>

        <div className="absolute top-[10%] -left-[10%] w-[160px] md:w-[200px] h-[200px] md:h-[260px] transform [transform:translateZ(60px)] shadow-[0_20px_40px_rgba(0,0,0,0.15)] z-30 animate-float">
          <MockAuthScreen />
        </div>

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
// 3. PÁGINA PRINCIPAL (INDEX)
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
            {/* Texto Hero - TIPOGRAFIA AJUSTADA PARA O PADRÃO DA IMAGEM */}
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

            {/* Composição 3D (Miniatura) */}
            <div className="flex-1 w-full flex justify-center lg:justify-end relative z-20">
              <Hero3DComposition />
            </div>
          </section>

          {/* Logos */}
          <div className="pb-10 relative z-20 border-b border-slate-100/50">
            <LogoMarquee />
          </div>

          {/* === 2. SAUDAÇÃO E STATS (ORDEM CORRIGIDA: ACIMA DAS AÇÕES) === */}
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
