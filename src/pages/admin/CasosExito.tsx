import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Award, CheckCircle, XCircle, Clock, ExternalLink, X } from 'lucide-react';

interface CasoExito {
  id: string;
  url_sitio: string;
  tipo_plan: string;
  titulo: string;
  descripcion_corta: string;
  descripcion_completa: string | null;
  estatus: 'pendiente' | 'aprobado' | 'rechazado';
  comentario_moderacion: string | null;
  created_at: string;
  updated_at: string;
  profiles?: {
    nombre: string;
    apellido: string;
    telefono: string | null;
  };
  aprobado_por_profile?: {
    nombre: string;
    apellido: string;
  };
  fecha_aprobacion: string | null;
}

export const AdminCasosExito = () => {
  const { user } = useAuth();
  const [casos, setCasos] = useState<CasoExito[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterEstatus, setFilterEstatus] = useState<string>('');
  const [selectedCaso, setSelectedCaso] = useState<CasoExito | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<'aprobar' | 'rechazar'>('aprobar');
  const [comentario, setComentario] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadCasos();
  }, []);

  const loadCasos = async () => {
    setIsLoading(true);

    const { data, error } = await supabase
      .from('casos_exito')
      .select(`
        *,
        profiles:socio_id (nombre, apellido, telefono),
        aprobado_por_profile:aprobado_por (nombre, apellido)
      `)
      .order('created_at', { ascending: false });

    if (data) {
      setCasos(data as any);
    }

    setIsLoading(false);
  };

  const handleModerate = (caso: CasoExito, action: 'aprobar' | 'rechazar') => {
    setSelectedCaso(caso);
    setModalAction(action);
    setComentario('');
    setShowModal(true);
  };

  const handleSubmitModeration = async () => {
    if (!selectedCaso) return;

    setIsSubmitting(true);

    try {
      const updates: any = {
        estatus: modalAction === 'aprobar' ? 'aprobado' : 'rechazado',
        comentario_moderacion: comentario || null,
      };

      if (modalAction === 'aprobar') {
        updates.aprobado_por = user?.id;
        updates.fecha_aprobacion = new Date().toISOString();
      }

      const { error } = await supabase
        .from('casos_exito')
        .update(updates)
        .eq('id', selectedCaso.id);

      if (error) throw error;

      alert(
        `Caso ${modalAction === 'aprobar' ? 'aprobado' : 'rechazado'} exitosamente`
      );
      setShowModal(false);
      setSelectedCaso(null);
      loadCasos();
    } catch (error) {
      console.error('Error moderating caso:', error);
      alert('Error al moderar el caso');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (estatus: string) => {
    const badges = {
      pendiente: {
        icon: Clock,
        text: 'Pendiente',
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

  const filteredCasos = casos.filter((caso) => {
    if (!filterEstatus) return true;
    return caso.estatus === filterEstatus;
  });

  const estatusCount = {
    pendiente: casos.filter((c) => c.estatus === 'pendiente').length,
    aprobado: casos.filter((c) => c.estatus === 'aprobado').length,
    rechazado: casos.filter((c) => c.estatus === 'rechazado').length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Moderación de Casos de Éxito</h1>
          <p className="text-gray-600 mt-2">
            Revisa y aprueba los casos de éxito enviados por los socios
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition" onClick={() => setFilterEstatus('pendiente')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">
                  {estatusCount.pendiente}
                </p>
              </div>
              <Clock size={32} className="text-yellow-600" />
            </div>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition" onClick={() => setFilterEstatus('aprobado')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aprobados</p>
                <p className="text-3xl font-bold text-primary mt-1">
                  {estatusCount.aprobado}
                </p>
              </div>
              <CheckCircle size={32} className="text-primary" />
            </div>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition" onClick={() => setFilterEstatus('rechazado')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rechazados</p>
                <p className="text-3xl font-bold text-red-600 mt-1">
                  {estatusCount.rechazado}
                </p>
              </div>
              <XCircle size={32} className="text-red-600" />
            </div>
          </Card>
        </div>

        <Card>
          <div className="flex gap-4 mb-6">
            <select
              value={filterEstatus}
              onChange={(e) => setFilterEstatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendientes</option>
              <option value="aprobado">Aprobados</option>
              <option value="rechazado">Rechazados</option>
            </select>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Cargando casos...</p>
            </div>
          ) : filteredCasos.length === 0 ? (
            <div className="text-center py-12">
              <Award size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">
                {filterEstatus
                  ? `No hay casos con estado: ${filterEstatus}`
                  : 'No hay casos de éxito registrados'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCasos.map((caso) => (
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
                      {caso.profiles && (
                        <p className="text-sm text-gray-600">
                          Socio: {caso.profiles.nombre} {caso.profiles.apellido}
                          {caso.profiles.telefono && ` • ${caso.profiles.telefono}`}
                        </p>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-700 mb-3">{caso.descripcion_corta}</p>

                  {caso.descripcion_completa && (
                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <p className="text-sm text-gray-600 font-medium mb-1">
                        Descripción completa:
                      </p>
                      <p className="text-sm text-gray-600">{caso.descripcion_completa}</p>
                    </div>
                  )}

                  {caso.comentario_moderacion && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-3">
                      <p className="text-sm text-gray-700 font-medium mb-1">
                        Comentario de moderación:
                      </p>
                      <p className="text-sm text-gray-600">{caso.comentario_moderacion}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      <p>
                        Enviado el{' '}
                        {new Date(caso.created_at).toLocaleDateString('es-MX', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      {caso.fecha_aprobacion && caso.aprobado_por_profile && (
                        <p className="mt-1">
                          {caso.estatus === 'aprobado' ? 'Aprobado' : 'Rechazado'} por{' '}
                          {caso.aprobado_por_profile.nombre}{' '}
                          {caso.aprobado_por_profile.apellido} el{' '}
                          {new Date(caso.fecha_aprobacion).toLocaleDateString('es-MX', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      )}
                    </div>

                    {caso.estatus === 'pendiente' && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => handleModerate(caso, 'rechazar')}
                        >
                          <XCircle size={16} className="mr-2" />
                          Rechazar
                        </Button>
                        <Button onClick={() => handleModerate(caso, 'aprobar')}>
                          <CheckCircle size={16} className="mr-2" />
                          Aprobar
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {showModal && selectedCaso && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {modalAction === 'aprobar' ? 'Aprobar' : 'Rechazar'} Caso
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  {selectedCaso.titulo}
                </p>
                <p className="text-sm text-gray-600">{selectedCaso.url_sitio}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comentario interno (opcional)
                </label>
                <textarea
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder={
                    modalAction === 'aprobar'
                      ? 'Notas sobre la aprobación (opcional)'
                      : 'Razón del rechazo (opcional)'
                  }
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  fullWidth
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSubmitModeration}
                  disabled={isSubmitting}
                  fullWidth
                  className={
                    modalAction === 'rechazar'
                      ? 'bg-red-600 hover:bg-red-700'
                      : ''
                  }
                >
                  {isSubmitting
                    ? 'Procesando...'
                    : modalAction === 'aprobar'
                    ? 'Confirmar Aprobación'
                    : 'Confirmar Rechazo'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
