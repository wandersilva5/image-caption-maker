import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Download, Eye, AlignCenter, AlignLeft, AlignRight, ArrowUp, ArrowDown, AlignVerticalJustifyCenter } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog"; // Importação para modal

interface ImageEditorProps {
  imageUrl: string | null;
  previewOnly?: boolean;
  showControls?: boolean;
  onOpenModal?: () => void;
}

interface TextFormatOptions {
  fontSize: number;
  textColor: string;
  shadowColor: string;
  shadowBlur: number;
  textAlign: 'left' | 'center' | 'right';
  shadowEnabled: boolean;
  fontFamily: string; // Nova propriedade
  verticalPosition: 'top' | 'middle' | 'bottom';
}

interface ImageFilters {
  brightness: number;
  contrast: number;
  saturation: number;
}

const defaultFormatOptions: TextFormatOptions = {
  fontSize: 32,
  textColor: '#ffffff',
  shadowColor: '#000000',
  shadowBlur: 3,
  textAlign: 'center',
  shadowEnabled: true,
  fontFamily: 'Arial', // Nova propriedade
  verticalPosition: 'bottom',
};

const defaultFilters: ImageFilters = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
};

const ImageEditor: React.FC<ImageEditorProps> = ({ 
  imageUrl, 
  previewOnly = false,
  showControls = false,
  onOpenModal 
}) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isPreviewVisible, setIsPreviewVisible] = useState<boolean>(true);
  const [titleFormat, setTitleFormat] = useState<TextFormatOptions>({...defaultFormatOptions});
  const [descFormat, setDescFormat] = useState<TextFormatOptions>({...defaultFormatOptions, fontSize: 18});
  const [activeTab, setActiveTab] = useState<string>('title');
  const [filters, setFilters] = useState<ImageFilters>({ ...defaultFilters });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const modalCanvasRef = useRef<HTMLCanvasElement>(null);
  
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

  // Re-render canvas when text or formatting changes
  useEffect(() => {
    if (imageRef.current) {
      renderCanvas();
    }
  }, [title, description, titleFormat, descFormat, filters]);

  // Efeito para renderizar a imagem na modal quando aberta
  useEffect(() => {
    if (isModalOpen && modalCanvasRef.current && previewCanvasRef.current) {
      const modalCanvas = modalCanvasRef.current;
      const previewCanvas = previewCanvasRef.current;
      
      modalCanvas.width = imageRef.current?.width || 800;
      modalCanvas.height = imageRef.current?.height || 600;
      
      const ctx = modalCanvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(previewCanvas, 0, 0, modalCanvas.width, modalCanvas.height);
      }
    }
  }, [isModalOpen]);

  const renderCanvas = () => {
    if (!canvasRef.current || !imageRef.current) return;
  
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
  
    const img = imageRef.current;
    canvas.width = img.width;
    canvas.height = img.height;
  
    // Limpar o canvas e desenhar a imagem
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%)`;
    ctx.drawImage(img, 0, 0);
    ctx.filter = 'none';
  
    // Calcular altura do overlay baseado no conteúdo
    const lineHeightDesc = descFormat.fontSize * 1.5; // Aumentado para melhor espaçamento
    const lines = description ? getTextLines(ctx, description, canvas.width - 80, descFormat) : [];
    const descriptionHeight = lines.length * lineHeightDesc;
    const minOverlayHeight = Math.min(canvas.height * 0.3, 200);
    const overlayHeight = Math.max(minOverlayHeight, descriptionHeight + 120); // Aumentado padding
  
    // Função auxiliar para calcular posição Y
    const getVerticalPosition = (position: string, overlayHeight: number) => {
      switch (position) {
        case 'top':
          return overlayHeight;
        case 'middle':
          return canvas.height / 2;
        case 'bottom':
        default:
          return canvas.height - overlayHeight;
      }
    };
  
    // Ajuste do overlay e textos
    const yPosition = getVerticalPosition(titleFormat.verticalPosition, overlayHeight);
  
    // Desenhar overlay com gradiente para melhor legibilidade
    const gradient = ctx.createLinearGradient(0, canvas.height - overlayHeight, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, yPosition - overlayHeight, canvas.width, overlayHeight);
  
    // Desenhar título
    if (title) {
      ctx.save(); // Salvar contexto antes de modificar
      ctx.font = `bold ${titleFormat.fontSize}px ${titleFormat.fontFamily}`;
      ctx.fillStyle = titleFormat.textColor;
      ctx.textAlign = titleFormat.textAlign;
  
      const xPos = getXPosition(canvas.width, titleFormat.textAlign);
  
      if (titleFormat.shadowEnabled) {
        ctx.shadowColor = titleFormat.shadowColor;
        ctx.shadowBlur = titleFormat.shadowBlur;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
      }
  
      const titleY = yPosition - overlayHeight + 50;
      ctx.fillText(title, xPos, titleY);
      ctx.restore(); // Restaurar contexto
    }
  
    // Desenhar descrição
    if (description && lines.length > 0) {
      ctx.save(); // Salvar contexto antes de modificar
      ctx.font = `${descFormat.fontSize}px ${descFormat.fontFamily}`;
      ctx.fillStyle = descFormat.textColor;
      ctx.textAlign = descFormat.textAlign;
  
      if (descFormat.shadowEnabled) {
        ctx.shadowColor = descFormat.shadowColor;
        ctx.shadowBlur = descFormat.shadowBlur;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
      }
  
      let descY = yPosition - overlayHeight + (title ? 100 : 60);
      lines.forEach(line => {
        const xPos = getXPosition(canvas.width, descFormat.textAlign);
        if (line === '') {
          descY += lineHeightDesc * 0.5; // Espaço menor para linhas vazias
        } else {
          ctx.fillText(line, xPos, descY);
          descY += lineHeightDesc;
        }
      });
      ctx.restore(); // Restaurar contexto
    }
  };
  
  // Função auxiliar para obter as linhas do texto
  const getTextLines = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number, format: TextFormatOptions) => {
    const lines: string[] = [];
    // Primeiro divide por quebras de linha explícitas
    const paragraphs = text.split('\n');
    
    paragraphs.forEach(paragraph => {
      if (paragraph.length === 0) {
        lines.push(''); // Mantém linhas vazias
        return;
      }
      
      const words = paragraph.split(' ');
      let currentLine = '';
      
      words.forEach(word => {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      });
      
      if (currentLine) {
        lines.push(currentLine);
      }
    });
    
    return lines;
  };
  
  // Função auxiliar para calcular a posição X baseada no alinhamento
  const getXPosition = (canvasWidth: number, align: 'left' | 'center' | 'right') => {
    switch (align) {
      case 'left': return 20;
      case 'right': return canvasWidth - 20;
      default: return canvasWidth / 2;
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

  const togglePreview = () => {
    setIsPreviewVisible(!isPreviewVisible);
  };
  
  const updateTitleFormat = (key: keyof TextFormatOptions, value: TextFormatOptions[keyof TextFormatOptions]) => {
    setTitleFormat(prev => ({ ...prev, [key]: value }));
  };
  
  const updateDescFormat = (key: keyof TextFormatOptions, value: TextFormatOptions[keyof TextFormatOptions]) => {
    setDescFormat(prev => ({ ...prev, [key]: value }));
  };

  const updateFilter = (key: keyof ImageFilters, value: number) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };
  
  const renderModalCanvas = () => {
    if (!modalCanvasRef.current || !canvasRef.current) return;
  
    const modalCanvas = modalCanvasRef.current;
    const originalCanvas = canvasRef.current;
  
    // Manter proporções originais
    modalCanvas.width = originalCanvas.width;
    modalCanvas.height = originalCanvas.height;
  
    const modalCtx = modalCanvas.getContext('2d');
    if (!modalCtx) return;
  
    // Copiar conteúdo do canvas original
    modalCtx.drawImage(originalCanvas, 0, 0);
  };
  
  const openModal = () => {
    setIsModalOpen(true);
  };
  
  const closeModal = () => setIsModalOpen(false);
  
  const handleModalOpen = () => {
    setIsModalOpen(true);
    // Garante que a modal será renderizada com o conteúdo atualizado
    setTimeout(() => {
      if (modalCanvasRef.current && canvasRef.current) {
        const modalCtx = modalCanvasRef.current.getContext('2d');
        if (modalCtx) {
          modalCanvasRef.current.width = canvasRef.current.width;
          modalCanvasRef.current.height = canvasRef.current.height;
          modalCtx.drawImage(canvasRef.current, 0, 0);
        }
      }
    }, 0);
  };

  const handlePreviewClick = () => {
    if (onOpenModal) {
      onOpenModal();
    } else {
      setIsModalOpen(true);
    }
  };

  // Determine the current format object based on active tab
  const currentFormat = activeTab === 'title' ? titleFormat : descFormat;
  const updateCurrentFormat = activeTab === 'title' ? updateTitleFormat : updateDescFormat;

  return (
    <div className="space-y-4">
      {imageUrl && (
        <>
          {/* Canvas de Pré-visualização */}
          <div className="relative w-full">
            <canvas
              ref={canvasRef}
              className="w-full h-auto rounded-lg shadow-md cursor-pointer"
              onClick={handlePreviewClick}
            />
            {previewOnly && (
              <p className="text-sm text-gray-500 mt-2 text-center">
                Clique na imagem para ampliar
              </p>
            )}
          </div>

          {/* Modal (apenas se não for previewOnly) */}
          {!previewOnly && isModalOpen && (
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogContent className="max-w-[90vw] max-h-[90vh] p-6">
                <canvas
                  ref={modalCanvasRef}
                  className="w-full h-auto rounded-lg"
                />
                <Button
                  className="absolute top-2 right-2"
                  variant="ghost"
                  onClick={() => setIsModalOpen(false)}
                >
                  ✕
                </Button>
              </DialogContent>
            </Dialog>
          )}

          {/* Controles de edição */}
          {showControls && (
            <div className="space-y-4">
              {/* Área de Preview */}
              <div className="relative w-full">
                <canvas
                  ref={canvasRef}
                  className="w-full h-auto rounded-lg shadow-md cursor-pointer"
                  onClick={handleModalOpen}
                />
              </div>

              {/* Modal */}
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[90%] p-0">
                  <div className="relative bg-background rounded-lg">
                    <div className="max-h-[90vh] overflow-auto p-1">
                      <canvas
                        ref={modalCanvasRef}
                        className="w-full h-auto rounded-lg"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      className="absolute top-2 right-2 rounded-full w-8 h-8 p-0"
                      onClick={() => setIsModalOpen(false)}
                    >
                      ✕
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Controles de edição (só mostrar se não for preview) */}
              {!previewOnly && (
                <div className="space-y-4">
                  {imageUrl ? (
                    <>
                      {/* Preview Canvas */}
                      <div className="relative">
                        <canvas
                          ref={canvasRef}
                          className="max-w-full h-auto rounded-md shadow-md cursor-pointer"
                          onClick={openModal}
                        />
                        <p className="text-sm text-gray-500 mt-2 text-center">
                          Clique na imagem para ampliar
                        </p>
                      </div>

                      {/* Modal */}
                      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-0 bg-transparent">
                          <div className="relative w-full h-full flex items-center justify-center">
                            <canvas
                              ref={modalCanvasRef}
                              style={{
                                maxWidth: '100%',
                                maxHeight: '90vh',
                                objectFit: 'contain'
                              }}
                              className="rounded-lg shadow-2xl"
                            />
                            <button
                              onClick={() => setIsModalOpen(false)}
                              className="absolute top-2 right-2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white"
                            >
                              ×
                            </button>
                          </div>
                        </DialogContent>
                        <DialogOverlay className="bg-black/80" />
                      </Dialog>

                      {/* Rest of configuration UI */}
                      <div className="flex flex-wrap gap-4">
                        {/* Pré-visualização no lado esquerdo */}
                        {isPreviewVisible && (
                          <div className="flex-1 min-w-[300px] max-w-[400px]">
                            <h3 className="text-md font-medium mb-2">Pré-visualização</h3>
                            <div className="border rounded-md p-2 flex justify-center bg-gray-50">
                              <div className="relative max-w-full">
                                <canvas
                                  ref={previewCanvasRef}
                                  className="max-w-full h-auto rounded-md shadow-md cursor-pointer"
                                  style={{ maxHeight: "250px" }}
                                  onClick={openModal} // Abre a modal ao clicar na imagem
                                ></canvas>
                              </div>
                            </div>
                            <p className="text-sm text-gray-500 mt-2 text-center">
                              Clique na imagem para ampliar
                            </p>
                          </div>
                        )}

                        {/* Campos de entrada no lado direito */}
                        <div className="flex-1 min-w-[300px]">
                          <div className="space-y-3">
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
                                className="w-full min-h-[80px]"
                              />
                            </div>
                            
                            <Card className="mt-3">
                              <CardContent className="p-3">
                                <Tabs defaultValue="title" onValueChange={setActiveTab}>
                                  <TabsList className="w-full mb-3">
                                    <TabsTrigger value="title" className="flex-1">Formatar Título</TabsTrigger>
                                    <TabsTrigger value="description" className="flex-1">Formatar Descrição</TabsTrigger>
                                    <TabsTrigger value="filters" className="flex-1">Filtros de Imagem</TabsTrigger>
                                  </TabsList>
                                  
                                  <TabsContent value="title" className="space-y-3">
                                    <div className="space-y-2">
                                      <div className="flex justify-between items-center">
                                        <Label>Tamanho da fonte</Label>
                                        <span className="text-sm text-gray-500">{titleFormat.fontSize}px</span>
                                      </div>
                                      <Slider
                                        defaultValue={[titleFormat.fontSize]}
                                        min={16}
                                        max={72}
                                        step={1}
                                        value={[titleFormat.fontSize]}
                                        onValueChange={(values) => updateTitleFormat('fontSize', values[0])}
                                      />
                                    </div>
                                    
                                    <div className="grid grid-cols-3 gap-3">
                                      {/* Primeira coluna: Cor do texto */}
                                      <div className="space-y-1">
                                        <Label>Cor do texto</Label>
                                        <div className="flex items-center gap-2">
                                          <div
                                            className="w-8 h-8 rounded border"
                                            style={{ backgroundColor: titleFormat.textColor }}
                                          />
                                          <Input
                                            type="color"
                                            value={titleFormat.textColor}
                                            onChange={(e) => updateTitleFormat('textColor', e.target.value)}
                                          />
                                        </div>
                                      </div>
                                      
                                      {/* Segunda coluna: Sombra e cor da sombra */}
                                      <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                          <Label>Sombra</Label>
                                          <Input
                                            type="checkbox"
                                            className="w-4 h-4"
                                            checked={titleFormat.shadowEnabled}
                                            onChange={(e) => updateTitleFormat('shadowEnabled', e.target.checked)}
                                          />
                                        </div>
                                        {titleFormat.shadowEnabled && (
                                          <div className="flex items-center gap-2">
                                            <div
                                              className="w-8 h-8 rounded border"
                                              style={{ backgroundColor: titleFormat.shadowColor }}
                                            />
                                            <Input
                                              type="color"
                                              value={titleFormat.shadowColor}
                                              onChange={(e) => updateTitleFormat('shadowColor', e.target.value)}
                                              disabled={!titleFormat.shadowEnabled}
                                            />
                                          </div>
                                        )}
                                      </div>
                                      
                                      {/* Terceira coluna: Intensidade da sombra */}
                                      {titleFormat.shadowEnabled && (
                                        <div className="space-y-1">
                                          <Label>Intensidade</Label>
                                          <Slider
                                            defaultValue={[titleFormat.shadowBlur]}
                                            min={0}
                                            max={20}
                                            step={1}
                                            value={[titleFormat.shadowBlur]}
                                            onValueChange={(values) => updateTitleFormat('shadowBlur', values[0])}
                                          />
                                        </div>
                                      )}
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-3">
                                      {/* Primeira coluna: Alinhamento horizontal */}
                                      <div className="space-y-1">
                                        <Label>Alinhamento</Label>
                                        <ToggleGroup
                                          type="single"
                                          value={titleFormat.textAlign}
                                          onValueChange={(value) => {
                                            if (value) updateTitleFormat('textAlign', value as 'left' | 'center' | 'right');
                                          }}
                                          className="justify-start"
                                        >
                                          <TooltipProvider>
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <ToggleGroupItem value="left" aria-label="Align left">
                                                  <AlignLeft className="h-4 w-4" />
                                                </ToggleGroupItem>
                                              </TooltipTrigger>
                                              <TooltipContent>Alinhar à Esquerda</TooltipContent>
                                            </Tooltip>
                                          </TooltipProvider>
                                          
                                          <TooltipProvider>
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <ToggleGroupItem value="center" aria-label="Align center">
                                                  <AlignCenter className="h-4 w-4" />
                                                </ToggleGroupItem>
                                              </TooltipTrigger>
                                              <TooltipContent>Centralizar</TooltipContent>
                                            </Tooltip>
                                          </TooltipProvider>
                                          
                                          <TooltipProvider>
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <ToggleGroupItem value="right" aria-label="Align right">
                                                  <AlignRight className="h-4 w-4" />
                                                </ToggleGroupItem>
                                              </TooltipTrigger>
                                              <TooltipContent>Alinhar à Direita</TooltipContent>
                                            </Tooltip>
                                          </TooltipProvider>
                                        </ToggleGroup>
                                      </div>
                                      
                                      {/* Segunda coluna: Posição vertical */}
                                      <div className="space-y-1">
                                        <Label>Posição Vertical</Label>
                                        <ToggleGroup
                                          type="single"
                                          value={titleFormat.verticalPosition}
                                          onValueChange={(value) => {
                                            if (value) updateTitleFormat('verticalPosition', value as 'top' | 'middle' | 'bottom');
                                          }}
                                          className="justify-start"
                                        >
                                          <TooltipProvider>
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <ToggleGroupItem value="top">
                                                  <ArrowUp className="h-4 w-4" />
                                                </ToggleGroupItem>
                                              </TooltipTrigger>
                                              <TooltipContent>Topo</TooltipContent>
                                            </Tooltip>
                                          </TooltipProvider>
                                          
                                          <TooltipProvider>
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <ToggleGroupItem value="middle">
                                                  <AlignVerticalJustifyCenter className="h-4 w-4" />
                                                </ToggleGroupItem>
                                              </TooltipTrigger>
                                              <TooltipContent>Meio</TooltipContent>
                                            </Tooltip>
                                          </TooltipProvider>
                                          
                                          <TooltipProvider>
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <ToggleGroupItem value="bottom">
                                                  <ArrowDown className="h-4 w-4" />
                                                </ToggleGroupItem>
                                              </TooltipTrigger>
                                              <TooltipContent>Rodapé</TooltipContent>
                                            </Tooltip>
                                          </TooltipProvider>
                                        </ToggleGroup>
                                      </div>
                                    </div>
                                  </TabsContent>
                                  
                                  <TabsContent value="description" className="space-y-3">
                                    <div className="space-y-2">
                                      <div className="flex justify-between items-center">
                                        <Label>Tamanho da fonte</Label>
                                        <span className="text-sm text-gray-500">{descFormat.fontSize}px</span>
                                      </div>
                                      <Slider
                                        defaultValue={[descFormat.fontSize]}
                                        min={12}
                                        max={48}
                                        step={1}
                                        value={[descFormat.fontSize]}
                                        onValueChange={(values) => updateDescFormat('fontSize', values[0])}
                                      />
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-3">
                                      <div className="space-y-1">
                                        <Label>Cor do texto</Label>
                                        <div className="flex items-center gap-2">
                                          <div
                                            className="w-8 h-8 rounded border"
                                            style={{ backgroundColor: descFormat.textColor }}
                                          />
                                          <Input
                                            type="color"
                                            value={descFormat.textColor}
                                            onChange={(e) => updateDescFormat('textColor', e.target.value)}
                                          />
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                          <Label>Sombra</Label>
                                          <Input
                                            type="checkbox"
                                            className="w-4 h-4"
                                            checked={descFormat.shadowEnabled}
                                            onChange={(e) => updateDescFormat('shadowEnabled', e.target.checked)}
                                          />
                                        </div>
                                        {descFormat.shadowEnabled && (
                                          <div className="flex items-center gap-2">
                                            <div
                                              className="w-8 h-8 rounded border"
                                              style={{ backgroundColor: descFormat.shadowColor }}
                                            />
                                            <Input
                                              type="color"
                                              value={descFormat.shadowColor}
                                              onChange={(e) => updateDescFormat('shadowColor', e.target.value)}
                                              disabled={!descFormat.shadowEnabled}
                                            />
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-1">
                                      <Label>Alinhamento</Label>
                                      <ToggleGroup
                                        type="single"
                                        value={descFormat.textAlign}
                                        onValueChange={(value) => {
                                          if (value) updateDescFormat('textAlign', value as 'left' | 'center' | 'right');
                                        }}
                                        className="justify-start"
                                      >
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <ToggleGroupItem value="left" aria-label="Align left">
                                                <AlignLeft className="h-4 w-4" />
                                              </ToggleGroupItem>
                                            </TooltipTrigger>
                                            <TooltipContent>Alinhar à Esquerda</TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                        
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <ToggleGroupItem value="center" aria-label="Align center">
                                                <AlignCenter className="h-4 w-4" />
                                              </ToggleGroupItem>
                                            </TooltipTrigger>
                                            <TooltipContent>Centralizar</TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                        
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <ToggleGroupItem value="right" aria-label="Align right">
                                                <AlignRight className="h-4 w-4" />
                                              </ToggleGroupItem>
                                            </TooltipTrigger>
                                            <TooltipContent>Alinhar à Direita</TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      </ToggleGroup>
                                    </div>
                                    
                                    {descFormat.shadowEnabled && (
                                      <div className="space-y-1">
                                        <div className="flex justify-between items-center">
                                          <Label>Intensidade da sombra</Label>
                                          <span className="text-sm text-gray-500">{descFormat.shadowBlur}px</span>
                                        </div>
                                        <Slider
                                          defaultValue={[descFormat.shadowBlur]}
                                          min={0}
                                          max={20}
                                          step={1}
                                          value={[descFormat.shadowBlur]}
                                          onValueChange={(values) => updateDescFormat('shadowBlur', values[0])}
                                          disabled={!descFormat.shadowEnabled}
                                        />
                                      </div>
                                    )}
                                  </TabsContent>

                                  <TabsContent value="filters" className="space-y-3">
                                    <div className="space-y-2">
                                      <div className="flex justify-between items-center">
                                        <Label>Brilho</Label>
                                        <span className="text-sm text-gray-500">{filters.brightness}%</span>
                                      </div>
                                      <Slider
                                        defaultValue={[filters.brightness]}
                                        min={0}
                                        max={200}
                                        step={1}
                                        value={[filters.brightness]}
                                        onValueChange={(values) => updateFilter('brightness', values[0])}
                                      />
                                    </div>

                                    <div className="space-y-2">
                                      <div className="flex justify-between items-center">
                                        <Label>Contraste</Label>
                                        <span className="text-sm text-gray-500">{filters.contrast}%</span>
                                      </div>
                                      <Slider
                                        defaultValue={[filters.contrast]}
                                        min={0}
                                        max={200}
                                        step={1}
                                        value={[filters.contrast]}
                                        onValueChange={(values) => updateFilter('contrast', values[0])}
                                      />
                                    </div>

                                    <div className="space-y-2">
                                      <div className="flex justify-between items-center">
                                        <Label>Saturação</Label>
                                        <span className="text-sm text-gray-500">{filters.saturation}%</span>
                                      </div>
                                      <Slider
                                        defaultValue={[filters.saturation]}
                                        min={0}
                                        max={200}
                                        step={1}
                                        value={[filters.saturation]}
                                        onValueChange={(values) => updateFilter('saturation', values[0])}
                                      />
                                    </div>
                                  </TabsContent>
                                </Tabs>
                              </CardContent>
                            </Card>
                            
                            <div className="flex gap-2 mt-3">
                              <Button 
                                onClick={handleDownload} 
                                className="flex-1 bg-brand hover:bg-brand-dark"
                              >
                                <Download className="mr-2 h-4 w-4" />
                                Baixar Imagem
                              </Button>
                              
                              <Button 
                                onClick={togglePreview}
                                variant="outline"
                                className="w-auto"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                {isPreviewVisible ? "Ocultar Prévia" : "Mostrar Prévia"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Modal para exibir a imagem em tamanho maior */}
                      {isModalOpen && (
                        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                          <DialogOverlay className="fixed inset-0 bg-black/70 z-50" />
                          <DialogContent className="fixed inset-0 flex items-center justify-center z-50 p-4">
                            <div className="relative bg-white rounded-lg shadow-lg overflow-hidden max-w-[90vw] max-h-[90vh]">
                              <canvas
                                ref={modalCanvasRef}
                                className="w-auto h-auto object-contain"
                              />
                              <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
                              >
                                ✕
                              </button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </>
                  ) : (
                    <div className="text-center p-6 text-gray-500">
                      Selecione uma imagem para começar a editar
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ImageEditor;
