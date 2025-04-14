
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Download } from 'lucide-react';

interface ImageEditorProps {
  imageUrl: string | null;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ imageUrl }) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const { toast } = useToast();

  // Create an image element when imageUrl changes
  useEffect(() => {
    if (imageUrl) {
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        imageRef.current = img;
        renderCanvas();
      };
    }
  }, [imageUrl]);

  // Re-render canvas when text changes
  useEffect(() => {
    if (imageRef.current) {
      renderCanvas();
    }
  }, [title, description]);

  const renderCanvas = () => {
    if (!canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imageRef.current;
    
    // Set canvas dimensions to match the image
    canvas.width = img.width;
    canvas.height = img.height;
    
    // Draw the image
    ctx.drawImage(img, 0, 0);
    
    // Apply a semi-transparent overlay at the bottom for better text visibility
    const overlayHeight = Math.min(canvas.height * 0.3, 200);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, canvas.height - overlayHeight, canvas.width, overlayHeight);
    
    // Draw title
    if (title) {
      ctx.font = 'bold 32px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText(title, canvas.width / 2, canvas.height - overlayHeight + 50);
    }
    
    // Draw description (with line breaks)
    if (description) {
      ctx.font = '18px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      
      const lineHeight = 24;
      const lines = description.split('\n');
      let y = canvas.height - overlayHeight + 90;
      
      lines.forEach(line => {
        ctx.fillText(line, canvas.width / 2, y);
        y += lineHeight;
      });
    }
  };

  const handleDownload = () => {
    if (!canvasRef.current || !imageUrl) {
      toast({
        title: "Erro",
        description: "Por favor, adicione uma imagem primeiro.",
        variant: "destructive"
      });
      return;
    }

    // Convert canvas to data URL and create download link
    const dataUrl = canvasRef.current.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${title || 'image-caption'}.png`;
    link.href = dataUrl;
    link.click();

    toast({
      title: "Sucesso!",
      description: "Sua imagem foi baixada com sucesso."
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {imageUrl ? (
        <>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Adicione um título"
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Adicione uma descrição"
                className="w-full min-h-[100px]"
              />
            </div>
            
            <Button 
              onClick={handleDownload} 
              className="w-full bg-brand hover:bg-brand-dark"
            >
              <Download className="mr-2 h-4 w-4" />
              Baixar Imagem
            </Button>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Pré-visualização</h3>
            <Card>
              <CardContent className="p-2 flex justify-center">
                <div className="relative max-h-[500px] overflow-hidden">
                  <canvas 
                    ref={canvasRef} 
                    className="max-w-full h-auto rounded-md shadow-lg"
                  ></canvas>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <div className="text-center p-10 text-gray-500">
          Selecione uma imagem para começar a editar
        </div>
      )}
    </div>
  );
};

export default ImageEditor;
