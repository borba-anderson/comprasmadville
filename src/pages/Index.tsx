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
  Zap, // Novo
  BarChart, // Novo
  Users, // Novo
  ArrowUpRight, // Novo
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
// OPÇÃO 2: HERO BENTO GRID (SUBSTITUINDO OS MOCKS 3D)
// Foco: Agilidade, Números e Tecnologia
// ==================================================================================

const HeroBentoGrid = () => {
  return (
    <div className="w-full max-w-[550px] h-[400px] grid grid-cols-2 grid-rows-2 gap-4 lg:ml-auto scale-[0.9] md:scale-100 origin-center lg:origin-right select-none">
      {/* Bloco 1: Principal - Escuro (Destaque Marca) */}
      <div className="row-span-2 bg-[#008651] rounded-2xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden group border border-green-700/50 hover:shadow-green-900/20 transition-all duration-500">
        {/* Efeito de Fundo */}
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

      {/* Bloco 2: Gráfico (Performance) */}
      <div className="bg-white rounded-2xl p-5 shadow-xl border border-slate-100 flex flex-col justify-between group hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden">
        <div className="flex justify-between items-start relative z-10">
          <div className="bg-orange-50 p-2.5 rounded-lg text-orange-600 border border-orange-100">
            <BarChart size={22} />
          </div>
          <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1 border border-green-100">
            <ArrowUpRight size={10} /> +24%
          </span>
        </div>
        <div className="relative z-10">
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">850+</div>
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wide">Pedidos/Mês</div>
        </div>
        {/* Decorativo */}
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-orange-50 rounded-full blur-2xl translate-y-1/2 translate-x-1/2"></div>
      </div>

      {/* Bloco 3: Usuários/Conexão (Equipe) */}
      <div className="bg-white rounded-2xl p-5 shadow-xl border border-slate-100 flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 delay-75">
        {/* Pattern Fundo */}
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
              {/* Título Ajustado: CENTRAL DE COMPRAS */}
              <h1 className="font-jakarta text-[3rem] sm:text-5xl lg:text-[4rem] font-extrabold text-[#0F172A] mb-5 tracking-tight leading-[1.1] max-w-[700px]">
                Central de Compras <br />
                <span className="text-[#0F172A]">e Requisições.</span>
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

            {/* Nova Composição: Bento Grid (Opção 2) */}
            <div className="flex-1 w-full flex justify-center lg:justify-end relative z-20">
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
