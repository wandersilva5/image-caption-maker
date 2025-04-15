export interface TextFormatOptions {
    fontSize: number;
    textColor: string;
    shadowColor: string;
    shadowBlur: number;
    textAlign: 'left' | 'center' | 'right';
    shadowEnabled: boolean;
    fontFamily: string;
    verticalPosition: 'top' | 'middle' | 'bottom';
  }
  
  export interface ImageFilters {
    brightness: number;
    contrast: number;
    saturation: number;
    backgroundOpacity: number;
  }
  
  export const fontOptions = [
    { value: 'Arial', label: 'Arial' },
    { value: 'Verdana', label: 'Verdana' },
    { value: 'Helvetica', label: 'Helvetica' },
    { value: 'Times New Roman', label: 'Times New Roman' },
    { value: 'Courier New', label: 'Courier New' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Palatino', label: 'Palatino' },
    { value: 'Garamond', label: 'Garamond' },
    { value: 'Comic Sans MS', label: 'Comic Sans MS' },
    { value: 'Impact', label: 'Impact' },
    { value: 'Tahoma', label: 'Tahoma' }
  ];
  
  export const defaultFormatOptions: TextFormatOptions = {
    fontSize: 32,
    textColor: '#ffffff',
    shadowColor: '#000000',
    shadowBlur: 3,
    textAlign: 'center',
    shadowEnabled: true,
    fontFamily: 'Arial',
    verticalPosition: 'bottom',
  };
  
  export const defaultFilters: ImageFilters = {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    backgroundOpacity: 80,
  };