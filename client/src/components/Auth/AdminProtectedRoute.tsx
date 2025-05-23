import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const UserRole = {
  USER: 'user',
  ADMIN: 'admin',
} as const;


import { FiLoader, FiSlash } from 'react-icons/fi';

interface AdminProtectedRouteProps {
  // @ts-ignore Error fantasma de JSX en VS Code, la app compila y funciona      
  children: JSX.Element;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)]">
        <FiLoader className="animate-spin h-10 w-10 text-[var(--color-amd-red)]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar si el usuario es admin
  // Ahora user.roles SÍ debería existir si AuthContext está bien.
  if (!user || !user.roles || !user.roles.includes(UserRole.ADMIN)) { 
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg-primary)] text-center p-6">
            <FiSlash className="h-24 w-24 text-[var(--color-amd-red)] mb-6" />
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-3">Acceso Denegado</h1>
            <p className="text-lg text-[var(--color-text-secondary)]">
                No tienes permisos para acceder a esta sección.
            </p>
            <Link to="/" className="mt-8 px-6 py-2 bg-[var(--color-amd-red)] text-white rounded-md hover:bg-[var(--color-amd-red-darker)] transition-colors">
                Volver al Inicio
            </Link>
        </div>
    );
  }

  return children;
};

export default AdminProtectedRoute;