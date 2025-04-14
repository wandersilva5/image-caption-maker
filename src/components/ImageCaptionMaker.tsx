
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
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Card className="shadow-lg border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-brand">Criador de Legendas para Imagens</CardTitle>
          <CardDescription className="text-center">
            Carregue uma imagem, adicione título e descrição, e gere uma imagem pronta para compartilhar
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-medium mb-3">1. Selecione uma imagem</h2>
              <ImageUploader onImageSelected={handleImageSelected} />
            </div>
            <div>
              <h2 className="text-lg font-medium mb-3">2. Personalize sua imagem</h2>
              <ImageEditor imageUrl={imageUrl} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageCaptionMaker;
