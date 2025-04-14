import { TextFormatOptions, ImageFilters } from "./types";

export function renderCanvas(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  title: string,
  description: string,
  titleFormat: TextFormatOptions,
  descFormat: TextFormatOptions,
  filters: ImageFilters
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Definir as dimensões do canvas para corresponder à imagem
  canvas.width = image.width;
  canvas.height = image.height;

  // Limpar o canvas e desenhar a imagem
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%)`;
  ctx.drawImage(image, 0, 0);
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

  // Desenhar overlay com transparência ajustável
  const backgroundOpacity = filters.backgroundOpacity / 100;
  const gradient = ctx.createLinearGradient(0, yPosition, 0, yPosition + overlayHeight);
  gradient.addColorStop(0, `rgba(0, 0, 0, ${backgroundOpacity})`);
  gradient.addColorStop(1, `rgba(0, 0, 0, ${backgroundOpacity})`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, yPosition, canvas.width, overlayHeight);

  // Desenhar título
  if (title) {
    ctx.textAlign = titleFormat.textAlign;
    const xPos = getXPosition(canvas.width, titleFormat.textAlign);
    const titleY = yPosition + 50;
    
    if (titleFormat.shadowEnabled) {
      // Desenhar texto com contorno
      drawTextWithOutline(
        ctx, 
        title, 
        xPos, 
        titleY, 
        `bold ${titleFormat.fontSize}px "${titleFormat.fontFamily}"`, 
        titleFormat.textColor, 
        titleFormat.shadowColor, 
        titleFormat.shadowBlur
      );
    } else {
      // Desenhar texto normal sem contorno
      ctx.save();
      ctx.font = `bold ${titleFormat.fontSize}px "${titleFormat.fontFamily}"`;
      ctx.fillStyle = titleFormat.textColor;
      ctx.fillText(title, xPos, titleY);
      ctx.restore();
    }
  }

  // Desenhar descrição
  if (description && lines.length > 0) {
    ctx.textAlign = descFormat.textAlign;
    let descY = yPosition + (title ? 100 : 60);
    
    lines.forEach(line => {
      const xPos = getXPosition(canvas.width, descFormat.textAlign);
      
      if (descFormat.shadowEnabled) {
        // Desenhar texto com contorno
        drawTextWithOutline(
          ctx, 
          line, 
          xPos, 
          descY, 
          `${descFormat.fontSize}px "${descFormat.fontFamily}"`, 
          descFormat.textColor, 
          descFormat.shadowColor, 
          descFormat.shadowBlur
        );
      } else {
        // Desenhar texto normal sem contorno
        ctx.save();
        ctx.font = `${descFormat.fontSize}px "${descFormat.fontFamily}"`;
        ctx.fillStyle = descFormat.textColor;
        ctx.fillText(line, xPos, descY);
        ctx.restore();
      }
      
      descY += lineHeightDesc;
    });
  }
}

// Função para desenhar texto com contorno
function drawTextWithOutline(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  font: string,
  textColor: string,
  outlineColor: string,
  outlineSize: number
) {
  ctx.save();
  ctx.font = font;
  
  // Normalizar tamanho do contorno para um valor mais intuitivo
  // Mapear o valor do slider (0-20) para uma escala mais apropriada (0.5-3)
  const strokeWidth = 0.9 + (outlineSize / 10);
  
  // Método 1: Contorno usando strokeText (mais consistente)
  ctx.lineWidth = strokeWidth;
  ctx.strokeStyle = outlineColor;
  ctx.lineJoin = "round"; // Suaviza cantos
  ctx.miterLimit = 5;
  ctx.strokeText(text, x, y);
  
  // Desenhar o texto principal por cima
  ctx.fillStyle = textColor;
  ctx.fillText(text, x, y);
  
  ctx.restore();
}

// Função auxiliar para obter as linhas do texto
export function getTextLines(
  ctx: CanvasRenderingContext2D, 
  text: string, 
  maxWidth: number, 
  format: TextFormatOptions
) {
  const lines: string[] = [];
  ctx.font = `${format.fontSize}px "${format.fontFamily}"`;
  
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
}

// Função auxiliar para calcular a posição X baseada no alinhamento
export function getXPosition(canvasWidth: number, align: 'left' | 'center' | 'right') {
  switch (align) {
    case 'left': return 40;
    case 'right': return canvasWidth - 40;
    default: return canvasWidth / 2;
  }
}