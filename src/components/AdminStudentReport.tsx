import React, { useState, useEffect } from 'react';
import { AssessmentRecord, PracticeSession, UserProfile } from '../types';
import { ArrowLeft, FileText, User, Activity, Clock, ShieldAlert, CheckCircle, Brain, Target, TrendingUp } from 'lucide-react';

interface AdminStudentReportProps {
  email: string;
  onBack: () => void;
}

export const AdminStudentReport: React.FC<AdminStudentReportProps> = ({ email, onBack }) => {
  const [student, setStudent] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<AssessmentRecord[]>([]);
  const [practices, setPractices] = useState<PracticeSession[]>([]);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const user = users.find((u: any) => u.email === email);
    setStudent(user || null);

    const allAssessments = JSON.parse(localStorage.getItem('assessments') || '[]');
    setHistory(allAssessments.filter((a: any) => a.email === email).reverse());

    const allPractices = JSON.parse(localStorage.getItem('practice_sessions') || '[]');
    setPractices(allPractices.filter((p: any) => p.email === email).reverse());
  }, [email]);

  const handleExportReport = async () => {
    if (!student || history.length === 0) return;
    try {
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF('p', 'mm', 'a4');
      let yPos = 20;
      const latest = history[0];

      pdf.setFontSize(22);
      pdf.setTextColor(26, 46, 68);
      pdf.text('Student Screening Report', 20, yPos);
      yPos += 15;

      pdf.setFontSize(14);
      pdf.text('Student Information', 20, yPos);
      yPos += 10;
      
      pdf.setFontSize(11);
      pdf.setTextColor(90, 109, 130);
      pdf.text(`Name: ${student.firstName} ${student.lastName}`, 20, yPos); yPos += 7;
      pdf.text(`Student Number: ${student.studentNumber}`, 20, yPos); yPos += 7;
      pdf.text(`Email: ${student.email}`, 20, yPos); yPos += 7;
      pdf.text(`Screening Date: ${latest.date}`, 20, yPos); yPos += 15;

      pdf.setFontSize(14);
      pdf.setTextColor(26, 46, 68);
      pdf.text('Screening Overview', 20, yPos);
      yPos += 10;
      pdf.setFontSize(11);
      pdf.setTextColor(90, 109, 130);
      pdf.text(`Overall Result: ${latest.overallStatus}`, 20, yPos); yPos += 15;

      pdf.setFontSize(14);
      pdf.setTextColor(26, 46, 68);
      pdf.text('Performance Breakdown (Latest Screening)', 20, yPos);
      yPos += 10;
      pdf.setFontSize(11);
      pdf.setTextColor(90, 109, 130);
      pdf.text(`Reading Passage: ${latest.categories.reading} (${latest.details.readingTimeSeconds}s)`, 20, yPos); yPos += 7;
      pdf.text(`Word Recognition: ${latest.categories.wordRecognition} (${Math.round(latest.details.wordRecognitionAccuracy)}%)`, 20, yPos); yPos += 7;
      pdf.text(`Comprehension: ${latest.categories.comprehension} (Score: ${latest.details.comprehensionScore})`, 20, yPos); yPos += 7;
      pdf.text(`Processing Speed: ${latest.categories.processingSpeed} (${latest.details.averageProcessingTimeMs}ms)`, 20, yPos); yPos += 15;

      if (practices.length > 0) {
        pdf.setFontSize(14);
        pdf.setTextColor(26, 46, 68);
        pdf.text('Student Practice Analytics', 20, yPos);
        yPos += 10;
        pdf.setFontSize(11);
        pdf.setTextColor(90, 109, 130);
        pdf.text(`Total Practice Sessions: ${practices.length}`, 20, yPos); yPos += 7;
      }

      pdf.save(`Student_Report_${student.studentNumber}.pdf`);
    } catch (err) {
      console.error(err);
      window.print();
    }
  };

  if (!student) return <div>Loading...</div>;

  const latestRecord = history.length > 0 ? history[0] : null;
  const previousRecord = history.length > 1 ? history[1] : null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 w-full animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-[#4F7396] hover:text-[#1A2E44] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
        
        <button
          onClick={handleExportReport}
          disabled={!latestRecord}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-white bg-[#1A2E44] px-4 py-2 rounded-xl hover:bg-[#2D4561] transition-colors cursor-pointer disabled:opacity-50"
        >
          <FileText className="w-4 h-4" />
          <span>Export Student Report</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Student Info */}
        <div className="md:col-span-1 glass-panel p-6 rounded-2xl bg-white/90 shadow-sm border border-white">
          <div className="w-16 h-16 rounded-full bg-[#E8EDF2] flex items-center justify-center text-xl font-bold text-[#4F7396] mb-4">
            {student.firstName[0]}{student.lastName[0]}
          </div>
          <h2 className="text-xl font-semibold text-[#1A2E44]">{student.firstName} {student.lastName}</h2>
          <p className="text-sm text-[#5A6D82] mt-1">{student.studentNumber}</p>
          <p className="text-xs text-[#7A8C9F] mt-1">{student.email}</p>
          
          <div className="mt-6 pt-6 border-t border-[#E8EDF2]">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#7A8C9F] mb-3">Overall Activity</div>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#5A6D82]">Screenings</span>
                <span className="font-semibold text-[#1A2E44]">{history.length}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#5A6D82]">Practice Sessions</span>
                <span className="font-semibold text-[#1A2E44]">{practices.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Screening Overview & Breakdown */}
        <div className="md:col-span-2 space-y-6">
          {latestRecord ? (
            <>
              <div className="glass-panel p-6 rounded-2xl bg-white/90 shadow-sm border border-white">
                <h3 className="text-sm font-semibold text-[#1A2E44] mb-4 flex items-center space-x-2">
                  <Target className="w-4 h-4 text-[#4F7396]" />
                  <span>Latest Screening Overview ({latestRecord.date})</span>
                </h3>
                <div className={`p-4 rounded-xl border mb-6 ${
                  latestRecord.overallStatus === 'Further support recommended' ? 'bg-red-50 border-red-200 text-red-800' :
                  latestRecord.overallStatus === 'Moderate indicators' ? 'bg-orange-50 border-orange-200 text-orange-800' :
                  'bg-emerald-50 border-emerald-200 text-emerald-800'
                }`}>
                  <div className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1">Overall Result</div>
                  <div className="text-lg font-semibold">{latestRecord.overallStatus}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E8EDF2]">
                    <div className="text-xs text-[#7A8C9F] mb-1">Reading Passage</div>
                    <div className="font-semibold text-[#1A2E44]">{latestRecord.categories.reading}</div>
                    <div className="text-[10px] text-[#5A6D82] mt-1">Time: {latestRecord.details.readingTimeSeconds}s</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E8EDF2]">
                    <div className="text-xs text-[#7A8C9F] mb-1">Word Recognition</div>
                    <div className="font-semibold text-[#1A2E44]">{latestRecord.categories.wordRecognition}</div>
                    <div className="text-[10px] text-[#5A6D82] mt-1">Accuracy: {Math.round(latestRecord.details.wordRecognitionAccuracy)}%</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E8EDF2]">
                    <div className="text-xs text-[#7A8C9F] mb-1">Comprehension</div>
                    <div className="font-semibold text-[#1A2E44]">{latestRecord.categories.comprehension}</div>
                    <div className="text-[10px] text-[#5A6D82] mt-1">Score: {latestRecord.details.comprehensionScore} pts</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E8EDF2]">
                    <div className="text-xs text-[#7A8C9F] mb-1">Processing Speed</div>
                    <div className="font-semibold text-[#1A2E44]">{latestRecord.categories.processingSpeed}</div>
                    <div className="text-[10px] text-[#5A6D82] mt-1">Avg Time: {latestRecord.details.averageProcessingTimeMs}ms</div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="glass-panel p-6 rounded-2xl bg-white/90 shadow-sm border border-white flex flex-col items-center justify-center text-center h-full min-h-64">
              <ShieldAlert className="w-8 h-8 text-[#AAB7C6] mb-3" />
              <p className="text-sm font-medium text-[#5A6D82]">No screening history available for this student.</p>
            </div>
          )}
        </div>
      </div>

      {/* Performance Comparison (If multiple screenings exist) */}
      {previousRecord && latestRecord && (
        <div className="glass-panel p-6 rounded-2xl bg-white/90 shadow-sm border border-white mb-8">
          <h3 className="text-sm font-semibold text-[#1A2E44] mb-1 flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-[#4F7396]" />
            <span>Assessment Performance Over Time</span>
          </h3>
          <p className="text-xs text-[#7A8C9F] mb-6">Change Since Previous Screening ({previousRecord.date} → {latestRecord.date})</p>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 items-center p-4 rounded-xl bg-[#F8FAFC] border border-[#E8EDF2]">
              <div className="text-sm font-semibold text-[#1A2E44]">Reading Time</div>
              <div className="text-xs text-[#5A6D82] text-center bg-white py-2 rounded-lg border border-[#D1D9E6]">Prev: {previousRecord.details.readingTimeSeconds}s</div>
              <div className="text-xs font-semibold text-[#1A2E44] text-center bg-[#E8EDF2] py-2 rounded-lg border border-[#D1D9E6]">Curr: {latestRecord.details.readingTimeSeconds}s</div>
            </div>
            <div className="grid grid-cols-3 gap-4 items-center p-4 rounded-xl bg-[#F8FAFC] border border-[#E8EDF2]">
              <div className="text-sm font-semibold text-[#1A2E44]">Word Accuracy</div>
              <div className="text-xs text-[#5A6D82] text-center bg-white py-2 rounded-lg border border-[#D1D9E6]">Prev: {Math.round(previousRecord.details.wordRecognitionAccuracy)}%</div>
              <div className="text-xs font-semibold text-[#1A2E44] text-center bg-[#E8EDF2] py-2 rounded-lg border border-[#D1D9E6]">Curr: {Math.round(latestRecord.details.wordRecognitionAccuracy)}%</div>
            </div>
            <div className="grid grid-cols-3 gap-4 items-center p-4 rounded-xl bg-[#F8FAFC] border border-[#E8EDF2]">
              <div className="text-sm font-semibold text-[#1A2E44]">Processing Speed</div>
              <div className="text-xs text-[#5A6D82] text-center bg-white py-2 rounded-lg border border-[#D1D9E6]">Prev: {previousRecord.details.averageProcessingTimeMs}ms</div>
              <div className="text-xs font-semibold text-[#1A2E44] text-center bg-[#E8EDF2] py-2 rounded-lg border border-[#D1D9E6]">Curr: {latestRecord.details.averageProcessingTimeMs}ms</div>
            </div>
          </div>
        </div>
      )}

      {/* Practice Analytics */}
      <div className="glass-panel p-6 rounded-2xl bg-white/90 shadow-sm border border-white">
        <h3 className="text-sm font-semibold text-[#1A2E44] mb-4 flex items-center space-x-2">
          <Brain className="w-4 h-4 text-[#4F7396]" />
          <span>Student Practice Analytics</span>
        </h3>
        
        {practices.length === 0 ? (
          <div className="py-8 text-center text-sm text-[#7A8C9F] bg-[#F8FAFC] rounded-xl border border-dashed border-[#D1D9E6]">
            No practice sessions recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] text-[#7A8C9F] uppercase tracking-wider border-b border-[#E8EDF2]">
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Activity</th>
                  <th className="pb-3 font-medium">Accuracy</th>
                  <th className="pb-3 font-medium">Time Taken</th>
                  <th className="pb-3 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8EDF2]">
                {practices.map((prac) => (
                  <tr key={prac.id} className="text-xs text-[#1A2E44]">
                    <td className="py-3">{prac.date}</td>
                    <td className="py-3 capitalize font-medium">{prac.type.replace('_', ' ')}</td>
                    <td className="py-3">{prac.accuracy !== undefined ? `${Math.round(prac.accuracy)}%` : '-'}</td>
                    <td className="py-3">{prac.timeMs !== undefined && prac.timeMs > 0 ? `${Math.round(prac.timeMs / 1000)}s` : '-'}</td>
                    <td className="py-3 text-right">
                      <span className="inline-flex items-center text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-medium text-[10px]">
                        Completed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
