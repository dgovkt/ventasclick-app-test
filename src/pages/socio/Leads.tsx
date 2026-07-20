import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Plus, Mail, Phone, User, TrendingUp, CreditCard as Edit2, Eye, X } from 'lucide-react';

interface Lead {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  que_vende: string;
  estado: 'nuevo' | 'en_seguimiento' | 'cerrado_ganado' | 'cerrado_perdido';
  origen: 'wizard' | 'manual' | 'otro';
  notas: string | null;
  fecha_creacion: string;
  plan_recomendado_id: string | null;
  planes: {
    nombre: string;
  } | null;
}

interface Plan {
  id: string;
  nombre: string;
  precio_anual: number;
}

export const SocioLeads = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [filterEstado, setFilterEstado] = useState<string>('todos');

  useEffect(() => {
    if (user) {
      loadLeads();
      loadPlanes();
    }
  }, [user]);

  const loadLeads = async () => {
    if (!user) return;

    setIsLoading(true);
    const { data, error } = await supabase
      .from('leads')
      .select(`
        *,
        planes:plan_recomendado_id (nombre)
      `)
      .eq('socio_id', user.id)
      .order('fecha_creacion', { ascending: false });

    if (data) {
      setLeads(data);
    }
    setIsLoading(false);
  };

  const loadPlanes = async () => {
    const { data } = await supabase
      .from('planes')
      .select('id, nombre, precio_anual')
      .eq('activo', true);

    if (data) {
      setPlanes(data);
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'nuevo':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'en_seguimiento':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cerrado_ganado':
        return 'bg-primary-light text-primary-dark border-primary-light';
      case 'cerrado_perdido':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEstadoLabel = (estado: string) => {
    switch (estado) {
      case 'nuevo':
        return 'Nuevo';
      case 'en_seguimiento':
        return 'En Seguimiento';
      case 'cerrado_ganado':
        return 'Ganado';
      case 'cerrado_perdido':
        return 'Perdido';
      default:
        return estado;
    }
  };

  const filteredLeads = filterEstado === 'todos'
    ? leads
    : leads.filter(lead => lead.estado === filterEstado);

  const stats = {
    total: leads.length,
    nuevos: leads.filter(l => l.estado === 'nuevo').length,
    seguimiento: leads.filter(l => l.estado === 'en_seguimiento').length,
    ganados: leads.filter(l => l.estado === 'cerrado_ganado').length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bills</h1>
            <p className="text-gray-600 mt-2">Gestiona tus prospectos</p>
          </div>
          <Button onClick={() => { setSelectedLead(null); setShowModal(true); }}>
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Lead
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-medium">Total Leads</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                <User className="text-blue-700" size={24} />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 font-medium">Nuevos</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.nuevos}</p>
              </div>
              <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                <TrendingUp className="text-purple-700" size={24} />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-700 font-medium">En Seguimiento</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.seguimiento}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center">
                <Eye className="text-yellow-700" size={24} />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-primary-light to-primary-light border-primary-light">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-primary-dark font-medium">Ganados</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.ganados}</p>
              </div>
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                <TrendingUp className="text-primary-dark" size={24} />
              </div>
            </div>
          </Card>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilterEstado('todos')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
              filterEstado === 'todos'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos ({leads.length})
          </button>
          <button
            onClick={() => setFilterEstado('nuevo')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
              filterEstado === 'nuevo'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Nuevos ({stats.nuevos})
          </button>
          <button
            onClick={() => setFilterEstado('en_seguimiento')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
              filterEstado === 'en_seguimiento'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            En Seguimiento ({stats.seguimiento})
          </button>
          <button
            onClick={() => setFilterEstado('cerrado_ganado')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
              filterEstado === 'cerrado_ganado'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Ganados ({stats.ganados})
          </button>
        </div>

        {isLoading ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-500">Cargando leads...</p>
            </div>
          </Card>
        ) : filteredLeads.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <User size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 mb-4">
                {filterEstado === 'todos'
                  ? 'No tienes leads registrados'
                  : `No tienes leads con estado "${getEstadoLabel(filterEstado)}"`}
              </p>
              {filterEstado === 'todos' && (
                <Button onClick={() => { setSelectedLead(null); setShowModal(true); }}>
                  <Plus className="w-5 h-5 mr-2" />
                  Crear primer lead
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLeads.map((lead) => (
              <Card key={lead.id} className="hover:shadow-lg transition">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {lead.nombre} {lead.apellidos}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{lead.que_vende}</p>
                    </div>
                    <button
                      onClick={() => { setSelectedLead(lead); setShowModal(true); }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                      <Edit2 size={18} className="text-gray-600" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail size={16} />
                      <span className="truncate">{lead.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone size={16} />
                      <span>{lead.telefono}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getEstadoColor(lead.estado)}`}>
                        {getEstadoLabel(lead.estado)}
                      </span>
                      {lead.origen === 'wizard' && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                          Wizard
                        </span>
                      )}
                    </div>
                    {lead.planes && (
                      <span className="text-xs text-gray-500">{lead.planes.nombre}</span>
                    )}
                  </div>

                  {lead.notas && (
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-sm text-gray-600 line-clamp-2">{lead.notas}</p>
                    </div>
                  )}

                  <div className="text-xs text-gray-500">
                    Creado: {new Date(lead.fecha_creacion).toLocaleDateString('es-MX')}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <LeadModal
          lead={selectedLead}
          planes={planes}
          onClose={() => { setShowModal(false); setSelectedLead(null); }}
          onSave={() => { setShowModal(false); setSelectedLead(null); loadLeads(); }}
        />
      )}
    </DashboardLayout>
  );
};

interface LeadModalProps {
  lead: Lead | null;
  planes: Plan[];
  onClose: () => void;
  onSave: () => void;
}

const LeadModal = ({ lead, planes, onClose, onSave }: LeadModalProps) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nombre: lead?.nombre || '',
    apellidos: lead?.apellidos || '',
    email: lead?.email || '',
    telefono: lead?.telefono || '',
    que_vende: lead?.que_vende || '',
    plan_recomendado_id: lead?.plan_recomendado_id || '',
    estado: lead?.estado || 'nuevo',
    notas: lead?.notas || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);

    try {
      if (lead) {
        const { error } = await supabase
          .from('leads')
          .update({
            ...formData,
            plan_recomendado_id: formData.plan_recomendado_id || null,
            fecha_ultima_actualizacion: new Date().toISOString(),
          })
          .eq('id', lead.id);

        if (error) throw error;
        alert('Lead actualizado exitosamente');
      } else {
        const { error } = await supabase
          .from('leads')
          .insert({
            socio_id: user.id,
            ...formData,
            plan_recomendado_id: formData.plan_recomendado_id || null,
            origen: 'manual',
          });

        if (error) throw error;
        alert('Lead creado exitosamente');
      }
      onSave();
    } catch (error) {
      console.error('Error saving lead:', error);
      alert('Error al guardar el lead');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">
            {lead ? 'Editar Lead' : 'Nuevo Lead'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre *
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Apellidos *
              </label>
              <input
                type="text"
                value={formData.apellidos}
                onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono *
              </label>
              <input
                type="tel"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ¿Qué vende? *
            </label>
            <input
              type="text"
              value={formData.que_vende}
              onChange={(e) => setFormData({ ...formData, que_vende: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej. Ropa, Electrónicos, Servicios"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plan Recomendado
              </label>
              <select
                value={formData.plan_recomendado_id}
                onChange={(e) => setFormData({ ...formData, plan_recomendado_id: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sin plan</option>
                {planes.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado *
              </label>
              <select
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value as any })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="nuevo">Nuevo</option>
                <option value="en_seguimiento">En Seguimiento</option>
                <option value="cerrado_ganado">Cerrado Ganado</option>
                <option value="cerrado_perdido">Cerrado Perdido</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas
            </label>
            <textarea
              value={formData.notas}
              onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="Añade notas sobre este lead..."
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
            >
              {isSubmitting ? 'Guardando...' : (lead ? 'Actualizar Lead' : 'Crear Lead')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
