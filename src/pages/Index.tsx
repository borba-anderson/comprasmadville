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
  Zap,
  BarChart,
  Users,
  ArrowUpRight,
  Check,
  Activity,
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
// OPÇÃO 2: HERO BENTO GRID MODERNIZADO (ATIVO)
// Foco: Design "Tech", Gráficos CSS e Glassmorphism
// ==================================================================================

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
                <Check size={12} strokeWidth={4} className="text-white" />
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
            {/* Texto Hero */}
            <div className="flex-1 text-center lg:text-left max-w-[650px] relative z-30">
              {/* Título Ajustado: "Central de Compras e Requisições" (VOLTOU AO ORIGINAL) */}
              <h1 className="font-jakarta text-[3rem] sm:text-5xl lg:text-[4rem] font-extrabold text-[#0F172A] mb-5 tracking-tight leading-[1.1] max-w-[700px]">
                Central de Compras <br />
                <span className="text-[#008651]">e Requisições.</span>
              </h1>

              <p className="text-slate-500 text-base md:text-lg font-medium leading-relaxed max-w-lg mx-auto lg:mx-0 mb-8">
                Centralize seus pedidos de compra em um único lugar. Mais agilidade, transparência e controle para sua
                gestão.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link to="/painel">
                  <button className="bg-[#008651] hover:bg-[#006e42] text-white text-base font-bold px-8 py-3.5 rounded-full shadow-lg shadow-green-900/10 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
                    Acessar o Painel <ArrowRight size={18} />
                  </button>
                </Link>
              </div>
            </div>

            {/* Nova Composição: Bento Grid Moderno */}
            <div className="flex-1 w-full flex justify-center lg:justify-end relative z-20 lg:-mr-10">
              <HeroBentoGrid />
            </div>
          </section>

          {/* Logos */}
          <div className="pb-10 relative z-20 border-b border-slate-100/50">
            <LogoMarquee />
          </div>

          {/* === 2. SAUDAÇÃO E STATS === */}
          {user && (
            <section className="mt-10 mb-8 px-6 md:px-12 animate-fade-in relative z-20">
              <UserGreeting />
              <div className="mt-6">
                <QuickStats />
              </div>
            </section>
          )}

          {/* === 3. AÇÕES RÁPIDAS === */}
          <div className="mb-16 px-6 md:px-12 relative z-20">
            <ActionCards />
          </div>

          {/* === 4. COMO FUNCIONA === */}
          <section className="py-16 bg-white relative overflow-hidden border-t border-slate-100">
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>

            <div className="max-w-[1280px] mx-auto px-6 md:px-12 relative z-10">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <span className="text-[#008651] font-bold tracking-wider text-xs uppercase bg-green-50 px-3 py-1 rounded-full border border-green-100">
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
