import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { DashboardLayout } from '../../components/DashboardLayout';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Save, Plus, Trash2, Monitor } from 'lucide-react';
import type { Database } from '../../lib/database.types';

type ContentBlock = Database['public']['Tables']['content_blocks']['Row'];
type ContentBlockInsert = Database['public']['Tables']['content_blocks']['Insert'];

interface WizardMeta {
  subtitulo?: string;
  descripcion?: string;
  dato_importante?: string;
  bullets?: string[];
  pasos?: string[];
  link_texto?: string;
  link_url?: string;
  cta_pago?: string;
  cta_primario?: string;
  cta_secundario?: string;
  cta?: string;
  precio?: string;
  frecuencia?: string;
  nota?: string;
  imagen_url?: string;
  plan_label?: string;
  como_funciona?: string;
  pregunta?: string;
  instruccion?: string;
  url_android?: string;
  url_ios?: string;
  titulo_2?: string;
  descripcion_2?: string;
  pasos_2?: string[];
  cierre?: string;
  descripcion_extra?: string;
  link_soporte?: string;
  chargebee_script?: string;
  desc_basico?: string;
  desc_esencial?: string;
  desc_premium?: string;
  badge_esencial?: string;
  redirect_url?: string;
}

type WizardMetaField = keyof WizardMeta;

interface WizardScreenInfo {
  label: string;
  group: string;
  groupColor: string;
  fields: WizardMetaField[];
}

const WIZARD_SCREEN_INFO: Record<string, WizardScreenInfo> = {
  'wizard.screen_1': {
    label: 'Pantalla 1 — Bienvenida',
    group: 'Inicio',
    groupColor: 'bg-amber-100 text-amber-800 border-amber-200',
    fields: ['subtitulo', 'descripcion', 'dato_importante', 'link_texto', 'link_url', 'cta_primario', 'imagen_url'],
  },
  'wizard.screen_2.titulo': {
    label: 'Pantalla 2 — Título del diagnóstico',
    group: 'Diagnóstico',
    groupColor: 'bg-amber-100 text-amber-800 border-amber-200',
    fields: ['pregunta', 'dato_importante', 'link_texto', 'link_url'],
  },
  'wizard.screen_2.opcion_a': {
    label: 'Pantalla 2 — Opción A',
    group: 'Diagnóstico',
    groupColor: 'bg-amber-100 text-amber-800 border-amber-200',
    fields: ['descripcion', 'dato_importante', 'link_texto', 'link_url', 'cta'],
  },
  'wizard.screen_2.opcion_b': {
    label: 'Pantalla 2 — Opción B',
    group: 'Diagnóstico',
    groupColor: 'bg-amber-100 text-amber-800 border-amber-200',
    fields: ['descripcion', 'dato_importante', 'link_texto', 'link_url', 'cta'],
  },
  'wizard.screen_2.opcion_c': {
    label: 'Pantalla 2 — Opción C',
    group: 'Diagnóstico',
    groupColor: 'bg-amber-100 text-amber-800 border-amber-200',
    fields: ['descripcion', 'dato_importante', 'link_texto', 'link_url', 'cta'],
  },
  'wizard.screen_2.opcion_d': {
    label: 'Pantalla 2 — Opción D',
    group: 'Diagnóstico',
    groupColor: 'bg-amber-100 text-amber-800 border-amber-200',
    fields: ['descripcion', 'dato_importante', 'link_texto', 'link_url', 'cta'],
  },
  'wizard.screen_3': {
    label: 'Pantalla 3 — Confirmación Plan Presencia Web',
    group: 'Plan Presencia Web',
    groupColor: 'bg-blue-100 text-blue-800 border-blue-200',
    fields: ['subtitulo', 'descripcion', 'plan_label', 'bullets', 'dato_importante', 'link_texto', 'link_url', 'cta_primario', 'cta_secundario'],
  },
  'wizard.screen_4': {
    label: 'Pantalla 4 — Sitio web profesional',
    group: 'Plan Presencia Web',
    groupColor: 'bg-blue-100 text-blue-800 border-blue-200',
    fields: ['subtitulo', 'descripcion', 'bullets', 'dato_importante', 'link_texto', 'link_url', 'cta_primario', 'imagen_url'],
  },
  'wizard.screen_5': {
    label: 'Pantalla 5 — Portal Click',
    group: 'Plan Presencia Web',
    groupColor: 'bg-blue-100 text-blue-800 border-blue-200',
    fields: ['subtitulo', 'descripcion', 'bullets', 'dato_importante', 'link_texto', 'link_url', 'cta_primario', 'imagen_url'],
  },
  'wizard.screen_6': {
    label: 'Pantalla 6 — Aplicación móvil Ventas Click',
    group: 'Plan Presencia Web',
    groupColor: 'bg-blue-100 text-blue-800 border-blue-200',
    fields: ['subtitulo', 'descripcion', 'bullets', 'dato_importante', 'link_texto', 'link_url', 'cta_primario', 'imagen_url'],
  },
  'wizard.screen_7': {
    label: 'Pantalla 7 — Tarjetas NFC',
    group: 'Plan Presencia Web',
    groupColor: 'bg-blue-100 text-blue-800 border-blue-200',
    fields: ['subtitulo', 'descripcion', 'bullets', 'dato_importante', 'link_texto', 'link_url', 'cta_primario', 'imagen_url'],
  },
  'wizard.screen_8': {
    label: 'Pantalla 8 — Precio Plan Presencia Web',
    group: 'Plan Presencia Web',
    groupColor: 'bg-blue-100 text-blue-800 border-blue-200',
    fields: ['subtitulo', 'precio', 'frecuencia', 'bullets', 'nota', 'dato_importante', 'cta_pago', 'cta_primario', 'cta_secundario', 'link_url'],
  },
  'wizard.screen_9': {
    label: 'Pantalla 9 — Concretar venta (Presencia Web)',
    group: 'Plan Presencia Web',
    groupColor: 'bg-blue-100 text-blue-800 border-blue-200',
    fields: ['subtitulo', 'descripcion', 'instruccion', 'dato_importante', 'cta_pago', 'link_url', 'chargebee_script', 'cta_primario'],
  },
  'wizard.screen_10': {
    label: 'Pantalla 10 — Pago registrado con éxito',
    group: 'Post-compra',
    groupColor: 'bg-green-100 text-green-800 border-green-200',
    fields: ['subtitulo', 'descripcion', 'instruccion', 'dato_importante', 'link_texto', 'link_url', 'cta_primario'],
  },
  'wizard.screen_11': {
    label: 'Pantalla 11 — Descargar e ingresar a la App',
    group: 'Post-compra',
    groupColor: 'bg-green-100 text-green-800 border-green-200',
    fields: ['subtitulo', 'descripcion', 'pasos', 'titulo_2', 'descripcion_2', 'pasos_2', 'url_android', 'url_ios', 'dato_importante', 'link_texto', 'link_url', 'cta_primario'],
  },
  'wizard.screen_12': {
    label: 'Pantalla 12 — Visualizar sitio web en la App',
    group: 'Post-compra',
    groupColor: 'bg-green-100 text-green-800 border-green-200',
    fields: ['subtitulo', 'descripcion', 'pasos', 'cierre', 'dato_importante', 'link_texto', 'link_url', 'cta_primario'],
  },
  'wizard.screen_13': {
    label: 'Pantalla 13 — Portal Click y Tarjetas NFC',
    group: 'Post-compra',
    groupColor: 'bg-green-100 text-green-800 border-green-200',
    fields: ['subtitulo', 'descripcion', 'descripcion_extra', 'cierre', 'dato_importante', 'link_texto', 'link_url', 'cta_primario'],
  },
  'wizard.screen_14': {
    label: 'Pantalla 14 — Llamada de inducción y soporte',
    group: 'Post-compra',
    groupColor: 'bg-green-100 text-green-800 border-green-200',
    fields: ['subtitulo', 'descripcion', 'link_soporte', 'dato_importante', 'link_texto', 'link_url', 'cta_primario'],
  },
  'wizard.screen_15': {
    label: 'Pantalla 15 — Carga de evidencia',
    group: 'Post-compra',
    groupColor: 'bg-green-100 text-green-800 border-green-200',
    fields: ['subtitulo', 'descripcion', 'instruccion', 'dato_importante', 'link_texto', 'link_url', 'cta_primario'],
  },
  'wizard.screen_16': {
    label: 'Pantalla 16 — Gracias / Cierre',
    group: 'Post-compra',
    groupColor: 'bg-green-100 text-green-800 border-green-200',
    fields: ['subtitulo', 'descripcion', 'dato_importante', 'link_texto', 'link_url', 'redirect_url', 'cta_primario'],
  },
  'wizard.screen_17': {
    label: 'Pantalla 17 — Guardar datos del prospecto',
    group: 'Prospecto',
    groupColor: 'bg-gray-100 text-gray-700 border-gray-200',
    fields: ['subtitulo', 'descripcion', 'dato_importante', 'link_texto', 'link_url', 'cta_primario', 'cta_secundario'],
  },
  'wizard.screen_18': {
    label: 'Pantalla 18 — Confirmación Plan Tienda en Línea',
    group: 'Plan Tienda en Línea',
    groupColor: 'bg-orange-100 text-orange-800 border-orange-200',
    fields: ['subtitulo', 'descripcion', 'plan_label', 'bullets', 'dato_importante', 'link_texto', 'link_url', 'cta_primario', 'cta_secundario'],
  },
  'wizard.screen_19': {
    label: 'Pantalla 19 — Selección de plan Tienda en Línea',
    group: 'Plan Tienda en Línea',
    groupColor: 'bg-orange-100 text-orange-800 border-orange-200',
    fields: ['plan_label', 'descripcion', 'desc_basico', 'desc_esencial', 'desc_premium', 'badge_esencial', 'cta'],
  },
  'wizard.screen_20': {
    label: 'Pantalla 20 — Catálogo con hasta 250 productos',
    group: 'Plan Tienda en Línea',
    groupColor: 'bg-orange-100 text-orange-800 border-orange-200',
    fields: ['subtitulo', 'descripcion', 'bullets', 'dato_importante', 'link_texto', 'link_url', 'cta_primario', 'imagen_url'],
  },
  'wizard.screen_21': {
    label: 'Pantalla 21 — Vende en todas partes',
    group: 'Plan Tienda en Línea',
    groupColor: 'bg-orange-100 text-orange-800 border-orange-200',
    fields: ['subtitulo', 'descripcion', 'bullets', 'dato_importante', 'link_texto', 'link_url', 'cta_primario', 'imagen_url'],
  },
  'wizard.screen_22': {
    label: 'Pantalla 22 — Cupones de descuento',
    group: 'Plan Tienda en Línea',
    groupColor: 'bg-orange-100 text-orange-800 border-orange-200',
    fields: ['subtitulo', 'descripcion', 'bullets', 'dato_importante', 'link_texto', 'link_url', 'cta_primario', 'cta_secundario', 'imagen_url'],
  },
  'wizard.screen_24': {
    label: 'Pantalla 24 — Precio Plan Tienda en Línea',
    group: 'Plan Tienda en Línea',
    groupColor: 'bg-orange-100 text-orange-800 border-orange-200',
    fields: ['subtitulo', 'precio', 'frecuencia', 'bullets', 'nota', 'dato_importante', 'cta_pago', 'cta_primario', 'cta_secundario', 'link_url'],
  },
  'wizard.screen_25': {
    label: 'Pantalla 25 — Concretar venta (Tienda en Línea)',
    group: 'Plan Tienda en Línea',
    groupColor: 'bg-orange-100 text-orange-800 border-orange-200',
    fields: ['subtitulo', 'descripcion', 'instruccion', 'dato_importante', 'cta_pago', 'link_url', 'chargebee_script', 'cta_primario'],
  },
  'wizard.screen_31': {
    label: 'Pantalla 31 — Gracias / Cierre (Tienda en Línea)',
    group: 'Plan Tienda en Línea',
    groupColor: 'bg-orange-100 text-orange-800 border-orange-200',
    fields: ['subtitulo', 'descripcion', 'dato_importante', 'redirect_url', 'cta_primario'],
  },
};

const FIELD_LABELS: Record<WizardMetaField, string> = {
  subtitulo: 'Subtítulo',
  descripcion: 'Descripción',
  dato_importante: 'Dato importante / Destacado',
  bullets: 'Puntos de beneficio (bullets)',
  pasos: 'Pasos numerados',
  link_texto: 'Texto del enlace adicional',
  link_url: 'URL de pago (Chargebee)',
  cta_pago: 'Texto del botón de pago',
  cta_primario: 'Texto del botón primario (CTA)',
  cta_secundario: 'Texto del botón secundario',
  cta: 'Texto del botón de opción',
  precio: 'Precio',
  frecuencia: 'Frecuencia / Periodo',
  nota: 'Nota al pie',
  imagen_url: 'URL de imagen',
  plan_label: 'Etiqueta del plan',
  como_funciona: '¿Cómo funciona?',
  pregunta: 'Pregunta del diagnóstico',
  instruccion: 'Instrucción',
  url_android: 'URL Google Play (Android)',
  url_ios: 'URL App Store (iOS)',
  titulo_2: 'Título 2',
  descripcion_2: 'Descripción 2',
  pasos_2: 'Pasos de la segunda sección',
  cierre: 'Cierre / texto final de sección',
  descripcion_extra: 'Descripción extra',
  link_soporte: 'Enlace de soporte',
  chargebee_script: 'Script de Chargebee (HTML)',
  desc_basico: 'Descripción Plan Tienda Básico',
  desc_esencial: 'Descripción Plan Tienda Esencial',
  desc_premium: 'Descripción Plan Tienda Premium',
  badge_esencial: 'Badge Plan Esencial',
  redirect_url: 'URL de redirección al finalizar',
};

const FIELD_PLACEHOLDERS: Partial<Record<WizardMetaField, string>> = {
  subtitulo: 'Subtítulo de la pantalla',
  descripcion: 'Texto descriptivo adicional',
  dato_importante: 'Ej: Incluye soporte 24/7',
  link_url: 'https://ventasclick.chargebee.com/hosted_pages/checkout/...',
  cta_pago: 'Ej: Activar Plan Presencia Web',
  cta_primario: 'Ej: Continuar',
  cta_secundario: 'Ej: Dejar mis datos',
  cta: 'Ej: Seleccionar',
  precio: 'Ej: $3,299',
  frecuencia: 'Ej: por año',
  nota: 'Nota pequeña al pie de la pantalla',
  imagen_url: 'https://...',
  plan_label: 'Ej: El plan Presencia Web incluye:',
  como_funciona: 'Descripción breve de cómo funciona',
  pregunta: 'Ej: ¿Cómo vende actualmente tu negocio?',
  instruccion: 'Ej: ¿Ya tienen lista su tarjeta?',
  url_android: 'https://play.google.com/store/apps/details?id=...',
  url_ios: 'https://apps.apple.com/app/...',
  titulo_2: 'Ej: 2. Ingresar a la App',
  descripcion_2: 'Descripción de la segunda sección',
  cierre: 'Ej: Tu cliente estará listo para usar su plan.',
  descripcion_extra: 'Texto complementario adicional',
  link_soporte: 'https://wa.me/... o enlace de soporte',
  link_texto: 'Ej: Ver más detalles',
  chargebee_script: '<script src="https://js.chargebee.com/v2/chargebee.js" data-cb-site="TU-SITIO"></script>',
  desc_basico: 'Ej: Para dar el primer paso digital.',
  desc_esencial: 'Ej: Para ampliar canales y promociones.',
  desc_premium: 'Ej: Para catálogos amplios y marketing avanzado.',
  badge_esencial: 'Ej: Más vendido',
  redirect_url: 'https://www.ventasclick.com/proximos-pasos/',
};

interface WizardMetaEditorProps {
  meta: WizardMeta;
  onChange: (meta: WizardMeta) => void;
  fields: WizardMetaField[];
}

const WizardMetaEditor: React.FC<WizardMetaEditorProps> = ({ meta, onChange, fields }) => {
  const update = (key: keyof WizardMeta, value: any) => onChange({ ...meta, [key]: value });

  const updateArrayItem = (index: number, value: string, field: 'bullets' | 'pasos' | 'pasos_2') => {
    const arr = [...(meta[field] || [])];
    arr[index] = value;
    update(field, arr);
  };

  const addItem = (field: 'bullets' | 'pasos' | 'pasos_2') => {
    update(field, [...(meta[field] || []), '']);
  };

  const removeItem = (index: number, field: 'bullets' | 'pasos' | 'pasos_2') => {
    const arr = [...(meta[field] || [])];
    arr.splice(index, 1);
    update(field, arr);
  };

  const renderTextField = (field: WizardMetaField, isUrl = false, isTextarea = false) => (
    <div key={field}>
      <label className="block text-sm font-medium text-gray-700 mb-2">{FIELD_LABELS[field]}</label>
      {isTextarea ? (
        <textarea
          value={(meta[field] as string) || ''}
          onChange={(e) => update(field, e.target.value)}
          placeholder={FIELD_PLACEHOLDERS[field] || ''}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <input
          type={isUrl ? 'url' : 'text'}
          value={(meta[field] as string) || ''}
          onChange={(e) => update(field, e.target.value)}
          placeholder={FIELD_PLACEHOLDERS[field] || ''}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}
    </div>
  );

  const renderArrayField = (field: 'bullets' | 'pasos' | 'pasos_2') => {
    const isNumbered = field !== 'bullets';
    return (
      <div key={field}>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">{FIELD_LABELS[field]}</label>
          <button
            type="button"
            onClick={() => addItem(field)}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
          >
            <Plus className="w-4 h-4" /> Agregar {field === 'bullets' ? 'bullet' : 'paso'}
          </button>
        </div>
        <div className="space-y-2">
          {(meta[field] || []).map((item, i) => (
            <div key={i} className="flex gap-2">
              {isNumbered && (
                <span className="flex items-center justify-center w-8 h-10 text-sm font-bold text-gray-500">{i + 1}.</span>
              )}
              <input
                type="text"
                value={item}
                onChange={(e) => updateArrayItem(i, e.target.value, field)}
                placeholder={`${field === 'bullets' ? 'Bullet' : 'Paso'} ${i + 1}`}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => removeItem(i, field)}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {(meta[field] || []).length === 0 && (
            <p className="text-sm text-gray-400 italic">
              Sin {field === 'bullets' ? 'bullets' : 'pasos'} — haz clic en "Agregar" para añadir
            </p>
          )}
        </div>
      </div>
    );
  };

  const isPaymentSection = fields.includes('cta_pago');
  const hasLinkSection = fields.includes('link_texto') && !isPaymentSection;
  const paymentFields: WizardMetaField[] = isPaymentSection ? ['link_url', 'cta_pago', 'chargebee_script'] : [];
  const linkGroupFields: WizardMetaField[] = hasLinkSection ? ['link_texto', 'link_url'] : [];
  const excludedFields = [...paymentFields, ...linkGroupFields];
  const regularFields = fields.filter(f => !excludedFields.includes(f));

  return (
    <div className="space-y-6">
      {regularFields.map(field => {
        if (field === 'bullets' || field === 'pasos' || field === 'pasos_2') {
          return renderArrayField(field);
        }
        const urlFields: WizardMetaField[] = ['imagen_url', 'url_android', 'url_ios', 'link_soporte', 'redirect_url'];
        const textareaFields: WizardMetaField[] = ['descripcion', 'descripcion_2', 'descripcion_extra'];
        return renderTextField(field, urlFields.includes(field), textareaFields.includes(field));
      })}

      {hasLinkSection && (
        <div className="space-y-4 p-4 border border-gray-200 bg-gray-50 rounded-xl">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Enlace adicional (texto clicable)</p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Texto del enlace adicional</label>
            <input
              type="text"
              value={meta.link_texto || ''}
              onChange={(e) => update('link_texto', e.target.value)}
              placeholder={FIELD_PLACEHOLDERS.link_texto}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
            <p className="text-xs text-gray-500 mt-1">Texto visible. Si se deja vacío, no se muestra el enlace.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">URL de destino del enlace</label>
            <input
              type="url"
              value={meta.link_url || ''}
              onChange={(e) => update('link_url', e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
            <p className="text-xs text-gray-500 mt-1">URL a la que dirige el enlace al hacer clic.</p>
          </div>
        </div>
      )}

      {isPaymentSection && (
        <div className="space-y-4 p-4 border border-blue-100 bg-blue-50 rounded-xl">
          <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Botón de pago (checkout)</p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">URL de pago (Chargebee)</label>
            <input
              type="url"
              value={meta.link_url || ''}
              onChange={(e) => update('link_url', e.target.value)}
              placeholder={FIELD_PLACEHOLDERS.link_url}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
            <p className="text-xs text-blue-600 mt-1">Enlace de checkout de Chargebee. Si está vacío, el botón aparece deshabilitado.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Texto del botón de pago</label>
            <input
              type="text"
              value={meta.cta_pago || ''}
              onChange={(e) => update('cta_pago', e.target.value)}
              placeholder={FIELD_PLACEHOLDERS.cta_pago}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
          {fields.includes('chargebee_script') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Script de Chargebee (HTML)</label>
              <textarea
                value={meta.chargebee_script || ''}
                onChange={(e) => update('chargebee_script', e.target.value)}
                placeholder={FIELD_PLACEHOLDERS.chargebee_script}
                rows={4}
                spellCheck={false}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-mono text-xs"
              />
              <p className="text-xs text-blue-600 mt-1">
                Pega aquí el tag <code className="bg-blue-100 px-1 rounded">&lt;script&gt;</code> de Chargebee completo. Si se deja vacío, se usará el script definido en el código del sitio.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const ContentEditor: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new';
  const isSuperAdmin = location.pathname.startsWith('/super-admin');
  const baseUrl = isSuperAdmin ? '/super-admin/contenido' : '/admin/content';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<ContentBlock>>({
    slug: '',
    section: 'landing',
    title: '',
    description: '',
    type: 'text',
    locale: 'es-MX',
    value: '',
    meta: {}
  });

  const isWizard = formData.section === 'wizard';
  const wizardInfo = formData.slug ? WIZARD_SCREEN_INFO[formData.slug] : undefined;
  const wizardFields: WizardMetaField[] = wizardInfo?.fields ?? [
    'subtitulo', 'descripcion', 'bullets', 'cta_primario', 'cta_secundario',
    'precio', 'frecuencia', 'dato_importante', 'nota', 'imagen_url',
    'plan_label', 'instruccion', 'cierre', 'descripcion_extra', 'link_url', 'cta_pago',
    'link_texto', 'url_android', 'url_ios', 'link_soporte', 'pregunta', 'cta',
    'titulo_2', 'descripcion_2', 'pasos', 'pasos_2', 'redirect_url',
  ];

  useEffect(() => {
    if (!isNew && id) {
      loadContent(id);
    }
  }, [id]);

  const loadContent = async (contentId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('content_blocks')
        .select('*')
        .eq('id', contentId)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setFormData(data);
      }
    } catch (error) {
      console.error('Error loading content:', error);
      alert('Error al cargar el contenido');
      navigate(baseUrl);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.slug || !formData.title || !formData.section) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      setSaving(true);

      if (isNew) {
        const insertData: ContentBlockInsert = {
          slug: formData.slug!,
          section: formData.section!,
          title: formData.title!,
          description: formData.description!,
          type: 'text',
          locale: formData.locale || 'es-MX',
          value: formData.value || '',
          meta: formData.meta || {}
        };

        const { error } = await supabase
          .from('content_blocks')
          .insert([insertData]);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('content_blocks')
          .update({
            title: formData.title,
            description: formData.description,
            type: 'text',
            value: formData.value,
            meta: formData.meta || {}
          })
          .eq('id', id!);

        if (error) throw error;
      }

      alert('Contenido guardado exitosamente');
      navigate(baseUrl);
    } catch (error: any) {
      console.error('Error saving content:', error);
      if (error.code === '23505') {
        alert('Ya existe un bloque con ese slug. Por favor usa uno diferente.');
      } else {
        alert('Error al guardar el contenido');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(baseUrl)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">
              {isNew ? 'Nuevo Bloque de Contenido' : 'Editar Bloque de Contenido'}
            </h1>
            {wizardInfo && !isNew && (
              <div className="flex items-center gap-2 mt-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${wizardInfo.groupColor}`}>
                  <Monitor className="w-3.5 h-3.5" />
                  {wizardInfo.label}
                </span>
              </div>
            )}
            {!wizardInfo && !isNew && (
              <p className="text-gray-600 mt-1">Modifica el contenido existente</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ej: Título principal del hero"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Nombre amigable para identificar este contenido</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.slug || ''}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="Ej: landing.hero.title"
                  disabled={!isNew}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !isNew ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                />
                <p className="text-xs text-gray-500 mt-1">Identificador único (no se puede cambiar después)</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sección <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.section || 'landing'}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                disabled={!isNew}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !isNew ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
              >
                <option value="landing">Landing</option>
                <option value="wizard">Wizard</option>
                <option value="dashboard">Dashboard</option>
                <option value="emails">Emails</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe dónde se muestra este contenido..."
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Ayuda a otros administradores a entender dónde aparece</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título / Texto principal <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.value || ''}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder="Escribe tu contenido aquí..."
                rows={isWizard ? 3 : 6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                {isWizard
                  ? 'Título principal que aparece en esta pantalla del wizard'
                  : 'Texto plano sin formato especial'
                }
              </p>
            </div>

            {isWizard && (
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Contenido adicional del Wizard</h2>
                <p className="text-sm text-gray-500 mb-6">
                  {wizardInfo
                    ? `Campos específicos para ${wizardInfo.label}`
                    : 'Campos específicos para esta pantalla del wizard de ventas'
                  }
                </p>
                <WizardMetaEditor
                  meta={(formData.meta as WizardMeta) || {}}
                  onChange={(meta) => setFormData({ ...formData, meta })}
                  fields={wizardFields}
                />
              </div>
            )}

            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              <button
                onClick={() => navigate(baseUrl)}
                disabled={saving}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
