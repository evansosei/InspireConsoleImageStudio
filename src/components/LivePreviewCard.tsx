import React from 'react';
import { QuoteData } from '../types';
import { Instagram, Twitter, Facebook, Sparkles } from 'lucide-react';
import { getQuotedText } from '../utils/textUtils';

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

  // Font size class mapping with responsive scaling for mobile view
  const hasSplitLayout = (data.imagePosition === 'left' || data.imagePosition === 'right') && !!data.imageUri;
  const hasStackedLayout = (data.imagePosition === 'top' || data.imagePosition === 'bottom') && !!data.imageUri;

  const fontSizeClass = hasSplitLayout
    ? data.fontSize === 'small'
      ? 'text-[11px] sm:text-sm md:text-lg leading-snug sm:leading-relaxed'
      : data.fontSize === 'medium'
      ? 'text-xs sm:text-base md:text-xl leading-snug sm:leading-relaxed'
      : data.fontSize === 'large'
      ? 'text-xs sm:text-lg md:text-2xl leading-snug font-semibold'
      : 'text-sm sm:text-xl md:text-3xl leading-snug font-bold'
    : hasStackedLayout
    ? data.fontSize === 'small'
      ? 'text-xs sm:text-base md:text-lg leading-snug sm:leading-relaxed'
      : data.fontSize === 'medium'
      ? 'text-xs sm:text-lg md:text-2xl leading-snug sm:leading-relaxed'
      : data.fontSize === 'large'
      ? 'text-sm sm:text-xl md:text-3xl leading-snug font-semibold'
      : 'text-base sm:text-2xl md:text-4xl leading-snug font-bold'
    : data.fontSize === 'small'
    ? 'text-xs sm:text-base md:text-xl leading-snug sm:leading-relaxed'
    : data.fontSize === 'medium'
    ? 'text-sm sm:text-lg md:text-2xl leading-snug sm:leading-relaxed'
    : data.fontSize === 'large'
    ? 'text-base sm:text-xl md:text-3xl leading-snug font-semibold'
    : 'text-lg sm:text-2xl md:text-4xl leading-snug font-bold';

  // Text alignment class
  const textAlignClass =
    data.textAlign === 'center'
      ? 'text-center'
      : data.textAlign === 'right'
      ? 'text-right'
      : 'text-left';

  // Image fit class
  const objectFitClass = data.imageFit === 'contain' ? 'object-contain bg-slate-900/10' : 'object-cover';

  // Dynamic aspect ratio wrapper styles (enlarged for clearer, bolder presentation)
  const aspectClass =
    data.aspectRatio === '4:5'
      ? 'aspect-[4/5] max-w-[520px]'
      : data.aspectRatio === '9:16'
      ? 'aspect-[9/16] max-w-[420px]'
      : 'aspect-square max-w-[620px]';

  const isFullImage = data.imagePosition === 'full' && !!data.imageUri;

  return (
    <div className="w-full flex flex-col items-center justify-center py-2 sm:py-4">
      {/* Container Wrapper with aspect ratio */}
      <div
        className={`relative w-full ${aspectClass} rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl transition-all duration-300 p-2 sm:p-6 flex flex-col justify-center items-center ${
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
          className={`w-full h-full flex flex-col justify-between p-3 sm:p-4 md:p-5 transition-all duration-300 shadow-xl relative overflow-hidden ${
            isCardStyle ? radiusClass : 'rounded-xl sm:rounded-2xl'
          }`}
          style={{
            backgroundColor: data.bgColor,
            color: isFullImage ? '#FFFFFF' : data.textColor,
            borderWidth: data.cardStyle === 'vibrant-accent' ? '3px' : '0px',
            borderColor: data.cardStyle === 'vibrant-accent' ? data.accentColor : 'transparent'
          }}
        >
          {/* Full Background Image Layer if selected */}
          {isFullImage && (
            <div className="absolute inset-0 z-0">
              <img
                src={data.imageUri!}
                alt="Full Background"
                className={`w-full h-full ${objectFitClass}`}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/65 to-black/85" />
            </div>
          )}

          {/* Top Badge (Optional) */}
          <div className="flex items-center justify-between w-full mb-1 relative z-10 shrink-0">
            {data.showBadge && data.badgeText ? (
              <div
                className="px-2 sm:px-3.5 py-0.5 sm:py-1 text-[10px] sm:text-sm font-extrabold uppercase tracking-wider sm:tracking-widest rounded-full text-white shadow-sm flex items-center gap-1 sm:gap-1.5"
                style={{ backgroundColor: data.accentColor }}
              >
                <Sparkles className="w-2.5 h-2.5 sm:w-4 sm:h-4" />
                <span className="truncate max-w-[110px] sm:max-w-none">{data.badgeText}</span>
              </div>
            ) : (
              <div />
            )}

            {/* Subtle Brand Tag */}
            <span className="text-[10px] sm:text-sm font-extrabold uppercase tracking-wider opacity-75 truncate max-w-[130px] sm:max-w-none text-right">
              {data.author && data.author.trim()
                ? data.author.trim().toLowerCase().endsWith('studio')
                  ? data.author.trim()
                  : `${data.author.trim()} STUDIO`
                : 'STUDIO'}
            </span>
          </div>

          {/* Main Content Area Layout based on imagePosition - fully occupying the spaces between header and footer */}
          <div
            className="flex-1 flex flex-col items-center justify-between text-center w-full my-auto overflow-hidden relative z-10 gap-2 sm:gap-3 py-0.5"
          >
            {/* TOP IMAGE LAYOUT */}
            {data.imagePosition === 'top' && data.imageUri && (
              <div className="flex justify-center items-center w-full shrink-0">
                <div
                  className={`relative p-0.5 border-2 sm:border-3 shadow-xl shadow-black/20 ring-2 ring-white/30 backdrop-blur-sm overflow-hidden w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 shrink-0 ${imageShapeClass}`}
                  style={{ borderColor: data.accentColor }}
                >
                  <img
                    src={data.imageUri}
                    alt="Author/Inspiration"
                    className={`w-full h-full ${objectFitClass}`}
                  />
                </div>
              </div>
            )}

            {/* LEFT / RIGHT SPLIT LAYOUT */}
            {(data.imagePosition === 'left' || data.imagePosition === 'right') && data.imageUri ? (
              <div
                className={`flex-1 h-full flex items-center justify-center gap-2.5 sm:gap-4 w-full my-auto ${
                  data.imagePosition === 'right' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div
                  className={`relative p-0.5 border-2 sm:border-3 shadow-xl shadow-black/20 ring-2 ring-white/30 backdrop-blur-sm shrink-0 overflow-hidden w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 ${imageShapeClass}`}
                  style={{ borderColor: data.accentColor }}
                >
                  <img
                    src={data.imageUri}
                    alt="Inspiration"
                    className={`w-full h-full ${objectFitClass}`}
                  />
                </div>

                <div
                  className={`flex-1 h-full min-w-0 flex flex-col justify-center ${textAlignClass} p-2 sm:p-4 rounded-[10px] border-[1.5px] sm:border-2 shadow-lg shadow-black/15 backdrop-blur-md relative overflow-hidden ring-1 ring-white/20`}
                  style={{
                    borderColor: data.accentColor || '#EA580C',
                    backgroundColor:
                      data.textBgColor && data.textBgColor !== 'transparent'
                        ? data.textBgColor
                        : 'rgba(255, 255, 255, 0.08)'
                  }}
                >
                  {/* Glass specular sheen highlight */}
                  <div className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

                  <p
                    className={`${fontFamilyClass} ${fontSizeClass} whitespace-pre-line break-words relative z-10`}
                    style={{ color: data.textColor }}
                  >
                    {getQuotedText(data.text)}
                  </p>
                  {data.author && (
                    <p
                      className="mt-0.5 sm:mt-2 text-[10px] sm:text-base md:text-lg font-bold tracking-wide truncate relative z-10"
                      style={{ color: data.accentColor }}
                    >
                      — {data.author}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              /* TOP / BOTTOM / FULL / NO-IMAGE LAYOUT FOR TEXT */
              <div
                className={`w-full h-full flex-1 flex flex-col items-center justify-center ${textAlignClass} p-2 sm:p-5 rounded-[10px] border-[1.5px] sm:border-2 shadow-lg shadow-black/15 backdrop-blur-md relative overflow-hidden ring-1 ring-white/20`}
                style={{
                  borderColor: data.accentColor || '#EA580C',
                  backgroundColor:
                    data.textBgColor && data.textBgColor !== 'transparent'
                      ? data.textBgColor
                      : 'rgba(255, 255, 255, 0.08)'
                }}
              >
                {/* Glass specular sheen highlight */}
                <div className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

                <p
                  className={`${fontFamilyClass} ${fontSizeClass} whitespace-pre-line break-words relative z-10`}
                  style={{ color: data.textColor }}
                >
                  {getQuotedText(data.text)}
                </p>

                {data.author && (
                  <p
                    className={`${
                      data.imagePosition === 'top' || data.imagePosition === 'bottom'
                        ? 'mt-0.5 sm:mt-1.5 text-[10px] sm:text-base'
                        : 'mt-1 sm:mt-2.5 text-xs sm:text-lg md:text-xl'
                    } font-bold tracking-wide relative z-10`}
                    style={{ color: data.accentColor }}
                  >
                    — {data.author}
                  </p>
                )}
              </div>
            )}

            {/* BOTTOM IMAGE LAYOUT */}
            {data.imagePosition === 'bottom' && data.imageUri && (
              <div className="flex justify-center items-center w-full shrink-0">
                <div
                  className={`relative p-0.5 border-2 sm:border-3 shadow-xl shadow-black/20 ring-2 ring-white/30 backdrop-blur-sm overflow-hidden w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 shrink-0 ${imageShapeClass}`}
                  style={{ borderColor: data.accentColor }}
                >
                  <img
                    src={data.imageUri}
                    alt="Inspiration"
                    className={`w-full h-full ${objectFitClass}`}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer Metadata Line */}
          <div className="pt-2 sm:pt-2.5 border-t border-current/20 flex items-center justify-between mt-0.5 sm:mt-1 text-xs sm:text-sm font-semibold gap-1 relative z-10 shrink-0">
            {/* Social Handle */}
            <div className="flex items-center gap-1.5 min-w-0">
              <span
                className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full inline-block shrink-0"
                style={{ backgroundColor: data.accentColor }}
              />
              <div className="flex items-center gap-1 sm:gap-1.5 opacity-90 min-w-0">
                {data.showSocialIcons && (
                  <div className="flex items-center gap-1 opacity-80 shrink-0">
                    <Instagram className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <Twitter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                )}
                <span className="font-bold tracking-tight truncate text-xs sm:text-sm">
                  {data.socialHandle || '@yourusername'}
                </span>
              </div>
            </div>

            {/* Current Date */}
            <div className="opacity-90 uppercase tracking-wider text-xs sm:text-sm font-bold shrink-0">
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
