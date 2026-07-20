import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Award, Plus, CheckCircle, Clock, XCircle, ExternalLink, X } from 'lucide-react';

interface CasoExito {
  id: string;
  url_sitio: string;
  tipo_plan: string;
  titulo: string;
  descripcion_corta: string;
  descripcion_completa: string | null;
  estatus: 'pendiente' | 'aprobado' | 'rechazado';
  created_at: string;
  updated_at: string;
}

export const SocioCasosExito = () => {
  const { user } = useAuth();
  const [casos, setCasos] = useState<CasoExito[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    url_sitio: '',
    tipo_plan: 'presencia_web',
    titulo: '',
    descripcion_corta: '',
    descripcion_completa: '',
  });

  useEffect(() => {
    loadCasos();
  }, []);

  const loadCasos = async () => {
    setIsLoading(true);

    const { data, error } = await supabase
      .from('casos_exito')
      .select('*')
      .eq('socio_id', user?.id)
      .order('created_at', { ascending: false });

    if (data) {
      setCasos(data);
    }

    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('casos_exito')
        .insert({
          socio_id: user?.id,
          ...formData,
          estatus: 'pendiente',
        });

      if (error) throw error;

      alert('Caso de éxito enviado exitosamente. Será revisado por nuestro equipo.');
      setShowForm(false);
      setFormData({
        url_sitio: '',
        tipo_plan: 'presencia_web',
        titulo: '',
        descripcion_corta: '',
        descripcion_completa: '',
      });
      loadCasos();
    } catch (error) {
      console.error('Error submitting caso:', error);
      alert('Error al enviar el caso de éxito');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (estatus: string) => {
    const badges = {
      pendiente: {
        icon: Clock,
        text: 'En Revisión',
        className: 'bg-yellow-100 text-yellow-800',
      },
      aprobado: {
        icon: CheckCircle,
        text: 'Aprobado',
        className: 'bg-primary-light text-primary-dark',
      },
      rechazado: {
        icon: XCircle,
        text: 'Rechazado',
        className: 'bg-red-100 text-red-800',
      },
    };

    const badge = badges[estatus as keyof typeof badges];
    const Icon = badge.icon;

    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${badge.className}`}>
        <Icon size={16} />
        <span className="text-sm font-medium">{badge.text}</span>
      </div>
    );
  };

  const getTipoPlanLabel = (tipo: string) => {
    return tipo === 'presencia_web' ? 'Presencia Web' : 'Tienda en Línea';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Casos de Éxito</h1>
            <p className="text-gray-600 mt-2">
              Comparte los proyectos exitosos que has vendido
            </p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus size={20} className="mr-2" />
            Nuevo Caso
          </Button>
        </div>

        <Card>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Importante</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Los casos de éxito son revisados por nuestro equipo antes de ser publicados</li>
              <li>• Solo incluye proyectos reales y con el permiso del cliente</li>
              <li>• Los casos aprobados serán mostrados en la página oficial de Ventas Click</li>
            </ul>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Cargando casos de éxito...</p>
            </div>
          ) : casos.length === 0 ? (
            <div className="text-center py-12">
              <Award size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">No has enviado casos de éxito aún</p>
              <Button onClick={() => setShowForm(true)}>Enviar primer caso</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {casos.map((caso) => (
                <div
                  key={caso.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {caso.titulo}
                        </h3>
                        {getStatusBadge(caso.estatus)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <span className="px-2 py-1 bg-gray-100 rounded">
                          {getTipoPlanLabel(caso.tipo_plan)}
                        </span>
                        <a
                          href={caso.url_sitio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          {caso.url_sitio}
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-3">{caso.descripcion_corta}</p>

                  {caso.descripcion_completa && (
                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <p className="text-sm text-gray-600">{caso.descripcion_completa}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                      Enviado el{' '}
                      {new Date(caso.created_at).toLocaleDateString('es-MX', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Nuevo Caso de Éxito</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  Tu caso será revisado por nuestro equipo antes de ser publicado. Asegúrate
                  de incluir información precisa y verídica.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL del sitio web *
                </label>
                <input
                  type="url"
                  value={formData.url_sitio}
                  onChange={(e) =>
                    setFormData({ ...formData, url_sitio: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://ejemplo.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de plan *
                </label>
                <select
                  value={formData.tipo_plan}
                  onChange={(e) =>
                    setFormData({ ...formData, tipo_plan: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="presencia_web">Presencia Web</option>
                  <option value="tienda_en_linea">Tienda en Línea</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título del caso *
                </label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Tienda de ropa boutique en Ciudad de México"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción corta *
                </label>
                <textarea
                  value={formData.descripcion_corta}
                  onChange={(e) =>
                    setFormData({ ...formData, descripcion_corta: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Breve descripción del proyecto (máximo 200 caracteres)"
                  maxLength={200}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.descripcion_corta.length}/200 caracteres
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción completa (opcional)
                </label>
                <textarea
                  value={formData.descripcion_completa}
                  onChange={(e) =>
                    setFormData({ ...formData, descripcion_completa: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={5}
                  placeholder="Detalles adicionales sobre el proyecto, resultados obtenidos, etc."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  fullWidth
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting} fullWidth>
                  {isSubmitting ? 'Enviando...' : 'Enviar Caso'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
