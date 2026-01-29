
const BASE_URL = 'https://crazy-bakery-bk-835393530868.us-central1.run.app';

// --- Crear Orden ---

/**
 * Interfaz para la solicitud de creación de una orden.
 */
export interface CrearOrdenRequest {
  usuarioId: string;
  recetaIds: number[];
  notas: string[];
}

/**
 * Interfaz para la respuesta de la creación de una orden.
 * El `id` es el campo crucial para el flujo de "añadir más productos".
 */
export interface CrearOrdenResponse {
  id: number;
  // Se pueden añadir más campos de la respuesta si son necesarios.
}

/**
 * Crea una nueva orden en el backend.
 * @param data - Los datos para la creación de la orden.
 * @returns Una promesa que resuelve con la respuesta del backend, incluyendo el ID de la orden creada.
 */
export async function crearOrden(data: CrearOrdenRequest): Promise<CrearOrdenResponse> {
  const response = await fetch(`${BASE_URL}/orden`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    cache: 'no-store',
  });

  if (!response.ok) {
    console.error('Error al crear la orden:', response);
    const errorData = await response.json().catch(() => ({ message: 'No se pudo decodificar el error del servidor.' }));
    throw new Error(errorData.message || 'Ocurrió un error inesperado al crear la orden.');
  }

  return response.json();
}

// --- Agregar Receta a Orden Existente ---

/**
 * Interfaz para la solicitud de agregar una receta a una orden.
 */
export interface AgregarRecetaRequest {
    recetaId: number;
}

/**
 * Interfaz para la respuesta de agregar una receta a una orden.
 * Por ahora, la respuesta completa se devuelve como un objeto genérico.
 */
export type AgregarRecetaResponse = object;

/**
 * Agrega una receta a una orden existente en el backend.
 * @param ordenId - El ID de la orden a la que se agregará la receta.
 * @param data - Los datos de la receta a agregar.
 * @returns Una promesa que resuelve con la respuesta del backend.
 */
export async function agregarRecetaAOrden(
    ordenId: number, 
    data: AgregarRecetaRequest
): Promise<AgregarRecetaResponse> {
  const response = await fetch(`${BASE_URL}/orden/${ordenId}/receta`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    cache: 'no-store',
  });

  if (!response.ok) {
    console.error('Error al agregar la receta a la orden:', response);
    const errorData = await response.json().catch(() => ({ message: 'No se pudo decodificar el error del servidor.' }));
    throw new Error(errorData.message || 'Ocurrió un error inesperado al agregar la receta a la orden.');
  }

  return response.json();
}
