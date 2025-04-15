import React, { useEffect, useRef, useCallback } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { renderCanvas } from './CanvasRenderer';
import { TextFormatOptions, ImageFilters } from './types';

interface ImagePreviewProps {
  imageRef: React.MutableRefObject<HTMLImageElement | null>;
  title: string;
  description: string;
  titleFormat: TextFormatOptions;
  descFormat: TextFormatOptions;
  filters: ImageFilters;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  previewOnly?: boolean;
  maxPreviewWidth?: number; // Maximum width for the preview
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageRef,
  title,
  description,
  titleFormat,
  descFormat,
  filters,
  isModalOpen,
  setIsModalOpen,
  previewOnly = false,
  maxPreviewWidth = 600 // Default maximum width for preview
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modalCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Função para renderizar o canvas com redimensionamento
  const renderPreview = useCallback(() => {
    if (canvasRef.current && imageRef.current && containerRef.current) {
      try {
        const img = imageRef.current;
        const canvas = canvasRef.current;
        const containerWidth = containerRef.current.clientWidth;
        
        // Determine canvas width (limited by container or maxPreviewWidth)
        const targetWidth = Math.min(containerWidth, maxPreviewWidth);
        
        // Calculate proportional height
        const aspectRatio = img.height / img.width;
        const targetHeight = targetWidth * aspectRatio;
        
        // Set canvas dimensions for preview
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        renderCanvas(
          canvas,
          img,
          title,
          description,
          titleFormat,
          descFormat,
          filters
        );
      } catch (error) {
        console.error("Erro ao renderizar canvas:", error);
      }
    }
  }, [imageRef, title, description, titleFormat, descFormat, filters, maxPreviewWidth]);

  // Renderizar o canvas quando houver mudanças
  useEffect(() => {
    renderPreview();
    
    // Add listener to resize when window size changes
    const handleResize = () => {
      renderPreview();
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [renderPreview]);

  // Efeito para renderizar a imagem no modal quando aberto
  useEffect(() => {
    if (isModalOpen && modalCanvasRef.current && imageRef.current) {
      const modalCanvas = modalCanvasRef.current;
      const img = imageRef.current;
      
      // Use original image size for the modal
      modalCanvas.width = img.width;
      modalCanvas.height = img.height;
      
      // Render the image at full size in the modal
      renderCanvas(
        modalCanvas,
        img,
        title,
        description,
        titleFormat,
        descFormat,
        filters
      );
    }
  }, [isModalOpen, imageRef, title, description, titleFormat, descFormat, filters]);

  return (
    <>
      {/* Container e Canvas de Pré-visualização */}
      <div ref={containerRef} className="relative w-full">
        <canvas
          ref={canvasRef}
          className="w-full h-auto rounded-lg shadow-md cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        />
      </div>

      {/* Modal de visualização em tamanho maior */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-6">
          <canvas
            ref={modalCanvasRef}
            className="max-w-[50vh] max-h-[50vh] h-[50vh] w-[50vh] rounded-lg mx-auto"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImagePreview;
