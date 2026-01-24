'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cake, Cookie } from 'lucide-react';

interface RecipeTypeStepProps {
  dictionary: {
    adminSizesPage: {
      recipeTypes: {
        cake: string;
        cupcake: string;
      };
    };
    orderWizard: {
      recipeTypeDescriptions: {
        cake: string;
        cupcake: string;
      };
    };
  };
  onSelect: (recipeType: 'cake' | 'cupcake') => void;
  selectedRecipeType: 'cake' | 'cupcake' | null;
}

export function RecipeTypeStep({
  dictionary,
  onSelect,
  selectedRecipeType,
}: RecipeTypeStepProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card
        className={`cursor-pointer transition-all ${selectedRecipeType === 'cake' ? 'border-primary ring-2 ring-primary' : 'border-gray-200'}`}
        onClick={() => onSelect('cake')}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cake className="h-6 w-6" />
            {dictionary.adminSizesPage.recipeTypes.cake}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{dictionary.orderWizard.recipeTypeDescriptions.cake}</p>
        </CardContent>
      </Card>
      <Card
        className={`cursor-pointer transition-all ${selectedRecipeType === 'cupcake' ? 'border-primary ring-2 ring-primary' : 'border-gray-200'}`}
        onClick={() => onSelect('cupcake')}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cookie className="h-6 w-6" />
            {dictionary.adminSizesPage.recipeTypes.cupcake}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{dictionary.orderWizard.recipeTypeDescriptions.cupcake}</p>
        </CardContent>
      </Card>
    </div>
  );
}
