import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Database, ManualCategory } from '../../lib/database.types';
import ManualContent from '../../components/ManualContent';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Search, ChevronRight, Clock, BookOpen, Menu, X } from 'lucide-react';

type ManualSection = Database['public']['Tables']['user_manual_sections']['Row'];

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
};

interface GroupedSections {
  [key: string]: ManualSection[];
}

export default function Manual() {
  const [sections, setSections] = useState<ManualSection[]>([]);
  const [groupedSections, setGroupedSections] = useState<GroupedSections>({});
  const [currentSection, setCurrentSection] = useState<ManualSection | null>(null);
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
    const grouped: GroupedSections = {};
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

  const selectSection = (section: ManualSection) => {
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
                <span>{CATEGORY_LABELS[currentSection.category]}</span>
                <ChevronRight className="h-4 w-4" />
                <span className="text-gray-900 font-medium">{currentSection.title}</span>
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
    </DashboardLayout>
  );
}
