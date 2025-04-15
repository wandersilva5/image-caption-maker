import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlignLeft, AlignCenter, AlignRight, ArrowUp, ArrowDown, AlignVerticalJustifyCenter } from 'lucide-react';
import { TextFormatOptions, fontOptions } from './types';

interface TextFormatControlsProps {
  format: TextFormatOptions;
  updateFormat: (key: keyof TextFormatOptions, value: TextFormatOptions[keyof TextFormatOptions]) => void;
  isTitle: boolean;
}

const TextFormatControls: React.FC<TextFormatControlsProps> = ({ 
  format, 
  updateFormat,
  isTitle
}) => {
  return (
    <div className="space-y-4">
      {/* Seletor de Fonte */}
      <div className="space-y-2">
        <Label>Fonte</Label>
        <Select
          value={format.fontFamily}
          onValueChange={(value) => updateFormat('fontFamily', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione uma fonte" />
          </SelectTrigger>
          <SelectContent>
            {fontOptions.map((font) => (
              <SelectItem 
                key={font.value} 
                value={font.value}
                style={{ fontFamily: font.value }}
              >
                {font.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>Tamanho da fonte</Label>
          <span className="text-sm text-gray-500">{format.fontSize}px</span>
        </div>
        <Slider
          value={[format.fontSize]}
          min={isTitle ? 16 : 12}
          max={isTitle ? 72 : 48}
          step={1}
          onValueChange={(values) => updateFormat('fontSize', values[0])}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Cor do texto</Label>
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded border"
              style={{ backgroundColor: format.textColor }}
            />
            <Input
              type="color"
              value={format.textColor}
              onChange={(e) => updateFormat('textColor', e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Sombra</Label>
            <input
              type="checkbox"
              checked={format.shadowEnabled}
              onChange={(e) => updateFormat('shadowEnabled', e.target.checked)}
              className="w-4 h-4"
            />
          </div>
          {format.shadowEnabled && (
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded border"
                style={{ backgroundColor: format.shadowColor }}
              />
              <Input
                type="color"
                value={format.shadowColor}
                onChange={(e) => updateFormat('shadowColor', e.target.value)}
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
            value={format.textAlign}
            onValueChange={(value) => {
              if (value) updateFormat('textAlign', value as 'left' | 'center' | 'right');
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
            value={format.verticalPosition}
            onValueChange={(value) => {
              if (value) updateFormat('verticalPosition', value as 'top' | 'middle' | 'bottom');
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
      
      {format.shadowEnabled && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Intensidade da sombra</Label>
            <span className="text-sm text-gray-500">{format.shadowBlur}px</span>
          </div>
          <Slider
            value={[format.shadowBlur]}
            min={0}
            max={20}
            step={1}
            onValueChange={(values) => updateFormat('shadowBlur', values[0])}
          />
        </div>
      )}
    </div>
  );
};

export default TextFormatControls;