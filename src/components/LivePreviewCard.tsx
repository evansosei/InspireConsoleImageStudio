import React from 'react';
import { QuoteData } from '../types';
import { Instagram, Twitter, Facebook, Sparkles } from 'lucide-react';

interface LivePreviewCardProps {
  data: QuoteData;
  onOpenFinalCanvas: () => void;
}

export const LivePreviewCard: React.FC<LivePreviewCardProps> = ({
  data,
  onOpenFinalCanvas
}) => {
  const isCardStyle = data.cardStyle === 'reference-inspired' || data.cardStyle === 'dark-luxury';

  // Determine card roundedness
  const radiusClass =
    data.borderRadius === 'none'
      ? 'rounded-none'
      : data.borderRadius === 'small'
      ? 'rounded-xl'
      : data.borderRadius === 'medium'
      ? 'rounded-2xl'
      : 'rounded-3xl';

  // Image shape styling
  const imageShapeClass =
    data.imageShape === 'circle'
      ? 'rounded-full aspect-square'
      : data.imageShape === 'rounded'
      ? 'rounded-2xl aspect-square'
      : data.imageShape === 'oval'
      ? 'rounded-[50%] aspect-square'
      : 'rounded-none aspect-square';

  // Font family class mapping
  const fontFamilyClass =
    data.fontFamily === 'serif'
      ? 'font-serif'
      : data.fontFamily === 'sans'
      ? 'font-sans'
      : data.fontFamily === 'display'
      ? 'font-mono uppercase tracking-tight'
      : 'font-serif italic';

  // Font size class mapping
  const fontSizeClass =
    data.fontSize === 'small'
      ? 'text-base sm:text-xl leading-relaxed'
      : data.fontSize === 'medium'
      ? 'text-lg sm:text-2xl leading-relaxed'
      : data.fontSize === 'large'
      ? 'text-xl sm:text-3xl leading-snug font-semibold'
      : 'text-2xl sm:text-4xl leading-snug font-bold';

  // Text alignment class
  const textAlignClass =
    data.textAlign === 'center'
      ? 'text-center'
      : data.textAlign === 'right'
      ? 'text-right'
      : 'text-left';

  return (
    <div className="w-full flex flex-col items-center justify-center py-2 sm:py-4">
      {/* Container Wrapper with aspect ratio */}
      <div
        className={`relative w-full max-w-[540px] aspect-square rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl transition-all duration-300 p-2 sm:p-6 flex flex-col justify-center items-center ${
          isCardStyle
            ? 'bg-slate-950 border border-slate-800'
            : 'border border-slate-800'
        }`}
        style={{
          backgroundColor: isCardStyle ? undefined : data.bgColor
        }}
      >
        {/* Main Card Element */}
        <div
          className={`w-full h-full flex flex-col justify-between p-4 sm:p-8 transition-all duration-300 shadow-xl relative overflow-hidden ${
            isCardStyle ? radiusClass : 'rounded-xl sm:rounded-2xl'
          }`}
          style={{
            backgroundColor: data.bgColor,
            color: data.textColor,
            borderWidth: data.cardStyle === 'vibrant-accent' ? '3px' : '0px',
            borderColor: data.cardStyle === 'vibrant-accent' ? data.accentColor : 'transparent'
          }}
        >
          {/* Top Badge (Optional) */}
          <div className="flex items-center justify-between w-full mb-2 sm:mb-3">
            {data.showBadge && data.badgeText ? (
              <div
                className="px-2.5 sm:px-3.5 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest rounded-full text-white shadow-sm flex items-center gap-1"
                style={{ backgroundColor: data.accentColor }}
              >
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                <span className="truncate max-w-[120px] sm:max-w-none">{data.badgeText}</span>
              </div>
            ) : (
              <div />
            )}

            {/* Subtle Brand Tag */}
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider opacity-40">
              Poster Studio
            </span>
          </div>

          {/* Main Content Area Layout based on imagePosition */}
          <div className="flex-1 flex flex-col justify-center my-1 sm:my-2 gap-2 sm:gap-4 overflow-hidden">
            {/* TOP IMAGE LAYOUT */}
            {data.imagePosition === 'top' && data.imageUri && (
              <div className="flex justify-center mb-1 sm:mb-2">
                <div
                  className={`relative p-0.5 sm:p-1 border-2 sm:border-4 shadow-lg overflow-hidden w-20 h-20 sm:w-28 sm:h-28 ${imageShapeClass}`}
                  style={{ borderColor: data.accentColor }}
                >
                  <img
                    src={data.imageUri}
                    alt="Author/Inspiration"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* LEFT / RIGHT SPLIT LAYOUT */}
            {(data.imagePosition === 'left' || data.imagePosition === 'right') && data.imageUri ? (
              <div
                className={`flex items-center gap-3 sm:gap-5 my-auto ${
                  data.imagePosition === 'right' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div
                  className={`relative p-0.5 sm:p-1 border-2 sm:border-4 shadow-lg shrink-0 overflow-hidden w-20 h-20 sm:w-28 sm:h-28 ${imageShapeClass}`}
                  style={{ borderColor: data.accentColor }}
                >
                  <img
                    src={data.imageUri}
                    alt="Inspiration"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className={`flex-1 min-w-0 ${textAlignClass}`}>
                  {data.showQuotes && (
                    <div
                      className="text-2xl sm:text-4xl font-serif leading-none mb-1 opacity-40"
                      style={{ color: data.accentColor }}
                    >
                      “
                    </div>
                  )}
                  <p className={`${fontFamilyClass} ${fontSizeClass} whitespace-pre-line break-words`}>
                    {data.text || 'Write your motivational message here...'}
                  </p>
                  {data.author && (
                    <p
                      className="mt-2 sm:mt-3 text-xs sm:text-sm font-semibold tracking-wide truncate"
                      style={{ color: data.accentColor }}
                    >
                      — {data.author}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              /* TOP / BOTTOM / NO-IMAGE LAYOUT FOR TEXT */
              <div className={`w-full ${textAlignClass} my-auto`}>
                {data.showQuotes && (
                  <div
                    className="text-3xl sm:text-5xl font-serif leading-none mb-1 sm:mb-2 opacity-40"
                    style={{ color: data.accentColor }}
                  >
                    “
                  </div>
                )}
                <p className={`${fontFamilyClass} ${fontSizeClass} whitespace-pre-line break-words`}>
                  {data.text || 'Write your motivational message here...'}
                </p>

                {data.author && (
                  <p
                    className="mt-2 sm:mt-4 text-xs sm:text-base font-semibold tracking-wide"
                    style={{ color: data.accentColor }}
                  >
                    — {data.author}
                  </p>
                )}
              </div>
            )}

            {/* BOTTOM IMAGE LAYOUT */}
            {data.imagePosition === 'bottom' && data.imageUri && (
              <div className="flex justify-center mt-1 sm:mt-3">
                <div
                  className={`relative p-0.5 sm:p-1 border-2 sm:border-4 shadow-lg overflow-hidden w-20 h-20 sm:w-28 sm:h-28 ${imageShapeClass}`}
                  style={{ borderColor: data.accentColor }}
                >
                  <img
                    src={data.imageUri}
                    alt="Inspiration"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer Metadata Line */}
          <div className="pt-2 sm:pt-4 border-t border-current/15 flex items-center justify-between mt-1 sm:mt-2 text-[10px] sm:text-xs font-semibold gap-1">
            {/* Social Handle */}
            <div className="flex items-center gap-1.5 min-w-0">
              <span
                className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full inline-block shrink-0"
                style={{ backgroundColor: data.accentColor }}
              />
              <div className="flex items-center gap-1 sm:gap-1.5 opacity-90 min-w-0">
                {data.showSocialIcons && (
                  <div className="flex items-center gap-1 text-slate-700 shrink-0">
                    <Instagram className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <Twitter className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </div>
                )}
                <span className="font-bold tracking-tight truncate">
                  {data.socialHandle || '@yourusername'}
                </span>
              </div>
            </div>

            {/* Current Date */}
            <div className="opacity-80 uppercase tracking-wider text-[9px] sm:text-[11px] font-bold shrink-0">
              {data.dateText}
            </div>
          </div>
        </div>

        {/* Hover / Overlay click action */}
        <button
          onClick={onOpenFinalCanvas}
          className="absolute inset-0 bg-slate-900/30 backdrop-blur-[3px] opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white font-semibold gap-2 rounded-2xl sm:rounded-3xl p-4"
        >
          <span className="px-4 sm:px-5 py-2 sm:py-2.5 bg-orange-600 text-white rounded-xl shadow-xl font-bold text-xs sm:text-sm">
            👁 View Final Full Canvas
          </span>
        </button>
      </div>

      <p className="text-xs text-slate-500 font-medium mt-2 text-center">
        Live Interactive Preview • Click to expand full 1080×1080 social media canvas
      </p>
    </div>
  );
};
