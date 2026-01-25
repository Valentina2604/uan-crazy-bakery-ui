'use client';

import { useEffect, useState } from 'react';
import { ArrowUpFromLine, Users, Circle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTamanosByTipoReceta } from '@/lib/apis/tamano-api';
import { Tamano, TipoReceta } from '@/lib/types/tamano';
import { getDictionary } from '@/lib/get-dictionary';

type FullDictionary = Awaited<ReturnType<typeof getDictionary>>;

interface SizeStepProps {
  recipeType: 'cake' | 'cupcake';
  selectedSize: Tamano | null;
  onSelect: (size: Tamano) => void;
  dictionary: FullDictionary;
}

function mapRecipeType(recipeType: 'cake' | 'cupcake'): TipoReceta {
  return recipeType === 'cake' ? 'TORTA' : 'CUPCAKE';
}

export function SizeStep({ recipeType, selectedSize, onSelect, dictionary }: SizeStepProps) {
  const [sizes, setSizes] = useState<Tamano[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSizes() {
      try {
        setIsLoading(true);
        setError(null);
        const apiRecipeType = mapRecipeType(recipeType);
        const fetchedSizes = await getTamanosByTipoReceta(apiRecipeType);
        setSizes(fetchedSizes);
      } catch (err) {
        setError('Error al cargar los tamaños. Por favor, intenta de nuevo.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSizes();
  }, [recipeType]);

  const { sizeDetails } = dictionary.orderWizard;

  if (isLoading) {
    return <p>Cargando tamaños...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sizes.map(size => (
        <Card
          key={size.id}
          className={`cursor-pointer transition-all ${selectedSize?.id === size.id ? 'border-primary ring-2 ring-primary' : 'border-gray-200'}`}
          onClick={() => onSelect(size)}
        >
          <CardHeader>
            <CardTitle className="text-center">{size.nombre}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-gray-600" />
              <span className="font-medium">{sizeDetails.portions}:</span>
              <span>{size.porciones}</span>
            </div>
            {recipeType === 'cake' && (
              <>
                <div className="flex items-center gap-3">
                  <ArrowUpFromLine className="h-5 w-5 text-gray-600" />
                  <span className="font-medium">{sizeDetails.height}:</span>
                  <span>{size.alto} cm</span>
                </div>
                <div className="flex items-center gap-3">
                  <Circle className="h-5 w-5 text-gray-600" />
                  <span className="font-medium">{sizeDetails.diameter}:</span>
                  <span>{size.diametro} cm</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
