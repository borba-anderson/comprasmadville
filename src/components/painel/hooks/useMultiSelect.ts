import { useState, useCallback, useMemo } from 'react';

export function useMultiSelect<T extends { id: string }>(items: T[]) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleItem = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setSelectedIds((prev) => {
      if (prev.size === items.length && items.length > 0) {
        return new Set();
      }
      return new Set(items.map((item) => item.id));
    });
  }, [items]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(items.map((item) => item.id)));
  }, [items]);

  const isSelected = useCallback((id: string) => selectedIds.has(id), [selectedIds]);

  const selectedItems = useMemo(
    () => items.filter((item) => selectedIds.has(item.id)),
    [items, selectedIds]
  );

  const allSelected = items.length > 0 && selectedIds.size === items.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < items.length;

  return {
    selectedIds,
    selectedItems,
    selectedCount: selectedIds.size,
    isSelected,
    toggleItem,
    toggleAll,
    clearSelection,
    selectAll,
    allSelected,
    someSelected,
  };
}
