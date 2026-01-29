'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Sparkles, Image as ImageIcon, AlertTriangle } from 'lucide-react';
import { generateCustomCakeImage } from '@/lib/apis/imagen-api';
import type { ImageProposalResponse } from '@/components/order/order-wizard-modal';

interface CustomizationStepProps {
  dictionary: any;
  orderData: {
    recipeType: { nombre: 'TORTA' | 'CUPCAKE' } | null;
    size: { nombre: string } | null;
    sponge: { nombre: string } | null;
    filling: { nombre: string } | null;
    coverage: { nombre: string } | null;
    customization: string | null;
    imageProposalData: ImageProposalResponse | null; // This is the ACCEPTED proposal from the parent
  };
  onValueChange: (value: string) => void;
  onProposalChange: (proposal: ImageProposalResponse | null) => void;
  onEnhanceWithAI: () => Promise<void>;
  isAILoading: boolean;
}

export const CustomizationStep = ({
  dictionary,
  orderData,
  onValueChange,
  onProposalChange, // This function updates the ACCEPTED proposal in the parent
  onEnhanceWithAI,
  isAILoading,
}: CustomizationStepProps) => {
  const [customizationText, setCustomizationText] = useState(orderData.customization || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // State to hold the most recently GENERATED proposal, before it's accepted.
  const [generatedProposal, setGeneratedProposal] = useState<ImageProposalResponse | null>(null);

  useEffect(() => {
    setCustomizationText(orderData.customization || '');
  }, [orderData.customization]);

  const { customizationStep } = dictionary.orderWizard;

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    setCustomizationText(newValue);
    onValueChange(newValue);
  };

  const handleGenerateProposal = async () => {
    setIsGenerating(true);
    setError(null);
    setGeneratedProposal(null); // Clear local generated proposal
    onProposalChange(null);     // Clear any previously ACCEPTED proposal in the parent

    try {
      const response = await generateCustomCakeImage(orderData);
      // **FIX**: Store the new proposal locally instead of sending it to the parent immediately.
      setGeneratedProposal(response);
    } catch (err: any) {
      setError(customizationStep.proposalError);
    } finally {
      setIsGenerating(false);
    }
  };

  // This is what should be displayed: the newly generated one, or the one already accepted from the parent.
  const displayProposal = generatedProposal || orderData.imageProposalData;
  // The accepted status is ALWAYS driven by the parent state.
  const isAccepted = orderData.imageProposalData !== null;

  const handleAcceptanceChange = (checked: boolean | 'indeterminate') => {
    if (checked && displayProposal) {
      // User accepts: promote the currently displayed proposal to the parent.
      onProposalChange(displayProposal);
    } else {
      // User un-accepts: clear the accepted proposal in the parent.
      onProposalChange(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-xl font-semibold">{customizationStep.title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{customizationStep.description}</p>
      </div>
      <div className="grid w-full gap-2">
        <Textarea
          id="customization-text"
          placeholder={customizationStep.placeholder}
          value={customizationText}
          onChange={handleTextChange}
          rows={5}
          className="text-base"
          disabled={isAILoading || isGenerating}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          onClick={onEnhanceWithAI} 
          disabled={isAILoading || !customizationText || isGenerating}
          variant="outline"
        >
          {isAILoading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {customizationStep.aiLoading}</>
          ) : (
            <><Sparkles className="mr-2 h-4 w-4" /> {customizationStep.aiButton}</>
          )}
        </Button>

        <Button onClick={handleGenerateProposal} disabled={!customizationText || isGenerating || isAILoading} >
          {isGenerating ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {customizationStep.proposalLoading}</>
          ) : (
             <>{customizationStep.generateProposalButton}</>
          )}
        </Button>
      </div>

      <div className="w-full p-4 border-2 border-dashed rounded-lg flex flex-col items-center justify-center min-h-[250px] bg-gray-50">
        {isGenerating ? (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p>{customizationStep.proposalLoading}</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-2 text-destructive">
            <AlertTriangle className="h-8 w-8" />
            <p>{error}</p>
            <Button onClick={handleGenerateProposal} variant="outline" size="sm">{customizationStep.retry}</Button>
          </div>
        ) : displayProposal?.imageUrl ? (
          <div className="flex flex-col items-center gap-4 w-full">
            <h4 className="font-semibold text-lg">{customizationStep.proposalTitle}</h4>
            <Image src={displayProposal.imageUrl} alt="Propuesta de pastel" width={300} height={300} className="rounded-lg border" />
            <div className="flex items-center space-x-2 bg-gray-100 p-3 rounded-lg">
              <Checkbox id="proposal-accepted" checked={isAccepted} onCheckedChange={handleAcceptanceChange} />
              <label htmlFor="proposal-accepted" className="text-sm font-medium leading-none">{customizationStep.acceptProposal}</label>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
             <ImageIcon className="h-10 w-10 mx-auto mb-2" />
             <p className="text-sm">{customizationStep.proposalPlaceholder}</p>
          </div>
        )}
      </div>
    </div>
  );
};
