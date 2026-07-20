import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { KbEditor } from '../../components/KbEditor';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { BookOpen, Plus, CreditCard as Edit2, Trash2, Eye, EyeOff } from 'lucide-react';

interface KbArticle {
  id: string;
  titulo: string;
  slug: string;
  categoria: string;
  tags: string[];
  contenido: string;
  visible: boolean;
  updated_at: string;
  profiles?: {
    nombre: string;
    apellido: string;
  };
}

export const SuperAdminKbManagement = () => {
  const { user } = useAuth();
  const [articles, setArticles] = useState<KbArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingArticle, setEditingArticle] = useState<KbArticle | null>(null);
  const [filterCategoria, setFilterCategoria] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setIsLoading(true);

    const { data, error } = await supabase
      .from('kb_articles')
      .select(`
        id,
        titulo,
        slug,
        categoria,
        tags,
        contenido,
        visible,
        updated_at,
        profiles:autor_id (nombre, apellido)
      `)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error loading articles:', error);
    }

    setArticles((data as any) || []);
    setIsLoading(false);
  };

  const handleCreateArticle = async (article: Omit<KbArticle, 'id'>) => {
    if (!user) return;

    const { error } = await supabase
      .from('kb_articles')
      .insert({
        titulo: article.titulo,
        slug: article.slug,
        categoria: article.categoria,
        tags: article.tags,
        contenido: article.contenido,
        visible: article.visible,
        autor_id: user.id,
      });

    if (error) {
      console.error('Error creating article:', error);
      const msg = error.code === '23505'
        ? 'Ya existe un articulo con ese slug. Cambia el titulo o el slug.'
        : error.message || 'Error al crear articulo';
      alert(msg);
      throw error;
    }

    alert('Articulo creado exitosamente');
    setShowEditor(false);
    loadArticles();
  };

  const handleUpdateArticle = async (article: Omit<KbArticle, 'id'>) => {
    if (!editingArticle) return;

    const { error } = await supabase
      .from('kb_articles')
      .update({
        titulo: article.titulo,
        slug: article.slug,
        categoria: article.categoria,
        tags: article.tags,
        contenido: article.contenido,
        visible: article.visible,
      })
      .eq('id', editingArticle.id);

    if (error) {
      console.error('Error updating article:', error);
      const msg = error.code === '23505'
        ? 'Ya existe un articulo con ese slug. Cambia el titulo o el slug.'
        : error.message || 'Error al actualizar articulo';
      alert(msg);
      throw error;
    }

    alert('Articulo actualizado exitosamente');
    setShowEditor(false);
    setEditingArticle(null);
    loadArticles();
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este artículo?')) return;

    const { error } = await supabase
      .from('kb_articles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting article:', error);
      alert('Error al eliminar artículo');
      return;
    }

    alert('Artículo eliminado exitosamente');
    loadArticles();
  };

  const handleToggleVisibility = async (article: KbArticle) => {
    const { error } = await supabase
      .from('kb_articles')
      .update({ visible: !article.visible, updated_at: new Date().toISOString() })
      .eq('id', article.id);

    if (error) {
      console.error('Error toggling visibility:', error);
      alert('Error al cambiar visibilidad');
      return;
    }

    loadArticles();
  };

  const handleEditArticle = (article: KbArticle) => {
    setEditingArticle(article);
    setShowEditor(true);
  };

  const handleNewArticle = () => {
    setEditingArticle(null);
    setShowEditor(true);
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    setEditingArticle(null);
  };

  const categorias = Array.from(new Set(articles.map((a) => a.categoria))).sort();

  const filteredArticles = articles.filter((article) => {
    const matchesCategoria = !filterCategoria || article.categoria === filterCategoria;
    const matchesSearch =
      !searchQuery ||
      article.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategoria && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Knowledge Base</h1>
            <p className="text-gray-600 mt-2">
              Gestiona los artículos de ayuda para socios
            </p>
          </div>
          <Button onClick={handleNewArticle}>
            <Plus size={20} className="mr-2" />
            Nuevo Artículo
          </Button>
        </div>

        <Card>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por título o tags..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterCategoria}
              onChange={(e) => setFilterCategoria(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todas las categorías</option>
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Cargando artículos...</p>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">
                {searchQuery || filterCategoria
                  ? 'No se encontraron artículos'
                  : 'No hay artículos en la Knowledge Base'}
              </p>
              {!searchQuery && !filterCategoria && (
                <Button onClick={handleNewArticle}>Crear primer artículo</Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Título
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Visible
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actualizado
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredArticles.map((article) => (
                    <tr key={article.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{article.titulo}</p>
                          <p className="text-sm text-gray-500">/{article.slug}</p>
                          {article.tags.length > 0 && (
                            <div className="flex gap-1 mt-1 flex-wrap">
                              {article.tags.map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="inline-block px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-full">
                          {article.categoria}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleVisibility(article)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:scale-105 ${
                            article.visible
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                          title={article.visible ? 'Click para ocultar' : 'Click para publicar'}
                        >
                          {article.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                          {article.visible ? 'Publicado' : 'Oculto'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(article.updated_at).toLocaleDateString('es-MX', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditArticle(article)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Editar"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(article.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {showEditor && (
        <KbEditor
          article={editingArticle}
          onSave={editingArticle ? handleUpdateArticle : handleCreateArticle}
          onCancel={handleCloseEditor}
        />
      )}
    </DashboardLayout>
  );
};
