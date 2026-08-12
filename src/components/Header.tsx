import React from 'react';
import { Sparkles, LayoutTemplate, RotateCcw, Share2, Download, Image as ImageIcon } from 'lucide-react';
import { STARTER_TEMPLATES } from '../data/presets';
import { QuoteData } from '../types';

interface HeaderProps {
  onSelectTemplate: (templateData: Partial<QuoteData>) => void;
  onReset: () => void;
  onPreview: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectTemplate,
  onReset,
  onPreview
}) => {
  const [showTemplates, setShowTemplates] = React.useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-md border-b border-slate-200/80 text-slate-900 py-3 px-3 sm:px-8 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-orange-500/20 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 leading-tight">
                InspireCanvas
              </h1>
              <p className="text-[11px] sm:text-xs font-medium text-slate-500">
                AI Motivational Graphic Studio
              </p>
            </div>
          </div>

          {/* Quick Mobile Preview button */}
          <button
            onClick={onPreview}
            className="sm:hidden px-3.5 py-2 text-xs font-bold rounded-full bg-slate-900 text-white flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
          >
            <ImageIcon className="w-3.5 h-3.5 text-orange-400" />
            <span>Preview</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap sm:flex-nowrap">
          {/* Template presets dropdown / modal */}
          <div className="relative flex-1 sm:flex-none min-w-[100px]">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="w-full sm:w-auto min-h-[40px] px-4 py-2 text-xs font-bold rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm transition-all flex items-center justify-center gap-1.5"
              title="Choose template preset"
            >
              <LayoutTemplate className="w-3.5 h-3.5 text-orange-600" />
              <span>Presets</span>
            </button>

            {showTemplates && (
              <div className="absolute right-0 sm:right-0 mt-2 w-72 max-w-[calc(100vw-2rem)] bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="text-xs font-bold text-slate-400 px-3 py-1.5 uppercase tracking-wider">
                  Select Quick Layout
                </div>
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {STARTER_TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      onClick={() => {
                        onSelectTemplate(tmpl.data);
                        setShowTemplates(false);
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-orange-50 transition-colors group"
                    >
                      <div className="text-xs font-bold text-slate-900 group-hover:text-orange-600">
                        {tmpl.name}
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">
                        {tmpl.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onReset}
            className="flex-1 sm:flex-none min-h-[40px] px-4 py-2 text-xs font-bold rounded-full bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 transition-all flex items-center justify-center gap-1.5"
            title="Reset to default design"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset</span>
          </button>

          <button
            onClick={onPreview}
            className="hidden sm:flex min-h-[40px] px-5 py-2 text-xs font-bold rounded-full bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-md items-center justify-center gap-1.5"
          >
            <ImageIcon className="w-4 h-4 text-orange-400" />
            <span>Preview Design</span>
          </button>
        </div>
      </div>
    </header>
  );
};
