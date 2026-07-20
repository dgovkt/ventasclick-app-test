import { useState, useEffect } from 'react';
import { Camera, Image as ImageIcon } from 'lucide-react';
import ImageModal from './ImageModal';
import { getStorageSignedUrl } from '../lib/storage';

interface Evidencia {
  id: string;
  foto_url: string;
  tipo: string;
  created_at: string;
}

interface EvidenciasThumbnailsProps {
  evidencias: Evidencia[];
  className?: string;
}

export default function EvidenciasThumbnails({ evidencias, className = '' }: EvidenciasThumbnailsProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadImages();
  }, [evidencias]);

  async function loadImages() {
    setLoading(true);
    try {
      const urls = await Promise.all(
        evidencias.map(ev => getStorageSignedUrl(ev.foto_url))
      );
      setImageUrls(urls.filter(url => url !== null) as string[]);
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleThumbnailClick = (index: number) => {
    setSelectedIndex(index);
    setModalOpen(true);
  };

  if (evidencias.length === 0) {
    return (
      <div className={`flex items-center gap-2 text-gray-400 text-sm ${className}`}>
        <Camera size={16} />
        <span>Sin evidencia</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`flex items-center gap-2 text-gray-400 text-sm ${className}`}>
        <Camera size={16} />
        <span>Cargando...</span>
      </div>
    );
  }

  return (
    <>
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex items-center gap-1 text-primary text-sm font-medium">
          <ImageIcon size={16} />
          <span>{evidencias.length} {evidencias.length === 1 ? 'foto' : 'fotos'}</span>
        </div>
        <div className="flex gap-2">
          {imageUrls.slice(0, 3).map((url, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className="relative w-12 h-12 rounded overflow-hidden border-2 border-gray-200 hover:border-primary transition-colors group"
            >
              <img
                src={url}
                alt={`Evidencia ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
              />
            </button>
          ))}
          {evidencias.length > 3 && (
            <button
              onClick={() => handleThumbnailClick(3)}
              className="w-12 h-12 rounded bg-gray-100 hover:bg-gray-200 border-2 border-gray-200 flex items-center justify-center text-sm font-medium text-gray-600 transition-colors"
            >
              +{evidencias.length - 3}
            </button>
          )}
        </div>
      </div>

      {modalOpen && (
        <ImageModal
          images={imageUrls}
          initialIndex={selectedIndex}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
