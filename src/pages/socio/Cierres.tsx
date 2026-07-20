import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Plus, DollarSign, TrendingUp, CheckCircle, Clock, User, Package, X, Calendar, BadgeCheck } from 'lucide-react';
import EvidenciasThumbnails from '../../components/EvidenciasThumbnails';

interface Evidencia {
  id: string;
  foto_url: string;
  tipo: string;
  created_at: string;
}

interface Venta {
  id: string;
  lead_id: string;
  plan_id: string;
  monto: number;
  fecha: string;
  estatus_pago: 'pendiente' | 'pagado' | 'completado';
  fecha_cierre: string | null;
  notas: string | null;
  comision_socio: number | null;
  evidencias_ventas?: Evidencia[];
  leads: {
    nombre: string;
    apellidos: string;
    email: string;
    telefono: string;
  };
  planes: {
    nombre: string;
    precio_anual: number;
  };
}

interface Lead {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  que_vende: string;
}

interface Plan {
  id: string;
  nombre: string;
  precio_anual: number;
  comision_socio: number;
  porcentaje_comision: number;
}

export const SocioCierres = () => {
  const { user } = useAuth();
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filterEstado, setFilterEstado] = useState<string>('todos');

  useEffect(() => {
    if (user) {
      loadVentas();
      loadLeads();
      loadPlanes();
    }
  }, [user]);

  const loadVentas = async () => {
    if (!user) return;

    setIsLoading(true);
    const { data, error } = await supabase
      .from('ventas')
      .select(`
        id,
        lead_id,
        plan_id,
        monto,
        fecha,
        estatus_pago,
        fecha_cierre,
        notas,
        comision_socio,
        evidencias_ventas (
          id,
          foto_url,
          tipo,
          created_at
        ),
        leads (
          nombre,
          apellidos,
          email,
          telefono
        ),
        planes (
          nombre,
          precio_anual
        )
      `)
      .eq('socio_id', user.id)
      .order('fecha', { ascending: false });

    if (data) {
      setVentas(data);
    }
    setIsLoading(false);
  };

  const loadLeads = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('leads')
      .select('id, nombre, apellidos, email, que_vende')
      .eq('socio_id', user.id)
      .eq('estado', 'cerrado_ganado')
      .order('nombre');

    if (data) {
      setLeads(data);
    }
  };

  const loadPlanes = async () => {
    const { data } = await supabase
      .from('planes')
      .select('id, nombre, precio_anual, comision_socio, porcentaje_comision')
      .eq('activo', true)
      .order('precio_anual');

    if (data) {
      setPlanes(data);
    }
  };

  const filteredVentas = filterEstado === 'todos'
    ? ventas
    : filterEstado === 'pagado'
      ? ventas.filter(venta => venta.estatus_pago === 'pagado' || venta.estatus_pago === 'completado')
      : ventas.filter(venta => venta.estatus_pago === filterEstado);

  const stats = {
    total: ventas.length,
    pendientes: ventas.filter(v => v.estatus_pago === 'pendiente').length,
    pagadas: ventas.filter(v => v.estatus_pago === 'pagado' || v.estatus_pago === 'completado').length,
    montoTotal: ventas.reduce((sum, v) => sum + v.monto, 0),
    montoPendiente: ventas.filter(v => v.estatus_pago === 'pendiente').reduce((sum, v) => sum + v.monto, 0),
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  const marcarComoPagado = async (ventaId: string) => {
    const { error } = await supabase
      .from('ventas')
      .update({ estatus_pago: 'pagado', fecha_cierre: new Date().toISOString().split('T')[0] })
      .eq('id', ventaId);

    if (!error) {
      loadVentas();
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mis Cierres</h1>
            <p className="text-gray-600 mt-2">Registra tus ventas cerradas</p>
          </div>
          <Button onClick={() => setShowModal(true)} className="bg-primary hover:bg-primary-dark">
            <Plus className="w-5 h-5 mr-2" />
            Registrar Venta
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-primary-light to-primary-light border-primary-light">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-primary-dark font-medium">Total Ventas</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                <CheckCircle className="text-primary-dark" size={24} />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-medium">Monto Total</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(stats.montoTotal)}</p>
              </div>
              <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                <DollarSign className="text-blue-700" size={24} />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-700 font-medium">Pendientes</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.pendientes}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center">
                <Clock className="text-yellow-700" size={24} />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 font-medium">Por Cobrar</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{formatCurrency(stats.montoPendiente)}</p>
              </div>
              <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                <TrendingUp className="text-purple-700" size={24} />
              </div>
            </div>
          </Card>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilterEstado('todos')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
              filterEstado === 'todos'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todas ({ventas.length})
          </button>
          <button
            onClick={() => setFilterEstado('pendiente')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
              filterEstado === 'pendiente'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pendientes ({stats.pendientes})
          </button>
          <button
            onClick={() => setFilterEstado('pagado')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
              filterEstado === 'pagado'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pagadas ({stats.pagadas})
          </button>
        </div>

        {isLoading ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-500">Cargando ventas...</p>
            </div>
          </Card>
        ) : filteredVentas.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <CheckCircle size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 mb-4">
                {filterEstado === 'todos'
                  ? 'No tienes ventas registradas'
                  : `No tienes ventas ${filterEstado === 'pendiente' ? 'pendientes' : 'pagadas'}`}
              </p>
              {filterEstado === 'todos' && (
                <Button onClick={() => setShowModal(true)} className="bg-primary hover:bg-primary-dark">
                  <Plus className="w-5 h-5 mr-2" />
                  Registrar primera venta
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredVentas.map((venta) => (
              <Card key={venta.id} className="hover:shadow-lg transition">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <User size={18} className="text-gray-400" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          {venta.leads ? `${venta.leads.nombre} ${venta.leads.apellidos}` : 'Sin nombre'}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Package size={16} className="text-gray-400" />
                        <p className="text-sm text-gray-600">{venta.planes?.nombre ?? '—'}</p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        venta.estatus_pago === 'pagado' || venta.estatus_pago === 'completado'
                          ? 'bg-primary-light text-primary-dark border-primary-light'
                          : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                      }`}
                    >
                      {venta.estatus_pago === 'pagado' || venta.estatus_pago === 'completado' ? 'Pagado' : 'Pendiente'}
                    </span>
                  </div>

                  <div className="bg-gradient-to-r from-primary-light to-primary-light border border-primary-light rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Monto de Venta</span>
                      <span className="text-2xl font-bold text-primary-dark">
                        {formatCurrency(venta.monto)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={16} />
                      <span>Fecha de venta: {new Date(venta.fecha).toLocaleDateString('es-MX')}</span>
                    </div>
                    {venta.fecha_cierre && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <CheckCircle size={16} className="text-primary" />
                        <span>Cerrado el: {new Date(venta.fecha_cierre).toLocaleDateString('es-MX')}</span>
                      </div>
                    )}
                  </div>

                  {venta.comision_socio && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-700 font-medium">Tu comisión:</span>
                        <span className="text-lg font-bold text-blue-900">
                          {formatCurrency(venta.comision_socio)}
                        </span>
                      </div>
                    </div>
                  )}

                  {venta.evidencias_ventas && venta.evidencias_ventas.length > 0 && (
                    <div className="pt-2 border-t border-gray-100">
                      <EvidenciasThumbnails evidencias={venta.evidencias_ventas} />
                    </div>
                  )}

                  {venta.notas && (
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-sm text-gray-600">{venta.notas}</p>
                    </div>
                  )}

                  {venta.leads && (
                    <div className="pt-2 border-t border-gray-200 text-xs text-gray-500">
                      <p>Cliente: {venta.leads.email} • {venta.leads.telefono}</p>
                    </div>
                  )}

                  {venta.estatus_pago === 'pendiente' && (
                    <div className="pt-3 border-t border-gray-200">
                      <button
                        onClick={() => marcarComoPagado(venta.id)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition"
                      >
                        <BadgeCheck size={16} />
                        Marcar como pagado
                      </button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <VentaModal
          leads={leads}
          planes={planes}
          onClose={() => setShowModal(false)}
          onSave={() => { setShowModal(false); loadVentas(); }}
        />
      )}
    </DashboardLayout>
  );
};

interface VentaModalProps {
  leads: Lead[];
  planes: Plan[];
  onClose: () => void;
  onSave: () => void;
}

const VentaModal = ({ leads, planes, onClose, onSave }: VentaModalProps) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    lead_id: '',
    plan_id: '',
    monto: '',
    fecha: new Date().toISOString().split('T')[0],
    notas: '',
  });

  const selectedPlan = planes.find(p => p.id === formData.plan_id);

  useEffect(() => {
    if (selectedPlan) {
      setFormData(prev => ({ ...prev, monto: selectedPlan.precio_anual.toString() }));
    }
  }, [formData.plan_id, selectedPlan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);

    try {
      const monto = parseFloat(formData.monto);
      const comision = selectedPlan ? (selectedPlan.precio_anual * selectedPlan.porcentaje_comision) / 100 : 0;

      const { error: ventaError } = await supabase
        .from('ventas')
        .insert({
          socio_id: user.id,
          lead_id: formData.lead_id,
          plan_id: formData.plan_id,
          monto: monto,
          fecha: formData.fecha,
          estatus_pago: 'pendiente',
          comision_socio: comision,
          notas: formData.notas || null,
        });

      if (ventaError) throw ventaError;

      const { error: leadError } = await supabase
        .from('leads')
        .update({ estado: 'cerrado_ganado' })
        .eq('id', formData.lead_id);

      if (leadError) console.error('Error updating lead:', leadError);

      alert('Venta registrada exitosamente');
      onSave();
    } catch (error) {
      console.error('Error saving venta:', error);
      alert('Error al registrar la venta');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">Registrar Venta</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cliente / Lead *
            </label>
            <select
              value={formData.lead_id}
              onChange={(e) => setFormData({ ...formData, lead_id: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            >
              <option value="">Selecciona un cliente</option>
              {leads.map((lead) => (
                <option key={lead.id} value={lead.id}>
                  {lead.nombre} {lead.apellidos} - {lead.que_vende}
                </option>
              ))}
            </select>
            {leads.length === 0 && (
              <p className="text-sm text-amber-600 mt-1">
                No tienes leads con estado "Cerrado Ganado". Primero debes marcar un lead como ganado.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plan Vendido *
            </label>
            <select
              value={formData.plan_id}
              onChange={(e) => setFormData({ ...formData, plan_id: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            >
              <option value="">Selecciona un plan</option>
              {planes.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.nombre} - {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(plan.precio_anual)}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monto de Venta *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.monto}
                  onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Venta *
              </label>
              <input
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas
            </label>
            <textarea
              value={formData.notas}
              onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={3}
              placeholder="Detalles adicionales sobre la venta..."
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              fullWidth
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              fullWidth
              className="bg-primary hover:bg-primary-dark"
            >
              {isSubmitting ? 'Registrando...' : 'Registrar Venta'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
