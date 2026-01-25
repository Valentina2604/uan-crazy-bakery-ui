import { Product } from '../types';

export const getIngredients = async (
  tipoReceta: string,
  tamanoId: string,
  tipoIngrediente: string
): Promise<Product[]> => {
  const response = await fetch(
    `https://crazy-bakery-bk-835393530868.us-central1.run.app/ingredientes/search?tipoReceta=${tipoReceta}&tamanoId=${tamanoId}&tipoIngrediente=${tipoIngrediente}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch ingredients');
  }

  const data: Product[] = await response.json();

  return data;
};
