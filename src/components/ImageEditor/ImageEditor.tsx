import React, { useState, useRef, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { TextFormatOptions, ImageFilters, defaultFormatOptions, defaultFilters } from './types';
import { renderCanvas } from './CanvasRenderer';
import TextInputPanel from './TextInputPanel';
import FormatTabs from './FormatTabs';
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ImageEditorProps {
  imageUrl: string | null;
  previewOnly?: boolean;
  showControls?: boolean;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ 
  imageUrl, 
  previewOnly = false,
  showControls = false
}) => {
  // Estados para texto e formatação
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isPreviewVisible, setIsPreviewVisible] = useState<boolean>(true);
  const [titleFormat, setTitleFormat] = useState<TextFormatOptions>({...defaultFormatOptions});
  const [descFormat, setDescFormat] = useState<TextFormatOptions>({...defaultFormatOptions, fontSize: 18});
  const [activeTab, setActiveTab] = useState<string>('title');
  const [filters, setFilters] = useState<ImageFilters>({...defaultFilters});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Refs
  const imageRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modalCanvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  // Criar elemento de imagem quando imageUrl mudar
  useEffect(() => {
    if (imageUrl) {
      const img = new Image();
      
      img.onload = () => {
        imageRef.current = img;
        setImageLoaded(true);
      };
      
      img.onerror = (err) => {
        console.error("Erro ao carregar imagem:", err);
      };
      
      img.src = imageUrl;
    }
  }, [imageUrl]);

  // Renderizar o canvas quando houver mudanças
  useEffect(() => {
    if (canvasRef.current && imageRef.current) {
      renderCanvas(
        canvasRef.current,
        imageRef.current,
        title,
        description,
        titleFormat,
        descFormat,
        filters
      );
    }
  }, [imageRef.current, title, description, titleFormat, descFormat, filters, imageLoaded]);

  // Efeito para renderizar a imagem no modal quando aberto
  useEffect(() => {
    if (isModalOpen && modalCanvasRef.current && canvasRef.current && imageRef.current) {
      const modalCanvas = modalCanvasRef.current;
      const originalCanvas = canvasRef.current;
      
      modalCanvas.width = imageRef.current.width;
      modalCanvas.height = imageRef.current.height;
      
      const ctx = modalCanvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(originalCanvas, 0, 0);
      }
    }
  }, [isModalOpen]);

  // Funções de atualização
  const updateTitleFormat = (key: keyof TextFormatOptions, value: TextFormatOptions[keyof TextFormatOptions]) => {
    setTitleFormat(prev => ({ ...prev, [key]: value }));
  };
  
  const updateDescFormat = (key: keyof TextFormatOptions, value: TextFormatOptions[keyof TextFormatOptions]) => {
    setDescFormat(prev => ({ ...prev, [key]: value }));
  };

  const updateFilter = (key: keyof ImageFilters, value: number) => {
    setFilters(prev => ({ ...prev, [key]: value }));
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

    // Forçar re-renderização do canvas antes do download
    if (imageRef.current) {
      renderCanvas(
        canvasRef.current,
        imageRef.current,
        title,
        description,
        titleFormat,
        descFormat,
        filters
      );
    }

    // Usar a referência direta ao canvas principal
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

  const togglePreview = () => {
    setIsPreviewVisible(!isPreviewVisible);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  if (!imageUrl) {
    return null;
  }

  return (
    <div className="space-y-4">
      {imageLoaded && imageRef.current ? (
        <>
          {/* Controles de edição */}
          {showControls && (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Canvas de Pré-visualização */}
          <div className="relative w-full">
            <canvas
              ref={canvasRef}
              className="w-full h-auto rounded-lg shadow-md cursor-pointer"
            />

          </div>  
              {/* Painel de entrada de texto - 1ª coluna no desktop */}
              <div className="lg:col-span-2">
                <TextInputPanel 
                  title={title}
                  description={description}
                  setTitle={setTitle}
                  setDescription={setDescription}
                  filters={filters}
                  updateFilter={updateFilter}
                  isPreviewVisible={isPreviewVisible}
                  togglePreview={togglePreview}
                  handleDownload={handleDownload}
                />
              </div>

              {/* Abas de formatação - 2ª e 3ª colunas no desktop */}
              <div className="lg:col-span-3">
                <FormatTabs
                  titleFormat={titleFormat}
                  descFormat={descFormat}
                  filters={filters}
                  updateTitleFormat={updateTitleFormat}
                  updateDescFormat={updateDescFormat}
                  updateFilter={updateFilter}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center p-12 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500">Carregando imagem...</p>
        </div>
      )}
    </div>
  );
};



export default ImageEditor;