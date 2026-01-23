import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/contexts/AuthContext";
import { FileText, LayoutDashboard, ShoppingCart, Bell, User, CheckCircle2, Calculator, Menu } from "lucide-react";
import {
  UserGreeting,
  QuickStats,
  ActionCards,
  LogoMarquee,
  HeroFlowDiagram, // O diagrama que editamos antes continua aqui
  WorkflowTimeline,
} from "@/components/home";

// --- COMPONENTE INTERNO: EFEITO DE DIGITAÇÃO ---
const TypewriterEffect = ({
  text,
  speed = 40,
  initialDelay = 0,
  className = "",
  hideCursorOnFinish = false,
}: {
  text: string;
  speed?: number;
  initialDelay?: number;
  className?: string;
  hideCursorOnFinish?: boolean;
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    setDisplayedText("");
    setShowCursor(initialDelay === 0);
    const startTimeout = setTimeout(() => {
      setShowCursor(true);
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayedText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
          if (hideCursorOnFinish) setShowCursor(false);
        }
      }, speed);
      return () => clearInterval(interval);
    }, initialDelay);
    return () => clearTimeout(startTimeout);
  }, [text, speed, initialDelay, hideCursorOnFinish]);

  return (
    <span className={className}>
      {displayedText}
      {showCursor && (
        <span className="ml-1 border-r-[5px] border-slate-900 animate-pulse inline-block align-middle h-[0.9em]">
          &nbsp;
        </span>
      )}
    </span>
  );
};

// --- COMPONENTE INTERNO: TELAS DO SISTEMA (MASHUP 3D) ---
// Este componente recria visualmente o painel para dar o efeito "agressivo"
const HeroAppScreens = () => {
  return (
    <div className="relative w-full max-w-[850px] mx-auto h-[400px] md:h-[500px] lg:h-[550px] [perspective:2000px] z-20 my-10 lg:my-0">
      {/* --- TELA FLUTUANTE ESQUERDA (Lista de Requisições) --- */}
      {/* Simula a tela de listagem, rotacionada para trás */}
      <div className="absolute top-12 -left-4 md:-left-12 w-[90%] h-full bg-white rounded-xl shadow-2xl border border-slate-200/80 overflow-hidden transform [transform:rotateY(-15deg)_rotateZ(2deg)_scale(0.9)] opacity-90 transition-all duration-500 hover:opacity-100 hover:[transform:rotateY(0deg)_scale(0.95)] hover:z-30 hidden sm:block">
        {/* Fake Header */}
        <div className="bg-[#107c50] p-3 flex justify-between items-center h-14">
          <div className="flex items-center gap-2">
            <Menu className="text-white w-5 h-5" />
            <span className="text-white font-semibold text-xs md:text-sm">Requisições</span>
          </div>
        </div>
        {/* Fake Body */}
        <div className="p-4 bg-slate-50 h-full">
          <div className="flex justify-between mb-4">
            <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2">
              <FileText size={16} /> Minhas Solicitações
            </h3>
            <div className="bg-[#107c50] text-white text-xs px-3 py-1.5 rounded shadow-sm">+ Nova</div>
          </div>
          <div className="space-y-2.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="font-bold text-slate-700 text-xs">REQ-2026-{100 + i}</p>
                  <p className="text-[10px] text-slate-500">Materiais de Escritório - Setor {i}</p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${i === 1 ? "bg-orange-100 text-orange-600" : i === 2 ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"}`}
                >
                  {i === 1 ? "Pendente" : i === 2 ? "Cotação" : "Aprovado"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- TELA PRINCIPAL (Dashboard) --- */}
      {/* Esta é a tela central, maior e em destaque */}
      <div className="relative z-20 w-full h-full bg-[#F8FAFC] rounded-2xl shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] border-[4px] border-white overflow-hidden flex flex-col transform transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2">
        {/* Mockup Header (Baseado na sua imagem) */}
        <div className="bg-[#107c50] px-4 md:px-6 py-3 flex justify-between items-center shrink-0 h-16">
          <div className="flex items-center gap-3">
            <div className="font-bold text-white tracking-tighter text-lg">GMAD</div>
            <div className="w-[1px] h-6 bg-white/30 hidden md:block"></div>
            <h1 className="text-white font-medium text-xs md:text-sm truncate">
              Central de Compras Madville | Curitiba
            </h1>
          </div>
          <div className="flex items-center gap-3 text-white/90">
            <Bell size={18} />
            <div className="flex items-center gap-2 bg-[#0d6942] pl-2 pr-3 py-1 rounded-full border border-[#1a8a5d]">
              <User size={14} />
              <span className="text-xs font-medium hidden md:block">Ruan Wilt</span>
            </div>
          </div>
        </div>

        {/* Mockup Body (Dashboard Stats) */}
        <div className="p-4 md:p-8 flex-1 overflow-hidden">
          {/* Abas */}
          <div className="flex gap-3 mb-6">
            <div className="flex items-center gap-2 bg-white text-[#107c50] font-bold px-4 py-2 rounded-lg shadow-sm border border-slate-100 text-sm">
              <FileText size={16} /> Visão Geral
            </div>
            <div className="flex items-center gap-2 text-slate-400 font-medium px-4 py-2 rounded-lg text-sm">
              <LayoutDashboard size={16} /> Relatórios
            </div>
          </div>

          {/* Cards de Status (Idêntico ao print) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
            {/* Total */}
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total</span>
                <FileText size={16} className="text-slate-300" />
              </div>
              <div className="text-2xl md:text-3xl font-extrabold text-slate-800">73</div>
            </div>
            {/* Pendentes */}
            <div className="bg-[#107c50]/5 p-4 rounded-xl border border-[#107c50]/10 shadow-sm">
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">Pendentes</span>
                <ShoppingCart size={16} className="text-orange-400" />
              </div>
              <div className="text-2xl md:text-3xl font-extrabold text-orange-600">8</div>
            </div>
            {/* Aprovados */}
            <div className="bg-green-50 p-4 rounded-xl border border-green-100 shadow-sm">
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Aprovados</span>
                <CheckCircle2 size={16} className="text-green-500" />
              </div>
              <div className="text-2xl md:text-3xl font-extrabold text-green-600">37</div>
            </div>
            {/* Cotando */}
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 shadow-sm hidden sm:block">
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Cotando</span>
                <Calculator size={16} className="text-blue-400" />
              </div>
              <div className="text-2xl md:text-3xl font-extrabold text-blue-600">5</div>
            </div>
          </div>

          {/* Fake Chart Area */}
          <div className="w-full h-32 md:h-48 bg-white rounded-xl border border-slate-100 shadow-sm p-4 relative overflow-hidden">
            <div className="absolute top-4 left-4 text-xs font-bold text-slate-400 uppercase">Movimentação Recente</div>
            <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-green-50 to-transparent opacity-50"></div>
            <div className="flex items-end justify-between h-full px-2 pb-2 gap-2">
              {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
                <div
                  key={i}
                  className="w-full bg-[#107c50]/20 rounded-t-sm hover:bg-[#107c50]/40 transition-colors"
                  style={{ height: `${h}%` }}
                ></div>
              ))}
            </div>
          </div>
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
          {/* === 1. HERO SECTION (NOVA) === */}
          <section className="px-6 md:px-12 pt-12 pb-24 lg:pt-20 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 min-h-[650px]">
            {/* Texto Hero */}
            <div className="flex-1 text-center lg:text-left max-w-[600px] relative z-30">
              <h1 className="font-jakarta text-[2.8rem] sm:text-5xl md:text-[4rem] leading-[1.1] font-extrabold text-[#0F172A] mb-8 tracking-tight drop-shadow-sm">
                <div className="block min-h-[1.15em]">
                  <TypewriterEffect text="Portal de Solicitações" speed={35} hideCursorOnFinish={true} />
                </div>
                <div className="block min-h-[1.15em] text-[#107c50]">
                  <TypewriterEffect text="de Suprimentos." speed={35} initialDelay={1100} hideCursorOnFinish={false} />
                </div>
              </h1>

              <p
                className="text-slate-600 text-lg md:text-[1.25rem] font-medium leading-relaxed max-w-xl mx-auto lg:mx-0 animate-fade-in opacity-0 mb-10"
                style={{ animationDelay: "1.8s", animationFillMode: "forwards" }}
              >
                O controle total das suas compras corporativas em um único painel inteligente. Mais agilidade,
                transparência e governança.
              </p>

              <div
                className="animate-fade-in opacity-0 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                style={{ animationDelay: "2.2s", animationFillMode: "forwards" }}
              >
                <button className="bg-[#107c50] hover:bg-[#0d6942] text-white text-lg font-bold px-8 py-4 rounded-full shadow-lg shadow-green-900/10 transition-all hover:scale-105 active:scale-95">
                  Acessar o Painel
                </button>
              </div>
            </div>

            {/* Nova Composição de Telas (HeroAppScreens) */}
            <div
              className="flex-1 w-full animate-fade-in opacity-0 scale-95 origin-center relative z-20 mt-8 lg:mt-0"
              style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
            >
              <HeroAppScreens />
            </div>
          </section>

          {/* Logos */}
          <div className="pb-16 relative z-20">
            <LogoMarquee />
          </div>

          {/* === 2. SEÇÃO COMO FUNCIONA (Antigo Diagrama) === */}
          <section className="py-24 bg-white relative overflow-hidden border-t border-slate-100">
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>

            <div className="max-w-[1280px] mx-auto px-6 md:px-12 relative z-10">
              <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in">
                <span className="text-[#107c50] font-bold tracking-wider text-sm uppercase bg-green-50 px-3 py-1 rounded-full border border-green-100">
                  Workflow Inteligente
                </span>
                <h2 className="text-3xl md:text-5xl font-extrabold font-jakarta text-slate-900 mt-4 mb-6 tracking-tight">
                  Fluxo transparente, <span className="text-[#107c50]">do pedido à entrega.</span>
                </h2>
                <p className="text-lg text-slate-600 font-medium leading-relaxed">
                  Entenda como o portal conecta solicitantes, compradores e aprovadores em um processo contínuo e sem
                  falhas.
                </p>
              </div>

              {/* Diagrama de Fluxo (Que já ajustamos para ser minimalista) */}
              <div className="flex justify-center">
                <HeroFlowDiagram />
              </div>
            </div>
          </section>

          {user && (
            <section className="my-20 px-6 md:px-12 animate-fade-in">
              <UserGreeting />
              <QuickStats />
            </section>
          )}

          <div className="my-24 px-6 md:px-12">
            <ActionCards />
          </div>

          <WorkflowTimeline />

          <footer className="py-12 text-center mt-20 border-t border-slate-200 bg-white">
            <p className="text-slate-500 text-sm font-medium font-jakarta">
              © 2026 GMAD Madville | Curitiba - Portal de Solicitações de Suprimentos
            </p>
            <p className="text-slate-400 text-xs mt-3 font-jakarta">
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
