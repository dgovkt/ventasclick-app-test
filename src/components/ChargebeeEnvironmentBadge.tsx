import { Globe } from 'lucide-react';
import { useChargebeeConfig } from '../hooks/useChargebeeConfig';
import { useAuth } from '../contexts/AuthContext';

export function ChargebeeEnvironmentBadge() {
  const { config } = useChargebeeConfig();
  const { user } = useAuth();

  if (!user || !config) return null;

  const isTest = config.environment === 'test';

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 px-3 py-2 rounded-lg shadow-lg border-2 flex items-center gap-2 ${
        isTest
          ? 'bg-orange-50 border-orange-400 text-orange-800'
          : 'bg-green-50 border-green-400 text-green-800'
      }`}
    >
      <Globe size={16} />
      <span className="text-xs font-bold uppercase">
        {isTest ? 'Prueba' : 'Producción'}
      </span>
    </div>
  );
}
