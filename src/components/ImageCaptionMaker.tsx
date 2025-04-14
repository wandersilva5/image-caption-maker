import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ImageUploader from './ImageUploader';
import ImageEditor from './ImageEditor';
import ImageConfigurator from './ImageConfigurator';

const ImageCaptionMaker: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const handleImageSelected = (image: string) => {
    setImageUrl(image);
  };

  return (
    <div className="container mx-auto px-4 space-y-6">
      {/* Grid superior para Upload */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Seção de Upload */}
        <Card>
          <CardHeader>
            <CardTitle>1. Selecione uma imagem</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUploader onImageSelected={handleImageSelected} />
          </CardContent>
        </Card>

        {/* Área de Pré-visualização */}
        {imageUrl && (
          <Card>
            <CardHeader>
              <CardTitle>Pré-visualização</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageEditor 
                imageUrl={imageUrl}
                previewOnly={true}
                onOpenModal={() => setIsPreviewModalOpen(true)}
              />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Seção de Configurações */}
      {imageUrl && (
        <Card>
          <CardHeader>
            <CardTitle>2. Configurar Os Textos da Imagem</CardTitle>
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
