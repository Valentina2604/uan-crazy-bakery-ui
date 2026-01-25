'use client';

import { useEffect, useState } from 'react';
import { ArrowUpFromLine, Users, Circle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTamanosByTipoReceta } from '@/lib/apis/tamano-api';
import { Tamano } from '@/lib/types/tamano';
import { getDictionary } from '@/lib/get-dictionary';

type FullDictionary = Awaited<ReturnType<typeof getDictionary>>;

// 1. Corregir la interfaz para que espere el tipo de dato correcto del componente padre.
interface SizeStepProps {
  recipeType: 'TORTA' | 'CUPCAKE';
  selectedSize: Tamano | null;
  onSelect: (size: Tamano) => void;
  dictionary: FullDictionary;
}

// 2. La función de mapeo ya no es necesaria, ya que los datos son consistentes.

export function SizeStep({ recipeType, selectedSize, onSelect, dictionary }: SizeStepProps) {
  const [sizes, setSizes] = useState<Tamano[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSizes() {
      // El useEffect ya se dispara correctamente cuando `recipeType` cambia. 
      // Ahora, simplemente usamos el valor directo.
      try {
        setIsLoading(true);
        setError(null);
        const fetchedSizes = await getTamanosByTipoReceta(recipeType);
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
    return (
      <div className="flex justify-center items-center h-full min-h-[200px]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sizes.map(size => (
        <Card
          key={size.id}
          className={`cursor-pointer transition-all ${selectedSize?.id === size.id ? 'border-primary ring-2 ring-primary' : 'border-border'}`}
          onClick={() => onSelect(size)}
        >
          <CardHeader>
            <CardTitle className="text-center">{size.nombre}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">{sizeDetails.portions}:</span>
              <span>{size.porciones}</span>
            </div>
            {/* 3. Actualizar la lógica de renderizado condicional para usar el valor correcto. */}
            {recipeType === 'TORTA' && (
              <>
                <div className="flex items-center gap-3">
                  <ArrowUpFromLine className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{sizeDetails.height}:</span>
                  <span>{size.alto} cm</span>
                </div>
                <div className="flex items-center gap-3">
                  <Circle className="h-5 w-5 text-muted-foreground" />
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
