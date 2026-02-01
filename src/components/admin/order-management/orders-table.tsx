'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Order, Estado } from '@/lib/types/order';
import { getDictionary } from '@/lib/get-dictionary';
import { Eye, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OrderDetailsModal } from './order-details-modal';

interface OrdersTableProps {
  orders: Order[];
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  onStatusChange: (orderId: number, newStatus: Estado) => void;
}

const estadoColors: Record<Estado, string> = {
  CREADO: 'bg-blue-500',
  CONFIRMADO: 'bg-yellow-500',
  EN_PREPARACION: 'bg-orange-500',
  LISTO: 'bg-green-500',
  ENTREGADO: 'bg-gray-500',
  CANCELADO: 'bg-red-500',
};

export function OrdersTable({ orders, dictionary, onStatusChange }: OrdersTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const pageDict = dictionary.adminOrderManagementPage || {};
  const tableDict = pageDict.ordersTable || {};
  const statusDict = pageDict.orderStatus || {};
  const actionsDict = pageDict.actions || {};

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <>
      <Table className="font-sans text-sm">
        <TableHeader>
          <TableRow>
            <TableHead>{tableDict.orderId || 'Order ID'}</TableHead>
            <TableHead>{tableDict.client || 'Client'}</TableHead>
            <TableHead>{tableDict.date || 'Date'}</TableHead>
            <TableHead>{tableDict.totalValue || 'Total'}</TableHead>
            <TableHead>{tableDict.status || 'Status'}</TableHead>
            <TableHead className="text-right">{tableDict.actions || 'Actions'}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.usuario ? `${order.usuario.nombre} ${order.usuario.apellido}` : (tableDict.noClient || 'No Client')}</TableCell>
              <TableCell>{new Date(order.fecha).toLocaleDateString()}</TableCell>
              <TableCell>${order.valorTotal}</TableCell>
              <TableCell>
                <Badge className={cn(estadoColors[order.estado], 'text-white')}>
                  {statusDict[order.estado] || order.estado}
                </Badge>
              </TableCell>
              <TableCell className="flex items-center justify-end space-x-2">
                  <Button variant="outline" size="icon" className="h-9 w-9 border-gray-300 rounded-md" onClick={() => handleViewDetails(order)}>
                      <Eye className="h-4 w-4 text-gray-600" />
                      <span className="sr-only">{actionsDict.view || 'View Details'}</span>
                  </Button>
                  <Button variant="destructive" size="icon" className="h-9 w-9 bg-red-500 hover:bg-red-600 rounded-md">
                      <Trash2 className="h-4 w-4 text-white" />
                      <span className="sr-only">{actionsDict.delete || 'Delete'}</span>
                  </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <OrderDetailsModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        order={selectedOrder}
        dictionary={dictionary}
      />
    </>
  );
}
