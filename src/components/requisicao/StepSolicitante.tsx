import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SETORES, EMPRESAS } from '@/types';
import { User, Mail, Phone, Building2, Building, Wallet } from 'lucide-react';

interface StepSolicitanteProps {
  formData: {
    solicitante_nome: string;
    solicitante_email: string;
    solicitante_telefone: string;
    solicitante_setor: string;
    solicitante_empresa: string;
    centro_custo: string;
  };
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: string, value: string) => void;
}

export const StepSolicitante = ({ formData, errors, onChange, onSelectChange }: StepSolicitanteProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-1">Dados do Solicitante</h2>
        <p className="text-sm text-muted-foreground">
          Confirme seus dados para identificação da requisição
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="solicitante_empresa" className="flex items-center gap-2">
            <Building className="w-4 h-4 text-muted-foreground" />
            Empresa <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.solicitante_empresa}
            onValueChange={(value) => onSelectChange('solicitante_empresa', value)}
          >
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Selecione a empresa..." />
            </SelectTrigger>
            <SelectContent>
              {EMPRESAS.map((empresa) => (
                <SelectItem key={empresa} value={empresa}>
                  {empresa}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.solicitante_empresa && (
            <p className="text-xs text-destructive mt-1">{errors.solicitante_empresa}</p>
          )}
        </div>

        <div>
          <Label htmlFor="solicitante_nome" className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            Nome Completo <span className="text-destructive">*</span>
          </Label>
          <Input
            id="solicitante_nome"
            name="solicitante_nome"
            value={formData.solicitante_nome}
            onChange={onChange}
            placeholder="Seu nome completo"
            className="mt-1.5"
          />
          {errors.solicitante_nome && (
            <p className="text-xs text-destructive mt-1">{errors.solicitante_nome}</p>
          )}
        </div>

        <div>
          <Label htmlFor="solicitante_email" className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            Email Corporativo <span className="text-destructive">*</span>
          </Label>
          <Input
            id="solicitante_email"
            name="solicitante_email"
            type="email"
            value={formData.solicitante_email}
            onChange={onChange}
            placeholder="seu.email@empresa.com"
            className="mt-1.5"
          />
          {errors.solicitante_email && (
            <p className="text-xs text-destructive mt-1">{errors.solicitante_email}</p>
          )}
        </div>

        <div>
          <Label htmlFor="solicitante_telefone" className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-muted-foreground" />
            Telefone / Ramal <span className="text-destructive">*</span>
          </Label>
          <Input
            id="solicitante_telefone"
            name="solicitante_telefone"
            value={formData.solicitante_telefone}
            onChange={onChange}
            placeholder="(00) 00000-0000"
            maxLength={15}
            className="mt-1.5"
          />
          {errors.solicitante_telefone && (
            <p className="text-xs text-destructive mt-1">{errors.solicitante_telefone}</p>
          )}
        </div>

        <div>
          <Label htmlFor="solicitante_setor" className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-muted-foreground" />
            Setor / Departamento <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.solicitante_setor}
            onValueChange={(value) => onSelectChange('solicitante_setor', value)}
          >
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Selecione seu setor..." />
            </SelectTrigger>
            <SelectContent>
              {SETORES.map((setor) => (
                <SelectItem key={setor} value={setor}>
                  {setor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.solicitante_setor && (
            <p className="text-xs text-destructive mt-1">{errors.solicitante_setor}</p>
          )}
        </div>

        <div>
          <Label htmlFor="centro_custo" className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-muted-foreground" />
            Centro de Custo
          </Label>
          <Input
            id="centro_custo"
            name="centro_custo"
            value={formData.centro_custo}
            onChange={onChange}
            placeholder="Ex: CC-001, Marketing-2024"
            className="mt-1.5"
          />
          {errors.centro_custo && (
            <p className="text-xs text-destructive mt-1">{errors.centro_custo}</p>
          )}
        </div>
      </div>
    </div>
  );
};
