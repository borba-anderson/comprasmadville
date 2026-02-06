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

// MOCK 1: PAINEL DE REQUISIÇÕES (Fiel a image_6b4618.png)
const MockPainelScreen = () => (
  <div className="w-full h-full bg-[#F3F4F6] flex flex-col rounded-xl overflow-hidden border border-slate-200 shadow-2xl font-sans relative">
    {/* Header Topo */}
    <div className="h-8 bg-white border-b border-slate-100 flex items-center justify-between px-3 shrink-0">
      <div className="flex items-center gap-1.5">
        <div className="text-[8px] font-extrabold text-[#008651] tracking-tighter italic">GMAD</div>
        <div className="h-3 w-[1px] bg-slate-300"></div>
        <span className="text-[7px] font-bold text-slate-700">Central de Compras Madville | Curitiba</span>
      </div>
      <div className="flex gap-1.5 items-center">
        <Bell size={9} className="text-slate-400" />
        <div className="flex items-center gap-1 bg-slate-50 px-1.5 py-0.5 rounded-full border border-slate-200">
          <User size={8} className="text-slate-600" />
          <span className="text-[6px] text-slate-700 font-bold">Ruan Wilt</span>
        </div>
      </div>
    </div>

    {/* Linha de Cards de Status */}
    <div className="px-3 py-2 flex gap-1 overflow-hidden bg-[#F3F4F6]">
      {[
        { l: "TOTAL", v: "76", c: "slate", i: FileText },
        { l: "PENDENTES", v: "11", c: "orange", i: Clock },
        { l: "EM ANÁLISE", v: "0", c: "blue", i: TrendingUp },
        { l: "APROVADOS", v: "1", c: "green", i: CheckCircle },
        { l: "COTANDO", v: "5", c: "slate", i: Package },
        { l: "COMPRADOS", v: "37", c: "teal", i: ShoppingCart },
        { l: "REJEITADOS", v: "1", c: "red", i: XCircle },
      ].map((card, idx) => (
        <div
          key={idx}
          className={`bg-white rounded-[3px] p-1.5 min-w-[35px] flex-1 shadow-sm border border-slate-100 flex flex-col justify-between h-9 relative overflow-hidden`}
        >
          <div className="flex justify-between items-start">
            <span
              className={`text-[3.5px] text-${card.c === "slate" ? "slate-400" : card.c + "-500"} font-bold uppercase`}
            >
              {card.l}
            </span>
            <card.i size={5} className={`text-${card.c === "slate" ? "slate-300" : card.c + "-400"}`} />
          </div>
          <div
            className={`text-[11px] font-bold text-${card.c === "slate" ? "slate-700" : card.c + "-600"} leading-none`}
          >
            {card.v}
          </div>
        </div>
      ))}
    </div>

    {/* Botões de Aba e Dashboard */}
    <div className="px-3 flex gap-1 mt-0">
      <div className="bg-white px-2 py-1 rounded-t-[3px] flex items-center gap-1 shadow-sm border-t border-x border-slate-200 relative z-10 top-[1px]">
        <FileText size={5} className="text-slate-700" />
        <span className="text-[5px] font-bold text-slate-700">Requisições</span>
      </div>
      <div className="px-2 py-1 flex items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors">
        <DollarSign size={5} />
        <span className="text-[5px] font-bold">Dashboard</span>
      </div>
    </div>

    {/* Área Branca Principal (Tabela) */}
    <div className="bg-white flex-1 border-t border-slate-200 flex flex-col mx-0">
      {/* Visões Rápidas */}
      <div className="bg-white px-3 py-1.5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex gap-1 items-center">
          <span className="text-[4.5px] text-slate-400 mr-1 font-medium">Visões rápidas:</span>
          <div className="bg-slate-800 text-white px-2 py-0.5 rounded-[2px] text-[4.5px] font-bold flex items-center gap-0.5">
            <List size={4} /> Pendências
          </div>
          <div className="bg-white border border-slate-200 text-slate-500 px-2 py-0.5 rounded-[2px] text-[4.5px] font-bold">
            Aguardando
          </div>
          <div className="bg-white border border-slate-200 text-slate-500 px-2 py-0.5 rounded-[2px] text-[4.5px] font-bold flex items-center gap-0.5">
            <CheckCircle size={4} /> Finalizados
          </div>
        </div>
        <span className="text-[4.5px] text-slate-400 font-bold">17 de 76</span>
      </div>

      {/* Toolbar */}
      <div className="bg-white px-3 py-1.5 border-b border-slate-100 flex gap-1 items-center">
        <div className="h-5 flex-1 bg-white border border-slate-200 rounded-[3px] flex items-center px-1.5 gap-1 shadow-sm">
          <Search size={6} className="text-slate-300" />
          <span className="text-[4.5px] text-slate-300">Buscar item, solicitante...</span>
        </div>
        <div className="h-5 px-2 bg-white border border-slate-200 rounded-[3px] flex items-center justify-center text-[4.5px] text-slate-600 font-bold gap-0.5 shadow-sm">
          <LayoutGrid size={4} /> Empresa
        </div>
        <div className="h-5 px-2 bg-white border border-slate-200 rounded-[3px] flex items-center justify-center text-[4.5px] text-slate-600 font-bold shadow-sm">
          Status 4
        </div>
        <div className="h-5 px-2 bg-white border border-slate-200 rounded-[3px] flex items-center justify-center gap-0.5 text-[4.5px] font-bold text-slate-600 shadow-sm">
          <Filter size={4} /> Mais filtros
        </div>
        <div className="h-5 w-5 bg-white border border-slate-200 rounded-[3px] flex items-center justify-center text-slate-400 shadow-sm ml-auto">
          <Download size={4} />
        </div>
      </div>

      {/* Cabeçalho Tabela */}
      <div className="flex bg-[#F9FAFB] px-3 py-1.5 border-b border-slate-200">
        <div className="w-[30%] text-[4px] font-bold text-slate-400 uppercase flex items-center gap-0.5">
          Item <ArrowRight size={3} className="rotate-90" />
        </div>
        <div className="w-[20%] text-[4px] font-bold text-slate-400 uppercase">Solicitante</div>
        <div className="w-[10%] text-[4px] font-bold text-slate-400 uppercase text-center">Qtd</div>
        <div className="w-[15%] text-[4px] font-bold text-slate-400 uppercase text-center">Prioridade</div>
        <div className="w-[15%] text-[4px] font-bold text-slate-400 uppercase text-center">Status</div>
        <div className="w-[10%] text-[4px] font-bold text-slate-400 uppercase text-right">Data</div>
      </div>

      {/* Linhas */}
      <div className="flex-1 bg-white p-0 space-y-0 overflow-hidden">
        {/* Row 1 */}
        <div className="flex px-3 py-2 border-b border-slate-50 items-center hover:bg-slate-50 transition-colors">
          <div className="w-[30%] pr-1">
            <div className="text-[5.5px] font-bold text-slate-700">Notebook Dell Latitude</div>
            <div className="text-[3.5px] text-slate-400 flex gap-1 mt-0.5 items-center">
              REQ-20260123{" "}
              <span className="bg-slate-100 px-1 rounded text-slate-500 border border-slate-200">Madville</span>
            </div>
          </div>
          <div className="w-[20%] pr-1">
            <div className="text-[5.5px] font-bold text-slate-600 leading-tight">Willian Henrique</div>
            <div className="text-[3.5px] text-slate-400">Comercial</div>
          </div>
          <div className="w-[10%] text-center text-[5px] font-bold text-slate-600">1 un</div>
          <div className="w-[15%] text-center">
            <div className="inline-flex items-center gap-0.5 text-[4px] font-bold text-yellow-600">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div> Média
            </div>
          </div>
          <div className="w-[15%] text-center">
            <span className="bg-orange-50 text-orange-700 text-[3.5px] font-bold px-1.5 py-0.5 rounded border border-orange-200 uppercase">
              PENDENTE
            </span>
          </div>
          <div className="w-[10%] text-[4.5px] text-slate-500 text-right">23/01/2026</div>
        </div>

        {/* Row 2 */}
        <div className="flex px-3 py-2 border-b border-slate-50 items-center hover:bg-slate-50 transition-colors">
          <div className="w-[30%] pr-1">
            <div className="text-[5.5px] font-bold text-slate-700">Anti-aderente rosa</div>
            <div className="text-[3.5px] text-slate-400 flex gap-1 mt-0.5 items-center">
              REQ-20260123{" "}
              <span className="bg-slate-100 px-1 rounded text-slate-500 border border-slate-200">Madville</span>
            </div>
          </div>
          <div className="w-[20%] pr-1">
            <div className="text-[5.5px] font-bold text-slate-600 leading-tight">Eliane Cristina</div>
            <div className="text-[3.5px] text-slate-400">Almoxarifado</div>
          </div>
          <div className="w-[10%] text-center text-[5px] font-bold text-slate-600">8 un</div>
          <div className="w-[15%] text-center">
            <div className="inline-flex items-center gap-0.5 text-[4px] font-bold text-yellow-600">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div> Média
            </div>
          </div>
          <div className="w-[15%] text-center">
            <span className="bg-orange-50 text-orange-700 text-[3.5px] font-bold px-1.5 py-0.5 rounded border border-orange-200 uppercase">
              PENDENTE
            </span>
          </div>
          <div className="w-[10%] text-[4.5px] text-slate-500 text-right">23/01/2026</div>
        </div>

        {/* Row 3 */}
        <div className="flex px-3 py-2 border-b border-slate-50 items-center hover:bg-slate-50 transition-colors">
          <div className="w-[30%] pr-1">
            <div className="text-[5.5px] font-bold text-slate-700">Parafuso Phillips 6X</div>
            <div className="text-[3.5px] text-slate-400 flex gap-1 mt-0.5 items-center">
              REQ-20260123{" "}
              <span className="bg-slate-100 px-1 rounded text-slate-500 border border-slate-200">Madville</span>
            </div>
          </div>
          <div className="w-[20%] pr-1">
            <div className="text-[5.5px] font-bold text-slate-600 leading-tight">Bruno Tarnowski</div>
            <div className="text-[3.5px] text-slate-400">Manutenção</div>
          </div>
          <div className="w-[10%] text-center text-[5px] font-bold text-slate-600">75 un</div>
          <div className="w-[15%] text-center">
            <div className="inline-flex items-center gap-0.5 text-[4px] font-bold text-yellow-600">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div> Média
            </div>
          </div>
          <div className="w-[15%] text-center">
            <span className="bg-orange-50 text-orange-700 text-[3.5px] font-bold px-1.5 py-0.5 rounded border border-orange-200 uppercase">
              PENDENTE
            </span>
          </div>
          <div className="w-[10%] text-[4.5px] text-slate-500 text-right">23/01/2026</div>
        </div>
      </div>
    </div>
  </div>
);

// MOCK 2: FORMULÁRIO (Mantido para contexto)
const MockFormScreen = () => (
  <div className="w-full h-full bg-white flex flex-col rounded-xl overflow-hidden border border-slate-100 shadow-xl relative font-sans">
    <div className="px-3 py-1.5 text-[5px] text-slate-400 flex items-center gap-1">
      <ArrowRight size={5} className="rotate-180" /> Voltar ao início
    </div>
    <div className="px-4 py-1 border-b border-slate-50">
      <div className="flex justify-between items-center relative z-10">
        {[1, 2, 3, 4, 5].map((step) => (
          <div
            key={step}
            className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[5px] font-bold ${step === 1 ? "bg-slate-800 text-white" : "bg-white border border-slate-200 text-slate-300"}`}
          >
            {step}
          </div>
        ))}
      </div>
      <div className="absolute top-[20px] left-[15%] w-[70%] h-[0.5px] bg-slate-100 -z-0"></div>
    </div>
    <div className="p-3 flex-1 flex flex-col">
      <h3 className="text-[7px] font-bold text-slate-800 mb-0.5">Dados do Solicitante</h3>
      <p className="text-[4.5px] text-slate-400 mb-2">Confirme seus dados para identificação</p>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div className="space-y-0.5">
          <div className="h-4 w-full border border-slate-200 rounded bg-white flex items-center px-1 text-[4px] text-slate-600">
            GMAD Madville
          </div>
        </div>
        <div className="space-y-0.5">
          <div className="h-4 w-full border border-slate-200 rounded bg-white flex items-center px-1 text-[4px] text-slate-600">
            Ruan Wilt
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div className="space-y-0.5">
          <div className="h-4 w-full border border-slate-200 rounded bg-white flex items-center px-1 text-[4px] text-slate-600">
            ruan@madville...
          </div>
        </div>
        <div className="space-y-0.5">
          <div className="h-4 w-full border border-slate-200 rounded bg-white flex items-center px-1 text-[4px] text-slate-600">
            (47) 99999-9999
          </div>
        </div>
      </div>
      <div className="mt-auto flex justify-between pt-1.5 border-t border-slate-50">
        <div className="h-4 px-2 rounded border border-slate-200 flex items-center text-[4.5px] font-bold text-slate-500">
          Voltar
        </div>
        <div className="h-4 px-2 rounded bg-slate-800 flex items-center text-[4.5px] font-bold text-white">Próximo</div>
      </div>
    </div>
  </div>
);

// MOCK 3: DASHBOARD ANALYTICS (AUMENTADO e FIEL A image_6b2c75.png)
const MockChartScreen = () => (
  <div className="w-full h-full bg-[#F9FAFB] flex flex-col rounded-xl overflow-hidden border border-slate-200 shadow-xl p-3 font-sans">
    {/* Linha 1: Funil e KPIs */}
    <div className="flex gap-2 h-[55%] mb-2">
      {/* Funil */}
      <div className="w-[45%] bg-white rounded-lg border border-slate-100 p-2 flex flex-col">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-1">
            <div className="bg-purple-100 p-0.5 rounded">
              <LayoutGrid size={4} className="text-purple-600" />
            </div>
            <span className="text-[5px] font-bold text-slate-800">Funil do Processo</span>
          </div>
          <span className="text-[3.5px] bg-red-100 text-red-600 px-1 py-0.5 rounded font-bold">20 atrasadas</span>
        </div>
        <div className="flex-1 flex flex-col gap-1 justify-center">
          <div className="flex items-center gap-1">
            <span className="text-[3.5px] w-5 text-slate-400">Pendentes</span>
            <div className="flex-1 h-2 bg-orange-400 rounded-r relative w-[20%]">
              <span className="absolute left-1 top-[1px] text-[3.5px] text-white font-bold">11</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[3.5px] w-5 text-slate-400">Cotando</span>
            <div className="flex-1 h-2 bg-purple-500 rounded-r relative w-[10%]">
              <span className="absolute left-1 top-[1px] text-[3.5px] text-white font-bold">5</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[3.5px] w-5 text-slate-400">Comprados</span>
            <div className="flex-1 h-2 bg-cyan-500 rounded-r relative w-[80%]">
              <span className="absolute left-1 top-[1px] text-[3.5px] text-white font-bold">37</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[3.5px] w-5 text-slate-400">Recebidos</span>
            <div className="flex-1 h-2 bg-green-600 rounded-r relative w-[30%]">
              <span className="absolute left-1 top-[1px] text-[3.5px] text-white font-bold">12</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="flex-1 bg-white rounded-lg border border-slate-100 p-2 flex flex-col">
        <div className="flex items-center gap-1 mb-1">
          <div className="bg-slate-100 p-0.5 rounded">
            <AlertCircle size={4} className="text-slate-600" />
          </div>
          <span className="text-[5px] font-bold text-slate-800">Indicadores</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5 flex-1">
          <div className="bg-red-50 p-1 rounded border border-red-50 flex flex-col justify-center">
            <span className="text-[3.5px] text-red-400 mb-0.5">Taxa Conclusão</span>
            <span className="text-[8px] font-bold text-red-600 leading-none">17%</span>
          </div>
          <div className="bg-green-50 p-1 rounded border border-green-50 flex flex-col justify-center">
            <span className="text-[3.5px] text-green-500 mb-0.5">Tempo Médio</span>
            <span className="text-[8px] font-bold text-green-700 leading-none">1.6d</span>
          </div>
          <div className="bg-red-50 p-1 rounded border border-red-50 flex flex-col justify-center">
            <span className="text-[3.5px] text-red-400 mb-0.5">Atrasadas</span>
            <span className="text-[8px] font-bold text-red-600 leading-none">20</span>
          </div>
          <div className="bg-blue-50 p-1 rounded border border-blue-50 flex flex-col justify-center">
            <span className="text-[3.5px] text-blue-400 mb-0.5">Aguardando</span>
            <span className="text-[8px] font-bold text-blue-600 leading-none">40</span>
          </div>
        </div>
      </div>
    </div>

    {/* Linha 2: Economia */}
    <div className="flex gap-2 h-[45%]">
      <div className="flex-1 bg-white rounded-lg border border-slate-100 p-2">
        <div className="flex items-center gap-1 mb-1">
          <div className="bg-green-50 p-0.5 rounded">
            <Briefcase size={4} className="text-green-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-[5px] font-bold text-slate-800 leading-none">Economia Gerada</span>
            <span className="text-[3px] text-slate-400">18 compras analisadas</span>
          </div>
        </div>
        <div className="flex gap-2 mt-1">
          <div>
            <span className="text-[3.5px] text-slate-400 block">Total Orçado</span>
            <span className="text-[6px] font-bold text-slate-700">R$ 24,7k</span>
          </div>
          <div>
            <span className="text-[3.5px] text-slate-400 block">Economia</span>
            <span className="text-[6px] font-bold text-green-600">R$ 4,6k</span>
          </div>
        </div>
        <div className="mt-1.5 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full w-[80%] bg-green-500 rounded-full"></div>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-lg border border-slate-100 p-2 flex flex-col">
        <div className="flex items-center gap-1 mb-1">
          <div className="bg-green-50 p-0.5 rounded">
            <DollarSign size={4} className="text-green-600" />
          </div>
          <span className="text-[5px] font-bold text-slate-800">Por Empresa</span>
        </div>
        <div className="flex-1 flex items-end justify-around gap-1 pb-1">
          <div className="w-1.5 h-[60%] bg-slate-400 rounded-t-[1px]"></div>
          <div className="w-1.5 h-[50%] bg-green-500 rounded-t-[1px]"></div>
          <div className="w-1.5 h-[30%] bg-slate-400 rounded-t-[1px]"></div>
          <div className="w-1.5 h-[20%] bg-green-500 rounded-t-[1px]"></div>
          <div className="w-1.5 h-[40%] bg-slate-400 rounded-t-[1px]"></div>
          <div className="w-1.5 h-[35%] bg-green-500 rounded-t-[1px]"></div>
        </div>
      </div>
    </div>
  </div>
);

// ==========================================
// 2. COMPOSIÇÃO 3D (ATUALIZADA)
// ==========================================

const Hero3DComposition = () => {
  return (
    <div className="relative w-full h-[250px] md:h-[350px] flex items-center justify-center [perspective:1000px] overflow-visible mt-4 lg:mt-0 scale-[0.45] md:scale-[0.65] origin-center lg:origin-right">
      <div className="relative w-[280px] md:w-[550px] lg:w-[650px] h-[300px] md:h-[400px] transform [transform-style:preserve-3d] [transform:rotateX(10deg)_rotateY(-15deg)_rotateZ(2deg)] transition-transform duration-700 ease-out hover:[transform:rotateX(5deg)_rotateY(-5deg)_rotateZ(0deg)]">
        {/* 1. CAMADA BASE (FUNDO): PAINEL DE REQUISIÇÕES (Principal) */}
        <div className="absolute top-0 left-0 w-full h-full transform [transform:translateZ(0px)] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] bg-white rounded-xl z-10 transition-all duration-500">
          <MockPainelScreen />
        </div>

        {/* 2. CAMADA FRENTE DIREITA: DASHBOARD ANALYTICS (AUMENTADO e REPOSICIONADO) */}
        {/* Maior (w-320/420) e flutuando à frente */}
        <div className="absolute top-[10%] -right-[30%] w-[320px] md:w-[420px] h-[220px] md:h-[280px] transform [transform:translateZ(50px)] shadow-[0_40px_70px_rgba(0,0,0,0.15)] z-30 bg-white rounded-xl transition-all duration-500 hover:[transform:translateZ(70px)_scale(1.05)] border border-slate-200">
          <MockChartScreen />
        </div>

        {/* 3. CAMADA FLUTUANTE INFERIOR ESQUERDA: FORMULÁRIO */}
        <div className="absolute bottom-[-15%] -left-[5%] w-[200px] md:w-[240px] h-[260px] md:h-[300px] transform [transform:translateZ(80px)] shadow-[0_30px_60px_rgba(0,0,0,0.2)] z-40 transition-all duration-500 hover:[transform:translateZ(100px)_scale(1.05)] animate-float-delayed">
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
    <div className="min-h-screen bg-white relative overflow-x-hidden font-sans selection:bg-green-100 selection:text-green-900">
      {/* Green accent bar at top */}
      <div className="h-1 bg-success w-full" />
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
          body { font-family: 'Plus Jakarta Sans', sans-serif; }
        `}
      </style>

      {/* Background Limpo */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-success/5 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="relative z-10">
        <div className="border-b border-success/20">
          <Header />
        </div>

        <main className="max-w-[1440px] mx-auto">
          {/* === 1. HERO SECTION === */}
          <section className="px-4 sm:px-6 md:px-12 pt-6 sm:pt-10 pb-4 sm:pb-8 lg:pt-16 lg:pb-16 flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6 lg:gap-12 min-h-[320px] sm:min-h-[420px]">
            {/* Texto Hero */}
            <div className="flex-1 text-center lg:text-left max-w-[650px] relative z-30">
              {/* Título Ajustado: Cor removida e peso da fonte reduzido */}
              <h1 className="font-jakarta text-[2rem] sm:text-[2.5rem] md:text-4xl lg:text-5xl xl:text-[3.5rem] font-bold text-[#0F172A] mb-3 sm:mb-5 tracking-tight leading-[1.15] max-w-[700px]">
                Sistema de Requisições <br />
                <span className="text-[#0F172A]">de Compras.</span>
              </h1>

              <p className="text-slate-500 text-sm sm:text-base md:text-lg font-medium leading-relaxed max-w-lg mx-auto lg:mx-0 mb-5 sm:mb-8">
                Centralize seus pedidos de compra em um único lugar. Mais agilidade, transparência e controle para sua
                gestão.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link to="/painel">
                  <button className="bg-[#008651] hover:bg-[#006e42] text-white text-sm sm:text-base font-bold px-6 sm:px-8 py-3 sm:py-3.5 rounded-full shadow-lg shadow-green-900/10 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto lg:mx-0">
                    Acessar o Painel <ArrowRight size={18} />
                  </button>
                </Link>
              </div>
            </div>

            {/* Composição 3D - Hidden on mobile, shown from sm breakpoint */}
            <div className="hidden sm:flex flex-1 w-full justify-center lg:justify-end relative z-20">
              <Hero3DComposition />
            </div>
          </section>

          {/* Logos */}
          <div className="pb-6 sm:pb-10 relative z-20 border-b border-slate-100/50">
            <LogoMarquee />
          </div>

          {/* === 2. SAUDAÇÃO E STATS === */}
          {user && (
            <section className="mt-6 sm:mt-10 mb-6 sm:mb-8 px-4 sm:px-6 md:px-12 animate-fade-in relative z-20">
              <UserGreeting />
              <div className="mt-4 sm:mt-6">
                <QuickStats />
              </div>
            </section>
          )}

          {/* === 3. AÇÕES RÁPIDAS === */}
          <div className="mb-10 sm:mb-16 px-4 sm:px-6 md:px-12 relative z-20">
            <ActionCards />
          </div>

          {/* === 4. COMO FUNCIONA === */}
          <section className="py-10 sm:py-16 bg-white relative overflow-hidden border-t border-slate-100">
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>

            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12 relative z-10">
              <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
                <span className="text-[#008651] font-bold tracking-wider text-xs uppercase bg-green-50 px-3 py-1 rounded-full border border-green-100">
                  Workflow
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-jakarta text-slate-900 mt-4 mb-3 sm:mb-4 tracking-tight">
                  Fluxo Inteligente
                </h2>
                <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed px-4 sm:px-0">
                  Entenda como o portal conecta solicitantes, compradores e aprovadores.
                </p>
              </div>

              <div className="flex justify-center scale-[0.85] sm:scale-90 md:scale-100 -mx-4 sm:mx-0">
                <HeroFlowDiagram />
              </div>
            </div>
          </section>

          <WorkflowTimeline />

          <footer className="py-8 sm:py-10 text-center mt-8 sm:mt-12 border-t border-slate-200 bg-white px-4">
            <p className="text-slate-500 text-xs sm:text-sm font-medium font-jakarta">
              © 2026 GMAD Madville | Curitiba - Central de Compras
            </p>
            <p className="text-slate-400 text-[10px] sm:text-xs mt-2 font-jakarta">
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
