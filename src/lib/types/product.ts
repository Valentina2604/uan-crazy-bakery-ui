import { ProductType } from './product-type';

export interface Product {
  id: number;
  nombre: string;
  composicion: string;
  tipoIngrediente: ProductType;
  valor: number;
}
