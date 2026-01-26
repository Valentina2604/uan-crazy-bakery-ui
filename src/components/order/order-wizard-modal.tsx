'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/context/session-provider';
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
import { CustomizationStep } from './wizard-steps/customization-step';
import ShippingStep, { ShippingData } from './wizard-steps/shipping-step';
import { AuthChoiceStep } from './wizard-steps/auth-choice-step';
import { LoginStep } from './wizard-steps/login-step';
import { RegisterStep } from './wizard-steps/register-step';
import { SummaryStep } from './wizard-steps/summary-step';
import { Tamano } from '@/lib/types/tamano';
import { Product } from '@/lib/types';

// --- Tipos e Interfaces ---
export interface ImageProposalResponse {
  prompt: string;
  imageUrl: string;
}

type FullDictionary = Awaited<ReturnType<typeof getDictionary>>;

export interface OrderData {
  recipeType: { nombre: 'TORTA' | 'CUPCAKE' } | null;
  size: Tamano | null;
  sponge: Product | null;
  filling: Product | null;
  coverage: Product | null;
  customization: string | null;
  imageProposalData: ImageProposalResponse | null;
  quantity: number;
}

type AuthStep = 'choice' | 'login' | 'register';

// --- Componente Principal ---
export function OrderWizardModal({
  lang,
  dictionary,
}: {
  lang: Locale;
  dictionary: FullDictionary;
}) {
  // --- Hooks (Nivel Superior) ---
  const [isOpen, setIsOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [orderData, setOrderData] = useState<OrderData>({ recipeType: null, size: null, sponge: null, filling: null, coverage: null, customization: null, imageProposalData: null, quantity: 1 });
  const [shippingData, setShippingData] = useState<ShippingData>({ telefono: '', direccion: '', departamento: '', ciudad: '' });
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [isAILoading, setIsAILoading] = useState(false);
  const [authStep, setAuthStep] = useState<AuthStep>('choice');
  
  const router = useRouter();
  const { user, loading: sessionLoading, refreshSession } = useSession();
  const { orderWizard } = dictionary;
  const steps = Object.values(orderWizard.steps);

  // --- Efectos ---
  useEffect(() => {
    if (user) {
      setShippingData({
        telefono: user.telefono || '',
        direccion: user.direccion || '',
        departamento: user.departamento || '',
        ciudad: user.ciudad || '',
      });
    }
  }, [user]);

  // --- Handlers ---
  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep === 6 && authStep !== 'choice') {
      setAuthStep('choice');
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIsOpen(false);
      setTimeout(() => router.push(`/${lang}`), 200);
    }
  };

  const handleAuthSuccess = async () => {
    await refreshSession();
  };

  const resetSubsequentSteps = () => ({ size: null, sponge: null, filling: null, coverage: null, customization: null, imageProposalData: null, quantity: 1 });

  const handleRecipeTypeSelect = (recipeType: { nombre: 'TORTA' | 'CUPCAKE' }) => {
    const quantity = recipeType.nombre === 'CUPCAKE' ? 6 : 1;
    setOrderData({ recipeType, ...resetSubsequentSteps(), quantity });
  }
  const handleSizeSelect = (size: Tamano) => setOrderData({ ...orderData, size, sponge: null, filling: null, coverage: null, customization: null, imageProposalData: null });
  const handleSpongeSelect = (sponge: Product) => setOrderData({ ...orderData, sponge, filling: null, coverage: null, customization: null, imageProposalData: null });
  const handleFillingSelect = (filling: Product) => setOrderData({ ...orderData, filling, coverage: null, customization: null, imageProposalData: null });
  const handleCoverageSelect = (coverage: Product) => setOrderData({ ...orderData, coverage, customization: null, imageProposalData: null });
  const handleCustomizationChange = (value: string) => setOrderData({ ...orderData, customization: value, imageProposalData: null });
  const handleProposalChange = (proposal: ImageProposalResponse | null) => setOrderData(prev => ({ ...prev, imageProposalData: proposal }));
  const handleQuantityChange = (quantity: number) => setOrderData(prev => ({ ...prev, quantity }));

  const handleEnhanceWithAI = async () => {
    setIsAILoading(true);
    const initialText = orderData.customization;
    setOrderData(prev => ({ ...prev, imageProposalData: null, customization: '' }));

    const response = await fetch('/api/generate-suggestion', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ orderData: orderData, customizationText: initialText })
    });

    if (!response.ok || !response.body) {
      setIsAILoading(false);
      setOrderData(prev => ({ ...prev, customization: initialText }));
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';
    while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value);
        setOrderData(prev => ({ ...prev, customization: fullText }));
    }
    setIsAILoading(false);
  };

  const handleFinish = () => {
    console.log("Final Order Data:", JSON.stringify(orderData, null, 2));
    console.log("Final Shipping Data:", JSON.stringify(shippingData, null, 2));
  };

  // --- Lógica de Renderizado ---
  const progress = ((currentStep + 1) / steps.length) * 100;

  const isNextButtonDisabled = () => {
    if (isUpdating) return true;
    if (currentStep === 6 && !user) return true;
    switch (currentStep) {
      case 0: return orderData.recipeType === null;
      case 1: return orderData.size === null;
      case 2: return orderData.sponge === null;
      case 3: return orderData.filling === null;
      case 4: return orderData.coverage === null;
      case 5: return !orderData.customization || !orderData.imageProposalData;
      default: return false;
    }
  };

  const renderStepContent = () => {
    if (currentStep > 4 && (!orderData.recipeType || !orderData.size)) return null;
    
    switch (currentStep) {
      case 0: return <RecipeTypeStep dictionary={dictionary} onSelect={handleRecipeTypeSelect} selectedRecipeType={orderData.recipeType} />;
      case 1: return <SizeStep recipeType={orderData.recipeType!.nombre} selectedSize={orderData.size} onSelect={handleSizeSelect} dictionary={dictionary} />;
      case 2: return <SpongeStep recipeType={orderData.recipeType!.nombre} sizeId={orderData.size!.id} selectedSponge={orderData.sponge} onSelect={handleSpongeSelect} />;
      case 3: return <FillingStep recipeType={orderData.recipeType!.nombre} sizeId={orderData.size!.id} selectedFilling={orderData.filling} onSelect={handleFillingSelect} />;
      case 4: return <CoverageStep recipeType={orderData.recipeType!.nombre} sizeId={orderData.size!.id} selectedCoverage={orderData.coverage} onSelect={handleCoverageSelect} />;
      case 5: return <CustomizationStep dictionary={dictionary} orderData={orderData} onValueChange={handleCustomizationChange} onEnhanceWithAI={handleEnhanceWithAI} isAILoading={isAILoading} onProposalChange={handleProposalChange}/>;
      case 6: 
        if (sessionLoading) return <div className="flex justify-center items-center h-full min-h-[300px]"></div>;
        if (!user) {
          if (authStep === 'choice') {
            return <AuthChoiceStep dictionary={dictionary} onLoginClick={() => setAuthStep('login')} onRegisterClick={() => setAuthStep('register')} />;
          }
          if (authStep === 'login') {
            return <LoginStep dictionary={dictionary} onLoginSuccess={handleAuthSuccess} />;
          }
          if (authStep === 'register') {
            return <RegisterStep dictionary={dictionary} onRegisterSuccess={handleAuthSuccess} />;
          }
          return null;
        } else {
          return <ShippingStep data={shippingData} onDataChange={setShippingData} dictionary={dictionary} />;
        }
      case 7: 
        return <SummaryStep dictionary={dictionary} orderData={orderData} shippingData={shippingData} onQuantityChange={handleQuantityChange} />
      default: return null;
    }
  };

  // --- JSX ---
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader><DialogTitle>{orderWizard.title}</DialogTitle></DialogHeader>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4"><div className="bg-primary h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div></div>
        <div className="flex-grow py-4 overflow-y-auto"><h2 className="text-xl font-semibold mb-4">{steps[currentStep]}</h2>{renderStepContent()}</div>
        <DialogFooter className="mt-4 flex-col items-end">
          {updateError && <p className="text-red-500 text-sm mr-auto">{updateError}</p>}
          <div className="flex justify-end w-full">
            {currentStep > 0 && <Button variant="outline" onClick={handleBack}>{orderWizard.buttons.back}</Button>}
            {currentStep < steps.length - 1 ? (
              <Button onClick={handleNext} disabled={isNextButtonDisabled()}>
                {isUpdating ? orderWizard.buttons.saving : orderWizard.buttons.next}
              </Button>
            ) : (
              <Button onClick={handleFinish} disabled={isNextButtonDisabled()}>{orderWizard.buttons.finish}</Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
