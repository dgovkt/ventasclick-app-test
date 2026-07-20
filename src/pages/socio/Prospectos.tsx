import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { UserX, Search, Download, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

interface Prospecto {
  id: string;
  nombre: string | null;
  apellidos: string | null;
  email: string | null;
  telefono: string | null;
  que_vende: string | null;
  diagnostico_opcion: string | null;
  created_at: string;
  plan_recomendado: {
    nombre: string;
  } | null;
}

export default function Prospectos() {
  const { user } = useAuth();
  const [prospectos, setProspectos] = useState<Prospecto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user) {
      loadProspectos();
    }
  }, [user]);

  const loadProspectos = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('wizard_prospectos')
        .select(`
          *,
          plan_recomendado:planes(nombre)
        `)
        .eq('socio_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProspectos(data || []);
    } catch (error) {
      console.error('Error loading prospectos:', error);
    } finally {
      setLoading(false);
    }
  };

  const convertToLead = async (prospecto: Prospecto) => {
    if (!user || !prospecto.nombre || !prospecto.email) {
      alert('Este prospecto no tiene datos suficientes para convertir en lead');
      return;
    }

    if (!confirm('¿Convertir este prospecto en lead activo?')) return;

    try {
      const { data: plan } = await supabase
        .from('planes')
        .select('id')
        .eq('nombre', prospecto.plan_recomendado?.nombre || '')
        .maybeSingle();

      const { error } = await supabase
        .from('leads')
        .insert({
          socio_id: user.id,
          nombre: prospecto.nombre,
          apellidos: prospecto.apellidos || '',
          email: prospecto.email,
          telefono: prospecto.telefono || '',
          que_vende: prospecto.que_vende || '',
          plan_recomendado_id: plan?.id,
          estado: 'nuevo',
          origen: 'prospecto_recuperado'
        });

      if (error) throw error;

      alert('Prospecto convertido a lead exitosamente');
      loadProspectos();
    } catch (error) {
      console.error('Error converting to lead:', error);
      alert('Error al convertir prospecto');
    }
  };

  const exportToCSV = () => {
    const headers = ['Fecha', 'Nombre', 'Email', 'Teléfono', 'Negocio', 'Plan Recomendado', 'Diagnóstico'];
    const rows = prospectos.map(p => [
      new Date(p.created_at).toLocaleDateString('es-MX'),
      `${p.nombre || ''} ${p.apellidos || ''}`.trim() || 'Sin nombre',
      p.email || 'Sin email',
      p.telefono || 'Sin teléfono',
      p.que_vende || 'N/A',
      p.plan_recomendado?.nombre || 'N/A',
      p.diagnostico_opcion || 'N/A'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `prospectos-no-interesados-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const filteredProspectos = prospectos.filter(p => {
    const search = searchTerm.toLowerCase();
    return (
      (p.nombre?.toLowerCase().includes(search) || false) ||
      (p.apellidos?.toLowerCase().includes(search) || false) ||
      (p.email?.toLowerCase().includes(search) || false) ||
      (p.telefono?.includes(search) || false) ||
      (p.que_vende?.toLowerCase().includes(search) || false)
    );
  });

  const getDiagnosticLabel = (option: string | null) => {
    const labels: Record<string, string> = {
      'A': 'Dar a conocer negocio',
      'B': 'Mejorar imagen digital',
      'C': 'Vender en línea',
      'D': 'Crecer ventas digitales'
    };
    return option ? labels[option] || option : 'N/A';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Prospectos No Interesados</h1>
            <p className="text-gray-600 mt-2">
              Personas que dijeron "no gracias" pero dejaron algunos datos
            </p>
          </div>
          <Button
            onClick={exportToCSV}
            variant="secondary"
            disabled={prospectos.length === 0}
          >
            <Download size={20} className="mr-2" />
            Exportar CSV
          </Button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <UserX className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">¿Qué son los prospectos no interesados?</p>
              <p className="text-xs text-blue-700 mt-1">
                Son personas que completaron el wizard pero dijeron "no estoy interesado".
                NO son leads activos, pero puedes intentar recuperarlos más adelante o usarlos para análisis.
              </p>
            </div>
          </div>
        </div>

        <Card>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por nombre, email, teléfono o negocio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Cargando prospectos...</p>
            </div>
          ) : filteredProspectos.length === 0 ? (
            <div className="text-center py-12">
              <UserX className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm ? 'No se encontraron prospectos' : 'No hay prospectos no interesados todavía'}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Cuando alguien diga "no gracias" en el wizard, aparecerá aquí
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prospecto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contacto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Negocio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Diagnóstico
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProspectos.map((prospecto) => (
                    <tr key={prospecto.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(prospecto.created_at).toLocaleDateString('es-MX')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {prospecto.nombre && prospecto.apellidos
                            ? `${prospecto.nombre} ${prospecto.apellidos}`
                            : prospecto.nombre || 'Sin nombre'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{prospecto.email || 'Sin email'}</div>
                        <div className="text-sm text-gray-500">{prospecto.telefono || 'Sin teléfono'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {prospecto.que_vende || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {getDiagnosticLabel(prospecto.diagnostico_opcion)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {prospecto.plan_recomendado?.nombre || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Button
                          onClick={() => convertToLead(prospecto)}
                          size="sm"
                          variant="secondary"
                          disabled={!prospecto.nombre || !prospecto.email}
                        >
                          <ArrowRight size={16} className="mr-1" />
                          Convertir a Lead
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && filteredProspectos.length > 0 && (
            <div className="mt-6 text-sm text-gray-600 text-center">
              Mostrando {filteredProspectos.length} de {prospectos.length} prospectos
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
