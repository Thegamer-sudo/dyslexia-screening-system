import React, { useState } from 'react';
import { Users, AlertCircle, CheckCircle, Search, Settings, ArrowUpDown, Download, Filter, HelpCircle, TrendingUp } from 'lucide-react';
import { AssessmentRecord } from '../types';

interface AdminDashboardProps {
  onViewStudentReport: (email: string) => void;
  onViewProfile: () => void;
  onViewAnalytics: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onViewStudentReport, onViewProfile, onViewAnalytics }) => {
  const [sortAscending, setSortAscending] = useState(false); // false = high risk first, true = low risk first
  const [filterMode, setFilterMode] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Handle Export Report (PDF Generation)
  const handleExportReport = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      let yPos = 20;

      // Title
      pdf.setFontSize(22);
      pdf.setTextColor(26, 46, 68);
      pdf.text('System Overview', 20, yPos);
      yPos += 15;

      // Summary Stats
      pdf.setFontSize(14);
      pdf.text('Summary Statistics', 20, yPos);
      yPos += 10;
      
      pdf.setFontSize(11);
      pdf.setTextColor(90, 109, 130);
      pdf.text(`Total Users / Students: ${mappedStudents.length}`, 20, yPos);
      yPos += 7;
      pdf.text(`Total Screenings: ${savedAssessments.length}`, 20, yPos);
      yPos += 7;
      pdf.text(`High Risk: ${needsAttentionCount}`, 20, yPos);
      yPos += 7;
      pdf.text(`Moderate Risk: ${moderateCount}`, 20, yPos);
      yPos += 7;
      pdf.text(`Low Risk: ${lowRiskCount}`, 20, yPos);
      yPos += 15;

      // Table Header
      pdf.setFontSize(14);
      pdf.setTextColor(26, 46, 68);
      pdf.text('Student Screening Overview', 20, yPos);
      yPos += 10;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Student Name', 20, yPos);
      pdf.text('Student No.', 70, yPos);
      pdf.text('Screening Date', 110, yPos);
      pdf.text('Overall Result', 150, yPos);
      yPos += 5;
      
      pdf.setLineWidth(0.5);
      pdf.line(20, yPos, 190, yPos);
      yPos += 7;

      // Table Rows
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(40, 40, 40);
      
      sortedStudents.forEach(student => {
        if (yPos > 270) {
          pdf.addPage();
          yPos = 20;
        }
        
        pdf.text(student.name.substring(0, 20), 20, yPos);
        pdf.text(student.studentNo, 70, yPos);
        pdf.text(student.date || 'N/A', 110, yPos);
        pdf.text(student.score, 150, yPos);
        yPos += 8;
      });

      pdf.save('Dyslexia_Screening_System_Overview.pdf');
    } catch (err) {
      console.error(err);
      window.print();
    }
  };

  // Read actual registered users from local database
  const savedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
  const savedAssessments = JSON.parse(localStorage.getItem('assessments') || '[]');
  
  // Map actual registered users to display data
  const mappedStudents = savedUsers.map((u: any, index: number) => {
    const userAssessments = savedAssessments.filter((a: any) => a.email === u.email);
    const latest = userAssessments.length > 0 ? userAssessments[userAssessments.length - 1] : null;

    let riskLevel = 3; // pending
    let status = 'pending';
    if (latest) {
      if (latest.overallStatus === 'Further support recommended') {
        riskLevel = 0; status = 'needs_attention';
      } else if (latest.overallStatus === 'Moderate indicators') {
        riskLevel = 1; status = 'moderate';
      } else {
        riskLevel = 2; status = 'good';
      }
    }

    return {
      id: index,
      email: u.email,
      name: `${u.firstName} ${u.lastName}`,
      studentNo: u.studentNumber,
      date: latest ? latest.date : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status,
      score: latest ? latest.overallStatus : 'Awaiting Assessment',
      riskLevel,
      latestRecord: latest
    };
  });

  const filteredStudents = mappedStudents.filter((s: any) => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.studentNo.includes(searchQuery)
  );

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    return sortAscending ? b.riskLevel - a.riskLevel : a.riskLevel - b.riskLevel;
  });

  const total = mappedStudents.length;
  const needsAttentionCount = mappedStudents.filter((s: any) => s.status === 'needs_attention').length;
  const moderateCount = mappedStudents.filter((s: any) => s.status === 'moderate').length;
  const lowRiskCount = mappedStudents.filter((s: any) => s.status === 'good').length;

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-8 animate-in fade-in duration-500" id="admin-dashboard-content">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-[#1A2E44] tracking-tight">Admin Overview</h1>
          <p className="text-[#5A6D82] mt-1 text-sm">Monitor student screening results and identify areas needing support.</p>
        </div>
        
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0 hidden md:block">
            <Search className="w-4 h-4 text-[#7A8C9F] absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Search students..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 pl-9 pr-4 py-2 bg-white rounded-full border border-[#D1D9E6] text-sm focus:outline-hidden focus:border-[#4F7396] shadow-2xs"
            />
          </div>
          <button 
            onClick={onViewAnalytics}
            className="flex items-center space-x-2 px-4 py-2 bg-white rounded-full border border-[#D1D9E6] text-[#4F7396] hover:text-[#1A2E44] shadow-2xs cursor-pointer text-sm font-medium"
          >
            <TrendingUp className="w-4 h-4" />
            <span className="hidden sm:inline">Visual Analytics</span>
          </button>
          <button 
            onClick={handleExportReport}
            className="flex items-center space-x-2 px-4 py-2 bg-white rounded-full border border-[#D1D9E6] text-[#4F7396] hover:text-[#1A2E44] shadow-2xs cursor-pointer text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export Report</span>
          </button>
          <button 
            onClick={onViewProfile}
            className="p-2 bg-white rounded-full border border-[#D1D9E6] text-[#4F7396] hover:text-[#1A2E44] shadow-2xs cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="glass-panel bg-white/80 rounded-2xl p-4 md:p-6 border border-[#E8EDF2] shadow-sm flex items-center space-x-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#E8EDF2] flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 md:w-6 md:h-6 text-[#4F7396]" />
          </div>
          <div>
            <p className="text-xs md:text-sm font-medium text-[#7A8C9F]">Total Screenings</p>
            <p className="text-xl md:text-2xl font-bold text-[#1A2E44]">{total}</p>
          </div>
        </div>
        <div className="glass-panel bg-white/80 rounded-2xl p-4 md:p-6 border border-[#E8EDF2] shadow-sm flex items-center space-x-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-red-50 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-red-500" />
          </div>
          <div>
            <p className="text-xs md:text-sm font-medium text-[#7A8C9F]">High Risk</p>
            <p className="text-xl md:text-2xl font-bold text-red-600">{needsAttentionCount}</p>
          </div>
        </div>
        <div className="glass-panel bg-white/80 rounded-2xl p-4 md:p-6 border border-[#E8EDF2] shadow-sm flex items-center space-x-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
            <HelpCircle className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />
          </div>
          <div>
            <p className="text-xs md:text-sm font-medium text-[#7A8C9F]">Moderate</p>
            <p className="text-xl md:text-2xl font-bold text-orange-600">{moderateCount}</p>
          </div>
        </div>
        <div className="glass-panel bg-white/80 rounded-2xl p-4 md:p-6 border border-[#E8EDF2] shadow-sm flex items-center space-x-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-500" />
          </div>
          <div>
            <p className="text-xs md:text-sm font-medium text-[#7A8C9F]">Low Risk</p>
            <p className="text-xl md:text-2xl font-bold text-green-600">{lowRiskCount}</p>
          </div>
        </div>
      </div>

      <div className="glass-panel bg-white/90 rounded-2xl border border-[#E8EDF2] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E8EDF2] bg-[#F8FAFC] flex justify-between items-center">
          <h2 className="text-lg font-semibold text-[#1A2E44]">Recent Screenings</h2>
          <button className="flex items-center space-x-1.5 text-xs font-medium text-[#4F7396] hover:text-[#1A2E44] bg-white px-3 py-1.5 rounded-full border border-[#D1D9E6] shadow-2xs">
            <Filter className="w-3 h-3" />
            <span>Filter: All</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs text-[#7A8C9F] uppercase tracking-wider border-b border-[#E8EDF2]">
                <th className="px-6 py-4 font-medium">Student Name</th>
                <th className="px-6 py-4 font-medium">Student No.</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th 
                  className="px-6 py-4 font-medium cursor-pointer hover:text-[#1A2E44] flex items-center space-x-1"
                  onClick={() => setSortAscending(!sortAscending)}
                >
                  <span>Result Overview</span>
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8EDF2]">
              {sortedStudents.map((student) => (
                <tr key={student.id} className="hover:bg-[#F8FAFC]/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-[#E8EDF2] flex items-center justify-center text-xs font-bold text-[#4F7396]">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-medium text-[#1A2E44]">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#5A6D82]">{student.studentNo}</td>
                  <td className="px-6 py-4 text-sm text-[#5A6D82]">{student.date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                      student.status === 'needs_attention' 
                        ? 'bg-red-50 text-red-700 border-red-200' 
                        : student.status === 'moderate'
                        ? 'bg-orange-50 text-orange-700 border-orange-200'
                        : student.status === 'good'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-[#F0F2F5] text-[#5A6D82] border-[#D1D9E6]'
                    }`}>
                      {student.score}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => onViewStudentReport(student.email)}
                      className="text-sm font-medium transition-colors border border-[#E8EDF2] px-3 py-1 rounded-full bg-white shadow-2xs text-[#4F7396] hover:text-[#1A2E44] hover:shadow-sm cursor-pointer">
                      View Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
