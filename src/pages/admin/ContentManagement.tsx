import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { DashboardLayout } from '../../components/DashboardLayout';
import { supabase } from '../../lib/supabase';
import { CreditCard as Edit, Plus, Search, ChevronDown, ChevronRight, LayoutGrid as Layout, Sparkles, BarChart2, Mail, FileText } from 'lucide-react';
import type { Database } from '../../lib/database.types';

type ContentBlock = Database['public']['Tables']['content_blocks']['Row'];

const SECTION_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string; description: string }> = {
  landing: {
    label: 'Landing Page',
    icon: <Layout className="w-5 h-5" />,
    color: 'bg-blue-50 border-blue-200 text-blue-700',
    description: 'Textos de la página principal pública',
  },
  wizard: {
    label: 'Wizard de Ventas',
    icon: <Sparkles className="w-5 h-5" />,
    color: 'bg-amber-50 border-amber-200 text-amber-700',
    description: 'Pantallas del flujo de diagnóstico y venta',
  },
  dashboard: {
    label: 'Dashboard',
    icon: <BarChart2 className="w-5 h-5" />,
    color: 'bg-green-50 border-green-200 text-green-700',
    description: 'Contenido del panel de socios y administradores',
  },
  emails: {
    label: 'Emails',
    icon: <Mail className="w-5 h-5" />,
    color: 'bg-rose-50 border-rose-200 text-rose-700',
    description: 'Textos de correos automáticos y notificaciones',
  },
};

const DEFAULT_SECTION = {
  label: 'Otros',
  icon: <FileText className="w-5 h-5" />,
  color: 'bg-gray-50 border-gray-200 text-gray-700',
  description: 'Contenido sin categoría definida',
};

const LANDING_GROUPS: { label: string; color: string; slugs: string[] }[] = [
  {
    label: 'Hero',
    color: 'bg-blue-50',
    slugs: ['landing.hero.title', 'landing.hero.subtitle', 'landing.hero.cta', 'landing.hero.cta_secondary'],
  },
  {
    label: 'Beneficios',
    color: 'bg-green-50',
    slugs: [
      'landing.benefits.title', 'landing.benefits.subtitle',
      'landing.benefits.1.title', 'landing.benefits.1.description',
      'landing.benefits.2.title', 'landing.benefits.2.description',
      'landing.benefits.3.title', 'landing.benefits.3.description',
      'landing.benefits.4.title', 'landing.benefits.4.description',
    ],
  },
  {
    label: 'Características',
    color: 'bg-cyan-50',
    slugs: [
      'landing.features.leads.title', 'landing.features.leads.description',
      'landing.features.sales.title', 'landing.features.sales.description',
    ],
  },
  {
    label: 'Planes',
    color: 'bg-amber-50',
    slugs: [
      'landing.plans.title', 'landing.plans.subtitle',
      'landing.plans.presencia.title', 'landing.plans.presencia.description', 'landing.plans.presencia.price',
      'landing.plans.tienda.title', 'landing.plans.tienda.description', 'landing.plans.tienda.price',
    ],
  },
  {
    label: 'CTA Final',
    color: 'bg-rose-50',
    slugs: ['landing.cta.title', 'landing.cta.subtitle', 'landing.cta.button'],
  },
  {
    label: 'Footer',
    color: 'bg-gray-50',
    slugs: ['footer.tagline', 'footer.contact_email', 'footer.copyright'],
  },
];

const WIZARD_GROUPS: { label: string; color: string; slugs: string[] }[] = [
  {
    label: 'Pantalla 1 — Bienvenida',
    color: 'bg-amber-50',
    slugs: ['wizard.screen_1'],
  },
  {
    label: 'Pantalla 2 — Diagnóstico',
    color: 'bg-amber-50',
    slugs: ['wizard.screen_2.titulo', 'wizard.screen_2.opcion_a', 'wizard.screen_2.opcion_b', 'wizard.screen_2.opcion_c', 'wizard.screen_2.opcion_d'],
  },
  {
    label: 'Pantallas 3–8 — Plan Presencia Web',
    color: 'bg-blue-50',
    slugs: ['wizard.screen_3', 'wizard.screen_4', 'wizard.screen_5', 'wizard.screen_6', 'wizard.screen_7', 'wizard.screen_8'],
  },
  {
    label: 'Pantalla 9 — Concretar venta (Presencia Web)',
    color: 'bg-blue-50',
    slugs: ['wizard.screen_9'],
  },
  {
    label: 'Pantallas 10–16 — Post-compra Presencia Web',
    color: 'bg-green-50',
    slugs: ['wizard.screen_10', 'wizard.screen_11', 'wizard.screen_12', 'wizard.screen_13', 'wizard.screen_14', 'wizard.screen_15', 'wizard.screen_16'],
  },
  {
    label: 'Pantalla 17 — Datos del prospecto',
    color: 'bg-gray-50',
    slugs: ['wizard.screen_17'],
  },
  {
    label: 'Pantallas 18–24 — Plan Tienda en Línea',
    color: 'bg-orange-50',
    slugs: ['wizard.screen_18', 'wizard.screen_19', 'wizard.screen_20', 'wizard.screen_21', 'wizard.screen_22', 'wizard.screen_24'],
  },
  {
    label: 'Pantalla 25 — Concretar venta (Tienda en Línea)',
    color: 'bg-orange-50',
    slugs: ['wizard.screen_25'],
  },
];

interface WizardGroupPanelProps {
  group: typeof WIZARD_GROUPS[0];
  blocks: ContentBlock[];
  onNavigate: (id: string) => void;
  searchTerm: string;
}

const WizardGroupPanel: React.FC<WizardGroupPanelProps> = ({ group, blocks, onNavigate, searchTerm }) => {
  const [open, setOpen] = useState(false);

  const filtered = blocks.filter(b => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      b.title?.toLowerCase().includes(q) ||
      b.slug?.toLowerCase().includes(q) ||
      b.description?.toLowerCase().includes(q)
    );
  });

  const isForced = !!searchTerm && filtered.length > 0;
  const isOpen = open || isForced;

  if (filtered.length === 0) return null;

  return (
    <div className={`rounded-lg border border-gray-200 overflow-hidden`}>
      <button
        onClick={() => setOpen(prev => !prev)}
        className={`w-full flex items-center justify-between px-4 py-3 ${group.color} hover:opacity-80 transition-opacity`}
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-800 text-sm">{group.label}</span>
          <span className="text-xs bg-white bg-opacity-70 px-2 py-0.5 rounded-full text-gray-600">
            {filtered.length} {filtered.length === 1 ? 'bloque' : 'bloques'}
          </span>
        </div>
        <div className="flex-shrink-0">
          {isOpen ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
        </div>
      </button>

      {isOpen && (
        <div className="bg-white border-t border-gray-200 divide-y divide-gray-50">
          {filtered.map((block) => (
            <div
              key={block.id}
              onClick={() => onNavigate(block.id)}
              className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-medium text-gray-900 text-sm truncate">{block.title}</span>
                </div>
                <p className="text-xs text-gray-500 truncate">{block.description}</p>
                <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-mono mt-0.5 inline-block">
                  {block.slug}
                </code>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onNavigate(block.id); }}
                className="ml-4 flex-shrink-0 p-2 text-gray-400 group-hover:text-blue-600 group-hover:bg-blue-50 rounded-lg transition-colors"
                title="Editar"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface WizardSectionPanelProps {
  blocks: ContentBlock[];
  onNavigate: (id: string) => void;
  searchTerm: string;
  color: string;
}

const WizardSectionPanel: React.FC<WizardSectionPanelProps> = ({ blocks, onNavigate, searchTerm, color }) => {
  const [open, setOpen] = useState(false);
  const config = SECTION_CONFIG['wizard'];

  const blocksBySlug = Object.fromEntries(blocks.map(b => [b.slug, b]));

  const matchesSearch = (b: ContentBlock) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      b.title?.toLowerCase().includes(q) ||
      b.slug?.toLowerCase().includes(q) ||
      b.description?.toLowerCase().includes(q)
    );
  };

  const totalMatching = blocks.filter(matchesSearch).length;
  const isForced = !!searchTerm && totalMatching > 0;
  const isOpen = open || isForced;

  if (searchTerm && totalMatching === 0) return null;

  return (
    <div className={`rounded-xl border-2 overflow-hidden transition-all duration-200 ${color}`}>
      <button
        onClick={() => setOpen(prev => !prev)}
        className="w-full flex items-center justify-between px-6 py-4 hover:opacity-80 transition-opacity"
      >
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">{config.icon}</div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base">{config.label}</span>
              <span className="text-xs font-semibold bg-white bg-opacity-60 px-2 py-0.5 rounded-full">
                {totalMatching} {totalMatching === 1 ? 'bloque' : 'bloques'}
              </span>
            </div>
            <p className="text-xs opacity-70 mt-0.5">{config.description}</p>
          </div>
        </div>
        <div className="flex-shrink-0 ml-4">
          {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </div>
      </button>

      {isOpen && (
        <div className="bg-white border-t-2 border-current border-opacity-10">
          <div className="p-4 space-y-2">
            {WIZARD_GROUPS.map((group) => {
              const groupBlocks = group.slugs
                .map(s => blocksBySlug[s])
                .filter(Boolean) as ContentBlock[];
              if (groupBlocks.length === 0) return null;
              return (
                <WizardGroupPanel
                  key={group.label}
                  group={group}
                  blocks={groupBlocks}
                  onNavigate={onNavigate}
                  searchTerm={searchTerm}
                />
              );
            })}
            {blocks
              .filter(b => !WIZARD_GROUPS.flatMap(g => g.slugs).includes(b.slug))
              .filter(matchesSearch)
              .map(block => (
                <div
                  key={block.id}
                  onClick={() => onNavigate(block.id)}
                  className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-gray-900 text-sm truncate">{block.title}</span>
                    <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-mono ml-2">
                      {block.slug}
                    </code>
                  </div>
                  <Edit className="w-4 h-4 text-gray-400 group-hover:text-blue-600 ml-4 flex-shrink-0" />
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
};

interface GroupedSectionPanelProps {
  groups: typeof LANDING_GROUPS;
  config: { label: string; icon: React.ReactNode; color: string; description: string };
  blocks: ContentBlock[];
  onNavigate: (id: string) => void;
  searchTerm: string;
}

const GroupedSectionPanel: React.FC<GroupedSectionPanelProps> = ({ groups, config, blocks, onNavigate, searchTerm }) => {
  const [open, setOpen] = useState(false);
  const blocksBySlug = Object.fromEntries(blocks.map(b => [b.slug, b]));

  const matchesSearch = (b: ContentBlock) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      b.title?.toLowerCase().includes(q) ||
      b.slug?.toLowerCase().includes(q) ||
      b.description?.toLowerCase().includes(q)
    );
  };

  const totalMatching = blocks.filter(matchesSearch).length;
  const isForced = !!searchTerm && totalMatching > 0;
  const isOpen = open || isForced;

  if (searchTerm && totalMatching === 0) return null;

  return (
    <div className={`rounded-xl border-2 overflow-hidden transition-all duration-200 ${config.color}`}>
      <button
        onClick={() => setOpen(prev => !prev)}
        className="w-full flex items-center justify-between px-6 py-4 hover:opacity-80 transition-opacity"
      >
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">{config.icon}</div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base">{config.label}</span>
              <span className="text-xs font-semibold bg-white bg-opacity-60 px-2 py-0.5 rounded-full">
                {totalMatching} {totalMatching === 1 ? 'bloque' : 'bloques'}
              </span>
            </div>
            <p className="text-xs opacity-70 mt-0.5">{config.description}</p>
          </div>
        </div>
        <div className="flex-shrink-0 ml-4">
          {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </div>
      </button>

      {isOpen && (
        <div className="bg-white border-t-2 border-current border-opacity-10">
          <div className="p-4 space-y-2">
            {groups.map((group) => {
              const groupBlocks = group.slugs
                .map(s => blocksBySlug[s])
                .filter(Boolean) as ContentBlock[];
              if (groupBlocks.length === 0) return null;
              return (
                <WizardGroupPanel
                  key={group.label}
                  group={group}
                  blocks={groupBlocks}
                  onNavigate={onNavigate}
                  searchTerm={searchTerm}
                />
              );
            })}
            {blocks
              .filter(b => !groups.flatMap(g => g.slugs).includes(b.slug))
              .filter(matchesSearch)
              .map(block => (
                <div
                  key={block.id}
                  onClick={() => onNavigate(block.id)}
                  className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-gray-900 text-sm truncate">{block.title}</span>
                    <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-mono ml-2">
                      {block.slug}
                    </code>
                  </div>
                  <Edit className="w-4 h-4 text-gray-400 group-hover:text-blue-600 ml-4 flex-shrink-0" />
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
};

interface SectionPanelProps {
  section: string;
  blocks: ContentBlock[];
  baseUrl: string;
  onNavigate: (id: string) => void;
  searchTerm: string;
}

const SectionPanel: React.FC<SectionPanelProps> = ({ section, blocks, baseUrl, onNavigate, searchTerm }) => {
  const [open, setOpen] = useState(false);
  const config = SECTION_CONFIG[section] || DEFAULT_SECTION;

  if (section === 'wizard') {
    return (
      <WizardSectionPanel
        blocks={blocks}
        onNavigate={onNavigate}
        searchTerm={searchTerm}
        color={config.color}
      />
    );
  }

  if (section === 'landing') {
    return (
      <GroupedSectionPanel
        groups={LANDING_GROUPS}
        config={config}
        blocks={blocks}
        onNavigate={onNavigate}
        searchTerm={searchTerm}
      />
    );
  }

  const filtered = blocks.filter(b => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      b.title?.toLowerCase().includes(q) ||
      b.slug?.toLowerCase().includes(q) ||
      b.description?.toLowerCase().includes(q)
    );
  });

  const isForced = !!searchTerm && filtered.length > 0;
  const isOpen = open || isForced;

  if (searchTerm && filtered.length === 0) return null;

  return (
    <div className={`rounded-xl border-2 overflow-hidden transition-all duration-200 ${config.color}`}>
      <button
        onClick={() => setOpen(prev => !prev)}
        className="w-full flex items-center justify-between px-6 py-4 hover:opacity-80 transition-opacity"
      >
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">{config.icon}</div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base">{config.label}</span>
              <span className="text-xs font-semibold bg-white bg-opacity-60 px-2 py-0.5 rounded-full">
                {filtered.length} {filtered.length === 1 ? 'bloque' : 'bloques'}
              </span>
            </div>
            <p className="text-xs opacity-70 mt-0.5">{config.description}</p>
          </div>
        </div>
        <div className="flex-shrink-0 ml-4">
          {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </div>
      </button>

      {isOpen && (
        <div className="bg-white border-t-2 border-current border-opacity-10">
          {filtered.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-400 text-sm">
              No hay bloques en esta sección
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filtered.map((block) => (
                <div
                  key={block.id}
                  onClick={() => onNavigate(block.id)}
                  className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-gray-900 text-sm truncate">{block.title}</span>
                      <span className={`flex-shrink-0 text-xs px-1.5 py-0.5 rounded font-medium ${
                        block.type === 'richtext'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {block.type === 'richtext' ? 'HTML' : 'Texto'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-1 truncate">{block.description}</p>
                    <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-mono">
                      {block.slug}
                    </code>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); onNavigate(block.id); }}
                    className="ml-4 flex-shrink-0 p-2 text-gray-400 group-hover:text-blue-600 group-hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const ContentManagement: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isSuperAdmin = location.pathname.startsWith('/super-admin');
  const baseUrl = isSuperAdmin ? '/super-admin/contenido' : '/admin/content';
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('content_blocks')
        .select('*')
        .order('section', { ascending: true })
        .order('slug', { ascending: true });
      if (error) throw error;
      setContentBlocks(data || []);
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupedBlocks = contentBlocks.reduce((acc, block) => {
    if (!acc[block.section]) acc[block.section] = [];
    acc[block.section].push(block);
    return acc;
  }, {} as Record<string, ContentBlock[]>);

  const orderedSections = [
    ...Object.keys(SECTION_CONFIG).filter(s => groupedBlocks[s]),
    ...Object.keys(groupedBlocks).filter(s => !SECTION_CONFIG[s]),
  ];

  const totalBlocks = contentBlocks.length;

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
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Contenido</h1>
            <p className="text-gray-500 mt-1">
              {totalBlocks} bloques de contenido · Edita textos sin tocar código
            </p>
          </div>
          <button
            onClick={() => navigate(`${baseUrl}/new`)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5" />
            Nuevo Bloque
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por título, slug o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm font-medium"
            >
              Limpiar
            </button>
          )}
        </div>

        {orderedSections.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 py-16 text-center">
            <p className="text-gray-400 text-sm">No se encontraron bloques de contenido</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orderedSections.map(section => (
              <SectionPanel
                key={section}
                section={section}
                blocks={groupedBlocks[section] || []}
                baseUrl={baseUrl}
                onNavigate={(id) => navigate(`${baseUrl}/${id}`)}
                searchTerm={searchTerm}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
