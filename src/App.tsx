/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AssessmentPreview } from './components/AssessmentPreview';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { StudentDashboard } from './components/StudentDashboard';
import { AssessmentIntro } from './components/AssessmentIntro';
import { AccessibilitySetup } from './components/AccessibilitySetup';
import { AssessmentFlow } from './components/AssessmentFlow';
import { AssessmentHistoryView } from './components/AssessmentHistoryView';
import { StudentProfileView } from './components/StudentProfileView';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminAnalytics } from './components/AdminAnalytics';
import { AdminStudentReport } from './components/AdminStudentReport';
import { PracticeFlow } from './components/PracticeFlow';
import { AccessibilitySettings, ViewMode, UserProfile, AssessmentRecord, PracticeSession, PracticeType } from './types';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);

  // Close accessibility toolbar when navigating
  useEffect(() => {
    setIsAccessibilityOpen(false);
  }, [viewMode]);
  const [user, setUser] = useState<UserProfile | null>(null);

  // Clean starting state for new users
  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentRecord[]>([]);
  const [practiceHistory, setPracticeHistory] = useState<PracticeSession[]>([]);

  const [selectedRecord, setSelectedRecord] = useState<AssessmentRecord | null>(null);
  const [selectedStudentEmail, setSelectedStudentEmail] = useState<string | null>(null);
  const [selectedPracticeType, setSelectedPracticeType] = useState<PracticeType>('reading');

  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: 'standard',
    letterSpacing: 'standard',
    lineSpacing: 'standard',
    contrast: 'standard',
    fontFamily: 'standard',
  });

  // Apply accessibility settings to body classlist
  useEffect(() => {
    const body = document.body;

    // Contrast
    if (settings.contrast === 'high') {
      body.classList.add('high-contrast');
    } else {
      body.classList.remove('high-contrast');
    }

    // Letter Spacing
    if (settings.letterSpacing === 'wide') {
      body.classList.add('wide-spacing');
    } else {
      body.classList.remove('wide-spacing');
    }

    // Line Spacing
    if (settings.lineSpacing === 'wide') {
      body.classList.add('wide-line-height');
    } else {
      body.classList.remove('wide-line-height');
    }

    // Font Family
    body.classList.remove('dyslexic-font', 'comic-font', 'arial-font');
    if (settings.fontFamily === 'dyslexic') {
      body.classList.add('dyslexic-font');
    } else if (settings.fontFamily === 'comic_sans') {
      body.classList.add('comic-font');
    } else if (settings.fontFamily === 'arial') {
      body.classList.add('arial-font');
    }

    // Font Size Scaling (rem scaling)
    const html = document.documentElement;
    if (settings.fontSize === 'large') {
      html.style.fontSize = '18px';
    } else if (settings.fontSize === 'xlarge') {
      html.style.fontSize = '22px';
    } else {
      html.style.fontSize = '16px';
    }

    // Save to user profile if logged in
    if (user) {
      localStorage.setItem('settings_' + user.email, JSON.stringify(settings));
    }
  }, [settings, user]);

  // Auth & Flow Handlers
  const handleLogin = (newUser: UserProfile) => {
    setUser(newUser);
    
    // Load user-specific accessibility settings
    const savedSettings = localStorage.getItem('settings_' + newUser.email);
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    } else {
      setSettings({
        fontSize: 'standard',
        letterSpacing: 'standard',
        lineSpacing: 'standard',
        contrast: 'standard',
        fontFamily: 'standard',
      });
    }

    // Load user assessments
    const savedAssessments = JSON.parse(localStorage.getItem('assessments') || '[]');
    const myAssessments = savedAssessments.filter((a: any) => a.email === newUser.email);
    // Sort by date descending assuming they are added chronologically
    setAssessmentHistory(myAssessments.reverse());

    // Load user practice sessions
    const savedPractices = JSON.parse(localStorage.getItem('practice_sessions') || '[]');
    const myPractices = savedPractices.filter((p: any) => p.email === newUser.email);
    setPracticeHistory(myPractices.reverse());

    if (newUser.role === 'admin') {
      setViewMode('admin_dashboard');
    } else {
      setViewMode('dashboard');
    }
  };

  const handleStartScreeningFromHome = () => {
    if (!user) {
      setViewMode('login');
      return;
    }
    setViewMode('assessment_intro');
  };

  const handleCompleteAssessment = (newRecord: AssessmentRecord) => {
    setAssessmentHistory((prev) => [newRecord, ...prev]);
    
    // Save to global local storage
    if (user) {
      const savedAssessments = JSON.parse(localStorage.getItem('assessments') || '[]');
      savedAssessments.push({ ...newRecord, email: user.email });
      localStorage.setItem('assessments', JSON.stringify(savedAssessments));
    }
  };

  const handleCompletePractice = (newSession: PracticeSession) => {
    setPracticeHistory((prev) => [newSession, ...prev]);
    
    if (user) {
      const savedPractices = JSON.parse(localStorage.getItem('practice_sessions') || '[]');
      savedPractices.push(newSession);
      localStorage.setItem('practice_sessions', JSON.stringify(savedPractices));
    }
  };

  const getAccessibilityClasses = () => {
    const classes = ['min-h-screen', 'flex', 'flex-col', 'justify-between', 'relative', 'overflow-hidden', 'select-none', 'transition-all'];

    if (settings.letterSpacing === 'wide') classes.push('tracking-widest');
    if (settings.lineSpacing === 'wide') classes.push('leading-loose');
    
    return classes.join(' ');
  };

  const getAccessibilityStyles = () => {
    const styles: React.CSSProperties = {};
    if (settings.fontFamily === 'dyslexic') styles.fontFamily = "'OpenDyslexic', 'Comic Sans MS', sans-serif";
    else if (settings.fontFamily === 'comic_sans') styles.fontFamily = "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', sans-serif";
    else if (settings.fontFamily === 'arial') styles.fontFamily = "Arial, Helvetica, sans-serif";

    if (settings.contrast === 'high') {
      styles.filter = 'contrast(1.25) saturate(1.2)';
    }
    
    return styles;
  };

  return (
    <div className={getAccessibilityClasses()} style={getAccessibilityStyles()}>
      {/* Background flowing atmospheric blobs */}
      <div className="bg-blob accent-glow -top-40 -left-40"></div>
      <div
        className="bg-blob accent-glow bottom-0 -right-40"
        style={{ animationDelay: '-5s', opacity: 0.18 }}
      ></div>

      {/* Main Content Wrap */}
      <div className="flex-grow flex flex-col">
        <Header
          user={user}
          viewMode={viewMode}
          onNavigateHome={() => setViewMode('home')}
          onNavigateDashboard={() => setViewMode(user?.role === 'admin' ? 'admin_dashboard' : 'dashboard')}
          onOpenAuth={(mode) => setViewMode(mode)}
          onSignOut={() => {
            setUser(null);
            setSettings({
              fontSize: 'standard',
              letterSpacing: 'standard',
              lineSpacing: 'standard',
              contrast: 'standard',
              fontFamily: 'standard',
            });
            setViewMode('home');
          }}
        />

        {/* VIEW 0: AUTHENTICATION PAGE */}
        {(viewMode === 'login' || viewMode === 'register') && (
          <AuthModal
            initialMode={viewMode === 'login' ? 'login' : 'register'}
            onLogin={handleLogin}
            onClose={() => setViewMode('home')}
          />
        )}

        {/* VIEW 1: HOME LANDING PAGE */}
        {viewMode === 'home' && (
          <main className="flex-grow flex flex-col items-center justify-center my-auto">
            <Hero onRegister={() => setViewMode('register')} />
          </main>
        )}

        {/* VIEW 2: STUDENT DASHBOARD */}
        {viewMode === 'dashboard' && user && user.role !== 'admin' && (
          <main className="flex-grow flex flex-col items-center justify-start my-auto">
            <StudentDashboard
              user={user}
              history={assessmentHistory}
              practiceHistory={practiceHistory}
              onStartAssessment={() => setViewMode('assessment_intro')}
              onStartPractice={(type) => {
                setSelectedPracticeType(type);
                setViewMode('practice_flow');
              }}
              onViewHistoryRecord={(rec) => {
                setSelectedRecord(rec);
                setViewMode('history_detail');
              }}
              onViewProfile={() => setViewMode('profile')}
            />
          </main>
        )}

        {/* VIEW 2b: ADMIN DASHBOARD */}
        {viewMode === 'admin_dashboard' && user && user.role === 'admin' && (
          <main className="flex-grow flex flex-col items-center justify-start my-auto">
            <AdminDashboard 
              onViewStudentReport={(email) => {
                setSelectedStudentEmail(email);
                setViewMode('admin_student_report');
              }}
              onViewProfile={() => setViewMode('profile')}
              onViewAnalytics={() => setViewMode('admin_analytics')}
            />
          </main>
        )}

        {/* VIEW 2c: ADMIN ANALYTICS */}
        {viewMode === 'admin_analytics' && user && user.role === 'admin' && (
          <main className="flex-grow flex flex-col items-center justify-start my-auto">
            <AdminAnalytics onBack={() => setViewMode('admin_dashboard')} />
          </main>
        )}

        {/* VIEW 2d: ADMIN INDIVIDUAL STUDENT REPORT */}
        {viewMode === 'admin_student_report' && user && user.role === 'admin' && selectedStudentEmail && (
          <main className="flex-grow flex flex-col items-center justify-start my-auto">
            <AdminStudentReport 
              email={selectedStudentEmail} 
              onBack={() => setViewMode('admin_dashboard')} 
            />
          </main>
        )}

        {/* VIEW 3: ASSESSMENT INTRODUCTION */}
        {viewMode === 'assessment_intro' && (
          <main className="flex-grow flex flex-col items-center justify-center my-auto">
            <AssessmentIntro
              onContinue={() => setViewMode('accessibility_setup')}
              onBack={() => setViewMode(user ? 'dashboard' : 'home')}
            />
          </main>
        )}

        {/* VIEW 4: ACCESSIBILITY SETUP */}
        {viewMode === 'accessibility_setup' && (
          <main className="flex-grow flex flex-col items-center justify-center my-auto">
            <AccessibilitySetup
              settings={settings}
              onChange={setSettings}
              onContinue={() => setViewMode('assessment_flow')}
              onBack={() => setViewMode('assessment_intro')}
            />
          </main>
        )}

        {/* VIEW 4b: ACCESSIBILITY SETUP STANDALONE */}
        {viewMode === 'accessibility_setup_standalone' && (
          <main className="flex-grow flex flex-col items-center justify-center my-auto">
            <AccessibilitySetup
              settings={settings}
              onChange={setSettings}
              onContinue={() => setViewMode('profile')}
              onBack={() => setViewMode('profile')}
              isStandalone={true}
            />
          </main>
        )}

        {/* VIEW 5: CONTINUOUS ASSESSMENT FLOW */}
        {viewMode === 'assessment_flow' && (
          <main className="flex-grow flex flex-col items-center justify-start my-auto">
            <AssessmentFlow
              onCompleteAssessment={handleCompleteAssessment}
              onExitToDashboard={() => setViewMode('dashboard')}
            />
          </main>
        )}

        {/* VIEW 6: HISTORY RECORD DETAIL */}
        {viewMode === 'history_detail' && selectedRecord && (
          <main className="flex-grow flex flex-col items-center justify-center my-auto">
            <AssessmentHistoryView
              record={selectedRecord}
              onBack={() => setViewMode(user?.role === 'admin' ? 'admin_dashboard' : 'dashboard')}
            />
          </main>
        )}

        {/* VIEW 7: STUDENT PROFILE */}
        {viewMode === 'profile' && user && (
          <main className="flex-grow flex flex-col items-center justify-center my-auto">
            <StudentProfileView
              user={user}
              settings={settings}
              onOpenAccessibility={() => setViewMode('accessibility_setup_standalone')}
              onBack={() => setViewMode('dashboard')}
            />
          </main>
        )}

        {/* VIEW 8: PRACTICE FLOW */}
        {viewMode === 'practice_flow' && user && (
          <main className="flex-grow flex flex-col items-center justify-start my-auto">
            <PracticeFlow
              type={selectedPracticeType}
              userEmail={user.email}
              onComplete={handleCompletePractice}
              onExit={() => setViewMode('dashboard')}
            />
          </main>
        )}
      </div>

      <Footer />
    </div>
  );
}
