import { X, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ImageModalProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

export default function ImageModal({ images, initialIndex, onClose }: ImageModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(images[currentIndex]);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `evidencia_${currentIndex + 1}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Error al descargar la imagen');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
        aria-label="Cerrar"
      >
        <X size={24} />
      </button>

      <button
        onClick={handleDownload}
        className="absolute top-4 right-16 p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
        aria-label="Descargar"
      >
        <Download size={24} />
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute left-4 p-3 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            aria-label="Anterior"
          >
            <ChevronLeft size={32} />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 p-3 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            aria-label="Siguiente"
          >
            <ChevronRight size={32} />
          </button>
        </>
      )}

      <div className="max-w-7xl max-h-[90vh] flex items-center justify-center">
        <img
          src={images[currentIndex]}
          alt={`Evidencia ${currentIndex + 1}`}
          className="max-w-full max-h-[90vh] object-contain"
        />
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-black bg-opacity-60 text-white rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
