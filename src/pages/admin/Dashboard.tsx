import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Users, TrendingUp, DollarSign, UserCheck, Clock, CheckCircle, Target, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Card } from '../../components/Card';
import type { Database } from '../../lib/database.types';

type Lead = Database['public']['Tables']['leads']['Row'];
type Venta = Database['public']['Tables']['ventas']['Row'];
type SolicitudPago = Database['public']['Tables']['solicitudes_pago']['Row'];

interface KPIs {
  totalSocios: number;
  leadsTotal: number;
  leadsPorEstado: {
    nuevo: number;
    en_seguimiento: number;
    cerrado_ganado: number;
    cerrado_perdido: number;
  };
  ventasMes: number;
  ventasTotal: number;
  comisionesAprobadas: number;
  comisionesPagadas: number;
  comisionesPendientesSolicitar: number;
}

export const AdminDashboard = () => {
  const [kpis, setKpis] = useState<KPIs>({
    totalSocios: 0,
    leadsTotal: 0,
    leadsPorEstado: {
      nuevo: 0,
      en_seguimiento: 0,
      cerrado_ganado: 0,
      cerrado_perdido: 0,
    },
    ventasMes: 0,
    ventasTotal: 0,
    comisionesAprobadas: 0,
    comisionesPagadas: 0,
    comisionesPendientesSolicitar: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      const [sociosResult, leadsResult, ventasResult, solicitudesResult] = await Promise.all([
        supabase.from('profiles').select('id').eq('rol', 'socio'),
        supabase.from('leads').select('id, estado, nombre, apellidos, fecha_creacion').order('fecha_creacion', { ascending: false }),
        supabase.from('ventas').select('id, fecha_cierre, fecha, monto, created_at'),
        supabase.from('solicitudes_pago').select('id, monto_solicitado, estatus'),
      ]);

      const totalSocios = sociosResult.data?.length || 0;
      const leads = leadsResult.data || [];
      const ventas = ventasResult.data || [];
      const solicitudes = solicitudesResult.data || [];

      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const ventasMes = ventas.filter(v => {
        const fecha = new Date(v.fecha_cierre || v.fecha || v.created_at);
        return fecha >= firstDayOfMonth;
      }).length;

      const leadsPorEstado = {
        nuevo: leads.filter(l => l.estado === 'nuevo').length,
        en_seguimiento: leads.filter(l => l.estado === 'en_seguimiento').length,
        cerrado_ganado: leads.filter(l => l.estado === 'cerrado_ganado').length,
        cerrado_perdido: leads.filter(l => l.estado === 'cerrado_perdido').length,
      };

      const comisionesAprobadas = solicitudes
        .filter(s => s.estatus === 'aprobada')
        .reduce((sum, s) => sum + (Number(s.monto_solicitado) || 0), 0);

      const comisionesPagadas = solicitudes
        .filter(s => s.estatus === 'pagada')
        .reduce((sum, s) => sum + (Number(s.monto_solicitado) || 0), 0);

      const comisionesPendientesSolicitar = solicitudes
        .filter(s => s.estatus !== 'aprobada' && s.estatus !== 'pagada')
        .reduce((sum, s) => sum + (Number(s.monto_solicitado) || 0), 0);

      setKpis({
        totalSocios,
        leadsTotal: leads.length,
        leadsPorEstado,
        ventasMes,
        ventasTotal: ventas.length,
        comisionesAprobadas,
        comisionesPagadas,
        comisionesPendientesSolicitar,
      });

      const recentLeads = leads
        .slice(0, 5)
        .map(l => ({ tipo: 'lead', nombre: `${l.nombre} ${l.apellidos || ''}`.trim(), estado: l.estado, fecha: l.fecha_creacion }));

      setRecentActivity(recentLeads);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Cargando dashboard...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
          <p className="text-gray-600 mt-2">Vista general del sistema CRM</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Socios</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{kpis.totalSocios}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Leads Totales</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{kpis.leadsTotal}</p>
                  <p className="text-xs text-primary mt-1">
                    {kpis.leadsPorEstado.nuevo} nuevos
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ventas del Mes</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{kpis.ventasMes}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {kpis.ventasTotal} total
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Comisiones Aprobadas</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {formatCurrency(kpis.comisionesAprobadas)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatCurrency(kpis.comisionesPagadas)} pagadas
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Embudo de Leads</h3>
              <div className="space-y-3">
                {[
                  { label: 'Nuevo', key: 'nuevo', color: 'bg-blue-500' },
                  { label: 'En seguimiento', key: 'en_seguimiento', color: 'bg-amber-500' },
                  { label: 'Cerrado ganado', key: 'cerrado_ganado', color: 'bg-green-500' },
                  { label: 'Cerrado perdido', key: 'cerrado_perdido', color: 'bg-red-400' },
                ].map(({ label, key, color }) => {
                  const count = kpis.leadsPorEstado[key as keyof typeof kpis.leadsPorEstado];
                  const pct = kpis.leadsTotal > 0 ? Math.round((count / kpis.leadsTotal) * 100) : 0;
                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">{label}</span>
                        <span className="text-sm font-semibold text-gray-900">{count}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div className={`${color} h-1.5 rounded-full transition-all`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Comisiones</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Aprobadas (por pagar)</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatCurrency(kpis.comisionesAprobadas)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Pagadas</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatCurrency(kpis.comisionesPagadas)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Total acumulado</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatCurrency(kpis.comisionesAprobadas + kpis.comisionesPagadas)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
              {recentActivity.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No hay actividad reciente</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => {
                    const estadoColor: Record<string, string> = {
                      nuevo: 'bg-blue-500',
                      en_seguimiento: 'bg-amber-500',
                      cerrado_ganado: 'bg-green-500',
                      cerrado_perdido: 'bg-red-400',
                    };
                    const estadoLabel: Record<string, string> = {
                      nuevo: 'Nuevo',
                      en_seguimiento: 'En seguimiento',
                      cerrado_ganado: 'Ganado',
                      cerrado_perdido: 'Perdido',
                    };
                    return (
                      <div key={index} className="flex items-center gap-3 text-sm">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${estadoColor[activity.estado] || 'bg-gray-400'}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-900 truncate">{activity.nombre || 'Lead'}</p>
                          <p className="text-xs text-gray-500">
                            {estadoLabel[activity.estado] || activity.estado} · {new Date(activity.fecha).toLocaleDateString('es-MX')}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};
