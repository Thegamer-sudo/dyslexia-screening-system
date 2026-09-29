import React, { useState } from 'react';
import { UserProfile, AccessibilitySettings } from '../types';
import { ArrowLeft, User, Mail, Hash, SlidersHorizontal, ShieldCheck, Edit2, Bug, Check, X } from 'lucide-react';

interface StudentProfileViewProps {
  user: UserProfile;
  settings: AccessibilitySettings;
  onOpenAccessibility: () => void;
  onBack: () => void;
}

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({
  user,
  settings,
  onOpenAccessibility,
  onBack,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);

  const handleSaveName = () => {
    // In a real app, this would make an API call. For prototype, update localStorage
    const savedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const updatedUsers = savedUsers.map((u: any) => {
      if (u.email === user.email) {
        return { ...u, firstName, lastName };
      }
      return u;
    });
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    
    // The name will visually update on next full reload or if we pushed to parent state.
    // For now we just exit edit mode and visually show it locally.
    user.firstName = firstName;
    user.lastName = lastName;
    setIsEditingName(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 w-full animate-in fade-in duration-300">
      <button
        onClick={onBack}
        className="inline-flex items-center space-x-2 text-xs font-semibold text-[#4F7396] hover:text-[#1A2E44] mb-6 transition-colors cursor-pointer"
        id="profile-back-btn"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </button>

      <div className="glass-panel p-8 sm:p-10 rounded-3xl bg-white/90 border border-white/90 shadow-md">
        <div className="flex items-center space-x-4 pb-6 mb-6 border-b border-[#E8EDF2] justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-full bg-[#1A2E44] text-white flex items-center justify-center text-xl font-semibold shrink-0">
              {user.firstName[0]}
              {user.lastName[0]}
            </div>
            <div>
              {isEditingName ? (
                <div className="flex space-x-2 mb-1">
                  <input 
                    value={firstName} 
                    onChange={e => setFirstName(e.target.value)}
                    className="w-24 sm:w-32 px-2 py-1 text-sm border border-[#D1D9E6] rounded-md focus:outline-hidden"
                  />
                  <input 
                    value={lastName} 
                    onChange={e => setLastName(e.target.value)}
                    className="w-24 sm:w-32 px-2 py-1 text-sm border border-[#D1D9E6] rounded-md focus:outline-hidden"
                  />
                  <button onClick={handleSaveName} className="p-1.5 bg-green-50 text-green-600 rounded-md hover:bg-green-100 cursor-pointer">
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-semibold text-[#1A2E44] tracking-tight">
                    {user.firstName} {user.lastName}
                  </h1>
                  <button onClick={() => setIsEditingName(true)} className="text-[#7A8C9F] hover:text-[#4F7396] cursor-pointer">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              )}
              <p className="text-xs text-[#5A6D82]">
                {user.role === 'admin' ? 'System Administrator' : 'Durban University of Technology Student'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="p-4 rounded-2xl bg-[#F0F2F5]/80 border border-[#E8EDF2] flex items-center justify-between text-xs">
            <span className="text-[#7A8C9F] flex items-center space-x-2">
              <Hash className="w-4 h-4 text-[#4F7396]" />
              <span>Student Number</span>
            </span>
            <span className="font-semibold text-[#1A2E44]">{user.studentNumber}</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#F0F2F5]/80 border border-[#E8EDF2] flex items-center justify-between text-xs">
            <span className="text-[#7A8C9F] flex items-center space-x-2">
              <Mail className="w-4 h-4 text-[#4F7396]" />
              <span>Email Address</span>
            </span>
            <span className="font-semibold text-[#1A2E44]">{user.email}</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#F0F2F5]/80 border border-[#E8EDF2] flex items-center justify-between text-xs">
            <span className="text-[#7A8C9F] flex items-center space-x-2">
              <SlidersHorizontal className="w-4 h-4 text-[#4F7396]" />
              <span>Active Accessibility Font</span>
            </span>
            <span className="font-semibold text-[#1A2E44]">
              {settings.fontFamily === 'dyslexic' ? 'Accessible OpenDyslexic' : 'Standard Sans'}
            </span>
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <button
            onClick={onOpenAccessibility}
            className="w-full py-3 bg-[#E8EDF2] text-[#1A2E44] text-xs font-semibold rounded-2xl hover:bg-[#D1D9E6] transition-all flex items-center justify-center space-x-2 cursor-pointer"
            id="profile-adjust-accessibility-btn"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#4F7396]" />
            <span>Adjust Reading Comfort Settings</span>
          </button>
          
          <button
            onClick={() => setShowFeedback(true)}
            className="w-full py-3 bg-white border border-[#E8EDF2] text-[#5A6D82] text-xs font-semibold rounded-2xl hover:bg-[#F8FAFC] transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Bug className="w-4 h-4 text-[#7A8C9F]" />
            <span>Send Feedback</span>
          </button>
        </div>
      </div>

      {showFeedback && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1A2E44]/40 backdrop-blur-sm animate-in fade-in duration-200 p-4 text-left">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-xl border border-[#E8EDF2] relative scale-in-center">
            <button 
              onClick={() => setShowFeedback(false)}
              className="absolute top-6 right-6 text-[#7A8C9F] hover:text-[#1A2E44] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-semibold text-[#1A2E44] mb-4">Send Feedback</h3>
            
            <p className="text-xs text-[#5A6D82] mb-6 leading-relaxed">
              For issues like spam or scams, you can get help from our <a href="#" className="text-[#4F7396] hover:underline" onClick={(e) => e.preventDefault()}>contact support</a> team or visit the <a href="#" className="text-[#4F7396] hover:underline" onClick={(e) => e.preventDefault()}>help center</a>.
            </p>

            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Describe the technical issue (e.g. system is too slow, or X, Y, Z button is not working)"
              className="w-full h-32 px-3.5 py-3 rounded-xl bg-[#F0F2F5]/80 border border-[#D1D9E6] text-sm text-[#1A2E44] focus:outline-hidden focus:border-[#4F7396] resize-none mb-6 placeholder:text-[#AAB7C6]"
            />

            <button 
              onClick={() => {
                alert("Feedback submitted successfully!");
                setShowFeedback(false);
                setFeedbackText('');
              }}
              className="w-full py-3 bg-[#1A2E44] text-white font-medium rounded-xl transition-colors cursor-pointer hover:bg-[#2D4561]"
            >
              Submit Feedback
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
