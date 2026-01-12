import { Button } from '@/components/ui/button';
import { Upload, FileText, X, Image, FileSpreadsheet, Info, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

const MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 50MB in bytes

interface StepAnexoProps {
  files: File[];
  onFilesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileRemove: (index: number) => void;
  formData: {
    especificacoes: string;
    item_nome: string;
  };
  totalSizeError?: string;
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const getFileIcon = (file: File) => {
  if (file.type.startsWith('image/')) return Image;
  if (file.type.includes('spreadsheet') || file.type.includes('excel')) return FileSpreadsheet;
  return FileText;
};

const getFileIconColor = (file: File) => {
  if (file.type.startsWith('image/')) return 'text-success';
  if (file.type === 'application/pdf') return 'text-destructive';
  if (file.type.includes('spreadsheet') || file.type.includes('excel')) return 'text-info';
  return 'text-muted-foreground';
};

const getFileIconBg = (file: File) => {
  if (file.type.startsWith('image/')) return 'bg-success/10';
  if (file.type === 'application/pdf') return 'bg-destructive/10';
  if (file.type.includes('spreadsheet') || file.type.includes('excel')) return 'bg-info/10';
  return 'bg-muted';
};

export const StepAnexo = ({ files, onFilesChange, onFileRemove, formData, totalSizeError }: StepAnexoProps) => {
  const totalSize = files.reduce((acc, file) => acc + file.size, 0);
  const usagePercentage = Math.min((totalSize / MAX_TOTAL_SIZE) * 100, 100);
  const isLimitExceeded = totalSize >= MAX_TOTAL_SIZE;
  
  // Suggest attachment based on form data
  const shouldSuggestAttachment = formData.especificacoes.length < 20 || 
    formData.item_nome.toLowerCase().includes('equipamento') ||
    formData.item_nome.toLowerCase().includes('máquina') ||
    formData.item_nome.toLowerCase().includes('peça');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-1">Anexos</h2>
        <p className="text-sm text-muted-foreground">
          Adicione documentos que auxiliem na cotação
        </p>
      </div>

      {/* Usage Indicator */}
      <div className="p-4 bg-muted/30 rounded-lg border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Limite total de anexos: 50MB</span>
          <span className={cn(
            "text-sm font-medium",
            isLimitExceeded ? "text-destructive" : "text-muted-foreground"
          )}>
            {formatFileSize(totalSize)} de 50MB utilizados
          </span>
        </div>
        <Progress 
          value={usagePercentage} 
          className={cn("h-2", isLimitExceeded && "[&>div]:bg-destructive")}
        />
      </div>

      {/* Error Message */}
      {totalSizeError && (
        <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-destructive">{totalSizeError}</p>
          </div>
        </div>
      )}

      {/* Suggestion Banner */}
      {shouldSuggestAttachment && files.length === 0 && (
        <div className="p-4 bg-info/10 border border-info/30 rounded-lg flex items-start gap-3 animate-fade-in">
          <Info className="w-5 h-5 text-info mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">Recomendamos anexar um documento</p>
            <p className="text-xs text-muted-foreground mt-1">
              Para itens técnicos ou com poucas especificações, um anexo ajuda a equipe de compras a cotar corretamente.
            </p>
          </div>
        </div>
      )}

      {/* File Upload Area */}
      <div className="relative">
        <label className={cn(
          "flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-xl cursor-pointer transition-all group",
          isLimitExceeded 
            ? "border-destructive/30 bg-destructive/5 cursor-not-allowed" 
            : "hover:border-primary/50 hover:bg-muted/30"
        )}>
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors",
            isLimitExceeded 
              ? "bg-destructive/10" 
              : "bg-muted group-hover:bg-primary/10"
          )}>
            <Upload className={cn(
              "w-8 h-8 transition-colors",
              isLimitExceeded 
                ? "text-destructive" 
                : "text-muted-foreground group-hover:text-primary"
            )} />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">
            {isLimitExceeded 
              ? "Limite de 50MB atingido" 
              : "Clique para selecionar arquivos"}
          </p>
          <p className="text-xs text-muted-foreground text-center">
            {isLimitExceeded 
              ? "Remova arquivos para adicionar novos" 
              : "PDF, JPG, PNG ou Excel • Múltiplos arquivos permitidos"}
          </p>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.xls,.xlsx"
            onChange={onFilesChange}
            className="sr-only"
            multiple
            disabled={isLimitExceeded}
          />
        </label>
      </div>

      {/* Files List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground">
            Arquivos anexados ({files.length})
          </h3>
          <div className="space-y-2">
            {files.map((file, index) => {
              const FileIcon = getFileIcon(file);
              const isImage = file.type.startsWith('image/');
              
              return (
                <div
                  key={`${file.name}-${index}`}
                  className="border rounded-lg p-4 bg-card animate-fade-in"
                >
                  <div className="flex items-center gap-4">
                    {/* File Icon */}
                    <div className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center shrink-0",
                      getFileIconBg(file)
                    )}>
                      <FileIcon className={cn("w-6 h-6", getFileIconColor(file))} />
                    </div>
                    
                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate text-sm">{file.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                    
                    {/* Remove Button */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => onFileRemove(index)}
                      className="shrink-0 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  
                  {/* Image Preview */}
                  {isImage && (
                    <div className="mt-3 border rounded-lg overflow-hidden">
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt="Preview" 
                        className="max-h-32 w-full object-contain bg-muted/50"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* File Type Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <FileText className="w-4 h-4 text-destructive" />
          <span>PDF - Orçamentos, manuais</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Image className="w-4 h-4 text-success" />
          <span>Imagens - Fotos do item</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <FileSpreadsheet className="w-4 h-4 text-info" />
          <span>Excel - Lista de itens</span>
        </div>
      </div>
    </div>
  );
};
