import React from 'react';
import { AccessibilitySettings } from '../types';
import { X, Type, Sparkles, Sun, Space } from 'lucide-react';

interface AccessibilityToolbarProps {
  settings: AccessibilitySettings;
  onChange: (settings: AccessibilitySettings) => void;
  onClose: () => void;
}

export const AccessibilityToolbar: React.FC<AccessibilityToolbarProps> = ({
  settings,
  onChange,
  onClose,
}) => {
  return (
    <div className="relative z-20 max-w-4xl mx-auto px-6 mb-8" id="accessibility-toolbar">
      <div className="glass-panel p-6 rounded-2xl border border-white/80 shadow-md transition-all">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E8EDF2]">
          <div className="flex items-center space-x-2">
            <Type className="w-4 h-4 text-[#4F7396]" />
            <h2 className="text-sm font-semibold text-[#1A2E44] tracking-tight">
              Reading Comfort & Accessibility Preferences
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#7A8C9F] hover:text-[#1A2E44] p-1 rounded-full transition-colors cursor-pointer"
            id="close-accessibility-toolbar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 text-xs">
          {/* Text Size */}
          <div className="flex flex-col space-y-1.5">
            <span className="text-[#5A6D82] font-medium">Text Size</span>
            <div className="flex items-center bg-[#E8EDF2] p-1 rounded-lg">
              <button
                onClick={() => onChange({ ...settings, fontSize: 'standard' })}
                className={`flex-1 py-1 rounded-md transition-all text-center ${
                  settings.fontSize === 'standard'
                    ? 'bg-white text-[#1A2E44] font-semibold shadow-xs'
                    : 'text-[#5A6D82] hover:text-[#1A2E44]'
                }`}
              >
                A
              </button>
              <button
                onClick={() => onChange({ ...settings, fontSize: 'large' })}
                className={`flex-1 py-1 rounded-md transition-all text-center ${
                  settings.fontSize === 'large'
                    ? 'bg-white text-[#1A2E44] font-semibold shadow-xs'
                    : 'text-[#5A6D82] hover:text-[#1A2E44]'
                }`}
              >
                A+
              </button>
              <button
                onClick={() => onChange({ ...settings, fontSize: 'xlarge' })}
                className={`flex-1 py-1 rounded-md transition-all text-center ${
                  settings.fontSize === 'xlarge'
                    ? 'bg-white text-[#1A2E44] font-semibold shadow-xs'
                    : 'text-[#5A6D82] hover:text-[#1A2E44]'
                }`}
              >
                A++
              </button>
            </div>
          </div>

          {/* Letter Spacing */}
          <div className="flex flex-col space-y-1.5">
            <span className="text-[#5A6D82] font-medium">Letter Spacing</span>
            <div className="flex items-center bg-[#E8EDF2] p-1 rounded-lg">
              <button
                onClick={() => onChange({ ...settings, letterSpacing: 'standard' })}
                className={`flex-1 py-1 rounded-md transition-all text-center ${
                  settings.letterSpacing === 'standard'
                    ? 'bg-white text-[#1A2E44] font-semibold shadow-xs'
                    : 'text-[#5A6D82] hover:text-[#1A2E44]'
                }`}
              >
                Normal
              </button>
              <button
                onClick={() => onChange({ ...settings, letterSpacing: 'wide' })}
                className={`flex-1 py-1 rounded-md transition-all text-center ${
                  settings.letterSpacing === 'wide'
                    ? 'bg-white text-[#1A2E44] font-semibold shadow-xs'
                    : 'text-[#5A6D82] hover:text-[#1A2E44]'
                }`}
              >
                Wide
              </button>
            </div>
          </div>

          {/* Line Spacing */}
          <div className="flex flex-col space-y-1.5">
            <span className="text-[#5A6D82] font-medium">Line Spacing</span>
            <div className="flex items-center bg-[#E8EDF2] p-1 rounded-lg">
              <button
                onClick={() => onChange({ ...settings, lineSpacing: 'standard' })}
                className={`flex-1 py-1 rounded-md transition-all text-center ${
                  settings.lineSpacing === 'standard'
                    ? 'bg-white text-[#1A2E44] font-semibold shadow-xs'
                    : 'text-[#5A6D82] hover:text-[#1A2E44]'
                }`}
              >
                Standard
              </button>
              <button
                onClick={() => onChange({ ...settings, lineSpacing: 'wide' })}
                className={`flex-1 py-1 rounded-md transition-all text-center ${
                  settings.lineSpacing === 'wide'
                    ? 'bg-white text-[#1A2E44] font-semibold shadow-xs'
                    : 'text-[#5A6D82] hover:text-[#1A2E44]'
                }`}
              >
                Spacious
              </button>
            </div>
          </div>

          {/* Contrast */}
          <div className="flex flex-col space-y-1.5">
            <span className="text-[#5A6D82] font-medium">Contrast</span>
            <div className="flex items-center bg-[#E8EDF2] p-1 rounded-lg">
              <button
                onClick={() => onChange({ ...settings, contrast: 'standard' })}
                className={`flex-1 py-1 rounded-md transition-all text-center ${
                  settings.contrast === 'standard'
                    ? 'bg-white text-[#1A2E44] font-semibold shadow-xs'
                    : 'text-[#5A6D82] hover:text-[#1A2E44]'
                }`}
              >
                Soft
              </button>
              <button
                onClick={() => onChange({ ...settings, contrast: 'high' })}
                className={`flex-1 py-1 rounded-md transition-all text-center ${
                  settings.contrast === 'high'
                    ? 'bg-[#1A2E44] text-white font-semibold shadow-xs'
                    : 'text-[#5A6D82] hover:text-[#1A2E44]'
                }`}
              >
                High
              </button>
            </div>
          </div>

          {/* Font Type */}
          <div className="flex flex-col space-y-1.5">
            <span className="text-[#5A6D82] font-medium">Font Family</span>
            <div className="grid grid-cols-2 gap-1 bg-[#E8EDF2] p-1 rounded-lg">
              <button
                onClick={() => onChange({ ...settings, fontFamily: 'standard' })}
                className={`py-1 rounded-md transition-all text-center ${
                  settings.fontFamily === 'standard'
                    ? 'bg-white text-[#1A2E44] font-semibold shadow-xs'
                    : 'text-[#5A6D82] hover:text-[#1A2E44]'
                }`}
              >
                Standard
              </button>
              <button
                onClick={() => onChange({ ...settings, fontFamily: 'dyslexic' })}
                className={`py-1 rounded-md transition-all text-center ${
                  settings.fontFamily === 'dyslexic'
                    ? 'bg-white text-[#1A2E44] font-semibold shadow-xs'
                    : 'text-[#5A6D82] hover:text-[#1A2E44]'
                }`}
              >
                OpenDyslexic
              </button>
              <button
                onClick={() => onChange({ ...settings, fontFamily: 'comic_sans' })}
                className={`py-1 rounded-md transition-all text-center ${
                  settings.fontFamily === 'comic_sans'
                    ? 'bg-white text-[#1A2E44] font-semibold shadow-xs'
                    : 'text-[#5A6D82] hover:text-[#1A2E44]'
                }`}
              >
                Comic Sans
              </button>
              <button
                onClick={() => onChange({ ...settings, fontFamily: 'arial' })}
                className={`py-1 rounded-md transition-all text-center ${
                  settings.fontFamily === 'arial'
                    ? 'bg-white text-[#1A2E44] font-semibold shadow-xs'
                    : 'text-[#5A6D82] hover:text-[#1A2E44]'
                }`}
              >
                Arial
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
