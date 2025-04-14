
import React from 'react';
import ImageCaptionMaker from '@/components/ImageCaptionMaker';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 py-2">
        <div className="container mx-auto px-4">
          <h1 className="text-xl font-bold text-brand">Image Caption Maker</h1>
        </div>
      </header>
      
      <main className="flex-1 overflow-hidden">
        <ImageCaptionMaker />
      </main>
      
      <footer className="border-t border-gray-200 py-2">
        <div className="container mx-auto px-4 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Image Caption Maker</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
