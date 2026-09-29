import React from 'react';
import { UserProfile, AssessmentRecord, PracticeSession, PracticeType } from '../types';
import { Play, Clock, Award, User, ChevronRight, FileCheck, LifeBuoy, Brain, ShieldAlert, RotateCcw } from 'lucide-react';
import { DUT_DISABILITY_UNIT_INFO } from '../data/assessmentData';
import { StudentProgressAnalytics } from './StudentProgressAnalytics';

interface StudentDashboardProps {
  user: UserProfile;
  history: AssessmentRecord[];
  practiceHistory: PracticeSession[];
  onStartAssessment: () => void;
  onStartPractice: (type: PracticeType) => void;
  onViewHistoryRecord: (record: AssessmentRecord) => void;
  onViewProfile: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  history,
  practiceHistory,
  onStartAssessment,
  onStartPractice,
  onViewHistoryRecord,
  onViewProfile,
}) => {
  const latestRecord = history.length > 0 ? history[0] : null;

  // Determine recommendations based on the latest record
  const recommendations: { title: string; type: PracticeType; description: string }[] = [];
  
  if (latestRecord) {
    if (latestRecord.categories.reading === 'Needs attention' || latestRecord.categories.reading === 'Moderate') {
      recommendations.push({
        title: 'Reading Passage Practice',
        type: 'reading',
        description: 'Paced exercises to develop steady reading speed and visual focus.'
      });
    }
    if (latestRecord.categories.wordRecognition === 'Needs attention' || latestRecord.categories.wordRecognition === 'Moderate') {
      recommendations.push({
        title: 'Word Recognition Practice',
        type: 'word_recognition',
        description: 'Visual recognition exercises to improve orthographic matching.'
      });
    }
    if (latestRecord.categories.comprehension === 'Needs attention' || latestRecord.categories.comprehension === 'Moderate') {
      recommendations.push({
        title: 'Comprehension Practice',
        type: 'comprehension',
        description: 'Practice reading short passages and identifying main ideas.'
      });
    }
    if (latestRecord.categories.processingSpeed === 'Needs attention' || latestRecord.categories.processingSpeed === 'Moderate') {
      recommendations.push({
        title: 'Rapid Matching Practice',
        type: 'processing',
        description: 'Visual recognition matching to improve your processing speed.'
      });
    }
  }

  // Do NOT add default recommendations if none exist or if no history.
  // Recommendations must only appear after screening results identify an area that needs attention.

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 w-full space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-[#E8EDF2]">
        <div>
          <span className="text-xs font-semibold text-[#4F7396] tracking-widest uppercase">
            Student Portal
          </span>
          <h1 className="text-3xl sm:text-4xl font-semibold text-[#1A2E44] tracking-tight mt-1">
            Good morning, {user.firstName}
          </h1>
          <p className="text-xs text-[#5A6D82] mt-1 dyslexia-ready">
            Student ID: {user.studentNumber} • {user.email}
          </p>
        </div>

        <button
          onClick={onViewProfile}
          className="mt-4 sm:mt-0 flex items-center space-x-2 px-4 py-2 rounded-xl bg-white border border-[#D1D9E6] text-xs font-medium text-[#1A2E44] hover:bg-[#F0F2F5] transition-all cursor-pointer"
        >
          <User className="w-4 h-4 text-[#4F7396]" />
          <span>Profile Settings</span>
        </button>
      </div>

      {/* Primary Action Card - Dyslexia Screening */}
      {history.length === 0 ? (
        <div className="glass-panel p-8 rounded-3xl bg-gradient-to-br from-white/90 to-[#E8EDF2]/50 border border-white/80 shadow-md relative overflow-hidden">
          <div className="max-w-xl relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#1A2E44] text-white text-[11px] font-medium mb-4">
              <Clock className="w-3.5 h-3.5 text-[#D1D9E6]" />
              <span>Interactive Screening • ~15 mins</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-semibold text-[#1A2E44] tracking-tight mb-2">
              Dyslexia Educational Screening
            </h2>

            <p className="dyslexia-ready text-sm text-[#5A6D82] mb-6 leading-relaxed">
              Complete a continuous 5-section evaluation designed to measure phonological decoding, visual word recognition, reading speed, and processing speed.
            </p>

            <button
              onClick={onStartAssessment}
              className="px-6 py-3.5 bg-[#1A2E44] text-white text-xs sm:text-sm font-semibold rounded-full shadow-sm hover:bg-[#2D4561] transition-all flex items-center space-x-2 cursor-pointer group"
            >
              <Play className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
              <span>Start Assessment</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl bg-white/90 border border-white/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-semibold text-[#1A2E44] mb-2">Want to check your progress?</h2>
            <p className="text-xs sm:text-sm text-[#5A6D82] dyslexia-ready">
              You can retake the educational screening at any time to see if your performance has changed after practicing.
            </p>
          </div>
          <button
            onClick={onStartAssessment}
            className="px-6 py-3 bg-[#1A2E44] text-white text-xs font-semibold rounded-full hover:bg-[#2D4561] transition-all cursor-pointer shrink-0 flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Screening</span>
          </button>
        </div>
      )}

      {/* Support Alert if needed */}
      {latestRecord && (latestRecord.overallStatus === 'Further support recommended' || latestRecord.overallStatus === 'Moderate indicators') && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 text-sm flex items-start space-x-3">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block mb-1">Further educational support may be beneficial.</span>
            <span className="text-xs opacity-90">Based on your latest screening, we recommend contacting the DUT Disability Unit for a formal assessment or academic accommodations.</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Recommended Activities / Support */}
        <div className="glass-panel p-6 rounded-2xl bg-white/70 border border-white/80 flex flex-col">
          <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-[#E8EDF2]">
            <Award className="w-4 h-4 text-[#4F7396]" />
            <h3 className="text-sm font-semibold text-[#1A2E44]">Recommended For You</h3>
          </div>

          <div className="space-y-3 text-xs flex-grow">
            {history.length === 0 || recommendations.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center p-6 bg-white/40 rounded-xl border border-dashed border-[#D1D9E6] h-full">
                <span className="text-xs text-[#5A6D82] font-medium">Complete your screening to receive personalised recommendations.</span>
              </div>
            ) : (
              recommendations.slice(0, 3).map((rec, idx) => (
                <button 
                  key={idx}
                  onClick={() => onStartPractice(rec.type)}
                  className="w-full text-left p-3.5 rounded-xl bg-white/80 border border-[#E8EDF2] hover:border-[#4F7396] hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-center">
                    <div className="font-semibold text-[#1A2E44] group-hover:text-[#4F7396]">{rec.title}</div>
                    <ChevronRight className="w-4 h-4 text-[#7A8C9F] group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-[11px] text-[#5A6D82] mt-1 dyslexia-ready">
                    {rec.description}
                  </p>
                </button>
              ))
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-[#E8EDF2]">
            <a 
              href={DUT_DISABILITY_UNIT_INFO.website}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3.5 rounded-xl bg-[#E8EDF2]/60 border border-[#D1D9E6] hover:bg-[#D1D9E6]/50 transition-colors cursor-pointer text-xs"
            >
              <div className="flex items-start space-x-3">
                <LifeBuoy className="w-4 h-4 text-[#4F7396] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[#1A2E44] hover:underline">{DUT_DISABILITY_UNIT_INFO.unitName}</div>
                  <p className="text-[11px] text-[#5A6D82] mt-0.5">
                    Contact: {DUT_DISABILITY_UNIT_INFO.contactEmail}
                  </p>
                </div>
              </div>
            </a>
          </div>
        </div>

        <div className="space-y-6 flex flex-col">
          {/* Previous Assessments */}
          <div className="glass-panel p-6 rounded-2xl bg-white/70 border border-white/80">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E8EDF2]">
              <div className="flex items-center space-x-2">
                <FileCheck className="w-4 h-4 text-[#4F7396]" />
                <h3 className="text-sm font-semibold text-[#1A2E44]">Screening History</h3>
              </div>
              <span className="text-[11px] text-[#7A8C9F] font-medium">
                {history.length} {history.length === 1 ? 'Record' : 'Records'}
              </span>
            </div>

            {history.length === 0 ? (
              <div className="py-4 text-center text-xs text-[#7A8C9F]">
                No previous screenings found.
              </div>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                {history.map((record) => (
                  <div
                    key={record.id}
                    onClick={() => onViewHistoryRecord(record)}
                    className="p-3 rounded-xl bg-white/80 border border-[#E8EDF2] hover:border-[#4F7396] transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-semibold text-[#1A2E44]">{record.date}</div>
                      <div className="text-[10px] font-medium text-[#4F7396] mt-0.5">
                        {record.overallStatus}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#7A8C9F] group-hover:translate-x-1 transition-transform" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Practice History */}
          <div className="glass-panel p-6 rounded-2xl bg-white/70 border border-white/80 flex-grow">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E8EDF2]">
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-[#4F7396]" />
                <h3 className="text-sm font-semibold text-[#1A2E44]">Practice History</h3>
              </div>
              <span className="text-[11px] text-[#7A8C9F] font-medium">
                {practiceHistory.length} Sessions
              </span>
            </div>

            {practiceHistory.length === 0 ? (
              <div className="py-4 text-center text-xs text-[#7A8C9F]">
                Complete recommended activities to build your practice history.
              </div>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                {practiceHistory.map((session) => (
                  <div
                    key={session.id}
                    className="p-3 rounded-xl bg-white/80 border border-[#E8EDF2] flex flex-col"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-xs font-semibold text-[#1A2E44] capitalize">{session.type.replace('_', ' ')}</div>
                      <div className="text-[10px] text-[#7A8C9F]">{session.date}</div>
                    </div>
                    <div className="flex space-x-4 text-[10px] font-medium text-[#4F7396]">
                      {session.accuracy !== undefined && (
                        <span>Acc: {Math.round(session.accuracy)}%</span>
                      )}
                      {session.timeMs !== undefined && session.timeMs > 0 && (
                        <span>Time: {Math.round(session.timeMs / 1000)}s</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
      
      {/* Student Progress Analytics Section */}
      <StudentProgressAnalytics history={history} practiceHistory={practiceHistory} />
    </div>
  );
};
