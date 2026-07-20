import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import ManualContent from '../../components/ManualContent';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Search, ChevronRight, Clock, BookOpen, Menu, X } from 'lucide-react';

interface ManualSection {
  id: string;
  seccion: string;
  subseccion: string | null;
  titulo: string;
  contenido: string;
  orden: number;
  created_at: string;
  updated_at: string;
}

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

interface GroupedSections {
  [key: string]: ManualSection[];
}

export default function SocioManual() {
  const [sections, setSections] = useState<ManualSection[]>([]);
  const [groupedSections, setGroupedSections] = useState<GroupedSections>({});
  const [currentSection, setCurrentSection] = useState<ManualSection | null>(null);
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
  }, [sections, currentSection]);

  const loadSections = async () => {
    try {
      const { data, error } = await supabase
        .from('socio_manual_sections')
        .select('*')
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
    const grouped: GroupedSections = {};
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

  const selectSection = (section: ManualSection) => {
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
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-500">Cargando manual...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
    <div className="flex h-[calc(100vh-12rem)] bg-gray-50 rounded-lg overflow-hidden">
      {/* Sidebar */}
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        {/* Header */}
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

        {/* Content */}
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

                {/* Navigation */}
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
    </DashboardLayout>
  );
}
