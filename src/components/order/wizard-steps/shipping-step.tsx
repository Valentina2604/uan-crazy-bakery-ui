'use client';

import { useMemo } from 'react';
import { useSession } from '@/context/session-provider';
import { useLocation } from '@/context/location-provider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { getDictionary } from '@/lib/get-dictionary';

// 1. Tipos de datos
export interface ShippingData {
  telefono: string;
  direccion: string;
  departamento: string;
  ciudad: string;
}

type FullDictionary = Awaited<ReturnType<typeof getDictionary>>;

interface ShippingStepProps {
  data: ShippingData;
  onDataChange: (data: ShippingData) => void;
  dictionary: FullDictionary; // 2. Recibir el diccionario como prop
}

export default function ShippingStep({ data, onDataChange, dictionary }: ShippingStepProps) {
  const { user, loading: sessionLoading } = useSession();
  const { departments, cities, loading: locationLoading } = useLocation();
  
  // Acceso a las traducciones específicas de este componente
  const { shippingStep } = dictionary.orderWizard;

  const filteredCities = useMemo(() => {
    if (!data.departamento) return [];
    const selectedDept = departments.find(d => d.name === data.departamento);
    if (!selectedDept) return [];
    return cities.filter(c => c.departmentId === selectedDept.id);
  }, [data.departamento, departments, cities]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    onDataChange({ ...data, [id]: value });
  };

  const handleSelectChange = (name: 'departamento' | 'ciudad', value: string) => {
    onDataChange({
      ...data,
      [name]: value,
      ...(name === 'departamento' && { ciudad: '' }),
    });
  };

  if (sessionLoading || locationLoading) {
    return <div className="flex justify-center items-center h-full min-h-[300px]"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
  }
  
  if (!user) {
    return <p className="text-red-500 text-center">No existe sesión.</p>;
  }

  // 3. Usar el diccionario para los textos de la UI
  return (
    <div className="flex flex-col gap-4 max-w-lg mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4 text-center">{dictionary.orderWizard.steps.shipping}</h2>
      
      <div className="grid w-full items-center gap-1.5">
        <Label>{shippingStep.fullName}</Label>
        <Input type="text" value={`${user.nombre || ''} ${user.apellido || ''}`} disabled className="bg-gray-100" />
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label>{shippingStep.email}</Label>
        <Input type="email" value={user.email || ''} disabled className="bg-gray-100" />
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="telefono">{shippingStep.phone}</Label>
        <Input type="tel" id="telefono" value={data.telefono} onChange={handleInputChange} placeholder={shippingStep.phonePlaceholder} />
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="direccion">{shippingStep.address}</Label>
        <Input type="text" id="direccion" value={data.direccion} onChange={handleInputChange} placeholder={shippingStep.addressPlaceholder} />
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="departamento">{shippingStep.department}</Label>
        <Select name="departamento" value={data.departamento} onValueChange={(value) => handleSelectChange('departamento', value)}>
          <SelectTrigger id="departamento"><SelectValue placeholder={shippingStep.departmentPlaceholder} /></SelectTrigger>
          <SelectContent>
            {departments.map(dept => <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="ciudad">{shippingStep.city}</Label>
        <Select name="ciudad" value={data.ciudad} onValueChange={(value) => handleSelectChange('ciudad', value)} disabled={!data.departamento || filteredCities.length === 0}>
          <SelectTrigger id="ciudad"><SelectValue placeholder={shippingStep.cityPlaceholder} /></SelectTrigger>
          <SelectContent>
            {filteredCities.map(city => <SelectItem key={city.id} value={city.name}>{city.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
