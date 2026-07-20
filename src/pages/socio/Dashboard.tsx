import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Users, TrendingUp, DollarSign, Clock, QrCode, Copy, X, ExternalLink, PartyPopper } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/Button';
import { QRCodeSVG } from 'qrcode.react';

export const SocioDashboard = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showVentaBanner, setShowVentaBanner] = useState(false);
  const [metrics, setMetrics] = useState({
    leadsActivos: 0,
    ventasMes: 0,
    comisionesPendientes: 0,
    enSeguimiento: 0
  });
  const [showWizardModal, setShowWizardModal] = useState(false);
  const [wizardLink, setWizardLink] = useState('');
  const [generatingLink, setGeneratingLink] = useState(false);

  useEffect(() => {
    if (user) {
      loadMetrics();
    }
  }, [user]);

  useEffect(() => {
    if (searchParams.get('venta') === '1') {
      setShowVentaBanner(true);
      setSearchParams({}, { replace: true });
      const timer = setTimeout(() => setShowVentaBanner(false), 8000);
      return () => clearTimeout(timer);
    }
  }, []);

  const loadMetrics = async () => {
    if (!user) return;

    try {
      const { data: leads } = await supabase
        .from('leads')
        .select('id, estado')
        .eq('socio_id', user.id);

      const leadsActivos = leads?.filter(l =>
        ['nuevo', 'en_seguimiento', 'calificado'].includes(l.estado)
      ).length || 0;

      const enSeguimiento = leads?.filter(l => l.estado === 'en_seguimiento').length || 0;

      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: ventas } = await supabase
        .from('ventas')
        .select('id')
        .eq('socio_id', user.id)
        .gte('fecha', startOfMonth.toISOString());

      const { data: comisiones } = await supabase
        .from('ventas')
        .select('comision_socio')
        .eq('socio_id', user.id)
        .eq('pagado_socio', false);

      const comisionesPendientes = comisiones?.reduce(
        (sum, v) => sum + (v.comision_socio || 0),
        0
      ) || 0;

      setMetrics({
        leadsActivos,
        ventasMes: ventas?.length || 0,
        comisionesPendientes,
        enSeguimiento
      });
    } catch (error) {
      console.error('Error loading metrics:', error);
    }
  };

  const generateWizardLink = async () => {
    if (!user) return;

    setGeneratingLink(true);
    try {
      // Generar un token único para este acceso al wizard
      const token = crypto.randomUUID();

      // Crear el registro de acceso
      const { error } = await supabase
        .from('wizard_accesos')
        .insert({
          socio_id: user.id,
          token,
          completed: false
        });

      if (error) throw error;

      // Generar el link público
      const link = `${window.location.origin}/wizard/${token}`;
      setWizardLink(link);
      setShowWizardModal(true);
    } catch (error) {
      console.error('Error generating wizard link:', error);
      alert('Error al generar el link del wizard');
    } finally {
      setGeneratingLink(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(wizardLink);
    alert('Link copiado al portapapeles');
  };

  return (
    <DashboardLayout>
      {showVentaBanner && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-xl px-5 py-4 flex items-start gap-3 shadow-sm">
          <PartyPopper className="text-green-500 flex-shrink-0 mt-0.5" size={22} />
          <div className="flex-1">
            <p className="font-bold text-green-800">¡Venta registrada con éxito!</p>
            <p className="text-sm text-green-700 mt-0.5">La venta ha sido guardada y la comisión se sumó a tus pendientes.</p>
          </div>
          <button onClick={() => setShowVentaBanner(false)} className="text-green-400 hover:text-green-600">
            <X size={18} />
          </button>
        </div>
      )}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Bienvenido a tu panel de control</p>
          </div>
          <Button onClick={generateWizardLink} disabled={generatingLink}>
            <QrCode className="w-5 h-5 mr-2" />
            {generatingLink ? 'Generando...' : 'Iniciar Wizard'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Leads Activos</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{metrics.leadsActivos}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ventas del Mes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{metrics.ventasMes}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Comisiones Pendientes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ${metrics.comisionesPendientes.toLocaleString('es-MX')}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En Seguimiento</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{metrics.enSeguimiento}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {showWizardModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Compartir Wizard</h2>
                <button
                  onClick={() => setShowWizardModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm">
                    <QRCodeSVG value={wizardLink} size={180} level="M" />
                  </div>
                  <p className="text-sm text-gray-500">Escanea este QR para abrir el wizard</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-3">Link del wizard:</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={wizardLink}
                      readOnly
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                    />
                    <button
                      onClick={copyToClipboard}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      Copiar
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => window.open(wizardLink, '_blank')}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                  Iniciar Wizard ahora
                </button>

                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Tip:</strong> Comparte este link con tus prospectos. Cuando completen el wizard,
                    aparecerán automáticamente en tu sección de Leads.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
