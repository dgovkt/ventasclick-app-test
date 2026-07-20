import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  DollarSign,
  Calculator,
  Award,
  Star,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X,
  FileText,
  UserX,
  BookUser,
  UserCheck
} from 'lucide-react';

const VCLogo = () => (
  <img src="/VC-LOGOTIPO-H.png" alt="Ventas Click" className="h-10 w-auto" />
);

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const socioLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/dashboard/leads', icon: Users, label: 'Bills' },
    { to: '/dashboard/prospectos', icon: UserX, label: 'Prospectos' },
    { to: '/dashboard/cierres', icon: TrendingUp, label: 'Cierres' },
    { to: '/dashboard/comisiones', icon: DollarSign, label: 'Comisiones' },
    { to: '/dashboard/simulador', icon: Calculator, label: 'Simulador' },
    { to: '/dashboard/casos-exito', icon: Award, label: 'Casos de Éxito' },
    { to: '/dashboard/reviews', icon: Star, label: 'Reviews' },
    { to: '/dashboard/kb', icon: BookOpen, label: 'Base de Conocimientos' },
    { to: '/dashboard/manual', icon: BookUser, label: 'Manual del Socio' }
  ];

  const adminLinks = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/leads', icon: Users, label: 'Bills' },
    { to: '/admin/cierres', icon: TrendingUp, label: 'Cierres' },
    { to: '/admin/comisiones', icon: DollarSign, label: 'Comisiones' },
    { to: '/admin/casos-exito', icon: Award, label: 'Casos de Éxito' },
    { to: '/admin/reviews', icon: Star, label: 'Reviews' },
    { to: '/admin/usuarios', icon: Users, label: 'Usuarios' },
    { to: '/admin/content', icon: FileText, label: 'Contenido' },
    { to: '/admin/kb', icon: BookOpen, label: 'Knowledge Base' }
  ];

  const superAdminLinks = [
    { to: '/super-admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/super-admin/leads', icon: Users, label: 'Bills' },
    { to: '/super-admin/cierres', icon: TrendingUp, label: 'Cierres' },
    { to: '/super-admin/comisiones', icon: DollarSign, label: 'Comisiones' },
    { to: '/super-admin/casos-exito', icon: Award, label: 'Casos de Éxito' },
    { to: '/super-admin/reviews', icon: Star, label: 'Reviews' },
    { to: '/super-admin/usuarios', icon: Users, label: 'Usuarios' },
    { to: '/super-admin/agentes', icon: UserCheck, label: 'Agentes' },
    { to: '/super-admin/contenido', icon: FileText, label: 'Contenido' },
    { to: '/super-admin/kb', icon: BookOpen, label: 'Base de Conocimientos' },
    { to: '/super-admin/manuales', icon: BookUser, label: 'Manuales' },
    { to: '/super-admin/configuracion', icon: Settings, label: 'Configuración' }
  ];

  const getLinks = () => {
    if (profile?.rol === 'super_admin') {
      return superAdminLinks;
    }
    if (profile?.rol === 'admin') {
      return adminLinks;
    }
    return socioLinks;
  };

  const links = getLinks();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="flex items-center justify-between px-4 h-16">
          <VCLogo />
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-200 transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200">
            <VCLogo />
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900">
                {profile?.nombre} {profile?.apellido}
              </p>
              <p className="text-xs text-gray-500 mt-1 capitalize">{profile?.rol?.replace('_', ' ')}</p>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-lg transition ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
};
