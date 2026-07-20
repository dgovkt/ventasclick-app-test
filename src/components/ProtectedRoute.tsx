import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../lib/database.types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, profile, loading } = useAuth();
  const [hasTimedOut, setHasTimedOut] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setHasTimedOut(true);
    }, 8000);

    return () => window.clearTimeout(timer);
  }, []);

  if (loading && !hasTimedOut) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!profile && !hasTimedOut) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Configurando tu perfil...</p>
      </div>
    );
  }

  if (!profile && hasTimedOut) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error de Configuración</h2>
          <p className="text-gray-600 mb-4">No se pudo cargar tu perfil. Por favor, intenta cerrar sesión y volver a iniciar.</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Ir a Login
          </button>
        </div>
      </div>
    );
  }

  if (allowedRoles && profile && !allowedRoles.includes(profile.rol)) {
    const defaultRoute = profile.rol === 'admin' || profile.rol === 'super_admin' ? '/admin' : '/dashboard';
    return <Navigate to={defaultRoute} replace />;
  }

  return <>{children}</>;
};
