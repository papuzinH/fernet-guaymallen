import React from 'react';
import Loader from '@/components/ui/Loader';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <Loader size="large" text="Cargando…" />
      </div>
    </div>
  );
}
