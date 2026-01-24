import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  to: string;
  solicitante_nome: string;
  item_nome: string;
  protocolo: string;
  status: string;
  comprador_nome?: string;
  previsao_entrega?: string;
  motivo_rejeicao?: string;
}

const STATUS_LABELS: Record<string, string> = {
  aprovado: "Aprovada",
  cotando: "Em Cotação",
  comprado: "Comprada",
  em_entrega: "Em Entrega",
  recebido: "Entregue",
  rejeitado: "Rejeitada",
};

const STATUS_MESSAGES: Record<string, string> = {
  aprovado: "Sua requisição foi aprovada e está aguardando início da cotação.",
  cotando: "Sua requisição está em processo de cotação com fornecedores.",
  comprado: "Ótima notícia! Sua requisição foi comprada e está sendo preparada para entrega.",
  em_entrega: "Sua requisição está a caminho! Em breve será entregue.",
  recebido: "Sua requisição foi entregue com sucesso!",
  rejeitado: "Infelizmente sua requisição foi rejeitada.",
};

const handler = async (req: Request): Promise<Response> => {
  console.log("Notification function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: NotificationRequest = await req.json();
    console.log("Notification data:", data);

    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ success: false, error: "RESEND_API_KEY not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const statusLabel = STATUS_LABELS[data.status] || data.status;
    const statusMessage = STATUS_MESSAGES[data.status] || "O status da sua requisição foi atualizado.";

    const isRejected = data.status === "rejeitado";
    const headerColor = isRejected ? "#ef4444" : "#f97316";

    let additionalInfo = "";
    
    if (data.comprador_nome) {
      additionalInfo += `<p style="margin: 10px 0;"><strong>Comprador Responsável:</strong> ${data.comprador_nome}</p>`;
    }
    
    if (data.previsao_entrega) {
      const date = new Date(data.previsao_entrega);
      const formattedDate = date.toLocaleDateString("pt-BR");
      additionalInfo += `<p style="margin: 10px 0;"><strong>Previsão de Entrega:</strong> ${formattedDate}</p>`;
    }
    
    if (data.motivo_rejeicao && isRejected) {
      additionalInfo += `<p style="margin: 10px 0; padding: 12px; background: #fef2f2; border-radius: 8px; color: #991b1b;"><strong>Motivo:</strong> ${data.motivo_rejeicao}</p>`;
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <div style="background: ${headerColor}; padding: 32px; text-align: center;">
                <h1 style="margin: 0; color: white; font-size: 24px; font-weight: 700;">
                  Atualização de Requisição
                </h1>
                <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">
                  ${statusLabel}
                </p>
              </div>
              
              <!-- Content -->
              <div style="padding: 32px;">
                <p style="margin: 0 0 16px; font-size: 16px; color: #1e293b;">
                  Olá, <strong>${data.solicitante_nome}</strong>!
                </p>
                
                <p style="margin: 0 0 24px; font-size: 15px; color: #475569; line-height: 1.6;">
                  ${statusMessage}
                </p>
                
                <!-- Info Box -->
                <div style="background: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                  <p style="margin: 0 0 8px;"><strong>Item:</strong> ${data.item_nome}</p>
                  <p style="margin: 0 0 8px;"><strong>Protocolo:</strong> <code style="background: #e2e8f0; padding: 2px 8px; border-radius: 4px; font-family: monospace;">${data.protocolo}</code></p>
                  <p style="margin: 0;"><strong>Status:</strong> <span style="color: ${headerColor}; font-weight: 600;">${statusLabel}</span></p>
                  ${additionalInfo}
                </div>
                
                <p style="margin: 0; font-size: 14px; color: #94a3b8;">
                  Este é um e-mail automático do sistema de requisições.
                </p>
              </div>
              
              <!-- Footer -->
              <div style="background: #f8fafc; padding: 20px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                  Sistema de Requisições Madville © ${new Date().getFullYear()}
                </p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Check if we have a verified domain - if using resend.dev, only works for test emails
    const FROM_EMAIL = Deno.env.get("RESEND_FROM_EMAIL") || "Requisições <onboarding@resend.dev>";
    
    // Send email via Resend API
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [data.to],
        subject: `[${data.protocolo}] Requisição ${statusLabel} - ${data.item_nome}`,
        html,
      }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error("Resend API error:", result);
      
      // If it's a domain verification error, log but don't fail the request
      // This allows the app to work while email domain is not verified
      if (result?.statusCode === 403 && result?.message?.includes("verify a domain")) {
        console.warn("Email not sent - domain not verified. Configure RESEND_FROM_EMAIL with a verified domain.");
        return new Response(
          JSON.stringify({ 
            success: true, 
            warning: "Email not sent - domain verification required",
            details: "Configure a verified domain at resend.com/domains and set RESEND_FROM_EMAIL secret"
          }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      
      return new Response(
        JSON.stringify({ success: false, error: result }),
        { status: response.status, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Email sent successfully:", result);

    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending notification:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
