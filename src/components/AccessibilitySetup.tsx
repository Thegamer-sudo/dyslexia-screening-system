import React from 'react';
import { AccessibilitySettings } from '../types';
import { ArrowRight, Type, Check } from 'lucide-react';

interface AccessibilitySetupProps {
  settings: AccessibilitySettings;
  onChange: (settings: AccessibilitySettings) => void;
  onContinue: () => void;
  onBack: () => void;
  isStandalone?: boolean;
}

export const AccessibilitySetup: React.FC<AccessibilitySetupProps> = ({
  settings,
  onChange,
  onContinue,
  onBack,
  isStandalone = false,
}) => {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12 w-full animate-in fade-in duration-300">
      <div className="glass-panel p-8 sm:p-10 rounded-3xl bg-white/90 border border-white/90 shadow-md">
        <span className="text-xs font-bold tracking-widest text-[#4F7396] uppercase">
          {isStandalone ? 'Profile Settings • Accessibility' : 'Step 2 of 2 • Pre-Screening'}
        </span>

        <h1 className="text-3xl font-semibold text-[#1A2E44] tracking-tight mt-2 mb-2">
          {isStandalone ? 'Reading Comfort Settings' : 'Make reading comfortable'}
        </h1>
        <p className="text-xs text-[#5A6D82] mb-8 dyslexia-ready">
          {isStandalone 
            ? 'Configure visual parameters for maximum legibility. These settings will apply across your entire dashboard.' 
            : 'Configure visual parameters for maximum legibility. These settings will persist throughout the entire screening assessment.'}
        </p>

        <div className="space-y-6 mb-8">
          {/* Text size */}
          <div className="p-4 rounded-2xl bg-[#F0F2F5]/80 border border-[#E8EDF2] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-[#1A2E44]">Text Size</span>
              <p className="text-[11px] text-[#7A8C9F]">Adjust display scale</p>
            </div>
            <div className="flex items-center bg-white p-1 rounded-xl border border-[#D1D9E6]">
              <button
                onClick={() => onChange({ ...settings, fontSize: 'standard' })}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                  settings.fontSize === 'standard' ? 'bg-[#1A2E44] text-white shadow-2xs' : 'text-[#5A6D82] hover:text-[#1A2E44]'
                }`}
              >
                Standard
              </button>
              <button
                onClick={() => onChange({ ...settings, fontSize: 'large' })}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                  settings.fontSize === 'large' ? 'bg-[#1A2E44] text-white shadow-2xs' : 'text-[#5A6D82] hover:text-[#1A2E44]'
                }`}
              >
                Large
              </button>
              <button
                onClick={() => onChange({ ...settings, fontSize: 'xlarge' })}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                  settings.fontSize === 'xlarge' ? 'bg-[#1A2E44] text-white shadow-2xs' : 'text-[#5A6D82] hover:text-[#1A2E44]'
                }`}
              >
                Extra Large
              </button>
            </div>
          </div>

          {/* Letter spacing */}
          <div className="p-4 rounded-2xl bg-[#F0F2F5]/80 border border-[#E8EDF2] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-[#1A2E44]">Letter Spacing</span>
              <p className="text-[11px] text-[#7A8C9F]">Increase space between character glyphs</p>
            </div>
            <div className="flex items-center bg-white p-1 rounded-xl border border-[#D1D9E6]">
              <button
                onClick={() => onChange({ ...settings, letterSpacing: 'standard' })}
                className={`px-4 py-1.5 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                  settings.letterSpacing === 'standard' ? 'bg-[#1A2E44] text-white shadow-2xs' : 'text-[#5A6D82] hover:text-[#1A2E44]'
                }`}
              >
                Normal
              </button>
              <button
                onClick={() => onChange({ ...settings, letterSpacing: 'wide' })}
                className={`px-4 py-1.5 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                  settings.letterSpacing === 'wide' ? 'bg-[#1A2E44] text-white shadow-2xs' : 'text-[#5A6D82] hover:text-[#1A2E44]'
                }`}
              >
                Wide
              </button>
            </div>
          </div>

          {/* Line spacing */}
          <div className="p-4 rounded-2xl bg-[#F0F2F5]/80 border border-[#E8EDF2] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-[#1A2E44]">Line Spacing</span>
              <p className="text-[11px] text-[#7A8C9F]">Adjust vertical spacing between text lines</p>
            </div>
            <div className="flex items-center bg-white p-1 rounded-xl border border-[#D1D9E6]">
              <button
                onClick={() => onChange({ ...settings, lineSpacing: 'standard' })}
                className={`px-4 py-1.5 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                  settings.lineSpacing === 'standard' ? 'bg-[#1A2E44] text-white shadow-2xs' : 'text-[#5A6D82] hover:text-[#1A2E44]'
                }`}
              >
                Normal
              </button>
              <button
                onClick={() => onChange({ ...settings, lineSpacing: 'wide' })}
                className={`px-4 py-1.5 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                  settings.lineSpacing === 'wide' ? 'bg-[#1A2E44] text-white shadow-2xs' : 'text-[#5A6D82] hover:text-[#1A2E44]'
                }`}
              >
                Wide
              </button>
            </div>
          </div>

          {/* Contrast */}
          <div className="p-4 rounded-2xl bg-[#F0F2F5]/80 border border-[#E8EDF2] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-[#1A2E44]">Visual Contrast</span>
              <p className="text-[11px] text-[#7A8C9F]">Toggle background & text contrast mode</p>
            </div>
            <div className="flex items-center bg-white p-1 rounded-xl border border-[#D1D9E6]">
              <button
                onClick={() => onChange({ ...settings, contrast: 'standard' })}
                className={`px-4 py-1.5 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                  settings.contrast === 'standard' ? 'bg-[#1A2E44] text-white shadow-2xs' : 'text-[#5A6D82] hover:text-[#1A2E44]'
                }`}
              >
                Standard
              </button>
              <button
                onClick={() => onChange({ ...settings, contrast: 'high' })}
                className={`px-4 py-1.5 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                  settings.contrast === 'high' ? 'bg-[#1A2E44] text-white shadow-2xs' : 'text-[#5A6D82] hover:text-[#1A2E44]'
                }`}
              >
                High Contrast
              </button>
            </div>
          </div>

          {/* Font Type */}
          <div className="p-4 rounded-2xl bg-[#F0F2F5]/80 border border-[#E8EDF2] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-[#1A2E44]">Typography Style</span>
              <p className="text-[11px] text-[#7A8C9F]">Select font face optimized for legibility</p>
            </div>
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-1 bg-white p-1 rounded-xl border border-[#D1D9E6]">
              <button
                onClick={() => onChange({ ...settings, fontFamily: 'standard' })}
                className={`px-3 py-1.5 text-[11px] sm:text-xs rounded-lg font-medium transition-all cursor-pointer ${
                  settings.fontFamily === 'standard' ? 'bg-[#1A2E44] text-white shadow-2xs' : 'text-[#5A6D82] hover:text-[#1A2E44]'
                }`}
              >
                Sans
              </button>
              <button
                onClick={() => onChange({ ...settings, fontFamily: 'dyslexic' })}
                className={`px-3 py-1.5 text-[11px] sm:text-xs rounded-lg font-medium transition-all cursor-pointer ${
                  settings.fontFamily === 'dyslexic' ? 'bg-[#1A2E44] text-white shadow-2xs' : 'text-[#5A6D82] hover:text-[#1A2E44]'
                }`}
              >
                Dyslexic
              </button>
              <button
                onClick={() => onChange({ ...settings, fontFamily: 'comic_sans' })}
                className={`px-3 py-1.5 text-[11px] sm:text-xs rounded-lg font-medium transition-all cursor-pointer ${
                  settings.fontFamily === 'comic_sans' ? 'bg-[#1A2E44] text-white shadow-2xs' : 'text-[#5A6D82] hover:text-[#1A2E44]'
                }`}
              >
                Comic
              </button>
              <button
                onClick={() => onChange({ ...settings, fontFamily: 'arial' })}
                className={`px-3 py-1.5 text-[11px] sm:text-xs rounded-lg font-medium transition-all cursor-pointer ${
                  settings.fontFamily === 'arial' ? 'bg-[#1A2E44] text-white shadow-2xs' : 'text-[#5A6D82] hover:text-[#1A2E44]'
                }`}
              >
                Arial
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#E8EDF2]">
          <button
            onClick={onBack}
            className="text-xs font-semibold text-[#5A6D82] hover:text-[#1A2E44] px-4 py-2 rounded-xl transition-colors cursor-pointer"
            id="accessibility-back-btn"
          >
            Back
          </button>

          <button
            onClick={onContinue}
            className="px-6 py-3 bg-[#1A2E44] text-white text-xs sm:text-sm font-semibold rounded-full shadow-xs hover:bg-[#2D4561] transition-all flex items-center space-x-2 cursor-pointer"
            id="accessibility-save-begin-btn"
          >
            <Check className="w-4 h-4 text-[#D1D9E6]" />
            <span>{isStandalone ? 'Save Preferences' : 'Save Preferences & Begin'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
