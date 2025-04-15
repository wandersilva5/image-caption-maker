import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TextFormatControls from './TextFormatControls';
import ImageFiltersControls from './ImageFiltersControls';
import { TextFormatOptions, ImageFilters } from './types';

interface FormatTabsProps {
  titleFormat: TextFormatOptions;
  descFormat: TextFormatOptions;
  filters: ImageFilters;
  updateTitleFormat: (key: keyof TextFormatOptions, value: TextFormatOptions[keyof TextFormatOptions]) => void;
  updateDescFormat: (key: keyof TextFormatOptions, value: TextFormatOptions[keyof TextFormatOptions]) => void;
  updateFilter: (key: keyof ImageFilters, value: number) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const FormatTabs: React.FC<FormatTabsProps> = ({
  titleFormat,
  descFormat,
  filters,
  updateTitleFormat,
  updateDescFormat,
  updateFilter,
  activeTab,
  setActiveTab
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="title" className="flex-1">Formatar Título</TabsTrigger>
            <TabsTrigger value="description" className="flex-1">Formatar Descrição</TabsTrigger>
            <TabsTrigger value="filters" className="flex-1">Filtros de Imagem</TabsTrigger>
          </TabsList>
          
          <TabsContent value="title">
            <TextFormatControls 
              format={titleFormat} 
              updateFormat={updateTitleFormat} 
              isTitle={true} 
            />
          </TabsContent>
          
          <TabsContent value="description">
            <TextFormatControls 
              format={descFormat} 
              updateFormat={updateDescFormat} 
              isTitle={false} 
            />
          </TabsContent>
          
          <TabsContent value="filters">
            <ImageFiltersControls 
              filters={filters} 
              updateFilter={updateFilter} 
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FormatTabs;