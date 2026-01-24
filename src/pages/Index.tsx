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
  MapPin, // Adicionado (usado no GMADHeaderBar mas não estava no import original)
  Heart, // Adicionado (usado no GMADHeaderBar mas não estava no import original)
  ShoppingBag, // Adicionado (usado no GMADHeaderBar mas não estava no import original)
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
// 3. NOVO SUBPAINEL GMAD (ADAPTADO PARA O CONTEXTO)
// ==========================================
const GMADHeaderBar = () => (
  // Fundo Verde Escuro GMAD (#006746)
  <div className="w-full bg-[#006746] font-sans">
    {/* Linha Superior (Links Pequenos) */}
    <div className="max-w-[1600px] mx-auto px-6 h-8 flex items-center justify-between text-[10px] text-white/90 border-b border-white/10 hidden md:flex">
      <div className="flex gap-4">
        <span className="hover:text-white cursor-pointer">Grupo GMAD</span>
        <span className="hover:text-white cursor-pointer">Soluções Financeiras G+</span>
        <span className="hover:text-white cursor-pointer">Combinações MDF</span>
      </div>
      <div className="flex gap-4">
        <span className="hover:text-white cursor-pointer">Atendimento</span>
        <span className="hover:text-white cursor-pointer">Chamados</span>
        <span className="hover:text-white cursor-pointer font-bold">Suporte TI</span>
      </div>
    </div>

    {/* Linha Principal (Busca e Usuário) */}
    <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between gap-8">
      {/* Logo GMAD (Branco) */}
      <div className="text-3xl font-extrabold text-white tracking-tighter italic">GMAD</div>

      {/* Barra de Busca (Branca Centralizada) */}
      <div className="flex-1 max-w-2xl relative hidden md:block">
        <input
          type="text"
          placeholder="O que você está procurando?"
          className="w-full h-10 pl-4 pr-10 rounded text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <Search className="absolute right-3 top-2.5 text-slate-400" size={18} />
      </div>

      {/* Ações (Ícones e Texto) - ADAPTADO PARA SISTEMA INTERNO */}
      <div className="flex items-center gap-6 text-white">
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80">
          <MapPin size={24} />
          <div className="flex flex-col leading-tight">
            <span className="text-[10px] font-medium opacity-80">Unidade</span>
            <span className="text-xs font-bold">Madville Joinville</span>
          </div>
        </div>
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80">
          <User size={24} />
          <div className="flex flex-col leading-tight">
            <span className="text-[10px] font-medium opacity-80">Departamento</span>
            <span className="text-xs font-bold">Compras & TI</span>
          </div>
        </div>
        <div className="flex items-center gap-4 ml-2 border-l border-white/20 pl-6">
          <Heart size={24} className="hover:opacity-80 cursor-pointer" />
          <div className="relative cursor-pointer hover:opacity-80">
            <ShoppingBag size={24} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
              3
            </span>
          </div>
        </div>
      </div>
    </div>

    {/* Linha Inferior (Menu de Categorias) */}
    <div className="bg-[#005c3e] border-t border-white/10 hidden md:block">
      <div className="max-w-[1600px] mx-auto px-6 h-10 flex items-center justify-between text-white text-xs font-bold">
        <div className="flex items-center gap-2 cursor-pointer hover:bg-white/10 px-2 py-1 rounded transition-colors">
          <Menu size={16} />
          <span>Todas as Categorias</span>
        </div>

        <div className="flex items-center gap-8">
          <span className="cursor-pointer hover:text-green-200 transition-colors">Material de Escritório</span>
          <span className="cursor-pointer hover:text-green-200 transition-colors">Informática & TI</span>
          <span className="cursor-pointer hover:text-green-200 transition-colors">EPIs e Segurança</span>
          <span className="cursor-pointer hover:text-green-200 transition-colors">Ferramentas</span>
          <span className="cursor-pointer hover:text-green-200 transition-colors">Limpeza e Copa</span>
        </div>

        <div className="flex items-center gap-6">
          <button className="bg-[#E85D4E] hover:bg-[#d64d3e] text-white px-4 py-1 rounded transition-colors text-xs font-bold shadow-sm flex items-center gap-1">
            <AlertCircle size={12} /> Solicitação Urgente
          </button>
          <span className="cursor-pointer hover:text-green-200 transition-colors">Itens Recorrentes</span>
        </div>
      </div>
    </div>
  </div>
);

// ==========================================
// 4. PÁGINA PRINCIPAL
// ==========================================

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white relative overflow-x-hidden font-sans selection:bg-green-100 selection:text-green-900">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
          body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #ffffff; }
        `}
      </style>

      {/* HEADER + SUBPAINEL GMAD */}
      <div className="relative z-50 shadow-md">
        <GMADHeaderBar />
      </div>

      <div className="relative z-10">
        <Header />

        <main className="max-w-[1440px] mx-auto">
          {/* === 1. HERO SECTION === */}
          <section className="px-6 md:px-12 pt-16 pb-24 lg:pt-20 lg:pb-28 overflow-hidden">
            <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
              {/* Texto Hero */}
              <div className="flex-1 relative z-20 text-center lg:text-left">
                {/* -------------------- MUDANÇA AQUI -------------------- */}
                <h1 className="font-jakarta text-5xl sm:text-6xl lg:text-[5rem] font-bold text-slate-900 tracking-tight leading-[1.1] mb-6">
                  Central de Compras <br />
                  <span className="text-[#008651]">e Requisições.</span>
                </h1>
                {/* ------------------------------------------------------ */}

                <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-xl mb-10 mx-auto lg:mx-0">
                  Plataforma unificada para gestão de suprimentos e requisições corporativas. Controle total para{" "}
                  <strong>Madville</strong> e <strong>Curitiba</strong>.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link to="/painel" className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto bg-[#008651] hover:bg-[#006e42] text-white text-lg font-bold px-10 py-4 rounded-md shadow-lg shadow-green-900/20 transition-all hover:-translate-y-1 flex items-center justify-center gap-3">
                      Acessar Painel <ArrowRight size={20} strokeWidth={3} />
                    </button>
                  </Link>
                </div>
              </div>

              {/* 3D Composition */}
              <div className="flex-1 w-full relative z-10 lg:h-[600px] flex items-center justify-center">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-green-50/50 rounded-full blur-3xl -z-10 opacity-60 translate-x-1/3 -translate-y-1/4"></div>
                <Hero3DComposition />
              </div>
            </div>
          </section>

          {/* === LOGOS === */}
          <div className="border-y border-slate-100 bg-white py-12">
            <div className="max-w-[1600px] mx-auto px-6">
              <LogoMarquee />
            </div>
          </div>

          {/* === SEÇÃO DE AÇÕES RÁPIDAS === */}
          <section className="py-24 bg-white">
            <div className="max-w-[1600px] mx-auto px-6 md:px-12">
              <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-slate-100 pb-6">
                <div>
                  <span className="text-[#008651] font-bold text-sm uppercase tracking-wider mb-2 block">Atalhos</span>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">O que você precisa fazer hoje?</h2>
                </div>
                <Link to="/painel" className="text-[#008651] font-bold hover:underline flex items-center gap-1">
                  Ver todas as ações <ArrowRight size={16} />
                </Link>
              </div>

              <ActionCards />
            </div>
          </section>

          {/* === WORKFLOW === */}
          <section className="py-24 bg-[#F8F9FA] relative overflow-hidden border-t border-slate-200">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="bg-white text-[#008651] border border-green-200 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
                  Processo
                </span>
                <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mt-6 mb-6">Fluxo de Aprovação</h2>
                <p className="text-slate-500 text-lg leading-relaxed">
                  Cada requisição segue um caminho automatizado, garantindo compliance, rastreabilidade e agilidade.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-8 md:p-12 shadow-sm">
                <HeroFlowDiagram />
              </div>
            </div>
          </section>

          <WorkflowTimeline />

          <footer className="py-12 bg-white border-t border-slate-200">
            <div className="max-w-[1600px] mx-auto px-6 text-center">
              <div className="mb-6 flex justify-center">
                <div className="h-10 w-10 bg-[#008651] rounded flex items-center justify-center text-white font-extrabold text-sm">
                  GM
                </div>
              </div>
              <p className="text-slate-900 text-sm font-bold mb-2">© 2026 GMAD Madville | Curitiba</p>
              <p className="text-slate-500 text-xs">Central de Compras Corporativas • Acesso Restrito</p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Index;
