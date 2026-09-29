import React, { useState } from 'react';
import { X } from 'lucide-react';

export const Footer: React.FC = () => {
  const [showPopia, setShowPopia] = useState(false);

  return (
    <>
      <footer className="relative z-10 w-full px-6 sm:px-12 py-12 bg-white/90 backdrop-blur-md border-t border-[#F0F2F5] mt-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10">
        <div className="max-w-xs">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-5 h-5 rounded-full bg-[#4F7396] opacity-80 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-2xs rotate-45"></div>
            </div>
            <span className="text-sm font-bold tracking-tight text-[#1A2E44] uppercase">
              Dyslexia Screening System
            </span>
          </div>
          <p className="text-xs text-[#7A8C9F] dyslexia-ready leading-relaxed">
            Advanced neuro-educational diagnostics developed for the modern university environment. Focused on accessibility first.
          </p>
        </div>

        <div className="flex flex-wrap space-x-12 sm:space-x-20">
          <div className="flex flex-col space-y-2.5">
            <span className="text-[10px] font-bold text-[#1A2E44] uppercase tracking-widest">
              Navigation
            </span>
            <a href="#" onClick={(e) => e.preventDefault()} className="text-xs text-[#7A8C9F] hover:text-[#4F7396] transition-colors">
              Home Page
            </a>
            <a href="#" onClick={(e) => e.preventDefault()} className="text-xs text-[#7A8C9F] hover:text-[#4F7396] transition-colors">
              Student Dashboard
            </a>
          </div>

          <div className="flex flex-col space-y-2.5">
            <span className="text-[10px] font-bold text-[#1A2E44] uppercase tracking-widest">
              Support & Legal
            </span>
            <a href="#" onClick={(e) => { e.preventDefault(); setShowPopia(true); }} className="text-xs text-[#7A8C9F] hover:text-[#4F7396] transition-colors">
              POPIA Compliance Policy
            </a>
            <a href="https://www.dut.ac.za/disability_support" target="_blank" rel="noopener noreferrer" className="text-xs text-[#7A8C9F] hover:text-[#4F7396] transition-colors">
              DUT Disability Unit
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-[#F0F2F5] flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-[10px] text-[#AAB7C6] tracking-wide">
          &copy; {new Date().getFullYear()} DYSLEXIA SCREENING SYSTEM. ALL RIGHTS RESERVED.
        </p>
        </div>
      </footer>

      {showPopia && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#1A2E44]/40 backdrop-blur-sm animate-in fade-in duration-200 p-4 text-left">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-xl border border-[#E8EDF2] relative scale-in-center max-h-[80vh] overflow-y-auto">
            <button 
              onClick={() => setShowPopia(false)}
              className="absolute top-6 right-6 text-[#7A8C9F] hover:text-[#1A2E44] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-[#1A2E44] mb-4">POPIA Compliance Policy</h3>
            <div className="text-xs text-[#5A6D82] space-y-3 leading-relaxed">
              <p>
                In accordance with the Protection of Personal Information Act (POPIA), we are committed to protecting your privacy and ensuring your personal information is collected and processed properly, lawfully, and transparently.
              </p>
              <p>
                <strong>1. Information Collection:</strong> We collect only necessary personal data (name, email, student number) and your screening interactions to provide educational support.
              </p>
              <p>
                <strong>2. Data Security:</strong> All assessment data is strictly encrypted and securely stored. It will not be shared with third-party organizations without your explicit consent.
              </p>
              <p>
                <strong>3. Usage:</strong> Your screening results are used exclusively to recommend university-level accommodations and refer you to the Disability Unit if needed.
              </p>
              <p>
                This ensures a safe, private environment for your educational screening.
              </p>
            </div>
            <button 
              onClick={() => setShowPopia(false)}
              className="mt-6 w-full py-3 bg-[#1A2E44] text-white font-medium rounded-xl transition-colors cursor-pointer"
            >
              Close Policy
            </button>
          </div>
        </div>
      )}
    </>
  );
};
