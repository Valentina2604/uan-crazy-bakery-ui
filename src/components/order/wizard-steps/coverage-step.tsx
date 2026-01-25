'use client';

import { useEffect, useState } from 'react';
import { getIngredients } from '@/lib/apis/ingrediente-api';
import { Product } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CakeSlice, Loader2 } from 'lucide-react';

interface CoverageStepProps {
  recipeType: 'TORTA' | 'CUPCAKE';
  sizeId: number;
  selectedCoverage: Product | null;
  onSelect: (coverage: Product) => void;
}

export const CoverageStep = ({ 
  recipeType,
  sizeId,
  selectedCoverage,
  onSelect,
}: CoverageStepProps) => {
  const [coverages, setCoverages] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoverages = async () => {
      if (!sizeId) {
        setIsLoading(false);
        setCoverages([]);
        return;
      }
      try {
        setIsLoading(true);
        const data = await getIngredients(
          recipeType,
          sizeId.toString(),
          'COBERTURA'
        );
        setCoverages(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        setError('Failed to load coverages. Please try again later.');
        setCoverages([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoverages();
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

  if (coverages.length === 0) {
    return (
      <div className="text-center text-muted-foreground min-h-[200px] flex flex-col justify-center items-center">
        <p className="mb-2 font-semibold">No Coverages Available</p>
        <p>No available coverages were found for the selected size.</p>
        <p>Please go back and select a different size.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {coverages.map((coverage) => (
        <Card
          key={coverage.id}
          className={`cursor-pointer transition-all ${
            selectedCoverage?.id === coverage.id
              ? 'border-primary ring-2 ring-primary'
              : 'border-border'
          }`}
          onClick={() => onSelect(coverage)}
        >
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">{coverage.nombre}</CardTitle>
            <CakeSlice className="h-8 w-8 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription>{coverage.composicion}</CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
