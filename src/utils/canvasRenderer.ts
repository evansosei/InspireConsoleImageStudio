import { QuoteData } from '../types';
import { getQuotedText } from './textUtils';

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
    img.onerror = () => {
      // Fallback without crossOrigin in case CORS headers are omitted
      const fallbackImg = new Image();
      fallbackImg.onload = () => resolve(fallbackImg);
      fallbackImg.onerror = (err) => reject(err);
      fallbackImg.src = src;
    };
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

  // 1. Draw Outer Canvas Background (Dark luxury backdrop for card styles, or direct background)
  const isCardStyle = data.cardStyle === 'reference-inspired' || data.cardStyle === 'dark-luxury';
  if (isCardStyle) {
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

    // Subtle decorative ambient glow in backdrop
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.beginPath();
    ctx.arc(width * 0.15, height * 0.15, 320, 0, Math.PI * 2);
    ctx.arc(width * 0.85, height * 0.85, 280, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = data.bgColor;
    ctx.fillRect(0, 0, width, height);
  }

  // 2. Determine Inner Card Box Dimensions (Exact match with live preview margin/padding)
  let cardX = 0;
  let cardY = 0;
  let cardW = width;
  let cardH = height;

  if (isCardStyle) {
    const marginX = 52;
    const marginY = 52;
    cardX = marginX;
    cardY = marginY;
    cardW = width - marginX * 2;
    cardH = height - marginY * 2;

    // Draw Inner Card Background with border radius & soft shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
    ctx.shadowBlur = 32;
    ctx.shadowOffsetY = 16;

    ctx.fillStyle = data.bgColor;
    const radius = data.borderRadius === 'none' ? 0 : data.borderRadius === 'small' ? 16 : data.borderRadius === 'medium' ? 32 : 48;
    drawRoundedRect(ctx, cardX, cardY, cardW, cardH, radius);
    ctx.fill();
    ctx.restore();
  }

  // If card style has vibrant accent border
  if (data.cardStyle === 'vibrant-accent') {
    ctx.save();
    ctx.strokeStyle = data.accentColor || '#EA580C';
    ctx.lineWidth = 6;
    drawRoundedRect(ctx, cardX + 3, cardY + 3, cardW - 6, cardH - 6, 24);
    ctx.stroke();
    ctx.restore();
  }

  // Card Content Area Padding (matches live preview p-5 md:p-6 relative scale)
  const pad = 54;
  const contentX = cardX + pad;
  const contentY = cardY + pad;
  const contentW = cardW - pad * 2;
  const contentH = cardH - pad * 2;

  // 3. Load & Prepare Image if exists
  let loadedImg: HTMLImageElement | null = null;
  if (data.imageUri) {
    try {
      loadedImg = await loadImage(data.imageUri);
    } catch (e) {
      console.warn('Failed to load image for canvas:', e);
    }
  }

  const hasImg = loadedImg !== null;
  const imgPos = data.imagePosition;

  // If Full Background Image Mode:
  if (hasImg && imgPos === 'full') {
    ctx.save();
    const radius = data.borderRadius === 'none' ? 0 : data.borderRadius === 'small' ? 16 : data.borderRadius === 'medium' ? 32 : 48;
    if (isCardStyle) {
      drawRoundedRect(ctx, cardX, cardY, cardW, cardH, radius);
      ctx.clip();
    }

    const imgRatio = loadedImg!.width / loadedImg!.height;
    const cardRatio = cardW / cardH;
    let rW = cardW;
    let rH = cardH;
    let oX = 0;
    let oY = 0;

    if (data.imageFit === 'contain') {
      if (imgRatio > cardRatio) {
        rW = cardW;
        rH = cardW / imgRatio;
        oY = (cardH - rH) / 2;
      } else {
        rH = cardH;
        rW = cardH * imgRatio;
        oX = (cardW - rW) / 2;
      }
    } else {
      if (imgRatio > cardRatio) {
        rH = cardH;
        rW = cardH * imgRatio;
        oX = -(rW - cardW) / 2;
      } else {
        rW = cardW;
        rH = cardW / imgRatio;
        oY = -(rH - cardH) / 2;
      }
    }

    ctx.drawImage(loadedImg!, cardX + oX, cardY + oY, rW, rH);

    // Overlay scrim for text contrast
    const scrim = ctx.createLinearGradient(cardX, cardY, cardX, cardY + cardH);
    scrim.addColorStop(0, 'rgba(0, 0, 0, 0.50)');
    scrim.addColorStop(0.5, 'rgba(0, 0, 0, 0.65)');
    scrim.addColorStop(1, 'rgba(0, 0, 0, 0.85)');
    ctx.fillStyle = scrim;
    ctx.fillRect(cardX, cardY, cardW, cardH);
    ctx.restore();
  }

  // 4. Draw Header (Top Badge on Left + Brand Tag on Right)
  const headerY = contentY;
  const headerHeight = 36;

  // Left: Badge
  if (data.showBadge && data.badgeText) {
    ctx.save();
    ctx.font = '800 13px "Inter", system-ui, sans-serif';
    const badgeText = data.badgeText.toUpperCase();
    const metrics = ctx.measureText(badgeText);
    const badgeW = metrics.width + 36;
    const badgeH = 30;

    ctx.fillStyle = data.accentColor || '#EA580C';
    drawRoundedRect(ctx, contentX, headerY, badgeW, badgeH, 15);
    ctx.fill();

    // Sparkle indicator symbol
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 11px "Inter", system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('✦ ' + badgeText, contentX + 12, headerY + badgeH / 2 + 1);
    ctx.restore();
  }

  // Right: Subtle Brand Tag with <Author Name> STUDIO
  const trimmedAuthor = data.author ? data.author.trim().toUpperCase() : '';
  const brandTagText = trimmedAuthor
    ? trimmedAuthor.endsWith('STUDIO')
      ? trimmedAuthor
      : `${trimmedAuthor} STUDIO`
    : 'STUDIO';
  ctx.save();
  ctx.fillStyle = imgPos === 'full' && hasImg ? '#FFFFFF' : data.textColor;
  ctx.globalAlpha = 0.6;
  ctx.font = '700 12px "Inter", system-ui, sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.fillText(brandTagText, contentX + contentW, headerY + 15);
  ctx.restore();

  // 5. Draw Footer Line and Metadata
  const footerLineY = contentY + contentH - 44;
  ctx.save();

  // Footer divider line
  ctx.strokeStyle = imgPos === 'full' && hasImg ? '#FFFFFF' : data.textColor;
  ctx.globalAlpha = 0.2;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(contentX, footerLineY);
  ctx.lineTo(contentX + contentW, footerLineY);
  ctx.stroke();
  ctx.globalAlpha = 1.0;

  const footerContentY = footerLineY + 24;

  // Footer Left: Social Handle + Dot
  ctx.fillStyle = data.accentColor || '#EA580C';
  ctx.beginPath();
  ctx.arc(contentX + 6, footerContentY, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = imgPos === 'full' && hasImg ? '#FFFFFF' : data.textColor;
  ctx.font = '600 15px "Inter", system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(data.socialHandle || '@PosterStudio', contentX + 18, footerContentY);

  // Footer Right: Date
  ctx.textAlign = 'right';
  ctx.fillText('♥ ' + (data.dateText || 'Today'), contentX + contentW, footerContentY);
  ctx.restore();

  // 6. Central Content Layout and Vertical Centering
  const centralTopY = headerY + headerHeight + 14;
  const centralBottomY = footerLineY - 14;
  const centralAvailableH = centralBottomY - centralTopY;
  const centralW = contentW;
  const centralX = contentX;

  // Image Box Dimensions
  let imgBoxSize = 130;
  if (imgPos === 'left' || imgPos === 'right') {
    imgBoxSize = 200;
  }

  // Font properties
  let fontSizePx = 44;
  if (data.fontSize === 'small') fontSizePx = 32;
  if (data.fontSize === 'medium') fontSizePx = 40;
  if (data.fontSize === 'large') fontSizePx = 48;
  if (data.fontSize === 'xlarge') fontSizePx = 58;

  let fontFam = '"Playfair Display", "Georgia", serif';
  if (data.fontFamily === 'sans') fontFam = '"Plus Jakarta Sans", "Inter", system-ui, sans-serif';
  if (data.fontFamily === 'display') fontFam = '"Impact", "Plus Jakarta Sans", "Arial Black", sans-serif';
  if (data.fontFamily === 'handwriting') fontFam = '"Caveat", "Brush Script MT", cursive, sans-serif';

  const lineHeight = fontSizePx * 1.35;
  const hasTextBg = Boolean(data.textBgColor && data.textBgColor !== 'transparent');

  // Text Wrap & Measure
  ctx.font = `700 ${fontSizePx}px ${fontFam}`;
  ctx.textAlign = data.textAlign;
  ctx.textBaseline = 'top';

  const isSplitLayout = (imgPos === 'left' || imgPos === 'right') && hasImg;
  const splitGap = 36;
  const targetTextW = isSplitLayout ? centralW - imgBoxSize - splitGap : centralW;
  const wrapW = hasTextBg ? targetTextW - (isSplitLayout ? 36 : 56) : targetTextW;

  const quotedText = getQuotedText(data.text);
  const lines = wrapText(ctx, quotedText, wrapW);
  const textLinesH = lines.length * lineHeight;
  const quoteMarkH = 0;
  const authorH = data.author && data.author.trim() ? (fontSizePx > 40 ? 38 : 32) : 0;
  const rawTextContentH = textLinesH + authorH;
  const textBoxPaddingY = hasTextBg ? 22 : 0;
  const textBoxH = rawTextContentH + textBoxPaddingY * 2;

  // Determine vertical centering placement
  const topBottomImgGap = 16;

  let totalBlockH = textBoxH;
  if (isSplitLayout) {
    totalBlockH = Math.max(imgBoxSize, textBoxH);
  } else if (hasImg && imgPos === 'top') {
    totalBlockH = imgBoxSize + topBottomImgGap + textBoxH;
  } else if (hasImg && imgPos === 'bottom') {
    totalBlockH = textBoxH + topBottomImgGap + imgBoxSize;
  }

  const startBlockY = centralTopY + Math.max(0, (centralAvailableH - totalBlockH) / 2);

  // Render Image and Text based on layout
  if (isSplitLayout) {
    const imgX = imgPos === 'left' ? centralX : centralX + targetTextW + splitGap;
    const imgY = startBlockY + (totalBlockH - imgBoxSize) / 2;
    renderImageShape(ctx, loadedImg!, imgX, imgY, imgBoxSize, imgBoxSize, data.imageShape, data.accentColor, data.imageFit);

    const textX = imgPos === 'left' ? centralX + imgBoxSize + splitGap : centralX;
    const textY = startBlockY + (totalBlockH - textBoxH) / 2;
    renderTextBlock(ctx, data, textX, textY, targetTextW, textBoxH, hasTextBg, textBoxPaddingY, lines, lineHeight, fontSizePx, fontFam, quoteMarkH);
  } else {
    let currentY = startBlockY;

    if (hasImg && imgPos === 'top') {
      const imgX = centralX + (centralW - imgBoxSize) / 2;
      renderImageShape(ctx, loadedImg!, imgX, currentY, imgBoxSize, imgBoxSize, data.imageShape, data.accentColor, data.imageFit);
      currentY += imgBoxSize + topBottomImgGap;
    }

    // Text block
    renderTextBlock(ctx, data, centralX, currentY, targetTextW, textBoxH, hasTextBg, textBoxPaddingY, lines, lineHeight, fontSizePx, fontFam, quoteMarkH);
    currentY += textBoxH;

    if (hasImg && imgPos === 'bottom') {
      currentY += topBottomImgGap;
      const imgX = centralX + (centralW - imgBoxSize) / 2;
      renderImageShape(ctx, loadedImg!, imgX, currentY, imgBoxSize, imgBoxSize, data.imageShape, data.accentColor, data.imageFit);
    }
  }

  ctx.restore();
  return canvas;
}

/**
 * Helper to render the text box (background container, quote marks, text lines, author)
 */
function renderTextBlock(
  ctx: CanvasRenderingContext2D,
  data: QuoteData,
  x: number,
  y: number,
  w: number,
  h: number,
  hasTextBg: boolean,
  padY: number,
  lines: string[],
  lineHeight: number,
  fontSizePx: number,
  fontFam: string,
  quoteMarkH: number
) {
  // Draw Background highlight container if chosen
  if (hasTextBg) {
    ctx.save();
    ctx.fillStyle = data.textBgColor!;
    drawRoundedRect(ctx, x, y, w, h, 20);
    ctx.fill();
    ctx.restore();
  }

  let textCursorY = y + padY;

  // Draw Quote Mark
  if (data.showQuotes && quoteMarkH > 0) {
    ctx.save();
    ctx.fillStyle = data.accentColor || '#EA580C';
    ctx.globalAlpha = 0.45;
    ctx.font = '700 48px "Georgia", serif';
    ctx.textAlign = data.textAlign;
    let qX = x;
    if (data.textAlign === 'center') qX = x + w / 2;
    if (data.textAlign === 'right') qX = x + w;
    ctx.fillText('“', qX, textCursorY + 12);
    ctx.restore();
    textCursorY += quoteMarkH;
  }

  // Draw Text Lines
  ctx.save();
  ctx.fillStyle = data.textColor || '#0F172A';
  ctx.font = `700 ${fontSizePx}px ${fontFam}`;
  ctx.textAlign = data.textAlign;
  ctx.textBaseline = 'top';

  lines.forEach((line) => {
    let lineX = x;
    if (data.textAlign === 'center') lineX = x + w / 2;
    if (data.textAlign === 'right') lineX = x + w;
    ctx.fillText(line, lineX, textCursorY);
    textCursorY += lineHeight;
  });

  // Draw Author Name
  if (data.author && data.author.trim()) {
    textCursorY += 12;
    ctx.font = '600 20px "Inter", system-ui, sans-serif';
    ctx.fillStyle = data.accentColor || '#EA580C';

    const authorStr = `— ${data.author.trim()}`;
    let authorX = x;
    if (data.textAlign === 'center') authorX = x + w / 2;
    if (data.textAlign === 'right') authorX = x + w;
    ctx.fillText(authorStr, authorX, textCursorY);
  }
  ctx.restore();
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
  accentColor: string,
  imageFit?: 'cover' | 'contain'
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

  // Draw scaled image (contain or cover)
  const imgRatio = img.width / img.height;
  const boxRatio = w / h;
  let renderW = w;
  let renderH = h;
  let offsetX = 0;
  let offsetY = 0;

  if (imageFit === 'contain') {
    if (imgRatio > boxRatio) {
      renderW = w;
      renderH = w / imgRatio;
      offsetY = (h - renderH) / 2;
    } else {
      renderH = h;
      renderW = h * imgRatio;
      offsetX = (w - renderW) / 2;
    }
  } else {
    if (imgRatio > boxRatio) {
      renderH = h;
      renderW = h * imgRatio;
      offsetX = -(renderW - w) / 2;
    } else {
      renderW = w;
      renderH = w / imgRatio;
      offsetY = -(renderH - h) / 2;
    }
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
 * Helper to split text into lines based on canvas width, respecting explicit newlines (\n)
 */
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  if (!text) return [''];
  const paragraphs = text.split('\n');
  const lines: string[] = [];

  for (const paragraph of paragraphs) {
    if (paragraph.trim() === '') {
      lines.push('');
      continue;
    }
    const words = paragraph.split(/\s+/);
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (!word) continue;
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
  }

  return lines.length > 0 ? lines : [text];
}
