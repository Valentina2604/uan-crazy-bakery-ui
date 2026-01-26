'use client';

import { Button } from '@/components/ui/button';
import { getDictionary } from '@/lib/get-dictionary';

type FullDictionary = Awaited<ReturnType<typeof getDictionary>>;

interface AuthChoiceStepProps {
  dictionary: FullDictionary;
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export function AuthChoiceStep({ dictionary, onLoginClick, onRegisterClick }: AuthChoiceStepProps) {
  const { authChoiceStep } = dictionary.orderWizard;

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 rounded-lg max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-2">{authChoiceStep.title}</h2>
      <p className="text-muted-foreground mb-6">{authChoiceStep.description}</p>
      <div className="flex gap-4">
        <Button onClick={onLoginClick} size="lg">{authChoiceStep.loginButton}</Button>
        <Button onClick={onRegisterClick} size="lg" variant="outline">{authChoiceStep.registerButton}</Button>
      </div>
    </div>
  );
}
