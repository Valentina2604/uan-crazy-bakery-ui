import { Product } from './product';
import { Tamano } from './tamano';

// Based on the class diagram

export type TipoReceta = 'TORTA' | 'OTRO'; // Assuming other types might exist

export interface Torta {
  bizcocho: Product;
  relleno: Product;
  cubertura: Product;
  tamano: Tamano;
  valor: number;
  estado: boolean;
}

export interface Receta {
  id: number; // Assuming Receta also has an ID
  tipoReceta: TipoReceta;
  torta?: Torta;
  cantidad: number;
  costoManoObra: number;
  costoOperativo: number;
  prompt: string;
  imagenUrl: string;
  estado: boolean;
}
