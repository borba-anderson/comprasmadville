import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listarRequisicoes from "./tools/listar-requisicoes";
import detalheRequisicao from "./tools/detalhe-requisicao";
import criarRequisicao from "./tools/criar-requisicao";
import adicionarComentario from "./tools/adicionar-comentario";
import resumoCompras from "./tools/resumo-compras";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "requisicoes-compras-mcp",
  title: "Requisições de Compras",
  version: "0.1.0",
  instructions:
    "Ferramentas do Sistema de Requisições de Compras. Use `listar_requisicoes` para consultar requisições com filtros, `detalhe_requisicao` para ver todos os dados e comentários de uma requisição pelo protocolo (REQ-000123), `criar_requisicao` para abrir uma nova solicitação, `adicionar_comentario` para comentar e `resumo_compras` para indicadores agregados (status, valores e economia). Todas as ferramentas respeitam as permissões do usuário conectado.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listarRequisicoes, detalheRequisicao, criarRequisicao, adicionarComentario, resumoCompras],
});
