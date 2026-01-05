'use client';

import { useEffect, useState } from 'react';
import { User } from '@/lib/types/user';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { updateUser } from '@/lib/api';
import { Pencil } from 'lucide-react';

interface EditUserDialogProps {
  user: User;
  dictionary: any;
  onUserUpdated: (updatedUser: User) => void;
}

export function EditUserDialog({ user, dictionary, onUserUpdated }: EditUserDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(user);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setFormData(user);
    }
  }, [isOpen, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === 'telefono') {
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData((prev) => ({ ...prev, [id]: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await updateUser(user.id, formData);
      // The API returns the updated user with Spanish keys, so we use it directly.
      onUserUpdated(response);
      toast({
        title: dictionary.toast.success.title,
        description: dictionary.toast.success.description,
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        variant: 'destructive',
        title: dictionary.toast.error.title,
        description: dictionary.toast.error.description,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dictionary.title.replace('{userName}', `${user.nombre} ${user.apellido}`)}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="telefono">{dictionary.form.phone}</Label>
            <Input id="telefono" value={formData.telefono || ''} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="direccion">{dictionary.form.address}</Label>
            <Input id="direccion" value={formData.direccion || ''} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="departamento">{dictionary.form.department}</Label>
            <Input id="departamento" value={formData.departamento || ''} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="ciudad">{dictionary.form.city}</Label>
            <Input id="ciudad" value={formData.ciudad || ''} onChange={handleChange} />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>{dictionary.buttons.cancel}</Button>
            <Button type="submit">{dictionary.buttons.save}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
