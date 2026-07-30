import { useCallback, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FileUp, X, FileText, FileSpreadsheet, Image as ImageIcon } from 'lucide-react';

export interface UploadFile {
  id: string;
  file: File;
}

interface FileDropzoneProps {
  files: UploadFile[];
  onAdd: (files: File[]) => void;
  onRemove: (id: string) => void;
  disabled?: boolean;
}

const ACCEPT = '.pdf,.xlsx,.xls,.csv,.png,.jpg,.jpeg,.webp';

const iconFor = (name: string) => {
  const n = name.toLowerCase();
  if (n.endsWith('.pdf')) return FileText;
  if (n.match(/\.(xlsx|xls|csv)$/)) return FileSpreadsheet;
  return ImageIcon;
};

export function FileDropzone({ files, onAdd, onRemove, disabled }: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  const handleFiles = useCallback(
    (list: FileList | null) => {
      if (!list) return;
      onAdd(Array.from(list));
    },
    [onAdd]
  );

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => !disabled && inputRef.current?.click()}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-6 py-10 text-center transition-colors',
          over ? 'border-primary bg-primary/5' : 'border-[hsl(var(--border-subtle))] hover:bg-muted/40',
          disabled && 'pointer-events-none opacity-60'
        )}
      >
        <FileUp className="h-6 w-6 text-primary" strokeWidth={1.75} />
        <p className="mt-3 text-[14px] font-medium text-[hsl(var(--text-primary))]">
          Arraste os orçamentos dos fornecedores
        </p>
        <p className="mt-1 text-[12px] text-[hsl(var(--text-tertiary))]">
          PDF, Excel (xlsx/xls/csv) ou imagens · múltiplos arquivos
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPT}
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      {files.length > 0 && (
        <ul className="grid gap-2 sm:grid-cols-2">
          {files.map(({ id, file }) => {
            const Icon = iconFor(file.name);
            return (
              <li
                key={id}
                className="flex items-center gap-2 rounded-lg border border-[hsl(var(--border-subtle))] px-3 py-2"
              >
                <Icon className="h-4 w-4 shrink-0 text-[hsl(var(--text-quaternary))]" />
                <span className="flex-1 truncate text-[13px]">{file.name}</span>
                <span className="text-[11px] tabular-nums text-[hsl(var(--text-quaternary))]">
                  {(file.size / 1024).toFixed(0)} KB
                </span>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onRemove(id)}>
                  <X className="h-3.5 w-3.5" />
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
