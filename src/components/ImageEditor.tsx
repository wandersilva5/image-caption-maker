import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Download, Eye, AlignCenter, AlignLeft, AlignRight, ArrowUp, ArrowDown, AlignVerticalJustifyCenter } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ImageEditorProps {
  imageUrl: string | null;
  previewOnly?: boolean;
  showControls?: boolean;
}

interface TextFormatOptions {
  fontSize: number;
  textColor: string;
  shadowColor: string;
  shadowBlur: number;
  textAlign: 'left' | 'center' | 'right';
  shadowEnabled: boolean;
  fontFamily: string;
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
  fontFamily: 'Arial',
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
  showControls = false
}) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isPreviewVisible, setIsPreviewVisible] = useState<boolean>(true);
  const [titleFormat, setTitleFormat] = useState<TextFormatOptions>({...defaultFormatOptions});
  const [descFormat, setDescFormat] = useState<TextFormatOptions>({...defaultFormatOptions, fontSize: 18});
  const [activeTab, setActiveTab] = useState<string>('title');
  const [filters, setFilters] = useState<ImageFilters>({...defaultFilters});
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modalCanvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const { toast } = useToast();

  // Criar elemento de imagem quando imageUrl mudar
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

  // Re-renderizar canvas quando texto ou formatação mudarem
  useEffect(() => {
    if (imageRef.current) {
      renderCanvas();
    }
  }, [title, description, titleFormat, descFormat, filters]);

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
    const lineHeightDesc = descFormat.fontSize * 1.5;
    const lines = description ? getTextLines(ctx, description, canvas.width - 80, descFormat) : [];
    const descriptionHeight = lines.length * lineHeightDesc;
    const minOverlayHeight = Math.max(120, Math.min(canvas.height * 0.3, 200));
    const overlayHeight = Math.max(minOverlayHeight, descriptionHeight + 120);
  
    // Calcular posição Y baseada na posição vertical selecionada
    let yPosition: number;
    switch (titleFormat.verticalPosition) {
      case 'top':
        yPosition = 0;
        break;
      case 'middle':
        yPosition = (canvas.height - overlayHeight) / 2;
        break;
      case 'bottom':
      default:
        yPosition = canvas.height - overlayHeight;
        break;
    }
  
    // Desenhar overlay com gradiente para melhor legibilidade
    const gradient = ctx.createLinearGradient(0, yPosition, 0, yPosition + overlayHeight);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, yPosition, canvas.width, overlayHeight);
  
    // Desenhar título
    if (title) {
      ctx.save();
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
  
      const titleY = yPosition + 50;
      ctx.fillText(title, xPos, titleY);
      ctx.restore();
    }
  
    // Desenhar descrição
    if (description && lines.length > 0) {
      ctx.save();
      ctx.font = `${descFormat.fontSize}px ${descFormat.fontFamily}`;
      ctx.fillStyle = descFormat.textColor;
      ctx.textAlign = descFormat.textAlign;
  
      if (descFormat.shadowEnabled) {
        ctx.shadowColor = descFormat.shadowColor;
        ctx.shadowBlur = descFormat.shadowBlur;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
      }
  
      let descY = yPosition + (title ? 100 : 60);
      lines.forEach(line => {
        const xPos = getXPosition(canvas.width, descFormat.textAlign);
        ctx.fillText(line, xPos, descY);
        descY += lineHeightDesc;
      });
      ctx.restore();
    }
  };
  
  // Função auxiliar para obter as linhas do texto
  const getTextLines = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number, format: TextFormatOptions) => {
    const lines: string[] = [];
    ctx.font = `${format.fontSize}px ${format.fontFamily}`;
    
    // Dividir por quebras de linha explícitas
    const paragraphs = text.split('\n');
    
    paragraphs.forEach(paragraph => {
      if (paragraph.trim().length === 0) {
        lines.push('');
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
      case 'left': return 40;
      case 'right': return canvasWidth - 40;
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

    // Converter canvas para URL e criar link de download
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
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  // Função para abrir o modal
  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  // Determinar o objeto de formatação ativo com base na aba atual
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
            />
          </div>
          {/* Controles de edição */}
          {showControls && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Campos de texto - 1ª coluna no desktop */}
              <div className="space-y-4 lg:col-span-1">
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

                <div className="flex gap-2">
                  <Button 
                    onClick={handleDownload} 
                    className="flex-1"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Baixar Imagem
                  </Button>
                  
                  <Button 
                    onClick={togglePreview}
                    variant="outline"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    {isPreviewVisible ? "Ocultar Prévia" : "Mostrar Prévia"}
                  </Button>
                </div>
              </div>

              {/* Opções de formatação - 2ª e 3ª colunas no desktop */}
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-4">
                    <Tabs defaultValue="title" onValueChange={setActiveTab}>
                      <TabsList className="w-full mb-4">
                        <TabsTrigger value="title" className="flex-1">Formatar Título</TabsTrigger>
                        <TabsTrigger value="description" className="flex-1">Formatar Descrição</TabsTrigger>
                        <TabsTrigger value="filters" className="flex-1">Filtros de Imagem</TabsTrigger>
                      </TabsList>
                      
                      {/* Conteúdo da aba de formatação de Título/Descrição */}
                      {(activeTab === 'title' || activeTab === 'description') && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <Label>Tamanho da fonte</Label>
                              <span className="text-sm text-gray-500">{currentFormat.fontSize}px</span>
                            </div>
                            <Slider
                              value={[currentFormat.fontSize]}
                              min={activeTab === 'title' ? 16 : 12}
                              max={activeTab === 'title' ? 72 : 48}
                              step={1}
                              onValueChange={(values) => updateCurrentFormat('fontSize', values[0])}
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Cor do texto</Label>
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-8 h-8 rounded border"
                                  style={{ backgroundColor: currentFormat.textColor }}
                                />
                                <Input
                                  type="color"
                                  value={currentFormat.textColor}
                                  onChange={(e) => updateCurrentFormat('textColor', e.target.value)}
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label>Sombra</Label>
                                <input
                                  type="checkbox"
                                  checked={currentFormat.shadowEnabled}
                                  onChange={(e) => updateCurrentFormat('shadowEnabled', e.target.checked)}
                                  className="w-4 h-4"
                                />
                              </div>
                              {currentFormat.shadowEnabled && (
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-8 h-8 rounded border"
                                    style={{ backgroundColor: currentFormat.shadowColor }}
                                  />
                                  <Input
                                    type="color"
                                    value={currentFormat.shadowColor}
                                    onChange={(e) => updateCurrentFormat('shadowColor', e.target.value)}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Alinhamento</Label>
                              <ToggleGroup
                                type="single"
                                value={currentFormat.textAlign}
                                onValueChange={(value) => {
                                  if (value) updateCurrentFormat('textAlign', value as 'left' | 'center' | 'right');
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
                            
                            <div className="space-y-2">
                              <Label>Posição Vertical</Label>
                              <ToggleGroup
                                type="single"
                                value={currentFormat.verticalPosition}
                                onValueChange={(value) => {
                                  if (value) updateCurrentFormat('verticalPosition', value as 'top' | 'middle' | 'bottom');
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
                          
                          {currentFormat.shadowEnabled && (
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <Label>Intensidade da sombra</Label>
                                <span className="text-sm text-gray-500">{currentFormat.shadowBlur}px</span>
                              </div>
                              <Slider
                                value={[currentFormat.shadowBlur]}
                                min={0}
                                max={20}
                                step={1}
                                onValueChange={(values) => updateCurrentFormat('shadowBlur', values[0])}
                              />
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Conteúdo da aba de filtros de imagem */}
                      <TabsContent value="filters" className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label>Brilho</Label>
                            <span className="text-sm text-gray-500">{filters.brightness}%</span>
                          </div>
                          <Slider
                            value={[filters.brightness]}
                            min={50}
                            max={150}
                            step={1}
                            onValueChange={(values) => updateFilter('brightness', values[0])}
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label>Contraste</Label>
                            <span className="text-sm text-gray-500">{filters.contrast}%</span>
                          </div>
                          <Slider
                            value={[filters.contrast]}
                            min={50}
                            max={150}
                            step={1}
                            onValueChange={(values) => updateFilter('contrast', values[0])}
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label>Saturação</Label>
                            <span className="text-sm text-gray-500">{filters.saturation}%</span>
                          </div>
                          <Slider
                            value={[filters.saturation]}
                            min={0}
                            max={200}
                            step={1}
                            onValueChange={(values) => updateFilter('saturation', values[0])}
                          />
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ImageEditor;