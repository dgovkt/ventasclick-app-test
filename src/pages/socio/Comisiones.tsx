import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import {
  DollarSign, CreditCard, FileText, CheckCircle, Clock,
  XCircle, AlertCircle, Calendar, Zap, RefreshCw,
} from 'lucide-react';

type TabType = 'resumen' | 'configurar' | 'solicitudes';

interface PaymentConfig {
  nombre_banco: string;
  clabe: string;
  numero_cuenta: string;
  beneficiario: string;
}

interface PaymentRequest {
  id: string;
  monto_solicitado: number;
  estatus: 'pendiente' | 'aprobada' | 'pagada' | 'rechazada';
  fecha_inicio: string;
  fecha_fin: string;
  comentarios_admin: string | null;
  created_at: string;
  solicitud_pago_ventas?: {
    venta_id: string;
    comision_calculada: number;
    ventas: {
      fecha_cierre: string;
      monto: number;
      leads: { nombre: string; apellidos: string } | null;
      planes: { nombre: string } | null;
    } | null;
  }[];
}

interface CommissionSummary {
  sin_procesar: number;
  pendiente: number;
  aprobada: number;
  pagada: number;
}

interface BiweeklyPeriod {
  corte: Date;
  pago: Date;
  inicio: Date;
  fin: Date;
}

const REFERENCE_WEDNESDAY = new Date('2025-01-01T12:00:00Z');

function getNextBiweeklyCuts(count = 6): BiweeklyPeriod[] {
  const today = new Date();
  const periods: BiweeklyPeriod[] = [];
  const MS_PER_DAY = 86400000;
  const diffMs = today.getTime() - REFERENCE_WEDNESDAY.getTime();
  const diffDays = Math.floor(diffMs / MS_PER_DAY);
  const periodsSinceRef = Math.floor(diffDays / 14);

  for (let i = -2; i < count; i++) {
    const periodIndex = periodsSinceRef + i;
    const corteMs = REFERENCE_WEDNESDAY.getTime() + periodIndex * 14 * MS_PER_DAY;
    const corte = new Date(corteMs);
    const pago = new Date(corteMs + 2 * MS_PER_DAY);
    const inicio = new Date(corteMs - 13 * MS_PER_DAY);
    const fin = corte;
    periods.push({ corte, pago, inicio, fin });
  }

  return periods.filter(p => p.corte >= new Date(today.getTime() - 60 * MS_PER_DAY));
}

function formatDateDisplay(d: Date) {
  return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });
}

const STATUS_LABELS: Record<string, string> = {
  pendiente: 'Pendiente',
  aprobada: 'Aprobada',
  pagada: 'Pagada',
  rechazada: 'Rechazada',
};

export const SocioComisiones = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('resumen');
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>({
    nombre_banco: '',
    clabe: '',
    numero_cuenta: '',
    beneficiario: '',
  });

  const [commissionSummary, setCommissionSummary] = useState<CommissionSummary>({
    sin_procesar: 0,
    pendiente: 0,
    aprobada: 0,
    pagada: 0,
  });

  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);

  useEffect(() => {
    if (user) {
      loadAll();
    }
  }, [user]);

  const loadAll = async () => {
    await Promise.allSettled([
      loadPaymentConfig(),
      loadCommissionSummary(),
      loadPaymentRequests(),
    ]);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadAll();
    setIsRefreshing(false);
  };

  const loadPaymentConfig = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('profiles')
      .select('nombre_banco, clabe, numero_cuenta, beneficiario')
      .eq('id', user.id)
      .maybeSingle();
    if (data) {
      setPaymentConfig({
        nombre_banco: data.nombre_banco || '',
        clabe: data.clabe || '',
        numero_cuenta: data.numero_cuenta || '',
        beneficiario: data.beneficiario || '',
      });
    }
  };

  const loadCommissionSummary = async () => {
    if (!user) return;

    const { data: solicitudes, error: solError } = await supabase
      .from('solicitudes_pago')
      .select('estatus, monto_solicitado')
      .eq('socio_id', user.id);

    if (solError) console.error('Error loading solicitudes:', solError);

    const { data: ventasPendientes } = await supabase
      .from('ventas')
      .select('comision_socio')
      .eq('socio_id', user.id)
      .eq('pagado_socio', false)
      .neq('estatus_pago', 'completado')
      .neq('estatus_pago', 'fallido');

    const fromSolicitudes = (solicitudes || []).reduce(
      (acc, sol) => {
        const monto = Number(sol.monto_solicitado) || 0;
        if (sol.estatus === 'pendiente') acc.pendiente += monto;
        if (sol.estatus === 'aprobada') acc.aprobada += monto;
        if (sol.estatus === 'pagada') acc.pagada += monto;
        return acc;
      },
      { pendiente: 0, aprobada: 0, pagada: 0 }
    );

    const sinProcesar = (ventasPendientes || []).reduce(
      (acc, v) => acc + (Number(v.comision_socio) || 0),
      0
    );

    setCommissionSummary({ sin_procesar: sinProcesar, ...fromSolicitudes });
  };

  const loadPaymentRequests = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('solicitudes_pago')
      .select(`
        id, monto_solicitado, estatus, fecha_inicio, fecha_fin,
        comentarios_admin, created_at,
        solicitud_pago_ventas (
          venta_id, comision_calculada,
          ventas ( fecha_cierre, monto, leads ( nombre, apellidos ), planes:planes!plan_id ( nombre ) )
        )
      `)
      .eq('socio_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setPaymentRequests(data as PaymentRequest[]);
  };

  const handleSavePaymentConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          nombre_banco: paymentConfig.nombre_banco,
          clabe: paymentConfig.clabe,
          numero_cuenta: paymentConfig.numero_cuenta,
          beneficiario: paymentConfig.beneficiario,
          payment_config_updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      if (error) throw error;
      alert('Configuracion guardada exitosamente');
    } catch (error) {
      console.error('Error saving payment config:', error);
      alert('Error al guardar la configuracion');
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendiente': return <Clock className="text-yellow-600" size={18} />;
      case 'aprobada': return <CheckCircle className="text-blue-600" size={18} />;
      case 'pagada': return <CheckCircle className="text-green-600" size={18} />;
      case 'rechazada': return <XCircle className="text-red-600" size={18} />;
      default: return <AlertCircle className="text-gray-600" size={18} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'aprobada': return 'bg-blue-100 text-blue-800';
      case 'pagada': return 'bg-green-100 text-green-800';
      case 'rechazada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const upcomingPeriods = getNextBiweeklyCuts(4).slice(-3);

  const renderResumen = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Resumen de Comisiones</h2>
        <p className="text-gray-600">Estado actual de tus comisiones</p>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
        <Zap size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-blue-800">
          Tus comisiones se generan <strong>automaticamente</strong> cuando cierras una venta con el wizard. Cada venta genera su propio pago individual que el administrador revisa y procesa. Solo asegurate de tener tus datos bancarios configurados.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Cierres por confirmar</p>
              <p className="text-2xl font-bold text-gray-900">
                ${commissionSummary.sin_procesar.toFixed(2)}
              </p>
              <p className="text-xs text-gray-400 mt-1">En espera de confirmacion de pago</p>
            </div>
            <div className="w-11 h-11 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle className="text-gray-500" size={20} />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-yellow-700 font-medium uppercase tracking-wide mb-1">En cobro</p>
              <p className="text-2xl font-bold text-gray-900">
                ${commissionSummary.pendiente.toFixed(2)}
              </p>
              <p className="text-xs text-yellow-600 mt-1">Solicitud generada</p>
            </div>
            <div className="w-11 h-11 bg-yellow-200 rounded-full flex items-center justify-center flex-shrink-0">
              <Clock className="text-yellow-700" size={20} />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-700 font-medium uppercase tracking-wide mb-1">Aprobadas</p>
              <p className="text-2xl font-bold text-gray-900">
                ${commissionSummary.aprobada.toFixed(2)}
              </p>
              <p className="text-xs text-blue-600 mt-1">Proximo deposito</p>
            </div>
            <div className="w-11 h-11 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="text-blue-700" size={20} />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-green-700 font-medium uppercase tracking-wide mb-1">Pagadas</p>
              <p className="text-2xl font-bold text-gray-900">
                ${commissionSummary.pagada.toFixed(2)}
              </p>
              <p className="text-xs text-green-600 mt-1">Total acumulado</p>
            </div>
            <div className="w-11 h-11 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0">
              <DollarSign className="text-green-700" size={20} />
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="text-blue-600" size={22} />
          <h3 className="text-lg font-semibold text-gray-900">Proximos periodos de pago</h3>
        </div>
        <p className="text-sm text-gray-600 mb-5">
          Corte cada dos <strong>miercoles</strong> — deposito el <strong>viernes</strong> de la misma semana.
        </p>
        <div className="space-y-3">
          {upcomingPeriods.map((p, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 p-4 rounded-xl border border-gray-100 bg-gray-50">
              <div className="flex-1">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-0.5">Periodo</p>
                <p className="text-sm font-semibold text-gray-800">
                  {formatDateDisplay(p.inicio)} — {formatDateDisplay(p.fin)}
                </p>
              </div>
              <div className="sm:text-center px-4">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-0.5">Corte</p>
                <p className="text-sm font-semibold text-gray-800">Mierc. {formatDateDisplay(p.corte)}</p>
              </div>
              <div className="sm:text-right">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-0.5">Deposito</p>
                <p className="text-sm font-bold text-green-700">Viern. {formatDateDisplay(p.pago)}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-4">
          * Las fechas pueden ajustarse si coinciden con dias festivos.
        </p>
      </Card>
    </div>
  );

  const renderConfigurar = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Configuracion de Pago</h2>
        <p className="text-gray-600">Configura tus datos bancarios para recibir tus comisiones</p>
      </div>

      <Card>
        <form onSubmit={handleSavePaymentConfig} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Banco</label>
            <input
              type="text"
              value={paymentConfig.nombre_banco}
              onChange={(e) => setPaymentConfig({ ...paymentConfig, nombre_banco: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej. BBVA, Santander, Banorte"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">CLABE Interbancaria</label>
            <input
              type="text"
              value={paymentConfig.clabe}
              onChange={(e) => setPaymentConfig({ ...paymentConfig, clabe: e.target.value.replace(/\D/g, '').slice(0, 18) })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
              placeholder="18 digitos"
              maxLength={18}
              required
            />
            <p className="text-sm text-gray-500 mt-1">La CLABE debe tener exactamente 18 digitos</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Numero de Cuenta</label>
            <input
              type="text"
              value={paymentConfig.numero_cuenta}
              onChange={(e) => setPaymentConfig({ ...paymentConfig, numero_cuenta: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Numero de cuenta"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Beneficiario</label>
            <input
              type="text"
              value={paymentConfig.beneficiario}
              onChange={(e) => setPaymentConfig({ ...paymentConfig, beneficiario: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nombre completo del titular"
              required
            />
          </div>

          <div className="p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
            Las comisiones se depositan automaticamente cada dos semanas: corte cada dos miercoles y deposito el viernes de esa misma semana.
          </div>

          <div className="pt-2">
            <Button type="submit" disabled={isSaving} size="lg" fullWidth>
              {isSaving ? 'Guardando...' : 'Guardar Configuracion'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );

  const renderSolicitudes = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Historial de Cobros</h2>
        <p className="text-gray-600">Cada venta genera su propio pago individual</p>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
        <Zap size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-blue-800">
          Cada vez que el administrador confirma una venta, se genera automaticamente tu solicitud de cobro individual. El administrador la revisa y procesa el pago.
        </p>
      </div>

      {paymentRequests.length === 0 ? (
        <Card>
          <div className="text-center py-16">
            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium mb-1">Sin solicitudes de cobro aun</p>
            <p className="text-sm text-gray-400">Apareceran aqui automaticamente cuando tengas ventas completadas</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {paymentRequests.map((request) => {
            const venta = request.solicitud_pago_ventas?.[0]?.ventas;
            const clientName = venta?.leads
              ? `${venta.leads.nombre} ${venta.leads.apellidos}`
              : '-';
            const planName = venta?.planes?.nombre || '-';

            return (
              <div
                key={request.id}
                className="p-4 border border-gray-200 rounded-xl bg-white"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      {getStatusIcon(request.estatus)}
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.estatus)}`}>
                        {STATUS_LABELS[request.estatus] || request.estatus}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(request.created_at).toLocaleDateString('es-MX')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Cliente</p>
                        <p className="text-sm font-semibold text-gray-900">{clientName}</p>
                        {planName !== '-' && (
                          <p className="text-xs text-gray-500">Plan: {planName}</p>
                        )}
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Comision</p>
                        <p className="text-lg font-bold text-gray-900">
                          ${parseFloat(request.monto_solicitado.toString()).toFixed(2)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Fecha cierre</p>
                        <p className="text-sm text-gray-900">
                          {venta?.fecha_cierre
                            ? new Date(venta.fecha_cierre).toLocaleDateString('es-MX')
                            : '-'}
                        </p>
                      </div>
                    </div>

                    {request.comentarios_admin && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs font-semibold text-blue-900 mb-1">Comentarios del administrador:</p>
                        <p className="text-sm text-blue-800">{request.comentarios_admin}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mis Comisiones</h1>
            <p className="text-gray-600 mt-2">Pagos catorcenales — corte miercoles, deposito viernes</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            Actualizar
          </button>
        </div>

        <div className="border-b border-gray-200">
          <nav className="flex gap-8">
            {([
              { key: 'resumen', icon: <DollarSign size={20} />, label: 'Resumen' },
              { key: 'configurar', icon: <CreditCard size={20} />, label: 'Configurar Pago' },
              { key: 'solicitudes', icon: <FileText size={20} />, label: 'Historial de Cobros' },
            ] as { key: TabType; icon: React.ReactNode; label: string }[]).map(({ key, icon, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`pb-4 px-2 border-b-2 font-medium transition ${
                  activeTab === key
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  {icon}
                  {label}
                </div>
              </button>
            ))}
          </nav>
        </div>

        <div>
          {activeTab === 'resumen' && renderResumen()}
          {activeTab === 'configurar' && renderConfigurar()}
          {activeTab === 'solicitudes' && renderSolicitudes()}
        </div>
      </div>
    </DashboardLayout>
  );
};
