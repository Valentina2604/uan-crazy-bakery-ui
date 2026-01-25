'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cake, Cookie } from 'lucide-react';

// 1. Actualizar la interfaz de Props para que coincida con la nueva estructura de datos simple.
interface RecipeTypeStepProps {
  dictionary: {
    orderWizard: {
      recipeTypeDescriptions: {
        cake: string;
        cupcake: string;
      };
    };
  };
  onSelect: (recipeType: { nombre: 'TORTA' | 'CUPCAKE' }) => void;
  selectedRecipeType: { nombre: 'TORTA' | 'CUPCAKE' } | null;
}

// 2. Definir los datos de las tarjetas de forma estática, eliminando la necesidad de una llamada a la API.
const recipeOptions = [
  {
    key: 'TORTA' as const,
    icon: <Cake className="h-8 w-8 text-muted-foreground" />,
    descriptionKey: 'cake' as const,
  },
  {
    key: 'CUPCAKE' as const,
    icon: <Cookie className="h-8 w-8 text-muted-foreground" />,
    descriptionKey: 'cupcake' as const,
  },
];

// Función para convertir 'TORTA' a 'Torta' para una mejor presentación
const formatTitle = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export function RecipeTypeStep({
  dictionary,
  onSelect,
  selectedRecipeType,
}: RecipeTypeStepProps) {

  // 3. Renderizar las tarjetas estáticas. El componente ahora es simple y no tiene estado propio.
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {recipeOptions.map((option) => (
        <Card
          key={option.key}
          className={`cursor-pointer transition-all ${
            selectedRecipeType?.nombre === option.key
              ? 'border-primary ring-2 ring-primary'
              : 'border-border'
          }`}
          // 4. Al hacer clic, llamar a onSelect con el objeto simple que espera el componente padre.
          onClick={() => onSelect({ nombre: option.key })}
        >
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">{formatTitle(option.key)}</CardTitle>
            {option.icon}
          </CardHeader>
          <CardContent>
            <p>{dictionary.orderWizard.recipeTypeDescriptions[option.descriptionKey]}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
