export interface AccessibilitySettings {
  fontSize: 'standard' | 'large' | 'xlarge';
  letterSpacing: 'standard' | 'wide';
  lineSpacing: 'standard' | 'wide';
  contrast: 'standard' | 'high';
  fontFamily: 'standard' | 'dyslexic' | 'comic_sans' | 'arial';
}

export type ViewMode = 
  | 'home' 
  | 'login'
  | 'register'
  | 'dashboard' 
  | 'assessment_intro' 
  | 'accessibility_setup' 
  | 'accessibility_setup_standalone'
  | 'assessment_flow'
  | 'history_detail'
  | 'profile'
  | 'admin_dashboard'
  | 'admin_analytics'
  | 'admin_student_report'
  | 'practice_flow';

export type AssessmentSection = 
  | 'questionnaire' 
  | 'word_recognition' 
  | 'reading' 
  | 'comprehension' 
  | 'timed_task' 
  | 'review' 
  | 'processing' 
  | 'results';

export interface UserProfile {
  firstName: string;
  lastName: string;
  studentNumber: string;
  email: string;
  role?: 'admin' | 'student';
}

export interface UserAssessmentAnswers {
  questionnaire: Record<number, number>; // questionId -> rating (1-5)
  wordRecognition: Record<number, { answer: string; timeMs: number }>;
  readingTimeSeconds: number;
  comprehensionAnswers: Record<number, number>; // questionId -> selectedOptionIndex
  timedTrials: Record<number, { selected: string; timeMs: number; isCorrect: boolean }>;
}

export interface AssessmentRecord {
  id: string;
  date: string;
  email?: string;
  overallStatus: 'Further support recommended' | 'Moderate indicators' | 'No significant indicators';
  categories: {
    reading: 'Needs attention' | 'Moderate' | 'Good';
    wordRecognition: 'Needs attention' | 'Moderate' | 'Good';
    comprehension: 'Needs attention' | 'Moderate' | 'Good';
    processingSpeed: 'Needs attention' | 'Moderate' | 'Good';
  };
  details: {
    readingTimeSeconds: number;
    comprehensionScore: number;
    wordRecognitionAccuracy: number;
    averageProcessingTimeMs: number;
  };
}

export type PracticeType = 'reading' | 'word_recognition' | 'comprehension' | 'processing';

export interface PracticeSession {
  id: string;
  email: string;
  type: PracticeType;
  date: string;
  accuracy?: number;
  timeMs?: number;
  score?: number;
  maxScore?: number;
}