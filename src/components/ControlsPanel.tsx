import React, { useState } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Sparkles,
  Layout,
  Palette,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  User,
  AtSign,
  RefreshCw,
  Eye,
  Share2,
  Download,
  Sliders,
  Check
} from 'lucide-react';
import { QuoteData, ImagePosition, TextAlign, FontSize, FontFamily, BorderRadius, ImageShape, CardStyle } from '../types';
import { COLOR_PRESETS, MOTIVATION_THEMES } from '../data/presets';

interface ControlsPanelProps {
  data: QuoteData;
  onChange: (updated: Partial<QuoteData>) => void;
  onOpenStockModal: () => void;
  onOpenFinalCanvas: () => void;
  onShare: () => void;
  onDownload: () => void;
  validationError: string | null;
}

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  data,
  onChange,
  onOpenStockModal,
  onOpenFinalCanvas,
  onShare,
  onDownload,
  validationError
}) => {
  const [selectedTheme, setSelectedTheme] = useState<string>('General Motivation');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          onChange({ imageUri: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // AI Quote Generation Call
  const handleGenerateAiQuote = async () => {
    setIsGenerating(true);
    setAiError(null);
    try {
      const res = await fetch('/api/generate-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: selectedTheme, authorPreference: data.author })
      });
      const resData = await res.json();
      if (resData && resData.quote) {
        onChange({ text: resData.quote });
      } else {
        setAiError('Failed to generate quote. Try again!');
      }
    } catch (err) {
      console.error('Error generating quote:', err);
      setAiError('Network error while generating quote. Local quote loaded.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white/50 backdrop-blur-md border border-slate-200/80 rounded-3xl p-4 sm:p-6 space-y-6 text-slate-800 shadow-xl shadow-slate-200/40">
      {/* Validation Error Alert */}
      {validationError && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-700 text-xs font-semibold flex items-center justify-between">
          <span>⚠️ {validationError}</span>
        </div>
      )}

      {/* 1. IMAGE UPLOAD & STOCK PHOTO SECTION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-orange-600" />
            <span>Profile or Background Image</span>
          </label>
          <span className="text-[11px] text-slate-400 font-medium">(Optional)</span>
        </div>

        {data.imageUri ? (
          <div className="flex items-center gap-3 p-3 bg-white/80 border border-slate-200/90 rounded-2xl shadow-sm">
            <img
              src={data.imageUri}
              alt="Uploaded thumbnail"
              className="w-14 h-14 object-cover rounded-xl border border-orange-300"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">
                Active Image Loaded
              </p>
              <p className="text-[11px] text-slate-500">
                Position: <span className="text-orange-600 font-semibold capitalize">{data.imagePosition}</span>
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenStockModal}
                className="px-3 py-1.5 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 transition-colors"
              >
                Change
              </button>
              <button
                onClick={() => onChange({ imageUri: null })}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Remove image"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Custom file upload input */}
            <label className="cursor-pointer border-2 border-dashed border-slate-300 hover:border-orange-500 bg-white/50 hover:bg-white/80 p-3.5 rounded-2xl flex flex-col items-center justify-center text-center transition-all group shadow-sm">
              <Upload className="w-5 h-5 text-orange-600 group-hover:scale-110 transition-transform mb-1" />
              <span className="text-xs font-bold text-slate-700">Upload Photo</span>
              <span className="text-[10px] text-slate-400 font-medium">JPG, PNG, WEBP</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {/* Stock gallery selector */}
            <button
              onClick={onOpenStockModal}
              className="border border-slate-200/90 hover:border-orange-500 bg-white/70 hover:bg-white p-3.5 rounded-2xl flex flex-col items-center justify-center text-center transition-all group shadow-sm"
            >
              <ImageIcon className="w-5 h-5 text-sky-600 group-hover:scale-110 transition-transform mb-1" />
              <span className="text-xs font-bold text-slate-700">Pick Stock Photo</span>
              <span className="text-[10px] text-slate-400 font-medium">Curated Library</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. IMAGE POSITION SELECTOR */}
      {data.imageUri && (
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Layout className="w-4 h-4 text-orange-600" />
            <span>Image Position</span>
          </label>
          <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/60">
            {(['left', 'top', 'right', 'bottom'] as ImagePosition[]).map((pos) => (
              <button
                key={pos}
                onClick={() => onChange({ imagePosition: pos })}
                className={`py-1.5 px-2 text-xs font-bold capitalize rounded-lg transition-all flex flex-col items-center gap-1 ${
                  data.imagePosition === pos
                    ? 'bg-white text-slate-900 shadow-sm font-extrabold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span className="text-[11px]">{pos.toUpperCase()}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. MOTIVATIONAL MESSAGE & AI GENERATOR */}
      <div className="space-y-3 pt-2 border-t border-slate-200/80">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Type className="w-4 h-4 text-orange-600" />
            <span>The Message</span>
          </label>
          <button
            onClick={handleGenerateAiQuote}
            disabled={isGenerating}
            className="text-[11px] font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200 px-3 py-1 rounded-lg flex items-center gap-1 shadow-sm transition-colors disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>GENERATING...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3" />
                <span>✨ GENERATE AI</span>
              </>
            )}
          </button>
        </div>

        <textarea
          value={data.text}
          onChange={(e) => onChange({ text: e.target.value })}
          placeholder="Write your motivational message..."
          rows={3}
          className="w-full bg-white border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 rounded-xl p-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all resize-none shadow-sm"
        />

        {/* AI Theme selector dropdown */}
        <div className="flex items-center justify-between gap-2 bg-white/70 border border-slate-200/80 p-2 rounded-xl text-xs">
          <span className="font-semibold text-slate-500">Theme:</span>
          <select
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
            className="flex-1 bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
          >
            {MOTIVATION_THEMES.map((th) => (
              <option key={th} value={th}>
                {th}
              </option>
            ))}
          </select>
        </div>
        {aiError && <p className="text-[11px] text-rose-600 font-medium">{aiError}</p>}
      </div>

      {/* 4. AUTHOR & SOCIAL MEDIA HANDLE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/80">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-orange-600" />
            <span>Author</span>
          </label>
          <input
            type="text"
            value={data.author}
            onChange={(e) => onChange({ author: e.target.value })}
            placeholder="e.g. Sir Handel"
            className="w-full bg-white border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 rounded-xl p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none shadow-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <AtSign className="w-3.5 h-3.5 text-orange-600" />
            <span>Handle</span>
          </label>
          <input
            type="text"
            value={data.socialHandle}
            onChange={(e) => onChange({ socialHandle: e.target.value })}
            placeholder="e.g. @SirHandel"
            className="w-full bg-white border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 rounded-xl p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none shadow-sm"
          />
        </div>
      </div>

      {/* 5. BACKGROUND COLOR & PRESETS */}
      <div className="space-y-3 pt-2 border-t border-slate-200/80">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-orange-600" />
            <span>Canvas Styling</span>
          </label>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-semibold">Custom:</span>
            <input
              type="color"
              value={data.bgColor}
              onChange={(e) => onChange({ bgColor: e.target.value })}
              className="w-6 h-6 rounded-full border-2 border-white shadow-sm cursor-pointer bg-transparent"
              title="Custom color picker"
            />
          </div>
        </div>

        {/* Preset Colors Swatches */}
        <div className="flex items-center gap-2 flex-wrap">
          {COLOR_PRESETS.map((p) => {
            const isSelected = data.bgColor.toLowerCase() === p.hex.toLowerCase();
            return (
              <button
                key={p.name}
                onClick={() =>
                  onChange({
                    bgColor: p.hex,
                    textColor: p.textColor,
                    accentColor: p.accentColor
                  })
                }
                className={`w-8 h-8 rounded-full border border-slate-200/80 cursor-pointer transition-transform hover:scale-110 relative flex items-center justify-center shadow-sm ${
                  isSelected ? 'ring-2 ring-orange-500 ring-offset-2 scale-105' : ''
                }`}
                style={{ backgroundColor: p.hex }}
                title={p.name}
              >
                {isSelected && (
                  <Check
                    className="w-3.5 h-3.5"
                    style={{ color: p.textColor }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. TYPOGRAPHY & DESIGN CONTROLS */}
      <div className="space-y-4 pt-2 border-t border-slate-200/80">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-orange-600" />
          <span>Style & Typography</span>
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Text Alignment */}
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Alignment</span>
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200/60">
              {(['left', 'center', 'right'] as TextAlign[]).map((align) => (
                <button
                  key={align}
                  onClick={() => onChange({ textAlign: align })}
                  className={`flex-1 p-1.5 rounded flex justify-center transition-colors ${
                    data.textAlign === align ? 'bg-white shadow-sm text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  {align === 'left' && <AlignLeft className="w-3.5 h-3.5" />}
                  {align === 'center' && <AlignCenter className="w-3.5 h-3.5" />}
                  {align === 'right' && <AlignRight className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Font Family */}
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Font Style</span>
            <select
              value={data.fontFamily}
              onChange={(e) => onChange({ fontFamily: e.target.value as FontFamily })}
              className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-slate-800 font-medium"
            >
              <option value="serif">Serif (Classic)</option>
              <option value="sans">Sans (Modern)</option>
              <option value="display">Display (Bold)</option>
              <option value="handwriting">Elegant Italic</option>
            </select>
          </div>

          {/* Font Size */}
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Font Size</span>
            <select
              value={data.fontSize}
              onChange={(e) => onChange({ fontSize: e.target.value as FontSize })}
              className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-slate-800 font-medium"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="xlarge">Extra Large</option>
            </select>
          </div>

          {/* Card Border Radius */}
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Corners</span>
            <select
              value={data.borderRadius}
              onChange={(e) => onChange({ borderRadius: e.target.value as BorderRadius })}
              className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-slate-800 font-medium"
            >
              <option value="none">Square Edge</option>
              <option value="small">Subtle Round</option>
              <option value="medium">Medium Round</option>
              <option value="large">Extra Rounded</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
          {/* Image Shape */}
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Image Shape</span>
            <select
              value={data.imageShape}
              onChange={(e) => onChange({ imageShape: e.target.value as ImageShape })}
              className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-slate-800 font-medium"
            >
              <option value="circle">Circular (○)</option>
              <option value="rounded">Rounded Box (□)</option>
              <option value="square">Square</option>
              <option value="oval">Oval Cut (⬭)</option>
            </select>
          </div>

          {/* Layout Archetype */}
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Card Style</span>
            <select
              value={data.cardStyle}
              onChange={(e) => onChange({ cardStyle: e.target.value as CardStyle })}
              className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-slate-800 font-medium"
            >
              <option value="reference-inspired">Reference Split</option>
              <option value="classic-card">Classic Card</option>
              <option value="dark-luxury">Dark Luxury</option>
              <option value="vibrant-accent">Vibrant Accent</option>
            </select>
          </div>

          {/* Quote Mark Toggle */}
          <div className="space-y-1 flex flex-col justify-end">
            <button
              onClick={() => onChange({ showQuotes: !data.showQuotes })}
              className={`w-full py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
                data.showQuotes
                  ? 'bg-orange-50 border-orange-200 text-orange-700'
                  : 'bg-white border-slate-200 text-slate-500'
              }`}
            >
              {data.showQuotes ? '“ Quotes: ON' : '“ Quotes: OFF'}
            </button>
          </div>
        </div>
      </div>

      {/* 7. PREVIEW & EXPORT ACTION BUTTONS */}
      <div className="pt-4 border-t border-slate-200/80 space-y-3">
        <button
          onClick={onOpenFinalCanvas}
          className="w-full py-4 bg-orange-600 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-orange-200 hover:bg-orange-700 active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-wide"
        >
          <Eye className="w-4 h-4" />
          <span>👁 PREVIEW DESIGN</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onShare}
            className="py-3 px-4 bg-white/80 backdrop-blur-md rounded-full shadow-md border border-slate-200 text-slate-700 font-bold text-xs hover:bg-white transition-all flex items-center justify-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5 text-orange-600" />
            <span>📤 Share</span>
          </button>

          <button
            onClick={onDownload}
            className="py-3 px-4 bg-slate-900 rounded-full text-white shadow-md font-bold text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-orange-400" />
            <span>⬇ Download</span>
          </button>
        </div>
      </div>
    </div>
  );
};
