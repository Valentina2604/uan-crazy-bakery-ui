'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getDictionary } from '@/lib/get-dictionary';
import { Order, Estado } from '@/lib/types/order';

const SHIPPING_COST = 10000;

type EditOrderStatusModalProps = {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  onStatusChange: (orderId: number, newStatus: Estado) => void;
};

export function EditOrderStatusModal({ isOpen, onClose, order, dictionary, onStatusChange }: EditOrderStatusModalProps) {
  const [currentStatus, setCurrentStatus] = useState<Estado | undefined>(undefined);

  useEffect(() => {
    if (order) {
      setCurrentStatus(order.estado);
    }
  }, [order]);

  if (!order) return null;

  const { consumerOrders, adminOrderManagementPage, editOrderModal } = dictionary;
  const modalDict = consumerOrders.orderDetailsModal;
  const pageDict = adminOrderManagementPage;
  const editModalDict = editOrderModal;

  const handleSave = () => {
    if (currentStatus && order) {
      onStatusChange(order.id, currentStatus);
      onClose();
    }
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString(dictionary.navigation.home === 'Inicio' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  const formatCurrency = (value: number) => new Intl.NumberFormat(dictionary.navigation.home === 'Inicio' ? 'es-CO' : 'en-US', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

  const orderStatusOptions = Object.keys(pageDict.orderStatus)
    .filter(key => key !== 'all' && key !== 'title')
    .map(key => ({
      value: key as Estado,
      label: pageDict.orderStatus[key as keyof typeof pageDict.orderStatus]
    }));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editModalDict.title} #{order.id}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <Select value={currentStatus} onValueChange={(value) => setCurrentStatus(value as Estado)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                {orderStatusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">
              {modalDict.requestDateLabel}: {formatDate(order.fecha)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle>{modalDict.shippingAddressCard.title}</CardTitle></CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-1">
                <p className="font-semibold text-primary">{order.usuario.nombre} {order.usuario.apellido}</p>
                <p>{order.usuario.direccion}</p>
                <p>Tel: {order.usuario.telefono}</p>
                <p>{order.usuario.ciudad}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>{modalDict.orderCostCard.title}</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>{modalDict.orderCostCard.subtotalLabel}:</span>
                  <span>{formatCurrency(order.valorTotal)}</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>{modalDict.orderCostCard.shippingLabel}:</span>
                  <span>{formatCurrency(SHIPPING_COST)}</span>
                </div>
                <hr className="my-1" />
                <div className="flex justify-between items-center font-semibold text-primary text-base">
                  <span>{modalDict.orderCostCard.totalLabel}:</span>
                  <span>{formatCurrency(order.valorTotal + SHIPPING_COST)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>{editModalDict.cancel}</Button>
          <Button onClick={handleSave} disabled={currentStatus === order.estado}>{editModalDict.save}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
