import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUploader from './ImageUploader';
import ImageEditor from './ImageEditor';

const ImageCaptionMaker: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleImageSelected = (image: string) => {
    setImageUrl(image);
  };

  return (
    <div className="container mx-auto px-4 space-y-6">
      {/* Grid layout */}
      <div className="grid grid-cols-1 gap-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>1. Selecione uma imagem</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUploader onImageSelected={handleImageSelected} />
          </CardContent>
        </Card>

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