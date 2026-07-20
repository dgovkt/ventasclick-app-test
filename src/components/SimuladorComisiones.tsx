import { useState, useEffect } from 'react';
import { Card } from './Card';
import { supabase } from '../lib/supabase';
import { Calculator, RotateCcw } from 'lucide-react';

interface Plan {
  id: string;
  nombre: string;
  precio_anual: number;
  comision_socio: number;
  porcentaje_comision: number;
}


export const SimuladorComisiones = () => {
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [cantidades, setCantidades] = useState<Record<string, number>>({});

  useEffect(() => {
    supabase
      .from('planes')
      .select('id, nombre, precio_anual, comision_socio, porcentaje_comision')
      .eq('activo', true)
      .order('precio_anual', { ascending: true })
      .then(({ data }) => {
        if (data) {
          setPlanes(data as Plan[]);
          const init: Record<string, number> = {};
          data.forEach((p: Plan) => { init[p.id] = 0; });
          setCantidades(init);
        }
      });
  }, []);

  const getComision = (p: Plan) => (p.precio_anual * p.porcentaje_comision) / 100;

  const totalComision = planes.reduce(
    (sum, p) => sum + (cantidades[p.id] || 0) * getComision(p),
    0
  );

  const resetCalculadora = () => {
    const init: Record<string, number> = {};
    planes.forEach(p => { init[p.id] = 0; });
    setCantidades(init);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Simulador de Comisiones</h2>
        <p className="text-gray-600">Calcula tus ingresos potenciales según los paquetes que vendas</p>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calculator className="text-blue-600" size={18} />
            </div>
            <h3 className="text-base font-semibold text-gray-900">Calculadora de comisiones</h3>
          </div>
          <button
            onClick={resetCalculadora}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            <RotateCcw size={13} />
            Limpiar
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-5">
          Indica cuantos paquetes de cada tipo vendes y ve cuanto te toca en total.
        </p>

        <div className="space-y-3">
          {planes.map((plan) => (
            <div
              key={plan.id}
              className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-200 transition-all"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{plan.nombre}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  ${getComision(plan).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} comisión por venta ({plan.porcentaje_comision}%)
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setCantidades(prev => ({ ...prev, [plan.id]: Math.max(0, (prev[plan.id] || 0) - 1) }))}
                  className="w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-600 font-bold text-base hover:border-gray-400 hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center"
                >
                  −
                </button>
                <input
                  type="number"
                  min={0}
                  value={cantidades[plan.id] || 0}
                  onChange={e => setCantidades(prev => ({ ...prev, [plan.id]: Math.max(0, parseInt(e.target.value) || 0) }))}
                  className="w-14 text-center text-sm font-bold text-gray-900 border border-gray-200 rounded-lg py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => setCantidades(prev => ({ ...prev, [plan.id]: (prev[plan.id] || 0) + 1 }))}
                  className="w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-600 font-bold text-base hover:border-gray-400 hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center"
                >
                  +
                </button>
              </div>

              <div className="w-24 text-right flex-shrink-0">
                <p className="text-sm font-bold text-gray-900">
                  ${((cantidades[plan.id] || 0) * getComision(plan)).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600 font-medium">Total de comisiones</p>
          <div className="text-right">
            <p className={`text-2xl font-bold ${totalComision > 0 ? 'text-green-600' : 'text-gray-400'}`}>
              ${totalComision.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {planes.reduce((s, p) => s + (cantidades[p.id] || 0), 0)} ventas en total
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
