import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from './Button';
import { X } from 'lucide-react';

interface KbArticle {
  id?: string;
  titulo: string;
  slug: string;
  categoria: string;
  tags: string[];
  contenido: string;
  visible: boolean;
}

interface KbEditorProps {
  article: KbArticle | null;
  onSave: (article: Omit<KbArticle, 'id'>) => Promise<void>;
  onCancel: () => void;
}

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    ['link', 'image', 'video'],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ['blockquote', 'code-block'],
    ['clean'],
  ],
};

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'video',
  'color',
  'background',
  'align',
  'blockquote',
  'code-block',
];

const categorias = [
  'Onboarding',
  'Ventas',
  'Soporte',
  'Comisiones',
  'Configuración',
  'Preguntas Frecuentes',
  'Otro',
];

export const KbEditor = ({ article, onSave, onCancel }: KbEditorProps) => {
  const [titulo, setTitulo] = useState('');
  const [slug, setSlug] = useState('');
  const [categoria, setCategoria] = useState('Onboarding');
  const [tagsInput, setTagsInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [contenido, setContenido] = useState('');
  const [visible, setVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (article) {
      setTitulo(article.titulo);
      setSlug(article.slug);
      setCategoria(article.categoria);
      setTags(article.tags || []);
      setContenido(article.contenido);
      setVisible(article.visible);
      setTagsInput((article.tags || []).join(', '));
    } else {
      setTitulo('');
      setSlug('');
      setCategoria('Onboarding');
      setTags([]);
      setTagsInput('');
      setContenido('');
      setVisible(false);
    }
  }, [article]);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleTituloChange = (value: string) => {
    setTitulo(value);
    if (!article) {
      setSlug(generateSlug(value));
    }
  };

  const handleTagsInputChange = (value: string) => {
    setTagsInput(value);
    setTags(
      value
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)
    );
  };

  const handleSubmit = async () => {
    if (!titulo.trim() || !slug.trim()) {
      alert('Por favor completa el titulo y el slug.');
      return;
    }
    setIsSaving(true);

    try {
      await onSave({
        titulo: titulo.trim(),
        slug: slug.trim(),
        categoria,
        tags,
        contenido: contenido || '',
        visible,
      });
    } catch {
      // error already handled in parent
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full my-6 mx-4 flex flex-col" style={{ maxHeight: 'calc(100vh - 48px)' }}>
        <div className="p-5 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900">
            {article ? 'Editar Articulo' : 'Nuevo Articulo'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto flex-1 min-h-0">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => handleTituloChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Título del artículo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug (URL)
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(generateSlug(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              placeholder="slug-del-articulo"
            />
            <p className="text-sm text-gray-500 mt-1">
              Se genera automáticamente desde el título
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categorias.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (separados por coma)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => handleTagsInputChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="guía, tutorial, inicio"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contenido
            </label>
            <div className="border border-gray-300 rounded-lg overflow-hidden kb-editor-quill">
              <ReactQuill
                theme="snow"
                value={contenido}
                onChange={setContenido}
                modules={modules}
                formats={formats}
                className="bg-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="visible"
              checked={visible}
              onChange={(e) => setVisible(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="visible" className="text-sm font-medium text-gray-700">
              Artículo visible para socios
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <Button variant="outline" onClick={onCancel} fullWidth>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={isSaving} fullWidth>
              {isSaving ? 'Guardando...' : 'Guardar Articulo'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
