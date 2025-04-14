
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Download, Eye, AlignCenter, AlignLeft, AlignRight, Type } from 'lucide-react';
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

interface ImageEditorProps {
  imageUrl: string | null;
}

interface TextFormatOptions {
  fontSize: number;
  textColor: string;
  shadowColor: string;
  shadowBlur: number;
  textAlign: 'left' | 'center' | 'right';
  shadowEnabled: boolean;
}

const defaultFormatOptions: TextFormatOptions = {
  fontSize: 32,
  textColor: '#ffffff',
  shadowColor: '#000000',
  shadowBlur: 3,
  textAlign: 'center',
  shadowEnabled: true
};

const ImageEditor: React.FC<ImageEditorProps> = ({ imageUrl }) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isPreviewVisible, setIsPreviewVisible] = useState<boolean>(true);
  const [titleFormat, setTitleFormat] = useState<TextFormatOptions>({...defaultFormatOptions});
  const [descFormat, setDescFormat] = useState<TextFormatOptions>({...defaultFormatOptions, fontSize: 18});
  const [activeTab, setActiveTab] = useState<string>('title');
  
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
  }, [title, description, titleFormat, descFormat]);

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
    
    // Draw title with formatting
    if (title) {
      ctx.font = `bold ${titleFormat.fontSize}px Arial`;
      ctx.fillStyle = titleFormat.textColor;
      ctx.textAlign = titleFormat.textAlign;
      
      // Calculate x position based on alignment
      let xPos;
      switch(titleFormat.textAlign) {
        case 'left':
          xPos = canvas.width * 0.1;
          break;
        case 'right':
          xPos = canvas.width * 0.9;
          break;
        default:
          xPos = canvas.width / 2;
      }
      
      // Add shadow if enabled
      if (titleFormat.shadowEnabled) {
        ctx.shadowColor = titleFormat.shadowColor;
        ctx.shadowBlur = titleFormat.shadowBlur;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
      } else {
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      }
      
      ctx.fillText(title, xPos, canvas.height - overlayHeight + 50);
      
      // Reset shadow for description
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }
    
    // Draw description with formatting
    if (description) {
      ctx.font = `${descFormat.fontSize}px Arial`;
      ctx.fillStyle = descFormat.textColor;
      ctx.textAlign = descFormat.textAlign;
      
      // Calculate x position based on alignment
      let xPos;
      switch(descFormat.textAlign) {
        case 'left':
          xPos = canvas.width * 0.1;
          break;
        case 'right':
          xPos = canvas.width * 0.9;
          break;
        default:
          xPos = canvas.width / 2;
      }
      
      // Add shadow if enabled
      if (descFormat.shadowEnabled) {
        ctx.shadowColor = descFormat.shadowColor;
        ctx.shadowBlur = descFormat.shadowBlur;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
      }
      
      const lineHeight = descFormat.fontSize * 1.2;
      const lines = description.split('\n');
      let y = canvas.height - overlayHeight + 90;
      
      lines.forEach(line => {
        ctx.fillText(line, xPos, y);
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

  const togglePreview = () => {
    setIsPreviewVisible(!isPreviewVisible);
  };
  
  const updateTitleFormat = (key: keyof TextFormatOptions, value: any) => {
    setTitleFormat(prev => ({ ...prev, [key]: value }));
  };
  
  const updateDescFormat = (key: keyof TextFormatOptions, value: any) => {
    setDescFormat(prev => ({ ...prev, [key]: value }));
  };
  
  // Determine the current format object based on active tab
  const currentFormat = activeTab === 'title' ? titleFormat : descFormat;
  const updateCurrentFormat = activeTab === 'title' ? updateTitleFormat : updateDescFormat;

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
            
            <Card className="mt-4">
              <CardContent className="p-4">
                <Tabs defaultValue="title" onValueChange={setActiveTab}>
                  <TabsList className="w-full mb-4">
                    <TabsTrigger value="title" className="flex-1">Formatar Título</TabsTrigger>
                    <TabsTrigger value="description" className="flex-1">Formatar Descrição</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="title" className="space-y-4">
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
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
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
                      
                      <div className="space-y-2">
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
                    </div>
                    
                    <div className="space-y-2">
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
                    
                    {titleFormat.shadowEnabled && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label>Intensidade da sombra</Label>
                          <span className="text-sm text-gray-500">{titleFormat.shadowBlur}px</span>
                        </div>
                        <Slider
                          defaultValue={[titleFormat.shadowBlur]}
                          min={0}
                          max={20}
                          step={1}
                          value={[titleFormat.shadowBlur]}
                          onValueChange={(values) => updateTitleFormat('shadowBlur', values[0])}
                          disabled={!titleFormat.shadowEnabled}
                        />
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="description" className="space-y-4">
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
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
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
                      
                      <div className="space-y-2">
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
                    
                    <div className="space-y-2">
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
                      <div className="space-y-2">
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
                </Tabs>
              </CardContent>
            </Card>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                onClick={handleDownload} 
                className="w-full bg-brand hover:bg-brand-dark"
              >
                <Download className="mr-2 h-4 w-4" />
                Baixar Imagem
              </Button>
              
              <Button 
                onClick={togglePreview}
                variant="outline"
                className="w-full"
              >
                <Eye className="mr-2 h-4 w-4" />
                {isPreviewVisible ? "Ocultar Prévia" : "Mostrar Prévia"}
              </Button>
            </div>
          </div>
          
          {isPreviewVisible && (
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
          )}
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
