import { ReactNode } from 'react';

interface PageLayoutWizardProps {
  children: ReactNode;
  onBack?: () => void;
  showBack?: boolean;
}

export default function PageLayoutWizard({ children }: PageLayoutWizardProps) {
  return (
    <div className="min-h-screen bg-gray-300 flex items-start justify-center">
      <div className="w-full max-w-[430px] min-h-screen bg-white shadow-2xl relative overflow-hidden">
        {children}
      </div>
    </div>
  );
}
