import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Users, TrendingUp, DollarSign, UserCheck, Target, Zap, BarChart3, Award, Settings, FileText, Database as DatabaseIcon, Globe } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Card } from '../../components/Card';
import { useNavigate } from 'react-router-dom';
import type { Database } from '../../lib/database.types';

interface StratategicKPIs {
  totalUsuarios: number;
  totalSocios: number;
  totalAdmins: number;
  totalSuperAdmins: number;
  leadsTotal: number;
  ventasTotal: number;
  ventasAprobadas: number;
  ventasRechazadas: number;
  ventasPendientes: number;
  montoAprobadas: number;
  montoRechazadas: number;
  montoPendientes: number;
  tasaConversion: number;
  comisionesTotal: number;
  comisionesPagadas: number;
  comisionesAprobadas: number;
  comisionesRechazadas: number;
  comisionesPendientes: number;
  wizardIniciados: number;
  wizardCompletados: number;
  wizardConversion: number;
  topSocios: Array<{
    id: string;
    nombre: string;
    ventas: number;
    conversion: number;
  }>;
}

export const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [kpis, setKpis] = useState<StratategicKPIs>({
    totalUsuarios: 0,
    totalSocios: 0,
    totalAdmins: 0,
    totalSuperAdmins: 0,
    leadsTotal: 0,
    ventasTotal: 0,
    ventasAprobadas: 0,
    ventasRechazadas: 0,
    ventasPendientes: 0,
    montoAprobadas: 0,
    montoRechazadas: 0,
    montoPendientes: 0,
    tasaConversion: 0,
    comisionesTotal: 0,
    comisionesPagadas: 0,
    comisionesAprobadas: 0,
    comisionesRechazadas: 0,
    comisionesPendientes: 0,
    wizardIniciados: 0,
    wizardCompletados: 0,
    wizardConversion: 0,
    topSocios: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      const [
        profilesResult,
        leadsResult,
        ventasResult,
        solicitudesResult,
        wizardResult,
      ] = await Promise.all([
        supabase.from('profiles').select('id, rol'),
        supabase.from('leads').select('id, socio_id, estado'),
        supabase.from('ventas').select('id, socio_id, estatus_pago, monto, comision_socio'),
        supabase.from('solicitudes_pago').select('id, monto_solicitado, estatus'),
        supabase.from('wizard_accesos').select('id, completed'),
      ]);

      const profiles = profilesResult.data || [];
      const leads = leadsResult.data || [];
      const ventas = ventasResult.data || [];
      const solicitudes = solicitudesResult.data || [];
      const wizardAccesos = wizardResult.data || [];

      const totalUsuarios = profiles.length;
      const totalSocios = profiles.filter(p => p.rol === 'socio').length;
      const totalAdmins = profiles.filter(p => p.rol === 'admin').length;
      const totalSuperAdmins = profiles.filter(p => p.rol === 'super_admin').length;
      const leadsTotal = leads.length;
      const ventasTotal = ventas.length;
      const tasaConversion = leadsTotal > 0 ? Math.round((ventasTotal / leadsTotal) * 100) : 0;

      const ventasAprobadas = ventas.filter(v => v.estatus_pago === 'completado');
      const ventasRechazadas = ventas.filter(v => v.estatus_pago === 'fallido');
      const ventasPendientes = ventas.filter(v => v.estatus_pago === 'pendiente');

      const montoAprobadas = ventasAprobadas.reduce((sum, v) => sum + (v.monto || 0), 0);
      const montoRechazadas = ventasRechazadas.reduce((sum, v) => sum + (v.monto || 0), 0);
      const montoPendientes = ventasPendientes.reduce((sum, v) => sum + (v.monto || 0), 0);

      const comisionesAprobadas = ventasAprobadas.reduce((sum, v) => sum + (v.comision_socio || 0), 0);
      const comisionesRechazadas = ventasRechazadas.reduce((sum, v) => sum + (v.comision_socio || 0), 0);
      const comisionesPendientes = ventasPendientes.reduce((sum, v) => sum + (v.comision_socio || 0), 0);

      const comisionesTotal = comisionesAprobadas + comisionesRechazadas + comisionesPendientes;
      const comisionesPagadas = solicitudes
        .filter(s => s.estatus === 'pagada')
        .reduce((sum, s) => sum + (s.monto_solicitado || 0), 0);

      const wizardIniciados = wizardAccesos.length;
      const wizardCompletados = wizardAccesos.filter(w => w.completed).length;
      const wizardConversion = wizardIniciados > 0
        ? Math.round((wizardCompletados / wizardIniciados) * 100)
        : 0;

      const sociosConVentas = profiles
        .filter(p => p.rol === 'socio')
        .map(socio => {
          const socioLeads = leads.filter(l => l.socio_id === socio.id);
          const socioVentas = ventas.filter(v => v.socio_id === socio.id);
          const conversion = socioLeads.length > 0
            ? Math.round((socioVentas.length / socioLeads.length) * 100)
            : 0;

          return {
            id: socio.id,
            nombre: 'Socio',
            ventas: socioVentas.length,
            conversion,
          };
        })
        .sort((a, b) => b.ventas - a.ventas)
        .slice(0, 5);

      const sociosWithNames = await Promise.all(
        sociosConVentas.map(async (socio) => {
          const { data } = await supabase
            .from('profiles')
            .select('nombre, apellido')
            .eq('id', socio.id)
            .maybeSingle();

          return {
            ...socio,
            nombre: data ? `${data.nombre} ${data.apellido}` : 'Sin nombre',
          };
        })
      );

      setKpis({
        totalUsuarios,
        totalSocios,
        totalAdmins,
        totalSuperAdmins,
        leadsTotal,
        ventasTotal,
        ventasAprobadas: ventasAprobadas.length,
        ventasRechazadas: ventasRechazadas.length,
        ventasPendientes: ventasPendientes.length,
        montoAprobadas,
        montoRechazadas,
        montoPendientes,
        tasaConversion,
        comisionesTotal,
        comisionesPagadas,
        comisionesAprobadas,
        comisionesRechazadas,
        comisionesPendientes,
        wizardIniciados,
        wizardCompletados,
        wizardConversion,
        topSocios: sociosWithNames,
      });
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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Super Admin</h1>
          <p className="text-gray-600 mt-2">Vista estratégica del sistema</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Usuarios Totales</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{kpis.totalUsuarios}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {kpis.totalSocios} socios, {kpis.totalAdmins} admins, {kpis.totalSuperAdmins} super admins
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Embudo Global</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{kpis.ventasTotal}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {kpis.leadsTotal} leads ({kpis.tasaConversion}% conversion)
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xs text-green-600 font-medium">{kpis.ventasAprobadas}</p>
                  <p className="text-[10px] text-gray-500">Aprobadas</p>
                </div>
                <div>
                  <p className="text-xs text-red-600 font-medium">{kpis.ventasRechazadas}</p>
                  <p className="text-[10px] text-gray-500">Rechazadas</p>
                </div>
                <div>
                  <p className="text-xs text-amber-600 font-medium">{kpis.ventasPendientes}</p>
                  <p className="text-[10px] text-gray-500">Por confirmar</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Comisiones Totales</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {formatCurrency(kpis.comisionesTotal)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatCurrency(kpis.comisionesPagadas)} pagadas
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xs text-green-600 font-medium">{formatCurrency(kpis.comisionesAprobadas)}</p>
                  <p className="text-[10px] text-gray-500">Aprobadas</p>
                </div>
                <div>
                  <p className="text-xs text-red-600 font-medium">{formatCurrency(kpis.comisionesRechazadas)}</p>
                  <p className="text-[10px] text-gray-500">Rechazadas</p>
                </div>
                <div>
                  <p className="text-xs text-amber-600 font-medium">{formatCurrency(kpis.comisionesPendientes)}</p>
                  <p className="text-[10px] text-gray-500">Por confirmar</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Efectividad Wizard</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{kpis.wizardConversion}%</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {kpis.wizardCompletados}/{kpis.wizardIniciados} completados
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Top Socios por Conversión</h3>
                <Award className="w-5 h-5 text-yellow-600" />
              </div>
              {kpis.topSocios.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500">No hay datos disponibles</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {kpis.topSocios.map((socio, index) => (
                    <div key={socio.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          index === 0 ? 'bg-yellow-500 text-white' :
                          index === 1 ? 'bg-gray-400 text-white' :
                          index === 2 ? 'bg-orange-600 text-white' :
                          'bg-gray-300 text-gray-700'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{socio.nombre}</p>
                          <p className="text-xs text-gray-500">{socio.ventas} ventas</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-primary">{socio.conversion}%</p>
                        <p className="text-xs text-gray-500">conversión</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/super-admin/configuracion')}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-left flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Settings className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Configuración Global</h4>
                    <p className="text-xs text-gray-600">Ajustes del sistema</p>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/super-admin/contenido')}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary-light transition text-left flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Gestionar Contenido</h4>
                    <p className="text-xs text-gray-600">Editar páginas y recursos</p>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/super-admin/kb')}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition text-left flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <DatabaseIcon className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Base de Conocimientos</h4>
                    <p className="text-xs text-gray-600">Administrar artículos</p>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/super-admin/chargebee')}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition text-left flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Entorno Chargebee</h4>
                    <p className="text-xs text-gray-600">Cambiar entre prueba y producción</p>
                  </div>
                </button>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Métricas de Conversión</h3>
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <p className="text-sm text-blue-800 mb-2">Leads → Ventas</p>
                <p className="text-3xl font-bold text-blue-900">{kpis.tasaConversion}%</p>
                <p className="text-xs text-blue-700 mt-1">{kpis.ventasTotal} de {kpis.leadsTotal}</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                <p className="text-sm text-purple-800 mb-2">Wizard Completado</p>
                <p className="text-3xl font-bold text-purple-900">{kpis.wizardConversion}%</p>
                <p className="text-xs text-purple-700 mt-1">{kpis.wizardCompletados} de {kpis.wizardIniciados}</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-primary-light to-primary-light rounded-lg">
                <p className="text-sm text-primary-dark mb-2">Comisiones Pagadas</p>
                <p className="text-3xl font-bold text-primary-dark">
                  {kpis.comisionesTotal > 0
                    ? Math.round((kpis.comisionesPagadas / kpis.comisionesTotal) * 100)
                    : 0}%
                </p>
                <p className="text-xs text-primary mt-1">
                  {formatCurrency(kpis.comisionesPagadas)} de {formatCurrency(kpis.comisionesTotal)}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};
