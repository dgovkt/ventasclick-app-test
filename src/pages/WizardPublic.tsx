import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import PageLayoutWizard from '../components/PageLayoutWizard';
import { WizardFlow, WizardStep } from '../components/WizardFlow';

interface ContentBlock {
  slug: string;
  title: string;
  description: string;
  value: string;
  meta: any;
}

export const WizardPublic = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [socioId, setSocioId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [content, setContent] = useState<Record<string, ContentBlock>>({});
  const [currentStep, setCurrentStep] = useState<WizardStep>('welcome');

  useEffect(() => {
    if (token) {
      validateToken();
      loadContent();
    }
  }, [token]);

  const validateToken = async () => {
    try {
      const { data, error } = await supabase
        .from('wizard_accesos')
        .select('socio_id, session_id, completed')
        .eq('token', token)
        .maybeSingle();

      if (error || !data) {
        setError('Link inválido o expirado');
        setLoading(false);
        return;
      }

      if (data.completed) {
        setError('Este link ya fue utilizado');
        setLoading(false);
        return;
      }

      setSocioId(data.socio_id);
      setSessionId(data.session_id);
      setLoading(false);
    } catch (err) {
      console.error('Error validating token:', err);
      setError('Error al validar el link');
      setLoading(false);
    }
  };

  const loadContent = async () => {
    try {
      const { data, error } = await supabase
        .from('content_blocks')
        .select('*')
        .eq('section', 'wizard');

      if (error) throw error;

      if (data) {
        const contentMap = data.reduce((acc, block) => {
          acc[block.slug] = block;
          return acc;
        }, {} as Record<string, ContentBlock>);
        setContent(contentMap);
      }
    } catch (err) {
      console.error('Error loading content:', err);
    }
  };

  const handleComplete = (redirectUrl?: string) => {
    if (redirectUrl) {
      window.location.href = redirectUrl;
    } else {
      window.location.href = 'https://www.ventasclick.com';
    }
  };

  const handleStepChange = (step: WizardStep) => {
    setCurrentStep(step);
  };

  const canGoBack = currentStep !== 'welcome' && currentStep !== 'success' && currentStep !== 'post_purchase';

  if (loading) {
    return (
      <PageLayoutWizard showBack={false}>
        <div className="text-center py-12">
          <p className="text-gray-500">Cargando...</p>
        </div>
      </PageLayoutWizard>
    );
  }

  if (error || !socioId) {
    return (
      <PageLayoutWizard showBack={false}>
        <div className="text-center py-12">
          <p className="text-red-600">{error || 'Error al cargar el wizard'}</p>
        </div>
      </PageLayoutWizard>
    );
  }

  return (
    <PageLayoutWizard
      showBack={canGoBack}
      onBack={() => {}}
    >
      <WizardFlow
        socioId={socioId}
        sessionId={sessionId}
        content={content}
        onComplete={handleComplete}
        onStepChange={handleStepChange}
      />
    </PageLayoutWizard>
  );
};
