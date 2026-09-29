import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onRegister: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onRegister }) => {
  return (
    <section className="relative z-10 flex flex-col items-center justify-center pt-8 pb-12 sm:pt-16 sm:pb-16 px-6 text-center max-w-4xl mx-auto">


      <h1 className="hero-text text-4xl sm:text-6xl md:text-7xl font-semibold text-[#1A2E44] mb-6 tracking-tight max-w-3xl">
        The Dyslexia Screening System
      </h1>

      <p className="dyslexia-ready text-lg sm:text-xl text-[#5A6D82] mb-10 max-w-2xl mx-auto font-normal">
        A university-standard screening system for identifying adult dyslexia with precision and empathy.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={onRegister}
          className="w-full sm:w-auto px-10 py-4 bg-[#1A2E44] text-white text-base sm:text-lg font-medium rounded-full shadow-sm hover:bg-[#2D4561] hover:shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer group"
        >
          <span>Get Started Now</span>
          <ArrowRight className="w-5 h-5 text-[#D1D9E6] group-hover:translate-x-1 transition-transform ml-1" />
        </button>
      </div>

      <p className="text-xs text-[#7A8C9F] mt-8 tracking-wide font-medium">
        Educational screening platform. Not a medical or formal clinical diagnosis.
      </p>
    </section>
  );
};
