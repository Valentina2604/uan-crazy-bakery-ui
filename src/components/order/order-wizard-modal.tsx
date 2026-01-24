
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Locale } from '../../../i18n-config';
import { getDictionary } from '@/lib/get-dictionary';

type OrderWizardDictionary = Awaited<ReturnType<typeof getDictionary>>['orderWizard'];

export function OrderWizardModal({
  lang,
  dictionary,
}: {
  lang: Locale;
  dictionary: OrderWizardDictionary;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIsOpen(false);
      // Brief delay to allow the closing animation to finish before navigating
      setTimeout(() => {
        router.push(`/${lang}`);
      }, 200);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{dictionary.title}</DialogTitle>
        </DialogHeader>
        <div className="flex-grow py-4">
          <p>El contenido del Wizard irá aquí. Esta es la fase 1.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
