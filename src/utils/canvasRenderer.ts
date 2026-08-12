import { QuoteData } from '../types';

export function getCanvasDimensions(aspectRatio: '1:1' | '4:5' | '9:16' = '1:1') {
  switch (aspectRatio) {
    case '4:5':
      return { width: 1080, height: 1350 };
    case '9:16':
      return { width: 1080, height: 1920 };
    case '1:1':
    default:
      return { width: 1080, height: 1080 };
  }
}

/**
 * Loads an image from a URL or Base64 string into an HTMLImageElement
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

/**
 * Renders the quote data onto an HTML5 Canvas element cleanly and returns canvas
 */
export async function renderQuoteCanvas(
  canvas: HTMLCanvasElement,
  data: QuoteData,
  scale: number = 1
): Promise<HTMLCanvasElement> {
  const { width, height } = getCanvasDimensions(data.aspectRatio);

  canvas.width = width * scale;
  canvas.height = height * scale;

  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.save();
  ctx.scale(scale, scale);

  // 1. Draw Outer Canvas Background (Dark Luxury backdrop for card styles or direct full fill)
  const isCardStyle = data.cardStyle === 'reference-inspired' || data.cardStyle === 'dark-luxury';
  if (isCardStyle) {
    // Backdrop gradient / dark luxury canvas fill
    const backdropGrad = ctx.createLinearGradient(0, 0, width, height);
    if (data.cardStyle === 'dark-luxury') {
      backdropGrad.addColorStop(0, '#020617');
      backdropGrad.addColorStop(1, '#0F172A');
    } else {
      backdropGrad.addColorStop(0, '#0F172A');
      backdropGrad.addColorStop(1, '#1E293B');
    }
    ctx.fillStyle = backdropGrad;
    ctx.fillRect(0, 0, width, height);

    // Subtle decorative grid or light circles in backdrop
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.beginPath();
    ctx.arc(width * 0.15, height * 0.15, 300, 0, Math.PI * 2);
    ctx.arc(width * 0.85, height * 0.85, 250, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Full background
    ctx.fillStyle = data.bgColor;
    ctx.fillRect(0, 0, width, height);
  }

  // 2. Determine Inner Card Box
  let cardX = 0;
  let cardY = 0;
  let cardW = width;
  let cardH = height;

  if (isCardStyle) {
    const marginX = 64;
    const marginY = 64;
    cardX = marginX;
    cardY = marginY;
    cardW = width - marginX * 2;
    cardH = height - marginY * 2;

    // Draw Inner Card Background with border radius & shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 15;

    ctx.fillStyle = data.bgColor;
    const radius = data.borderRadius === 'none' ? 0 : data.borderRadius === 'small' ? 16 : data.borderRadius === 'medium' ? 32 : 48;
    drawRoundedRect(ctx, cardX, cardY, cardW, cardH, radius);
    ctx.fill();
    ctx.restore();
  }

  // Card Content Area Padding
  const pad = 56;
  const contentX = cardX + pad;
  const contentY = cardY + pad;
  const contentW = cardW - pad * 2;
  const contentH = cardH - pad * 2;

  // 3. Top Badge (Optional)
  let currentY = contentY;

  if (data.showBadge && data.badgeText) {
    ctx.font = '700 14px "Inter", system-ui, sans-serif';
    const badgeText = data.badgeText.toUpperCase();
    const metrics = ctx.measureText(badgeText);
    const badgeW = metrics.width + 32;
    const badgeH = 32;

    let badgeX = contentX;
    if (data.textAlign === 'center') {
      badgeX = contentX + (contentW - badgeW) / 2;
    } else if (data.textAlign === 'right') {
      badgeX = contentX + contentW - badgeW;
    }

    ctx.save();
    ctx.fillStyle = data.accentColor || '#EA580C';
    drawRoundedRect(ctx, badgeX, currentY, badgeW, badgeH, 16);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(badgeText, badgeX + badgeW / 2, currentY + badgeH / 2 + 1);
    ctx.restore();

    currentY += badgeH + 32;
  }

  // 4. Load & Prepare Image if exists
  let loadedImg: HTMLImageElement | null = null;
  if (data.imageUri) {
    try {
      loadedImg = await loadImage(data.imageUri);
    } catch (e) {
      console.warn('Failed to load image for canvas:', e);
    }
  }

  // Layout handling based on image position: Left, Right, Top, Bottom
  const hasImg = loadedImg !== null;
  const imgPos = data.imagePosition;

  // Image size constants
  let imgBoxSize = 180;
  if (imgPos === 'left' || imgPos === 'right') {
    imgBoxSize = 240;
  }

  // Area allocations
  let textAreaX = contentX;
  let textAreaY = currentY;
  let textAreaW = contentW;
  let textAreaH = contentY + contentH - currentY - 80; // Reserve space for footer

  let imgX = contentX;
  let imgY = currentY;

  if (hasImg) {
    if (imgPos === 'top') {
      imgX = contentX + (contentW - imgBoxSize) / 2;
      imgY = currentY;
      currentY += imgBoxSize + 32;
      textAreaY = currentY;
    } else if (imgPos === 'bottom') {
      imgX = contentX + (contentW - imgBoxSize) / 2;
      imgY = contentY + contentH - 120 - imgBoxSize;
      textAreaH = imgY - textAreaY - 24;
    } else if (imgPos === 'left') {
      imgX = contentX;
      imgY = currentY + 20;
      textAreaX = contentX + imgBoxSize + 40;
      textAreaW = contentW - imgBoxSize - 40;
    } else if (imgPos === 'right') {
      imgX = contentX + contentW - imgBoxSize;
      imgY = currentY + 20;
      textAreaX = contentX;
      textAreaW = contentW - imgBoxSize - 40;
    }

    // Render Image in assigned position
    renderImageShape(ctx, loadedImg!, imgX, imgY, imgBoxSize, imgBoxSize, data.imageShape, data.accentColor);
  }

  // 5. Draw Decorative Quote Marks (if enabled)
  if (data.showQuotes) {
    ctx.save();
    ctx.fillStyle = data.accentColor || '#EA580C';
    ctx.globalAlpha = 0.25;
    ctx.font = '700 80px "Georgia", serif';
    const quoteSymbolX = data.textAlign === 'center' ? textAreaX + textAreaW / 2 - 30 : textAreaX;
    ctx.fillText('“', quoteSymbolX, textAreaY + 40);
    ctx.restore();
    textAreaY += 24;
  }

  // 6. Draw Main Motivational Text
  ctx.save();
  ctx.fillStyle = data.textColor;

  let fontSizePx = 42;
  if (data.fontSize === 'small') fontSizePx = 32;
  if (data.fontSize === 'medium') fontSizePx = 40;
  if (data.fontSize === 'large') fontSizePx = 50;
  if (data.fontSize === 'xlarge') fontSizePx = 62;

  let fontStyle = 'normal';
  let fontFam = '"Georgia", serif';
  if (data.fontFamily === 'sans') fontFam = '"Inter", system-ui, sans-serif';
  if (data.fontFamily === 'display') fontFam = '"Impact", "Trebuchet MS", sans-serif';
  if (data.fontFamily === 'handwriting') fontFam = '"Brush Script MT", "Caveat", cursive, sans-serif';

  ctx.font = `${fontStyle} 700 ${fontSizePx}px ${fontFam}`;
  ctx.textAlign = data.textAlign;
  ctx.textBaseline = 'top';

  const lines = wrapText(ctx, data.text || 'Write your motivational message here...', textAreaW);
  const lineHeight = fontSizePx * 1.35;

  let currentTextY = textAreaY;
  if (data.textAlign === 'center') {
    // Vertically center text in available height if spacious
    const totalTextHeight = lines.length * lineHeight;
    if (totalTextHeight < textAreaH - 100) {
      currentTextY = textAreaY + (textAreaH - totalTextHeight) / 3;
    }
  }

  lines.forEach((line) => {
    let printX = textAreaX;
    if (data.textAlign === 'center') printX = textAreaX + textAreaW / 2;
    if (data.textAlign === 'right') printX = textAreaX + textAreaW;

    ctx.fillText(line, printX, currentTextY);
    currentTextY += lineHeight;
  });

  // 7. Draw Author Name (if entered)
  if (data.author && data.author.trim()) {
    currentTextY += 24;
    ctx.font = '600 22px "Inter", system-ui, sans-serif';
    ctx.fillStyle = data.accentColor || '#EA580C';

    const authorStr = `— ${data.author.trim()}`;
    let authorX = textAreaX;
    if (data.textAlign === 'center') authorX = textAreaX + textAreaW / 2;
    if (data.textAlign === 'right') authorX = textAreaX + textAreaW;

    ctx.fillText(authorStr, authorX, currentTextY);
  }
  ctx.restore();

  // 8. Draw Bottom Footer (Social Media Handle + Date)
  const footerY = cardY + cardH - pad;
  ctx.save();

  // Divider Line at bottom
  ctx.strokeStyle = data.textColor;
  ctx.globalAlpha = 0.15;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(contentX, footerY - 45);
  ctx.lineTo(contentX + contentW, footerY - 45);
  ctx.stroke();
  ctx.globalAlpha = 1.0;

  // Footer Layout: Left = Social Handle + Icons, Right = Current Date
  // Left: Social Handle
  let socialX = contentX;
  if (data.socialHandle) {
    ctx.fillStyle = data.textColor;
    ctx.font = '600 18px "Inter", system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    // Draw small social indicator dot / accent
    ctx.fillStyle = data.accentColor || '#EA580C';
    ctx.beginPath();
    ctx.arc(socialX + 8, footerY - 18, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = data.textColor;
    ctx.fillText(data.socialHandle, socialX + 22, footerY - 18);
  } else {
    // Brand signature default
    ctx.fillStyle = data.textColor;
    ctx.globalAlpha = 0.7;
    ctx.font = '600 16px "Inter", system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('INSPIRECANVAS', socialX, footerY - 18);
    ctx.globalAlpha = 1.0;
  }

  // Right: Formatted Date
  ctx.fillStyle = data.textColor;
  ctx.globalAlpha = 0.8;
  ctx.font = '700 15px "Inter", system-ui, sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.fillText(data.dateText, contentX + contentW, footerY - 18);

  ctx.restore();

  ctx.restore(); // Restore main save
  return canvas;
}

/**
 * Renders image inside designated shape (circle, rounded, square, oval)
 */
function renderImageShape(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  shape: string,
  accentColor: string
) {
  ctx.save();

  // Draw ring/border accent around profile image
  ctx.strokeStyle = accentColor || '#EA580C';
  ctx.lineWidth = 6;

  ctx.beginPath();
  if (shape === 'circle') {
    const cx = x + w / 2;
    const cy = y + h / 2;
    const r = w / 2;
    ctx.arc(cx, cy, r + 4, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();
  } else if (shape === 'rounded') {
    drawRoundedRect(ctx, x - 3, y - 3, w + 6, h + 6, 24);
    ctx.stroke();

    ctx.beginPath();
    drawRoundedRect(ctx, x, y, w, h, 20);
    ctx.clip();
  } else if (shape === 'oval') {
    ctx.ellipse(x + w / 2, y + h / 2, w / 2 + 4, h / 2 + 4, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
    ctx.clip();
  } else {
    // Square
    ctx.strokeRect(x - 3, y - 3, w + 6, h + 6);
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();
  }

  // Draw scaled cover image
  const imgRatio = img.width / img.height;
  const boxRatio = w / h;
  let renderW = w;
  let renderH = h;
  let offsetX = 0;
  let offsetY = 0;

  if (imgRatio > boxRatio) {
    renderH = h;
    renderW = h * imgRatio;
    offsetX = -(renderW - w) / 2;
  } else {
    renderW = w;
    renderH = w / imgRatio;
    offsetY = -(renderH - h) / 2;
  }

  ctx.drawImage(img, x + offsetX, y + offsetY, renderW, renderH);
  ctx.restore();
}

/**
 * Helper to draw a rounded rectangle path
 */
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Helper to split text into lines based on canvas width
 */
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.length > 0 ? lines : [text];
}
