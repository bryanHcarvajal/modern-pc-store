import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 
import { FiLoader } from 'react-icons/fi';


interface ProtectedRouteProps {
  // @ts-ignore Error fantasma de JSX en VS Code, la app compila y funciona  
  children: JSX.Element; // El componente que se va a renderizar si el usuario está autenticado
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation(); // Para obtener la ruta actual

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)]">
        <FiLoader className="animate-spin h-12 w-12 text-[var(--color-amd-red)]" />
        <p className="ml-4 text-lg text-[var(--color-text-secondary)]">Verificando autenticación...</p>
      </div>
    );
  }

  if (!isAuthenticated) {

    return <Navigate to="/login" state={{ from: location }} replace />;
  }


  return children;
};

export default ProtectedRoute;