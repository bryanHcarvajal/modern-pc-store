import React, { createContext, useState, useContext, useEffect } from 'react';
import type {ReactNode} from 'react';

export const UserRole = { 
  USER: 'user',
  ADMIN: 'admin',
} as const;

export type UserRoleValue = typeof UserRole[keyof typeof UserRole];

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: UserRoleValue[]; 
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null; 
  token: string | null;
  isLoading: boolean;
  login: (userData: User, authToken: string) => Promise<void>; 
  register: (userData: User, authToken: string) => Promise<void>; 
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null); 
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    try {
      const storedToken = localStorage.getItem('authToken');
      const storedUserJSON = localStorage.getItem('authUser'); 

      if (storedToken && storedUserJSON) {
        const storedUser: User = JSON.parse(storedUserJSON);
        if (storedUser && storedUser.roles) {
            setToken(storedToken);
            setUser(storedUser);
            setIsAuthenticated(true);
        } else {
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
        }
      }
    } catch (error) {
      console.error("Error al cargar datos de auth desde localStorage:", error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAuthSuccess = async (userData: User, authToken: string) => { 
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('authUser', JSON.stringify(userData)); 
    setToken(authToken);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const login = async (userData: User, authToken: string) => {
    await handleAuthSuccess(userData, authToken);
  };

  const register = async (userData: User, authToken: string) => {
    await handleAuthSuccess(userData, authToken);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const contextValue = {
    isAuthenticated,
    user,
    token,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};