import { ColorPreset, QuoteTemplate, StockImage, QuoteData } from '../types';
import defaultPortrait from '../assets/images/evans_default_portrait_1786544027588.jpg';

export const COLOR_PRESETS: ColorPreset[] = [
  { name: 'Soft Yellow', hex: '#FEF08A', textColor: '#1E293B', accentColor: '#EA580C' },
  { name: 'Warm Cream', hex: '#FAF5EF', textColor: '#1C1917', accentColor: '#D97706' },
  { name: 'Pure White', hex: '#FFFFFF', textColor: '#0F172A', accentColor: '#2563EB' },
  { name: 'Dark Navy', hex: '#0F172A', textColor: '#F8FAFC', accentColor: '#F59E0B' },
  { name: 'Charcoal Black', hex: '#18181B', textColor: '#FAFAFA', accentColor: '#3B82F6' },
  { name: 'Peach Orange', hex: '#FFEDD5', textColor: '#7C2D12', accentColor: '#EA580C' },
  { name: 'Soft Emerald', hex: '#DCFCE7', textColor: '#064E3B', accentColor: '#059669' },
  { name: 'Light Blue', hex: '#E0F2FE', textColor: '#0C4A6E', accentColor: '#0284C7' },
  { name: 'Lavender Purple', hex: '#F3E8FF', textColor: '#581C87', accentColor: '#9333EA' },
  { name: 'Rose Gold', hex: '#FFE4E6', textColor: '#881337', accentColor: '#E11D48' },
  { name: 'Slate Gray', hex: '#334155', textColor: '#F8FAFC', accentColor: '#38BDF8' }
];

export interface TextColorPreset {
  name: string;
  hex: string;
}

export const TEXT_COLOR_PRESETS: TextColorPreset[] = [
  { name: 'Dark Slate', hex: '#0F172A' },
  { name: 'Pure White', hex: '#FFFFFF' },
  { name: 'Charcoal Black', hex: '#18181B' },
  { name: 'Navy Blue', hex: '#1E3A8A' },
  { name: 'Warm Amber', hex: '#D97706' },
  { name: 'Vibrant Orange', hex: '#EA580C' },
  { name: 'Forest Green', hex: '#047857' },
  { name: 'Crimson Red', hex: '#BE123C' },
  { name: 'Royal Purple', hex: '#7C3AED' },
  { name: 'Warm Brown', hex: '#78350F' }
];

export interface TextBgPreset {
  name: string;
  value: string;
  previewBg: string;
  border?: boolean;
}

export const TEXT_BG_PRESETS: TextBgPreset[] = [
  { name: 'None (Transparent)', value: 'transparent', previewBg: 'transparent', border: true },
  { name: 'Dark Translucent', value: 'rgba(15, 23, 42, 0.85)', previewBg: '#0F172A' },
  { name: 'White Glass', value: 'rgba(255, 255, 255, 0.90)', previewBg: '#FFFFFF', border: true },
  { name: 'Soft Cream', value: 'rgba(254, 240, 138, 0.85)', previewBg: '#FEF08A' },
  { name: 'Warm Amber', value: 'rgba(254, 215, 170, 0.85)', previewBg: '#FED7AA' },
  { name: 'Soft Emerald', value: 'rgba(220, 252, 231, 0.85)', previewBg: '#DCFCE7' },
  { name: 'Soft Lavender', value: 'rgba(243, 232, 255, 0.85)', previewBg: '#F3E8FF' },
  { name: 'Soft Rose', value: 'rgba(255, 228, 230, 0.85)', previewBg: '#FFE4E6' },
  { name: 'Charcoal Solid', value: '#18181B', previewBg: '#18181B' }
];

export const MOTIVATION_THEMES = [
  'General Motivation',
  'Success & Achievement',
  'Discipline & Focus',
  'Faith & Spirituality',
  'Courage & Resilience',
  'Hard Work & Grit',
  'Self-Belief & Confidence',
  'Leadership & Impact',
  'Perseverance & Hope',
  'Purpose & Vision',
  'Gratitude & Mindset'
];

export const STOCK_IMAGES: StockImage[] = [
  {
    id: 'portrait-evans',
    name: 'Sir Evans Portrait',
    url: defaultPortrait,
    category: 'People'
  },
  {
    id: 'portrait-1',
    name: 'Professional Speaker',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
    category: 'People'
  },
  {
    id: 'portrait-2',
    name: 'Leader / Mentor',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
    category: 'People'
  },
  {
    id: 'portrait-3',
    name: 'Creative Visionary',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600',
    category: 'People'
  },
  {
    id: 'portrait-4',
    name: 'Executive Leader',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600',
    category: 'People'
  },
  {
    id: 'nature-1',
    name: 'Mountain Sunrise',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600',
    category: 'Nature'
  },
  {
    id: 'nature-2',
    name: 'Ocean Horizons',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
    category: 'Nature'
  },
  {
    id: 'urban-1',
    name: 'City Skyline Purpose',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600',
    category: 'Urban'
  },
  {
    id: 'abstract-1',
    name: 'Golden Light Rays',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=600',
    category: 'Abstract'
  }
];

export const STARTER_TEMPLATES: QuoteTemplate[] = [
  {
    id: 'reference-style',
    name: 'Reference Design (Split Card)',
    description: 'Rounded light quote card with dark backdrop, top profile image, orange accents, and bold quote.',
    data: {
      text: "When you are an original and walk in God's plan, you shine like a star in the firmament.",
      author: "Poster Studio",
      socialHandle: "@PosterStudio",
      imageUri: defaultPortrait,
      imagePosition: 'top',
      bgColor: '#FEF08A',
      textColor: '#0F172A',
      accentColor: '#EA580C',
      fontFamily: 'serif',
      fontSize: 'large',
      textAlign: 'center',
      borderRadius: 'large',
      imageShape: 'circle',
      cardStyle: 'reference-inspired',
      showQuotes: true,
      showBadge: true,
      badgeText: 'DAILY INSPIRATION'
    }
  },
  {
    id: 'left-portrait',
    name: 'Left Image Modern',
    description: 'Clean side-by-side layout with left portrait and right bold text.',
    data: {
      text: "Discipline is choosing between what you want now and what you want most.",
      author: "Coach Marcus",
      socialHandle: "@MarcusInspires",
      imageUri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
      imagePosition: 'left',
      bgColor: '#FAF5EF',
      textColor: '#18181B',
      accentColor: '#2563EB',
      fontFamily: 'sans',
      fontSize: 'medium',
      textAlign: 'left',
      borderRadius: 'medium',
      imageShape: 'rounded',
      cardStyle: 'modern-split',
      showQuotes: true,
      showBadge: true,
      badgeText: 'MINDSET SHIFT'
    }
  },
  {
    id: 'dark-gold',
    name: 'Dark Luxury Gold',
    description: 'Premium dark charcoal layout with golden highlights and elegant serif quote.',
    data: {
      text: "Do not wait for extraordinary opportunities. Seize common occasions and make them great.",
      author: "Elena Rostova",
      socialHandle: "@Elena_Rostova",
      imageUri: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600',
      imagePosition: 'top',
      bgColor: '#0F172A',
      textColor: '#F8FAFC',
      accentColor: '#F59E0B',
      fontFamily: 'serif',
      fontSize: 'large',
      textAlign: 'center',
      borderRadius: 'large',
      imageShape: 'circle',
      cardStyle: 'dark-luxury',
      showQuotes: true,
      showBadge: true,
      badgeText: 'EXCELLENCE'
    }
  },
  {
    id: 'bottom-landscape',
    name: 'Bottom Image Nature',
    description: 'Inspiring quote at top with serene landscape placed at the bottom.',
    data: {
      text: "The secret of getting ahead is getting started with courage and unwavering focus.",
      author: "David Vance",
      socialHandle: "@DavidVanceOfficial",
      imageUri: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600',
      imagePosition: 'bottom',
      bgColor: '#E0F2FE',
      textColor: '#0C4A6E',
      accentColor: '#0284C7',
      fontFamily: 'display',
      fontSize: 'medium',
      textAlign: 'center',
      borderRadius: 'large',
      imageShape: 'rounded',
      cardStyle: 'vibrant-accent',
      showQuotes: true,
      showBadge: true,
      badgeText: 'DAILY PERSPECTIVE'
    }
  },
  {
    id: 'emerald-growth',
    name: 'Emerald Growth',
    description: 'Fresh mint and emerald theme with clean typography and uplifting tone.',
    data: {
      text: "Every small step in the right direction leads to the summit of your dreams.",
      author: "Grace Asante",
      socialHandle: "@GraceAsante",
      imageUri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
      imagePosition: 'top',
      bgColor: '#DCFCE7',
      textColor: '#064E3B',
      accentColor: '#059669',
      fontFamily: 'sans',
      fontSize: 'large',
      textAlign: 'center',
      borderRadius: 'large',
      imageShape: 'circle',
      cardStyle: 'reference-inspired',
      showQuotes: true,
      showBadge: true,
      badgeText: 'GROWTH MINDSET'
    }
  },
  {
    id: 'sunset-vibes',
    name: 'Sunset Peach Warmth',
    description: 'Warm peach palette with bold crimson display typography.',
    data: {
      text: "Your potential is limitless when you align purpose with consistent daily action.",
      author: "Kwame Mensah",
      socialHandle: "@KwameMensah",
      imageUri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600',
      imagePosition: 'top',
      bgColor: '#FFEDD5',
      textColor: '#7C2D12',
      accentColor: '#EA580C',
      fontFamily: 'serif',
      fontSize: 'large',
      textAlign: 'center',
      borderRadius: 'large',
      imageShape: 'circle',
      cardStyle: 'reference-inspired',
      showQuotes: true,
      showBadge: true,
      badgeText: 'DAILY FIRE'
    }
  }
];

export const getRandomPresetData = (): Partial<QuoteData> => {
  const bg = COLOR_PRESETS[Math.floor(Math.random() * COLOR_PRESETS.length)];
  const fontFamilies: ('sans' | 'serif' | 'display' | 'handwriting')[] = ['sans', 'serif', 'display', 'handwriting'];
  const fontSizes: ('small' | 'medium' | 'large' | 'xlarge')[] = ['medium', 'large'];
  const alignments: ('left' | 'center' | 'right')[] = ['left', 'center'];
  const positions: ('top' | 'left' | 'right' | 'bottom' | 'full')[] = ['top', 'left', 'bottom'];
  const shapes: ('circle' | 'rounded' | 'square')[] = ['circle', 'rounded'];

  return {
    bgColor: bg.hex,
    textColor: bg.textColor,
    accentColor: bg.accentColor,
    fontFamily: fontFamilies[Math.floor(Math.random() * fontFamilies.length)],
    fontSize: fontSizes[Math.floor(Math.random() * fontSizes.length)],
    textAlign: alignments[Math.floor(Math.random() * alignments.length)],
    imagePosition: positions[Math.floor(Math.random() * positions.length)],
    imageShape: shapes[Math.floor(Math.random() * shapes.length)]
  };
};
