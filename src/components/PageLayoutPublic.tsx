import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { Menu, X } from 'lucide-react';

const VCLogo = () => (
  <img src="/VC-LOGOTIPO-H.png" alt="Ventas Click" className="h-10 w-auto" />
);

interface PageLayoutPublicProps {
  children: React.ReactNode;
}

export const PageLayoutPublic: React.FC<PageLayoutPublicProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/">
              <VCLogo />
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-gray-600 hover:text-gray-900 transition">
                Inicio
              </Link>
              <Link to="/info" className="text-gray-600 hover:text-gray-900 transition">
                Información
              </Link>
              <Button to="/login" variant="outline" size="sm">
                Iniciar Sesión
              </Button>
              <Button to="/signup" variant="primary" size="sm">
                Registrarse
              </Button>
            </div>

            <button
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-3">
                <Link
                  to="/"
                  className="text-gray-600 hover:text-gray-900 transition px-2 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Inicio
                </Link>
                <Link
                  to="/info"
                  className="text-gray-600 hover:text-gray-900 transition px-2 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Información
                </Link>
                <Button
                  to="/login"
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Iniciar Sesión
                </Button>
                <Button
                  to="/signup"
                  variant="primary"
                  size="sm"
                  fullWidth
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Registrarse
                </Button>
              </div>
            </div>
          )}
        </nav>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="mb-4">
                <VCLogo />
              </div>
              <p className="text-gray-600 text-sm">
                Construye tu negocio digital con nosotros
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Enlaces</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-600 hover:text-gray-900 text-sm transition">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link to="/info" className="text-gray-600 hover:text-gray-900 text-sm transition">
                    Información
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="text-gray-600 hover:text-gray-900 text-sm transition">
                    Registrarse
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Contacto</h3>
              <p className="text-gray-600 text-sm">
                Email: contacto@sociosventasclick.com
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-gray-600 text-sm">
              © 2026 Socios Ventas Click. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
