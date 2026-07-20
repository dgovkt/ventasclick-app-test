import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { AlertCircle, CheckCircle2, Globe } from 'lucide-react';

interface ChargebeeEnv {
  id: string;
  environment: 'test' | 'production';
  siteName: string;
  isActive: boolean;
  planPresenciaWeb: string;
  planTiendaBasico: string;
  planTiendaEsencial: string;
  planTiendaPremium: string;
}

export default function ChargebeeConfig() {
  const [configs, setConfigs] = useState<ChargebeeEnv[]>([]);
  const [loading, setLoading] = useState(true);
  const [switching, setSwitching] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadConfigs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('chargebee_config')
        .select('*')
        .order('environment', { ascending: true });

      if (error) throw error;

      if (data) {
        setConfigs(
          data.map((d) => ({
            id: d.id,
            environment: d.environment,
            siteName: d.site_name,
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
      setMessage({ type: 'error', text: 'Error al cargar configuraciones' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfigs();
  }, []);

  const handleSwitch = async (configId: string, environment: string) => {
    if (!confirm(`¿Cambiar al entorno de ${environment === 'test' ? 'PRUEBA' : 'PRODUCCIÓN'}?`)) {
      return;
    }

    try {
      setSwitching(true);
      setMessage(null);

      const { error } = await supabase
        .from('chargebee_config')
        .update({ is_active: true })
        .eq('id', configId);

      if (error) throw error;

      setMessage({
        type: 'success',
        text: `Entorno cambiado a ${environment === 'test' ? 'PRUEBA' : 'PRODUCCIÓN'} exitosamente`,
      });

      await loadConfigs();

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error switching environment:', error);
      setMessage({ type: 'error', text: 'Error al cambiar entorno' });
    } finally {
      setSwitching(false);
    }
  };

  const activeConfig = configs.find((c) => c.isActive);

  return (
    <DashboardLayout role="super_admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuración de Chargebee</h1>
          <p className="mt-1 text-sm text-gray-500">
            Cambia entre los entornos de prueba y producción de Chargebee
          </p>
        </div>

        {message && (
          <div
            className={`rounded-lg p-4 flex items-start gap-3 ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="text-green-600 flex-shrink-0" size={20} />
            ) : (
              <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
            )}
            <p
              className={`text-sm font-medium ${
                message.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}
            >
              {message.text}
            </p>
          </div>
        )}

        {activeConfig && (
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Globe className="text-blue-600" size={24} />
              <h2 className="text-lg font-bold text-blue-900">Entorno Activo</h2>
            </div>
            <p className="text-2xl font-extrabold text-blue-600 mb-2">
              {activeConfig.environment === 'test' ? 'PRUEBA' : 'PRODUCCIÓN'}
            </p>
            <p className="text-sm text-blue-700">
              Site: <span className="font-mono font-semibold">{activeConfig.siteName}</span>
            </p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-sm text-gray-500">Cargando configuraciones...</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {configs.map((config) => (
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

                  <div className="space-y-2 text-sm">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-500 text-xs mb-1">Site Name</p>
                      <p className="font-mono font-semibold text-gray-900">
                        {config.siteName}
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
                          <span className="text-gray-600">Tienda Básico:</span>
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
                  </div>

                  {!config.isActive && (
                    <Button
                      onClick={() => handleSwitch(config.id, config.environment)}
                      disabled={switching}
                      className={`w-full ${
                        config.environment === 'test'
                          ? 'bg-orange-600 hover:bg-orange-700'
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {switching
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
    </DashboardLayout>
  );
}
