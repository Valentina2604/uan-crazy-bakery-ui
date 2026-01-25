'use client';

import { useEffect, useState } from 'react';
import { getIngredients } from '@/lib/apis/ingrediente-api';
import { Product } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CakeSlice, Loader2 } from 'lucide-react';

interface FillingStepProps {
  recipeType: 'TORTA' | 'CUPCAKE';
  sizeId: number;
  selectedFilling: Product | null;
  onSelect: (filling: Product) => void;
}

export const FillingStep = ({ 
  recipeType,
  sizeId,
  selectedFilling,
  onSelect,
}: FillingStepProps) => {
  const [fillings, setFillings] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFillings = async () => {
      if (!sizeId) {
        setIsLoading(false);
        setFillings([]);
        return;
      }
      try {
        setIsLoading(true);
        const data = await getIngredients(
          recipeType,
          sizeId.toString(),
          'RELLENO'
        );
        setFillings(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        setError('Failed to load fillings. Please try again later.');
        setFillings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFillings();
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

  if (fillings.length === 0) {
    return (
      <div className="text-center text-muted-foreground min-h-[200px] flex flex-col justify-center items-center">
        <p className="mb-2 font-semibold">No Fillings Available</p>
        <p>No available fillings were found for the selected size.</p>
        <p>Please go back and select a different size.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {fillings.map((filling) => (
        <Card
          key={filling.id}
          className={`cursor-pointer transition-all ${
            selectedFilling?.id === filling.id
              ? 'border-primary ring-2 ring-primary'
              : 'border-border'
          }`}
          onClick={() => onSelect(filling)}
        >
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">{filling.nombre}</CardTitle>
            <CakeSlice className="h-8 w-8 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription>{filling.composicion}</CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
