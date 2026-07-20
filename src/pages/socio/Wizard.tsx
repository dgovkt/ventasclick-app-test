import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayoutWizard from '../../components/PageLayoutWizard';
import { WizardFlow, WizardStep } from '../../components/WizardFlow';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Megaphone, X, Play } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface ContentBlock {
  slug: string;
  title: string;
  description: string;
  value: string;
  meta: any;
}

export default function Wizard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [mode, setMode] = useState<'menu' | 'wizard'>('menu');
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [currentStep, setCurrentStep] = useState<WizardStep>('welcome');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [content, setContent] = useState<Record<string, ContentBlock>>({});

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const { data } = await supabase
        .from('content_blocks')
        .select('*')
        .eq('section', 'wizard');

      if (data) {
        const contentMap = data.reduce((acc, block) => {
          acc[block.slug] = block;
          return acc;
        }, {} as Record<string, ContentBlock>);
        setContent(contentMap);
      }
    } catch (error) {
      console.error('Error loading content:', error);
    }
  };

  const handleGenerateLink = async () => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      const token = crypto.randomUUID();

      const { error: insertError } = await supabase
        .from('wizard_accesos')
        .insert({
          socio_id: user.id,
          token: token,
          session_id: sessionId,
          ip_address: null,
          user_agent: navigator.userAgent
        });

      if (insertError) throw insertError;

      const appUrl = import.meta.env.VITE_APP_URL || window.location.origin;
      const link = `${appUrl}/wizard/public/${token}`;
      setGeneratedLink(link);
      setShowShareModal(true);
    } catch (error) {
      console.error('Error generating link:', error);
      alert('Error al generar el link: ' + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartWizardNow = async () => {
    if (!user) return;
    try {
      await supabase
        .from('wizard_accesos')
        .insert({
          socio_id: user.id,
          token: null,
          session_id: sessionId,
          ip_address: null,
          user_agent: navigator.userAgent
        });
      setMode('wizard');
    } catch (error) {
      console.error('Error starting wizard:', error);
      setMode('wizard');
    }
  };

  const handleCloseModal = () => {
    setShowShareModal(false);
    setGeneratedLink(null);
  };

  const handleStartFromModal = () => {
    setShowShareModal(false);
    setGeneratedLink(null);
    handleStartWizardNow();
  };

  const handleComplete = (_redirectUrl?: string) => {
    navigate('/socio/dashboard');
  };

  const handleStepChange = (step: WizardStep) => {
    setCurrentStep(step);
  };

  if (mode === 'wizard' && user) {
    const canGoBack = currentStep !== 'welcome' && currentStep !== 'success' && currentStep !== 'post_purchase';
    return (
      <PageLayoutWizard onBack={() => setMode('menu')} showBack={canGoBack}>
        <WizardFlow
          socioId={user.id}
          sessionId={sessionId}
          content={content}
          onComplete={handleComplete}
          onStepChange={handleStepChange}
        />
      </PageLayoutWizard>
    );
  }

  return (
    <PageLayoutWizard onBack={() => navigate('/socio/dashboard')} showBack={true}>
      <div className="space-y-8">
        <Card className="bg-gradient-to-br from-blue-50 to-white">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Wizard de Diagnóstico
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Elige cómo quieres usar el wizard con tu prospecto
            </p>

            <div className="max-w-sm mx-auto w-full">
              <Card className="bg-white border-2 border-blue-200 hover:border-blue-400 transition-all duration-200">
                <div className="text-center flex flex-col p-2">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Megaphone className="text-blue-600" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Iniciar Wizard
                  </h3>
                  <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                    Genera un link único con código QR para compartir con tu prospecto, o inicia el wizard directamente aquí mismo.
                  </p>
                  <Button
                    onClick={handleGenerateLink}
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Play size={18} />
                    {isSubmitting ? 'Preparando...' : 'Iniciar Wizard'}
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </Card>
      </div>

      {showShareModal && generatedLink && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Compartir Wizard</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
              >
                <X size={22} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex flex-col items-center py-6 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wide">
                  Escanea con el celular
                </p>
                <div className="bg-white p-4 rounded-xl border-2 border-blue-500 shadow-lg">
                  <QRCodeSVG value={generatedLink} size={200} level="H" />
                </div>
              </div>

              <button
                onClick={handleStartFromModal}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Play size={18} />
                Iniciar Wizard Aquí Mismo
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayoutWizard>
  );
}
