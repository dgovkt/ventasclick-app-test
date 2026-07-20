import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { supabase } from '../../lib/supabase';
import {
  DollarSign, Search, Filter, Clock, CheckCircle, XCircle,
  AlertCircle, X, ChevronDown, ChevronUp, RefreshCw, Download,
  CheckSquare, Square, Users,
} from 'lucide-react';
import { exportToExcel, formatDate } from '../../lib/excelExport';

interface VentaPendiente {
  id: string;
  socio_id: string;
  monto: number;
  comision_socio: number;
  fecha_cierre: string;
  notas: string | null;
  estatus_pago: string;
  socio?: { nombre: string; apellido: string; email: string };
  lead?: { nombre: string; apellidos: string };
}

interface SolicitudPago {
  id: string;
  monto_solicitado: number;
  estatus: 'pendiente' | 'aprobada' | 'pagada' | 'rechazada';
  fecha_inicio: string;
  fecha_fin: string;
  comentarios_admin: string | null;
  created_at: string;
  payment_reference: string | null;
  payment_date: string | null;
  socio_id: string;
  socio?: {
    nombre: string;
    apellido: string;
    email: string;
    clabe: string;
    nombre_banco: string;
    beneficiario: string;
  };
  solicitud_pago_ventas?: {
    venta_id: string;
    comision_calculada: number;
    ventas: {
      monto: number;
      fecha_cierre: string;
      leads: { nombre: string; apellidos: string } | null;
      planes: { nombre: string } | null;
    } | null;
  }[];
}

type FilterEstatus = 'todos' | 'pendiente' | 'aprobada' | 'pagada' | 'rechazada';
type SortField = 'fecha' | 'monto' | 'socio';
type SortDir = 'asc' | 'desc';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);

export default function SuperAdminComisiones() {
  const [ventasPendientes, setVentasPendientes] = useState<VentaPendiente[]>([]);
  const [solicitudes, setSolicitudes] = useState<SolicitudPago[]>([]);
  const [filteredSolicitudes, setFilteredSolicitudes] = useState<SolicitudPago[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstatus, setFilterEstatus] = useState<FilterEstatus>('todos');
  const [filterSocio, setFilterSocio] = useState('todos');
  const [sortField, setSortField] = useState<SortField>('fecha');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [selectedSolicitud, setSelectedSolicitud] = useState<SolicitudPago | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showVentasSection, setShowVentasSection] = useState(true);
  const [showRechazadasSection, setShowRechazadasSection] = useState(false);
  const [ventasRechazadas, setVentasRechazadas] = useState<VentaPendiente[]>([]);
  const [confirmingVenta, setConfirmingVenta] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filterEstatus, filterSocio, sortField, sortDir, solicitudes]);

  async function loadAll() {
    setLoading(true);
    await Promise.allSettled([loadVentasPendientes(), loadVentasRechazadas(), loadSolicitudes()]);
    setLoading(false);
  }

  async function loadVentasPendientes() {
    const { data, error } = await supabase
      .from('ventas')
      .select(`
        id, socio_id, monto, comision_socio, fecha_cierre, notas, estatus_pago,
        socio:profiles!socio_id(nombre, apellido, email),
        lead:leads!lead_id(nombre, apellidos)
      `)
      .neq('estatus_pago', 'completado')
      .neq('estatus_pago', 'fallido')
      .order('fecha_cierre', { ascending: false });
    if (error) console.error('Error loading ventas pendientes:', error);
    setVentasPendientes(data || []);
  }

  async function loadSolicitudes() {
    const { data, error } = await supabase
      .from('solicitudes_pago')
      .select(`
        *,
        socio:profiles!socio_id(nombre, apellido, email, clabe, nombre_banco, beneficiario),
        solicitud_pago_ventas (
          venta_id, comision_calculada,
          ventas ( monto, fecha_cierre, leads ( nombre, apellidos ), planes:planes!plan_id ( nombre ) )
        )
      `)
      .order('created_at', { ascending: false });
    if (error) console.error('Error loading solicitudes:', error);
    setSolicitudes(data || []);
  }

  async function confirmarVenta(ventaId: string) {
    setConfirmingVenta(ventaId);
    try {
      const { error } = await supabase
        .from('ventas')
        .update({ estatus_pago: 'completado', updated_at: new Date().toISOString() })
        .eq('id', ventaId);
      if (error) throw error;
      await new Promise(r => setTimeout(r, 800));
      await loadAll();
    } catch (err: any) {
      alert(err.message || 'Error al confirmar la venta');
    } finally {
      setConfirmingVenta(null);
    }
  }

  async function rechazarVenta(ventaId: string) {
    if (!confirm('Seguro que deseas rechazar este cierre? El socio no recibira comision por esta venta.')) return;
    setConfirmingVenta(ventaId);
    try {
      const { error } = await supabase
        .from('ventas')
        .update({ estatus_pago: 'fallido', updated_at: new Date().toISOString() })
        .eq('id', ventaId);
      if (error) throw error;
      await new Promise(r => setTimeout(r, 800));
      await loadAll();
    } catch (err: any) {
      alert(err.message || 'Error al rechazar la venta');
    } finally {
      setConfirmingVenta(null);
    }
  }

  async function loadVentasRechazadas() {
    const { data, error } = await supabase
      .from('ventas')
      .select(`
        id, socio_id, monto, comision_socio, fecha_cierre, notas, estatus_pago,
        socio:profiles!socio_id(nombre, apellido, email),
        lead:leads!lead_id(nombre, apellidos)
      `)
      .eq('estatus_pago', 'fallido')
      .order('updated_at', { ascending: false });
    if (error) console.error('Error loading ventas rechazadas:', error);
    setVentasRechazadas(data || []);
  }

  async function reabrirVenta(ventaId: string) {
    if (!confirm('Reabrir esta venta? Volvera a aparecer en "Cierres por confirmar" para revision.')) return;
    setConfirmingVenta(ventaId);
    try {
      const { error } = await supabase
        .from('ventas')
        .update({ estatus_pago: 'pendiente', updated_at: new Date().toISOString() })
        .eq('id', ventaId);
      if (error) throw error;
      await new Promise(r => setTimeout(r, 800));
      await loadAll();
    } catch (err: any) {
      alert(err.message || 'Error al reabrir la venta');
    } finally {
      setConfirmingVenta(null);
    }
  }

  function applyFilters() {
    let filtered = [...solicitudes];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(s => {
        const socioName = s.socio ? `${s.socio.nombre} ${s.socio.apellido}`.toLowerCase() : '';
        const socioEmail = s.socio?.email?.toLowerCase() || '';
        const clientName = getClientName(s).toLowerCase();
        return socioName.includes(term) || socioEmail.includes(term) || clientName.includes(term);
      });
    }

    if (filterEstatus !== 'todos') {
      filtered = filtered.filter(s => s.estatus === filterEstatus);
    }

    if (filterSocio !== 'todos') {
      filtered = filtered.filter(s => s.socio_id === filterSocio);
    }

    filtered.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'fecha') {
        cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (sortField === 'monto') {
        cmp = parseFloat(a.monto_solicitado.toString()) - parseFloat(b.monto_solicitado.toString());
      } else if (sortField === 'socio') {
        const nameA = a.socio ? `${a.socio.nombre} ${a.socio.apellido}` : '';
        const nameB = b.socio ? `${b.socio.nombre} ${b.socio.apellido}` : '';
        cmp = nameA.localeCompare(nameB);
      }
      return sortDir === 'desc' ? -cmp : cmp;
    });

    setFilteredSolicitudes(filtered);
  }

  function getClientName(s: SolicitudPago): string {
    const venta = s.solicitud_pago_ventas?.[0]?.ventas;
    if (venta?.leads) return `${venta.leads.nombre} ${venta.leads.apellidos}`;
    return '-';
  }

  function getVentaDetails(s: SolicitudPago) {
    const link = s.solicitud_pago_ventas?.[0];
    return {
      clientName: link?.ventas?.leads ? `${link.ventas.leads.nombre} ${link.ventas.leads.apellidos}` : '-',
      planName: link?.ventas?.planes?.nombre || '-',
      montoVenta: link?.ventas?.monto ? parseFloat(link.ventas.monto.toString()) : 0,
      fechaCierre: link?.ventas?.fecha_cierre || null,
    };
  }

  const uniqueSocios = Array.from(
    new Map(
      solicitudes
        .filter(s => s.socio)
        .map(s => [s.socio_id, { id: s.socio_id, nombre: `${s.socio!.nombre} ${s.socio!.apellido}` }])
    ).values()
  ).sort((a, b) => a.nombre.localeCompare(b.nombre));

  const getEstatusBadge = (estatus: string) => {
    const config: Record<string, { bg: string; text: string; label: string; icon: any }> = {
      pendiente: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendiente', icon: Clock },
      aprobada: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Aprobada', icon: CheckCircle },
      pagada: { bg: 'bg-green-100', text: 'text-green-800', label: 'Pagada', icon: CheckCircle },
      rechazada: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rechazada', icon: XCircle },
    };
    const c = config[estatus] ?? config['pendiente'];
    const Icon = c.icon;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text} flex items-center gap-1 w-fit`}>
        <Icon size={14} />
        {c.label}
      </span>
    );
  };

  const stats = {
    porConfirmar: ventasPendientes.length,
    montoPorConfirmar: ventasPendientes.reduce((s, v) => s + parseFloat(v.comision_socio?.toString() || '0'), 0),
    pendientes: solicitudes.filter(s => s.estatus === 'pendiente').length,
    montoPendiente: solicitudes.filter(s => s.estatus === 'pendiente').reduce((s, x) => s + parseFloat(x.monto_solicitado.toString()), 0),
    aprobadas: solicitudes.filter(s => s.estatus === 'aprobada').length,
    montoAprobado: solicitudes.filter(s => s.estatus === 'aprobada').reduce((s, x) => s + parseFloat(x.monto_solicitado.toString()), 0),
    pagadas: solicitudes.filter(s => s.estatus === 'pagada').length,
    montoPagado: solicitudes.filter(s => s.estatus === 'pagada').reduce((s, x) => s + parseFloat(x.monto_solicitado.toString()), 0),
  };

  function toggleSelect(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selectedIds.size === filteredSolicitudes.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredSolicitudes.map(s => s.id)));
    }
  }

  const handleExportSolicitudes = () => {
    const dataToExport = filteredSolicitudes.map(solicitud => {
      const details = getVentaDetails(solicitud);
      return {
        'Cliente': details.clientName,
        'Plan': details.planName,
        'Monto Venta': details.montoVenta,
        'Comision': parseFloat(solicitud.monto_solicitado.toString()),
        'Fecha Cierre': details.fechaCierre ? formatDate(details.fechaCierre) : '-',
        'Socio': solicitud.socio ? `${solicitud.socio.nombre} ${solicitud.socio.apellido}` : '-',
        'Email Socio': solicitud.socio?.email || '-',
        'Estado': solicitud.estatus,
        'Periodo': `${formatDate(solicitud.fecha_inicio)} - ${formatDate(solicitud.fecha_fin)}`,
        'Fecha Creacion': formatDate(solicitud.created_at),
        'Banco': solicitud.socio?.nombre_banco || '-',
        'CLABE': solicitud.socio?.clabe || '-',
        'Beneficiario': solicitud.socio?.beneficiario || '-',
        'Referencia Pago': solicitud.payment_reference || '-',
        'Fecha Pago': solicitud.payment_date ? formatDate(solicitud.payment_date) : '-',
        'Comentarios Admin': solicitud.comentarios_admin || '-',
      };
    });

    exportToExcel(dataToExport, 'comisiones_individuales', 'Comisiones');
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Cargando comisiones...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion de Comisiones</h1>
            <p className="text-gray-600 mt-2">Gestiona cada pago de comision de forma individual</p>
          </div>
          <button
            onClick={loadAll}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Actualizar
          </button>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-orange-700 font-medium uppercase tracking-wide mb-1">Por confirmar</p>
                <p className="text-2xl font-bold text-gray-900">{stats.porConfirmar}</p>
                <p className="text-sm text-orange-600 mt-1">{formatCurrency(stats.montoPorConfirmar)}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-500 flex-shrink-0" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-yellow-700 font-medium uppercase tracking-wide mb-1">En cobro</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendientes}</p>
                <p className="text-sm text-yellow-600 mt-1">{formatCurrency(stats.montoPendiente)}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600 flex-shrink-0" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-700 font-medium uppercase tracking-wide mb-1">Aprobadas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.aprobadas}</p>
                <p className="text-sm text-blue-600 mt-1">{formatCurrency(stats.montoAprobado)}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-600 flex-shrink-0" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-green-700 font-medium uppercase tracking-wide mb-1">Pagadas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pagadas}</p>
                <p className="text-sm text-green-600 mt-1">{formatCurrency(stats.montoPagado)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600 flex-shrink-0" />
            </div>
          </Card>
        </div>

        {ventasPendientes.length > 0 && (
          <Card>
            <button
              className="w-full flex items-center justify-between p-1 text-left"
              onClick={() => setShowVentasSection(v => !v)}
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-orange-100 text-orange-700 text-sm font-bold">
                  {ventasPendientes.length}
                </span>
                <h2 className="text-lg font-semibold text-gray-900">Cierres por confirmar</h2>
                <span className="text-sm text-orange-600 font-medium">— requieren revision</span>
              </div>
              {showVentasSection ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
            </button>

            {showVentasSection && (
              <div className="mt-4 space-y-3">
                {ventasPendientes.map(venta => (
                  <div
                    key={venta.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-orange-50 border border-orange-200 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">
                          {venta.socio ? `${venta.socio.nombre} ${venta.socio.apellido}` : '-'}
                        </span>
                        {venta.lead && (
                          <span className="text-sm text-gray-500">
                            — Cliente: {venta.lead.nombre} {venta.lead.apellidos}
                          </span>
                        )}
                      </div>
                      {venta.socio && (
                        <p className="text-xs text-gray-500 mb-2">{venta.socio.email}</p>
                      )}
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Venta: </span>
                          <span className="font-medium text-gray-900">{formatCurrency(parseFloat(venta.monto?.toString() || '0'))}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Comision socio: </span>
                          <span className="font-semibold text-orange-700">{formatCurrency(parseFloat(venta.comision_socio?.toString() || '0'))}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Fecha cierre: </span>
                          <span className="text-gray-900">{new Date(venta.fecha_cierre).toLocaleDateString('es-MX')}</span>
                        </div>
                      </div>
                      {venta.notas && (
                        <p className="text-xs text-gray-500 mt-2 italic">"{venta.notas}"</p>
                      )}
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => rechazarVenta(venta.id)}
                        disabled={confirmingVenta === venta.id}
                      >
                        <XCircle size={14} className="mr-1 text-red-500" />
                        Rechazar
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => confirmarVenta(venta.id)}
                        disabled={confirmingVenta === venta.id}
                      >
                        <CheckCircle size={14} className="mr-1" />
                        {confirmingVenta === venta.id ? 'Procesando...' : 'Confirmar'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {ventasRechazadas.length > 0 && (
          <Card>
            <button
              className="w-full flex items-center justify-between p-1 text-left"
              onClick={() => setShowRechazadasSection(v => !v)}
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-100 text-red-700 text-sm font-bold">
                  {ventasRechazadas.length}
                </span>
                <h2 className="text-lg font-semibold text-gray-900">Cierres rechazados</h2>
                <span className="text-sm text-red-600 font-medium">— disputas pendientes</span>
              </div>
              {showRechazadasSection ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
            </button>

            {showRechazadasSection && (
              <div className="mt-4 space-y-3">
                {ventasRechazadas.map(venta => (
                  <div
                    key={venta.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">
                          {venta.socio ? `${venta.socio.nombre} ${venta.socio.apellido}` : '-'}
                        </span>
                        {venta.lead && (
                          <span className="text-sm text-gray-500">
                            — Cliente: {venta.lead.nombre} {venta.lead.apellidos}
                          </span>
                        )}
                      </div>
                      {venta.socio && (
                        <p className="text-xs text-gray-500 mb-2">{venta.socio.email}</p>
                      )}
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Venta: </span>
                          <span className="font-medium text-gray-900">{formatCurrency(parseFloat(venta.monto?.toString() || '0'))}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Comision socio: </span>
                          <span className="font-semibold text-red-700">{formatCurrency(parseFloat(venta.comision_socio?.toString() || '0'))}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Fecha cierre: </span>
                          <span className="text-gray-900">{new Date(venta.fecha_cierre).toLocaleDateString('es-MX')}</span>
                        </div>
                      </div>
                      {venta.notas && (
                        <p className="text-xs text-gray-500 mt-2 italic">"{venta.notas}"</p>
                      )}
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        onClick={() => reabrirVenta(venta.id)}
                        disabled={confirmingVenta === venta.id}
                      >
                        <RefreshCw size={14} className="mr-1" />
                        {confirmingVenta === venta.id ? 'Procesando...' : 'Reabrir'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        <Card>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Pagos individuales</h2>
              <button
                onClick={handleExportSolicitudes}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                <Download size={18} />
                Descargar Excel
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar por socio, email o cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="text-gray-400 flex-shrink-0" size={20} />
                <select
                  value={filterEstatus}
                  onChange={(e) => setFilterEstatus(e.target.value as FilterEstatus)}
                  className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="todos">Todos los estados</option>
                  <option value="pendiente">Pendientes</option>
                  <option value="aprobada">Aprobadas</option>
                  <option value="pagada">Pagadas</option>
                  <option value="rechazada">Rechazadas</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Users className="text-gray-400 flex-shrink-0" size={20} />
                <select
                  value={filterSocio}
                  onChange={(e) => setFilterSocio(e.target.value)}
                  className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="todos">Todos los socios</option>
                  {uniqueSocios.map(s => (
                    <option key={s.id} value={s.id}>{s.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={`${sortField}-${sortDir}`}
                  onChange={(e) => {
                    const [f, d] = e.target.value.split('-') as [SortField, SortDir];
                    setSortField(f);
                    setSortDir(d);
                  }}
                  className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="fecha-desc">Mas reciente</option>
                  <option value="fecha-asc">Mas antiguo</option>
                  <option value="monto-desc">Mayor monto</option>
                  <option value="monto-asc">Menor monto</option>
                  <option value="socio-asc">Socio A-Z</option>
                  <option value="socio-desc">Socio Z-A</option>
                </select>
              </div>
            </div>

            {selectedIds.size > 0 && (
              <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <span className="text-sm font-medium text-blue-900">
                  {selectedIds.size} seleccionado{selectedIds.size > 1 ? 's' : ''}
                </span>
                <div className="flex gap-2 ml-auto">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedIds(new Set())}
                  >
                    Deseleccionar
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setShowBulkModal(true)}
                  >
                    Accion masiva
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {filteredSolicitudes.length > 0 && (
                <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                  <button
                    onClick={toggleSelectAll}
                    className="p-1 text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    {selectedIds.size === filteredSolicitudes.length && selectedIds.size > 0
                      ? <CheckSquare size={20} className="text-blue-600" />
                      : <Square size={20} />
                    }
                  </button>
                  <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">Seleccionar todos</span>
                </div>
              )}

              {filteredSolicitudes.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">
                    {searchTerm || filterEstatus !== 'todos' || filterSocio !== 'todos'
                      ? 'No se encontraron pagos con los filtros aplicados'
                      : 'No hay pagos registrados aun'}
                  </p>
                </div>
              ) : (
                filteredSolicitudes.map((solicitud) => {
                  const details = getVentaDetails(solicitud);
                  const isSelected = selectedIds.has(solicitud.id);

                  return (
                    <div
                      key={solicitud.id}
                      className={`p-4 border rounded-xl transition-all ${
                        isSelected
                          ? 'border-blue-300 bg-blue-50/50 shadow-sm'
                          : 'border-gray-200 bg-white hover:shadow-md hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleSelect(solicitud.id)}
                          className="mt-1 p-0.5 text-gray-400 hover:text-blue-600 transition-colors flex-shrink-0"
                        >
                          {isSelected
                            ? <CheckSquare size={20} className="text-blue-600" />
                            : <Square size={20} />
                          }
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            {getEstatusBadge(solicitud.estatus)}
                            <span className="text-xs text-gray-400">
                              {new Date(solicitud.created_at).toLocaleDateString('es-MX')}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <p className="text-xs text-gray-500 mb-0.5">Cliente</p>
                              <p className="text-sm font-semibold text-gray-900">{details.clientName}</p>
                              {details.planName !== '-' && (
                                <p className="text-xs text-gray-500">Plan: {details.planName}</p>
                              )}
                            </div>

                            <div>
                              <p className="text-xs text-gray-500 mb-0.5">Comision</p>
                              <p className="text-lg font-bold text-gray-900">
                                {formatCurrency(parseFloat(solicitud.monto_solicitado.toString()))}
                              </p>
                              {details.montoVenta > 0 && (
                                <p className="text-xs text-gray-500">
                                  Venta: {formatCurrency(details.montoVenta)}
                                </p>
                              )}
                            </div>

                            <div>
                              <p className="text-xs text-gray-500 mb-0.5">Socio</p>
                              <p className="text-sm font-medium text-gray-900">
                                {solicitud.socio ? `${solicitud.socio.nombre} ${solicitud.socio.apellido}` : '-'}
                              </p>
                              {solicitud.socio?.nombre_banco && (
                                <p className="text-xs text-gray-500">
                                  {solicitud.socio.nombre_banco} {solicitud.socio.clabe ? `• ${solicitud.socio.clabe.slice(-4)}` : ''}
                                </p>
                              )}
                            </div>
                          </div>

                          {solicitud.comentarios_admin && (
                            <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                              <p className="text-xs text-blue-800">{solicitud.comentarios_admin}</p>
                            </div>
                          )}

                          {solicitud.payment_reference && (
                            <div className="mt-2 p-2 bg-green-50 rounded-lg flex items-center gap-2">
                              <CheckCircle size={14} className="text-green-600 flex-shrink-0" />
                              <p className="text-xs text-green-800">
                                Ref: {solicitud.payment_reference}
                                {solicitud.payment_date && (
                                  <span className="ml-2 text-green-600">
                                    ({new Date(solicitud.payment_date).toLocaleDateString('es-MX')})
                                  </span>
                                )}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex-shrink-0">
                          {(solicitud.estatus === 'pendiente' || solicitud.estatus === 'aprobada' || solicitud.estatus === 'pagada') && (
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedSolicitud(solicitud);
                                setShowActionModal(true);
                              }}
                            >
                              Gestionar
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="text-sm text-gray-600">
              Mostrando {filteredSolicitudes.length} de {solicitudes.length} pagos
            </div>
          </div>
        </Card>

        {showActionModal && selectedSolicitud && (
          <ActionModal
            solicitud={selectedSolicitud}
            onClose={() => {
              setShowActionModal(false);
              setSelectedSolicitud(null);
            }}
            onSuccess={() => {
              setShowActionModal(false);
              setSelectedSolicitud(null);
              loadAll();
            }}
          />
        )}

        {showBulkModal && (
          <BulkActionModal
            selectedIds={selectedIds}
            solicitudes={solicitudes}
            onClose={() => setShowBulkModal(false)}
            onSuccess={() => {
              setShowBulkModal(false);
              setSelectedIds(new Set());
              loadAll();
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

interface ActionModalProps {
  solicitud: SolicitudPago;
  onClose: () => void;
  onSuccess: () => void;
}

function ActionModal({ solicitud, onClose, onSuccess }: ActionModalProps) {
  const defaultAction = solicitud.estatus === 'pagada' ? 'reabrir' : solicitud.estatus === 'aprobada' ? 'marcar_pagada' : 'aprobar';
  const [action, setAction] = useState<'aprobar' | 'rechazar' | 'marcar_pagada' | 'reabrir'>(defaultAction);
  const [comentarios, setComentarios] = useState('');
  const [paymentReference, setPaymentReference] = useState(solicitud.payment_reference || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const details = (() => {
    const link = solicitud.solicitud_pago_ventas?.[0];
    return {
      clientName: link?.ventas?.leads ? `${link.ventas.leads.nombre} ${link.ventas.leads.apellidos}` : '-',
      planName: link?.ventas?.planes?.nombre || '-',
      montoVenta: link?.ventas?.monto ? parseFloat(link.ventas.monto.toString()) : 0,
      fechaCierre: link?.ventas?.fecha_cierre || null,
    };
  })();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (action === 'reabrir') {
      const confirmed = confirm(
        'Reabrir esta solicitud pagada?\n\n' +
        'Esta accion devolvera la solicitud a estado PENDIENTE. ' +
        'Solo hazlo si marcaste como pagada por error.\n\n' +
        'La venta vinculada volvera a aparecer como no pagada.'
      );
      if (!confirmed) return;
    }

    setIsSubmitting(true);
    try {
      const updateData: Record<string, any> = { updated_at: new Date().toISOString() };
      if (action === 'aprobar') {
        updateData.estatus = 'aprobada';
        updateData.comentarios_admin = comentarios || null;
      } else if (action === 'rechazar') {
        updateData.estatus = 'rechazada';
        updateData.comentarios_admin = comentarios;
      } else if (action === 'marcar_pagada') {
        updateData.estatus = 'pagada';
        updateData.payment_reference = paymentReference;
        updateData.payment_date = new Date().toISOString();
        updateData.comentarios_admin = comentarios || null;
      } else if (action === 'reabrir') {
        updateData.estatus = 'pendiente';
        updateData.comentarios_admin = (solicitud.comentarios_admin || '') +
          '\n\n[REABIERTA]: ' + (comentarios || 'Solicitud reabierta por el administrador');
      }

      const { error } = await supabase
        .from('solicitudes_pago')
        .update(updateData)
        .eq('id', solicitud.id);

      if (error) throw error;
      onSuccess();
    } catch (error: any) {
      alert(error.message || 'Error al actualizar la solicitud');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">Gestionar Pago</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Cliente</p>
                <p className="text-sm font-semibold text-gray-900">{details.clientName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Plan</p>
                <p className="text-sm font-medium text-gray-900">{details.planName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Monto Venta</p>
                <p className="text-sm font-medium text-gray-900">{formatCurrency(details.montoVenta)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Fecha Cierre</p>
                <p className="text-sm text-gray-900">
                  {details.fechaCierre ? new Date(details.fechaCierre).toLocaleDateString('es-MX') : '-'}
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-0.5">Socio</p>
              <p className="text-sm font-semibold text-gray-900">
                {solicitud.socio ? `${solicitud.socio.nombre} ${solicitud.socio.apellido}` : '-'}
              </p>
            </div>
            <div className="pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-0.5">Comision a pagar</p>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(parseFloat(solicitud.monto_solicitado.toString()))}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Accion *</label>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value as any)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {solicitud.estatus === 'pendiente' && (
                <option value="aprobar">Aprobar Pago</option>
              )}
              {solicitud.estatus === 'pagada' && (
                <option value="reabrir">Reabrir (solo si fue error)</option>
              )}
              {solicitud.estatus !== 'pagada' && (
                <option value="marcar_pagada">Marcar como Pagada</option>
              )}
              <option value="rechazar">Rechazar Pago</option>
            </select>
          </div>

          {action === 'reabrir' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex gap-2">
                <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold mb-1">Advertencia</p>
                  <p>
                    Esta accion devolvera el pago a estado pendiente.
                    Solo usa esta opcion si marcaste como pagada por error.
                  </p>
                </div>
              </div>
            </div>
          )}

          {action === 'marcar_pagada' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Referencia de Pago *</label>
              <input
                type="text"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Numero de transferencia, folio, etc."
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Esta referencia se guardara para auditoria
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comentarios {action === 'rechazar' && '*'}
            </label>
            <textarea
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Agrega un comentario sobre esta accion..."
              required={action === 'rechazar'}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose} fullWidth>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} fullWidth>
              {isSubmitting ? 'Procesando...' : 'Confirmar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface BulkActionModalProps {
  selectedIds: Set<string>;
  solicitudes: SolicitudPago[];
  onClose: () => void;
  onSuccess: () => void;
}

function BulkActionModal({ selectedIds, solicitudes, onClose, onSuccess }: BulkActionModalProps) {
  const [action, setAction] = useState<'aprobar' | 'marcar_pagada' | 'reabrir'>('aprobar');
  const [paymentReference, setPaymentReference] = useState('');
  const [comentarios, setComentarios] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selected = solicitudes.filter(s => selectedIds.has(s.id));
  const totalMonto = selected.reduce((sum, s) => sum + parseFloat(s.monto_solicitado.toString()), 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updateData: Record<string, any> = { updated_at: new Date().toISOString() };

      if (action === 'aprobar') {
        updateData.estatus = 'aprobada';
        updateData.comentarios_admin = comentarios || null;
      } else if (action === 'marcar_pagada') {
        updateData.estatus = 'pagada';
        updateData.payment_reference = paymentReference;
        updateData.payment_date = new Date().toISOString();
        updateData.comentarios_admin = comentarios || null;
      } else if (action === 'reabrir') {
        updateData.estatus = 'pendiente';
        updateData.comentarios_admin = comentarios || '[REABIERTA masivamente]';
      }

      const { error } = await supabase
        .from('solicitudes_pago')
        .update(updateData)
        .in('id', Array.from(selectedIds));

      if (error) throw error;
      onSuccess();
    } catch (error: any) {
      alert(error.message || 'Error al actualizar las solicitudes');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">Accion Masiva</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pagos seleccionados</p>
                <p className="text-2xl font-bold text-gray-900">{selectedIds.size}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Monto total</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(totalMonto)}</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Accion *</label>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value as any)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="aprobar">Aprobar todos</option>
              <option value="marcar_pagada">Marcar todos como pagados</option>
              <option value="reabrir">Reabrir todos (volver a pendiente)</option>
            </select>
          </div>

          {action === 'marcar_pagada' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Referencia de Pago *</label>
              <input
                type="text"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Referencia compartida para este lote"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Comentarios</label>
            <textarea
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Comentario aplicado a todos los pagos seleccionados..."
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose} fullWidth>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} fullWidth>
              {isSubmitting ? 'Procesando...' : `Confirmar (${selectedIds.size})`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
