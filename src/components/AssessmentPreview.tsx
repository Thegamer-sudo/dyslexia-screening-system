import React from 'react';
import { FileText, BookOpen, Layers, Clock } from 'lucide-react';

export const AssessmentPreview: React.FC = () => {
  const modules = [
    {
      title: 'Questionnaire',
      subtitle: 'Self-reported history',
      icon: <FileText className="w-5 h-5 text-[#4F7396]" />,
      detail: 'Personal background & reading habits',
    },
    {
      title: 'Reading',
      subtitle: 'Grapheme mapping',
      icon: <BookOpen className="w-5 h-5 text-[#4F7396]" />,
      detail: 'Passage comprehension & accuracy',
    },
    {
      title: 'Word Lexicon',
      subtitle: 'Visual recognition',
      icon: <Layers className="w-5 h-5 text-[#4F7396]" />,
      detail: 'Orthographic word recognition',
    },
    {
      title: 'Processing',
      subtitle: 'Timed performance',
      icon: <Clock className="w-5 h-5 text-[#4F7396]" />,
      detail: 'Rapid naming & processing speed',
    },
  ];

  return (
    <section className="relative z-10 w-full max-w-5xl mx-auto px-6 py-8">
      <div className="text-center mb-8">
        <span className="text-xs font-bold tracking-widest text-[#4F7396] uppercase">
          Assessment Journey Modules
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {modules.map((m, index) => (
          <div
            key={index}
            className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center hover:bg-white/80 transition-all duration-300 border border-white/60 group"
          >
            <div className="w-11 h-11 rounded-xl bg-[#E8EDF2] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              {m.icon}
            </div>
            <h3 className="text-sm font-semibold text-[#1A2E44] mb-1">
              {m.title}
            </h3>
            <p className="text-xs font-medium text-[#4F7396] mb-2">
              {m.subtitle}
            </p>
            <p className="text-[11px] text-[#7A8C9F] dyslexia-ready">
              {m.detail}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
