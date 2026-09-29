import React from 'react';
import { AssessmentRecord, PracticeSession } from '../types';
import { TrendingUp, Activity, BarChart2 } from 'lucide-react';

interface StudentProgressAnalyticsProps {
  history: AssessmentRecord[];
  practiceHistory: PracticeSession[];
}

export const StudentProgressAnalytics: React.FC<StudentProgressAnalyticsProps> = ({ history, practiceHistory }) => {
  if (history.length === 0 && practiceHistory.length === 0) {
    return null;
  }

  const hasHistory = history.length > 0;
  const latestRecord = history.length > 0 ? history[0] : null;
  const initialRecord = history.length > 1 ? history[history.length - 1] : latestRecord;
  const hasMultipleScreenings = history.length > 1;

  const getStatusColor = (status: string) => {
    if (status === 'Needs attention' || status === 'Further support recommended') return 'text-red-600 bg-red-50 border-red-200';
    if (status === 'Moderate' || status === 'Moderate indicators') return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  };

  const getImprovementText = (initial: string, latest: string) => {
    if (initial === latest) return 'Maintained';
    if (initial === 'Needs attention' && (latest === 'Moderate' || latest === 'Good')) return 'Improved';
    if (initial === 'Moderate' && latest === 'Good') return 'Improved';
    return 'Changed';
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl bg-white/80 border border-white/90 shadow-sm mt-8">
      <div className="flex items-center space-x-2 mb-6 border-b border-[#E8EDF2] pb-4">
        <TrendingUp className="w-5 h-5 text-[#4F7396]" />
        <h2 className="text-xl font-semibold text-[#1A2E44]">My Progress</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Practice Overview */}
        <div className="md:col-span-1 p-5 rounded-2xl bg-[#F8FAFC] border border-[#E8EDF2] flex flex-col">
          <div className="flex items-center space-x-2 mb-3">
            <Activity className="w-4 h-4 text-[#4F7396]" />
            <h3 className="text-sm font-semibold text-[#1A2E44]">Practice Overview</h3>
          </div>
          {practiceHistory.length === 0 ? (
            <div className="flex-grow flex items-center justify-center text-center p-4 border border-dashed border-[#D1D9E6] rounded-xl text-xs text-[#5A6D82]">
              Complete a practice activity to start building your progress history.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-3xl font-bold text-[#1A2E44]">{practiceHistory.length}</div>
              <div className="text-xs text-[#5A6D82] font-medium uppercase tracking-wider">Total Sessions</div>
              <div className="space-y-2 mt-4 pt-4 border-t border-[#D1D9E6]">
                <div className="flex justify-between text-xs">
                  <span className="text-[#5A6D82]">Reading / Words</span>
                  <span className="font-semibold text-[#1A2E44]">{practiceHistory.filter(p => p.type === 'reading' || p.type === 'word_recognition').length}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#5A6D82]">Processing / Comp</span>
                  <span className="font-semibold text-[#1A2E44]">{practiceHistory.filter(p => p.type === 'processing' || p.type === 'comprehension').length}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Screening Comparison */}
        <div className="md:col-span-2">
          {!hasHistory ? (
             <div className="h-full flex items-center justify-center text-center p-6 border border-dashed border-[#D1D9E6] rounded-xl text-xs text-[#5A6D82]">
               Complete your initial screening to see performance analytics.
             </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[#1A2E44] flex items-center space-x-2">
                <BarChart2 className="w-4 h-4 text-[#4F7396]" />
                <span>Performance Over Time</span>
              </h3>
              
              {!hasMultipleScreenings ? (
                <div className="p-4 rounded-xl bg-white border border-[#E8EDF2] text-xs text-[#5A6D82]">
                  <p className="mb-2"><strong>Initial Screening Recorded.</strong></p>
                  <p>Complete recommended practice activities and retake the screening to track your progress over time.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {['reading', 'wordRecognition', 'comprehension', 'processingSpeed'].map((cat) => {
                    const initVal = initialRecord?.categories[cat as keyof typeof initialRecord.categories] as string;
                    const latestVal = latestRecord?.categories[cat as keyof typeof latestRecord.categories] as string;
                    const improvement = getImprovementText(initVal, latestVal);
                    
                    const formatName = (name: string) => {
                      if (name === 'wordRecognition') return 'Word Recognition';
                      if (name === 'processingSpeed') return 'Processing Speed';
                      return name.charAt(0).toUpperCase() + name.slice(1);
                    };

                    return (
                      <div key={cat} className="p-4 rounded-xl bg-white border border-[#E8EDF2] flex flex-col justify-between">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs font-semibold text-[#1A2E44]">{formatName(cat)}</span>
                          {improvement === 'Improved' && (
                            <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Progress Observed</span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-xs">
                          <div className={`px-2 py-1 rounded-md border ${getStatusColor(initVal)} opacity-70 flex-1 text-center truncate`}>
                            {initVal}
                          </div>
                          <div className="text-[#AAB7C6]">→</div>
                          <div className={`px-2 py-1 rounded-md border ${getStatusColor(latestVal)} flex-1 text-center font-medium truncate shadow-2xs`}>
                            {latestVal}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
