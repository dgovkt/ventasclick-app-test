import { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import {
  CheckCircle, CreditCard, Loader2, Smartphone,
  Wifi, Video, Camera, PartyPopper, User,
  ExternalLink, Monitor, Phone, ChevronLeft, ShoppingBag, X, AlertCircle
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useChargebeeConfig } from '../hooks/useChargebeeConfig';
import { usePlanes } from '../hooks/usePlanes';
import { validateImageFile, sanitizeFilename } from '../lib/storage';

export type WizardStep = 'welcome' | 'diagnosis' | 'plan_details' | 'post_purchase' | 'success';

type Screen =
  | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17
  | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 28 | 29 | 30 | 31 | 'datos';

type DataIntent = 'comprar' | 'dejar_datos' | null;

type DiagOption = 'A' | 'B' | 'C' | 'D';
type PlanType = 'presencia_web' | 'tienda_en_linea';
type TiendaPlan = 'tienda_basico' | 'tienda_esencial' | 'tienda_premium';

interface ContentBlock {
  slug: string;
  title: string;
  description: string;
  value: string;
  meta: any;
}

interface ClientData {
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  queVende: string;
}

interface WizardFlowProps {
  socioId: string;
  sessionId: string | null;
  content: Record<string, ContentBlock>;
  onComplete?: (redirectUrl?: string) => void;
  onPurchaseComplete?: () => void;
  onStepChange?: (step: WizardStep) => void;
}

const VCLogo = ({ white = false }: { white?: boolean }) => (
  <div className={`flex items-center justify-center py-5 ${white ? '' : 'bg-white border-b border-gray-100'}`}>
    <img
      src="/VC-LOGOTIPO-H.png"
      alt="Ventas Click"
      className="h-11 w-auto"
      style={white ? { filter: 'brightness(0) invert(1)' } : undefined}
    />
  </div>
);

const Btn = ({
  children, onClick, disabled = false, variant = 'primary', type = 'button'
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'outline';
  type?: 'button' | 'submit';
}) => {
  const base = 'w-full py-4 px-6 text-base font-bold rounded-2xl transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed';
  const styles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200',
    outline: 'bg-white text-blue-600 border-2 border-blue-500 hover:bg-blue-50',
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${styles[variant]}`}>
      {children}
    </button>
  );
};

const BackBtn = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors px-6 pt-2 pb-1"
  >
    <ChevronLeft size={16} />
    Atrás
  </button>
);

const Bullet = ({ text }: { text: string }) => (
  <li className="flex items-start gap-2.5 text-sm text-gray-700 leading-relaxed">
    <span className="mt-1.5 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
    <span dangerouslySetInnerHTML={{ __html: text }} />
  </li>
);

const ImportantFact = ({ text }: { text: string }) => (
  <div className="bg-blue-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed">
    <strong className="text-gray-900">Dato importante: </strong>
    <span dangerouslySetInnerHTML={{ __html: text }} />
  </div>
);

const NumStep = ({ n }: { n: number }) => (
  <span className="inline-flex w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold items-center justify-center flex-shrink-0">
    {n}
  </span>
);

const DATA_FIELDS: { label: string; key: keyof ClientData; type: string; ph: string }[] = [
  { label: 'Nombre(s)', key: 'nombre', type: 'text', ph: 'Nombre(s)' },
  { label: 'Apellidos', key: 'apellidos', type: 'text', ph: 'Apellidos' },
  { label: 'Correo electrónico', key: 'email', type: 'email', ph: 'correo@ejemplo.com' },
  { label: 'Teléfono', key: 'telefono', type: 'tel', ph: '555 123 4567' },
  { label: '¿Qué vende?', key: 'queVende', type: 'text', ph: 'Describe el negocio' },
];

const DataForm = ({
  data,
  onChange
}: {
  data: ClientData;
  onChange: (key: keyof ClientData, value: string) => void;
}) => (
  <div className="space-y-4">
    {DATA_FIELDS.map(({ label, key, type, ph }) => (
      <div key={key}>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label} <span className="text-red-500">*</span>
        </label>
        <input
          type={type}
          value={data[key]}
          onChange={(e) => onChange(key, e.target.value)}
          placeholder={ph}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 placeholder:text-gray-400"
        />
      </div>
    ))}
  </div>
);

export function WizardFlow({ socioId, sessionId, content, onComplete, onPurchaseComplete }: WizardFlowProps) {
  const { config: chargebeeConfig } = useChargebeeConfig();
  const { getPrecio } = usePlanes();
  const [screen, setScreen] = useState<Screen>(1);
  const [plan, setPlan] = useState<PlanType | null>(null);
  const [diagOption, setDiagOption] = useState<DiagOption | null>(null);
  const [dataIntent, setDataIntent] = useState<DataIntent>(null);
  const [prevDataScreen, setPrevDataScreen] = useState<Screen>(7);
  const [clientData, setClientData] = useState<ClientData>({
    nombre: '', apellidos: '', email: '', telefono: '', queVende: ''
  });
  const [tiendaPlan, setTiendaPlan] = useState<TiendaPlan>('tienda_basico');
  const [saving, setSaving] = useState(false);
  const [ventaId, setVentaId] = useState<string | null>(null);
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [evidencePreviews, setEvidencePreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const cval = (slug: string, fallback = '') => content[slug]?.value || fallback;
  const cmeta = (slug: string): any => content[slug]?.meta || {};

  const go = (s: Screen) => {
    setScreen(s);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToDataWithIntent = (intent: DataIntent, from: Screen) => {
    setDataIntent(intent);
    setPrevDataScreen(from);
    go('datos');
  };

  const back = () => {
    const prevScreenMap: Partial<Record<string, Screen>> = {
      '2': 1,
      '3': 2,
      '4': 3,
      '5': 4,
      '6': 5,
      '7': 6,
      '8': 7,
      'datos': prevDataScreen,
      '18': 2,
      '19': 18,
      '20': 19,
      '21': 19,
      '22': 19,
      '23': 20,
      '24': 21,
      '25': 22,
    };
    const prev = prevScreenMap[String(screen)];
    if (prev !== undefined) go(prev);
  };

  const markDone = async () => {
    if (!sessionId) return;
    await supabase.from('wizard_accesos').update({ completed: true }).eq('session_id', sessionId);
  };

  const handleDiag = (opt: DiagOption) => {
    setDiagOption(opt);
    const p: PlanType = opt === 'D' ? 'tienda_en_linea' : 'presencia_web';
    setPlan(p);
    go(p === 'presencia_web' ? 3 : 18);
  };

  const handleComprar = async () => {
    setSaving(true);
    try {
      const planSlug = plan === 'presencia_web' ? 'presencia_web' : tiendaPlan;
      const { data: planData } = await supabase
        .from('planes').select('id, precio_anual, comision_socio, porcentaje_comision').eq('slug', planSlug).eq('activo', true).maybeSingle();

      if (!planData?.id) throw new Error('Plan no encontrado');

      const leadId = crypto.randomUUID();
      const ventaId = crypto.randomUUID();

      const { error: le } = await supabase.from('leads').insert({
        id: leadId,
        socio_id: socioId,
        nombre: clientData.nombre,
        apellidos: clientData.apellidos,
        email: clientData.email,
        telefono: clientData.telefono,
        que_vende: clientData.queVende,
        plan_recomendado_id: planData.id,
        estado: 'cerrado_ganado',
        origen: 'wizard'
      });

      if (le) throw le;

      const comision = planData.porcentaje_comision ? (planData.precio_anual * planData.porcentaje_comision) / 100 : (planData.comision_socio || 0);
      const { error: ve } = await supabase.from('ventas').insert({
        id: ventaId,
        socio_id: socioId,
        lead_id: leadId,
        plan_id: planData.id,
        monto: planData.precio_anual || 0,
        comision_socio: comision,
        estatus_pago: 'pendiente',
        notas: 'Venta generada desde wizard'
      });

      if (ve) throw ve;

      setVentaId(ventaId);

      await supabase.from('wizard_results').insert({
        socio_id: socioId,
        lead_id: leadId,
        plan_recomendado_id: planData.id,
        resultado: 'compro',
        diagnostico_opcion: diagOption
      });

      onPurchaseComplete?.();

      if (plan === 'presencia_web') {
        go(9);
      } else {
        const payScreen: Screen = tiendaPlan === 'tienda_basico' ? 23 : tiendaPlan === 'tienda_esencial' ? 24 : 25;
        go(payScreen);
      }
    } catch (err) {
      console.error(err);
      alert('Error al guardar. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  const handleGuardarProspecto = async () => {
    setSaving(true);
    try {
      const planSlug = plan === 'presencia_web' ? 'presencia_web' : tiendaPlan;
      const { data: planData } = await supabase
        .from('planes').select('id').eq('slug', planSlug).eq('activo', true).maybeSingle();

      await supabase.from('leads').insert({
        socio_id: socioId,
        nombre: clientData.nombre,
        apellidos: clientData.apellidos,
        email: clientData.email,
        telefono: clientData.telefono,
        que_vende: clientData.queVende,
        plan_recomendado_id: planData?.id || null,
        estado: 'nuevo',
        origen: 'wizard'
      });

      await supabase.from('wizard_results').insert({
        socio_id: socioId,
        lead_id: null,
        plan_recomendado_id: planData?.id || null,
        resultado: 'dejo_datos',
        diagnostico_opcion: diagOption
      });

      await markDone();
      go(plan === 'presencia_web' ? 16 : 31);
    } catch (err) {
      console.error(err);
      alert('Error al guardar. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  const handleNoDejarDatos = async () => {
    await markDone();
    go(plan === 'presencia_web' ? 16 : 31);
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploadError(null);
    const newFiles: File[] = [];
    const newPreviews: string[] = [];
    const maxFiles = 3;

    if (evidenceFiles.length + files.length > maxFiles) {
      setUploadError(`Solo puedes subir hasta ${maxFiles} fotos`);
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validation = validateImageFile(file);

      if (!validation.valid) {
        setUploadError(validation.error || 'Archivo inválido');
        return;
      }

      newFiles.push(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === files.length) {
          setEvidencePreviews([...evidencePreviews, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    }

    setEvidenceFiles([...evidenceFiles, ...newFiles]);
  };

  const removeEvidence = (index: number) => {
    const newFiles = evidenceFiles.filter((_, i) => i !== index);
    const newPreviews = evidencePreviews.filter((_, i) => i !== index);
    setEvidenceFiles(newFiles);
    setEvidencePreviews(newPreviews);
    setUploadError(null);
  };

  const handleEvidence = async () => {
    const nextScreen: Screen = plan === 'presencia_web' ? 16 : 31;
    if (evidenceFiles.length === 0) { await markDone(); go(nextScreen); return; }

    setUploading(true);
    setUploadError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        await markDone();
        go(nextScreen);
        return;
      }

      for (const file of evidenceFiles) {
        const sanitized = sanitizeFilename(file.name);
        const path = `${socioId}/${Date.now()}_${sanitized}`;
        const { data: up, error: uploadError } = await supabase.storage.from('evidencias').upload(path, file);
        if (uploadError) {
          console.error('Storage upload error:', uploadError.message, uploadError);
          setUploadError(`Error al subir: ${uploadError.message}`);
          setUploading(false);
          return;
        }
        if (up && ventaId) {
          const { error: insertError } = await supabase.from('evidencias_ventas').insert({
            venta_id: ventaId, foto_url: up.path, tipo: 'activacion_app'
          });
          if (insertError) {
            console.error('Evidence insert error:', insertError.message, insertError);
            setUploadError(`Error al guardar: ${insertError.message}`);
            setUploading(false);
            return;
          }
        }
      }
    } catch (err) {
      console.error('Upload error:', err);
      setUploadError('Error al subir las evidencias. Por favor intenta de nuevo.');
      setUploading(false);
      return;
    } finally {
      setUploading(false);
    }
    await markDone();
    go(nextScreen);
  };

  const dataValid = clientData.nombre && clientData.apellidos &&
    clientData.email && clientData.telefono && clientData.queVende;

  const BenefitScreen = ({
    slug, next
  }: { slug: string; next: Screen }) => {
    const m = cmeta(slug);
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <VCLogo />
        <BackBtn onClick={back} />
        <div className="flex-1 px-6 pb-6 space-y-4 overflow-y-auto">
          <p className="text-xs text-gray-400 uppercase tracking-wide">
            {m.plan_label || (plan === 'presencia_web' ? 'El plan Presencia Web incluye:' : 'El plan Tienda en Línea incluye:')}
          </p>
          <h1 className="text-2xl font-bold text-blue-600">{cval(slug)}</h1>
          {m.subtitulo && <p className="font-semibold text-gray-800 text-sm">{m.subtitulo}</p>}
          {m.descripcion && <p className="text-sm text-gray-700 leading-relaxed">{m.descripcion}</p>}
          {m.bullets && m.bullets.length > 0 && (
            <ul className="space-y-2.5">
              {m.bullets.map((b: string, i: number) => <Bullet key={i} text={b} />)}
            </ul>
          )}
          {m.como_funciona && (
            <div className="space-y-1">
              <p className="font-semibold text-sm text-gray-800">¿Cómo funciona?</p>
              <p className="text-sm text-gray-700">{m.como_funciona}</p>
            </div>
          )}
          {m.dato_importante && <ImportantFact text={m.dato_importante} />}
          {m.link_texto && (
            <a
              href={m.link_url || '#'}
              target={m.link_url ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="inline-block text-blue-600 font-semibold text-sm hover:underline"
            >
              {m.link_texto}
            </a>
          )}
        </div>
        <div className="px-6 pb-8 pt-2">
          <Btn onClick={() => go(next)}>{m.cta_primario || 'Continuar'}</Btn>
        </div>
      </div>
    );
  };

  // ── PANTALLA 1: Bienvenida ──────────────────────────────────────────────────
  if (screen === 1) {
    const m = cmeta('wizard.screen_1');
    return (
      <div className="flex flex-col min-h-screen relative overflow-hidden bg-gray-900">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800)`,
            filter: 'brightness(0.45)'
          }}
        />
        <div className="relative z-10 flex flex-col min-h-screen">
          <VCLogo white />
          <div className="flex-1 px-6 flex flex-col justify-end pb-14 space-y-5">
            <h1 className="text-4xl font-extrabold text-white">
              {cval('wizard.screen_1', 'Hola,')}
            </h1>
            <p className="text-lg font-bold text-white leading-snug">
              {m.subtitulo || 'Estás por ayudar a un negocio a dar su siguiente paso al mundo digital.'}
            </p>
            <p className="text-sm text-blue-100 leading-relaxed">
              {m.descripcion || '¡Comencemos por descubrir juntos qué solución de Ventas Click necesita!'}
            </p>
            <div className="pt-2">
              <button
                onClick={() => go(2)}
                className="bg-blue-600 text-white font-bold py-4 px-8 rounded-2xl text-base hover:bg-blue-700 transition-all active:scale-[0.98] shadow-lg"
              >
                {m.cta_primario || 'Comenzar diagnóstico'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── PANTALLA 2: Diagnóstico ─────────────────────────────────────────────────
  if (screen === 2) {
    const tm = cmeta('wizard.screen_2.titulo');
    const opts: { key: DiagOption; slug: string }[] = [
      { key: 'A', slug: 'wizard.screen_2.opcion_a' },
      { key: 'B', slug: 'wizard.screen_2.opcion_b' },
      { key: 'C', slug: 'wizard.screen_2.opcion_c' },
      { key: 'D', slug: 'wizard.screen_2.opcion_d' },
    ];
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <VCLogo />
        <BackBtn onClick={back} />
        <div className="flex-1 px-6 pb-8 space-y-5 overflow-y-auto">
          <h2 className="text-xl font-bold text-gray-800">
            {cval('wizard.screen_2.titulo', 'Pregunta al dueño del negocio:')}
          </h2>
          <h3 className="text-2xl font-bold text-blue-600">
            {tm.pregunta || '¿Cómo vende actualmente tu negocio?'}
          </h3>
          <div className="space-y-4">
            {opts.map(({ key, slug }) => {
              const m = cmeta(slug);
              return (
                <div key={key} className="rounded-2xl border border-gray-100 bg-gray-50 p-4 space-y-2">
                  <p className="font-bold text-sm text-gray-800">{cval(slug, `Opción ${key}`)}</p>
                  {m.descripcion && <p className="text-xs text-gray-500 leading-relaxed">{m.descripcion}</p>}
                  <button
                    onClick={() => handleDiag(key)}
                    className="bg-blue-600 text-white font-semibold py-2.5 px-6 rounded-xl text-sm hover:bg-blue-700 transition-all active:scale-[0.98]"
                  >
                    {m.cta || 'Seleccionar'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── PANTALLA 3: Detectamos Presencia Web ───────────────────────────────────
  if (screen === 3) {
    const m = cmeta('wizard.screen_3');
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <VCLogo />
        <BackBtn onClick={back} />
        <div className="flex-1 px-8 pb-8 flex flex-col items-center justify-center space-y-6 text-center">
          <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="text-green-500" size={52} />
          </div>
          <h1 className="text-2xl font-bold text-blue-600">
            {cval('wizard.screen_3', '¡Listo! Ya detectamos qué necesita este negocio.')}
          </h1>
          <p className="text-gray-700 text-sm leading-relaxed">
            {m.descripcion || 'Este cliente requiere una presencia profesional en internet para que más personas lo encuentren, lo conozcan y le tengan confianza.'}
          </p>
          <p className="font-bold text-gray-800 text-base leading-snug">
            {m.subtitulo || '¡Vamos a decirle paso a paso qué incluye el Plan Presencia Web!'}
          </p>
        </div>
        <div className="px-6 pb-8">
          <Btn onClick={() => go(4)}>{m.cta_primario || 'Continuar'}</Btn>
        </div>
      </div>
    );
  }

  // ── PANTALLAS 4-6: Beneficios Presencia Web ────────────────────────────────
  if (screen === 4) return <BenefitScreen slug="wizard.screen_4" next={5} />;
  if (screen === 5) return <BenefitScreen slug="wizard.screen_5" next={6} />;
  if (screen === 6) return <BenefitScreen slug="wizard.screen_6" next={7} />;

  // ── PANTALLA 7: Tarjetas NFC (último beneficio PW) + botones de acción ─────
  if (screen === 7) {
    const m = cmeta('wizard.screen_7');
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <VCLogo />
        <BackBtn onClick={back} />
        <div className="flex-1 px-6 pb-6 space-y-4 overflow-y-auto">
          <p className="text-xs text-gray-400 uppercase tracking-wide">
            {m.plan_label || 'El plan Presencia Web incluye:'}
          </p>
          <h1 className="text-2xl font-bold text-blue-600">{cval('wizard.screen_7')}</h1>
          {m.subtitulo && <p className="font-semibold text-gray-800 text-sm">{m.subtitulo}</p>}
          {m.descripcion && <p className="text-sm text-gray-700 leading-relaxed">{m.descripcion}</p>}
          {m.bullets && m.bullets.length > 0 && (
            <ul className="space-y-2.5">
              {m.bullets.map((b: string, i: number) => <Bullet key={i} text={b} />)}
            </ul>
          )}
          {m.dato_importante && <ImportantFact text={m.dato_importante} />}
        </div>
        <div className="px-6 pb-8 space-y-3">
          <Btn onClick={() => go(8)}>
            {m.cta_primario || 'Continuar'}
          </Btn>
        </div>
      </div>
    );
  }

  // ── PANTALLA 8: Precio Presencia Web ───────────────────────────────────────
  if (screen === 8) {
    const m = cmeta('wizard.screen_8');
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <VCLogo />
        <BackBtn onClick={back} />
        <div className="flex-1 px-6 pb-8 flex flex-col items-center justify-center space-y-6 text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-200">
            <CreditCard className="text-white" size={40} />
          </div>
          <div className="space-y-1.5">
            <p className="text-sm text-gray-500">
              {cval('wizard.screen_8', 'Menciona al dueño de negocio el costo de Plan Presencia Web:')}
            </p>
            <p className="text-3xl font-extrabold text-gray-900">
              {getPrecio('presencia_web', '$3,499') + ' MXN'}
            </p>
            <p className="text-sm font-semibold text-gray-500">— {m.frecuencia || 'Pago Anual + IVA'}</p>
          </div>
          <div className="w-full text-left space-y-2">
            <h3 className="text-xl font-bold text-blue-600">{m.subtitulo || '¿Qué sigue? Adquirir plan'}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{m.descripcion || 'Dile al dueño del negocio que puede activar su plan ahora mismo. La activación es inmediata y, en minutos, queda habilitado su sitio, su Portal Click y el acceso a su aplicación.'}</p>
          </div>
        </div>
        <div className="px-6 pb-8 space-y-3">
          <Btn onClick={() => goToDataWithIntent('comprar', 8)} disabled={saving}>
            {m.cta_primario || 'Adquirir plan ahora'}
          </Btn>
          <Btn variant="outline" onClick={() => goToDataWithIntent('dejar_datos', 8)} disabled={saving}>
            {m.cta_secundario || 'Quiere dejar sus datos'}
          </Btn>
        </div>
      </div>
    );
  }

  // ── PANTALLA datos: Formulario datos del cliente ───────────────────────────
  if (screen === 'datos') {
    const isComprar = dataIntent === 'comprar';
    const isDejarDatos = dataIntent === 'dejar_datos';

    return (
      <div className="flex flex-col min-h-screen bg-white">
        <VCLogo />
        <BackBtn onClick={back} />
        <div className="flex-1 px-6 pb-8 space-y-5 overflow-y-auto">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="text-blue-600" size={28} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              {isComprar ? 'Datos para el pago' : 'Datos del prospecto'}
            </h2>
            <p className="text-sm text-gray-500">
              {isComprar
                ? 'Completa los datos del dueño del negocio antes de proceder al pago.'
                : 'Registra los datos del dueño del negocio para darle seguimiento.'}
            </p>
          </div>
          <DataForm data={clientData} onChange={(key, value) => setClientData(prev => ({ ...prev, [key]: value }))} />
        </div>
        <div className="px-6 pb-8 space-y-3">
          {isComprar && (
            <Btn onClick={handleComprar} disabled={saving || !dataValid}>
              {saving ? 'Procesando...' : 'Continuar al pago'}
            </Btn>
          )}
          {isDejarDatos && (
            <>
              <Btn onClick={handleGuardarProspecto} disabled={saving || !dataValid}>
                {saving ? 'Guardando...' : 'Guardar datos'}
              </Btn>
              <Btn variant="outline" onClick={handleNoDejarDatos} disabled={saving}>
                Prefiere no dejar sus datos
              </Btn>
            </>
          )}
        </div>
      </div>
    );
  }

  // ── helper: abre checkout Chargebee via openCheckout con hosted URL ─────────
  const openCbCheckout = (itemPriceId: string, onSuccess: () => void) => {
    const cb = (window as any).Chargebee?.getInstance?.();
    if (!cb) return;
    const site = chargebeeConfig?.siteName || 'ventasclick';
    const checkoutUrl = `https://${site}.chargebee.com/hosted_pages/checkout?subscription_items[item_price_id][0]=${encodeURIComponent(itemPriceId)}&subscription_items[quantity][0]=1`;
    cb.openCheckout({
      hostedPage: () => Promise.resolve({ url: checkoutUrl }),
      success: () => { onSuccess(); },
      close: () => {},
    });
  };

  // ── PANTALLA 9: Pago Presencia Web ─────────────────────────────────────────
  if (screen === 9) {
    const m = cmeta('wizard.screen_9');
    const cbItem = m.chargebee_item || chargebeeConfig?.planPresenciaWeb || 'TP-000P-MXN-Yearly';
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <VCLogo />
        <div className="flex-1 px-8 pb-8 flex flex-col items-center justify-center space-y-6 text-center">
          <Loader2 className="text-pink-500 animate-spin" size={72} strokeWidth={1.5} />
          <h1 className="text-2xl font-bold text-blue-600">
            {cval('wizard.screen_9', '¡Felicidades! Estás a punto de concretar una venta.')}
          </h1>
          <p className="text-sm text-gray-700 leading-relaxed">
            {m.descripcion || 'Ahora, junto con el dueño del negocio, realicen el pago del Plan Presencia Web.'}
          </p>
          <p className="text-sm font-semibold text-gray-800">
            {m.instruccion || 'Va a necesitar ingresar los datos de su tarjeta y tener a la mano acceso a su correo electrónico, ¿están listos?'}
          </p>
        </div>
        <div className="px-6 pb-8 space-y-3">
          <Btn onClick={() => openCbCheckout(cbItem, () => go(10))}>
            <span className="flex items-center justify-center gap-2">
              <ExternalLink size={18} />
              {m.cta_pago || 'Activar Plan Presencia Web'}
            </span>
          </Btn>
          <p className="text-xs text-gray-400 text-center">Cuando el pago esté listo, presiona:</p>
          <Btn variant="outline" onClick={() => go(10)}>{m.cta_primario || 'Continuar'}</Btn>
        </div>
      </div>
    );
  }

  // ── PANTALLA 10: Pago exitoso Presencia Web ────────────────────────────────
  if (screen === 10) {
    const m = cmeta('wizard.screen_10');
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <VCLogo />
        <div className="flex-1 px-8 pb-8 flex flex-col items-center justify-center space-y-6 text-center">
          <div className="relative inline-block">
            <div className="w-20 h-20 rounded-full border-4 border-gray-800 bg-yellow-400 flex items-center justify-center">
              <span className="text-3xl font-black text-gray-800">$</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center border-2 border-white">
              <CheckCircle className="text-white" size={18} strokeWidth={3} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-blue-600">
            {cval('wizard.screen_10', '¡Listo! El pago del Plan Presencia Web fue registrado con éxito.')}
          </h1>
          <p className="text-sm text-gray-700">{m.descripcion || 'Ahora acompaña al dueño del negocio a visualizar su Presencia Web activada.'}</p>
          <p className="text-sm font-bold text-gray-800">{m.instruccion || 'Da clic en continuar y sigan estos sencillos pasos:'}</p>
        </div>
        <div className="px-6 pb-8">
          <Btn onClick={() => go(11)}>{m.cta_primario || 'Continuar'}</Btn>
        </div>
      </div>
    );
  }

  // ── PANTALLA 11: Descargar App + Ingresar ─────────────────────────────────
  if (screen === 11) {
    const m = cmeta('wizard.screen_11');
    const androidUrl = m.url_android || 'https://play.google.com/store';
    const iosUrl = m.url_ios || 'https://apps.apple.com';
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <VCLogo />
        <div className="flex-1 px-6 pb-6 space-y-5 overflow-y-auto">
          <h2 className="text-xl font-bold text-blue-600">
            {cval('wizard.screen_11', '1. Descargar la App Ventas Click')}
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            {m.descripcion || 'Pídele al dueño del negocio que abra su cámara y escanee el código QR para descargar la aplicación en su celular.'}
          </p>
          <div className="flex flex-col items-center gap-6 py-4">
            <div className="flex flex-col items-center gap-3">
              <div className="p-4 border-2 border-gray-200 rounded-2xl bg-white shadow-lg">
                <img
                  src="/PLAYSTORE_VENTAS_CLICK_-_google.png"
                  alt="Descarga en Google Play"
                  className="w-48 h-auto"
                />
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="p-4 border-2 border-gray-200 rounded-2xl bg-white shadow-lg">
                <img
                  src="/PLAYSTORE_VENTAS_CLICK_-_appstore.png"
                  alt="Descarga en App Store"
                  className="w-48 h-auto"
                />
              </div>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-4 space-y-3">
            <h2 className="text-xl font-bold text-blue-600">{m.titulo_2 || '2. Ingresar a la App Ventas Click'}</h2>
            <p className="text-sm text-gray-700">{m.descripcion_2 || 'Una vez descargada la App:'}</p>
            {(m.pasos_2 || [
              '-Pide al dueño del negocio abrir su correo electrónico con el que se registró.',
              '-Dentro del correo que recibió, encontrará su usuario y contraseña.'
            ]).map((p: string, i: number) => (
              <p key={i} className="text-sm text-gray-700">{p}</p>
            ))}
          </div>
        </div>
        <div className="px-6 pb-8 pt-2">
          <Btn onClick={() => go(12)}>{m.cta_primario || 'Continuar'}</Btn>
        </div>
      </div>
    );
  }

  // ── PANTALLA 12: Visualizar sitio web ─────────────────────────────────────
  if (screen === 12) {
    const m = cmeta('wizard.screen_12');
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <VCLogo />
        <div className="flex-1 px-6 pb-6 space-y-4 overflow-y-auto">
          <div className="flex justify-center py-2">
            <div className="w-16 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Monitor className="text-blue-600" size={28} />
            </div>
          </div>
          <h2 className="text-xl font-bold text-blue-600">{cval('wizard.screen_12', '3. Visualizar su sitio web')}</h2>
          <p className="text-sm text-gray-700">{m.descripcion || 'Dentro de la App:'}</p>
          <ol className="space-y-3">
            {(m.pasos || [
              'Entren al menú "Productos".',
              'Seleccionen "Página Web".',
              'Encontrarán la información básica que se registró al comprar el plan.'
            ]).map((p: string, i: number) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                <NumStep n={i + 1} />
                <span>{p}</span>
              </li>
            ))}
          </ol>
          {m.subtitulo && <p className="font-bold text-gray-800 text-sm">{m.subtitulo}</p>}
          {m.bullets && (
            <ul className="space-y-2">
              {m.bullets.map((b: string, i: number) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          )}
          {m.cierre && <p className="text-sm text-gray-700">{m.cierre}</p>}
        </div>
        <div className="px-6 pb-8 pt-2">
          <Btn onClick={() => go(13)}>{m.cta_primario || 'Continuar'}</Btn>
        </div>
      </div>
    );
  }

  // ── PANTALLA 13: Portal Click + Tarjetas NFC ──────────────────────────────
  if (screen === 13) {
    const m = cmeta('wizard.screen_13');
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <VCLogo />
        <div className="flex-1 px-6 pb-6 space-y-4 overflow-y-auto">
          <div className="flex justify-center py-2">
            <Smartphone className="text-blue-500" size={44} />
          </div>
          <h2 className="text-xl font-bold text-blue-600">{cval('wizard.screen_13', '3. Visualizar su Portal Click')}</h2>
          <p className="text-sm text-gray-700">{m.descripcion || 'Dentro de la App:'}</p>
          {(m.pasos || ['Entren al menú "Productos".', 'Seleccionen "Portal Click".']).map((p: string, i: number) => (
            <div key={i} className="flex items-start gap-3 text-sm text-gray-700">
              <NumStep n={i + 1} />
              <span>{p}</span>
            </div>
          ))}
          {m.descripcion_extra && <p className="text-sm text-gray-700">{m.descripcion_extra}</p>}
          <div className="border-t border-gray-100 pt-4 space-y-3">
            <div className="flex justify-center">
              <Wifi className="text-pink-500" size={44} />
            </div>
            <h2 className="text-xl font-bold text-blue-600">{m.titulo_2 || '4. Esperar sus Tarjetas NFC'}</h2>
            <p className="text-sm font-semibold text-gray-800">{m.descripcion_2 || 'Mencionale que recibirá dos tarjetas NFC directamente en su domicilio, junto con las instrucciones para activarlas.'}</p>
            {m.cierre && <p className="text-sm text-gray-600">{m.cierre}</p>}
          </div>
        </div>
        <div className="px-6 pb-8 pt-2">
          <Btn onClick={() => go(14)}>{m.cta_primario || 'Continuar'}</Btn>
        </div>
      </div>
    );
  }

  // ── PANTALLA 14: Llamada inducción + Soporte ──────────────────────────────
  if (screen === 14) {
    const m = cmeta('wizard.screen_14');
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <VCLogo />
        <div className="flex-1 px-6 pb-6 space-y-4 overflow-y-auto">
          <div className="flex justify-center py-2">
            <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center">
              <Video className="text-white" size={30} />
            </div>
          </div>
          <h2 className="text-xl font-bold text-blue-600">{cval('wizard.screen_14', '5. Recuérdale su llamada de inducción')}</h2>
          <p className="text-sm text-gray-700">{m.descripcion || 'Tu cliente recibirá una llamada de inducción donde le explicarán, paso a paso, cómo:'}</p>
          {m.bullets && (
            <ul className="space-y-2">
              {m.bullets.map((b: string, i: number) => <Bullet key={i} text={b} />)}
            </ul>
          )}
          <div className="border-t border-gray-100 pt-4 space-y-3">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
                <Phone className="text-yellow-600" size={28} />
              </div>
            </div>
            <h2 className="text-xl font-bold text-blue-600">{m.titulo_2 || '6. Comparte el enlace de Soporte'}</h2>
            <p className="text-sm text-gray-700">{m.descripcion_2 || 'Para cualquier duda futura, pídele que guarde este enlace:'}</p>
            {m.link_soporte && (
              <a
                href={m.link_soporte}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-1.5 text-blue-600 font-semibold text-sm hover:underline break-all"
              >
                <ExternalLink size={14} className="flex-shrink-0 mt-0.5" />
                {m.link_soporte}
              </a>
            )}
          </div>
        </div>
        <div className="px-6 pb-8 pt-2">
          <Btn onClick={() => go(15)}>{m.cta_primario || 'Continuar'}</Btn>
        </div>
      </div>
    );
  }

  // ── PANTALLA 15: Carga de evidencia ───────────────────────────────────────
  if (screen === 15) {
    const m = cmeta('wizard.screen_15');
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <VCLogo />
        <div className="flex-1 px-6 pb-6 space-y-4 overflow-y-auto">
          <div className="flex justify-center py-2">
            <Camera className="text-yellow-500" size={56} strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-bold text-blue-600">{cval('wizard.screen_15', 'Antes de finalizar, carga evidencia')}</h2>
          <p className="text-sm text-gray-700">{m.descripcion || 'Antes de continuar, asegúrate de guardar evidencia de que el dueño del negocio ingresó correctamente a su aplicación.'}</p>
          {m.instruccion && <p className="font-bold text-sm text-gray-800">{m.instruccion}</p>}
          {m.bullets && (
            <ul className="space-y-2">
              {m.bullets.map((b: string, i: number) => <Bullet key={i} text={b} />)}
            </ul>
          )}
          {m.nota && <p className="text-xs text-gray-500 italic">{m.nota}</p>}
          {uploadError && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <span>{uploadError}</span>
            </div>
          )}
          {evidencePreviews.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {evidencePreviews.map((preview, i) => (
                <div key={i} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${i + 1}`}
                    className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeEvidence(i)}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                  <p className="text-xs text-gray-500 mt-1 truncate">{evidenceFiles[i]?.name}</p>
                </div>
              ))}
            </div>
          )}
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <Camera className="mx-auto text-gray-300 mb-3" size={40} />
            <p className="text-sm font-medium text-gray-500">
              {evidenceFiles.length > 0 ? 'Añadir más fotos' : 'Toca para seleccionar foto'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {evidenceFiles.length > 0 ? `${evidenceFiles.length}/3 fotos seleccionadas` : 'JPG, PNG o WEBP (máx. 5MB)'}
            </p>
            {evidenceFiles.length === 0 && (
              <button
                type="button"
                className="mt-3 bg-green-500 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Añade una foto desde tu ordenador
              </button>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
          />
        </div>
        <div className="px-6 pb-8 pt-2">
          <Btn onClick={handleEvidence} disabled={uploading}>
            {uploading ? 'Subiendo...' : (m.cta_primario || 'Continuar')}
          </Btn>
        </div>
      </div>
    );
  }

  // ── PANTALLA 16: Gracias Presencia Web ────────────────────────────────────
  if (screen === 16) {
    const m = cmeta('wizard.screen_16');
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <VCLogo />
        <div className="flex-1 px-8 pb-8 flex flex-col items-center justify-center space-y-6 text-center">
          <PartyPopper className="text-blue-400" size={80} strokeWidth={1.5} />
          <h1 className="text-2xl font-extrabold text-gray-800 leading-snug">
            {cval('wizard.screen_16', '¡Gracias por ayudar a un dueño de negocio a potenciar su Presencia Web!')}
          </h1>
        </div>
        <div className="px-6 pb-8">
          <Btn onClick={() => onComplete?.(m.redirect_url)}>{m.cta_primario || 'Volver a menú principal'}</Btn>
        </div>
      </div>
    );
  }

  // ── PANTALLA 17: Guardar datos del prospecto ──────────────────────────────
  if (screen === 17) {
    const m = cmeta('wizard.screen_17');
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <VCLogo />
        <BackBtn onClick={back} />
        <div className="flex-1 px-6 pb-8 space-y-5 overflow-y-auto">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center">
              <User className="text-white" size={40} />
            </div>
            <h2 className="text-xl font-bold text-blue-600">{cval('wizard.screen_17', 'Guardar los datos del prospecto')}</h2>
          </div>
          <p className="text-sm font-bold text-gray-800">
            {m.descripcion || 'El dueño de negocio mostró interés, pero decidió no activar el plan ahora. Por favor, completa los datos a continuación para poder contactarlo más adelante.'}
          </p>
          <DataForm data={clientData} onChange={(key, value) => setClientData(prev => ({ ...prev, [key]: value }))} />
        </div>
        <div className="px-6 pb-8">
          <Btn onClick={handleGuardarProspecto} disabled={saving || !dataValid}>
            {saving ? 'Guardando...' : (m.cta_primario || 'Guardar')}
          </Btn>
        </div>
      </div>
    );
  }

  // ── PANTALLA 18: Detectamos Tienda en Línea ───────────────────────────────
  if (screen === 18) {
    const m = cmeta('wizard.screen_18');
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <VCLogo />
        <BackBtn onClick={back} />
        <div className="flex-1 px-8 pb-8 flex flex-col items-center justify-center space-y-6 text-center">
          <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="text-green-500" size={52} />
          </div>
          <h1 className="text-2xl font-bold text-blue-600">
            {cval('wizard.screen_18', '¡Listo! Ya detectamos qué necesita este negocio.')}
          </h1>
          <p className="text-gray-700 text-sm leading-relaxed">
            {m.descripcion || 'Este cliente requiere una Tienda en Línea, lista para vender sus productos por internet, con carrito de compras, pagos y conexión a paquetería.'}
          </p>
          <p className="font-bold text-gray-800 text-base leading-snug">
            {m.subtitulo || 'Explícale que tenemos 3 opciones de planes diseñados según el tamaño de su inventario y sus metas de ventas.'}
          </p>
        </div>
        <div className="px-6 pb-8">
          <Btn onClick={() => go(19)}>{m.cta_primario || 'Continuar'}</Btn>
        </div>
      </div>
    );
  }

  // ── PANTALLA 19: Selección de plan Tienda ─────────────────────────────────
  if (screen === 19) {
    const m = cmeta('wizard.screen_19');
    const plans: { slug: TiendaPlan; label: string; screen: Screen; badge?: string; desc: string }[] = [
      {
        slug: 'tienda_basico',
        label: 'Plan Tienda Básico',
        screen: 20,
        desc: m.desc_basico || 'Para dar el primer paso digital.',
      },
      {
        slug: 'tienda_esencial',
        label: 'Plan Tienda Esencial',
        screen: 21,
        badge: m.badge_esencial || 'Más vendido',
        desc: m.desc_esencial || 'Para ampliar canales y promociones.',
      },
      {
        slug: 'tienda_premium',
        label: 'Plan Tienda Premium',
        screen: 22,
        desc: m.desc_premium || 'Para catálogos amplios y marketing avanzado.',
      },
    ];
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <VCLogo />
        <BackBtn onClick={back} />
        <div className="flex-1 px-6 pb-8 space-y-5 overflow-y-auto">
          <div className="space-y-1">
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              {m.plan_label || 'El plan Tienda en Línea incluye:'}
            </p>
            <h2 className="text-xl font-bold text-gray-800">
              {cval('wizard.screen_19', 'Selecciona el plan adecuado')}
            </h2>
            <p className="text-sm text-gray-500">
              {m.descripcion || 'Da clic en cada plan para conocer a detalle todos sus beneficios con el prospecto.'}
            </p>
          </div>
          <div className="space-y-4">
            {plans.map((p) => (
              <div key={p.slug} className="rounded-2xl border border-gray-100 bg-gray-50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-sm text-gray-800">{p.label}</p>
                  {p.badge && (
                    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{p.badge}</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{p.desc}</p>
                <button
                  onClick={() => { setTiendaPlan(p.slug); go(p.screen); }}
                  className="w-full bg-blue-600 text-white font-semibold py-2.5 px-6 rounded-xl text-sm hover:bg-blue-700 transition-all active:scale-[0.98]"
                >
                  {m.cta || 'Seleccionar'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── PANTALLA 20: Plan Tienda Básico ───────────────────────────────────────
  if (screen === 20) {
    const m = cmeta('wizard.screen_20');
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <VCLogo />
        <BackBtn onClick={back} />
        <div className="flex-1 px-6 pb-6 space-y-4 overflow-y-auto">
          <p className="text-xs text-gray-400 uppercase tracking-wide">
            {m.plan_label || 'El plan Tienda en Línea incluye:'}
          </p>
          <h1 className="text-2xl font-bold text-blue-600">
            {cval('wizard.screen_20', 'Tienda en Línea - Plan Básico')}
          </h1>
          <p className="font-bold text-sm text-gray-800">
            {m.precio_label || 'Precio:'} <span className="text-blue-600">{getPrecio('tienda_basico', '$3,999') + ' MXN + IVA (Anual)'}</span>
          </p>
          {m.subtitulo && <p className="font-semibold text-gray-800 text-sm">{m.subtitulo}</p>}
          {m.descripcion && <p className="text-sm text-gray-700 leading-relaxed">{m.descripcion}</p>}
          {m.bullets && m.bullets.length > 0 && (
            <ul className="space-y-2.5">
              {m.bullets.map((b: string, i: number) => <Bullet key={i} text={b} />)}
            </ul>
          )}
          {m.dato_importante && <ImportantFact text={m.dato_importante} />}
        </div>
        <div className="px-6 pb-8 space-y-3">
          <Btn onClick={() => goToDataWithIntent('comprar', 20)} disabled={saving}>
            {m.cta_primario || 'Adquirir plan ahora'}
          </Btn>
          <Btn variant="outline" onClick={() => goToDataWithIntent('dejar_datos', 20)} disabled={saving}>
            {m.cta_secundario || 'Quiere dejar sus datos'}
          </Btn>
        </div>
      </div>
    );
  }

  // ── PANTALLA 21: Plan Tienda Esencial ─────────────────────────────────────
  if (screen === 21) {
    const m = cmeta('wizard.screen_21');
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <VCLogo />
        <BackBtn onClick={back} />
        <div className="flex-1 px-6 pb-6 space-y-4 overflow-y-auto">
          <p className="text-xs text-gray-400 uppercase tracking-wide">
            {m.plan_label || 'El plan Tienda en Línea incluye:'}
          </p>
          <h1 className="text-2xl font-bold text-blue-600">
            {cval('wizard.screen_21', 'Tienda en Línea - Plan Esencial')}
          </h1>
          <p className="font-bold text-sm text-gray-800">
            {m.precio_label || 'Precio:'} <span className="text-blue-600">{getPrecio('tienda_esencial', '$5,999') + ' MXN + IVA (Anual)'}</span>
          </p>
          {m.subtitulo && <p className="font-semibold text-gray-800 text-sm">{m.subtitulo}</p>}
          {m.descripcion && <p className="text-sm text-gray-700 leading-relaxed">{m.descripcion}</p>}
          {m.bullets && m.bullets.length > 0 && (
            <ul className="space-y-2.5">
              {m.bullets.map((b: string, i: number) => <Bullet key={i} text={b} />)}
            </ul>
          )}
          {m.dato_importante && <ImportantFact text={m.dato_importante} />}
        </div>
        <div className="px-6 pb-8 space-y-3">
          <Btn onClick={() => goToDataWithIntent('comprar', 21)} disabled={saving}>
            {m.cta_primario || 'Adquirir plan ahora'}
          </Btn>
          <Btn variant="outline" onClick={() => goToDataWithIntent('dejar_datos', 21)} disabled={saving}>
            {m.cta_secundario || 'Quiere dejar sus datos'}
          </Btn>
        </div>
      </div>
    );
  }

  // ── PANTALLA 22: Plan Tienda Premium ──────────────────────────────────────
  if (screen === 22) {
    const m = cmeta('wizard.screen_22');
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <VCLogo />
        <BackBtn onClick={back} />
        <div className="flex-1 px-6 pb-6 space-y-4 overflow-y-auto">
          <p className="text-xs text-gray-400 uppercase tracking-wide">
            {m.plan_label || 'El plan Tienda en Línea incluye:'}
          </p>
          <h1 className="text-2xl font-bold text-blue-600">
            {cval('wizard.screen_22', 'Tienda en Línea - Plan Premium')}
          </h1>
          <p className="font-bold text-sm text-gray-800">
            {m.precio_label || 'Precio:'} <span className="text-blue-600">{getPrecio('tienda_premium', '$9,999') + ' MXN + IVA (Anual)'}</span>
          </p>
          {m.subtitulo && <p className="font-semibold text-gray-800 text-sm">{m.subtitulo}</p>}
          {m.descripcion && <p className="text-sm text-gray-700 leading-relaxed">{m.descripcion}</p>}
          {m.bullets && m.bullets.length > 0 && (
            <ul className="space-y-2.5">
              {m.bullets.map((b: string, i: number) => <Bullet key={i} text={b} />)}
            </ul>
          )}
          {m.dato_importante && <ImportantFact text={m.dato_importante} />}
        </div>
        <div className="px-6 pb-8 space-y-3">
          <Btn onClick={() => goToDataWithIntent('comprar', 22)} disabled={saving}>
            {m.cta_primario || 'Adquirir plan ahora'}
          </Btn>
          <Btn variant="outline" onClick={() => goToDataWithIntent('dejar_datos', 22)} disabled={saving}>
            {m.cta_secundario || 'Quiere dejar sus datos'}
          </Btn>
        </div>
      </div>
    );
  }

  // ── PANTALLA 23: Pago Plan Tienda Básico ──────────────────────────────────
  if (screen === 23) {
    const m = cmeta('wizard.screen_23');
    const cbItem = m.chargebee_item || chargebeeConfig?.planTiendaBasico || 'TP-001-MXN-Yearly';
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <VCLogo />
        <div className="flex-1 px-8 pb-8 flex flex-col items-center justify-center space-y-6 text-center">
          <Loader2 className="text-pink-500 animate-spin" size={72} strokeWidth={1.5} />
          <h1 className="text-2xl font-bold text-blue-600">
            {cval('wizard.screen_23', '¡Felicidades! Estás a punto de concretar una venta.')}
          </h1>
          <p className="text-sm text-gray-700 leading-relaxed">
            {m.descripcion || 'Ahora, junto con el dueño del negocio, realicen el pago del Plan Tienda en Línea Básica.'}
          </p>
          <p className="text-sm font-semibold text-gray-800">
            {m.instruccion || 'Va a necesitar ingresar los datos de su tarjeta y tener a la mano acceso a su correo electrónico, ¿están listos?'}
          </p>
        </div>
        <div className="px-6 pb-8 space-y-3">
          <Btn onClick={() => openCbCheckout(cbItem, () => go(26))}>
            <span className="flex items-center justify-center gap-2">
              <ExternalLink size={18} />
              {m.cta_pago || 'Activar Plan Tienda en Línea BÁSICA'}
            </span>
          </Btn>
          <p className="text-xs text-gray-400 text-center">Cuando el pago esté listo, presiona:</p>
          <Btn variant="outline" onClick={() => go(26)}>{m.cta_primario || 'Continuar'}</Btn>
        </div>
      </div>
    );
  }

  // ── PANTALLA 24: Pago Plan Tienda Esencial ────────────────────────────────
  if (screen === 24) {
    const m = cmeta('wizard.screen_24');
    const cbItem = m.chargebee_item || chargebeeConfig?.planTiendaEsencial || 'TP-002-MXN-Yearly';
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <VCLogo />
        <div className="flex-1 px-8 pb-8 flex flex-col items-center justify-center space-y-6 text-center">
          <Loader2 className="text-pink-500 animate-spin" size={72} strokeWidth={1.5} />
          <h1 className="text-2xl font-bold text-blue-600">
            {cval('wizard.screen_24', '¡Felicidades! Estás a punto de concretar una venta.')}
          </h1>
          <p className="text-sm text-gray-700 leading-relaxed">
            {m.descripcion || 'Ahora, junto con el dueño del negocio, realicen el pago del Plan Tienda en Línea Esencial.'}
          </p>
          <p className="text-sm font-semibold text-gray-800">
            {m.instruccion || 'Va a necesitar ingresar los datos de su tarjeta y tener a la mano acceso a su correo electrónico, ¿están listos?'}
          </p>
        </div>
        <div className="px-6 pb-8 space-y-3">
          <Btn onClick={() => openCbCheckout(cbItem, () => go(26))}>
            <span className="flex items-center justify-center gap-2">
              <ExternalLink size={18} />
              {m.cta_pago || 'Activar Plan Tienda en Línea Esencial'}
            </span>
          </Btn>
          <p className="text-xs text-gray-400 text-center">Cuando el pago esté listo, presiona:</p>
          <Btn variant="outline" onClick={() => go(26)}>{m.cta_primario || 'Continuar'}</Btn>
        </div>
      </div>
    );
  }

  // ── PANTALLA 25: Pago Plan Tienda Premium ─────────────────────────────────
  if (screen === 25) {
    const m = cmeta('wizard.screen_25');
    const cbItem = m.chargebee_item || chargebeeConfig?.planTiendaPremium || 'TP-003-MXN-Yearly';
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <VCLogo />
        <div className="flex-1 px-8 pb-8 flex flex-col items-center justify-center space-y-6 text-center">
          <Loader2 className="text-pink-500 animate-spin" size={72} strokeWidth={1.5} />
          <h1 className="text-2xl font-bold text-blue-600">
            {cval('wizard.screen_25', '¡Felicidades! Estás a punto de concretar una venta.')}
          </h1>
          <p className="text-sm text-gray-700 leading-relaxed">
            {m.descripcion || 'Ahora, junto con el dueño del negocio, realicen el pago del Plan Tienda en Línea Premium.'}
          </p>
          <p className="text-sm font-semibold text-gray-800">
            {m.instruccion || 'Va a necesitar ingresar los datos de su tarjeta y tener a la mano acceso a su correo electrónico, ¿están listos?'}
          </p>
        </div>
        <div className="px-6 pb-8 space-y-3">
          <Btn onClick={() => openCbCheckout(cbItem, () => go(26))}>
            <span className="flex items-center justify-center gap-2">
              <ExternalLink size={18} />
              {m.cta_pago || 'Activar Plan Tienda en Línea Premium'}
            </span>
          </Btn>
          <p className="text-xs text-gray-400 text-center">Cuando el pago esté listo, presiona:</p>
          <Btn variant="outline" onClick={() => go(26)}>{m.cta_primario || 'Continuar'}</Btn>
        </div>
      </div>
    );
  }

  // ── PANTALLA 26: Pago exitoso Tienda en Línea ─────────────────────────────
  if (screen === 26) {
    const m = cmeta('wizard.screen_26');
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <VCLogo />
        <div className="flex-1 px-8 pb-8 flex flex-col items-center justify-center space-y-6 text-center">
          <div className="relative inline-block">
            <div className="w-20 h-20 rounded-full border-4 border-gray-800 bg-yellow-400 flex items-center justify-center">
              <span className="text-3xl font-black text-gray-800">$</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center border-2 border-white">
              <CheckCircle className="text-white" size={18} strokeWidth={3} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-blue-600">
            {cval('wizard.screen_26', '¡Listo! El pago del Plan Tienda en Línea fue registrado con éxito.')}
          </h1>
          <p className="text-sm text-gray-700">
            {m.descripcion || 'Ahora mencionale al dueño de negocio que pronto recibirá una llamada para recabar datos de su negocio para que podamos comenzar a construir su tienda en línea.'}
          </p>
        </div>
        <div className="px-6 pb-8">
          <Btn onClick={() => go(28)}>{m.cta_primario || 'Continuar'}</Btn>
        </div>
      </div>
    );
  }

  // ── PANTALLA 28: Descargar App + Ingresar (Tienda) ────────────────────────
  if (screen === 28) {
    const m = cmeta('wizard.screen_28');
    const androidUrl = m.url_android || 'https://play.google.com/store';
    const iosUrl = m.url_ios || 'https://apps.apple.com';
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <VCLogo />
        <div className="flex-1 px-6 pb-6 space-y-5 overflow-y-auto">
          <h2 className="text-xl font-bold text-blue-600">
            {cval('wizard.screen_28', '1. Descargar la App Ventas Click')}
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            {m.descripcion || 'Pídele al dueño del negocio que abra su cámara y escanee el código QR para descargar la aplicación en su celular.'}
          </p>
          <div className="flex flex-col items-center gap-6 py-4">
            <div className="flex flex-col items-center gap-3">
              <div className="p-4 border-2 border-gray-200 rounded-2xl bg-white shadow-lg">
                <img
                  src="/PLAYSTORE_VENTAS_CLICK_-_google.png"
                  alt="Descarga en Google Play"
                  className="w-48 h-auto"
                />
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="p-4 border-2 border-gray-200 rounded-2xl bg-white shadow-lg">
                <img
                  src="/PLAYSTORE_VENTAS_CLICK_-_appstore.png"
                  alt="Descarga en App Store"
                  className="w-48 h-auto"
                />
              </div>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-4 space-y-3">
            <h2 className="text-xl font-bold text-blue-600">{m.titulo_2 || '2. Ingresar a la App Ventas Click'}</h2>
            <p className="text-sm text-gray-700">{m.descripcion_2 || 'Una vez descargada la App:'}</p>
            {(m.pasos_2 || [
              '-Pide al dueño del negocio abrir su correo electrónico con el que se registró.',
              '-Dentro del correo que recibió, encontrará su usuario y contraseña.'
            ]).map((p: string, i: number) => (
              <p key={i} className="text-sm text-gray-700">{p}</p>
            ))}
          </div>
        </div>
        <div className="px-6 pb-8 pt-2">
          <Btn onClick={() => go(29)}>{m.cta_primario || 'Continuar'}</Btn>
        </div>
      </div>
    );
  }

  // ── PANTALLA 29: Visualizar Tienda en App ─────────────────────────────────
  if (screen === 29) {
    const m = cmeta('wizard.screen_29');
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <VCLogo />
        <div className="flex-1 px-6 pb-6 space-y-4 overflow-y-auto">
          <div className="flex justify-center py-2">
            <div className="w-16 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <ShoppingBag className="text-blue-600" size={28} />
            </div>
          </div>
          <h2 className="text-xl font-bold text-blue-600 text-center">
            {cval('wizard.screen_29', '3. Visualizar Tienda en Línea en la App')}
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            {m.descripcion || 'Ahora que el dueño del negocio ha ingresado a la App, guíalo para que vea su Tienda en Línea:'}
          </p>
          <div className="space-y-3 bg-blue-50 p-4 rounded-lg">
            {(m.pasos || [
              '1. En el menú principal, busca la sección "Mi Tienda" o "Tienda en Línea".',
              '2. Allí podrá ver su tienda en construcción.',
              '3. Muy pronto recibirá una llamada para completar los datos de sus productos y personalizar su tienda.'
            ]).map((paso: string, idx: number) => (
              <p key={idx} className="text-sm text-gray-700">{paso}</p>
            ))}
          </div>
          <p className="text-sm text-gray-600 italic">
            {m.nota || '¡El dueño del negocio ya puede comenzar a explorar las funcionalidades de su nueva tienda en línea!'}
          </p>
        </div>
        <div className="px-6 pb-8 pt-2">
          <Btn onClick={() => go(30)}>{m.cta_primario || 'Continuar'}</Btn>
        </div>
      </div>
    );
  }

  // ── PANTALLA 30: Captura de Evidencia (Tienda) ────────────────────────────
  if (screen === 30) {
    const m = cmeta('wizard.screen_30');
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <VCLogo />
        <div className="flex-1 px-6 pb-6 space-y-4 overflow-y-auto">
          <div className="flex justify-center py-2">
            <div className="w-16 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <Camera className="text-green-600" size={28} />
            </div>
          </div>
          <h2 className="text-xl font-bold text-blue-600 text-center">
            {cval('wizard.screen_30', '4. Subir Evidencia de Activación')}
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            {m.descripcion || 'Para finalizar, toma una foto como evidencia de la activación exitosa de la Tienda en Línea.'}
          </p>
          {uploadError && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <span>{uploadError}</span>
            </div>
          )}
          {evidencePreviews.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {evidencePreviews.map((preview, i) => (
                <div key={i} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${i + 1}`}
                    className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeEvidence(i)}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                  <p className="text-xs text-gray-500 mt-1 truncate">{evidenceFiles[i]?.name}</p>
                </div>
              ))}
            </div>
          )}
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <Camera className="mx-auto text-gray-300 mb-3" size={40} />
            <p className="text-sm font-medium text-gray-500">
              {evidenceFiles.length > 0 ? 'Añadir más fotos' : 'Toca para seleccionar foto'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {evidenceFiles.length > 0 ? `${evidenceFiles.length}/3 fotos seleccionadas` : 'JPG, PNG o WEBP (máx. 5MB)'}
            </p>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
          />
        </div>
        <div className="px-6 pb-8 pt-2">
          <Btn onClick={handleEvidence} disabled={uploading}>
            {uploading ? 'Subiendo...' : m.cta_primario || 'Finalizar y Subir Evidencia'}
          </Btn>
        </div>
      </div>
    );
  }

  // ── PANTALLA 31: Gracias Tienda en Línea ──────────────────────────────────
  if (screen === 31) {
    const m = cmeta('wizard.screen_31');
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <VCLogo />
        <div className="flex-1 px-8 pb-8 flex flex-col items-center justify-center space-y-6 text-center">
          <PartyPopper className="text-blue-400" size={80} strokeWidth={1.5} />
          <h1 className="text-2xl font-extrabold text-gray-800 leading-snug">
            {cval('wizard.screen_31', '¡Gracias por ayudar a un dueño de negocio a comenzar a vender sus productos por Internet!')}
          </h1>
        </div>
        <div className="px-6 pb-8">
          <Btn onClick={() => onComplete?.(m.redirect_url)}>{m.cta_primario || 'Volver a menú principal'}</Btn>
        </div>
      </div>
    );
  }

  return null;
}
