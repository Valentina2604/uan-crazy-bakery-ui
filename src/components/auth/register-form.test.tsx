import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RegisterForm } from './register-form';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { createUser } from '@/lib/api';

// Mocks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));
jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  deleteUser: jest.fn(),
  getAuth: jest.fn(),
}));
jest.mock('@/lib/api', () => ({
  createUser: jest.fn(),
}));
jest.mock('@/lib/firebase', () => ({
  auth: {},
}));

const mockUseRouter = useRouter as jest.Mock;
const mockUseToast = useToast as jest.Mock;
const mockCreateUserWithEmailAndPassword = createUserWithEmailAndPassword as jest.Mock;
const mockDeleteUser = deleteUser as jest.Mock;
const mockCreateUserApi = createUser as jest.Mock;

const mockDictionary = {
  title: 'Crear una Cuenta',
  description: 'Únete a Crazy Bakery para empezar a ordenar',
  name: {
    label: 'Nombre',
    placeholder: 'Tu Nombre',
  },
  email: {
    label: 'Correo Electrónico',
    placeholder: 'tu@ejemplo.com',
  },
  password: {
    label: 'Contraseña',
  },
  confirmPassword: {
    label: 'Confirmar Contraseña',
  },
  submit: 'Crear Cuenta',
  hasAccount: '¿Ya tienes una cuenta?',
  login: 'Iniciar Sesión',
  toast: {
    title: '¡Cuenta Creada!',
    description: '¡Bienvenido a Crazy Bakery! Por favor, inicia sesión para continuar.',
    error: {
      title: 'Error de Registro',
      emailInUse: 'Este correo electrónico ya está registrado. Por favor, intenta con otro.',
      generic: 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo.',
    },
  },
  validation: {
    name: 'El nombre debe tener al menos 2 caracteres.',
    email: 'Por favor, introduce una dirección de correo electrónico válida.',
    password: 'La contraseña debe tener al menos 8 caracteres.',
    passwordMatch: 'Las contraseñas no coinciden.',
  },
};

describe('RegisterForm', () => {
  const mockPush = jest.fn();
  const mockToast = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({ push: mockPush });
    mockUseToast.mockReturnValue({ toast: mockToast });
  });

  it('should render the form correctly', () => {
    render(<RegisterForm dictionary={mockDictionary} lang="es" />);
    expect(screen.getByRole('heading', { name: mockDictionary.title })).toBeInTheDocument();
    expect(screen.getByText(mockDictionary.description)).toBeInTheDocument();
    expect(screen.getByLabelText(mockDictionary.name.label)).toBeInTheDocument();
    expect(screen.getByLabelText(mockDictionary.email.label)).toBeInTheDocument();
    expect(screen.getByLabelText(mockDictionary.password.label)).toBeInTheDocument();
    expect(screen.getByLabelText(mockDictionary.confirmPassword.label)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: mockDictionary.submit })).toBeInTheDocument();
    expect(screen.getByText(mockDictionary.hasAccount)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: mockDictionary.login })).toBeInTheDocument();
  });

  it('should show validation errors for invalid input', async () => {
    render(<RegisterForm dictionary={mockDictionary} lang="es" />);
    fireEvent.click(screen.getByRole('button', { name: mockDictionary.submit }));

    await waitFor(() => {
      expect(screen.getByText(mockDictionary.validation.name)).toBeInTheDocument();
      expect(screen.getByText(mockDictionary.validation.email)).toBeInTheDocument();
      expect(screen.getByText(mockDictionary.validation.password)).toBeInTheDocument();
    });
  });

  it('should successfully create a user and redirect', async () => {
    const lang = 'es';
    render(<RegisterForm dictionary={mockDictionary} lang={lang} />);

    const mockUser = { uid: '12345' };
    mockCreateUserWithEmailAndPassword.mockResolvedValueOnce({ user: mockUser });
    mockCreateUserApi.mockResolvedValueOnce({});

    fireEvent.change(screen.getByLabelText(mockDictionary.name.label), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(mockDictionary.email.label), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(mockDictionary.password.label), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(mockDictionary.confirmPassword.label), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: mockDictionary.submit }));

    await waitFor(() => {
      expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalledWith(expect.any(Object), 'test@example.com', 'password123');
      expect(mockCreateUserApi).toHaveBeenCalledWith({
        id: mockUser.uid,
        email: 'test@example.com',
        nombre: 'Test',
        apellido: 'User',
        tipo: "consumidor",
        telefono: "",
        direccion: "",
        departamento: "",
        ciudad: "",
      });
      expect(mockToast).toHaveBeenCalledWith({
        title: mockDictionary.toast.title,
        description: mockDictionary.toast.description,
      });
      expect(mockPush).toHaveBeenCalledWith(`/${lang}/account`);
    });
  });

  it('should show toast on firebase registration error (email in use)', async () => {
    render(<RegisterForm dictionary={mockDictionary} lang="es" />);

    const error = { code: 'auth/email-already-in-use' };
    mockCreateUserWithEmailAndPassword.mockRejectedValueOnce(error);

    fireEvent.change(screen.getByLabelText(mockDictionary.name.label), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(mockDictionary.email.label), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(mockDictionary.password.label), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(mockDictionary.confirmPassword.label), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: mockDictionary.submit }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: mockDictionary.toast.error.title,
        description: mockDictionary.toast.error.emailInUse,
        variant: 'destructive',
      });
      expect(mockCreateUserApi).not.toHaveBeenCalled();
    });
  });

  it('should delete firebase user and show toast if backend api call fails', async () => {
    render(<RegisterForm dictionary={mockDictionary} lang="es" />);

    const mockUser = { uid: '12345' };
    mockCreateUserWithEmailAndPassword.mockResolvedValueOnce({ user: mockUser });
    mockCreateUserApi.mockRejectedValueOnce(new Error('Backend failed'));
    mockDeleteUser.mockResolvedValueOnce({});

    fireEvent.change(screen.getByLabelText(mockDictionary.name.label), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(mockDictionary.email.label), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(mockDictionary.password.label), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(mockDictionary.confirmPassword.label), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: mockDictionary.submit }));

    await waitFor(() => {
      expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalled();
      expect(mockCreateUserApi).toHaveBeenCalled();
      expect(mockDeleteUser).toHaveBeenCalledWith(mockUser);
      expect(mockToast).toHaveBeenCalledWith({
        title: mockDictionary.toast.error.title,
        description: mockDictionary.toast.error.generic,
        variant: 'destructive',
      });
    });
  });
});
