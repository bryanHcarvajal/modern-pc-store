import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StyledInput from '../components/Forms/StyledInput';
import { FiMail, FiLock, FiLogIn, FiLoader  } from 'react-icons/fi'; 
import { useLocation } from 'react-router-dom'; 

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión.');
      }

    if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión.');
      }
    await login(data.user, data.accessToken);
    navigate(from, { replace: true }); 
    } catch (err: any) {
        setError(err.message || 'Ocurrió un error inesperado.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 sm:p-10 bg-[var(--color-bg-secondary)] shadow-2xl rounded-[var(--border-radius-large)]">
        <div>
          <FiLogIn className="mx-auto h-12 w-auto text-[var(--color-amd-red)]" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[var(--color-text-primary)]">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-center text-sm text-[var(--color-text-secondary)]">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="font-medium text-[var(--color-amd-red)] hover:text-[var(--color-amd-red-darker)]">
              Regístrate aquí
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-md">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
          <StyledInput
            id="email"
            label="Correo Electrónico"
            type="email"
            autoComplete="email"
            required
            placeholder="tu@email.com"
            Icon={FiMail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <StyledInput
            id="password"
            label="Contraseña"
            type="password"
            autoComplete="current-password"
            required
            placeholder="Tu contraseña"
            Icon={FiLock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-[var(--border-radius-default)] text-white bg-[var(--color-amd-red)] hover:bg-[var(--color-amd-red-darker)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-bg-secondary)] focus:ring-[var(--color-amd-red)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <FiLoader className="animate-spin h-5 w-5 mr-2" />
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;