import { Requisicao } from '@/types';

const STATUS_LABELS: Record<string, string> = {
  pendente: 'Pendente',
  em_analise: 'Em Análise',
  aprovado: 'Aprovado',
  cotando: 'Cotando',
  comprado: 'Comprado',
  em_entrega: 'Em Entrega',
  recebido: 'Recebido',
  rejeitado: 'Rejeitado',
  cancelado: 'Cancelado',
};

const PRIORITY_LABELS: Record<string, string> = {
  ALTA: 'Alta',
  MEDIA: 'Média',
  BAIXA: 'Baixa',
};

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '';
  try {
    return new Date(dateString).toLocaleDateString('pt-BR');
  } catch {
    return '';
  }
}

function formatCurrency(value: number | null | undefined): string {
  if (value == null) return '';
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function escapeCSV(value: string | null | undefined): string {
  if (value == null) return '';
  const str = String(value);
  // Escape quotes and wrap in quotes if contains comma, quote, or newline
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportToCSV(requisicoes: Requisicao[], filename = 'requisicoes'): void {
  const headers = [
    'Protocolo',
    'Item',
    'Quantidade',
    'Unidade',
    'Solicitante',
    'Email',
    'Telefone',
    'Setor',
    'Empresa',
    'Centro de Custo',
    'Prioridade',
    'Status',
    'Justificativa',
    'Especificações',
    'Comprador',
    'Fornecedor',
    'Valor Orçado',
    'Valor Final',
    'Previsão Entrega',
    'Data Criação',
    'Data Aprovação',
    'Data Compra',
    'Data Recebimento',
  ];

  const rows = requisicoes.map((req) => [
    escapeCSV(req.protocolo),
    escapeCSV(req.item_nome),
    req.quantidade?.toString() || '',
    escapeCSV(req.unidade),
    escapeCSV(req.solicitante_nome),
    escapeCSV(req.solicitante_email),
    escapeCSV(req.solicitante_telefone),
    escapeCSV(req.solicitante_setor),
    escapeCSV(req.solicitante_empresa),
    escapeCSV(req.centro_custo),
    PRIORITY_LABELS[req.prioridade] || req.prioridade,
    STATUS_LABELS[req.status] || req.status,
    escapeCSV(req.justificativa),
    escapeCSV(req.especificacoes),
    escapeCSV(req.comprador_nome),
    escapeCSV(req.fornecedor_nome),
    formatCurrency(req.valor_orcado),
    formatCurrency(req.valor),
    formatDate(req.previsao_entrega),
    formatDate(req.created_at),
    formatDate(req.aprovado_em),
    formatDate(req.comprado_em),
    formatDate(req.recebido_em),
  ]);

  // Add BOM for Excel UTF-8 compatibility
  const BOM = '\uFEFF';
  const csvContent = BOM + [headers.join(';'), ...rows.map((row) => row.join(';'))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToExcel(requisicoes: Requisicao[], filename = 'requisicoes'): void {
  const headers = [
    'Protocolo',
    'Item',
    'Quantidade',
    'Unidade',
    'Solicitante',
    'Email',
    'Telefone',
    'Setor',
    'Empresa',
    'Centro de Custo',
    'Prioridade',
    'Status',
    'Justificativa',
    'Especificações',
    'Comprador',
    'Fornecedor',
    'Valor Orçado',
    'Valor Final',
    'Previsão Entrega',
    'Data Criação',
    'Data Aprovação',
    'Data Compra',
    'Data Recebimento',
  ];

  const rows = requisicoes.map((req) => [
    req.protocolo || '',
    req.item_nome || '',
    req.quantidade || '',
    req.unidade || '',
    req.solicitante_nome || '',
    req.solicitante_email || '',
    req.solicitante_telefone || '',
    req.solicitante_setor || '',
    req.solicitante_empresa || '',
    req.centro_custo || '',
    PRIORITY_LABELS[req.prioridade] || req.prioridade,
    STATUS_LABELS[req.status] || req.status,
    req.justificativa || '',
    req.especificacoes || '',
    req.comprador_nome || '',
    req.fornecedor_nome || '',
    req.valor_orcado ?? '',
    req.valor ?? '',
    req.previsao_entrega || '',
    req.created_at || '',
    req.aprovado_em || '',
    req.comprado_em || '',
    req.recebido_em || '',
  ]);

  // Create Excel XML format
  const escapeXml = (str: string | number) => 
    String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const headerRow = headers.map((h) => `<Cell><Data ss:Type="String">${escapeXml(h)}</Data></Cell>`).join('');
  
  const dataRows = rows.map((row) => {
    const cells = row.map((cell) => {
      const type = typeof cell === 'number' ? 'Number' : 'String';
      return `<Cell><Data ss:Type="${type}">${escapeXml(cell)}</Data></Cell>`;
    }).join('');
    return `<Row>${cells}</Row>`;
  }).join('\n');

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Worksheet ss:Name="Requisições">
    <Table>
      <Row ss:StyleID="Header">${headerRow}</Row>
      ${dataRows}
    </Table>
  </Worksheet>
</Workbook>`;

  const blob = new Blob([xmlContent], { type: 'application/vnd.ms-excel' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.xls`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
