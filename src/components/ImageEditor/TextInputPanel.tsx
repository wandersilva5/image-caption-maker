import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Download, Eye } from 'lucide-react';
import { ImageFilters } from './types';

interface TextInputPanelProps {
  title: string;
  description: string;
  setTitle: (value: string) => void;
  setDescription: (value: string) => void;
  filters: ImageFilters;
  updateFilter: (key: keyof ImageFilters, value: number) => void;
  isPreviewVisible: boolean;
  togglePreview: () => void;
  handleDownload: () => void;
}

const TextInputPanel: React.FC<TextInputPanelProps> = ({
  title,
  description,
  setTitle,
  setDescription,
  filters,
  updateFilter,
  isPreviewVisible,
  togglePreview,
  handleDownload
}) => {
  return (
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
          className="w-full min-h-[80px]"
        />
      </div>

      {/* Slider de transparência global do background */}
      <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <Label>Transparência do Fundo</Label>
          <span className="text-sm text-gray-500">{100 - filters.backgroundOpacity}%</span>
        </div>
        <Slider
          value={[filters.backgroundOpacity]}
          min={0}
          max={95}
          step={5}
          onValueChange={(values) => updateFilter('backgroundOpacity', values[0])}
        />
      </div>

      <div className="flex gap-2 pt-4">
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
  );
};

export default TextInputPanel;