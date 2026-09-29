import React, { useState, useEffect } from 'react';
import {
  PRACTICE_WORD_RECOGNITION,
  PRACTICE_READING_PASSAGE,
  PRACTICE_TIMED_TRIAL,
} from '../data/assessmentData';
import { PracticeSession, PracticeType } from '../types';
import { ArrowLeft, Clock, BookOpen, CheckCircle, RotateCcw, XCircle, ArrowRight } from 'lucide-react';

interface PracticeFlowProps {
  type: PracticeType;
  userEmail: string;
  onComplete: (session: PracticeSession) => void;
  onExit: () => void;
}

export const PracticeFlow: React.FC<PracticeFlowProps> = ({ type, userEmail, onComplete, onExit }) => {
  const [currentStep, setCurrentStep] = useState<'intro' | 'activity' | 'results'>('intro');
  
  // Specific state for the activities
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activityStartTime, setActivityStartTime] = useState<number>(0);
  const [readingSeconds, setReadingSeconds] = useState(0);
  const [isReadingActive, setIsReadingActive] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  
  // Timer for reading section
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isReadingActive) {
      interval = setInterval(() => {
        setReadingSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isReadingActive]);

  const startPractice = () => {
    setCurrentStep('activity');
    setActivityStartTime(Date.now());
    if (type === 'reading') {
      setIsReadingActive(true);
    }
  };

  const finishPractice = () => {
    let accuracy = 0;
    let timeMs = 0;
    let finalScore = score;
    let maxScore = 0;

    if (type === 'word_recognition') {
      maxScore = PRACTICE_WORD_RECOGNITION.length;
      accuracy = (finalScore / maxScore) * 100;
    } else if (type === 'comprehension') {
      maxScore = PRACTICE_READING_PASSAGE.questions.length;
      accuracy = (finalScore / maxScore) * 100;
    } else if (type === 'reading') {
      timeMs = readingSeconds * 1000;
    } else if (type === 'processing') {
      maxScore = PRACTICE_TIMED_TRIAL.length;
      let totalTime = 0;
      Object.values(answers).forEach((res: any) => {
        totalTime += res.timeMs;
      });
      timeMs = maxScore > 0 ? totalTime / maxScore : 0;
      accuracy = (finalScore / maxScore) * 100;
    }

    const session: PracticeSession = {
      id: `prac_${Date.now()}`,
      email: userEmail,
      type,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      accuracy,
      timeMs,
      score: finalScore,
      maxScore
    };

    onComplete(session);
    setCurrentStep('results');
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Activity Renderers
  const renderWordRecognition = () => {
    const item = PRACTICE_WORD_RECOGNITION[currentIndex];
    
    const handleSelect = (option: string) => {
      const isCorrect = option === item.correctAnswer;
      if (isCorrect) setScore(s => s + 1);
      
      if (currentIndex < PRACTICE_WORD_RECOGNITION.length - 1) {
        setCurrentIndex(c => c + 1);
      } else {
        finishPractice();
      }
    };

    return (
      <div className="glass-panel p-8 sm:p-10 rounded-3xl bg-white/90 shadow-md">
        <h2 className="text-xl font-semibold mb-6">Word Recognition Practice</h2>
        <p className="text-xs text-[#5A6D82] mb-8">Select the correctly spelled word.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {item.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(opt)}
              className="p-5 rounded-2xl bg-[#F0F2F5]/90 border border-[#D1D9E6] hover:bg-white hover:border-[#4F7396] text-[#1A2E44] font-semibold transition-all cursor-pointer"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderReading = () => {
    return (
      <div className="glass-panel p-8 sm:p-10 rounded-3xl bg-white/90 shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">{PRACTICE_READING_PASSAGE.title}</h2>
          <div className="flex items-center space-x-2 px-3 py-1 bg-[#E8EDF2] rounded-full font-mono text-sm">
            <Clock className="w-4 h-4 text-[#4F7396]" />
            <span>{formatTime(readingSeconds)}</span>
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-[#F0F2F5]/80 text-[#1A2E44] leading-relaxed mb-8 dyslexia-ready">
          {PRACTICE_READING_PASSAGE.content}
        </div>
        <button
          onClick={() => { setIsReadingActive(false); finishPractice(); }}
          className="w-full py-4 bg-[#1A2E44] text-white font-semibold rounded-2xl hover:bg-[#2D4561] cursor-pointer"
        >
          I've Finished Reading
        </button>
      </div>
    );
  };

  const renderComprehension = () => {
    const q = PRACTICE_READING_PASSAGE.questions[currentIndex];
    
    const handleSelect = (optIdx: number) => {
      const isCorrect = optIdx === q.correctIndex;
      if (isCorrect) setScore(s => s + 1);
      
      if (currentIndex < PRACTICE_READING_PASSAGE.questions.length - 1) {
        setCurrentIndex(c => c + 1);
      } else {
        finishPractice();
      }
    };

    return (
      <div className="glass-panel p-8 sm:p-10 rounded-3xl bg-white/90 shadow-md">
        <h2 className="text-xl font-semibold mb-6">Comprehension Practice</h2>
        <h3 className="text-sm font-semibold mb-6 dyslexia-ready">{q.question}</h3>
        <div className="space-y-3">
          {q.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className="w-full p-4 rounded-xl text-left font-medium bg-[#F0F2F5]/90 border border-[#D1D9E6] hover:bg-white hover:border-[#4F7396] transition-all cursor-pointer"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderProcessing = () => {
    const item = PRACTICE_TIMED_TRIAL[currentIndex];
    
    const handleSelect = (opt: string) => {
      const elapsed = Date.now() - activityStartTime;
      const isCorrect = opt === item.targetWord;
      
      if (isCorrect) setScore(s => s + 1);
      
      setAnswers(prev => ({
        ...prev,
        [currentIndex]: { timeMs: elapsed }
      }));

      if (currentIndex < PRACTICE_TIMED_TRIAL.length - 1) {
        setCurrentIndex(c => c + 1);
        setActivityStartTime(Date.now());
      } else {
        finishPractice();
      }
    };

    return (
      <div className="glass-panel p-8 sm:p-10 rounded-3xl bg-white/90 shadow-md text-center">
        <h2 className="text-xl font-semibold mb-6">Rapid Matching Practice</h2>
        <span className="text-xs font-bold uppercase text-[#4F7396]">Target Word</span>
        <div className="text-3xl font-bold tracking-widest text-[#1A2E44] my-4 p-4 rounded-2xl bg-[#E8EDF2]/80 border border-[#D1D9E6] inline-block">
          {item.targetWord}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {item.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(opt)}
              className="p-4 rounded-xl bg-[#F0F2F5]/90 border border-[#D1D9E6] hover:bg-white hover:border-[#4F7396] font-semibold tracking-wider transition-all cursor-pointer"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 w-full animate-in fade-in duration-300">
      <button
        onClick={onExit}
        className="inline-flex items-center space-x-2 text-xs font-semibold text-[#4F7396] hover:text-[#1A2E44] mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </button>

      {currentStep === 'intro' && (
        <div className="glass-panel p-8 sm:p-10 rounded-3xl bg-white/90 shadow-md">
          <h1 className="text-2xl font-semibold mb-2 capitalize">{type.replace('_', ' ')} Practice</h1>
          <p className="text-sm text-[#5A6D82] mb-8 dyslexia-ready">
            This is an educational exercise designed to help you build comfort and fluency in this area. It will not affect your official screening score.
          </p>
          <button
            onClick={startPractice}
            className="px-6 py-3 bg-[#1A2E44] text-white font-semibold rounded-full hover:bg-[#2D4561] transition-all cursor-pointer"
          >
            Start Practice
          </button>
        </div>
      )}

      {currentStep === 'activity' && (
        <div className="animate-in slide-in-from-right-4 duration-300">
          {type === 'word_recognition' && renderWordRecognition()}
          {type === 'reading' && renderReading()}
          {type === 'comprehension' && renderComprehension()}
          {type === 'processing' && renderProcessing()}
        </div>
      )}

      {currentStep === 'results' && (
        <div className="glass-panel p-8 sm:p-10 rounded-3xl bg-white/90 shadow-md text-center animate-in zoom-in-95 duration-500">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-semibold text-[#1A2E44] mb-2">Practice Complete</h2>
          <p className="text-sm text-[#5A6D82] mb-8 dyslexia-ready">
            Great job! Regular practice builds familiarity and comfort over time.
          </p>
          
          <div className="p-6 rounded-2xl bg-[#F0F2F5]/80 mb-8 max-w-md mx-auto">
            {type === 'reading' && (
              <div>
                <span className="block text-xs text-[#7A8C9F] uppercase font-bold mb-1">Reading Time</span>
                <span className="text-2xl font-semibold text-[#1A2E44]">{formatTime(readingSeconds)}</span>
              </div>
            )}
            {type === 'processing' && (
              <div>
                <span className="block text-xs text-[#7A8C9F] uppercase font-bold mb-1">Avg Response Time</span>
                <span className="text-2xl font-semibold text-[#1A2E44]">{Object.keys(answers).length > 0 ? Math.round((Object.values(answers).reduce((acc: number, curr: any) => acc + curr.timeMs, 0) as number) / PRACTICE_TIMED_TRIAL.length) : 0} ms</span>
              </div>
            )}
            {(type === 'word_recognition' || type === 'comprehension') && (
              <div>
                <span className="block text-xs text-[#7A8C9F] uppercase font-bold mb-1">Accuracy</span>
                <span className="text-2xl font-semibold text-[#1A2E44]">{score} / {type === 'word_recognition' ? PRACTICE_WORD_RECOGNITION.length : PRACTICE_READING_PASSAGE.questions.length}</span>
              </div>
            )}
          </div>

          <button
            onClick={onExit}
            className="w-full py-4 bg-[#1A2E44] text-white font-semibold rounded-2xl hover:bg-[#2D4561] transition-all cursor-pointer"
          >
            Return to Dashboard
          </button>
        </div>
      )}
    </div>
  );
};
