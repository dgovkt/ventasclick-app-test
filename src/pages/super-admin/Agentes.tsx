import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { UserCheck, TrendingUp, TrendingDown, Award, DollarSign, Target, Users, Ban, CheckCircle, X, Eye } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

interface AgentMetrics {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string | null;
  activo: boolean;
  fecha_registro: string;
  total_leads: number;
  total_ventas: number;
  comisiones_generadas: number;
  tasa_conversion: number;
  leads_mes_actual: number;
  ventas_mes_actual: number;
}

interface AgentDetail {
  agent: AgentMetrics;
  recentLeads: any[];
  recentVentas: any[];
}

type RankingType = 'ventas' | 'comisiones' | 'conversion';
type TimeFilter = 'todos' | 'mes_actual' | 'trimestre';

export default function Agentes() {
  const [agents, setAgents] = useState<AgentMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'activos' | 'inactivos'>('activos');
  const [rankingType, setRankingType] = useState<RankingType>('ventas');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('todos');
  const [selectedAgent, setSelectedAgent] = useState<AgentDetail | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadAgents();
  }, [timeFilter]);

  async function loadAgents() {
    try {
      setLoading(true);

      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1).toISOString();

      let leadsQuery = supabase
        .from('leads')
        .select('socio_id, created_at:fecha_creacion');

      let ventasQuery = supabase
        .from('ventas')
        .select('socio_id, comision_socio, created_at');

      if (timeFilter === 'mes_actual') {
        leadsQuery = leadsQuery.gte('fecha_creacion', firstDayOfMonth);
        ventasQuery = ventasQuery.gte('created_at', firstDayOfMonth);
      } else if (timeFilter === 'trimestre') {
        leadsQuery = leadsQuery.gte('fecha_creacion', threeMonthsAgo);
        ventasQuery = ventasQuery.gte('created_at', threeMonthsAgo);
      }

      const [profilesRes, leadsRes, ventasRes, leadsMonthRes, ventasMonthRes] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, nombre, apellido, email, telefono, activo, fecha_registro')
          .eq('rol', 'socio')
          .order('created_at', { ascending: false }),
        leadsQuery,
        ventasQuery,
        supabase
          .from('leads')
          .select('socio_id')
          .gte('fecha_creacion', firstDayOfMonth),
        supabase
          .from('ventas')
          .select('socio_id')
          .gte('created_at', firstDayOfMonth)
      ]);

      if (profilesRes.error) throw profilesRes.error;

      const profiles = profilesRes.data || [];
      const leads = leadsRes.data || [];
      const ventas = ventasRes.data || [];
      const leadsMonth = leadsMonthRes.data || [];
      const ventasMonth = ventasMonthRes.data || [];

      const agentsWithMetrics: AgentMetrics[] = profiles.map(profile => {
        const agentLeads = leads.filter(l => l.socio_id === profile.id);
        const agentVentas = ventas.filter(v => v.socio_id === profile.id);
        const agentLeadsMonth = leadsMonth.filter(l => l.socio_id === profile.id);
        const agentVentasMonth = ventasMonth.filter(v => v.socio_id === profile.id);

        const totalLeads = agentLeads.length;
        const totalVentas = agentVentas.length;
        const comisionesGeneradas = agentVentas.reduce((sum, v) => sum + (Number(v.comision_socio) || 0), 0);
        const tasaConversion = totalLeads > 0 ? (totalVentas / totalLeads) * 100 : 0;

        return {
          id: profile.id,
          nombre: profile.nombre,
          apellido: profile.apellido,
          email: profile.email || '',
          telefono: profile.telefono,
          activo: profile.activo,
          fecha_registro: profile.fecha_registro,
          total_leads: totalLeads,
          total_ventas: totalVentas,
          comisiones_generadas: comisionesGeneradas,
          tasa_conversion: tasaConversion,
          leads_mes_actual: agentLeadsMonth.length,
          ventas_mes_actual: agentVentasMonth.length,
        };
      });

      setAgents(agentsWithMetrics);
    } catch (error) {
      console.error('Error loading agents:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleActive(agentId: string, currentStatus: boolean) {
    const confirmMessage = currentStatus
      ? '¿Estás seguro de que deseas desactivar este agente? No podrá acceder al sistema.'
      : '¿Deseas activar este agente?';

    if (!confirm(confirmMessage)) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ activo: !currentStatus })
        .eq('id', agentId);

      if (error) throw error;

      alert(currentStatus ? 'Agente desactivado exitosamente' : 'Agente activado exitosamente');
      loadAgents();
    } catch (error) {
      console.error('Error updating agent status:', error);
      alert('Error al cambiar el estado del agente');
    }
  }

  async function loadAgentDetail(agent: AgentMetrics) {
    try {
      const [leadsRes, ventasRes] = await Promise.all([
        supabase
          .from('leads')
          .select('id, nombre, apellidos, email, estado, fecha_creacion')
          .eq('socio_id', agent.id)
          .order('fecha_creacion', { ascending: false })
          .limit(10),
        supabase
          .from('ventas')
          .select('id, monto, comision_socio, estatus_pago, fecha, planes(nombre)')
          .eq('socio_id', agent.id)
          .order('fecha', { ascending: false })
          .limit(10)
      ]);

      setSelectedAgent({
        agent,
        recentLeads: leadsRes.data || [],
        recentVentas: ventasRes.data || [],
      });
      setShowDetailModal(true);
    } catch (error) {
      console.error('Error loading agent detail:', error);
      alert('Error al cargar los detalles del agente');
    }
  }

  const filteredAgents = agents.filter(agent => {
    const matchesSearch =
      agent.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'todos' ||
      (statusFilter === 'activos' && agent.activo) ||
      (statusFilter === 'inactivos' && !agent.activo);

    return matchesSearch && matchesStatus;
  });

  const sortedAgents = [...filteredAgents].sort((a, b) => {
    switch (rankingType) {
      case 'ventas':
        return b.total_ventas - a.total_ventas;
      case 'comisiones':
        return b.comisiones_generadas - a.comisiones_generadas;
      case 'conversion':
        return b.tasa_conversion - a.tasa_conversion;
      default:
        return 0;
    }
  });

  const topAgents = sortedAgents.slice(0, 3);

  const stats = {
    totalAgentes: agents.length,
    agentesActivos: agents.filter(a => a.activo).length,
    totalVentas: agents.reduce((sum, a) => sum + a.total_ventas, 0),
    totalComisiones: agents.reduce((sum, a) => sum + a.comisiones_generadas, 0),
  };

  function getPerformanceBadge(agent: AgentMetrics) {
    if (agent.tasa_conversion >= 50) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Excelente</span>;
    } else if (agent.tasa_conversion >= 30) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Bueno</span>;
    } else if (agent.tasa_conversion >= 15) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Regular</span>;
    } else {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">En desarrollo</span>;
    }
  }

  function getTrendIcon(current: number, previous: number) {
    if (current > previous) {
      return <TrendingUp className="w-4 h-4 text-green-600" />;
    } else if (current < previous) {
      return <TrendingDown className="w-4 h-4 text-red-600" />;
    }
    return null;
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Cargando agentes...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Agentes</h1>
          <p className="text-gray-600 mt-2">Administra y monitorea el desempeño de tus socios comerciales</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Agentes</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalAgentes}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Agentes Activos</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.agentesActivos}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ventas Totales</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalVentas}</p>
              </div>
              <div className="p-3 bg-primary-light rounded-lg">
                <Target className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Comisiones Generadas</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ${stats.totalComisiones.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="w-6 h-6 text-yellow-500" />
            Top 3 Agentes
          </h2>
          <div className="space-y-3 mb-4">
            <div className="flex gap-2">
              <button
                onClick={() => setRankingType('ventas')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  rankingType === 'ventas'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Por Ventas
              </button>
              <button
                onClick={() => setRankingType('comisiones')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  rankingType === 'comisiones'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Por Comisiones
              </button>
              <button
                onClick={() => setRankingType('conversion')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  rankingType === 'conversion'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Por Conversión
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topAgents.map((agent, index) => (
              <div
                key={agent.id}
                className={`p-4 rounded-lg border-2 ${
                  index === 0
                    ? 'border-yellow-400 bg-yellow-50'
                    : index === 1
                    ? 'border-gray-400 bg-gray-50'
                    : 'border-orange-400 bg-orange-50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">#{index + 1}</span>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {agent.nombre} {agent.apellido}
                        </p>
                        <p className="text-xs text-gray-600">{agent.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ventas:</span>
                    <span className="font-semibold">{agent.total_ventas}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Comisiones:</span>
                    <span className="font-semibold">
                      ${agent.comisiones_generadas.toLocaleString('es-MX')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Conversión:</span>
                    <span className="font-semibold">{agent.tasa_conversion.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="todos">Todos los estados</option>
                <option value="activos">Activos</option>
                <option value="inactivos">Inactivos</option>
              </select>
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="todos">Histórico completo</option>
                <option value="mes_actual">Mes actual</option>
                <option value="trimestre">Último trimestre</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Agente</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Contacto</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Leads</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Ventas</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Conversión</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Comisiones</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Estado</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {sortedAgents.map((agent) => (
                  <tr key={agent.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {agent.nombre} {agent.apellido}
                        </p>
                        {getPerformanceBadge(agent)}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-gray-900">{agent.email}</p>
                      {agent.telefono && (
                        <p className="text-xs text-gray-500">{agent.telefono}</p>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="font-medium">{agent.total_leads}</span>
                        {agent.leads_mes_actual > 0 && (
                          <span className="text-xs text-gray-500">
                            (+{agent.leads_mes_actual})
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="font-medium">{agent.total_ventas}</span>
                        {agent.ventas_mes_actual > 0 && (
                          <span className="text-xs text-gray-500">
                            (+{agent.ventas_mes_actual})
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-semibold text-gray-900">
                        {agent.tasa_conversion.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-semibold text-gray-900">
                        ${agent.comisiones_generadas.toLocaleString('es-MX', {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {agent.activo ? (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Activo
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => loadAgentDetail(agent)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleActive(agent.id, agent.activo)}
                          className={`p-1 rounded ${
                            agent.activo
                              ? 'text-red-600 hover:bg-red-50'
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={agent.activo ? 'Desactivar' : 'Activar'}
                        >
                          {agent.activo ? (
                            <Ban className="w-4 h-4" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {sortedAgents.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No se encontraron agentes con los filtros aplicados
            </div>
          )}
        </Card>
      </div>

      {showDetailModal && selectedAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedAgent.agent.nombre} {selectedAgent.agent.apellido}
                </h2>
                <p className="text-gray-600">{selectedAgent.agent.email}</p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total Leads</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {selectedAgent.agent.total_leads}
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Ventas Cerradas</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {selectedAgent.agent.total_ventas}
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-gray-600">Tasa Conversión</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {selectedAgent.agent.tasa_conversion.toFixed(1)}%
                  </p>
                </div>
                <div className="p-4 bg-primary-light rounded-lg">
                  <p className="text-sm text-gray-600">Comisiones</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${selectedAgent.agent.comisiones_generadas.toLocaleString('es-MX')}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Últimos Leads (10 más recientes)
                </h3>
                {selectedAgent.recentLeads.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 px-3 font-semibold text-gray-700">Nombre</th>
                          <th className="text-left py-2 px-3 font-semibold text-gray-700">Email</th>
                          <th className="text-center py-2 px-3 font-semibold text-gray-700">Estado</th>
                          <th className="text-left py-2 px-3 font-semibold text-gray-700">Fecha</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedAgent.recentLeads.map((lead) => (
                          <tr key={lead.id} className="border-b border-gray-100">
                            <td className="py-2 px-3">{lead.nombre} {lead.apellidos}</td>
                            <td className="py-2 px-3">{lead.email}</td>
                            <td className="py-2 px-3 text-center">
                              <span className="px-2 py-1 text-xs rounded-full bg-gray-100">
                                {lead.estado}
                              </span>
                            </td>
                            <td className="py-2 px-3">
                              {new Date(lead.fecha_creacion).toLocaleDateString('es-MX')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No hay leads registrados</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Últimas Ventas (10 más recientes)
                </h3>
                {selectedAgent.recentVentas.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 px-3 font-semibold text-gray-700">Plan</th>
                          <th className="text-right py-2 px-3 font-semibold text-gray-700">Monto</th>
                          <th className="text-right py-2 px-3 font-semibold text-gray-700">Comisión</th>
                          <th className="text-center py-2 px-3 font-semibold text-gray-700">Estado</th>
                          <th className="text-left py-2 px-3 font-semibold text-gray-700">Fecha</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedAgent.recentVentas.map((venta: any) => (
                          <tr key={venta.id} className="border-b border-gray-100">
                            <td className="py-2 px-3">{venta.planes?.nombre || 'N/A'}</td>
                            <td className="py-2 px-3 text-right">
                              ${Number(venta.monto).toLocaleString('es-MX')}
                            </td>
                            <td className="py-2 px-3 text-right font-semibold">
                              ${Number(venta.comision_socio).toLocaleString('es-MX')}
                            </td>
                            <td className="py-2 px-3 text-center">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                venta.estatus_pago === 'pagado'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {venta.estatus_pago}
                              </span>
                            </td>
                            <td className="py-2 px-3">
                              {new Date(venta.fecha).toLocaleDateString('es-MX')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No hay ventas registradas</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
