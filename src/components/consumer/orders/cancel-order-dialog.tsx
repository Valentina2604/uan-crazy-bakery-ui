'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { getDictionary } from '@/lib/get-dictionary';
import { updateOrderStatus } from '@/lib/apis/orden-api';

type CancelOrderDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  orderId: number | null;
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
};

export function CancelOrderDialog({ isOpen, onClose, onConfirm, orderId, dictionary }: CancelOrderDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { cancelOrderDialog, toasts } = dictionary.consumerOrders;

  const handleConfirmCancellation = async () => {
    if (!orderId) return;

    setIsLoading(true);
    try {
      await updateOrderStatus(orderId, { estado: 'CANCELADO' });
      toast({
        title: toasts.cancelOrderSuccess.title,
        description: toasts.cancelOrderSuccess.description,
      });
      onConfirm(); // Refreshes list and closes modal
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast({
        title: toasts.cancelOrderError.title,
        description: (error as Error).message || toasts.cancelOrderError.description,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{cancelOrderDialog.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {cancelOrderDialog.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={isLoading}>
            {cancelOrderDialog.cancel}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmCancellation} disabled={isLoading}>
            {isLoading ? cancelOrderDialog.confirming : cancelOrderDialog.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
