import { useState, useEffect } from 'react';
import { Star, CheckCircle, XCircle, Clock, User } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import type { Database } from '../../lib/database.types';

type Review = Database['public']['Tables']['customer_reviews']['Row'] & {
  profiles: {
    nombre: string;
    apellido: string;
  } | null;
};

type FilterEstatus = 'todos' | 'pendiente' | 'aprobado' | 'rechazado';

export default function Reviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterEstatus>('todos');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    try {
      const { data, error } = await supabase
        .from('customer_reviews')
        .select(`
          *,
          profiles:socio_id (nombre, apellido)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setReviews(data || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  }

  async function moderateReview(reviewId: string, newEstatus: 'aprobado' | 'rechazado') {
    if (!user) return;

    setProcessing(true);
    try {
      const { error } = await supabase
        .from('customer_reviews')
        .update({
          estatus: newEstatus,
          aprobado_por: user.id,
          fecha_aprobacion: new Date().toISOString()
        })
        .eq('id', reviewId);

      if (error) throw error;

      await loadReviews();
      setSelectedReview(null);
    } catch (error) {
      console.error('Error moderating review:', error);
      alert('Error al moderar la review');
    } finally {
      setProcessing(false);
    }
  }

  function getNPSCategory(score: number) {
    if (score >= 9) return { label: 'Promotor', color: 'text-primary bg-primary-light' };
    if (score >= 7) return { label: 'Pasivo', color: 'text-yellow-600 bg-yellow-50' };
    return { label: 'Detractor', color: 'text-red-600 bg-red-50' };
  }

  function getStatusIcon(estatus: string) {
    switch (estatus) {
      case 'aprobado':
        return <CheckCircle className="w-5 h-5 text-primary" />;
      case 'rechazado':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-amber-600" />;
    }
  }

  const filteredReviews = filter === 'todos'
    ? reviews
    : reviews.filter(r => r.estatus === filter);

  const stats = {
    total: reviews.length,
    pendientes: reviews.filter(r => r.estatus === 'pendiente').length,
    aprobados: reviews.filter(r => r.estatus === 'aprobado').length,
    rechazados: reviews.filter(r => r.estatus === 'rechazado').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Cargando reviews...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Moderación de Reviews</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Reviews</span>
              <Star className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Pendientes</span>
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div className="text-3xl font-bold text-amber-600">{stats.pendientes}</div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Aprobados</span>
              <CheckCircle className="w-5 h-5 text-primary" />
            </div>
            <div className="text-3xl font-bold text-primary">{stats.aprobados}</div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Rechazados</span>
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-3xl font-bold text-red-600">{stats.rechazados}</div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-6">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setFilter('todos')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'todos'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos ({reviews.length})
            </button>
            <button
              onClick={() => setFilter('pendiente')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'pendiente'
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pendientes ({stats.pendientes})
            </button>
            <button
              onClick={() => setFilter('aprobado')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'aprobado'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Aprobados ({stats.aprobados})
            </button>
            <button
              onClick={() => setFilter('rechazado')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'rechazado'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Rechazados ({stats.rechazados})
            </button>
          </div>

          {filteredReviews.length === 0 ? (
            <div className="text-center py-12">
              <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No hay reviews para mostrar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReviews.map((review) => {
                const category = getNPSCategory(review.score_nps);
                const socioNombre = review.profiles
                  ? `${review.profiles.nombre} ${review.profiles.apellido}`
                  : 'Desconocido';

                return (
                  <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{review.nombre_cliente}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${category.color}`}>
                            {category.label}
                          </span>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(review.estatus)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                          <User className="w-4 h-4" />
                          <span>Socio: {socioNombre}</span>
                        </div>
                        {review.contacto_cliente && (
                          <p className="text-sm text-gray-500 mb-2">
                            Contacto: {review.contacto_cliente}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 ml-4">
                        <span className="text-2xl font-bold text-gray-900">{review.score_nps}</span>
                        <span className="text-sm text-gray-500">/10</span>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-3">{review.comentario}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>
                          Recibido: {new Date(review.created_at).toLocaleDateString('es-MX', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>

                      {review.estatus === 'pendiente' && (
                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => moderateReview(review.id, 'rechazado')}
                            disabled={processing}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Rechazar
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => moderateReview(review.id, 'aprobado')}
                            disabled={processing}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Aprobar
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
