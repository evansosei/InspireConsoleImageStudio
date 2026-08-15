export type ImagePosition = 'left' | 'right' | 'top' | 'bottom' | 'full';
export type ImageFit = 'cover' | 'contain';
export type TextAlign = 'left' | 'center' | 'right';
export type FontSize = 'small' | 'medium' | 'large' | 'xlarge';
export type FontFamily = 'serif' | 'sans' | 'display' | 'handwriting';
export type BorderRadius = 'none' | 'small' | 'medium' | 'large' | 'full';
export type ImageShape = 'circle' | 'rounded' | 'square' | 'oval' | 'full';
export type CardStyle = 'modern-split' | 'reference-inspired' | 'classic-card' | 'minimalist' | 'dark-luxury' | 'vibrant-accent';
export type AspectRatio = '1:1' | '4:5' | '9:16';

export interface QuoteData {
  text: string;
  author: string;
  socialHandle: string;
  dateText: string;
  imageUri: string | null;
  imagePosition: ImagePosition;
  imageFit?: ImageFit;
  bgColor: string;
  textColor: string;
  textBgColor?: string;
  accentColor: string;
  textAlign: TextAlign;
  fontSize: FontSize;
  fontFamily: FontFamily;
  borderRadius: BorderRadius;
  imageShape: ImageShape;
  cardStyle: CardStyle;
  showQuotes: boolean;
  showBadge: boolean;
  badgeText: string;
  showSocialIcons: boolean;
  selectedSocials: ('instagram' | 'x' | 'facebook' | 'tiktok')[];
  aspectRatio: AspectRatio;
}

export interface ColorPreset {
  name: string;
  hex: string;
  textColor: string;
  accentColor: string;
}

export interface StockImage {
  id: string;
  name: string;
  url: string;
  category: string;
}

export interface QuoteTemplate {
  id: string;
  name: string;
  description: string;
  data: Partial<QuoteData>;
}
