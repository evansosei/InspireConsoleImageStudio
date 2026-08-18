import React, { useState } from 'react';
import { Header } from './components/Header';
import { ControlsPanel } from './components/ControlsPanel';
import { LivePreviewCard } from './components/LivePreviewCard';
import { FinalCanvasModal } from './components/FinalCanvasModal';
import { StockImageModal } from './components/StockImageModal';
import { QuoteData } from './types';
import { getFormattedCurrentDate } from './utils/dateFormatter';
import { STARTER_TEMPLATES } from './data/presets';
import defaultPortrait from './assets/images/evans_default_portrait_1786544027588.jpg';
import { Sparkles, Eye, LayoutTemplate, HelpCircle } from 'lucide-react';

export default function App() {
  // Initialize default state with reference template data & current date
  const defaultQuoteData: QuoteData = {
    text: "When you are an original and walk in God's plan, you shine like a star in the firmament.",
    author: "Poster Studio",
    socialHandle: "@PosterStudio",
    dateText: getFormattedCurrentDate(),
    imageUri: defaultPortrait,
    imagePosition: 'top',
    imageFit: 'cover',
    bgColor: '#FEF08A',
    textColor: '#0F172A',
    textBgColor: 'transparent',
    accentColor: '#EA580C',
    textAlign: 'center',
    fontSize: 'large',
    fontFamily: 'serif',
    borderRadius: 'large',
    imageShape: 'circle',
    cardStyle: 'reference-inspired',
    showQuotes: true,
    showBadge: true,
    badgeText: 'DAILY INSPIRATION',
    showSocialIcons: true,
    selectedSocials: ['instagram', 'x'],
    aspectRatio: '1:1'
  };

  const [quoteData, setQuoteData] = useState<QuoteData>(defaultQuoteData);
  const [isFinalCanvasOpen, setIsFinalCanvasOpen] = useState<boolean>(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Update quote data handler
  const handleUpdate = (updated: Partial<QuoteData>) => {
    setValidationError(null);
    setQuoteData((prev) => ({ ...prev, ...updated }));
  };

  // Reset handler
  const handleReset = () => {
    setQuoteData({
      ...defaultQuoteData,
      dateText: getFormattedCurrentDate()
    });
    setValidationError(null);
  };

  // Select template preset handler
  const handleSelectTemplate = (templateData: Partial<QuoteData>) => {
    setQuoteData((prev) => ({
      ...prev,
      ...templateData,
      dateText: getFormattedCurrentDate()
    }));
    setValidationError(null);
  };

  // Open final canvas preview with validation check
  const handleOpenFinalCanvas = () => {
    if (!quoteData.text || !quoteData.text.trim()) {
      setValidationError('Please enter a motivational message or generate one with AI before previewing.');
      return;
    }
    setValidationError(null);
    setIsFinalCanvasOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#fdfaf5] text-slate-900 flex flex-col font-sans relative overflow-x-hidden selection:bg-orange-500 selection:text-white">
      {/* Frosted Glass Background Ambient Blur Circles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-60">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-orange-200/60 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 right-1/4 w-[28rem] h-[28rem] bg-amber-200/50 rounded-full blur-[130px]" />
        <div className="absolute top-1/2 left-10 w-80 h-80 bg-rose-200/40 rounded-full blur-[100px]" />
      </div>

      {/* App Header */}
      <Header
        onSelectTemplate={handleSelectTemplate}
        onReset={handleReset}
        onPreview={handleOpenFinalCanvas}
      />

      {/* Main Workspace Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8 relative z-10 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-start">
          {/* Left Column: Design Controls Panel */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                  <span>Osei Kwaku Design Studio Controls</span>
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Customize image, text, position, colors, and author metadata in real-time
                </p>
              </div>
            </div>

            <ControlsPanel
              data={quoteData}
              onChange={handleUpdate}
              onOpenStockModal={() => setIsStockModalOpen(true)}
              onOpenFinalCanvas={handleOpenFinalCanvas}
              onShare={handleOpenFinalCanvas}
              onDownload={handleOpenFinalCanvas}
              validationError={validationError}
            />
          </div>

          {/* Right Column: Live Interactive Preview */}
          <div className="lg:col-span-6 lg:sticky lg:top-24 space-y-4">
            <div className="bg-white/40 backdrop-blur-md border border-slate-200/80 rounded-2xl sm:rounded-3xl p-3 sm:p-6 shadow-xl shadow-slate-200/50">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 mb-3 sm:mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Live Real-Time Preview
                  </span>
                </div>

                <button
                  onClick={handleOpenFinalCanvas}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Expand Canvas</span>
                </button>
              </div>

              {/* Real-time Rendered Card */}
              {quoteData.text || quoteData.imageUri ? (
                <LivePreviewCard
                  data={quoteData}
                  onOpenFinalCanvas={handleOpenFinalCanvas}
                />
              ) : (
                /* Empty State Card */
                <div className="py-12 px-6 text-center bg-white/60 border border-slate-200/80 rounded-2xl space-y-4 flex flex-col items-center shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
                    <LayoutTemplate className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800">
                      Create Your Inspirational Post
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm mt-1">
                      Upload an image and add your message to create a beautiful motivational graphic for social media.
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleSelectTemplate(STARTER_TEMPLATES[0].data)
                    }
                    className="px-5 py-2.5 text-xs font-bold rounded-xl bg-orange-600 text-white hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200"
                  >
                    Start Creating with Sample
                  </button>
                </div>
              )}
            </div>

            {/* Quick Tips Box */}
            <div className="bg-white/50 backdrop-blur-md border border-slate-200/80 rounded-2xl p-3.5 sm:p-4 flex items-start gap-3 shadow-sm">
              <HelpCircle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600 leading-relaxed">
                <span className="font-semibold text-slate-900">Pro Tip:</span> Click{' '}
                <span className="text-orange-600 font-bold">✨ Generate AI Quote</span> to quickly draft inspiring messages. Click <span className="text-orange-600 font-bold">👁 Preview Design</span> to export high-res PNGs for social media.
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Separate Final Canvas Modal */}
      <FinalCanvasModal
        isOpen={isFinalCanvasOpen}
        onClose={() => setIsFinalCanvasOpen(false)}
        data={quoteData}
      />

      {/* Stock Image Library Modal */}
      <StockImageModal
        isOpen={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        onSelectImage={(url) => handleUpdate({ imageUri: url })}
        selectedUrl={quoteData.imageUri}
      />

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200/60 text-center text-xs text-slate-500 font-medium relative z-10 backdrop-blur-sm bg-white/30">
        <p className="tracking-wide">
          Made by <span className="font-bold text-slate-800">Evans Osei Kwaku</span>
        </p>
      </footer>
    </div>
  );
}
