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
import { RecipeTypeStep } from './wizard-steps/recipe-type-step';

type FullDictionary = Awaited<ReturnType<typeof getDictionary>>;

interface OrderData {
  recipeType: 'cake' | 'cupcake' | null;
}

export function OrderWizardModal({
  lang,
  dictionary,
}: {
  lang: Locale;
  dictionary: FullDictionary;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [orderData, setOrderData] = useState<OrderData>({ recipeType: null });
  const router = useRouter();

  const { orderWizard } = dictionary;
  const steps = Object.values(orderWizard.steps);

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

  const handleRecipeTypeSelect = (recipeType: 'cake' | 'cupcake') => {
    setOrderData({ ...orderData, recipeType });
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <RecipeTypeStep
            dictionary={dictionary}
            onSelect={handleRecipeTypeSelect}
            selectedRecipeType={orderData.recipeType}
          />
        );
      default:
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg h-full p-4">
            <p>Contenido del paso ''{steps[currentStep]}'' irá aquí.</p>
          </div>
        );
    }
  };

  const isNextButtonDisabled = () => {
    switch (currentStep) {
      case 0:
        return orderData.recipeType === null;
      default:
        return false;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{orderWizard.title}</DialogTitle>
        </DialogHeader>

        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div
            className="bg-primary h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="flex-grow py-4 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">{steps[currentStep]}</h2>
          {renderStepContent()}
        </div>

        <DialogFooter className="mt-4">
          {currentStep > 0 && (
            <Button variant="outline" onClick={handleBack}>
              {orderWizard.buttons.back}
            </Button>
          )}
          {currentStep < steps.length - 1 ? (
            <Button onClick={handleNext} disabled={isNextButtonDisabled()}>
              {orderWizard.buttons.next}
            </Button>
          ) : (
            <Button onClick={() => alert('Finalizar pedido')}>
              {orderWizard.buttons.finish}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
