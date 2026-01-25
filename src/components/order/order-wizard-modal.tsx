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
import { SizeStep } from './wizard-steps/size-step';
import { SpongeStep } from './wizard-steps/sponge-step';
import { FillingStep } from './wizard-steps/filling-step';
import { CoverageStep } from './wizard-steps/coverage-step';
import { Tamano } from '@/lib/types/tamano';
import { Product } from '@/lib/types';

type FullDictionary = Awaited<ReturnType<typeof getDictionary>>;

interface OrderData {
  recipeType: { nombre: 'TORTA' | 'CUPCAKE' } | null;
  size: Tamano | null;
  sponge: Product | null;
  filling: Product | null;
  coverage: Product | null;
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
  const [orderData, setOrderData] = useState<OrderData>({
    recipeType: null,
    size: null,
    sponge: null,
    filling: null,
    coverage: null,
  });
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

  const handleRecipeTypeSelect = (recipeType: { nombre: 'TORTA' | 'CUPCAKE' }) => {
    setOrderData({ recipeType, size: null, sponge: null, filling: null, coverage: null });
  };

  const handleSizeSelect = (size: Tamano) => {
    setOrderData({ ...orderData, size, sponge: null, filling: null, coverage: null });
  };

  const handleSpongeSelect = (sponge: Product) => {
    setOrderData({ ...orderData, sponge, filling: null, coverage: null });
  };

  const handleFillingSelect = (filling: Product) => {
    setOrderData({ ...orderData, filling, coverage: null });
  };

  const handleCoverageSelect = (coverage: Product) => {
    setOrderData({ ...orderData, coverage });
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <RecipeTypeStep dictionary={dictionary} onSelect={handleRecipeTypeSelect} selectedRecipeType={orderData.recipeType} />;
      case 1:
        if (!orderData.recipeType) return null;
        return <SizeStep recipeType={orderData.recipeType.nombre} selectedSize={orderData.size} onSelect={handleSizeSelect} dictionary={dictionary} />;
      case 2:
        if (!orderData.recipeType || !orderData.size) return null;
        return <SpongeStep recipeType={orderData.recipeType.nombre} sizeId={orderData.size.id} selectedSponge={orderData.sponge} onSelect={handleSpongeSelect} />;
      case 3:
        if (!orderData.recipeType || !orderData.size) return null;
        return <FillingStep recipeType={orderData.recipeType.nombre} sizeId={orderData.size.id} selectedFilling={orderData.filling} onSelect={handleFillingSelect} />;
      case 4:
        if (!orderData.recipeType || !orderData.size) return null;
        // La corrección del error de tipeo está aquí
        return <CoverageStep recipeType={orderData.recipeType.nombre} sizeId={orderData.size.id} selectedCoverage={orderData.coverage} onSelect={handleCoverageSelect} />;
      default:
        return <div className="border-2 border-dashed border-gray-300 rounded-lg h-full p-4"><p>Contenido del paso ''{steps[currentStep]}'' irá aquí.</p></div>;
    }
  };

  const isNextButtonDisabled = () => {
    switch (currentStep) {
      case 0: return orderData.recipeType === null;
      case 1: return orderData.size === null;
      case 2: return orderData.sponge === null;
      case 3: return orderData.filling === null;
      case 4: return orderData.coverage === null;
      default: return false;
    }
  };

  const handleFinish = () => {
    console.log("Order Data:", JSON.stringify(orderData, null, 2));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{orderWizard.title}</DialogTitle>
        </DialogHeader>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div className="bg-primary h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="flex-grow py-4 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">{steps[currentStep]}</h2>
          {renderStepContent()}
        </div>
        <DialogFooter className="mt-4">
          {currentStep > 0 && <Button variant="outline" onClick={handleBack}>{orderWizard.buttons.back}</Button>}
          {currentStep < steps.length - 1 ? (
            <Button onClick={handleNext} disabled={isNextButtonDisabled()}>{orderWizard.buttons.next}</Button>
          ) : (
            <Button onClick={handleFinish} disabled={isNextButtonDisabled()}>{orderWizard.buttons.finish}</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
