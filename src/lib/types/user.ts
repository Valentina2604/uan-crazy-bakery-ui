export interface User {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  tipo: string;
  telefono?: string;
  direccion?: string;
  departamento?: string;
  ciudad?: string;
  estado?: boolean;
}
