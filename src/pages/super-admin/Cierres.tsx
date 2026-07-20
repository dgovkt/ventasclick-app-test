import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Card } from '../../components/Card';
import { supabase } from '../../lib/supabase';
import { TrendingUp, Search, Filter, DollarSign, ShoppingCart, CheckCircle, Clock, Download } from 'lucide-react';
import { exportToExcel, formatCurrency as excelFormatCurrency, formatDate } from '../../lib/excelExport';
import EvidenciasThumbnails from '../../components/EvidenciasThumbnails';

interface Evidencia {
  id: string;
  foto_url: string;
  tipo: string;
  created_at: string;
}

interface Venta {
  id: string;
  monto: number;
  estatus_pago: 'pendiente' | 'pagado' | 'completado' | 'fallido';
  fecha: string;
  fecha_cierre: string;
  comision_socio: number;
  pagado_socio: boolean;
  socio_id: string;
  evidencias_ventas?: Evidencia[];
  socio?: {
    nombre: string;
    apellido: string;
  };
  lead?: {
    nombre: string;
    apellidos: string;
    email: string;
  };
  plan?: {
    nombre: string;
    precio_anual: number;
  };
}

type FilterEstatus = 'todos' | 'pendiente' | 'pagado' | 'completado' | 'fallido';

export default function SuperAdminCierres() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [filteredVentas, setFilteredVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstatus, setFilterEstatus] = useState<FilterEstatus>('todos');

  useEffect(() => {
    loadVentas();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filterEstatus, ventas]);

  async function loadVentas() {
    try {
      const { data, error } = await supabase
        .from('ventas')
        .select(`
          *,
          evidencias_ventas (
            id,
            foto_url,
            tipo,
            created_at
          ),
          socio:profiles!socio_id(nombre, apellido),
          lead:leads!lead_id(nombre, apellidos, email),
          plan:planes!plan_id(nombre, precio_anual)
        `)
        .order('fecha', { ascending: false });

      if (error) throw error;
      setVentas(data || []);
    } catch (error) {
      console.error('Error loading ventas:', error);
    } finally {
      setLoading(false);
    }
  }

  function applyFilters() {
    let filtered = [...ventas];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        venta =>
          (venta.socio && `${venta.socio.nombre} ${venta.socio.apellido}`.toLowerCase().includes(term)) ||
          (venta.lead && `${venta.lead.nombre} ${venta.lead.apellidos}`.toLowerCase().includes(term)) ||
          (venta.lead && venta.lead.email.toLowerCase().includes(term)) ||
          (venta.plan && venta.plan.nombre.toLowerCase().includes(term))
      );
    }

    if (filterEstatus !== 'todos') {
      filtered = filtered.filter(venta => venta.estatus_pago === filterEstatus);
    }

    setFilteredVentas(filtered);
  }

  const getEstatusBadge = (estatus: string) => {
    const styles = {
      pendiente: 'bg-yellow-100 text-yellow-800',
      pagado: 'bg-blue-100 text-blue-800',
      completado: 'bg-primary-light text-primary-dark',
      fallido: 'bg-red-100 text-red-800',
    };
    const labels = {
      pendiente: 'Pendiente',
      pagado: 'Pagado',
      completado: 'Completado',
      fallido: 'Fallido',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[estatus as keyof typeof styles]}`}>
        {labels[estatus as keyof typeof labels]}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  const stats = {
    total: ventas.length,
    pendientes: ventas.filter(v => v.estatus_pago === 'pendiente').length,
    completadas: ventas.filter(v => v.estatus_pago === 'completado').length,
    montoTotal: ventas.reduce((sum, v) => sum + parseFloat(v.monto.toString()), 0),
    comisionTotal: ventas.reduce((sum, v) => sum + parseFloat(v.comision_socio?.toString() || '0'), 0),
    comisionesPagadas: ventas.filter(v => v.pagado_socio).reduce((sum, v) => sum + parseFloat(v.comision_socio?.toString() || '0'), 0),
  };

  const handleExportToExcel = () => {
    const dataToExport = filteredVentas.map(venta => ({
      'Socio': venta.socio ? `${venta.socio.nombre} ${venta.socio.apellido}` : '-',
      'Cliente': venta.lead ? `${venta.lead.nombre} ${venta.lead.apellidos}` : '-',
      'Email Cliente': venta.lead?.email || '-',
      'Plan': venta.plan?.nombre || '-',
      'Monto': parseFloat(venta.monto.toString()),
      'Comisión': parseFloat(venta.comision_socio?.toString() || '0'),
      'Estado Pago': venta.estatus_pago,
      'Comisión Pagada': venta.pagado_socio ? 'Sí' : 'No',
      'Fecha Cierre': formatDate(venta.fecha_cierre || venta.fecha),
    }));

    exportToExcel(dataToExport, 'cierres', 'Ventas');
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Cargando ventas...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Cierres</h1>
          <p className="text-gray-600 mt-2">Vista global de todas las ventas del sistema</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 font-medium">Total Ventas</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
                </div>
                <ShoppingCart className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-primary-light to-primary-light border-primary-light">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-primary-dark font-medium">Monto Total</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {formatCurrency(stats.montoTotal)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-700 font-medium">Comisiones</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">
                    {formatCurrency(stats.comisionTotal)}
                  </p>
                  <p className="text-xs text-yellow-600 mt-1">
                    {formatCurrency(stats.comisionesPagadas)} pagadas
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-cyan-700 font-medium">Completadas</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.completadas}</p>
                  <p className="text-xs text-cyan-600 mt-1">
                    {stats.pendientes} pendientes
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-cyan-600" />
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
                  placeholder="Buscar por socio, cliente, plan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="text-gray-400" size={20} />
                <select
                  value={filterEstatus}
                  onChange={(e) => setFilterEstatus(e.target.value as FilterEstatus)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="todos">Todos los estados</option>
                  <option value="pendiente">Pendientes</option>
                  <option value="pagado">Pagadas</option>
                  <option value="completado">Completadas</option>
                  <option value="fallido">Fallidas</option>
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
                      Socio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Comisión
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado Pago
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Comisión Pagada
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Evidencias
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredVentas.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                        {searchTerm || filterEstatus !== 'todos'
                          ? 'No se encontraron ventas con los filtros aplicados'
                          : 'No hay ventas registradas'}
                      </td>
                    </tr>
                  ) : (
                    filteredVentas.map((venta) => (
                      <tr key={venta.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {venta.socio ? `${venta.socio.nombre} ${venta.socio.apellido}` : '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {venta.lead ? `${venta.lead.nombre} ${venta.lead.apellidos}` : '-'}
                            </div>
                            {venta.lead && (
                              <div className="text-sm text-gray-500">{venta.lead.email}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{venta.plan?.nombre || '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            {formatCurrency(parseFloat(venta.monto.toString()))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-primary">
                            {formatCurrency(parseFloat(venta.comision_socio?.toString() || '0'))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getEstatusBadge(venta.estatus_pago)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {venta.pagado_socio ? (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary-light text-primary-dark">
                              Pagada
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Pendiente
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {venta.evidencias_ventas && venta.evidencias_ventas.length > 0 ? (
                            <EvidenciasThumbnails evidencias={venta.evidencias_ventas} />
                          ) : (
                            <span className="text-sm text-gray-400">Sin evidencia</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(venta.fecha_cierre || venta.fecha).toLocaleDateString('es-MX')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="text-sm text-gray-600">
              Mostrando {filteredVentas.length} de {ventas.length} ventas
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
