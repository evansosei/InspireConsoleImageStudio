import { QuoteData } from '../types';
import { getQuotedText } from './textUtils';

export function getCanvasDimensions(aspectRatio: '1:1' | '4:5' | '9:16' = '1:1') {
  switch (aspectRatio) {
    case '4:5':
      return { width: 1200, height: 1500 };
    case '9:16':
      return { width: 1080, height: 1920 };
    case '1:1':
    default:
      return { width: 1200, height: 1200 };
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

    const radius = data.borderRadius === 'none' ? 0 : data.borderRadius === 'small' ? 16 : data.borderRadius === 'medium' ? 32 : 48;

    // Draw Multi-layer Realistic Box Shadow for Floating Card
    ctx.save();
    // Layer 1: Ambient soft shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.28)';
    ctx.shadowBlur = 48;
    ctx.shadowOffsetY = 24;
    ctx.fillStyle = data.bgColor;
    drawRoundedRect(ctx, cardX, cardY, cardW, cardH, radius);
    ctx.fill();

    // Layer 2: Direct contact shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.18)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 8;
    drawRoundedRect(ctx, cardX, cardY, cardW, cardH, radius);
    ctx.fill();
    ctx.restore();

    // Subtle Glassmorphism Top Specular Highlight on Card
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, cardX + 1, cardY + 1, cardW - 2, cardH - 2, Math.max(0, radius - 1));
    ctx.stroke();
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

  // Card Content Area Padding (proportioned for high-impact content fill and balanced frame)
  const pad = 46;
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

    const imgW = loadedImg!.naturalWidth || loadedImg!.width;
    const imgH = loadedImg!.naturalHeight || loadedImg!.height;
    const imgRatio = imgW / imgH;
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
      // Default to Object-fit: COVER
      if (imgRatio > cardRatio) {
        rH = cardH;
        rW = cardH * imgRatio;
        oX = -(rW - cardW) / 2;
        oY = 0;
      } else {
        rW = cardW;
        rH = cardW / imgRatio;
        oX = 0;
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

  // 4. Draw Header (Top Badge on Left + Brand Tag on Right) - Tight, clean margin
  const headerY = contentY + 2;
  const headerHeight = 36;

  // Left: Badge
  if (data.showBadge && data.badgeText) {
    ctx.save();
    ctx.font = '800 17px "Inter", system-ui, sans-serif';
    const badgeText = data.badgeText.toUpperCase();
    const metrics = ctx.measureText(badgeText);
    const badgeW = metrics.width + 36;
    const badgeH = 34;

    ctx.fillStyle = data.accentColor || '#EA580C';
    drawRoundedRect(ctx, contentX, headerY, badgeW, badgeH, 17);
    ctx.fill();

    // Sparkle indicator symbol
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 15px "Inter", system-ui, sans-serif';
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
  ctx.globalAlpha = 0.75;
  ctx.font = '800 17px "Inter", system-ui, sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.fillText(brandTagText, contentX + contentW, headerY + 17);
  ctx.restore();

  // 5. Draw Footer Line and Metadata - Tightly integrated
  const footerLineY = contentY + contentH - 42;
  ctx.save();

  // Footer divider line
  ctx.strokeStyle = imgPos === 'full' && hasImg ? '#FFFFFF' : data.textColor;
  ctx.globalAlpha = 0.22;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(contentX, footerLineY);
  ctx.lineTo(contentX + contentW, footerLineY);
  ctx.stroke();
  ctx.globalAlpha = 1.0;

  const footerContentY = footerLineY + 22;

  // Footer Left: Social Handle + Dot
  ctx.fillStyle = data.accentColor || '#EA580C';
  ctx.beginPath();
  ctx.arc(contentX + 7, footerContentY, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = imgPos === 'full' && hasImg ? '#FFFFFF' : data.textColor;
  ctx.font = '700 19px "Inter", system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(data.socialHandle || '@PosterStudio', contentX + 20, footerContentY);

  // Footer Right: Date
  ctx.font = '700 19px "Inter", system-ui, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(data.dateText || 'TODAY', contentX + contentW, footerContentY);
  ctx.restore();

  // 6. Central Content Layout - Fully occupying the space between header and footer
  const centralTopY = headerY + headerHeight + 8;
  const centralBottomY = footerLineY - 8;
  const centralAvailableH = centralBottomY - centralTopY;
  const centralW = contentW;
  const centralX = contentX;

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

  const hasTextBg = Boolean(data.textBgColor && data.textBgColor !== 'transparent');
  const isSplitLayout = (imgPos === 'left' || imgPos === 'right') && hasImg;
  const splitGap = 24;
  const topBottomImgGap = 12;
  const padX = 24;
  const padY = 16;
  const quoteMarkH = 0;
  const quotedText = getQuotedText(data.text);

  let imgBoxSize = 0;
  let targetTextW = centralW;
  let targetTextH = centralAvailableH;
  let textX = centralX;
  let textY = centralTopY;
  let imgX = 0;
  let imgY = 0;

  if (isSplitLayout) {
    // Image and Text side-by-side filling the full height
    imgBoxSize = Math.min(centralAvailableH, Math.round(centralW * 0.42));
    targetTextW = centralW - imgBoxSize - splitGap;
    targetTextH = centralAvailableH;
    textY = centralTopY;
    imgY = centralTopY + (centralAvailableH - imgBoxSize) / 2;

    if (imgPos === 'left') {
      imgX = centralX;
      textX = centralX + imgBoxSize + splitGap;
    } else {
      textX = centralX;
      imgX = centralX + targetTextW + splitGap;
    }
  } else if (hasImg && imgPos === 'top') {
    imgBoxSize = Math.min(270, Math.round(centralAvailableH * 0.38));
    imgX = centralX + (centralW - imgBoxSize) / 2;
    imgY = centralTopY;
    targetTextW = centralW;
    targetTextH = centralAvailableH - imgBoxSize - topBottomImgGap;
    textX = centralX;
    textY = centralTopY + imgBoxSize + topBottomImgGap;
  } else if (hasImg && imgPos === 'bottom') {
    imgBoxSize = Math.min(270, Math.round(centralAvailableH * 0.38));
    targetTextW = centralW;
    targetTextH = centralAvailableH - imgBoxSize - topBottomImgGap;
    textX = centralX;
    textY = centralTopY;
    imgX = centralX + (centralW - imgBoxSize) / 2;
    imgY = centralTopY + targetTextH + topBottomImgGap;
  } else {
    // No image or full-canvas background image: Text box occupies the full central space
    targetTextW = centralW;
    targetTextH = centralAvailableH;
    textX = centralX;
    textY = centralTopY;
  }

  // Wrap text and auto-scale font size if needed so text fits comfortably inside targetTextH
  let lineHeight = fontSizePx * 1.30;
  let wrapW = targetTextW - padX * 2;
  let lines: string[] = [];
  let authorFontSize = Math.max(22, Math.round(fontSizePx * 0.62));

  for (let attempt = 0; attempt < 8; attempt++) {
    lineHeight = fontSizePx * 1.30;
    authorFontSize = Math.max(20, Math.round(fontSizePx * 0.62));
    ctx.font = `700 ${fontSizePx}px ${fontFam}`;
    ctx.textAlign = data.textAlign;
    ctx.textBaseline = 'top';

    lines = wrapText(ctx, quotedText, wrapW);
    const textLinesH = lines.length * lineHeight;
    const authorH = data.author && data.author.trim() ? authorFontSize + 14 : 0;
    const neededContentH = textLinesH + authorH + padY * 2;

    if (neededContentH <= targetTextH || fontSizePx <= 20) {
      break;
    }
    fontSizePx -= 3;
  }

  // Render Image
  if (hasImg && imgPos !== 'full' && loadedImg) {
    renderImageShape(ctx, loadedImg, imgX, imgY, imgBoxSize, imgBoxSize, data.imageShape, data.accentColor, data.imageFit);
  }

  // Render Text Box fully occupying targetTextH and targetTextW
  renderTextBlock(
    ctx,
    data,
    textX,
    textY,
    targetTextW,
    targetTextH,
    hasTextBg,
    padX,
    padY,
    lines,
    lineHeight,
    fontSizePx,
    fontFam,
    quoteMarkH,
    authorFontSize
  );

  ctx.restore();
  return canvas;
}

/**
 * Helper to render the text box (background container, border with 10px radius, quote marks, text lines, author)
 */
function renderTextBlock(
  ctx: CanvasRenderingContext2D,
  data: QuoteData,
  x: number,
  y: number,
  w: number,
  h: number,
  hasTextBg: boolean,
  padX: number,
  padY: number,
  lines: string[],
  lineHeight: number,
  fontSizePx: number,
  fontFam: string,
  quoteMarkH: number,
  authorFontSize: number
) {
  // 1. Draw Outer Box Shadow for Floating Glass Container
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.18)';
  ctx.shadowBlur = 28;
  ctx.shadowOffsetY = 12;
  ctx.fillStyle = hasTextBg ? data.textBgColor! : 'rgba(255, 255, 255, 0.12)';
  drawRoundedRect(ctx, x, y, w, h, 10);
  ctx.fill();
  ctx.restore();

  // 2. Draw Frosted Glassmorphism Background & Specular Shine
  ctx.save();
  if (hasTextBg) {
    ctx.fillStyle = data.textBgColor!;
    drawRoundedRect(ctx, x, y, w, h, 10);
    ctx.fill();
  }

  // Glassmorphism Specular Gradient (Frosted Glass Sheen)
  const glassShine = ctx.createLinearGradient(x, y, x, y + h);
  glassShine.addColorStop(0, 'rgba(255, 255, 255, 0.22)');
  glassShine.addColorStop(0.35, 'rgba(255, 255, 255, 0.08)');
  glassShine.addColorStop(1, 'rgba(255, 255, 255, 0.02)');
  ctx.fillStyle = glassShine;
  drawRoundedRect(ctx, x, y, w, h, 10);
  ctx.fill();

  // 3. Draw Crisp 10px Border-Radius Border with Glass Specular Edge
  ctx.strokeStyle = data.accentColor || '#EA580C';
  ctx.lineWidth = 2.5;
  drawRoundedRect(ctx, x, y, w, h, 10);
  ctx.stroke();

  // Top Glass Highlight Edge
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = 1.5;
  drawRoundedRect(ctx, x + 1, y + 1, w - 2, Math.min(24, h - 2), 8);
  ctx.stroke();
  ctx.restore();

  // Vertically center text and author inside the container of height h
  const textLinesH = lines.length * lineHeight;
  const authorSpacing = data.author && data.author.trim() ? 10 : 0;
  const authorBlockH = data.author && data.author.trim() ? authorFontSize + authorSpacing : 0;
  const totalContentH = textLinesH + authorBlockH;

  const innerPadY = Math.max(padY, (h - totalContentH) / 2);
  let textCursorY = y + innerPadY;

  // Draw Quote Mark
  if (data.showQuotes && quoteMarkH > 0) {
    ctx.save();
    ctx.fillStyle = data.accentColor || '#EA580C';
    ctx.globalAlpha = 0.45;
    ctx.font = '700 48px "Georgia", serif';
    ctx.textAlign = data.textAlign;
    let qX = x + padX;
    if (data.textAlign === 'center') qX = x + w / 2;
    if (data.textAlign === 'right') qX = x + w - padX;
    ctx.fillText('“', qX, textCursorY + 10);
    ctx.restore();
    textCursorY += quoteMarkH;
  }

  // Draw Text Lines
  ctx.save();
  ctx.fillStyle = data.textColor || '#0F172A';
  ctx.font = `700 ${fontSizePx}px ${fontFam}`;
  ctx.textAlign = data.textAlign;
  ctx.textBaseline = 'top';

  const contentInnerW = w - padX * 2;
  const contentInnerX = x + padX;

  lines.forEach((line) => {
    let lineX = contentInnerX;
    if (data.textAlign === 'center') lineX = contentInnerX + contentInnerW / 2;
    if (data.textAlign === 'right') lineX = contentInnerX + contentInnerW;
    ctx.fillText(line, lineX, textCursorY);
    textCursorY += lineHeight;
  });

  // Draw Author Name closely connected to quote text
  if (data.author && data.author.trim()) {
    textCursorY += 10;
    ctx.font = `700 ${authorFontSize}px "Inter", system-ui, sans-serif`;
    ctx.fillStyle = data.accentColor || '#EA580C';

    const authorStr = `— ${data.author.trim()}`;
    let authorX = contentInnerX;
    if (data.textAlign === 'center') authorX = contentInnerX + contentInnerW / 2;
    if (data.textAlign === 'right') authorX = contentInnerX + contentInnerW;
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
  // 1. Draw Outer Drop Shadow for Image Container
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.28)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 10;
  ctx.fillStyle = '#000000';

  if (shape === 'circle') {
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h / 2, w / 2, 0, Math.PI * 2);
    ctx.fill();
  } else if (shape === 'rounded') {
    drawRoundedRect(ctx, x, y, w, h, 20);
    ctx.fill();
  } else if (shape === 'oval') {
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillRect(x, y, w, h);
  }
  ctx.restore();

  ctx.save();

  // 2. Draw ring/border accent around profile image
  ctx.strokeStyle = accentColor || '#EA580C';
  ctx.lineWidth = 5;

  ctx.beginPath();
  if (shape === 'circle') {
    const cx = x + w / 2;
    const cy = y + h / 2;
    const r = w / 2;
    ctx.arc(cx, cy, r + 3, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();
  } else if (shape === 'rounded') {
    drawRoundedRect(ctx, x - 2.5, y - 2.5, w + 5, h + 5, 22);
    ctx.stroke();

    ctx.beginPath();
    drawRoundedRect(ctx, x, y, w, h, 20);
    ctx.clip();
  } else if (shape === 'oval') {
    ctx.ellipse(x + w / 2, y + h / 2, w / 2 + 3, h / 2 + 3, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
    ctx.clip();
  } else {
    // Square
    ctx.strokeRect(x - 2.5, y - 2.5, w + 5, h + 5);
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();
  }

  // Draw scaled image (object-fit: cover or contain)
  const imgW = img.naturalWidth || img.width;
  const imgH = img.naturalHeight || img.height;
  const imgRatio = imgW / imgH;
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
    // Default: Object-Fit COVER (fills entire frame, zero letterbox)
    if (imgRatio > boxRatio) {
      renderH = h;
      renderW = h * imgRatio;
      offsetX = -(renderW - w) / 2;
      offsetY = 0;
    } else {
      renderW = w;
      renderH = w / imgRatio;
      offsetX = 0;
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
