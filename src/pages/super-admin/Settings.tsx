import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { supabase } from '../../lib/supabase';
import { Settings, Package, DollarSign, Plus, X, CreditCard as Edit2, CheckCircle, XCircle, Globe, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';

type TabType = 'planes' | 'comisiones' | 'general' | 'chargebee';

interface Plan {
  id: string;
  nombre: string;
  slug: string;
  precio_anual: number;
  comision_socio: number;
  porcentaje_comision: number;
  descripcion_corta: string;
  descripcion_completa: string | null;
  activo: boolean;
  created_at: string;
}

interface ChargebeeEnv {
  id: string;
  environment: 'test' | 'production';
  siteName: string;
  scriptUrl: string;
  isActive: boolean;
  planPresenciaWeb: string;
  planTiendaBasico: string;
  planTiendaEsencial: string;
  planTiendaPremium: string;
}

export default function SuperAdminSettings() {
  const [activeTab, setActiveTab] = useState<TabType>('planes');
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  const [chargebeeConfigs, setChargebeeConfigs] = useState<ChargebeeEnv[]>([]);
  const [chargebeeLoading, setChargebeeLoading] = useState(true);
  const [chargebeeSwitching, setChargebeeSwitching] = useState(false);
  const [chargebeeMessage, setChargebeeMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editingChargebee, setEditingChargebee] = useState<string | null>(null);
  const [chargebeeEditData, setChargebeeEditData] = useState({
    siteName: '',
    scriptUrl: '',
    planPresenciaWeb: '',
    planTiendaBasico: '',
    planTiendaEsencial: '',
    planTiendaPremium: '',
  });
  const [chargebeeSaving, setChargebeeSaving] = useState(false);

  const [generalConfig, setGeneralConfig] = useState({
    empresa_nombre: '',
    empresa_email: '',
    empresa_telefono: '',
  });
  const [generalLoading, setGeneralLoading] = useState(true);
  const [generalSaving, setGeneralSaving] = useState(false);

  useEffect(() => {
    loadPlanes();
    loadChargebeeConfigs();
    loadGeneralConfig();
  }, []);

  async function loadPlanes() {
    try {
      const { data, error } = await supabase
        .from('planes')
        .select('*')
        .order('precio_anual', { ascending: true });

      if (error) throw error;
      setPlanes(data || []);
    } catch (error) {
      console.error('Error loading planes:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleTogglePlanActive(planId: string, currentStatus: boolean) {
    try {
      const { error } = await supabase
        .from('planes')
        .update({ activo: !currentStatus })
        .eq('id', planId);

      if (error) throw error;

      alert(currentStatus ? 'Plan desactivado' : 'Plan activado');
      loadPlanes();
    } catch (error) {
      console.error('Error updating plan:', error);
      alert('Error al actualizar el plan');
    }
  }

  async function handleDeletePlan(plan: Plan) {
    if (!confirm(`¿Estás seguro de que deseas eliminar el plan "${plan.nombre}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('planes')
        .delete()
        .eq('id', plan.id);

      if (error) throw error;

      alert('Plan eliminado exitosamente');
      loadPlanes();
    } catch (error: any) {
      console.error('Error deleting plan:', error);
      alert(error.message || 'Error al eliminar el plan. Puede que tenga ventas asociadas.');
    }
  }

  async function loadGeneralConfig() {
    try {
      setGeneralLoading(true);
      const { data, error } = await supabase
        .from('system_config')
        .select('key, value');

      if (error) throw error;

      if (data) {
        const map: Record<string, string> = {};
        data.forEach((row: { key: string; value: string }) => { map[row.key] = row.value; });
        setGeneralConfig({
          empresa_nombre: map['empresa_nombre'] || '',
          empresa_email: map['empresa_email'] || '',
          empresa_telefono: map['empresa_telefono'] || '',
        });
      }
    } catch (error) {
      console.error('Error loading config:', error);
    } finally {
      setGeneralLoading(false);
    }
  }

  async function saveGeneralConfig() {
    setGeneralSaving(true);
    try {
      const entries = [
        { key: 'empresa_nombre', value: generalConfig.empresa_nombre },
        { key: 'empresa_email', value: generalConfig.empresa_email },
        { key: 'empresa_telefono', value: generalConfig.empresa_telefono },
      ];

      for (const entry of entries) {
        const { error } = await supabase
          .from('system_config')
          .upsert(
            { key: entry.key, value: entry.value, updated_at: new Date().toISOString() },
            { onConflict: 'key' }
          );

        if (error) throw error;
      }

      alert('Configuracion guardada exitosamente');
    } catch (error: any) {
      console.error('Error saving config:', error);
      alert(error.message || 'Error al guardar la configuracion');
    } finally {
      setGeneralSaving(false);
    }
  }

  async function loadChargebeeConfigs() {
    try {
      setChargebeeLoading(true);
      const { data, error } = await supabase
        .from('chargebee_config')
        .select('*')
        .order('environment', { ascending: true });

      if (error) throw error;

      if (data) {
        setChargebeeConfigs(
          data.map((d: any) => ({
            id: d.id,
            environment: d.environment,
            siteName: d.site_name,
            scriptUrl: d.script_url || 'https://js.chargebee.com/v2/chargebee.js',
            isActive: d.is_active,
            planPresenciaWeb: d.plan_presencia_web,
            planTiendaBasico: d.plan_tienda_basico,
            planTiendaEsencial: d.plan_tienda_esencial,
            planTiendaPremium: d.plan_tienda_premium,
          }))
        );
      }
    } catch (error) {
      console.error('Error loading configs:', error);
      setChargebeeMessage({ type: 'error', text: 'Error al cargar configuraciones' });
    } finally {
      setChargebeeLoading(false);
    }
  }

  async function handleChargebeeSwitch(configId: string, environment: string) {
    if (!confirm(`¿Cambiar al entorno de ${environment === 'test' ? 'PRUEBA' : 'PRODUCCIÓN'}?`)) {
      return;
    }

    try {
      setChargebeeSwitching(true);
      setChargebeeMessage(null);

      const { error } = await supabase
        .from('chargebee_config')
        .update({ is_active: true })
        .eq('id', configId);

      if (error) throw error;

      setChargebeeMessage({
        type: 'success',
        text: `Entorno cambiado a ${environment === 'test' ? 'PRUEBA' : 'PRODUCCIÓN'} exitosamente`,
      });

      await loadChargebeeConfigs();

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error switching environment:', error);
      setChargebeeMessage({ type: 'error', text: 'Error al cambiar entorno' });
    } finally {
      setChargebeeSwitching(false);
    }
  }

  async function handleSaveChargebeeConfig(configId: string) {
    setChargebeeSaving(true);
    try {
      const { error } = await supabase
        .from('chargebee_config')
        .update({
          site_name: chargebeeEditData.siteName,
          script_url: chargebeeEditData.scriptUrl,
          plan_presencia_web: chargebeeEditData.planPresenciaWeb,
          plan_tienda_basico: chargebeeEditData.planTiendaBasico,
          plan_tienda_esencial: chargebeeEditData.planTiendaEsencial,
          plan_tienda_premium: chargebeeEditData.planTiendaPremium,
        })
        .eq('id', configId);

      if (error) throw error;

      setChargebeeMessage({ type: 'success', text: 'Configuración actualizada exitosamente' });
      setEditingChargebee(null);
      await loadChargebeeConfigs();
    } catch (error: any) {
      console.error('Error saving chargebee config:', error);
      setChargebeeMessage({ type: 'error', text: error.message || 'Error al guardar configuración' });
    } finally {
      setChargebeeSaving(false);
    }
  }

  const renderPlanesTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Planes</h2>
          <p className="text-gray-600 mt-1">Administra los planes disponibles para los clientes</p>
        </div>
        <Button onClick={() => { setEditingPlan(null); setShowPlanModal(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Plan
        </Button>
      </div>

      {loading ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500">Cargando planes...</p>
          </div>
        </Card>
      ) : planes.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">No hay planes registrados</p>
            <Button onClick={() => { setEditingPlan(null); setShowPlanModal(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              Crear primer plan
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {planes.map((plan) => (
            <Card key={plan.id} className={`hover:shadow-lg transition ${!plan.activo ? 'opacity-60' : ''}`}>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-gray-900">{plan.nombre}</h3>
                      {plan.activo ? (
                        <CheckCircle size={20} className="text-primary" />
                      ) : (
                        <XCircle size={20} className="text-red-500" />
                      )}
                    </div>
                    <p className="text-xs text-gray-400 font-mono mb-2">{plan.slug}</p>
                    <p className="text-gray-600 text-sm">{plan.descripcion_corta}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { setEditingPlan(plan); setShowPlanModal(true); }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                      <Edit2 size={18} className="text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDeletePlan(plan)}
                      className="p-2 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 size={18} className="text-red-400 hover:text-red-600" />
                    </button>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-primary-light to-primary-light rounded-lg p-4 space-y-2">
                  <div>
                    <p className="text-sm text-primary-dark mb-1">Precio Público</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {new Intl.NumberFormat('es-MX', {
                        style: 'currency',
                        currency: 'MXN',
                      }).format(plan.precio_anual)}
                    </p>
                    <p className="text-xs text-gray-500">+ IVA</p>
                  </div>
                  <div className="border-t border-primary/20 pt-2">
                    <p className="text-sm text-primary-dark mb-0.5">Comision Socio ({plan.porcentaje_comision}%)</p>
                    <p className="text-xl font-bold text-gray-900">
                      {new Intl.NumberFormat('es-MX', {
                        style: 'currency',
                        currency: 'MXN',
                      }).format((plan.precio_anual * plan.porcentaje_comision) / 100)}
                    </p>
                  </div>
                </div>

                {plan.descripcion_completa && (
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-600 line-clamp-3">{plan.descripcion_completa}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => handleTogglePlanActive(plan.id, plan.activo)}
                    fullWidth
                    size="sm"
                  >
                    {plan.activo ? 'Desactivar' : 'Activar'}
                  </Button>
                </div>

                <div className="text-xs text-gray-500">
                  Creado: {new Date(plan.created_at).toLocaleDateString('es-MX')}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderComisionesTab = () => {
    const activePlanes = planes.filter(p => p.activo);
    const inactivePlanes = planes.filter(p => !p.activo);

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Comisiones por Plan</h2>
          <p className="text-gray-600 mt-1">Cada plan tiene un monto fijo de comision que recibe el socio por venta</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-1 flex items-center gap-2">
            <AlertCircle size={18} className="text-blue-600" />
            Como funcionan las comisiones
          </h3>
          <p className="text-sm text-blue-800">
            Cada plan tiene asignado un monto fijo de comision. Cuando un socio cierra una venta,
            recibe automaticamente la comision correspondiente al plan vendido. Para modificar la
            comision de un plan, edita el plan desde la pestana de Planes.
          </p>
        </div>

        {activePlanes.length > 0 && (
          <Card>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Planes Activos</h3>
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan</th>
                      <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Precio Publico</th>
                      <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Comision Socio</th>
                      <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">% sobre precio</th>
                      <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {activePlanes.map((plan) => {
                      const comisionCalculada = (plan.precio_anual * plan.porcentaje_comision) / 100;
                      return (
                        <tr key={plan.id} className="hover:bg-gray-50 transition">
                          <td className="px-5 py-4">
                            <p className="text-sm font-semibold text-gray-900">{plan.nombre}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{plan.descripcion_corta}</p>
                          </td>
                          <td className="px-5 py-4 text-right text-sm text-gray-700">
                            {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(plan.precio_anual)}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <span className="text-sm font-bold text-green-700">
                              {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(comisionCalculada)}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right text-sm text-gray-500">
                            {plan.porcentaje_comision}%
                          </td>
                          <td className="px-5 py-4 text-center">
                            <button
                              onClick={() => { setEditingPlan(plan); setShowPlanModal(true); }}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium transition"
                            >
                              Editar
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        )}

        {inactivePlanes.length > 0 && (
          <Card className="opacity-70">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-gray-500 mb-4">Planes Inactivos</h3>
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan</th>
                      <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Precio Publico</th>
                      <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Comision Socio</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {inactivePlanes.map((plan) => (
                      <tr key={plan.id}>
                        <td className="px-5 py-3 text-sm text-gray-500">{plan.nombre}</td>
                        <td className="px-5 py-3 text-right text-sm text-gray-400">
                          {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(plan.precio_anual)}
                        </td>
                        <td className="px-5 py-3 text-right text-sm text-gray-400">
                          {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(plan.comision_socio)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        )}
      </div>
    );
  };

  const renderGeneralTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Configuracion General</h2>
        <p className="text-gray-600 mt-1">Ajustes generales del sistema</p>
      </div>

      {generalLoading ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500">Cargando configuracion...</p>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Empresa
              </label>
              <input
                type="text"
                value={generalConfig.empresa_nombre}
                onChange={(e) => setGeneralConfig({ ...generalConfig, empresa_nombre: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email de Contacto
              </label>
              <input
                type="email"
                value={generalConfig.empresa_email}
                onChange={(e) => setGeneralConfig({ ...generalConfig, empresa_email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefono de Contacto
              </label>
              <input
                type="tel"
                value={generalConfig.empresa_telefono}
                onChange={(e) => setGeneralConfig({ ...generalConfig, empresa_telefono: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>


            <Button onClick={saveGeneralConfig} disabled={generalSaving}>
              {generalSaving ? 'Guardando...' : 'Guardar Configuracion'}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );

  const renderChargebeeTab = () => {
    const activeConfig = chargebeeConfigs.find((c) => c.isActive);

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Configuración de Chargebee</h2>
          <p className="text-gray-600 mt-1">Cambia entre los entornos de prueba y producción de Chargebee</p>
        </div>

        {chargebeeMessage && (
          <div
            className={`rounded-lg p-4 flex items-start gap-3 ${
              chargebeeMessage.type === 'success'
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            {chargebeeMessage.type === 'success' ? (
              <CheckCircle2 className="text-green-600 flex-shrink-0" size={20} />
            ) : (
              <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
            )}
            <p
              className={`text-sm font-medium ${
                chargebeeMessage.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}
            >
              {chargebeeMessage.text}
            </p>
          </div>
        )}

        {activeConfig && (
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Globe className="text-blue-600" size={24} />
              <h3 className="text-lg font-bold text-blue-900">Entorno Activo</h3>
            </div>
            <p className="text-2xl font-extrabold text-blue-600 mb-2">
              {activeConfig.environment === 'test' ? 'PRUEBA' : 'PRODUCCIÓN'}
            </p>
            <p className="text-sm text-blue-700">
              Site: <span className="font-mono font-semibold">{activeConfig.siteName}</span>
            </p>
          </div>
        )}

        {chargebeeLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-sm text-gray-500">Cargando configuraciones...</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {chargebeeConfigs.map((config) => (
              <Card key={config.id}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          config.environment === 'test'
                            ? 'bg-orange-100'
                            : 'bg-green-100'
                        }`}
                      >
                        <Globe
                          className={
                            config.environment === 'test'
                              ? 'text-orange-600'
                              : 'text-green-600'
                          }
                          size={24}
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {config.environment === 'test' ? 'Prueba' : 'Producción'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {config.isActive ? 'Activo' : 'Inactivo'}
                        </p>
                      </div>
                    </div>
                    {config.isActive && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                        ACTIVO
                      </span>
                    )}
                  </div>

                  {editingChargebee === config.id ? (
                    <div className="space-y-3 text-sm">
                      <div>
                        <label className="text-gray-500 text-xs block mb-1">Site Name</label>
                        <input
                          type="text"
                          value={chargebeeEditData.siteName}
                          onChange={(e) => setChargebeeEditData({ ...chargebeeEditData, siteName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="text-gray-500 text-xs block mb-1">Script URL (Chargebee JS)</label>
                        <input
                          type="url"
                          value={chargebeeEditData.scriptUrl}
                          onChange={(e) => setChargebeeEditData({ ...chargebeeEditData, scriptUrl: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="https://js.chargebee.com/v2/chargebee.js"
                        />
                        <p className="text-xs text-gray-400 mt-1">Actualiza esta URL cuando el script de Chargebee expire o cambie de version</p>
                      </div>
                      <div className="border-t border-gray-200 pt-3 mt-3">
                        <p className="text-gray-500 text-xs font-medium mb-2">Item Price IDs</p>
                        <div className="space-y-2">
                          <div>
                            <label className="text-gray-500 text-xs block mb-1">Presencia Web</label>
                            <input
                              type="text"
                              value={chargebeeEditData.planPresenciaWeb}
                              onChange={(e) => setChargebeeEditData({ ...chargebeeEditData, planPresenciaWeb: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="text-gray-500 text-xs block mb-1">Tienda Basico</label>
                            <input
                              type="text"
                              value={chargebeeEditData.planTiendaBasico}
                              onChange={(e) => setChargebeeEditData({ ...chargebeeEditData, planTiendaBasico: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="text-gray-500 text-xs block mb-1">Tienda Esencial</label>
                            <input
                              type="text"
                              value={chargebeeEditData.planTiendaEsencial}
                              onChange={(e) => setChargebeeEditData({ ...chargebeeEditData, planTiendaEsencial: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="text-gray-500 text-xs block mb-1">Tienda Premium</label>
                            <input
                              type="text"
                              value={chargebeeEditData.planTiendaPremium}
                              onChange={(e) => setChargebeeEditData({ ...chargebeeEditData, planTiendaPremium: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <Button
                          onClick={() => handleSaveChargebeeConfig(config.id)}
                          disabled={chargebeeSaving}
                          size="sm"
                        >
                          {chargebeeSaving ? 'Guardando...' : 'Guardar'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setEditingChargebee(null)}
                          size="sm"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 text-sm">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-gray-500 text-xs mb-1">Site Name</p>
                        <p className="font-mono font-semibold text-gray-900">
                          {config.siteName}
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-gray-500 text-xs mb-1">Script URL</p>
                        <p className="font-mono text-xs text-gray-900 break-all">
                          {config.scriptUrl}
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-gray-500 text-xs mb-2">Item IDs de Planes</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Presencia Web:</span>
                            <span className="font-mono text-gray-900">
                              {config.planPresenciaWeb}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tienda Basico:</span>
                            <span className="font-mono text-gray-900">
                              {config.planTiendaBasico}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tienda Esencial:</span>
                            <span className="font-mono text-gray-900">
                              {config.planTiendaEsencial}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tienda Premium:</span>
                            <span className="font-mono text-gray-900">
                              {config.planTiendaPremium}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setEditingChargebee(config.id);
                          setChargebeeEditData({
                            siteName: config.siteName,
                            scriptUrl: config.scriptUrl,
                            planPresenciaWeb: config.planPresenciaWeb,
                            planTiendaBasico: config.planTiendaBasico,
                            planTiendaEsencial: config.planTiendaEsencial,
                            planTiendaPremium: config.planTiendaPremium,
                          });
                        }}
                        className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium py-2 hover:bg-blue-50 rounded-lg transition"
                      >
                        Editar configuracion
                      </button>
                    </div>
                  )}

                  {!config.isActive && (
                    <Button
                      onClick={() => handleChargebeeSwitch(config.id, config.environment)}
                      disabled={chargebeeSwitching}
                      className={`w-full ${
                        config.environment === 'test'
                          ? 'bg-orange-600 hover:bg-orange-700'
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {chargebeeSwitching
                        ? 'Cambiando...'
                        : `Activar entorno de ${
                            config.environment === 'test' ? 'Prueba' : 'Producción'
                          }`}
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        <Card>
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <AlertCircle className="text-yellow-600" size={20} />
              Información Importante
            </h3>
            <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
              <li>
                El cambio de entorno afecta a todos los usuarios y se aplica inmediatamente
              </li>
              <li>
                El entorno de PRUEBA usa el site <code className="font-mono">ventasclick-test</code> y
                códigos de prueba
              </li>
              <li>
                El entorno de PRODUCCIÓN usa el site <code className="font-mono">ventasclick</code> con
                códigos reales
              </li>
              <li>La página se recargará automáticamente después del cambio</li>
            </ul>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configuración del Sistema</h1>
          <p className="text-gray-600 mt-2">Administra la configuración global de la plataforma</p>
        </div>

        <div className="border-b border-gray-200">
          <nav className="flex gap-8">
            <button
              onClick={() => setActiveTab('planes')}
              className={`pb-4 px-2 border-b-2 font-medium transition ${
                activeTab === 'planes'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Package size={20} />
                Planes
              </div>
            </button>
            <button
              onClick={() => setActiveTab('comisiones')}
              className={`pb-4 px-2 border-b-2 font-medium transition ${
                activeTab === 'comisiones'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <DollarSign size={20} />
                Comisiones
              </div>
            </button>
            <button
              onClick={() => setActiveTab('chargebee')}
              className={`pb-4 px-2 border-b-2 font-medium transition ${
                activeTab === 'chargebee'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Globe size={20} />
                Chargebee
              </div>
            </button>
            <button
              onClick={() => setActiveTab('general')}
              className={`pb-4 px-2 border-b-2 font-medium transition ${
                activeTab === 'general'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Settings size={20} />
                General
              </div>
            </button>
          </nav>
        </div>

        <div>
          {activeTab === 'planes' && renderPlanesTab()}
          {activeTab === 'comisiones' && renderComisionesTab()}
          {activeTab === 'chargebee' && renderChargebeeTab()}
          {activeTab === 'general' && renderGeneralTab()}
        </div>

        {showPlanModal && (
          <PlanModal
            plan={editingPlan}
            onClose={() => { setShowPlanModal(false); setEditingPlan(null); }}
            onSuccess={() => { setShowPlanModal(false); setEditingPlan(null); loadPlanes(); }}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

interface PlanModalProps {
  plan: Plan | null;
  onClose: () => void;
  onSuccess: () => void;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

function PlanModal({ plan, onClose, onSuccess }: PlanModalProps) {
  const [formData, setFormData] = useState({
    nombre: plan?.nombre || '',
    slug: plan?.slug || '',
    precio_anual: plan?.precio_anual?.toString() || '',
    porcentaje_comision: plan?.porcentaje_comision?.toString() || '',
    descripcion_corta: plan?.descripcion_corta || '',
    descripcion_completa: plan?.descripcion_completa || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const precio = parseFloat(formData.precio_anual) || 0;
  const porcentaje = parseFloat(formData.porcentaje_comision) || 0;
  const comisionCalculada = (precio * porcentaje) / 100;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const precioVal = parseFloat(formData.precio_anual);
      const porcentajeVal = parseFloat(formData.porcentaje_comision) || 0;
      const comisionVal = (precioVal * porcentajeVal) / 100;

      const data = {
        nombre: formData.nombre,
        precio_anual: precioVal,
        porcentaje_comision: porcentajeVal,
        comision_socio: comisionVal,
        descripcion_corta: formData.descripcion_corta,
        descripcion_completa: formData.descripcion_completa || null,
      };

      if (plan) {
        const { error } = await supabase
          .from('planes')
          .update(data)
          .eq('id', plan.id);

        if (error) throw error;
        alert('Plan actualizado exitosamente');
      } else {
        const slug = generateSlug(formData.nombre);
        const { data: existing } = await supabase
          .from('planes')
          .select('id')
          .eq('slug', slug)
          .maybeSingle();

        if (existing) {
          throw new Error(`Ya existe un plan con identificador "${slug}". Usa un nombre diferente.`);
        }

        const { error } = await supabase
          .from('planes')
          .insert({ ...data, slug });

        if (error) throw error;
        alert('Plan creado exitosamente');
      }

      onSuccess();
    } catch (error: any) {
      console.error('Error saving plan:', error);
      alert(error.message || 'Error al guardar el plan');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">
            {plan ? 'Editar Plan' : 'Nuevo Plan'}
          </h2>
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
              Nombre del Plan *
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej. Presencia Web, Tienda en Línea"
              required
            />
            <p className="mt-1 text-xs text-gray-400 font-mono">
              Slug: {plan ? plan.slug : (formData.nombre ? generateSlug(formData.nombre) : '---')}
              {plan && <span className="ml-2 text-gray-300">(no editable)</span>}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio Publico (MXN + IVA) *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.precio_anual}
                  onChange={(e) => setFormData({ ...formData, precio_anual: e.target.value })}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Porcentaje de Comision (%) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.porcentaje_comision}
                  onChange={(e) => setFormData({ ...formData, porcentaje_comision: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  required
                />
                <span className="absolute right-4 top-3.5 text-gray-500">%</span>
              </div>
            </div>
          </div>

          {precio > 0 && porcentaje > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                <span className="font-semibold">Comision calculada:</span>{' '}
                {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(comisionCalculada)}
                {' '}({porcentaje}% de {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(precio)})
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripcion Corta *
            </label>
            <input
              type="text"
              value={formData.descripcion_corta}
              onChange={(e) => setFormData({ ...formData, descripcion_corta: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Breve descripción del plan"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción Completa
            </label>
            <textarea
              value={formData.descripcion_completa}
              onChange={(e) => setFormData({ ...formData, descripcion_completa: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={5}
              placeholder="Descripción detallada con todas las características del plan..."
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
              {isSubmitting ? 'Guardando...' : (plan ? 'Actualizar Plan' : 'Crear Plan')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
