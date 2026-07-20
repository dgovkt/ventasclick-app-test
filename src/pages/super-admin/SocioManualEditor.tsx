import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { supabase } from '../../lib/supabase';
import { BookOpen, Plus, CreditCard as Edit2, Trash2, Save, X } from 'lucide-react';
import { RichTextEditor } from '../../components/RichTextEditor';

interface ManualSection {
  id: string;
  seccion: string;
  subseccion: string | null;
  titulo: string;
  contenido: string;
  orden: number;
}

const sectionOptions = [
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'leads', label: 'Leads' },
  { value: 'prospectos', label: 'Prospectos' },
  { value: 'cierres', label: 'Mis Cierres' },
  { value: 'comisiones', label: 'Mis Comisiones' },
  { value: 'kb', label: 'Knowledge Base' },
  { value: 'casos', label: 'Casos de Éxito' },
  { value: 'reviews', label: 'Reviews' },
];

export default function SocioManualEditor() {
  const [sections, setSections] = useState<ManualSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSection, setEditingSection] = useState<ManualSection | null>(null);
  const [filterSection, setFilterSection] = useState<string>('all');

  useEffect(() => {
    loadSections();
  }, []);

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

  const handleEdit = (section: ManualSection) => {
    setEditingSection(section);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta sección?')) return;

    try {
      const { error } = await supabase
        .from('socio_manual_sections')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadSections();
    } catch (error) {
      console.error('Error deleting section:', error);
      alert('Error al eliminar la sección');
    }
  };

  const filteredSections = filterSection === 'all'
    ? sections
    : sections.filter(s => s.seccion === filterSection);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Editor de Manual del Socio</h1>
            <p className="text-gray-600 mt-2">Gestiona el contenido del manual para socios</p>
          </div>
          <Button
            onClick={() => {
              setEditingSection(null);
              setShowModal(true);
            }}
            className="bg-primary hover:bg-primary-dark"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nueva Sección
          </Button>
        </div>

        <Card>
          <div className="p-4">
            <div className="flex gap-2 overflow-x-auto">
              <button
                onClick={() => setFilterSection('all')}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                  filterSection === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todas ({sections.length})
              </button>
              {sectionOptions.map(option => {
                const count = sections.filter(s => s.seccion === option.value).length;
                return (
                  <button
                    key={option.value}
                    onClick={() => setFilterSection(option.value)}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                      filterSection === option.value
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.label} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        {loading ? (
          <Card>
            <div className="p-12 text-center text-gray-500">
              Cargando secciones...
            </div>
          </Card>
        ) : filteredSections.length === 0 ? (
          <Card>
            <div className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No hay secciones para mostrar</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredSections.map((section) => (
              <Card key={section.id}>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-primary-light text-primary-dark text-xs font-semibold rounded-full">
                          {sectionOptions.find(s => s.value === section.seccion)?.label}
                        </span>
                        {section.subseccion && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                            {section.subseccion}
                          </span>
                        )}
                        <span className="text-sm text-gray-500">Orden: {section.orden}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{section.titulo}</h3>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(section)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(section.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div
                    className="prose max-w-none text-sm text-gray-600"
                    dangerouslySetInnerHTML={{
                      __html: section.contenido.substring(0, 200) + '...'
                    }}
                  />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <SectionModal
          section={editingSection}
          onClose={() => {
            setShowModal(false);
            setEditingSection(null);
          }}
          onSave={() => {
            setShowModal(false);
            setEditingSection(null);
            loadSections();
          }}
        />
      )}
    </DashboardLayout>
  );
}

interface SectionModalProps {
  section: ManualSection | null;
  onClose: () => void;
  onSave: () => void;
}

function SectionModal({ section, onClose, onSave }: SectionModalProps) {
  const [formData, setFormData] = useState({
    seccion: section?.seccion || 'dashboard',
    subseccion: section?.subseccion || '',
    titulo: section?.titulo || '',
    contenido: section?.contenido || '',
    orden: section?.orden || 0,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const dataToSave = {
        ...formData,
        subseccion: formData.subseccion || null,
      };

      if (section) {
        const { error } = await supabase
          .from('socio_manual_sections')
          .update(dataToSave)
          .eq('id', section.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('socio_manual_sections')
          .insert(dataToSave);

        if (error) throw error;
      }

      alert(section ? 'Sección actualizada' : 'Sección creada');
      onSave();
    } catch (error) {
      console.error('Error saving section:', error);
      alert('Error al guardar la sección');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">
            {section ? 'Editar Sección' : 'Nueva Sección'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sección Principal *
              </label>
              <select
                value={formData.seccion}
                onChange={(e) => setFormData({ ...formData, seccion: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              >
                {sectionOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subsección (opcional)
              </label>
              <input
                type="text"
                value={formData.subseccion}
                onChange={(e) => setFormData({ ...formData, subseccion: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ej: introduccion, crear, editar"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título *
              </label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
                placeholder="Título descriptivo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Orden *
              </label>
              <input
                type="number"
                value={formData.orden}
                onChange={(e) => setFormData({ ...formData, orden: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contenido *
            </label>
            <RichTextEditor
              value={formData.contenido}
              onChange={(value) => setFormData({ ...formData, contenido: value })}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              fullWidth
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={saving}
              fullWidth
              className="bg-primary hover:bg-primary-dark"
            >
              <Save className="w-5 h-5 mr-2" />
              {saving ? 'Guardando...' : 'Guardar Sección'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
