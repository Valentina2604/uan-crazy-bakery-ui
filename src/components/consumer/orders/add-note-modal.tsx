'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { getDictionary } from '@/lib/get-dictionary';
import { addNoteToOrder } from '@/lib/apis/orden-api';

type AddNoteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  orderId: number | null;
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  onNoteAdded: () => void; // Callback to refresh data
};

export function AddNoteModal({ isOpen, onClose, orderId, dictionary, onNoteAdded }: AddNoteModalProps) {
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { addNoteModal, toasts } = dictionary.consumerOrders;

  useEffect(() => {
    if (isOpen) {
      setNote('');
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!orderId || !note.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      await addNoteToOrder(orderId, { nota: note });
      toast({
        title: toasts.addNoteSuccess.title,
        description: toasts.addNoteSuccess.description,
      });
      onNoteAdded();
      onClose();
    } catch (error) {
      console.error("Error adding note:", error);
      toast({
        title: toasts.addNoteError.title,
        description: (error as Error).message || toasts.addNoteError.description,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{addNoteModal.title}</DialogTitle>
          <DialogDescription>
            {addNoteModal.description}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder={addNoteModal.placeholder}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>{addNoteModal.cancel}</Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? addNoteModal.submitting : addNoteModal.submit}
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
