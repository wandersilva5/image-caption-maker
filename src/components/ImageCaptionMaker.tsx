import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUploader from './ImageUploader';
import ImageEditor from './ImageEditor/ImageEditor'; // Importando do caminho correto

const ImageCaptionMaker: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleImageSelected = (image: string) => {
    console.log("ImageCaptionMaker: Imagem selecionada");
    setImageUrl(image);
  };

  return (
    <div className="container mx-auto px-4 space-y-6">
      {/* Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>1. Selecione uma imagem</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUploader onImageSelected={handleImageSelected} />
          </CardContent>
        </Card>

        {/* Preview Section - Only show if image is available */}
        {imageUrl && (
          <Card>
            <CardHeader>
              <CardTitle>Pré-visualização</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageEditor 
                imageUrl={imageUrl}
                previewOnly={true} 
              />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Editor Section - Only show if image is available */}
      {imageUrl && (
        <Card>
          <CardHeader>
            <CardTitle>2. Configurar os textos da imagem</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageEditor 
              imageUrl={imageUrl}
              showControls={true}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImageCaptionMaker;