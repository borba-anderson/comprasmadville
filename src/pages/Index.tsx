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
// 1. COMPONENTES VISUAIS (MOCKS) - RÉPLICAS FIÉIS
// ==========================================

// MOCK 1: TELA DE LOGIN (Simplificada)
const MockAuthScreen = () => (
  <div className="w-full h-full bg-[#008651] flex flex-col rounded-xl border-[2px] border-white/30 shadow-2xl relative overflow-hidden">
    <div className="bg-[#006e42] h-6 flex items-center px-3 text-white text-[8px] font-bold">
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
          <div className="h-5 w-full bg-slate-50 border border-slate-200 rounded"></div>
          <div className="h-5 w-full bg-slate-50 border border-slate-200 rounded flex items-center justify-end px-2">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
          </div>
          <div className="h-5 w-full bg-[#008651] rounded mt-1 flex items-center justify-center text-white text-[8px] font-bold">
            Entrar
          </div>
        </div>
      </div>
    </div>
  </div>
);

// MOCK 2: PAINEL DE REQUISIÇÕES (RÉPLICA FIEL - image_6bb315.png)
const MockPainelScreen = () => (
  <div className="w-full h-full bg-[#008651] flex flex-col rounded-xl overflow-hidden border-[3px] border-white shadow-2xl font-sans">
    {/* Header Topo */}
    <div className="h-7 flex items-center justify-between px-2 shrink-0">
      <div className="flex items-center gap-1.5">
        <div className="text-[7px] font-extrabold text-white tracking-tighter italic">GMAD</div>
        <div className="h-2 w-[1px] bg-white/30"></div>
        <span className="text-[6px] font-medium text-white">Central de Compras Madville | Curitiba</span>
      </div>
      <div className="flex gap-1.5 items-center">
        <Bell size={8} className="text-white/90" />
        <div className="flex items-center gap-1 bg-white/10 px-1 py-0.5 rounded-full border border-white/10">
          <User size={6} className="text-white" />
          <span className="text-[5px] text-white font-medium">Ruan Wilt</span>
        </div>
      </div>
    </div>

    {/* Linha de Cards de Status (Brancos sobre Verde) */}
    <div className="px-2 pb-1.5 flex gap-1 overflow-hidden">
      {[
        { l: "TOTAL", v: "76", c: "slate", i: FileText },
        { l: "PENDENTES", v: "11", c: "orange", i: Clock },
        { l: "EM ANÁLISE", v: "0", c: "blue", i: TrendingUp },
        { l: "APROVADOS", v: "1", c: "green", i: CheckCircle },
        { l: "COTANDO", v: "5", c: "purple", i: Package },
        { l: "COMPRADOS", v: "37", c: "teal", i: ShoppingCart },
        { l: "REJEITADOS", v: "1", c: "red", i: XCircle },
      ].map((card, idx) => (
        <div
          key={idx}
          className={`bg-white rounded-[4px] p-1 min-w-[30px] flex-1 shadow-sm flex flex-col justify-between h-8 ${idx > 0 ? `border-l-2 border-${card.c}-100` : ""}`}
        >
          <div className="flex justify-between items-start">
            <span
              className={`text-[3.5px] text-${card.c === "slate" ? "slate-400" : card.c + "-500"} font-bold uppercase`}
            >
              {card.l}
            </span>
            <card.i size={4} className={`text-${card.c}-300`} />
          </div>
          <div
            className={`text-[9px] font-bold text-${card.c === "slate" ? "slate-700" : card.c + "-600"} leading-none`}
          >
            {card.v}
          </div>
        </div>
      ))}
    </div>

    {/* Área Branca Principal (Conteúdo) */}
    <div className="bg-[#F8FAFC] flex-1 mx-2 mb-2 rounded-[6px] overflow-hidden flex flex-col shadow-inner">
      {/* Abas e Botões Superiores */}
      <div className="bg-white px-2 py-1 border-b border-slate-100 flex items-center justify-between">
        <div className="flex gap-1">
          <div className="bg-slate-800 text-white px-1.5 py-0.5 rounded-[3px] text-[5px] font-bold flex items-center gap-0.5">
            <FileText size={5} /> Pendências
          </div>
          <div className="bg-white border border-slate-200 text-slate-500 px-1.5 py-0.5 rounded-[3px] text-[5px] font-bold flex items-center gap-0.5">
            <Clock size={5} /> Aguardando
          </div>
          <div className="bg-white border border-slate-200 text-slate-500 px-1.5 py-0.5 rounded-[3px] text-[5px] font-bold flex items-center gap-0.5">
            <CheckCircle size={5} /> Finalizados
          </div>
        </div>
        <span className="text-[5px] text-slate-400 font-medium">17 de 76</span>
      </div>

      {/* Toolbar de Filtros */}
      <div className="bg-white px-2 py-1 border-b border-slate-100 flex gap-1 items-center">
        <div className="h-3.5 flex-1 bg-white border border-slate-200 rounded flex items-center px-1 gap-1">
          <Search size={5} className="text-slate-300" />
          <span className="text-[4px] text-slate-300">Buscar item, solicitante...</span>
        </div>
        <div className="h-3.5 w-8 bg-white border border-slate-200 rounded flex items-center justify-center text-[4px] text-slate-600 font-bold">
          <LayoutGrid size={5} className="mr-0.5" /> Empresa
        </div>
        <div className="h-3.5 w-8 bg-white border border-slate-200 rounded flex items-center justify-center text-[4px] text-slate-600 font-bold">
          Status: 4
        </div>
        <div className="h-3.5 w-10 bg-white border border-slate-200 rounded flex items-center justify-center gap-0.5 text-[4px] font-bold text-slate-600">
          <Filter size={5} /> Mais filtros
        </div>
        <div className="h-3.5 w-10 bg-white border border-slate-200 rounded flex items-center justify-center gap-0.5 text-[4px] font-bold text-slate-600 ml-auto">
          <Download size={5} /> Exportar
        </div>
      </div>

      {/* Cabeçalho Tabela */}
      <div className="flex bg-slate-50 px-2 py-1 border-b border-slate-200">
        <div className="w-[30%] text-[4px] font-bold text-slate-400 uppercase">Item</div>
        <div className="w-[20%] text-[4px] font-bold text-slate-400 uppercase">Solicitante</div>
        <div className="w-[5%] text-[4px] font-bold text-slate-400 uppercase text-center">Qtd</div>
        <div className="w-[10%] text-[4px] font-bold text-slate-400 uppercase text-center">Prioridade</div>
        <div className="w-[15%] text-[4px] font-bold text-slate-400 uppercase text-center">Status</div>
        <div className="w-[15%] text-[4px] font-bold text-slate-400 uppercase text-right">Data</div>
        <div className="w-[5%] text-[4px] font-bold text-slate-400 uppercase text-center">...</div>
      </div>

      {/* Linhas da Tabela */}
      <div className="flex-1 bg-white p-0 space-y-0 overflow-hidden">
        {/* Row 1 */}
        <div className="flex px-2 py-1.5 border-b border-slate-50 items-center hover:bg-slate-50 transition-colors">
          <div className="w-[30%] pr-1">
            <div className="text-[5.5px] font-bold text-slate-700">Notebook</div>
            <div className="text-[3.5px] text-slate-400 flex gap-1">
              REQ-20260123 <span className="bg-slate-100 px-0.5 rounded">Madville</span>
            </div>
          </div>
          <div className="w-[20%] pr-1">
            <div className="text-[5.5px] font-medium text-slate-600 leading-tight">Willian Henrique</div>
            <div className="text-[3.5px] text-slate-400">Comercial</div>
          </div>
          <div className="w-[5%] text-center text-[5px] font-bold text-slate-600">1 un</div>
          <div className="w-[10%] text-center">
            <div className="inline-flex items-center gap-0.5 text-[4px] font-bold text-yellow-600">
              <div className="w-1 h-1 rounded-full bg-yellow-500"></div> Média
            </div>
          </div>
          <div className="w-[15%] text-center">
            <span className="bg-orange-100 text-orange-700 text-[3.5px] font-bold px-1 py-0.5 rounded border border-orange-200">
              PENDENTE
            </span>
          </div>
          <div className="w-[15%] text-[4.5px] text-slate-500 text-right">23/01/2026</div>
          <div className="w-[5%] text-center flex justify-center text-slate-400">
            <MoreHorizontal size={6} />
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex px-2 py-1.5 border-b border-slate-50 items-center hover:bg-slate-50 transition-colors">
          <div className="w-[30%] pr-1">
            <div className="text-[5.5px] font-bold text-slate-700">Anti-aderente rosa</div>
            <div className="text-[3.5px] text-slate-400 flex gap-1">
              REQ-20260123 <span className="bg-slate-100 px-0.5 rounded">Madville</span>
            </div>
          </div>
          <div className="w-[20%] pr-1">
            <div className="text-[5.5px] font-medium text-slate-600 leading-tight">Eliane Cristina</div>
            <div className="text-[3.5px] text-slate-400">Almoxarifado</div>
          </div>
          <div className="w-[5%] text-center text-[5px] font-bold text-slate-600">8 un</div>
          <div className="w-[10%] text-center">
            <div className="inline-flex items-center gap-0.5 text-[4px] font-bold text-yellow-600">
              <div className="w-1 h-1 rounded-full bg-yellow-500"></div> Média
            </div>
          </div>
          <div className="w-[15%] text-center">
            <span className="bg-orange-100 text-orange-700 text-[3.5px] font-bold px-1 py-0.5 rounded border border-orange-200">
              PENDENTE
            </span>
          </div>
          <div className="w-[15%] text-[4.5px] text-slate-500 text-right">23/01/2026</div>
          <div className="w-[5%] text-center flex justify-center text-slate-400">
            <MoreHorizontal size={6} />
          </div>
        </div>

        {/* Row 3 */}
        <div className="flex px-2 py-1.5 border-b border-slate-50 items-center hover:bg-slate-50 transition-colors">
          <div className="w-[30%] pr-1">
            <div className="text-[5.5px] font-bold text-slate-700">Alicate universal</div>
            <div className="text-[3.5px] text-slate-400 flex gap-1">
              REQ-20260122 <span className="bg-slate-100 px-0.5 rounded">Madville</span>
            </div>
          </div>
          <div className="w-[20%] pr-1">
            <div className="text-[5.5px] font-medium text-slate-600 leading-tight">Kesia de Souza</div>
            <div className="text-[3.5px] text-slate-400">Almoxarifado</div>
          </div>
          <div className="w-[5%] text-center text-[5px] font-bold text-slate-600">4 un</div>
          <div className="w-[10%] text-center">
            <div className="inline-flex items-center gap-0.5 text-[4px] font-bold text-yellow-600">
              <div className="w-1 h-1 rounded-full bg-yellow-500"></div> Média
            </div>
          </div>
          <div className="w-[15%] text-center">
            <span className="bg-purple-100 text-purple-700 text-[3.5px] font-bold px-1 py-0.5 rounded border border-purple-200">
              COTANDO
            </span>
          </div>
          <div className="w-[15%] text-[4.5px] text-slate-500 text-right">22/01/2026</div>
          <div className="w-[5%] text-center flex justify-center text-slate-400">
            <MoreHorizontal size={6} />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// MOCK 3: FORMULÁRIO DE REQUISIÇÃO (Fiel a image_6bac10.png)
const MockFormScreen = () => (
  <div className="w-full h-full bg-white flex flex-col rounded-xl overflow-hidden border-[2px] border-slate-100 shadow-xl relative font-sans">
    {/* Link Voltar */}
    <div className="px-3 py-1.5 text-[5px] text-slate-400 flex items-center gap-1 cursor-pointer hover:text-slate-600">
      <ArrowRight size={5} className="rotate-180" /> Voltar ao início
    </div>

    {/* Stepper Minimalista */}
    <div className="px-4 py-1 border-b border-slate-50">
      <div className="flex justify-between items-center relative z-10">
        {[1, 2, 3, 4, 5].map((step) => (
          <div key={step} className="flex flex-col items-center gap-0.5">
            <div
              className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[5px] font-bold ${step === 1 ? "bg-slate-800 text-white" : "bg-white border border-slate-200 text-slate-300"}`}
            >
              {step}
            </div>
            <span className={`text-[3.5px] font-bold ${step === 1 ? "text-slate-800" : "text-slate-300"}`}>
              {step === 1 ? "Solicitante" : step === 2 ? "Item" : step === 3 ? "Justif." : step === 4 ? "Anexo" : "Fim"}
            </span>
          </div>
        ))}
      </div>
      {/* Linha Fina */}
      <div className="absolute top-[20px] left-[15%] w-[70%] h-[0.5px] bg-slate-100 -z-0"></div>
    </div>

    {/* Form Body */}
    <div className="p-3 flex-1 flex flex-col">
      <h3 className="text-[7px] font-bold text-slate-800 mb-0.5">Dados do Solicitante</h3>
      <p className="text-[4.5px] text-slate-400 mb-2">Confirme seus dados para identificação da requisição</p>

      <div className="grid grid-cols-2 gap-2 mb-2">
        <div className="space-y-0.5">
          <label className="text-[4px] font-bold text-slate-500 block">Empresa *</label>
          <div className="h-4 w-full border border-slate-200 rounded flex items-center justify-between px-1.5 bg-white">
            <span className="text-[4.5px] text-slate-700">GMAD Madville</span>
            <ChevronDown size={5} className="text-slate-400" />
          </div>
        </div>
        <div className="space-y-0.5">
          <label className="text-[4px] font-bold text-slate-500 block">Nome Completo *</label>
          <div className="h-4 w-full border border-slate-200 rounded flex items-center px-1.5 bg-white">
            <span className="text-[4.5px] text-slate-700">Ruan Wilt</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-2">
        <div className="space-y-0.5">
          <label className="text-[4px] font-bold text-slate-500 block">Email Corporativo *</label>
          <div className="h-4 w-full border border-slate-200 rounded flex items-center px-1.5 bg-white">
            <span className="text-[4.5px] text-slate-700">ruan@madville...</span>
          </div>
        </div>
        <div className="space-y-0.5">
          <label className="text-[4px] font-bold text-slate-500 block">Telefone *</label>
          <div className="h-4 w-full border border-slate-200 rounded flex items-center px-1.5 bg-white">
            <span className="text-[4.5px] text-slate-700">(00) 00000-0000</span>
          </div>
        </div>
      </div>

      <div className="mt-auto flex justify-between pt-1.5 border-t border-slate-50">
        <div className="h-4 px-2 rounded border border-slate-200 flex items-center text-[4.5px] font-bold text-slate-500">
          Anterior
        </div>
        <div className="h-4 px-2 rounded bg-slate-800 flex items-center text-[4.5px] font-bold text-white gap-1 shadow-sm">
          Próximo <ArrowRight size={5} />
        </div>
      </div>
    </div>
  </div>
);

// MOCK 4: DASHBOARD ANALYTICS (Baseado na image_6bab39.png)
const MockChartScreen = () => (
  <div className="w-full h-full bg-[#F8FAFC] flex flex-col rounded-xl overflow-hidden border-[2px] border-slate-200 shadow-xl p-2 font-sans">
    {/* Header Simulado */}
    <div className="flex justify-between items-center mb-2">
      <span className="text-[6px] font-bold text-slate-800">Dashboard de Compras</span>
      <div className="flex gap-1">
        <span className="bg-slate-200 h-1.5 w-1.5 rounded-full"></span>
        <span className="bg-slate-200 h-1.5 w-1.5 rounded-full"></span>
      </div>
    </div>

    <div className="flex gap-2 h-full">
      {/* Coluna Esquerda: Funil */}
      <div className="flex-1 bg-white rounded border border-slate-100 p-1.5 flex flex-col gap-1">
        <div className="flex justify-between">
          <span className="text-[5px] font-bold text-slate-700">Funil do Processo</span>
          <span className="text-[3.5px] bg-red-100 text-red-600 px-1 rounded font-bold">20 atrasadas</span>
        </div>
        <div className="space-y-1 mt-1">
          {/* Pendentes */}
          <div className="flex items-center gap-1">
            <span className="text-[3.5px] w-6 text-slate-400">Pendentes</span>
            <div className="flex-1 h-1.5 bg-orange-400 rounded-r relative w-[20%]"></div>
            <span className="text-[3.5px] text-slate-600">11</span>
          </div>
          {/* Comprados */}
          <div className="flex items-center gap-1">
            <span className="text-[3.5px] w-6 text-slate-400">Comprados</span>
            <div className="flex-1 h-1.5 bg-teal-500 rounded-r relative w-[80%]"></div>
            <span className="text-[3.5px] text-slate-600">37</span>
          </div>
          {/* Recebidos */}
          <div className="flex items-center gap-1">
            <span className="text-[3.5px] w-6 text-slate-400">Recebidos</span>
            <div className="flex-1 h-1.5 bg-green-600 rounded-r relative w-[30%]"></div>
            <span className="text-[3.5px] text-slate-600">12</span>
          </div>
        </div>
      </div>

      {/* Coluna Direita: Cards e Gráfico */}
      <div className="flex-1 flex flex-col gap-1.5">
        {/* Cards KPI */}
        <div className="grid grid-cols-2 gap-1">
          <div className="bg-red-50 p-1 rounded border border-red-100">
            <div className="text-[3.5px] text-red-500 font-bold mb-0.5">Taxa Conclusão</div>
            <div className="text-[8px] font-bold text-red-600">17%</div>
          </div>
          <div className="bg-green-50 p-1 rounded border border-green-100">
            <div className="text-[3.5px] text-green-600 font-bold mb-0.5">Tempo Médio</div>
            <div className="text-[8px] font-bold text-green-700">1.6d</div>
          </div>
        </div>
        {/* Gráfico Barras */}
        <div className="bg-white rounded border border-slate-100 flex-1 p-1 flex items-end justify-between gap-1">
          <div className="w-1.5 h-[40%] bg-slate-300 rounded-t-[1px]"></div>
          <div className="w-1.5 h-[60%] bg-[#008651] rounded-t-[1px]"></div>
          <div className="w-1.5 h-[30%] bg-slate-300 rounded-t-[1px]"></div>
          <div className="w-1.5 h-[50%] bg-[#008651] rounded-t-[1px]"></div>
          <div className="w-1.5 h-[20%] bg-slate-300 rounded-t-[1px]"></div>
        </div>
      </div>
    </div>
  </div>
);

// ==========================================
// 2. COMPOSIÇÃO 3D (PAINEL FUNDO + DASHBOARD FRENTE)
// ==========================================

const Hero3DComposition = () => {
  return (
    <div className="relative w-full h-[250px] md:h-[350px] flex items-center justify-center [perspective:1000px] overflow-visible mt-4 lg:mt-0 scale-[0.45] md:scale-[0.65] origin-center lg:origin-right">
      <div className="relative w-[280px] md:w-[550px] lg:w-[650px] h-[300px] md:h-[400px] transform [transform-style:preserve-3d] [transform:rotateX(10deg)_rotateY(-15deg)_rotateZ(2deg)] transition-transform duration-700 ease-out hover:[transform:rotateX(5deg)_rotateY(-5deg)_rotateZ(0deg)]">
        {/* 1. CAMADA BASE (FUNDO): PAINEL DE REQUISIÇÕES */}
        <div className="absolute top-0 left-0 w-full h-full transform [transform:translateZ(0px)] shadow-[0_25px_50px_-12px_rgba(0,134,81,0.3)] bg-[#008651] rounded-xl z-10 border-white ring-1 ring-[#008651]/20 transition-all duration-500">
          <MockPainelScreen />
        </div>

        {/* 2. CAMADA FRENTE DIREITA: DASHBOARD ANALYTICS */}
        <div className="absolute top-[20%] -right-[15%] w-[220px] md:w-[280px] h-[180px] md:h-[220px] transform [transform:translateZ(60px)] shadow-[0_30px_60px_rgba(0,0,0,0.2)] z-30 bg-white rounded-xl transition-all duration-500 hover:[transform:translateZ(80px)_scale(1.05)] border border-slate-100">
          <MockChartScreen />
        </div>

        {/* 3. CAMADA FRENTE ESQUERDA: FORMULÁRIO */}
        <div className="absolute bottom-[-15%] -left-[10%] w-[200px] md:w-[240px] h-[260px] md:h-[300px] transform [transform:translateZ(90px)] shadow-[0_30px_60px_rgba(0,0,0,0.25)] z-40 transition-all duration-500 hover:[transform:translateZ(110px)_scale(1.05)] animate-float-delayed">
          <MockFormScreen />
        </div>

        {/* 4. DETALHE FLUTUANTE: LOGIN (Bem discreto atrás) */}
        <div className="absolute top-[-15%] left-[10%] w-[140px] md:w-[180px] h-[180px] md:h-[220px] transform [transform:translateZ(-40px)] shadow-[0_20px_40px_rgba(0,0,0,0.1)] z-0 opacity-80 blur-[0.5px]">
          <MockAuthScreen />
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
