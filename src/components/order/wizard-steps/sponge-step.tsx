'use client';

import { useEffect, useState } from 'react';
import { getIngredients } from '@/lib/apis/ingrediente-api';
import { Product } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CakeSlice, Loader2 } from 'lucide-react';

// 1. Actualizar la interfaz para aceptar los valores correctos
interface SpongeStepProps {
  recipeType: 'TORTA' | 'CUPCAKE';
  sizeId: number;
  selectedSponge: Product | null;
  onSelect: (sponge: Product) => void;
}

export const SpongeStep = ({ 
  recipeType,
  sizeId,
  selectedSponge,
  onSelect,
}: SpongeStepProps) => {
  const [sponges, setSponges] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSponges = async () => {
      if (!sizeId) {
        setIsLoading(false);
        setSponges([]);
        return;
      }
      try {
        setIsLoading(true);
        // 2. Usar la prop directamente, sin traducción
        const data = await getIngredients(
          recipeType,
          sizeId.toString(),
          'BIZCOCHO'
        );
        // 3. Asegurar que el estado sea siempre un array
        setSponges(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        setError('Failed to load flavors. Please try again later.');
        setSponges([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSponges();
  }, [recipeType, sizeId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[200px]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (sponges.length === 0) {
    return (
      <div className="text-center text-muted-foreground min-h-[200px] flex flex-col justify-center items-center">
        <p className="mb-2 font-semibold">No Flavors Available</p>
        <p>No available flavors were found for the selected size.</p>
        <p>Please go back and select a different size.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sponges.map((sponge) => (
        <Card
          key={sponge.id}
          className={`cursor-pointer transition-all ${
            selectedSponge?.id === sponge.id
              ? 'border-primary ring-2 ring-primary'
              : 'border-border'
          }`}
          onClick={() => onSelect(sponge)}
        >
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">{sponge.nombre}</CardTitle>
            <CakeSlice className="h-8 w-8 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription>{sponge.composicion}</CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
