
import React from 'react';
import ImageCaptionMaker from '@/components/ImageCaptionMaker';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-brand">Image Caption Maker</h1>
        </div>
      </header>
      
      <main>
        <ImageCaptionMaker />
      </main>
      
      <footer className="border-t border-gray-200 py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Image Caption Maker</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
