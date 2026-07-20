import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { supabase } from '../../lib/supabase';
import { Database, ManualCategory } from '../../lib/database.types';
import ManualContent from '../../components/ManualContent';
import {
  Search,
  ChevronRight,
  Clock,
  BookOpen,
  Menu,
  X
} from 'lucide-react';

type AdminManualSection = Database['public']['Tables']['user_manual_sections']['Row'];

interface SocioManualSection {
  id: string;
  seccion: string;
  subseccion: string | null;
  titulo: string;
  contenido: string;
  orden: number;
  created_at: string;
  updated_at: string;
}

const CATEGORY_LABELS: Record<ManualCategory, string> = {
  introduccion: 'Introducción',
  gestion_usuarios: 'Gestión de Usuarios',
  gestion_bills_leads: 'Gestión de Bills y Leads',
  gestion_cierres_ventas: 'Gestión de Cierres y Ventas',
  gestion_comisiones: 'Gestión de Comisiones',
  gestion_planes: 'Gestión de Planes',
  reviews_nps: 'Reviews y NPS',
  casos_exito: 'Casos de Éxito',
  gestion_contenido: 'Gestión de Contenido',
  base_conocimientos: 'Base de Conocimientos',
  configuracion_sistema: 'Configuración del Sistema',
  reportes_analiticas: 'Reportes y Analíticas',
  preguntas_frecuentes: 'Preguntas Frecuentes',
  gestion_agentes: 'Gestión de Agentes',
};

const SECTION_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  leads: 'Leads',
  prospectos: 'Prospectos',
  cierres: 'Mis Cierres',
  comisiones: 'Mis Comisiones',
  kb: 'Knowledge Base',
  casos: 'Casos de Éxito',
  reviews: 'Reviews',
};

interface GroupedAdminSections {
  [key: string]: AdminManualSection[];
}

interface GroupedSocioSections {
  [key: string]: SocioManualSection[];
}

export default function Manuales() {
  const [activeTab, setActiveTab] = useState<'admin' | 'socio'>('admin');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Manuales</h1>
          <p className="text-gray-600 mt-2">Administra el contenido de los manuales del sistema</p>
        </div>

        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('admin')}
              className={`${
                activeTab === 'admin'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              Manual de Administradores
            </button>
            <button
              onClick={() => setActiveTab('socio')}
              className={`${
                activeTab === 'socio'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              Manual de Socios
            </button>
          </nav>
        </div>

        <div className="mt-6">
          {activeTab === 'admin' ? <AdminManualTab /> : <SocioManualTab />}
        </div>
      </div>
    </DashboardLayout>
  );
}

function AdminManualTab() {
  const [sections, setSections] = useState<AdminManualSection[]>([]);
  const [groupedSections, setGroupedSections] = useState<GroupedAdminSections>({});
  const [currentSection, setCurrentSection] = useState<AdminManualSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<ManualCategory>>(new Set());

  useEffect(() => {
    loadSections();
  }, []);

  useEffect(() => {
    if (sections.length > 0) {
      groupSectionsByCategory();
      if (!currentSection) {
        setCurrentSection(sections[0]);
        if (sections[0]) {
          setExpandedCategories(prev => new Set(prev).add(sections[0].category));
        }
      }
    }
  }, [sections]);

  const loadSections = async () => {
    try {
      const { data, error } = await supabase
        .from('user_manual_sections')
        .select('*')
        .eq('visible', true)
        .order('category')
        .order('order_index');

      if (error) throw error;
      setSections(data || []);
    } catch (error) {
      console.error('Error loading sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupSectionsByCategory = () => {
    const grouped: GroupedAdminSections = {};
    sections.forEach(section => {
      if (!grouped[section.category]) {
        grouped[section.category] = [];
      }
      grouped[section.category].push(section);
    });
    setGroupedSections(grouped);
  };

  const toggleCategory = (category: ManualCategory) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const selectSection = (section: AdminManualSection) => {
    setCurrentSection(section);
  };

  const filteredSections = searchTerm
    ? sections.filter(s =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : sections;

  const wordCount = currentSection
    ? currentSection.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(w => w.length > 0).length
    : 0;
  const readingTime = Math.ceil(wordCount / 250);

  const getNavigationButtons = () => {
    if (!currentSection) return { prev: null, next: null };
    const currentIndex = sections.findIndex(s => s.id === currentSection.id);
    return {
      prev: currentIndex > 0 ? sections[currentIndex - 1] : null,
      next: currentIndex < sections.length - 1 ? sections[currentIndex + 1] : null,
    };
  };

  const { prev, next } = getNavigationButtons();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">Cargando manual...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-20rem)] bg-gray-50 rounded-lg overflow-hidden">
      <div
        className={`${
          sidebarOpen ? 'w-80' : 'w-0'
        } bg-white border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden`}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Manual de Usuario</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {searchTerm ? (
            <div className="space-y-2">
              {filteredSections.map(section => (
                <button
                  key={section.id}
                  onClick={() => selectSection(section)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                    currentSection?.id === section.id
                      ? 'bg-blue-100 text-blue-900 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {Object.entries(groupedSections).map(([category, categorySections]) => (
                <div key={category}>
                  <button
                    onClick={() => toggleCategory(category as ManualCategory)}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 rounded-lg"
                  >
                    <span>{CATEGORY_LABELS[category as ManualCategory]}</span>
                    <ChevronRight
                      className={`h-4 w-4 transition-transform ${
                        expandedCategories.has(category as ManualCategory) ? 'rotate-90' : ''
                      }`}
                    />
                  </button>
                  {expandedCategories.has(category as ManualCategory) && (
                    <div className="ml-4 mt-1 space-y-1">
                      {categorySections.map(section => (
                        <button
                          key={section.id}
                          onClick={() => selectSection(section)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                            currentSection?.id === section.id
                              ? 'bg-blue-100 text-blue-900 font-medium'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {section.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}
            {currentSection && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>{CATEGORY_LABELS[currentSection.category]}</span>
                <ChevronRight className="h-4 w-4" />
                <span className="text-gray-900 font-medium">{currentSection.title}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-8">
            {currentSection ? (
              <>
                <div className="mb-8">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    {currentSection.title}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>~{readingTime} min de lectura</span>
                    </div>
                    <span>•</span>
                    <span>
                      Actualizado: {new Date(currentSection.updated_at).toLocaleDateString('es-MX')}
                    </span>
                  </div>
                </div>

                <ManualContent content={currentSection.content} className="mb-12" />

                <div className="flex items-center justify-between pt-8 border-t border-gray-200">
                  {prev ? (
                    <button
                      onClick={() => selectSection(prev)}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronRight className="h-4 w-4 rotate-180" />
                      <div className="text-left">
                        <div className="text-xs text-gray-500">Anterior</div>
                        <div className="font-medium">{prev.title}</div>
                      </div>
                    </button>
                  ) : (
                    <div></div>
                  )}
                  {next && (
                    <button
                      onClick={() => selectSection(next)}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Siguiente</div>
                        <div className="font-medium">{next.title}</div>
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Bienvenido al Manual de Usuario
                </h3>
                <p className="text-gray-600">
                  Selecciona una sección del menú lateral para comenzar
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SocioManualTab() {
  const [sections, setSections] = useState<SocioManualSection[]>([]);
  const [groupedSections, setGroupedSections] = useState<GroupedSocioSections>({});
  const [currentSection, setCurrentSection] = useState<SocioManualSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadSections();
  }, []);

  useEffect(() => {
    if (sections.length > 0) {
      groupSectionsByCategory();
      if (!currentSection) {
        const firstSection = sections[0];
        setCurrentSection(firstSection);
        setExpandedSections(new Set([firstSection.seccion]));
      }
    }
  }, [sections]);

  const loadSections = async () => {
    try {
      const { data, error } = await supabase
        .from('socio_manual_sections')
        .select('*')
        .order('seccion')
        .order('orden');

      if (error) throw error;
      setSections(data || []);
    } catch (error) {
      console.error('Error loading sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupSectionsByCategory = () => {
    const grouped: GroupedSocioSections = {};
    sections.forEach(section => {
      if (!grouped[section.seccion]) {
        grouped[section.seccion] = [];
      }
      grouped[section.seccion].push(section);
    });
    setGroupedSections(grouped);
  };

  const toggleSection = (seccion: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(seccion)) {
        newSet.delete(seccion);
      } else {
        newSet.add(seccion);
      }
      return newSet;
    });
  };

  const selectSection = (section: SocioManualSection) => {
    setCurrentSection(section);
  };

  const filteredSections = searchTerm
    ? sections.filter(s =>
        s.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.contenido.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : sections;

  const wordCount = currentSection
    ? currentSection.contenido.replace(/<[^>]*>/g, '').split(/\s+/).filter(w => w.length > 0).length
    : 0;
  const readingTime = Math.ceil(wordCount / 250);

  const getNavigationButtons = () => {
    if (!currentSection) return { prev: null, next: null };
    const currentIndex = sections.findIndex(s => s.id === currentSection.id);
    return {
      prev: currentIndex > 0 ? sections[currentIndex - 1] : null,
      next: currentIndex < sections.length - 1 ? sections[currentIndex + 1] : null,
    };
  };

  const { prev, next } = getNavigationButtons();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">Cargando manual...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-20rem)] bg-gray-50 rounded-lg overflow-hidden">
      <div
        className={`${
          sidebarOpen ? 'w-80' : 'w-0'
        } bg-white border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden`}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Manual del Socio</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {searchTerm ? (
            <div className="space-y-2">
              {filteredSections.map(section => (
                <button
                  key={section.id}
                  onClick={() => selectSection(section)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                    currentSection?.id === section.id
                      ? 'bg-blue-100 text-blue-900 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {section.titulo}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {Object.entries(groupedSections).map(([seccion, seccionSections]) => (
                <div key={seccion}>
                  <button
                    onClick={() => toggleSection(seccion)}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 rounded-lg"
                  >
                    <span>{SECTION_LABELS[seccion] || seccion}</span>
                    <ChevronRight
                      className={`h-4 w-4 transition-transform ${
                        expandedSections.has(seccion) ? 'rotate-90' : ''
                      }`}
                    />
                  </button>
                  {expandedSections.has(seccion) && (
                    <div className="ml-4 mt-1 space-y-1">
                      {seccionSections.map(section => (
                        <button
                          key={section.id}
                          onClick={() => selectSection(section)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                            currentSection?.id === section.id
                              ? 'bg-blue-100 text-blue-900 font-medium'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {section.titulo}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}
            {currentSection && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>{SECTION_LABELS[currentSection.seccion] || currentSection.seccion}</span>
                <ChevronRight className="h-4 w-4" />
                <span className="text-gray-900 font-medium">{currentSection.titulo}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-8">
            {currentSection ? (
              <>
                <div className="mb-8">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    {currentSection.titulo}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>~{readingTime} min de lectura</span>
                    </div>
                    <span>•</span>
                    <span>
                      Actualizado: {new Date(currentSection.updated_at).toLocaleDateString('es-MX')}
                    </span>
                  </div>
                </div>

                <ManualContent content={currentSection.contenido} className="mb-12" />

                <div className="flex items-center justify-between pt-8 border-t border-gray-200">
                  {prev ? (
                    <button
                      onClick={() => selectSection(prev)}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronRight className="h-4 w-4 rotate-180" />
                      <div className="text-left">
                        <div className="text-xs text-gray-500">Anterior</div>
                        <div className="font-medium">{prev.titulo}</div>
                      </div>
                    </button>
                  ) : (
                    <div></div>
                  )}
                  {next && (
                    <button
                      onClick={() => selectSection(next)}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Siguiente</div>
                        <div className="font-medium">{next.titulo}</div>
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Bienvenido al Manual del Socio
                </h3>
                <p className="text-gray-600">
                  Selecciona una sección del menú lateral para comenzar
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
