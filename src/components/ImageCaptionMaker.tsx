
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ImageUploader from './ImageUploader';
import ImageEditor from './ImageEditor';

const ImageCaptionMaker: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleImageSelected = (image: string) => {
    setImageUrl(image);
  };

  return (
    <div className="container mx-auto px-4 py-4">
      <Card className="shadow-lg border-gray-200">
        <CardHeader className="py-4">
          <CardTitle className="text-xl text-center text-brand">Criador de Legendas para Imagens</CardTitle>
          <CardDescription className="text-center text-sm">
            Carregue uma imagem, adicione título e descrição, e gere uma imagem pronta para compartilhar
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h2 className="text-md font-medium mb-2">1. Selecione uma imagem</h2>
              <div className="h-[180px] mb-4">
                <ImageUploader onImageSelected={handleImageSelected} />
              </div>
            </div>
            <div>
              <h2 className="text-md font-medium mb-2">2. Personalize sua imagem</h2>
              <ImageEditor imageUrl={imageUrl} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageCaptionMaker;
