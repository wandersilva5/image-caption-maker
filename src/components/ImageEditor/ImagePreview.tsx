import React, { useEffect, useRef } from 'react';
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
  previewOnly = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modalCanvasRef = useRef<HTMLCanvasElement>(null);

  // Renderizar o canvas quando houver mudanças
  useEffect(() => {
    console.log("ImagePreview: Executando efeito de renderização");
    console.log("ImageRef atual:", imageRef.current);
    console.log("CanvasRef atual:", canvasRef.current);
    
    if (canvasRef.current && imageRef.current) {
      console.log("Ambas as referências estão presentes, renderizando canvas");
      console.log("Dimensões da imagem:", imageRef.current.width, "x", imageRef.current.height);
      
      try {
        renderCanvas(
          canvasRef.current,
          imageRef.current,
          title,
          description,
          titleFormat,
          descFormat,
          filters
        );
        console.log("Canvas renderizado com sucesso");
      } catch (error) {
        console.error("Erro ao renderizar canvas:", error);
      }
    } else {
      console.log("Não foi possível renderizar - falta referências");
    }
  }, [imageRef.current, title, description, titleFormat, descFormat, filters]);

  // Efeito para renderizar a imagem no modal quando aberto
  useEffect(() => {
    if (isModalOpen && modalCanvasRef.current && canvasRef.current && imageRef.current) {
      console.log("Modal aberto, renderizando canvas modal");
      
      const modalCanvas = modalCanvasRef.current;
      const originalCanvas = canvasRef.current;
      
      modalCanvas.width = imageRef.current.width;
      modalCanvas.height = imageRef.current.height;
      
      const ctx = modalCanvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(originalCanvas, 0, 0);
        console.log("Canvas modal renderizado");
      }
    }
  }, [isModalOpen]);

  const handleModalOpen = () => {
    console.log("Abrindo modal");
    setIsModalOpen(true);
  };

  return (
    <>
      {/* Canvas de Pré-visualização */}
      <div className="relative w-full">
        <canvas
          ref={canvasRef}
          className="w-full h-auto rounded-lg shadow-md cursor-pointer"
          onClick={handleModalOpen}
        />
        
      </div>

      {/* Modal de visualização em tamanho maior */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-6">
          <canvas
            ref={modalCanvasRef}
            className="max-w-full max-h-[80vh] h-auto rounded-lg mx-auto"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImagePreview;