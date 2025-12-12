import { useMemo } from 'react';
import { Requisicao } from '@/types';
import { SLAInfo, SLA_LIMITS } from '../types';

export function useSLA(requisicao: Requisicao): SLAInfo {
  return useMemo(() => {
    const now = new Date();
    
    // Days since approval
    let sinceApproval: number | null = null;
    if (requisicao.aprovado_em) {
      const approvalDate = new Date(requisicao.aprovado_em);
      sinceApproval = Math.floor((now.getTime() - approvalDate.getTime()) / (1000 * 60 * 60 * 24));
    }

    // Days since started quoting
    let sinceQuoting: number | null = null;
    if (requisicao.status === 'cotando' || requisicao.status === 'comprado') {
      // Approximate: use approval date as start of quoting
      if (requisicao.aprovado_em) {
        const quotingStart = new Date(requisicao.aprovado_em);
        sinceQuoting = Math.floor((now.getTime() - quotingStart.getTime()) / (1000 * 60 * 60 * 24));
      }
    }

    // Days until delivery
    let untilDelivery: number | null = null;
    let isOverdue = false;
    let overdueBy: number | null = null;
    
    if (requisicao.previsao_entrega) {
      const deliveryDate = new Date(requisicao.previsao_entrega);
      deliveryDate.setHours(23, 59, 59, 999);
      untilDelivery = Math.ceil((deliveryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (untilDelivery < 0) {
        isOverdue = true;
        overdueBy = Math.abs(untilDelivery);
        untilDelivery = null;
      }
    }

    return {
      sinceApproval,
      sinceQuoting,
      untilDelivery,
      isOverdue,
      overdueBy,
    };
  }, [requisicao]);
}

export function getSLAStatus(sla: SLAInfo): 'ok' | 'warning' | 'critical' {
  if (sla.isOverdue) return 'critical';
  
  if (sla.sinceApproval !== null && sla.sinceApproval > SLA_LIMITS.approval) {
    return 'warning';
  }
  
  if (sla.sinceQuoting !== null && sla.sinceQuoting > SLA_LIMITS.quoting) {
    return 'critical';
  }
  
  if (sla.untilDelivery !== null && sla.untilDelivery <= 1) {
    return 'warning';
  }
  
  return 'ok';
}
