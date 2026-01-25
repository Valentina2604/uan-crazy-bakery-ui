import OpenAI from 'openai';
import { streamText } from 'ai';

const openai = new OpenAI();

export const runtime = 'edge';

function buildPrompt(orderData: any, customizationText: string): string {
  const { recipeType, size, sponge, filling, coverage } = orderData;

  let prompt = `Actúa como un asistente experto de una pastelería creativa. Un cliente está personalizando un pedido y necesita ayuda para refinar su idea.`;
  prompt += `\n\nEl cliente ha seleccionado lo siguiente:\n`;
  prompt += `- Tipo: ${recipeType?.nombre || 'No especificado'}\n`;
  if (size) {
    prompt += `- Tamaño: ${size.nombre} (para ${size.porciones} porciones)\n`;
  }
  prompt += `- Bizcocho: ${sponge?.nombre || 'No especificado'}\n`;
  prompt += `- Relleno: ${filling?.nombre || 'No especificado'}\n`;
  prompt += `- Cobertura: ${coverage?.nombre || 'No especificado'}\n`;

  prompt += `\nLa idea inicial del cliente para la decoración es: "${customizationText}"\n`;

  prompt += `\nAhora, aplica tus conocimientos de pastelería siguiendo estas reglas estrictas:\n`;
  prompt += `1.  **Toppings:** Eres libre de usar y sugerir creativamente cualquier topping que encaje con la descripción del cliente (chispas, frutas, perlas de azúcar, etc.).\n`;
  prompt += `2.  **Imágenes:** Puedes proponer decoraciones que incluyan imágenes impresas en papel de arroz. Son una excelente opción para temas específicos.\n`;
  prompt += `3.  **Figuras 3D:** NO puedes crear figuras complejas en 3D (ej: personajes modelados en fondant). Menciona esta limitación si el cliente la pide, pero ofrece una alternativa creativa (como una impresión en papel de arroz).\n`;
  prompt += `4.  **Formato:** Tu respuesta debe ser una única descripción mejorada y detallada de la decoración final. No ofrezcas varias opciones. Debe ser un párrafo coherente y atractivo que el cliente pueda leer y confirmar.\n`;
  prompt += `5.  **Tono:** Sé amable, creativo y describe el pastel de una manera que suene deliciosa y visualmente atractiva.\n`;

  prompt += `\nBasado en toda esta información, genera ahora la descripción de la decoración final para el pastel.\n`;

  return prompt;
}

export async function POST(req: Request) {
  // --- LOG DE DIAGNÓSTICO 1: VERIFICACIÓN DE LA CLAVE API ---
  console.log('--- Iniciando la generación de sugerencia de IA ---');
  if (process.env.OPENAI_API_KEY) {
    console.log('Clave de API de OpenAI encontrada en las variables de entorno.');
  } else {
    console.error('¡Error Crítico! La variable de entorno OPENAI_API_KEY no está configurada.');
    // Detenemos la ejecución si la clave no está para evitar un error inevitable
    return new Response('Error de configuración del servidor: la clave de API no está disponible.', { status: 500 });
  }

  const { orderData, customizationText } = await req.json();

  if (!orderData || !customizationText) {
    return new Response('Faltan datos en la solicitud', { status: 400 });
  }

  const prompt = buildPrompt(orderData, customizationText);

  try {
    const result = await streamText({
      model: openai.chat(process.env.OPENAI_API_MODEL || 'gpt-4-turbo-2024-04-09'),
      system: prompt,
      prompt: customizationText,
    });

    return result.toAIStreamResponse();

  } catch (error) {
    // --- LOG DE DIAGNÓSTICO 2: ERROR DETALLADO DE LA API ---
    console.error('\n--- ¡Error Detallado al llamar a la API de OpenAI! ---\n');
    
    // Imprimimos el objeto de error completo para obtener todos los detalles
    console.error(error);
    
    let errorMessage = 'Error interno al generar la sugerencia de la IA.';
    let errorStatus = 500;

    // Si el error es una instancia de APIError de OpenAI, podemos ser más específicos
    if (error instanceof OpenAI.APIError) {
        errorMessage = `Error de la API de OpenAI: ${error.message}`;
        errorStatus = error.status || 500;
    }

    return new Response(errorMessage, { status: errorStatus });
  }
}
