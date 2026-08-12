import React from 'react';
import { X, Check } from 'lucide-react';
import { STOCK_IMAGES } from '../data/presets';
import { StockImage } from '../types';

interface StockImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (url: string) => void;
  selectedUrl?: string | null;
}

export const StockImageModal: React.FC<StockImageModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  selectedUrl
}) => {
  const [activeCategory, setActiveCategory] = React.useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'People', 'Nature', 'Urban', 'Abstract'];

  const filteredImages = activeCategory === 'All'
    ? STOCK_IMAGES
    : STOCK_IMAGES.filter((img) => img.category === activeCategory);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 text-slate-900">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200/80 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Select Stock Inspiration Photo
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Pick a high-quality portrait or landscape image for your quote poster
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="px-5 py-3 border-b border-slate-200/60 flex items-center gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <div className="p-5 overflow-y-auto grid grid-cols-2 sm:grid-cols-4 gap-3">
          {filteredImages.map((img: StockImage) => {
            const isSelected = selectedUrl === img.url;
            return (
              <button
                key={img.id}
                onClick={() => {
                  onSelectImage(img.url);
                  onClose();
                }}
                className={`group relative rounded-2xl overflow-hidden border-2 text-left transition-all aspect-square ${
                  isSelected
                    ? 'border-orange-500 ring-2 ring-orange-500/30'
                    : 'border-slate-200 hover:border-orange-400'
                }`}
              >
                <img
                  src={img.url}
                  alt={img.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent opacity-90 p-2 flex flex-col justify-end">
                  <span className="text-[11px] font-bold text-white line-clamp-1">
                    {img.name}
                  </span>
                </div>
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-md">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200/80 bg-white/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
