'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface LoadingProps {
  isLoading: boolean;
}

export default function Loading({ isLoading }: LoadingProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-6">
        {/* Enhanced Spinner Animation */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 rounded-full animate-loading-spinner border-t-orange-500 border-r-orange-400"></div>
          <div className="absolute inset-2 w-12 h-12 border-4 border-transparent rounded-full animate-loading-pulse border-t-orange-300"></div>
          <div className="absolute inset-4 w-8 h-8 border-2 border-transparent rounded-full animate-loading-bounce border-t-orange-200"></div>
        </div>
        
        {/* Loading Text with better animation */}
        <div className="text-center space-y-2">
          <p className="text-xl font-semibold text-gray-800 animate-loading-pulse">
            Memuat...
          </p>
          <p className="text-sm text-gray-600 animate-loading-bounce">
            Mohon tunggu sebentar
          </p>
        </div>
      </div>
    </div>
  );
}
