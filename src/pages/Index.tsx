import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/contexts/AuthContext";
import {
  FileText,
  LayoutDashboard,
  ShoppingCart,
  Bell,
  User,
  CheckCircle2,
  Calculator,
  Menu,
  Search,
  Filter,
} from "lucide-react";
import {
  UserGreeting,
  QuickStats,
  ActionCards,
  LogoMarquee,
  HeroFlowDiagram,
  WorkflowTimeline,
} from "@/components/home";

// --- COMPONENTE INTERNO: MASHUP DE 4 TELAS REAIS (Mantido) ---
const HeroAppScreens = () => {
  return (
    <div className="relative w-full max-w-[900px] mx-auto h-[400px] md:h-[480px] z-20 mt-8 lg:mt-0 [perspective:1000px]">
      {/* TELA 1: DASHBOARD (Fundo / Principal) */}
      <div className="absolute top-0 left-[10%] w-[80%] h-[85%] bg-[#F8FAFC] rounded-xl shadow-2xl border border-slate-200/80 overflow-hidden transform translate-z-0 z-10">
        <div className="bg-[#107c50] px-4 py-2 flex justify-between items-center h-10">
          <div className="flex items-center gap-2">
            <div className="w-16 h-4 bg-white/20 rounded"></div>
            <div className="w-[1px] h-4 bg-white/30"></div>
            <div className="w-24 h-3 bg-white/20 rounded"></div>
          </div>
          <div className="flex gap-2">
            <div className="w-6 h-6 bg-white/20 rounded-full"></div>
            <div className="w-20 h-6 bg-[#0d6942] rounded-full border border-[#1a8a5d]"></div>
          </div>
        </div>
        <div className="p-4">
          <div className="flex gap-3 mb-4">
            <div className="w-24 h-8 bg-white border border-slate-200 rounded-lg shadow-sm"></div>
            <div className="w-24 h-8 bg-transparent border border-transparent rounded-lg"></div>
          </div>
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-white p-3 rounded-lg border border-slate-200 h-24 shadow-sm">
              <div className="flex justify-between mb-2">
                <div className="w-8 h-3 bg-slate-200 rounded"></div>
                <FileText size={14} className="text-slate-300" />
              </div>
              <div className="text-2xl font-bold text-slate-700">73</div>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg border border-orange-100 h-24 shadow-sm">
              <div className="flex justify-between mb-2">
                <div className="w-12 h-3 bg-orange-200 rounded"></div>
                <ShoppingCart size={14} className="text-orange-300" />
              </div>
              <div className="text-2xl font-bold text-orange-600">8</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg border border-green-100 h-24 shadow-sm">
              <div className="flex justify-between mb-2">
                <div className="w-12 h-3 bg-green-200 rounded"></div>
                <CheckCircle2 size={14} className="text-green-300" />
              </div>
              <div className="text-2xl font-bold text-green-600">37</div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 h-24 shadow-sm">
              <div className="flex justify-between mb-2">
                <div className="w-10 h-3 bg-blue-200 rounded"></div>
                <Calculator size={14} className="text-blue-300" />
              </div>
              <div className="text-2xl font-bold text-blue-600">5</div>
            </div>
          </div>
          <div className="mt-4 h-32 bg-white rounded-lg border border-slate-200 shadow-sm p-3">
            <div className="w-20 h-3 bg-slate-200 rounded mb-4"></div>
            <div className="w-full h-16 bg-slate-50 rounded-b flex items-end gap-2 px-2 pb-0">
              {[40, 70, 50, 90, 60, 80, 45].map((h, i) => (
                <div key={i} className="flex-1 bg-[#107c50]/20 rounded-t-sm" style={{ height: `${h}%` }}></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* TELA 2: LISTA DE REQUISIÇÕES (Esquerda / Sobreposta) */}
      <div className="absolute top-[15%] left-0 w-[45%] h-[80%] bg-white rounded-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] border border-slate-200 overflow-hidden transform -rotate-2 hover:rotate-0 transition-transform duration-500 z-20">
        <div className="bg-slate-50 p-3 border-b border-slate-100 flex justify-between items-center">
          <span className="font-bold text-slate-700 text-xs flex items-center gap-1">
            <FileText size={12} /> Requisições
          </span>
          <div className="flex gap-1">
            <Search size={12} className="text-slate-400" />
            <Filter size={12} className="text-slate-400" />
          </div>
        </div>
        <div className="p-2 space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-2 bg-white border border-slate-100 rounded shadow-sm hover:border-green-200 transition-colors cursor-default"
            >
              <div className="flex justify-between mb-1">
                <span className="text-[10px] font-bold text-slate-700">REQ-00{i}</span>
                <span className="text-[8px] bg-slate-100 px-1 rounded text-slate-500">Hoje</span>
              </div>
              <div className="w-2/3 h-2 bg-slate-100 rounded mb-1"></div>
              <div className="flex justify-between items-center mt-2">
                <div className="w-4 h-4 rounded-full bg-slate-200"></div>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${i === 1 ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"}`}
                >
                  {i === 1 ? "Pendente" : "Cotando"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TELA 3: DETALHES / COTAÇÃO (Direita / Sobreposta) */}
      <div className="absolute bottom-[5%] right-0 w-[50%] h-[60%] bg-white rounded-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] border border-slate-200 overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-500 z-30">
        <div className="bg-[#107c50] h-1 w-full"></div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Cotação #4092</h4>
              <p className="text-[10px] text-slate-500">3 Fornecedores respondendo</p>
            </div>
            <div className="bg-blue-50 text-blue-600 p-1.5 rounded-lg">
              <Calculator size={16} />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2 bg-green-50/50 border border-green-100 rounded-lg">
              <div className="w-8 h-8 rounded bg-white border border-slate-200 flex items-center justify-center font-bold text-[10px] text-slate-600">
                A
              </div>
              <div className="flex-1">
                <div className="w-16 h-2 bg-slate-200 rounded mb-1"></div>
                <div className="w-10 h-2 bg-green-200 rounded"></div>
              </div>
              <CheckCircle2 size={14} className="text-green-500" />
            </div>
            <div className="flex items-center gap-3 p-2 bg-white border border-slate-100 rounded-lg opacity-60">
              <div className="w-8 h-8 rounded bg-slate-50 border border-slate-200"></div>
              <div className="flex-1">
                <div className="w-16 h-2 bg-slate-200 rounded mb-1"></div>
                <div className="w-12 h-2 bg-slate-100 rounded"></div>
              </div>
            </div>
          </div>
          <button className="w-full mt-4 bg-[#107c50] text-white text-[10px] font-bold py-2 rounded hover:bg-[#0d6942]">
            Aprovar Melhor Preço
          </button>
        </div>
      </div>

      {/* TELA 4: MODAL MOBILE (Flutuante Topo Direita) */}
      <div className="absolute top-[10%] right-[5%] w-[160px] bg-white rounded-xl shadow-xl border border-slate-100 p-3 animate-bounce-slow z-40">
        <div className="flex items-start gap-2">
          <div className="bg-green-100 text-green-600 p-1.5 rounded-full mt-0.5">
            <CheckCircle2 size={12} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-800 leading-tight">Aprovação Solicitada</p>
            <p className="text-[8px] text-slate-500 leading-tight mt-0.5">Notebook Dell i7</p>
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          <button className="flex-1 bg-[#107c50] text-white text-[8px] font-bold py-1 rounded">Aprovar</button>
          <button className="flex-1 bg-slate-100 text-slate-600 text-[8px] font-bold py-1 rounded">Ver</button>
        </div>
      </div>
    </div>
  );
};

// --- PÁGINA PRINCIPAL ---
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
          {/* === 1. HERO SECTION (Layout Ajustado) === */}
          <section className="px-6 md:px-12 pt-10 pb-16 lg:pt-16 lg:pb-20 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-12 min-h-[550px]">
            {/* Texto Hero */}
            {/* max-w aumentado para 650px para evitar quebra de linha indesejada */}
            <div className="flex-1 text-center lg:text-left max-w-[650px] relative z-30">
              {/* TÍTULO ESTÁTICO (Sem Typewriter, Tamanho Ajustado) */}
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

            {/* Composição de Telas (HeroAppScreens) */}
            <div
              className="flex-1 w-full animate-fade-in opacity-0 scale-95 origin-center relative z-20"
              style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
            >
              <HeroAppScreens />
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
