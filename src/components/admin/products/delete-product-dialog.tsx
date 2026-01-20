import { Ingrediente } from '@/lib/types/ingrediente';

export default function DeleteIngredientDialog({ ingredient }: { ingredient: Ingrediente }) {
  return (
    <div>
      <h2>Eliminar Ingrediente</h2>
      <p>¿Estás seguro que quieres eliminar el ingrediente {ingredient.nombre}?</p>
      <button>Eliminar</button>
      <button>Cancelar</button>
    </div>
  );
}
