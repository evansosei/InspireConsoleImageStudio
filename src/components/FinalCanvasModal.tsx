import React, { useEffect, useRef, useState } from 'react';
import { X, Share2, Download, Copy, Check, Sparkles, RefreshCw, Maximize2, Minimize2, ZoomIn, ZoomOut, Eye, Image as ImageIcon } from 'lucide-react';
import { QuoteData } from '../types';
import { renderQuoteCanvas, getCanvasDimensions } from '../utils/canvasRenderer';
import { getQuotedText } from '../utils/textUtils';

interface FinalCanvasModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: QuoteData;
}

export const FinalCanvasModal: React.FC<FinalCanvasModalProps> = ({
  isOpen,
  onClose,
  data
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRendering, setIsRendering] = useState(true);
  const [copied, setCopied] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [viewMode, setViewMode] = useState<'canvas' | 'sourceImage'>('canvas');

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      setIsRendering(true);
      renderQuoteCanvas(canvasRef.current, data, 1)
        .then(() => setIsRendering(false))
        .catch((err) => {
          console.error('Canvas render error:', err);
          setIsRendering(false);
        });
    }
  }, [isOpen, data, viewMode]);

  if (!isOpen) return null;

  const { width, height } = getCanvasDimensions(data.aspectRatio);

  const getCanvasBlob = (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!canvasRef.current) return resolve(null);
      try {
        canvasRef.current.toBlob((blob) => resolve(blob), 'image/png', 1.0);
      } catch (err) {
        console.error('Blob generation error:', err);
        resolve(null);
      }
    });
  };

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    try {
      const dateStr = new Date().toISOString().split('T')[0];
      const filename = `oseikwakucanvas-${dateStr}.png`;

      const dataUrl = canvasRef.current.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download error:', err);
      setShareError('Canvas download failed. Try taking a screenshot or choosing a local photo.');
    }
  };

  const handleShare = async () => {
    setShareError(null);
    try {
      const blob = await getCanvasBlob();
      if (!blob) return;

      const dateStr = new Date().toISOString().split('T')[0];
      const filename = `motivational-quote-${dateStr}.png`;
      const file = new File([blob], filename, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Daily Inspiration Quote',
          text: `${getQuotedText(data.text)} — ${data.author || 'My Daily Inspiration'}`
        });
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
      } else if (navigator.share) {
        await navigator.share({
          title: 'Daily Inspiration Quote',
          text: `${getQuotedText(data.text)} — ${data.author || 'My Daily Inspiration'}`
        });
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
      } else {
        await handleCopyImage();
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.warn('Share error fallback:', err);
        setShareError('Sharing not directly supported on browser. Image downloaded instead!');
        handleDownload();
      }
    }
  };

  const handleCopyImage = async () => {
    try {
      const blob = await getCanvasBlob();
      if (!blob) return;
      if (navigator.clipboard && navigator.clipboard.write) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } else {
        handleDownload();
      }
    } catch (e) {
      handleDownload();
    }
  };

  return (
    <div className={`fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-hidden transition-all`}>
      <div className={`bg-white/95 backdrop-blur-xl border border-slate-200 rounded-3xl w-full flex flex-col overflow-hidden shadow-2xl transition-all ${
        isFullScreen ? 'max-w-full h-full rounded-none' : 'max-w-5xl max-h-[95vh] rounded-3xl'
      } text-slate-900`}>
        {/* Modal Header */}
        <div className="p-3.5 sm:p-5 border-b border-slate-200/80 flex items-center justify-between bg-white/90 gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                Full View Preview & Export
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">
                {width} × {height}px High-Resolution Graphic • Ready for Social Media
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* View Mode Toggle (if image exists) */}
            {data.imageUri && (
              <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setViewMode('canvas')}
                  className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                    viewMode === 'canvas' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 text-orange-600" />
                  <span className="hidden sm:inline">Canvas</span>
                </button>
                <button
                  onClick={() => setViewMode('sourceImage')}
                  className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                    viewMode === 'sourceImage' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5 text-sky-600" />
                  <span className="hidden sm:inline">Source Photo</span>
                </button>
              </div>
            )}

            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setZoomScale(Math.max(0.6, zoomScale - 0.2))}
                className="p-1.5 hover:bg-white rounded-lg transition-colors text-slate-600"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomScale(1)}
                className="px-2 py-1 hover:bg-white rounded-lg transition-colors text-[11px] text-slate-700"
                title="Reset Zoom"
              >
                {Math.round(zoomScale * 100)}%
              </button>
              <button
                onClick={() => setZoomScale(Math.min(2, zoomScale + 0.2))}
                className="p-1.5 hover:bg-white rounded-lg transition-colors text-slate-600"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title={isFullScreen ? 'Exit Fullscreen' : 'Full Screen View'}
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Full Canvas & Image Render Container */}
        <div className="flex-1 p-2 sm:p-6 overflow-auto flex flex-col items-center justify-center bg-slate-900/90 relative min-h-[360px]">
          {isRendering && (
            <div className="flex flex-col items-center gap-3 text-orange-400 py-12">
              <RefreshCw className="w-8 h-8 animate-spin" />
              <p className="text-xs font-bold tracking-wide text-slate-200">
                Rendering High-Resolution Canvas ({width}×{height})...
              </p>
            </div>
          )}

          {/* VIEW MODE: FINAL HIGH-RES CANVAS FULL VIEW */}
          {viewMode === 'canvas' && (
            <div
              className={`transition-transform duration-200 flex items-center justify-center ${
                isRendering ? 'hidden' : 'block'
              }`}
              style={{
                transform: `scale(${zoomScale})`,
                transformOrigin: 'center center'
              }}
            >
              <canvas
                ref={canvasRef}
                className={`max-w-full ${
                  isFullScreen ? 'max-h-[78vh]' : 'max-h-[64vh]'
                } object-contain rounded-2xl shadow-2xl border border-slate-700/50 bg-slate-950`}
                style={{ width: 'auto', height: 'auto' }}
              />
            </div>
          )}

          {/* VIEW MODE: FULL SOURCE PHOTO VIEW */}
          {viewMode === 'sourceImage' && data.imageUri && (
            <div
              className="transition-transform duration-200 flex flex-col items-center justify-center p-2"
              style={{
                transform: `scale(${zoomScale})`,
                transformOrigin: 'center center'
              }}
            >
              <img
                src={data.imageUri}
                alt="Source Full View"
                className={`max-w-full ${
                  isFullScreen ? 'max-h-[76vh]' : 'max-h-[62vh]'
                } object-contain rounded-2xl shadow-2xl border border-slate-700/50`}
              />
              <p className="text-xs font-semibold text-slate-400 mt-2">
                Full Uncropped Source Image
              </p>
            </div>
          )}

          {shareError && (
            <p className="text-xs text-orange-700 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-lg mt-3 font-medium">
              {shareError}
            </p>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="p-3.5 sm:p-5 border-t border-slate-200/80 bg-white/95 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              ✏ Back to Editor
            </button>
            <span className="hidden sm:inline text-xs text-slate-400 font-medium">
              Format: {data.aspectRatio}
            </span>
          </div>

          <div className="w-full sm:w-auto flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
            <button
              onClick={handleCopyImage}
              className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-bold rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span>{copied ? 'Copied Image!' : 'Copy Image'}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex-1 sm:flex-none px-5 py-2.5 text-xs font-bold rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm flex items-center justify-center gap-2"
            >
              {shareSuccess ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-orange-600" />}
              <span>{shareSuccess ? 'Shared!' : '📤 Share'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex-1 sm:flex-none px-6 py-2.5 text-xs font-bold rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Download className="w-4 h-4 text-orange-400" />
              <span>⬇ Download PNG</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
