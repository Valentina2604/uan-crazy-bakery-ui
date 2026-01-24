
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Locale } from '../../../i18n-config';
import { getDictionary } from '@/lib/get-dictionary';
import { Button } from '@/components/ui/button';

type OrderWizardDictionary = Awaited<ReturnType<typeof getDictionary>>['orderWizard'];

export function OrderWizardModal({
  lang,
  dictionary,
}: {
  lang: Locale;
  dictionary: OrderWizardDictionary;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const steps = Object.values(dictionary.steps);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIsOpen(false);
      setTimeout(() => {
        router.push(`/${lang}`);
      }, 200);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{dictionary.title}</DialogTitle>
        </DialogHeader>

        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div
            className="bg-primary h-2.5 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="flex-grow py-4 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">{steps[currentStep]}</h2>

          {/* Placeholder content for each step */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg h-full p-4">
            <p>Contenido del paso ''{steps[currentStep]}'' irá aquí. Esta es la fase 2.</p>
          </div>
        </div>

        <DialogFooter className="mt-4">
          {currentStep > 0 && (
            <Button variant="outline" onClick={handleBack}>
              {dictionary.buttons.back}
            </Button>
          )}
          {currentStep < steps.length - 1 ? (
            <Button onClick={handleNext}>{dictionary.buttons.next}</Button>
          ) : (
            <Button onClick={() => alert('Finalizar pedido')}>
              {dictionary.buttons.finish}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
