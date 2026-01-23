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
// 1. COMPONENTES VISUAIS (MOCKS) - RÉPLICAS
// ==========================================

// MOCK 1: TELA DE LOGIN (Mantida simples)
const MockAuthScreen = () => (
  <div className="w-full h-full bg-[#008651] flex flex-col rounded-xl border-[3px] border-white/50 shadow-2xl relative overflow-hidden">
    <div className="bg-[#006e42] h-7 flex items-center px-3 text-white text-[8px] font-bold">
      <LogIn size={10} className="mr-1" /> Portal GMAD
    </div>
    <div className="flex-1 flex items-center justify-center p-3">
      <div className="w-full bg-white rounded-lg shadow-lg p-3 transform scale-95">
        <div className="flex bg-slate-100 p-0.5 rounded-md mb-2">
          <div className="flex-1 py-1 text-center text-[7px] font-bold bg-white text-[#008651] shadow-sm rounded">
            Login
          </div>
          <div className="flex-1 py-1 text-center text-[7px] font-bold text-slate-400">Cadastro</div>
        </div>
        <div className="space-y-1.5">
          <div className="h-6 w-full bg-slate-50 border border-slate-200 rounded"></div>
          <div className="h-6 w-full bg-slate-50 border border-slate-200 rounded flex items-center justify-end px-2">
            <div className="w-2 h-2 rounded-full bg-slate-200"></div>
          </div>
          <div className="h-6 w-full bg-[#008651] rounded mt-1 flex items-center justify-center text-white text-[8px] font-bold">
            Entrar
          </div>
        </div>
      </div>
    </div>
  </div>
);

// MOCK 2: PAINEL DE REQUISIÇÕES (Baseado na image_6bb315.png)
const MockPainelScreen = () => (
  <div className="w-full h-full bg-[#008651] flex flex-col rounded-xl overflow-hidden border-[4px] border-white shadow-2xl font-sans">
    {/* Header do Sistema */}
    <div className="h-8 flex items-center justify-between px-3 shrink-0">
      <div className="flex items-center gap-1.5">
        <div className="text-[8px] font-extrabold text-white tracking-tighter italic">GMAD</div>
        <div className="h-3 w-[1px] bg-white/30"></div>
        <span className="text-[7px] font-medium text-white">Central de Compras Madville | Curitiba</span>
      </div>
      <div className="flex gap-1.5 items-center">
        <Bell size={9} className="text-white/90" />
        <div className="flex items-center gap-1 bg-white/10 px-1.5 py-0.5 rounded-full border border-white/10">
          <User size={8} className="text-white" />
          <span className="text-[6px] text-white font-medium">Ruan Wilt</span>
        </div>
      </div>
    </div>

    {/* Cards de Status (Réplica exata com 7 cards) */}
    <div className="px-2 pb-2 flex gap-1 overflow-hidden">
      {/* Card Total */}
      <div className="bg-white rounded p-1 min-w-[35px] flex-1 shadow-sm flex flex-col justify-between h-9">
        <div className="flex justify-between items-start">
          <span className="text-[4px] text-slate-500 font-bold uppercase">TOTAL</span>
          <FileText size={5} className="text-slate-300" />
        </div>
        <div className="text-[10px] font-bold text-slate-800 leading-none">76</div>
      </div>
      {/* Card Pendentes */}
      <div className="bg-white rounded p-1 min-w-[35px] flex-1 shadow-sm flex flex-col justify-between h-9 border-l-2 border-orange-100">
        <div className="flex justify-between items-start">
          <span className="text-[4px] text-orange-500 font-bold uppercase">PENDENTES</span>
          <Clock size={5} className="text-orange-200" />
        </div>
        <div className="text-[10px] font-bold text-orange-600 leading-none">11</div>
      </div>
      {/* Card Em Análise */}
      <div className="bg-white rounded p-1 min-w-[35px] flex-1 shadow-sm flex flex-col justify-between h-9 border-l-2 border-blue-100">
        <div className="flex justify-between items-start">
          <span className="text-[4px] text-blue-500 font-bold uppercase">ANÁLISE</span>
          <TrendingUp size={5} className="text-blue-200" />
        </div>
        <div className="text-[10px] font-bold text-blue-600 leading-none">0</div>
      </div>
      {/* Card Aprovados */}
      <div className="bg-white rounded p-1 min-w-[35px] flex-1 shadow-sm flex flex-col justify-between h-9 border-l-2 border-green-100">
        <div className="flex justify-between items-start">
          <span className="text-[4px] text-green-500 font-bold uppercase">APROVADOS</span>
          <CheckCircle size={5} className="text-green-200" />
        </div>
        <div className="text-[10px] font-bold text-green-600 leading-none">1</div>
      </div>
      {/* Card Cotando */}
      <div className="bg-white rounded p-1 min-w-[35px] flex-1 shadow-sm flex flex-col justify-between h-9 border-l-2 border-purple-100">
        <div className="flex justify-between items-start">
          <span className="text-[4px] text-purple-500 font-bold uppercase">COTANDO</span>
          <Package size={5} className="text-purple-300" />
        </div>
        <div className="text-[10px] font-bold text-purple-800 leading-none">5</div>
      </div>
      {/* Card Comprados */}
      <div className="bg-white rounded p-1 min-w-[35px] flex-1 shadow-sm flex flex-col justify-between h-9 border-l-2 border-teal-100">
        <div className="flex justify-between items-start">
          <span className="text-[4px] text-teal-500 font-bold uppercase">COMPRADOS</span>
          <ShoppingCart size={5} className="text-teal-300" />
        </div>
        <div className="text-[10px] font-bold text-teal-700 leading-none">37</div>
      </div>
      {/* Card Rejeitados */}
      <div className="bg-white rounded p-1 min-w-[35px] flex-1 shadow-sm flex flex-col justify-between h-9 border-l-2 border-red-100">
        <div className="flex justify-between items-start">
          <span className="text-[4px] text-red-500 font-bold uppercase">REJEITADOS</span>
          <XCircle size={5} className="text-red-300" />
        </div>
        <div className="text-[10px] font-bold text-red-600 leading-none">1</div>
      </div>
    </div>

    {/* Abas e Tabela (Fundo Branco Arredondado) */}
    <div className="bg-[#F1F5F9] flex-1 mx-3 mb-3 rounded-t-lg overflow-hidden flex flex-col">
      {/* Abas */}
      <div className="flex gap-1 px-1 pt-1">
        <div className="bg-white text-[#008651] px-2 py-1 rounded-t text-[6px] font-bold flex items-center gap-1 border-t border-x border-white shadow-sm">
          <FileText size={6} /> Requisições
        </div>
        <div className="bg-transparent text-slate-500 px-2 py-1 text-[6px] font-bold flex items-center gap-1">
          <DollarSign size={6} /> Dashboard
        </div>
      </div>

      {/* Toolbar de Filtros */}
      <div className="bg-white p-1.5 border-b border-slate-200 flex gap-1 items-center">
        <div className="h-4 flex-1 bg-white border border-slate-200 rounded flex items-center px-1 gap-1">
          <Search size={6} className="text-slate-300" />
          <span className="text-[5px] text-slate-300">Buscar item...</span>
        </div>
        <div className="h-4 w-10 bg-white border border-slate-200 rounded flex items-center justify-center text-[5px] text-slate-600 font-medium">
          Empresa
        </div>
        <div className="h-4 w-8 bg-white border border-slate-200 rounded flex items-center justify-center text-[5px] text-slate-600 font-medium">
          Status
        </div>
        <div className="h-4 w-12 bg-white border border-slate-200 rounded flex items-center justify-center gap-0.5 text-[5px] font-bold text-slate-600">
          <Filter size={6} /> Mais filtros
        </div>
      </div>

      {/* Cabeçalho Tabela */}
      <div className="flex bg-slate-50 px-2 py-1.5 border-b border-slate-200">
        <div className="w-[35%] text-[5px] font-bold text-slate-400">ITEM</div>
        <div className="w-[25%] text-[5px] font-bold text-slate-400">SOLICITANTE</div>
        <div className="w-[15%] text-[5px] font-bold text-slate-400 text-center">PRIORIDADE</div>
        <div className="w-[15%] text-[5px] font-bold text-slate-400 text-center">STATUS</div>
        <div className="w-[10%] text-[5px] font-bold text-slate-400 text-right">DATA</div>
      </div>

      {/* Linhas (Dados Reais do Print) */}
      <div className="flex-1 bg-white p-1 space-y-0.5 overflow-hidden">
        {/* Item 1 */}
        <div className="flex px-1 py-1 border-b border-slate-50 items-center hover:bg-slate-50">
          <div className="w-[35%]">
            <div className="text-[6px] font-bold text-slate-700">Notebook</div>
            <div className="text-[4px] text-slate-400">REQ-20260123...</div>
          </div>
          <div className="w-[25%]">
            <div className="text-[6px] font-medium text-slate-600">Willian Henrique</div>
            <div className="text-[4px] text-slate-400">Comercial</div>
          </div>
          <div className="w-[15%] text-center">
            <div className="inline-flex items-center gap-0.5 text-[5px] font-bold text-yellow-600 bg-yellow-50 px-1 rounded">
              <div className="w-1 h-1 rounded-full bg-yellow-500"></div> Média
            </div>
          </div>
          <div className="w-[15%] text-center">
            <span className="bg-orange-100 text-orange-700 text-[4px] font-bold px-1 py-0.5 rounded border border-orange-200">
              PENDENTE
            </span>
          </div>
          <div className="w-[10%] text-[5px] text-slate-500 text-right">23/01</div>
        </div>

        {/* Item 2 */}
        <div className="flex px-1 py-1 border-b border-slate-50 items-center hover:bg-slate-50">
          <div className="w-[35%]">
            <div className="text-[6px] font-bold text-slate-700">Anti-aderente rosa</div>
            <div className="text-[4px] text-slate-400">REQ-20260123...</div>
          </div>
          <div className="w-[25%]">
            <div className="text-[6px] font-medium text-slate-600">Eliane Cristina</div>
            <div className="text-[4px] text-slate-400">Almoxarifado</div>
          </div>
          <div className="w-[15%] text-center">
            <div className="inline-flex items-center gap-0.5 text-[5px] font-bold text-yellow-600 bg-yellow-50 px-1 rounded">
              <div className="w-1 h-1 rounded-full bg-yellow-500"></div> Média
            </div>
          </div>
          <div className="w-[15%] text-center">
            <span className="bg-orange-100 text-orange-700 text-[4px] font-bold px-1 py-0.5 rounded border border-orange-200">
              PENDENTE
            </span>
          </div>
          <div className="w-[10%] text-[5px] text-slate-500 text-right">23/01</div>
        </div>

        {/* Item 3 */}
        <div className="flex px-1 py-1 border-b border-slate-50 items-center hover:bg-slate-50">
          <div className="w-[35%]">
            <div className="text-[6px] font-bold text-slate-700">Alicate universal</div>
            <div className="text-[4px] text-slate-400">REQ-20260122...</div>
          </div>
          <div className="w-[25%]">
            <div className="text-[6px] font-medium text-slate-600">Kesia de Souza</div>
            <div className="text-[4px] text-slate-400">Almoxarifado</div>
          </div>
          <div className="w-[15%] text-center">
            <div className="inline-flex items-center gap-0.5 text-[5px] font-bold text-yellow-600 bg-yellow-50 px-1 rounded">
              <div className="w-1 h-1 rounded-full bg-yellow-500"></div> Média
            </div>
          </div>
          <div className="w-[15%] text-center">
            <span className="bg-blue-100 text-blue-700 text-[4px] font-bold px-1 py-0.5 rounded border border-blue-200">
              COTANDO
            </span>
          </div>
          <div className="w-[10%] text-[5px] text-slate-500 text-right">22/01</div>
        </div>
      </div>
    </div>
  </div>
);

// MOCK 3: FORMULÁRIO DE REQUISIÇÃO (Baseado na image_6bac10.png)
const MockFormScreen = () => (
  <div className="w-full h-full bg-white flex flex-col rounded-xl overflow-hidden border-[3px] border-white shadow-2xl relative font-sans">
    {/* Header "Voltar" */}
    <div className="px-3 py-2 text-[6px] text-slate-400 flex items-center gap-1">
      <ArrowRight size={6} className="rotate-180" /> Voltar ao início
    </div>

    {/* Stepper */}
    <div className="px-6 py-2 border-b border-slate-100">
      <div className="flex justify-between items-center relative z-10">
        {[1, 2, 3, 4, 5].map((step) => (
          <div key={step} className="flex flex-col items-center gap-1">
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center text-[6px] font-bold ${step === 1 ? "bg-slate-800 text-white" : "bg-white border border-slate-200 text-slate-300"}`}
            >
              {step}
            </div>
            <span className={`text-[4px] font-bold ${step === 1 ? "text-slate-800" : "text-slate-300"}`}>
              {step === 1 ? "Solicitante" : step === 2 ? "Item" : step === 3 ? "Justif." : step === 4 ? "Anexo" : "Fim"}
            </span>
          </div>
        ))}
      </div>
      {/* Linha do Stepper */}
      <div className="absolute top-[26px] left-[15%] w-[70%] h-[1px] bg-slate-100 -z-0"></div>
    </div>

    {/* Conteúdo do Form */}
    <div className="p-4 flex-1 flex flex-col">
      <h3 className="text-[8px] font-bold text-slate-800 mb-0.5">Dados do Solicitante</h3>
      <p className="text-[5px] text-slate-400 mb-3">Confirme seus dados para identificação da requisição</p>

      <div className="grid grid-cols-2 gap-2 mb-2">
        <div className="space-y-0.5">
          <label className="text-[5px] font-bold text-slate-600 block">Empresa *</label>
          <div className="h-5 w-full border border-slate-200 rounded flex items-center justify-between px-1.5 bg-white">
            <span className="text-[5px] text-slate-700">GMAD Madville</span>
            <ChevronDown size={6} className="text-slate-400" />
          </div>
        </div>
        <div className="space-y-0.5">
          <label className="text-[5px] font-bold text-slate-600 block">Nome Completo *</label>
          <div className="h-5 w-full border border-slate-200 rounded flex items-center px-1.5 bg-white">
            <span className="text-[5px] text-slate-700">Ruan Wilt</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-2">
        <div className="space-y-0.5">
          <label className="text-[5px] font-bold text-slate-600 block">Email Corporativo *</label>
          <div className="h-5 w-full border border-slate-200 rounded flex items-center px-1.5 bg-white">
            <span className="text-[5px] text-slate-700">ruan@madville...</span>
          </div>
        </div>
        <div className="space-y-0.5">
          <label className="text-[5px] font-bold text-slate-600 block">Telefone *</label>
          <div className="h-5 w-full border border-slate-200 rounded flex items-center px-1.5 bg-white">
            <span className="text-[5px] text-slate-400">(00) 00000-0000</span>
          </div>
        </div>
      </div>

      <div className="mt-auto flex justify-between pt-2 border-t border-slate-100">
        <div className="h-5 px-2 rounded border border-slate-200 flex items-center text-[5px] font-bold text-slate-500">
          Anterior
        </div>
        <div className="h-5 px-3 rounded bg-slate-800 flex items-center text-[5px] font-bold text-white gap-1">
          Próximo <ArrowRight size={6} />
        </div>
      </div>
    </div>
  </div>
);

// MOCK 4: DASHBOARD ANALYTICS (Baseado na image_6bab39.png)
const MockChartScreen = () => (
  <div className="w-full h-full bg-[#F8FAFC] flex flex-col rounded-xl overflow-hidden border-[3px] border-white shadow-2xl p-2.5">
    {/* Cards de Indicadores (Topo Direita do print) */}
    <div className="grid grid-cols-2 gap-1.5 mb-2">
      <div className="bg-red-50 p-1.5 rounded border border-red-100">
        <div className="text-[4px] text-red-500 font-bold mb-0.5 flex items-center gap-0.5">
          <XCircle size={4} /> Taxa de Conclusão
        </div>
        <div className="text-[10px] font-bold text-red-600">17%</div>
      </div>
      <div className="bg-green-50 p-1.5 rounded border border-green-100">
        <div className="text-[4px] text-green-600 font-bold mb-0.5 flex items-center gap-0.5">
          <Clock size={4} /> Tempo Médio
        </div>
        <div className="text-[10px] font-bold text-green-700">1.6d</div>
      </div>
    </div>

    {/* Funil do Processo (Topo Esquerda do print) */}
    <div className="bg-white p-2 rounded border border-slate-100 flex-1 flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <span className="text-[5px] font-bold text-slate-700">Funil do Processo</span>
        <span className="text-[4px] bg-red-100 text-red-600 px-1 rounded font-bold">20 atrasadas</span>
      </div>
      <div className="space-y-1">
        {/* Pendentes */}
        <div className="flex items-center gap-1">
          <span className="text-[4px] w-8 text-slate-400">Pendentes</span>
          <div className="flex-1 h-2 bg-orange-400 rounded-r relative">
            <span className="absolute left-1 text-[4px] text-white font-bold top-[1px]">11</span>
          </div>
        </div>
        {/* Comprados */}
        <div className="flex items-center gap-1">
          <span className="text-[4px] w-8 text-slate-400">Comprados</span>
          <div className="flex-1 h-2 bg-teal-500 rounded-r relative w-[80%]">
            <span className="absolute left-1 text-[4px] text-white font-bold top-[1px]">37</span>
          </div>
        </div>
        {/* Recebidos */}
        <div className="flex items-center gap-1">
          <span className="text-[4px] w-8 text-slate-400">Recebidos</span>
          <div className="flex-1 h-2 bg-green-600 rounded-r relative w-[40%]">
            <span className="absolute left-1 text-[4px] text-white font-bold top-[1px]">12</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ==========================================
// 2. COMPOSIÇÃO 3D (PAINEL VERDE + FORM + DASHBOARD)
// ==========================================

const Hero3DComposition = () => {
  return (
    <div className="relative w-full h-[250px] md:h-[350px] flex items-center justify-center [perspective:1000px] overflow-visible mt-4 lg:mt-0 scale-[0.45] md:scale-[0.65] origin-center lg:origin-right">
      <div className="relative w-[280px] md:w-[550px] lg:w-[650px] h-[300px] md:h-[400px] transform [transform-style:preserve-3d] [transform:rotateX(10deg)_rotateY(-15deg)_rotateZ(2deg)] transition-transform duration-700 ease-out hover:[transform:rotateX(5deg)_rotateY(-5deg)_rotateZ(0deg)]">
        {/* 1. FUNDO (DASHBOARD ANALYTICS - image_6bab39.png) */}
        <div className="absolute top-[-20px] right-[-40px] w-[240px] md:w-[320px] h-[200px] md:h-[260px] transform [transform:translateZ(-80px)] opacity-90 bg-white rounded-xl shadow-xl border border-slate-200">
          <MockChartScreen />
        </div>

        {/* 2. CENTRO (PAINEL OFICIAL VERDE - image_6bb315.png) */}
        <div className="absolute top-0 left-0 w-full h-full transform [transform:translateZ(20px)] shadow-[0_25px_50px_-12px_rgba(0,134,81,0.4)] bg-[#008651] rounded-xl z-20 border-white ring-2 ring-[#008651]/20">
          <MockPainelScreen />
        </div>

        {/* 3. FLUTUANTE ESQUERDA (LOGIN) */}
        <div className="absolute top-[10%] -left-[10%] w-[160px] md:w-[200px] h-[200px] md:h-[260px] transform [transform:translateZ(60px)] shadow-[0_20px_40px_rgba(0,0,0,0.15)] z-30 animate-float">
          <MockAuthScreen />
        </div>

        {/* 4. FLUTUANTE DIREITA (FORMULÁRIO - image_6bac10.png) */}
        <div className="absolute bottom-[-10%] -right-[15%] w-[260px] md:w-[320px] h-[280px] md:h-[340px] transform [transform:translateZ(90px)] shadow-[0_30px_60px_rgba(0,0,0,0.2)] z-40 animate-float-delayed">
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
            {/* Texto Hero */}
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
                  <button className="bg-[#008651] hover:bg-[#006e42] text-white text-base font-bold px-8 py-3.5 rounded-full shadow-lg shadow-green-900/10 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
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
