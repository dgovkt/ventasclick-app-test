import React from 'react';
import { DashboardLayout } from '../components/DashboardLayout';

interface PlaceholderProps {
  title: string;
  description: string;
}

export const Placeholder: React.FC<PlaceholderProps> = ({ title, description }) => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600 mt-2">{description}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center py-12">
            <p className="text-gray-500">Esta sección está en desarrollo</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
