import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Card } from '../../components/Card';
import { supabase } from '../../lib/supabase';
import { Users, Search, Filter, TrendingUp, UserCheck, UserX, Clock, Download } from 'lucide-react';
import { exportToExcel, formatDate } from '../../lib/excelExport';

interface Lead {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  que_vende: string;
  estado: 'nuevo' | 'en_seguimiento' | 'cerrado_ganado' | 'cerrado_perdido';
  origen: 'wizard' | 'manual' | 'otro';
  fecha_creacion: string;
  socio_id: string;
  socio?: {
    nombre: string;
    apellido: string;
  };
  plan_recomendado?: {
    nombre: string;
  };
}

type FilterEstado = 'todos' | 'nuevo' | 'en_seguimiento' | 'cerrado_ganado' | 'cerrado_perdido';

export default function SuperAdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<FilterEstado>('todos');

  useEffect(() => {
    loadLeads();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filterEstado, leads]);

  async function loadLeads() {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select(`
          *,
          socio:profiles!socio_id(nombre, apellido),
          plan_recomendado:planes!plan_recomendado_id(nombre)
        `)
        .order('fecha_creacion', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error loading leads:', error);
    } finally {
      setLoading(false);
    }
  }

  function applyFilters() {
    let filtered = [...leads];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        lead =>
          lead.nombre.toLowerCase().includes(term) ||
          lead.apellidos.toLowerCase().includes(term) ||
          lead.email.toLowerCase().includes(term) ||
          lead.telefono.includes(term) ||
          lead.que_vende.toLowerCase().includes(term) ||
          (lead.socio && `${lead.socio.nombre} ${lead.socio.apellido}`.toLowerCase().includes(term))
      );
    }

    if (filterEstado !== 'todos') {
      filtered = filtered.filter(lead => lead.estado === filterEstado);
    }

    setFilteredLeads(filtered);
  }

  const getEstadoBadge = (estado: string) => {
    const styles = {
      nuevo: 'bg-blue-100 text-blue-800',
      en_seguimiento: 'bg-yellow-100 text-yellow-800',
      cerrado_ganado: 'bg-primary-light text-primary-dark',
      cerrado_perdido: 'bg-red-100 text-red-800',
    };
    const labels = {
      nuevo: 'Nuevo',
      en_seguimiento: 'En Seguimiento',
      cerrado_ganado: 'Ganado',
      cerrado_perdido: 'Perdido',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[estado as keyof typeof styles]}`}>
        {labels[estado as keyof typeof labels]}
      </span>
    );
  };

  const getOrigenBadge = (origen: string) => {
    const styles = {
      wizard: 'bg-purple-100 text-purple-800',
      manual: 'bg-gray-100 text-gray-800',
      otro: 'bg-orange-100 text-orange-800',
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[origen as keyof typeof styles]}`}>
        {origen.charAt(0).toUpperCase() + origen.slice(1)}
      </span>
    );
  };

  const stats = {
    total: leads.length,
    nuevos: leads.filter(l => l.estado === 'nuevo').length,
    enSeguimiento: leads.filter(l => l.estado === 'en_seguimiento').length,
    ganados: leads.filter(l => l.estado === 'cerrado_ganado').length,
    perdidos: leads.filter(l => l.estado === 'cerrado_perdido').length,
  };

  const handleExportToExcel = () => {
    const dataToExport = filteredLeads.map(lead => ({
      'Nombre': lead.nombre,
      'Apellidos': lead.apellidos,
      'Email': lead.email,
      'Teléfono': lead.telefono,
      'Qué Vende': lead.que_vende,
      'Socio Asignado': lead.socio ? `${lead.socio.nombre} ${lead.socio.apellido}` : '-',
      'Plan Recomendado': lead.plan_recomendado?.nombre || '-',
      'Estado': lead.estado,
      'Origen': lead.origen,
      'Fecha Creación': formatDate(lead.fecha_creacion),
    }));

    exportToExcel(dataToExport, 'bills_leads', 'Leads');
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Cargando leads...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bills</h1>
          <p className="text-gray-600 mt-2">Vista global de todos los leads del sistema</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 font-medium">Total</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-cyan-700 font-medium">Nuevos</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.nuevos}</p>
                </div>
                <Clock className="w-8 h-8 text-cyan-600" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-700 font-medium">Seguimiento</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.enSeguimiento}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-primary-light to-primary-light border-primary-light">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-primary-dark font-medium">Ganados</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.ganados}</p>
                </div>
                <UserCheck className="w-8 h-8 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-700 font-medium">Perdidos</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.perdidos}</p>
                </div>
                <UserX className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar por nombre, email, teléfono, socio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="text-gray-400" size={20} />
                <select
                  value={filterEstado}
                  onChange={(e) => setFilterEstado(e.target.value as FilterEstado)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="todos">Todos los estados</option>
                  <option value="nuevo">Nuevos</option>
                  <option value="en_seguimiento">En Seguimiento</option>
                  <option value="cerrado_ganado">Ganados</option>
                  <option value="cerrado_perdido">Perdidos</option>
                </select>
              </div>
              <button
                onClick={handleExportToExcel}
                className="flex items-center gap-2 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                <Download size={20} />
                Descargar Excel
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lead
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Socio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Qué Vende
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Origen
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                        {searchTerm || filterEstado !== 'todos'
                          ? 'No se encontraron leads con los filtros aplicados'
                          : 'No hay leads registrados'}
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {lead.nombre} {lead.apellidos}
                            </div>
                            <div className="text-sm text-gray-500">{lead.email}</div>
                            <div className="text-sm text-gray-500">{lead.telefono}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {lead.socio ? `${lead.socio.nombre} ${lead.socio.apellido}` : '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">{lead.que_vende}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {lead.plan_recomendado?.nombre || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{getEstadoBadge(lead.estado)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{getOrigenBadge(lead.origen)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(lead.fecha_creacion).toLocaleDateString('es-MX')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="text-sm text-gray-600">
              Mostrando {filteredLeads.length} de {leads.length} leads
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
