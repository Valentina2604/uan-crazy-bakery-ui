'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { createProduct } from '@/lib/api';
import { Dictionary } from '@/lib/get-dictionary';

const formSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  composicion: z.string().min(1, 'La composición es requerida'),
  tipoIngrediente: z.string().min(1, 'El tipo de ingrediente es requerido'),
  costoPorGramo: z.number().min(0, 'El valor debe ser un número positivo'),
});

const productTypes = [
  "BIZCOCHO",
  "RELLENO",
  "COBERTURA"
];

interface AddProductDialogProps {
  dictionary: Dictionary;
  onProductAdded: () => void;
}

export default function AddProductDialog({ dictionary, onProductAdded }: AddProductDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: '',
      composicion: '',
      tipoIngrediente: '',
      costoPorGramo: 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createProduct(values);
      toast({ description: dictionary.adminProductsPage.addProductModal.notifications.success });
      setOpen(false);
      form.reset();
      onProductAdded();
    } catch (error) {
      toast({ description: dictionary.adminProductsPage.addProductModal.notifications.error, variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{dictionary.adminProductsPage.productsTable.addNewProduct}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dictionary.adminProductsPage.addProductModal.title}</DialogTitle>
          <DialogDescription>{dictionary.adminProductsPage.addProductModal.description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="nombre"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{dictionary.adminProductsPage.addProductModal.fields.name}</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="composicion"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{dictionary.adminProductsPage.addProductModal.fields.composition}</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="tipoIngrediente"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{dictionary.adminProductsPage.addProductModal.fields.type}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={dictionary.adminProductsPage.addProductModal.fields.typePlaceholder} />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {productTypes.map(type => (
                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="costoPorGramo"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{dictionary.adminProductsPage.addProductModal.fields.value}</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} onChange={event => field.onChange(+event.target.value)} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <DialogFooter>
                    <Button type="button" variant="secondary" onClick={() => setOpen(false)}>{dictionary.adminProductsPage.addProductModal.buttons.cancel}</Button>
                    <Button type="submit">{dictionary.adminProductsPage.addProductModal.buttons.save}</Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}