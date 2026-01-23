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

// Visual da Tela de Login (Baseado no seu Auth.tsx)
const MockAuthScreen = () => (
  <div className="w-full h-full bg-[#107c50] flex items-center justify-center relative overflow-hidden rounded-xl border-4 border-slate-800/5 shadow-2xl">
    {/* Card Branco de Login */}
    <div className="w-[85%] bg-white rounded-2xl shadow-2xl p-5 transform scale-95">
      {/* Abas Entrar/Cadastrar */}
      <div className="flex bg-slate-100/80 p-1 rounded-xl mb-6">
        <div className="flex-1 py-2 text-center text-[10px] font-bold bg-white text-[#107c50] shadow-sm rounded-lg">
          Entrar
        </div>
        <div className="flex-1 py-2 text-center text-[10px] font-bold text-slate-400">Cadastrar</div>
      </div>
      {/* Inputs Falsos */}
      <div className="space-y-3">
        <div className="space-y-1">
          <div className="h-2 w-1/3 bg-slate-200 rounded"></div>
          <div className="h-10 w-full bg-slate-50 border border-slate-200 rounded-xl"></div>
        </div>
        <div className="space-y-1">
          <div className="h-2 w-1/4 bg-slate-200 rounded"></div>
          <div className="h-10 w-full bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-end px-3">
            <div className="w-4 h-4 rounded-full bg-slate-200"></div>
          </div>
        </div>
        <div className="h-10 w-full bg-[#107c50] hover:bg-[#0d6942] rounded-xl mt-4 flex items-center justify-center text-white text-[10px] font-bold gap-2 shadow-lg shadow-emerald-900/10">
          <LogIn size={12} /> Entrar no Sistema
        </div>
      </div>
    </div>
  </div>
);

// Visual do Painel Principal (Baseado no seu Painel.tsx)
const MockPainelScreen = () => (
  <div className="w-full h-full bg-[#107c50] flex flex-col rounded-xl overflow-hidden border border-slate-200 shadow-2xl">
    {/* Header do Painel */}
    <div className="bg-white sticky top-0 h-14 flex items-center justify-between px-4 shrink-0 border-b">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-[#107c50] rounded"></div>
        <div className="w-20 h-3 bg-slate-200 rounded"></div>
      </div>
      <div className="flex gap-2">
        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
          <Bell size={14} className="text-slate-400" />
        </div>
        <div className="w-8 h-8 bg-[#107c50] rounded-full flex items-center justify-center text-white">
          <User size={14} />
        </div>
      </div>
    </div>

    {/* Conteúdo do Painel */}
    <div className="p-3 bg-[#107c50] flex-1 overflow-hidden flex flex-col gap-3">
      {/* Cards de Stats */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-white p-2 rounded-lg shadow-sm">
          <div className="flex justify-between mb-1">
            <FileText size={10} className="text-slate-400" />
          </div>
          <div className="h-4 w-6 bg-slate-800 rounded"></div>
        </div>
        <div className="bg-white p-2 rounded-lg shadow-sm border-l-2 border-orange-500">
          <div className="flex justify-between mb-1">
            <Clock size={10} className="text-orange-500" />
          </div>
          <div className="h-4 w-4 bg-slate-800 rounded"></div>
        </div>
        <div className="bg-white p-2 rounded-lg shadow-sm border-l-2 border-green-500">
          <div className="flex justify-between mb-1">
            <CheckCircle size={10} className="text-green-500" />
          </div>
          <div className="h-4 w-6 bg-slate-800 rounded"></div>
        </div>
        <div className="bg-white p-2 rounded-lg shadow-sm border-l-2 border-blue-500">
          <div className="flex justify-between mb-1">
            <Package size={10} className="text-blue-500" />
          </div>
          <div className="h-4 w-4 bg-slate-800 rounded"></div>
        </div>
      </div>

      {/* Tabela Principal */}
      <div className="bg-white rounded-xl shadow-lg flex-1 p-3 overflow-hidden">
        <div className="flex gap-2 mb-3 border-b pb-2">
          <div className="px-3 py-1 bg-slate-100 text-[#107c50] rounded-md text-[10px] font-bold flex gap-1 items-center">
            <FileText size={10} /> Requisições
          </div>
          <div className="px-3 py-1 text-slate-400 text-[10px] font-bold">Dashboard</div>
        </div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2 border rounded-lg bg-slate-50 hover:bg-white transition-colors"
            >
              <div className="flex gap-2 items-center">
                <div className="w-8 h-8 rounded bg-white border flex items-center justify-center font-bold text-[10px] text-slate-500">
                  #{i}24
                </div>
                <div>
                  <div className="w-20 h-2 bg-slate-300 rounded mb-1"></div>
                  <div className="w-12 h-1.5 bg-slate-200 rounded"></div>
                </div>
              </div>
              <div
                className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${i === 1 ? "bg-orange-100 text-orange-600" : i === 2 ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"}`}
              >
                {i === 1 ? "PENDENTE" : i === 2 ? "ANÁLISE" : "APROVADO"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Visual do Formulário (Baseado no seu Requisicao.tsx)
const MockFormScreen = () => (
  <div className="w-full h-full bg-slate-50 flex flex-col rounded-xl overflow-hidden border border-slate-200 shadow-2xl relative">
    {/* Stepper Header */}
    <div className="bg-white border-b p-4 shadow-sm">
      <div className="flex justify-between items-center px-1 mb-3">
        {[1, 2, 3, 4, 5].map((step) => (
          <div
            key={step}
            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm ${step <= 2 ? "bg-[#107c50] text-white" : "bg-white border text-slate-300"}`}
          >
            {step}
          </div>
        ))}
      </div>
      <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full w-[40%] bg-[#107c50]"></div>
      </div>
    </div>

    {/* Form Body */}
    <div className="p-5 flex-1 flex flex-col gap-3 bg-white m-3 rounded-xl border shadow-sm">
      <div className="space-y-1">
        <div className="h-2 w-1/3 bg-slate-200 rounded"></div>
        <div className="h-8 w-full bg-slate-50 border border-slate-200 rounded-lg"></div>
      </div>
      <div className="space-y-1">
        <div className="h-2 w-1/4 bg-slate-200 rounded"></div>
        <div className="h-8 w-full bg-slate-50 border border-slate-200 rounded-lg"></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="h-8 w-full bg-slate-50 border border-slate-200 rounded-lg"></div>
        <div className="h-8 w-full bg-slate-50 border border-slate-200 rounded-lg"></div>
      </div>

      {/* Buttons */}
      <div className="mt-auto flex justify-between pt-2">
        <div className="w-16 h-8 bg-white border border-slate-200 rounded-lg"></div>
        <div className="w-20 h-8 bg-[#107c50] rounded-lg flex items-center justify-center text-white gap-1 text-[10px] font-bold shadow-lg shadow-green-900/10">
          Próximo <ArrowRight size={10} />
        </div>
      </div>
    </div>
  </div>
);

// ==========================================
// 2. COMPOSIÇÃO 3D (O PALCO)
// ==========================================

const Hero3DComposition = () => {
  return (
    <div className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center [perspective:1500px] overflow-visible mt-10 lg:mt-0">
      {/* Grupo Rotacionado (O ângulo geral) */}
      <div className="relative w-[300px] md:w-[600px] lg:w-[800px] h-[400px] md:h-[500px] transform [transform-style:preserve-3d] [transform:rotateX(10deg)_rotateY(-12deg)_rotateZ(2deg)] transition-transform duration-700 ease-out hover:[transform:rotateX(5deg)_rotateY(-5deg)_rotateZ(0deg)]">
        {/* TELA CENTRAL (Painel Principal) - O foco */}
        <div className="absolute top-0 left-0 w-full h-full transform [transform:translateZ(0px)] shadow-[0_30px_60px_-15px_rgba(16,124,80,0.3)] bg-white rounded-xl z-20 transition-all duration-500 hover:[transform:translateZ(30px)] border-[3px] border-white">
          <MockPainelScreen />
        </div>

        {/* TELA FLUTUANTE ESQUERDA (Auth) - Login */}
        <div className="absolute top-[20%] -left-[15%] md:-left-[20%] w-[240px] md:w-[280px] h-[300px] md:h-[350px] transform [transform:translateZ(80px)] shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-500 hover:[transform:translateZ(120px)_scale(1.05)] z-30">
          <MockAuthScreen />
        </div>

        {/* TELA FLUTUANTE DIREITA (Formulário) - Requisição */}
        <div className="absolute bottom-[-10%] -right-[10%] md:-right-[15%] w-[260px] md:w-[320px] h-[350px] md:h-[400px] transform [transform:translateZ(120px)] shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-500 hover:[transform:translateZ(160px)_scale(1.05)] z-40">
          <MockFormScreen />
        </div>
      </div>

      {/* Glow de fundo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#107c50]/20 to-blue-500/20 blur-[80px] rounded-full -z-10 pointer-events-none"></div>
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

      {/* Shapes de Fundo */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-gradient-to-br from-blue-50/80 to-green-50/80 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-[10%] left-[-15%] w-[600px] h-[600px] bg-gradient-to-tr from-slate-100 to-orange-50 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="relative z-10">
        <Header />

        <main className="max-w-[1440px] mx-auto">
          {/* === 1. HERO SECTION (COM EFEITO 3D AGRESSIVO) === */}
          <section className="px-6 md:px-12 pt-10 pb-16 lg:pt-16 lg:pb-32 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-12 min-h-[600px]">
            {/* Texto Hero */}
            <div className="flex-1 text-center lg:text-left max-w-[650px] relative z-30">
              <h1 className="font-jakarta text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F172A] mb-6 tracking-tight leading-tight">
                Portal de Solicitações <br />
                <span className="text-[#107c50]">de Suprimentos.</span>
              </h1>

              <p
                className="text-slate-600 text-base md:text-lg font-medium leading-relaxed max-w-lg mx-auto lg:mx-0 animate-fade-in opacity-0 mb-8"
                style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
              >
                O controle total das suas compras corporativas. Centralize requisições, automate aprovações e garanta
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

            {/* Composição 3D (Hero3DComposition) */}
            <div
              className="flex-1 w-full animate-fade-in opacity-0 scale-95 origin-center relative z-20"
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

          {/* === 3. SEÇÃO COMO FUNCIONA (Diagrama) === */}
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
