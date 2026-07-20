import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface ChargebeeConfig {
  environment: 'test' | 'production';
  siteName: string;
  scriptUrl: string;
  planPresenciaWeb: string;
  planTiendaBasico: string;
  planTiendaEsencial: string;
  planTiendaPremium: string;
}

export function useChargebeeConfig() {
  const [config, setConfig] = useState<ChargebeeConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadConfig = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('chargebee_config')
        .select('*')
        .eq('is_active', true)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (data) {
        setConfig({
          environment: data.environment as 'test' | 'production',
          siteName: data.site_name,
          scriptUrl: data.script_url || 'https://js.chargebee.com/v2/chargebee.js',
          planPresenciaWeb: data.plan_presencia_web,
          planTiendaBasico: data.plan_tienda_basico,
          planTiendaEsencial: data.plan_tienda_esencial,
          planTiendaPremium: data.plan_tienda_premium,
        });
      } else {
        setConfig({
          environment: 'production',
          siteName: 'ventasclick',
          scriptUrl: 'https://js.chargebee.com/v2/chargebee.js',
          planPresenciaWeb: 'TP-000P-MXN-Yearly',
          planTiendaBasico: 'TP-001-MXN-Yearly',
          planTiendaEsencial: 'TP-002-MXN-Yearly',
          planTiendaPremium: 'TP-003-MXN-Yearly',
        });
      }
    } catch (err) {
      console.error('Error loading Chargebee config:', err);
      setError(err as Error);
      setConfig({
        environment: 'production',
        siteName: 'ventasclick',
        scriptUrl: 'https://js.chargebee.com/v2/chargebee.js',
        planPresenciaWeb: 'TP-000P-MXN-Yearly',
        planTiendaBasico: 'TP-001-MXN-Yearly',
        planTiendaEsencial: 'TP-002-MXN-Yearly',
        planTiendaPremium: 'TP-003-MXN-Yearly',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();

    const channel = supabase
      .channel('chargebee_config_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chargebee_config',
        },
        () => {
          loadConfig();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { config, loading, error, reload: loadConfig };
}
