import { useState, useEffect } from 'react';
import { Star, Copy, CheckCircle, Clock, XCircle, TrendingUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import type { Database } from '../../lib/database.types';

type Review = Database['public']['Tables']['customer_reviews']['Row'];

export default function Reviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    promedio: 0,
    promotores: 0,
    pasivos: 0,
    detractores: 0,
    npsScore: 0
  });

  const reviewLink = `${window.location.origin}/review/${user?.id}`;

  useEffect(() => {
    loadReviews();
  }, [user]);

  async function loadReviews() {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('customer_reviews')
        .select('*')
        .eq('socio_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setReviews(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  }

  function calculateStats(reviewsData: Review[]) {
    const total = reviewsData.length;

    if (total === 0) {
      setStats({ total: 0, promedio: 0, promotores: 0, pasivos: 0, detractores: 0, npsScore: 0 });
      return;
    }

    const promotores = reviewsData.filter(r => r.score_nps >= 9).length;
    const pasivos = reviewsData.filter(r => r.score_nps >= 7 && r.score_nps <= 8).length;
    const detractores = reviewsData.filter(r => r.score_nps <= 6).length;

    const promedio = reviewsData.reduce((sum, r) => sum + r.score_nps, 0) / total;
    const npsScore = ((promotores - detractores) / total) * 100;

    setStats({
      total,
      promedio: Math.round(promedio * 10) / 10,
      promotores,
      pasivos,
      detractores,
      npsScore: Math.round(npsScore)
    });
  }

  function copyLink() {
    navigator.clipboard.writeText(reviewLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function getStatusIcon(estatus: string) {
    switch (estatus) {
      case 'aprobado':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rechazado':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-amber-600" />;
    }
  }

  function getStatusText(estatus: string) {
    switch (estatus) {
      case 'aprobado':
        return 'Aprobado';
      case 'rechazado':
        return 'Rechazado';
      default:
        return 'Pendiente';
    }
  }

  function getNPSCategory(score: number) {
    if (score >= 9) return { label: 'Promotor', color: 'text-primary bg-primary-light' };
    if (score >= 7) return { label: 'Pasivo', color: 'text-yellow-600 bg-yellow-50' };
    return { label: 'Detractor', color: 'text-red-600 bg-red-50' };
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Cargando reviews...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Reviews de Clientes</h1>
      </div>

      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tu Enlace de Review</h2>
          <p className="text-sm text-gray-600 mb-4">
            Comparte este enlace con tus clientes para que dejen una review de tu servicio
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={reviewLink}
              readOnly
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
            />
            <Button onClick={copyLink}>
              {copied ? <CheckCircle className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? 'Copiado' : 'Copiar'}
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
              <span className="text-sm text-gray-600">NPS Score</span>
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.npsScore}</div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Promotores</span>
              <div className="w-3 h-3 rounded-full bg-primary" />
            </div>
            <div className="text-3xl font-bold text-primary">{stats.promotores}</div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Pasivos</span>
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
            </div>
            <div className="text-3xl font-bold text-yellow-600">{stats.pasivos}</div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Detractores</span>
              <div className="w-3 h-3 rounded-full bg-red-500" />
            </div>
            <div className="text-3xl font-bold text-red-600">{stats.detractores}</div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Todas las Reviews</h2>

          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Aún no tienes reviews</p>
              <p className="text-sm text-gray-500 mt-2">Comparte tu enlace con clientes para recibir feedback</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => {
                const category = getNPSCategory(review.score_nps);
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
                            <span className="text-sm text-gray-600">{getStatusText(review.estatus)}</span>
                          </div>
                        </div>
                        {review.contacto_cliente && (
                          <p className="text-sm text-gray-500 mb-2">{review.contacto_cliente}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 ml-4">
                        <span className="text-2xl font-bold text-gray-900">{review.score_nps}</span>
                        <span className="text-sm text-gray-500">/10</span>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-3">{review.comentario}</p>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>
                        Recibido: {new Date(review.created_at).toLocaleDateString('es-MX', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      {review.fecha_aprobacion && (
                        <span>
                          Moderado: {new Date(review.fecha_aprobacion).toLocaleDateString('es-MX', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
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
    </DashboardLayout>
  );
}
