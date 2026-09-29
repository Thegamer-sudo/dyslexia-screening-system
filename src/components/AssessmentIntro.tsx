import React from 'react';
import { ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';

interface AssessmentIntroProps {
  onContinue: () => void;
  onBack: () => void;
}

export const AssessmentIntro: React.FC<AssessmentIntroProps> = ({ onContinue, onBack }) => {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12 w-full animate-in fade-in duration-300">
      <div className="glass-panel p-8 sm:p-10 rounded-3xl bg-white/90 border border-white/90 shadow-md">
        <span className="text-xs font-bold tracking-widest text-[#4F7396] uppercase">
          Step 1 of 2 • Pre-Screening
        </span>

        <h1 className="text-3xl font-semibold text-[#1A2E44] tracking-tight mt-2 mb-6">
          Before we begin
        </h1>

        <div className="space-y-4 mb-8">
          <div className="flex items-start space-x-3.5 p-4 rounded-2xl bg-[#F0F2F5]/80 border border-[#E8EDF2]">
            <CheckCircle2 className="w-5 h-5 text-[#4F7396] shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-[#1A2E44]">Short Interactive Activities</h3>
              <p className="text-xs text-[#5A6D82] mt-0.5 dyslexia-ready">
                You will complete 5 continuous sections evaluating questionnaire responses, word recognition, reading passages, and timed tasks.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5 p-4 rounded-2xl bg-[#F0F2F5]/80 border border-[#E8EDF2]">
            <CheckCircle2 className="w-5 h-5 text-[#4F7396] shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-[#1A2E44]">Timed Performance Recording</h3>
              <p className="text-xs text-[#5A6D82] mt-0.5 dyslexia-ready">
                Some activities record your response speed automatically in the background. Take your time and focus on accuracy.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5 p-4 rounded-2xl bg-[#F0F2F5]/80 border border-[#E8EDF2]">
            <CheckCircle2 className="w-5 h-5 text-[#4F7396] shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-[#1A2E44]">No Academic Grades</h3>
              <p className="text-xs text-[#5A6D82] mt-0.5 dyslexia-ready">
                This is not an academic test. There are no right or wrong grades, only indicators to understand how you learn best.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5 p-4 rounded-2xl bg-[#E8EDF2]/80 border border-[#D1D9E6]">
            <ShieldAlert className="w-5 h-5 text-[#1A2E44] shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-[#1A2E44]">Educational Screening Disclaimer</h3>
              <p className="text-xs text-[#5A6D82] mt-0.5 dyslexia-ready">
                Your results are for educational screening and learning support guidance only. They do not constitute a clinical diagnosis.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#E8EDF2]">
          <button
            onClick={onBack}
            className="text-xs font-semibold text-[#5A6D82] hover:text-[#1A2E44] px-4 py-2 rounded-xl transition-colors cursor-pointer"
            id="intro-back-btn"
          >
            Back
          </button>

          <button
            onClick={onContinue}
            className="px-6 py-3 bg-[#1A2E44] text-white text-xs sm:text-sm font-semibold rounded-full shadow-xs hover:bg-[#2D4561] transition-all flex items-center space-x-2 cursor-pointer"
            id="intro-continue-btn"
          >
            <span>Continue to Accessibility</span>
            <ArrowRight className="w-4 h-4 text-[#D1D9E6]" />
          </button>
        </div>
      </div>
    </div>
  );
};
