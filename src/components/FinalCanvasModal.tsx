import React, { useEffect, useRef, useState } from 'react';
import { X, Share2, Download, Copy, Check, Sparkles, RefreshCw } from 'lucide-react';
import { QuoteData } from '../types';
import { renderQuoteCanvas, getCanvasDimensions } from '../utils/canvasRenderer';

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
  }, [isOpen, data]);

  if (!isOpen) return null;

  const { width, height } = getCanvasDimensions(data.aspectRatio);

  const getCanvasBlob = (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!canvasRef.current) return resolve(null);
      canvasRef.current.toBlob((blob) => resolve(blob), 'image/png', 1.0);
    });
  };

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `motivational-quote-${dateStr}.png`;

    const dataUrl = canvasRef.current.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          text: `"${data.text}" — ${data.author || 'My Daily Inspiration'}`
        });
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
      } else if (navigator.share) {
        await navigator.share({
          title: 'Daily Inspiration Quote',
          text: `"${data.text}" — ${data.author || 'My Daily Inspiration'}`
        });
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
      } else {
        // Fallback: copy to clipboard or download
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
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 text-slate-900">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200/80 flex items-center justify-between bg-white/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Final Rendered Graphic Canvas
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {width} × {height}px PNG • Ready for Instagram, WhatsApp, TikTok, LinkedIn & Stories
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Close Preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Canvas Render Container */}
        <div className="flex-1 p-4 sm:p-8 overflow-y-auto flex flex-col items-center justify-center bg-slate-100/70 min-h-[380px]">
          {isRendering && (
            <div className="flex flex-col items-center gap-3 text-orange-600 py-12">
              <RefreshCw className="w-8 h-8 animate-spin" />
              <p className="text-xs font-bold tracking-wide text-slate-700">
                Rendering High-Resolution Canvas (1080×1080)...
              </p>
            </div>
          )}

          {/* THE SEPARATE FINAL CANVAS CONTAINER (Only graphic, no controls inside) */}
          <div
            className={`relative max-w-full max-h-[60vh] flex items-center justify-center rounded-2xl overflow-hidden shadow-2xl border border-white bg-white ${
              isRendering ? 'hidden' : 'block'
            }`}
          >
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-[58vh] object-contain rounded-xl shadow-2xl"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>

          {shareError && (
            <p className="text-xs text-orange-700 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-lg mt-3 font-medium">
              {shareError}
            </p>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-200/80 bg-white/90 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            ✏ Back to Editor
          </button>

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
              className="flex-1 sm:flex-none px-5 py-2.5 text-xs font-bold rounded-full bg-white/80 hover:bg-white text-slate-700 border border-slate-200 shadow-md flex items-center justify-center gap-2"
            >
              {shareSuccess ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-orange-600" />}
              <span>{shareSuccess ? 'Shared!' : '📤 Share'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex-1 sm:flex-none px-6 py-2.5 text-xs font-bold rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-md flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 text-orange-400" />
              <span>⬇ Download</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
