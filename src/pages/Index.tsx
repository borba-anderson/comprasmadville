import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/contexts/AuthContext";
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
  <div className="w-full h-full bg-[#107c50] flex items-center justify-center relative overflow-hidden rounded-xl border-4 border-slate-800/5 shadow-2xl">
    <div className="w-[85%] bg-white rounded-2xl shadow-2xl p-5 transform scale-95">
      <div className="flex bg-slate-100/80 p-1 rounded-xl mb-6">
        <div className="flex-1 py-2 text-center text-[10px] font-bold bg-white text-[#107c50] shadow-sm rounded-lg">
          Entrar
        </div>
        <div className="flex-1 py-2 text-center text-[10px] font-bold text-slate-400">Cadastrar</div>
      </div>
      <div className="space-y-3">
        <div className="space-y-1">
          <div className="h-2 w-1/3 bg-slate-200 rounded"></div>
          <div className="h-9 w-full bg-slate-50 border border-slate-200 rounded-xl"></div>
        </div>
        <div className="space-y-1">
          <div className="h-2 w-1/4 bg-slate-200 rounded"></div>
          <div className="h-9 w-full bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-end px-3">
            <div className="w-4 h-4 rounded-full bg-slate-200"></div>
          </div>
        </div>
        <div className="h-9 w-full bg-[#107c50] rounded-xl mt-4 flex items-center justify-center text-white text-[10px] font-bold gap-2 shadow-lg">
          <LogIn size={12} /> Acessar
        </div>
      </div>
    </div>
  </div>
);

// MOCK 2: PAINEL DE LISTAGEM (OPERACIONAL)
const MockPainelScreen = () => (
  <div className="w-full h-full bg-slate-50 flex flex-col rounded-xl overflow-hidden border border-slate-200 shadow-2xl">
    <div className="bg-white h-12 flex items-center justify-between px-4 shrink-0 border-b">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-[#107c50] rounded"></div>
        <div className="w-20 h-3 bg-slate-200 rounded"></div>
      </div>
      <div className="flex gap-2">
        <div className="w-7 h-7 bg-slate-100 rounded-full"></div>
        <div className="w-7 h-7 bg-[#107c50] rounded-full text-white flex items-center justify-center">
          <User size={12} />
        </div>
      </div>
    </div>
    <div className="p-3 bg-slate-50 flex-1 overflow-hidden flex flex-col gap-3">
      <div className="flex gap-2">
        <div className="bg-white p-2 rounded border shadow-sm flex-1">
          <div className="h-3 w-8 bg-slate-200 rounded mb-1"></div>
          <div className="h-4 w-6 bg-slate-800 rounded"></div>
        </div>
        <div className="bg-white p-2 rounded border shadow-sm flex-1 border-l-2 border-orange-400">
          <div className="h-3 w-8 bg-orange-100 rounded mb-1"></div>
          <div className="h-4 w-4 bg-orange-500 rounded"></div>
        </div>
        <div className="bg-white p-2 rounded border shadow-sm flex-1 border-l-2 border-green-400">
          <div className="h-3 w-8 bg-green-100 rounded mb-1"></div>
          <div className="h-4 w-6 bg-green-500 rounded"></div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border flex-1 p-2 space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between p-2 border rounded bg-slate-50">
            <div className="flex gap-2 items-center">
              <div className="w-6 h-6 rounded bg-white border flex items-center justify-center text-[9px] font-bold text-slate-400">
                #{i}
              </div>
              <div>
                <div className="w-16 h-2 bg-slate-300 rounded mb-1"></div>
                <div className="w-10 h-1.5 bg-slate-200 rounded"></div>
              </div>
            </div>
            <div className="w-12 h-4 bg-slate-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// MOCK 3: FORMULÁRIO (REQUISIÇÃO)
const MockFormScreen = () => (
  <div className="w-full h-full bg-white flex flex-col rounded-xl overflow-hidden border border-slate-200 shadow-2xl relative">
    <div className="bg-slate-50 border-b p-3">
      <div className="flex justify-between items-center px-2 mb-2">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold ${step <= 2 ? "bg-[#107c50] text-white" : "bg-slate-200 text-slate-400"}`}
          >
            {step}
          </div>
        ))}
      </div>
      <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
        <div className="h-full w-[50%] bg-[#107c50]"></div>
      </div>
    </div>
    <div className="p-4 flex-1 flex flex-col gap-3">
      <div className="space-y-1">
        <div className="h-2 w-1/3 bg-slate-200 rounded"></div>
        <div className="h-8 w-full bg-white border rounded"></div>
      </div>
      <div className="space-y-1">
        <div className="h-2 w-1/4 bg-slate-200 rounded"></div>
        <div className="h-8 w-full bg-white border rounded"></div>
      </div>
      <div className="mt-auto w-full h-8 bg-[#107c50] rounded flex items-center justify-center text-white text-[10px] font-bold">
        Enviar
      </div>
    </div>
  </div>
);

// MOCK 4: DASHBOARD (GRÁFICOS) - NOVO
const MockChartScreen = () => (
  <div className="w-full h-full bg-white flex flex-col rounded-xl overflow-hidden border border-slate-200 shadow-2xl">
    <div className="p-4 border-b flex justify-between">
      <div className="w-24 h-4 bg-slate-200 rounded"></div>
      <BarChart3 size={16} className="text-slate-400" />
    </div>
    <div className="p-4 flex-1 flex flex-col gap-4">
      {/* Gráfico de Barras */}
      <div className="flex items-end justify-between gap-1 h-32 px-2 pb-2 border-b border-l border-slate-100">
        {[30, 50, 40, 70, 50, 80, 60, 90].map((h, i) => (
          <div
            key={i}
            className="w-full bg-[#107c50]/80 rounded-t-sm hover:bg-[#107c50] transition-colors"
            style={{ height: `${h}%` }}
          ></div>
        ))}
      </div>
      {/* Cards Inferiores */}
      <div className="grid grid-cols-2 gap-3">
        <div className="h-16 bg-slate-50 rounded border p-2 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <PieChart size={14} />
          </div>
          <div>
            <div className="w-8 h-2 bg-slate-300 mb-1 rounded"></div>
            <div className="w-12 h-3 bg-slate-800 rounded"></div>
          </div>
        </div>
        <div className="h-16 bg-slate-50 rounded border p-2 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
            <TrendingUp size={14} />
          </div>
          <div>
            <div className="w-8 h-2 bg-slate-300 mb-1 rounded"></div>
            <div className="w-12 h-3 bg-slate-800 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ==========================================
// 2. COMPOSIÇÃO 3D AJUSTADA
// ==========================================

const Hero3DComposition = () => {
  return (
    // Reduzi a altura do container e adicionei scale para caber em telas menores
    <div className="relative w-full h-[450px] md:h-[550px] flex items-center justify-center [perspective:1200px] overflow-visible mt-8 lg:mt-0 scale-[0.85] md:scale-100 origin-center">
      {/* Grupo Rotacionado */}
      <div className="relative w-[300px] md:w-[600px] lg:w-[700px] h-[350px] md:h-[450px] transform [transform-style:preserve-3d] [transform:rotateX(12deg)_rotateY(-15deg)_rotateZ(4deg)] transition-transform duration-700 ease-out hover:[transform:rotateX(5deg)_rotateY(-5deg)_rotateZ(0deg)]">
        {/* 1. FUNDO DIREITA (Dashboard Gráficos) - O cérebro do sistema */}
        <div className="absolute top-[-40px] right-[-80px] w-[320px] md:w-[400px] h-[280px] md:h-[320px] transform [transform:translateZ(-120px)] opacity-90 bg-white rounded-xl shadow-xl transition-all duration-500 hover:opacity-100 hover:[transform:translateZ(-80px)] border border-slate-200">
          <MockChartScreen />
        </div>

        {/* 2. CENTRAL (Painel Operacional) - O corpo do sistema */}
        <div className="absolute top-0 left-0 w-full h-full transform [transform:translateZ(0px)] shadow-[0_30px_60px_-15px_rgba(16,124,80,0.25)] bg-white rounded-xl z-20 transition-all duration-500 hover:[transform:translateZ(40px)] border-[3px] border-white">
          <MockPainelScreen />
        </div>

        {/* 3. FLUTUANTE ESQUERDA (Auth) - A porta de entrada */}
        <div className="absolute top-[20%] -left-[20%] md:-left-[25%] w-[220px] md:w-[260px] h-[280px] md:h-[340px] transform [transform:translateZ(80px)] shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-all duration-500 hover:[transform:translateZ(120px)_scale(1.05)] z-30 animate-float">
          <MockAuthScreen />
        </div>

        {/* 4. FLUTUANTE DIREITA (Formulário) - A ação */}
        <div className="absolute bottom-[-15%] -right-[10%] md:-right-[15%] w-[240px] md:w-[280px] h-[320px] md:h-[380px] transform [transform:translateZ(120px)] shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-all duration-500 hover:[transform:translateZ(160px)_scale(1.05)] z-40 animate-float-delayed">
          <MockFormScreen />
        </div>
      </div>

      {/* Glow de fundo mais suave */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#107c50]/10 to-blue-500/10 blur-[80px] rounded-full -z-10 pointer-events-none"></div>
    </div>
  );
};

// ==========================================
// 3. PÁGINA PRINCIPAL (INDEX)
// ==========================================

// Efeito de digitação removido conforme solicitado no ajuste anterior, mantendo texto estático e limpo.

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

      {/* Shapes de Fundo Sutis */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-gradient-to-br from-blue-50/50 to-green-50/50 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-[10%] left-[-15%] w-[600px] h-[600px] bg-gradient-to-tr from-slate-100 to-orange-50 rounded-full blur-3xl opacity-40"></div>
      </div>

      <div className="relative z-10">
        <Header />

        <main className="max-w-[1440px] mx-auto">
          {/* === 1. HERO SECTION === */}
          <section className="px-6 md:px-12 pt-10 pb-12 lg:pt-14 lg:pb-24 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16 min-h-[550px]">
            {/* Texto Hero */}
            <div className="flex-1 text-center lg:text-left max-w-[600px] relative z-30">
              {/* Título Ajustado (Estático) */}
              <h1 className="font-jakarta text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-[#0F172A] mb-6 tracking-tight leading-[1.1]">
                Portal de Solicitações <br />
                <span className="text-[#107c50]">de Suprimentos.</span>
              </h1>

              <p
                className="text-slate-600 text-base md:text-lg font-medium leading-relaxed max-w-lg mx-auto lg:mx-0 animate-fade-in opacity-0 mb-8"
                style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
              >
                O controle total das suas compras corporativas. Centralize requisições, automatize aprovações e garanta
                compliance em um único painel.
              </p>

              <div
                className="animate-fade-in opacity-0 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
                style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
              >
                <button className="bg-[#107c50] hover:bg-[#0d6942] text-white text-base font-bold px-8 py-3.5 rounded-full shadow-lg shadow-green-900/10 transition-all hover:scale-105 active:scale-95">
                  Acessar o Painel
                </button>
              </div>
            </div>

            {/* Composição 3D */}
            <div
              className="flex-1 w-full animate-fade-in opacity-0 origin-center relative z-20"
              style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
            >
              <Hero3DComposition />
            </div>
          </section>

          {/* Logos */}
          <div className="pb-12 relative z-20">
            <LogoMarquee />
          </div>

          {/* === 2. AÇÕES RÁPIDAS (Cards) === */}
          <div className="mb-20 px-6 md:px-12 relative z-20">
            <ActionCards />
          </div>

          {user && (
            <section className="my-10 px-6 md:px-12 animate-fade-in">
              <UserGreeting />
              <QuickStats />
            </section>
          )}

          {/* === 3. SEÇÃO COMO FUNCIONA === */}
          <section className="py-20 bg-white relative overflow-hidden border-t border-slate-100">
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>

            <div className="max-w-[1280px] mx-auto px-6 md:px-12 relative z-10">
              <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
                <span className="text-[#107c50] font-bold tracking-wider text-xs uppercase bg-green-50 px-3 py-1 rounded-full border border-green-100">
                  Workflow
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold font-jakarta text-slate-900 mt-4 mb-4 tracking-tight">
                  Como funciona o processo?
                </h2>
                <p className="text-base text-slate-600 font-medium leading-relaxed">
                  Do pedido inicial à entrega fiscal: um fluxo contínuo e transparente.
                </p>
              </div>

              <div className="flex justify-center">
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
