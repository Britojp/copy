import { ConfirmDialog } from './ConfirmDialog';

type DeleteConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  itemName?: string;
  isLoading?: boolean;
};

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title = 'Excluir Item',
  description,
  itemName,
  isLoading = false,
}: DeleteConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  const defaultDescription = itemName
    ? `Tem certeza que deseja excluir "${itemName}"? Esta ação não pode ser desfeita.`
    : 'Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.';

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={handleConfirm}
      title={title}
      description={description || defaultDescription}
      confirmText="Excluir"
      cancelText="Cancelar"
      variant="destructive"
      isLoading={isLoading}
    />
  );
}

