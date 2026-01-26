'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getDictionary } from "@/lib/get-dictionary";
import { Separator } from '@/components/ui/separator';
import { useSession } from '@/context/session-provider';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';

type FullDictionary = Awaited<ReturnType<typeof getDictionary>>;

// Tipos para los datos del pedido y envío, extraídos del modal principal
interface OrderData {
  recipeType: { nombre: 'TORTA' | 'CUPCAKE' } | null;
  size: { nombre: string; porciones: number } | null;
  sponge: { nombre: string } | null;
  filling: { nombre: string } | null;
  coverage: { nombre: string } | null;
  customization: string | null;
  imageProposalData: { imageUrl: string } | null;
  quantity: number;
}

interface ShippingData {
  telefono: string;
  direccion: string;
  departamento: string;
  ciudad: string;
}

interface SummaryStepProps {
  dictionary: FullDictionary;
  orderData: OrderData;
  shippingData: ShippingData;
  onQuantityChange: (quantity: number) => void;
}

const DetailItem = ({ label, value, isCurrency = false }: { label: string; value: string | number | undefined | null, isCurrency?: boolean }) => (
    value || isCurrency ? (
      <div className="flex justify-between text-sm">
        <p className="font-medium text-muted-foreground">{label}:</p>
        <p className={`font-semibold text-right ${isCurrency ? 'font-mono' : ''}`}>
          {isCurrency ? `$${Number(value).toLocaleString('es-CO')}` : value}
        </p>
      </div>
    ) : null
  );

export function SummaryStep({ dictionary, orderData, shippingData, onQuantityChange }: SummaryStepProps) {
  const { user } = useSession();
  const t = dictionary.orderWizard.summaryStep;

  // --- Estados de Precios (Simulados) ---
  const [productCost, setProductCost] = useState(0);
  const [shippingCost, setShippingCost] = useState(5000); // Envío fijo simulado
  const [totalCost, setTotalCost] = useState(0);

  // --- Efectos para calcular costos ---
  useEffect(() => {
    // Simulación de costo base del producto
    const baseCost = orderData.recipeType?.nombre === 'TORTA' ? 80000 : 30000;
    const finalProductCost = baseCost * orderData.quantity;
    setProductCost(finalProductCost);
    setTotalCost(finalProductCost + shippingCost);
  }, [orderData.quantity, orderData.recipeType, shippingCost]);


  // Fallback si falta información esencial
  if (!orderData.recipeType || !orderData.size || !user) {
    return <div>Cargando resumen del pedido...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-h-[calc(90vh-200px)] overflow-y-auto p-1">
      {/* Columna Izquierda: Visual y Personalización */}
      <div className="space-y-6">
         <Card>
          <CardHeader><CardTitle>{t.visualProposal}</CardTitle></CardHeader>
          <CardContent>
            {orderData.imageProposalData?.imageUrl ? (
              <>
                <Image
                    src={orderData.imageProposalData.imageUrl}
                    alt="Propuesta visual del pastel"
                    width={500}
                    height={500}
                    className="rounded-lg object-cover w-full aspect-square"
                />
                <p className="text-xs text-muted-foreground mt-2 text-center">{t.visualProposalDisclaimer}</p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No se generó ninguna imagen.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Columna Derecha: Detalles del Producto, Envío y Precios */}
      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>{t.productDetails}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <DetailItem label={t.recipeType} value={orderData.recipeType.nombre} />
            <DetailItem label={t.size} value={`${orderData.size.nombre} (${orderData.size.porciones} porciones)`} />
            <Separator />
            <DetailItem label={t.sponge} value={orderData.sponge?.nombre} />
            <DetailItem label={t.filling} value={orderData.filling?.nombre} />
            <DetailItem label={t.coverage} value={orderData.coverage?.nombre} />
            <Separator />
            {/* Selector de Cantidad */}
            <div className="space-y-2">
                <Label htmlFor="quantity">{t.quantity}</Label>
                {orderData.recipeType.nombre === 'TORTA' ? (
                    <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={orderData.quantity}
                        onChange={(e) => onQuantityChange(Math.max(1, parseInt(e.target.value, 10) || 1))}
                        className="w-24"
                    />
                ) : (
                    <Select
                        value={String(orderData.quantity)}
                        onValueChange={(value) => onQuantityChange(Number(value))}
                    >
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Selecciona cantidad" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="6">Caja de 6</SelectItem>
                            <SelectItem value="12">Caja de 12</SelectItem>
                            <SelectItem value="24">Caja de 24</SelectItem>
                        </SelectContent>
                    </Select>
                )}
                <p className='text-xs text-muted-foreground'>
                    {orderData.recipeType.nombre === 'TORTA' ? t.cakeQuantityHelpText : t.cupcakeQuantityHelpText.replace('{quantity}', String(orderData.quantity))}
                </p>
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>{t.customization}</CardTitle></CardHeader>
            <CardContent>
                <p className='text-sm text-muted-foreground'>{orderData.customization}</p>
            </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>{t.shippingInfo}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <DetailItem label={t.fullName} value={user.nombre} />
            <DetailItem label={t.address} value={`${shippingData.direccion}, ${shippingData.ciudad}, ${shippingData.departamento}`} />
            <DetailItem label={t.phone} value={shippingData.telefono} />
          </CardContent>
        </Card>
        
        {/* Tarjeta de Precios */}
        <Card>
            <CardHeader><CardTitle>{t.priceDetails}</CardTitle></CardHeader>
            <CardContent className="space-y-3">
                <DetailItem label={t.productCost} value={productCost} isCurrency />
                <DetailItem label={t.shippingCost} value={shippingCost} isCurrency />
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                    <p>{t.totalCost}:</p>
                    <p className="font-mono">${totalCost.toLocaleString('es-CO')}</p>
                </div>
            </CardContent>
        </Card>

      </div>
    </div>
  );
}
