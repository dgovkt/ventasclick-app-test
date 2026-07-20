import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { supabase } from '../../lib/supabase';
import { BookOpen, Search, ArrowLeft, Tag } from 'lucide-react';

interface KbArticle {
  id: string;
  titulo: string;
  slug: string;
  categoria: string;
  tags: string[];
  contenido: string;
  updated_at: string;
}

export const SocioKb = () => {
  const [articles, setArticles] = useState<KbArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategoria, setFilterCategoria] = useState<string>('');
  const [selectedArticle, setSelectedArticle] = useState<KbArticle | null>(null);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setIsLoading(true);

    const { data, error } = await supabase
      .from('kb_articles')
      .select('id, titulo, slug, categoria, tags, contenido, updated_at')
      .eq('visible', true)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error loading KB articles:', error);
      setArticles([]);
      setIsLoading(false);
      return;
    }

    setArticles(data || []);
    setIsLoading(false);
  };

  const categorias = Array.from(new Set(articles.map((a) => a.categoria))).sort();

  const filteredArticles = articles.filter((article) => {
    const matchesCategoria = !filterCategoria || article.categoria === filterCategoria;
    const matchesSearch =
      !searchQuery ||
      article.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.categoria.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategoria && matchesSearch;
  });

  const handleArticleClick = (article: KbArticle) => {
    setSelectedArticle(article);
  };

  const handleBackToList = () => {
    setSelectedArticle(null);
  };

  if (selectedArticle) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <Button variant="outline" onClick={handleBackToList}>
              <ArrowLeft size={20} className="mr-2" />
              Volver a artículos
            </Button>
          </div>

          <Card>
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full mb-4">
                  {selectedArticle.categoria}
                </span>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {selectedArticle.titulo}
                </h1>
                {selectedArticle.tags.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag size={16} className="text-gray-400" />
                    {selectedArticle.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div
                  className="prose prose-blue max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedArticle.contenido }}
                  style={{
                    fontSize: '16px',
                    lineHeight: '1.75',
                    color: '#374151',
                  }}
                />
              </div>

              <div className="border-t border-gray-200 mt-8 pt-6">
                <p className="text-sm text-gray-500">
                  Última actualización:{' '}
                  {new Date(selectedArticle.updated_at).toLocaleDateString('es-MX', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Knowledge Base</h1>
          <p className="text-gray-600 mt-2">
            Encuentra respuestas y guías para tus consultas
          </p>
        </div>

        <Card>
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar artículos..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <p className="text-gray-600">
                {searchQuery || filterCategoria
                  ? 'No se encontraron artículos que coincidan con tu búsqueda'
                  : 'No hay artículos disponibles'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <div
                  key={article.id}
                  onClick={() => handleArticleClick(article)}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
                      {article.categoria}
                    </span>
                    <BookOpen
                      size={20}
                      className="text-gray-400 group-hover:text-blue-600 transition"
                    />
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                    {article.titulo}
                  </h3>

                  {article.tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap mb-3">
                      {article.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {article.tags.length > 3 && (
                        <span className="px-2 py-0.5 text-xs text-gray-500">
                          +{article.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <p className="text-sm text-gray-500 mt-4">
                    Actualizado{' '}
                    {new Date(article.updated_at).toLocaleDateString('es-MX', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {!isLoading && articles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categorias.slice(0, 3).map((categoria) => {
              const count = articles.filter((a) => a.categoria === categoria).length;
              return (
                <Card
                  key={categoria}
                  className="cursor-pointer hover:shadow-lg transition"
                  onClick={() => setFilterCategoria(categoria)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Categoría</p>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {categoria}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-blue-600">{count}</p>
                      <p className="text-sm text-gray-500">
                        {count === 1 ? 'artículo' : 'artículos'}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
