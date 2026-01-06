import { Button } from '@/components/ui/button';
import { Upload, FileText, X, Image, FileSpreadsheet, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepAnexoProps {
  file: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileRemove: () => void;
  formData: {
    especificacoes: string;
    item_nome: string;
  };
}

export const StepAnexo = ({ file, onFileChange, onFileRemove, formData }: StepAnexoProps) => {
  const isImageFile = file?.type.startsWith('image/');
  const isPdfFile = file?.type === 'application/pdf';
  const isExcelFile = file?.type.includes('spreadsheet') || file?.type.includes('excel');
  
  const getFileIcon = () => {
    if (isImageFile) return Image;
    if (isExcelFile) return FileSpreadsheet;
    return FileText;
  };
  
  const FileIcon = getFileIcon();
  
  // Suggest attachment based on form data
  const shouldSuggestAttachment = formData.especificacoes.length < 20 || 
    formData.item_nome.toLowerCase().includes('equipamento') ||
    formData.item_nome.toLowerCase().includes('máquina') ||
    formData.item_nome.toLowerCase().includes('peça');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-1">Anexo</h2>
        <p className="text-sm text-muted-foreground">
          Adicione documentos que auxiliem na cotação
        </p>
      </div>

      {/* Suggestion Banner */}
      {shouldSuggestAttachment && !file && (
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
        {file ? (
          <div className="border-2 border-primary/30 bg-primary/5 rounded-xl p-6 animate-fade-in">
            <div className="flex items-start gap-4">
              {/* File Preview */}
              <div className={cn(
                "w-16 h-16 rounded-lg flex items-center justify-center shrink-0",
                isImageFile ? "bg-success/10" : isPdfFile ? "bg-destructive/10" : "bg-info/10"
              )}>
                <FileIcon className={cn(
                  "w-8 h-8",
                  isImageFile ? "text-success" : isPdfFile ? "text-destructive" : "text-info"
                )} />
              </div>
              
              {/* File Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{file.name}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <p className="text-xs text-success mt-2 flex items-center gap-1">
                  ✓ Arquivo pronto para envio
                </p>
              </div>
              
              {/* Remove Button */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onFileRemove}
                className="shrink-0 hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            {/* Image Preview */}
            {isImageFile && (
              <div className="mt-4 border rounded-lg overflow-hidden">
                <img 
                  src={URL.createObjectURL(file)} 
                  alt="Preview" 
                  className="max-h-48 w-full object-contain bg-muted/50"
                />
              </div>
            )}
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-xl cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-all group">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
              <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">
              Clique para selecionar um arquivo
            </p>
            <p className="text-xs text-muted-foreground text-center">
              PDF, JPG, PNG ou Excel (máximo 5MB)
            </p>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.xls,.xlsx"
              onChange={onFileChange}
              className="sr-only"
            />
          </label>
        )}
      </div>

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
