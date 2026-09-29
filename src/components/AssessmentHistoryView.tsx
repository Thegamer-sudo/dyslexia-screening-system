import React from 'react';
import { AssessmentRecord } from '../types';
import { ArrowLeft, FileText, CheckCircle, ShieldAlert } from 'lucide-react';
import { DUT_DISABILITY_UNIT_INFO } from '../data/assessmentData';

interface AssessmentHistoryViewProps {
  record: AssessmentRecord;
  onBack: () => void;
}

export const AssessmentHistoryView: React.FC<AssessmentHistoryViewProps> = ({ record, onBack }) => {

  const handleExportReport = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      const html2canvas = (await import('html2canvas')).default;
      
      const dashboardElement = document.getElementById('history-report-content');
      if (!dashboardElement) return;

      alert('Generating PDF report... Please wait a moment.');

      const canvas = await html2canvas(dashboardElement, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Screening_Report_${record.date.replace(/\//g, '-')}.pdf`);
    } catch (err) {
      console.error(err);
      alert('PDF generation requires html2canvas and jspdf. Alternatively, use Ctrl+P to print.');
      window.print();
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 w-full animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-[#4F7396] hover:text-[#1A2E44] transition-colors cursor-pointer"
          id="history-back-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
        
        <button
          onClick={handleExportReport}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-[#1A2E44] bg-white border border-[#D1D9E6] px-4 py-2 rounded-xl hover:bg-[#F0F2F5] transition-colors cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          <span>Export PDF</span>
        </button>
      </div>

      <div className="glass-panel p-8 sm:p-10 rounded-3xl bg-white/90 border border-white/90 shadow-md" id="history-report-content">
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#E8EDF2]">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#4F7396] uppercase">
              Screening Record • {record.date}
            </span>
            <h1 className="text-2xl sm:text-3xl font-semibold text-[#1A2E44] tracking-tight mt-1">
              Assessment Summary
            </h1>
          </div>
          <div className="px-3.5 py-1.5 rounded-full bg-[#1A2E44] text-white text-xs font-semibold">
            {record.overallStatus}
          </div>
        </div>

        <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A2E44] mb-4">
          Recorded Category Statuses
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-[#F0F2F5]/80 border border-[#E8EDF2]">
            <span className="text-xs text-[#7A8C9F]">Reading Speed</span>
            <div className="text-sm font-semibold text-[#1A2E44] mt-1">
              {record.categories.reading}
            </div>
            <p className="text-[11px] text-[#5A6D82] mt-1">
              Recorded time: {record.details.readingTimeSeconds}s
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F0F2F5]/80 border border-[#E8EDF2]">
            <span className="text-xs text-[#7A8C9F]">Word Recognition</span>
            <div className="text-sm font-semibold text-[#1A2E44] mt-1">
              {record.categories.wordRecognition}
            </div>
            <p className="text-[11px] text-[#5A6D82] mt-1">
              Accuracy: {record.details.wordRecognitionAccuracy}%
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F0F2F5]/80 border border-[#E8EDF2]">
            <span className="text-xs text-[#7A8C9F]">Reading Comprehension</span>
            <div className="text-sm font-semibold text-[#1A2E44] mt-1">
              {record.categories.comprehension}
            </div>
            <p className="text-[11px] text-[#5A6D82] mt-1">
              Score: {record.details.comprehensionScore}/2
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F0F2F5]/80 border border-[#E8EDF2]">
            <span className="text-xs text-[#7A8C9F]">Processing Speed</span>
            <div className="text-sm font-semibold text-[#1A2E44] mt-1">
              {record.categories.processingSpeed}
            </div>
            <p className="text-[11px] text-[#5A6D82] mt-1">
              Avg latency: {record.details.averageProcessingTimeMs}ms
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#D1D9E6] text-xs text-[#5A6D82] dyslexia-ready mb-6">
          <ShieldAlert className="w-4 h-4 text-[#4F7396] inline mr-1.5" />
          Educational screening record saved for university learning support. Not a clinical medical diagnosis.
        </div>
      </div>
    </div>
  );
};
