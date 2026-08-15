import React from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';
import { QuoteData } from '../types';

interface HeaderProps {
  onSelectTemplate?: (templateData: Partial<QuoteData>) => void;
  onReset: () => void;
  onPreview?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onReset
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 text-slate-900 py-3 px-4 sm:px-8 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-orange-500/20 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-xl font-bold tracking-tight text-slate-900 leading-tight">
              OseiKwakuCanvas
            </h1>
            <p className="text-[10px] sm:text-xs font-medium text-slate-500">
              AI Motivational Graphic Studio
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Reset Button */}
          <button
            onClick={onReset}
            className="min-h-[40px] px-3.5 sm:px-4 py-2 text-xs font-bold rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-95"
            title="Reset to default design"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden xs:inline">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};

