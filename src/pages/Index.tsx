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
// OPÇÃO 2: BENTO GRID (ATIVA)
// Foco: Agilidade, Números e Tecnologia
// ==================================================================================
const HeroBentoGrid = () => {
  return (
    <div className="w-full max-w-[550px] h-[400px] grid grid-cols-2 grid-rows-2 gap-4 lg:ml-auto scale-[0.9] md:scale-100 origin-center lg:origin-right">
      {/* Bloco 1: Principal - Escuro (Destaque Marca) */}
      <div className="row-span-2 bg-[#008651] rounded-2xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden group border border-green-700/50">
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
// 4. PÁGINA PRINCIPAL
// ==========================================

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white relative overflow-x-hidden font-sans selection:bg-green-100 selection:text-green-900">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap'); .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; } body { font-family: 'Plus Jakarta Sans', sans-serif; }`}</style>

      {/* GMADHeaderBar REMOVIDO conforme solicitado */}

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
              {/* === OPÇÃO 2 ATIVA (Bento Grid) === */}
              <HeroBentoGrid />
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
