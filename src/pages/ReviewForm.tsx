import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, CheckCircle, AlertCircle } from 'lucide-react';
import { PageLayoutPublic } from '../components/PageLayoutPublic';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

const REVIEW_FORM_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/review-form`;

export default function ReviewForm() {
  const { socioId } = useParams<{ socioId: string }>();
  const navigate = useNavigate();
  const [socioNombre, setSocioNombre] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    nombre_cliente: '',
    contacto_cliente: '',
    score_nps: 10,
    comentario: ''
  });

  useEffect(() => {
    loadSocioInfo();
  }, [socioId]);

  async function loadSocioInfo() {
    if (!socioId) {
      setError('ID de socio no válido');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${REVIEW_FORM_URL}?socio_id=${socioId}`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.error || 'El enlace de review no es válido o el socio no existe.');
        setLoading(false);
        return;
      }

      setSocioNombre(json.nombre);
    } catch (err) {
      console.error('Error loading socio:', err);
      setError('No se pudo conectar al servidor. Verifica tu conexión a internet e intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!socioId) {
      setError('ID de socio no válido');
      return;
    }

    if (!formData.nombre_cliente.trim()) {
      setError('Por favor ingresa tu nombre');
      return;
    }

    if (!formData.comentario.trim()) {
      setError('Por favor ingresa un comentario');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch(REVIEW_FORM_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          socio_id: socioId,
          nombre_cliente: formData.nombre_cliente.trim(),
          contacto_cliente: formData.contacto_cliente.trim() || null,
          score_nps: formData.score_nps,
          comentario: formData.comentario.trim(),
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Error al enviar');
      }

      setSubmitted(true);
    } catch (error: any) {
      console.error('Error submitting review:', error);
      setError(error?.message || 'Error al enviar tu review. Verifica tu conexión e intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  }

  function handleScoreClick(score: number) {
    setFormData({ ...formData, score_nps: score });
  }

  if (loading) {
    return (
      <PageLayoutPublic>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Cargando...</div>
        </div>
      </PageLayoutPublic>
    );
  }

  if (error && !socioNombre) {
    return (
      <PageLayoutPublic>
        <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
          <Card>
            <div className="p-4 sm:p-8 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
              <p className="text-gray-600">{error}</p>
              <Button className="mt-6" onClick={() => navigate('/')}>
                Volver al inicio
              </Button>
            </div>
          </Card>
        </div>
      </PageLayoutPublic>
    );
  }

  if (submitted) {
    return (
      <PageLayoutPublic>
        <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
          <Card>
            <div className="p-4 sm:p-8 text-center">
              <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Gracias por tu Review
              </h2>
              <p className="text-gray-600 mb-6">
                Tu opinión es muy importante y será revisada pronto.
              </p>
              <Button onClick={() => navigate('/')}>
                Volver al inicio
              </Button>
            </div>
          </Card>
        </div>
      </PageLayoutPublic>
    );
  }

  return (
    <PageLayoutPublic>
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        <Card>
          <div className="p-4 sm:p-8">
            <div className="text-center mb-6 sm:mb-8">
              <Star className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 mx-auto mb-3 sm:mb-4" />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Deja tu Review
              </h1>
              <p className="text-gray-600">
                Comparte tu experiencia trabajando con <span className="font-semibold">{socioNombre}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tu Nombre *
                </label>
                <input
                  type="text"
                  value={formData.nombre_cliente}
                  onChange={(e) => setFormData({ ...formData, nombre_cliente: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Juan Pérez"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contacto (Email o Teléfono)
                </label>
                <input
                  type="text"
                  value={formData.contacto_cliente}
                  onChange={(e) => setFormData({ ...formData, contacto_cliente: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="correo@ejemplo.com o 5512345678"
                />
                <p className="text-xs text-gray-500 mt-1">Opcional, pero ayuda a validar tu review</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  ¿Qué tan probable es que recomiendes el servicio? *
                </label>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center mb-2">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                    <button
                      key={score}
                      type="button"
                      onClick={() => handleScoreClick(score)}
                      className={`w-9 h-9 sm:w-12 sm:h-12 rounded-lg text-sm sm:text-base font-semibold transition-all ${
                        formData.score_nps === score
                          ? score >= 9
                            ? 'bg-primary text-white scale-110'
                            : score >= 7
                            ? 'bg-yellow-500 text-white scale-110'
                            : 'bg-red-600 text-white scale-110'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 px-2">
                  <span>Nada probable</span>
                  <span>Muy probable</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cuéntanos tu experiencia *
                </label>
                <textarea
                  value={formData.comentario}
                  onChange={(e) => setFormData({ ...formData, comentario: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe tu experiencia trabajando con este socio..."
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={submitting}
              >
                {submitting ? 'Enviando...' : 'Enviar Review'}
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </PageLayoutPublic>
  );
}
