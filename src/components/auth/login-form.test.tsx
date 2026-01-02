import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from './login-form';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getUserById } from '@/lib/api';

// Mocks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  getAuth: jest.fn(),
}));
jest.mock('@/lib/api', () => ({
  getUserById: jest.fn(),
}));
jest.mock('@/lib/firebase', () => ({
  auth: {},
}));

const mockUseRouter = useRouter as jest.Mock;
const mockUseToast = useToast as jest.Mock;
const mockSignInWithEmailAndPassword = signInWithEmailAndPassword as jest.Mock;
const mockSignOut = signOut as jest.Mock;
const mockGetUserById = getUserById as jest.Mock;

const mockDictionary = {
  title: 'Iniciar Sesión',
  description: 'Accede a tu cuenta de Crazy Bakery',
  email: {
    label: 'Correo Electrónico',
    placeholder: 'tu@ejemplo.com',
  },
  password: {
    label: 'Contraseña',
  },
  submit: 'Iniciar Sesión',
  noAccount: '¿No tienes una cuenta?',
  signUp: 'Regístrate',
  validation: {
    email: 'Por favor, introduce un correo electrónico válido.',
    password: 'La contraseña debe tener al menos 8 caracteres.',
  },
  toast: {
    error: {
      title: 'Error de Autenticación',
      description: 'Las credenciales son incorrectas o el usuario no existe en nuestra base de datos. Por favor, verifica e intenta de nuevo.',
    },
  },
};

describe('LoginForm', () => {
  const mockPush = jest.fn();
  const mockToast = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({ push: mockPush });
    mockUseToast.mockReturnValue({ toast: mockToast });
  });

  it('should render the form correctly', () => {
    render(<LoginForm dictionary={mockDictionary} lang="es" />);
    expect(screen.getByRole('heading', { name: mockDictionary.title })).toBeInTheDocument();
    expect(screen.getByText(mockDictionary.description)).toBeInTheDocument();
    expect(screen.getByLabelText(mockDictionary.email.label)).toBeInTheDocument();
    expect(screen.getByLabelText(mockDictionary.password.label)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: mockDictionary.submit })).toBeInTheDocument();
  });

  it('should successfully sign in, verify user, and redirect', async () => {
    const lang = 'es';
    render(<LoginForm dictionary={mockDictionary} lang={lang} />);

    const mockUser = { uid: '12345' };
    mockSignInWithEmailAndPassword.mockResolvedValueOnce({ user: mockUser });
    mockGetUserById.mockResolvedValueOnce({ id: '12345', name: 'Test User' });

    fireEvent.change(screen.getByLabelText(mockDictionary.email.label), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(mockDictionary.password.label), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: mockDictionary.submit }));

    await waitFor(() => {
      expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(expect.any(Object), 'test@example.com', 'password123');
      expect(mockGetUserById).toHaveBeenCalledWith(mockUser.uid);
      expect(mockPush).toHaveBeenCalledWith(`/${lang}/account`);
      expect(mockToast).not.toHaveBeenCalled();
    });
  });

  it('should show toast on Firebase authentication error', async () => {
    render(<LoginForm dictionary={mockDictionary} lang="es" />);

    mockSignInWithEmailAndPassword.mockRejectedValueOnce(new Error('Firebase auth error'));

    fireEvent.change(screen.getByLabelText(mockDictionary.email.label), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(mockDictionary.password.label), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: mockDictionary.submit }));

    await waitFor(() => {
      expect(mockGetUserById).not.toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
      expect(mockToast).toHaveBeenCalledWith({
        title: mockDictionary.toast.error.title,
        description: mockDictionary.toast.error.description,
        variant: "destructive",
      });
    });
  });

  it('should sign out and show toast if backend user check fails', async () => {
    render(<LoginForm dictionary={mockDictionary} lang="es" />);

    const mockUser = { uid: '12345' };
    mockSignInWithEmailAndPassword.mockResolvedValueOnce({ user: mockUser });
    mockGetUserById.mockRejectedValueOnce(new Error('User not in DB'));
    mockSignOut.mockResolvedValueOnce({});

    fireEvent.change(screen.getByLabelText(mockDictionary.email.label), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(mockDictionary.password.label), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: mockDictionary.submit }));

    await waitFor(() => {
      expect(mockSignInWithEmailAndPassword).toHaveBeenCalled();
      expect(mockGetUserById).toHaveBeenCalledWith(mockUser.uid);
      expect(mockSignOut).toHaveBeenCalledWith(expect.any(Object));
      expect(mockPush).not.toHaveBeenCalled();
      expect(mockToast).toHaveBeenCalledWith({
        title: mockDictionary.toast.error.title,
        description: mockDictionary.toast.error.description,
        variant: "destructive",
      });
    });
  });
});
