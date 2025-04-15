import React from 'react';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ImageFilters } from './types';

interface ImageFiltersControlsProps {
  filters: ImageFilters;
  updateFilter: (key: keyof ImageFilters, value: number) => void;
}

const ImageFiltersControls: React.FC<ImageFiltersControlsProps> = ({ filters, updateFilter }) => {
  return (
    <div className="space-y-4">
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
      
      <div className="space-y-2">
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
        <p className="text-xs text-gray-500 mt-1">
          Ajuste a transparência do fundo dos textos para melhor visibilidade.
        </p>
      </div>
    </div>
  );
};

export default ImageFiltersControls;