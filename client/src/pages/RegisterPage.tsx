import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StyledInput from '../components/Forms/StyledInput';
import { FiUser, FiMail, FiLock, FiUserPlus, FiLoader  } from 'react-icons/fi';


const RegisterPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth(); 
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (password.length < 8) {
        setError('La contraseña debe tener al menos 8 caracteres.');
        return;
    }

    setIsLoading(true);

    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const registrationUrl = `${apiUrl}/auth/register`; 

    const DEBUG_VERSION = "REGISTER_PAGE_TEST_003"; 
    console.log(DEBUG_VERSION, "URL de Registro Usada en handleSubmit:", registrationUrl);
    console.log(DEBUG_VERSION, "Valor de VITE_API_BASE_URL en handleSubmit:", import.meta.env.VITE_API_BASE_URL);
    console.log(DEBUG_VERSION, "Todas las env de Vite en handleSubmit:", JSON.stringify(import.meta.env));

    try {
      const response = await fetch(registrationUrl, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = Array.isArray(data.message) ? data.message.join(', ') : data.message;
        throw new Error(errorMessage || 'Error al registrar la cuenta.');
      }
      
      await register(data.user, data.accessToken);
      navigate('/'); 
      
    } catch (err: any) {
      if (err instanceof TypeError && err.message === "Failed to fetch") { 
          console.error(DEBUG_VERSION, "FALLO DE RED al intentar fetch a:", registrationUrl, "Error original:", err);
          setError(`Error de red al conectar con el servidor. Verifica que la URL (${registrationUrl}) sea correcta y el servidor esté accesible.`);
      } else {
          setError(err.message || 'Ocurrió un error inesperado.');
      }
      console.error(DEBUG_VERSION, "Error en handleSubmit:", err); 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 sm:p-10 bg-[var(--color-bg-secondary)] shadow-2xl rounded-[var(--border-radius-large)]">
        <div>
          <FiUserPlus className="mx-auto h-12 w-auto text-[var(--color-amd-red)]" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[var(--color-text-primary)]">
            Crear Nueva Cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-[var(--color-text-secondary)]">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="font-medium text-[var(--color-amd-red)] hover:text-[var(--color-amd-red-darker)]">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-md">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StyledInput
              id="firstName"
              label="Nombre"
              type="text"
              autoComplete="given-name"
              placeholder="Tu nombre"
              Icon={FiUser}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <StyledInput
              id="lastName"
              label="Apellido"
              type="text"
              autoComplete="family-name"
              placeholder="Tu apellido"
              Icon={FiUser}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <StyledInput
            id="email-register"
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
            id="password-register"
            label="Contraseña"
            type="password"
            autoComplete="new-password"
            required
            placeholder="Mínimo 8 caracteres"
            Icon={FiLock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <StyledInput
            id="confirmPassword"
            label="Confirmar Contraseña"
            type="password"
            autoComplete="new-password"
            required
            placeholder="Repite tu contraseña"
            Icon={FiLock}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={password !== confirmPassword && confirmPassword ? 'Las contraseñas no coinciden' : undefined}
          />
          <div>
            <button
              type="submit"
              disabled={isLoading || (password !== confirmPassword && confirmPassword.length > 0)}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-[var(--border-radius-default)] text-white bg-[var(--color-amd-red)] hover:bg-[var(--color-amd-red-darker)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-bg-secondary)] focus:ring-[var(--color-amd-red)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <FiLoader className="animate-spin h-5 w-5 mr-2" />
              ) : (
                'Crear Cuenta'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;