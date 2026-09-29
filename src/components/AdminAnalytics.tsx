import React, { useEffect, useState } from 'react';
import { ArrowLeft, PieChart, BarChart3, TrendingUp, Users, Activity } from 'lucide-react';
import { AssessmentRecord, PracticeSession } from '../types';

interface AdminAnalyticsProps {
  onBack: () => void;
}

export const AdminAnalytics: React.FC<AdminAnalyticsProps> = ({ onBack }) => {
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [practices, setPractices] = useState<PracticeSession[]>([]);

  useEffect(() => {
    setAssessments(JSON.parse(localStorage.getItem('assessments') || '[]'));
    setPractices(JSON.parse(localStorage.getItem('practice_sessions') || '[]'));
  }, []);

  const highRisk = assessments.filter(a => a.overallStatus === 'Further support recommended').length;
  const modRisk = assessments.filter(a => a.overallStatus === 'Moderate indicators').length;
  const lowRisk = assessments.filter(a => a.overallStatus === 'No significant indicators').length;
  const total = assessments.length || 1; // Prevent div by zero

  const needsReading = assessments.filter(a => a.categories.reading === 'Needs attention').length;
  const needsWord = assessments.filter(a => a.categories.wordRecognition === 'Needs attention').length;
  const needsComp = assessments.filter(a => a.categories.comprehension === 'Needs attention').length;
  const needsProc = assessments.filter(a => a.categories.processingSpeed === 'Needs attention').length;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 w-full animate-in fade-in duration-300">
      <button
        onClick={onBack}
        className="inline-flex items-center space-x-2 text-xs font-semibold text-[#4F7396] hover:text-[#1A2E44] mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Admin Dashboard</span>
      </button>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-[#1A2E44] tracking-tight">System Analytics</h1>
          <p className="text-[#5A6D82] mt-1 text-sm">Visual deep dive into screening trends and institutional metrics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Risk Distribution */}
        <div className="glass-panel p-6 rounded-2xl bg-white/70 border border-white/80 shadow-sm flex flex-col relative overflow-hidden">
          <div className="flex items-center space-x-2 mb-6">
            <PieChart className="w-5 h-5 text-[#4F7396]" />
            <h3 className="text-sm font-semibold text-[#1A2E44]">Risk Distribution</h3>
          </div>
          
          <div className="flex flex-col space-y-4 flex-grow justify-center">
            <div className="flex items-center">
              <div className="w-24 text-xs text-[#5A6D82] font-medium">Further Support</div>
              <div className="flex-grow ml-4 bg-[#E8EDF2] rounded-full h-3 overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(highRisk / total) * 100}%` }}></div>
              </div>
              <div className="w-12 text-right text-xs font-semibold ml-2">{highRisk}</div>
            </div>
            
            <div className="flex items-center">
              <div className="w-24 text-xs text-[#5A6D82] font-medium">Moderate</div>
              <div className="flex-grow ml-4 bg-[#E8EDF2] rounded-full h-3 overflow-hidden">
                <div className="bg-blue-400 h-full rounded-full" style={{ width: `${(modRisk / total) * 100}%` }}></div>
              </div>
              <div className="w-12 text-right text-xs font-semibold ml-2">{modRisk}</div>
            </div>

            <div className="flex items-center">
              <div className="w-24 text-xs text-[#5A6D82] font-medium">No Indicators</div>
              <div className="flex-grow ml-4 bg-[#E8EDF2] rounded-full h-3 overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${(lowRisk / total) * 100}%` }}></div>
              </div>
              <div className="w-12 text-right text-xs font-semibold ml-2">{lowRisk}</div>
            </div>
          </div>
        </div>

        {/* Most Common Difficulty Areas */}
        <div className="glass-panel p-6 rounded-2xl bg-white/70 border border-white/80 shadow-sm flex flex-col relative overflow-hidden">
          <div className="flex items-center space-x-2 mb-6">
            <BarChart3 className="w-5 h-5 text-[#4F7396]" />
            <h3 className="text-sm font-semibold text-[#1A2E44]">Primary Areas Requiring Attention</h3>
          </div>
          
          <div className="flex items-end justify-between h-40 mt-auto pt-4 gap-2">
            {[
              { label: 'Reading', val: needsReading, max: total },
              { label: 'Words', val: needsWord, max: total },
              { label: 'Comp', val: needsComp, max: total },
              { label: 'Speed', val: needsProc, max: total },
            ].map((col, idx) => (
              <div key={idx} className="flex flex-col items-center w-1/4 group">
                <span className="text-xs font-bold text-[#1A2E44] mb-2 opacity-0 group-hover:opacity-100 transition-opacity">{col.val}</span>
                <div className="w-full bg-[#E8EDF2] rounded-t-md relative h-full flex items-end overflow-hidden">
                  <div className="w-full bg-[#4F7396] hover:bg-[#1A2E44] transition-colors rounded-t-md" style={{ height: `${col.max > 0 ? (col.val / col.max) * 100 : 0}%` }}></div>
                </div>
                <span className="text-[10px] text-[#5A6D82] mt-2 font-medium truncate w-full text-center">{col.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Practice Activity */}
        <div className="glass-panel p-6 rounded-2xl bg-white/70 border border-white/80 shadow-sm flex flex-col relative overflow-hidden">
          <div className="flex items-center space-x-2 mb-6">
            <Activity className="w-5 h-5 text-[#4F7396]" />
            <h3 className="text-sm font-semibold text-[#1A2E44]">Student Practice Engagement</h3>
          </div>
          <div className="flex items-center justify-center flex-grow flex-col">
            <div className="text-5xl font-bold text-[#1A2E44] mb-2">{practices.length}</div>
            <div className="text-xs text-[#5A6D82]">Total Practice Sessions Completed</div>
            <div className="mt-6 w-full grid grid-cols-2 gap-4 text-center">
              <div className="bg-[#F0F2F5] p-3 rounded-xl border border-[#E8EDF2]">
                <div className="text-lg font-semibold text-[#4F7396]">{practices.filter(p => p.type === 'reading' || p.type === 'word_recognition').length}</div>
                <div className="text-[10px] uppercase tracking-wider mt-1 text-[#7A8C9F]">Lexical</div>
              </div>
              <div className="bg-[#F0F2F5] p-3 rounded-xl border border-[#E8EDF2]">
                <div className="text-lg font-semibold text-[#4F7396]">{practices.filter(p => p.type === 'comprehension' || p.type === 'processing').length}</div>
                <div className="text-[10px] uppercase tracking-wider mt-1 text-[#7A8C9F]">Cognitive</div>
              </div>
            </div>
          </div>
        </div>

        {/* Screenings Over Time */}
        <div className="glass-panel p-6 rounded-2xl bg-white/70 border border-white/80 shadow-sm flex flex-col relative overflow-hidden">
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="w-5 h-5 text-[#4F7396]" />
            <h3 className="text-sm font-semibold text-[#1A2E44]">Overall System Usage</h3>
          </div>
          <div className="flex items-center justify-center flex-grow flex-col">
             <div className="text-5xl font-bold text-[#1A2E44] mb-2">{assessments.length}</div>
             <div className="text-xs text-[#5A6D82]">Total Screenings Conducted</div>
             <div className="mt-4 text-[10px] text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full font-medium flex items-center space-x-1 border border-emerald-100">
               <TrendingUp className="w-3 h-3" />
               <span>Active system deployment</span>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};
