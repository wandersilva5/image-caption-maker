import React from 'react';
import ImageCaptionMaker from '@/components/ImageCaptionMaker';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white border-b border-gray-200 py-4 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <h1 className="text-xl font-bold text-brand">Colocar Texto na Imagem</h1>
        </div>
      </header>
      
      <main className="flex-1 py-6 overflow-x-hidden">
        <ImageCaptionMaker />
      </main>
      
      <footer className="border-t border-gray-200 py-3 mt-auto">
        <div className="container mx-auto px-4 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Colocar Texto na Imagem</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
