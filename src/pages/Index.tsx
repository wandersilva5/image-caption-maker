import React from 'react';
import ImageCaptionMaker from '@/components/ImageCaptionMaker';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-4 sticky top-0 z-10">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Colocar Texto na Imagem</h1>
          <span className="text-sm text-gray-500 dark:text-gray-400">Crie legendas para suas imagens facilmente</span>
        </div>
      </header>
      
      <main className="flex-1 py-8 px-4 overflow-x-hidden">
        <ImageCaptionMaker />
      </main>
      
      <footer className="border-t border-gray-200 dark:border-gray-700 py-4 bg-white dark:bg-gray-800 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Colocar Texto na Imagem. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;