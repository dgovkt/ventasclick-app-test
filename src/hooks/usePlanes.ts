import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Plan {
  id: string;
  nombre: string;
  slug: string;
  precio_anual: number;
  comision_socio: number;
  porcentaje_comision: number;
  descripcion_corta: string;
  activo: boolean;
}

export function formatPrecio(amount: number): string {
  return '$' + amount.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export function usePlanes() {
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlanes();
  }, []);

  async function loadPlanes() {
    try {
      const { data, error } = await supabase
        .from('planes')
        .select('id, nombre, slug, precio_anual, comision_socio, porcentaje_comision, descripcion_corta, activo')
        .eq('activo', true)
        .order('precio_anual', { ascending: true });

      if (error) throw error;
      setPlanes(data || []);
    } catch (err) {
      console.error('Error loading planes:', err);
    } finally {
      setLoading(false);
    }
  }

  function getPlan(slug: string): Plan | undefined {
    return planes.find(p => p.slug === slug);
  }

  function getPrecio(slug: string, fallback: string): string {
    const plan = getPlan(slug);
    return plan ? formatPrecio(plan.precio_anual) : fallback;
  }

  return { planes, loading, getPlan, getPrecio };
}
