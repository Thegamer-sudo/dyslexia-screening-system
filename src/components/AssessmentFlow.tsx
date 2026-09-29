import React, { useState, useEffect } from 'react';
import {
  QUESTIONNAIRE_ITEMS,
  WORD_RECOGNITION_ITEMS,
  READING_PASSAGE,
  TIMED_TRIAL_ITEMS,
  DUT_DISABILITY_UNIT_INFO
} from '../data/assessmentData';
import { UserAssessmentAnswers, AssessmentSection, AssessmentRecord } from '../types';
import {
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Clock,
  BookOpen,
  HelpCircle,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  ExternalLink,
  Award,
  Layers,
  Sparkles
} from 'lucide-react';

interface AssessmentFlowProps {
  onCompleteAssessment: (record: AssessmentRecord) => void;
  onExitToDashboard: () => void;
}

export const AssessmentFlow: React.FC<AssessmentFlowProps> = ({
  onCompleteAssessment,
  onExitToDashboard,
}) => {
  const [currentSection, setCurrentSection] = useState<AssessmentSection>('questionnaire');

  // Questionnaire state
  const [questionnaireIndex, setQuestionnaireIndex] = useState(0);
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<Record<number, number>>({});

  // Word Recognition state
  const [wordIndex, setWordIndex] = useState(0);
  const [wordStartTime, setWordStartTime] = useState<number>(Date.now());
  const [wordAnswers, setWordAnswers] = useState<Record<number, { answer: string; timeMs: number }>>({});

  // Reading state
  const [readingSeconds, setReadingSeconds] = useState(0);
  const [isReadingActive, setIsReadingActive] = useState(true);

  // Comprehension state
  const [comprehensionAnswers, setComprehensionAnswers] = useState<Record<number, number>>({});

  // Timed Processing state
  const [timedTrialIndex, setTimedTrialIndex] = useState(0);
  const [timedTrialStartTime, setTimedTrialStartTime] = useState<number>(Date.now());
  const [timedTrialResults, setTimedTrialResults] = useState<
    Record<number, { selected: string; timeMs: number; isCorrect: boolean }>
  >({});

  // Review & Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentRecord | null>(null);

  // Timer for reading section
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (currentSection === 'reading' && isReadingActive) {
      interval = setInterval(() => {
        setReadingSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentSection, isReadingActive]);

  // Reset timer on word recognition step start
  useEffect(() => {
    if (currentSection === 'word_recognition') {
      setWordStartTime(Date.now());
    }
  }, [currentSection, wordIndex]);

  // Reset timer on timed trial step start
  useEffect(() => {
    if (currentSection === 'timed_task') {
      setTimedTrialStartTime(Date.now());
    }
  }, [currentSection, timedTrialIndex]);

  // Section progress mapping
  const sectionsList: { key: AssessmentSection; title: string; num: string }[] = [
    { key: 'questionnaire', title: 'Questionnaire', num: '01 / 05' },
    { key: 'word_recognition', title: 'Word Recognition', num: '02 / 05' },
    { key: 'reading', title: 'Reading Passage', num: '03 / 05' },
    { key: 'comprehension', title: 'Comprehension', num: '04 / 05' },
    { key: 'timed_task', title: 'Processing Speed', num: '05 / 05' },
  ];

  // Helper formatting for reading timer
  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handlers for Questionnaire
  const handleSelectQuestionnaireOption = (rating: number) => {
    const qId = QUESTIONNAIRE_ITEMS[questionnaireIndex].id;
    setQuestionnaireAnswers((prev) => ({ ...prev, [qId]: rating }));
  };

  const handleNextQuestionnaire = () => {
    if (questionnaireIndex < QUESTIONNAIRE_ITEMS.length - 1) {
      setQuestionnaireIndex((prev) => prev + 1);
    } else {
      setCurrentSection('word_recognition');
      setWordIndex(0);
      setWordStartTime(Date.now());
    }
  };

  const handlePrevQuestionnaire = () => {
    if (questionnaireIndex > 0) {
      setQuestionnaireIndex((prev) => prev - 1);
    }
  };

  // Handlers for Word Recognition
  const handleSelectWordOption = (option: string) => {
    const elapsed = Date.now() - wordStartTime;
    const currentItem = WORD_RECOGNITION_ITEMS[wordIndex];
    setWordAnswers((prev) => ({
      ...prev,
      [currentItem.id]: { answer: option, timeMs: elapsed },
    }));

    if (wordIndex < WORD_RECOGNITION_ITEMS.length - 1) {
      setWordIndex((prev) => prev + 1);
    } else {
      setCurrentSection('reading');
      setIsReadingActive(true);
    }
  };

  // Handlers for Reading
  const handleFinishReading = () => {
    setIsReadingActive(false);
    setCurrentSection('comprehension');
  };

  // Handlers for Comprehension
  const handleSelectComprehension = (qId: number, optionIdx: number) => {
    setComprehensionAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const handleNextComprehension = () => {
    setCurrentSection('timed_task');
    setTimedTrialIndex(0);
    setTimedTrialStartTime(Date.now());
  };

  // Handlers for Timed Processing Task
  const handleSelectTimedOption = (option: string) => {
    const elapsed = Date.now() - timedTrialStartTime;
    const currentItem = TIMED_TRIAL_ITEMS[timedTrialIndex];
    const isCorrect = option === currentItem.targetWord;

    setTimedTrialResults((prev) => ({
      ...prev,
      [currentItem.id]: { selected: option, timeMs: elapsed, isCorrect },
    }));

    if (timedTrialIndex < TIMED_TRIAL_ITEMS.length - 1) {
      setTimedTrialIndex((prev) => prev + 1);
    } else {
      setCurrentSection('review');
    }
  };

  // Submit assessment logic
  const handleSubmitAssessment = () => {
    setIsProcessing(true);
    setCurrentSection('processing');

    setTimeout(() => {
      setIsProcessing(false);
      setCurrentSection('results');

      // Compute scored output
      let totalCompScore = 0;
      READING_PASSAGE.questions.forEach((q) => {
        if (comprehensionAnswers[q.id] === q.correctIndex) {
          totalCompScore += 1;
        }
      });

      let wordCorrect = 0;
      let totalWordTime = 0;
      WORD_RECOGNITION_ITEMS.forEach((w) => {
        if (wordAnswers[w.id]) {
          totalWordTime += wordAnswers[w.id].timeMs;
          if (wordAnswers[w.id].answer === w.correctAnswer) {
            wordCorrect += 1;
          }
        }
      });
      const wordAccuracy = (wordCorrect / WORD_RECOGNITION_ITEMS.length) * 100;
      const avgWordTimeMs = WORD_RECOGNITION_ITEMS.length > 0 ? Math.round(totalWordTime / WORD_RECOGNITION_ITEMS.length) : 0;

      let totalTrialTime = 0;
      let trialCorrect = 0;
      Object.values(timedTrialResults).forEach((res: any) => {
        totalTrialTime += res.timeMs;
        if (res.isCorrect) trialCorrect += 1;
      });
      const avgTrialTimeMs =
        TIMED_TRIAL_ITEMS.length > 0
          ? Math.round(totalTrialTime / TIMED_TRIAL_ITEMS.length)
          : 0;
      const trialAccuracy = (trialCorrect / TIMED_TRIAL_ITEMS.length) * 100;

      let questionnaireTotal = 0;
      Object.values(questionnaireAnswers).forEach((val: any) => {
        questionnaireTotal += val; // Max 25 (5 questions * 5 rating)
      });

      // Determine statuses
      const questionnaireStatus: 'Needs attention' | 'Moderate' | 'Good' =
        questionnaireTotal >= 18 ? 'Needs attention' : questionnaireTotal >= 12 ? 'Moderate' : 'Good';

      const readingStatus: 'Needs attention' | 'Moderate' | 'Good' =
        readingSeconds > 35 ? 'Needs attention' : readingSeconds > 20 ? 'Moderate' : 'Good';

      const wordStatus: 'Needs attention' | 'Moderate' | 'Good' =
        wordAccuracy < 60 || avgWordTimeMs > 4000 ? 'Needs attention' : wordAccuracy < 80 || avgWordTimeMs > 2500 ? 'Moderate' : 'Good';

      const compStatus: 'Needs attention' | 'Moderate' | 'Good' =
        totalCompScore < 1 ? 'Needs attention' : totalCompScore === 1 ? 'Moderate' : 'Good';

      const processingStatus: 'Needs attention' | 'Moderate' | 'Good' =
        avgTrialTimeMs > 4500 || trialAccuracy < 50 ? 'Needs attention' : avgTrialTimeMs > 2800 || trialAccuracy < 75 ? 'Moderate' : 'Good';

      let overallStatus: 'Further support recommended' | 'Moderate indicators' | 'No significant indicators' =
        'No significant indicators';

      const needsAttentionCount = [questionnaireStatus, readingStatus, wordStatus, compStatus, processingStatus].filter(
        (s) => s === 'Needs attention'
      ).length;

      if (needsAttentionCount >= 2) {
        overallStatus = 'Further support recommended';
      } else if (needsAttentionCount === 1) {
        overallStatus = 'Moderate indicators';
      }

      const newRecord: AssessmentRecord = {
        id: `scr_${Date.now()}`,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        overallStatus,
        categories: {
          reading: readingStatus,
          wordRecognition: wordStatus,
          comprehension: compStatus,
          processingSpeed: processingStatus,
        },
        details: {
          readingTimeSeconds: readingSeconds,
          comprehensionScore: totalCompScore,
          wordRecognitionAccuracy: wordAccuracy,
          averageProcessingTimeMs: avgTrialTimeMs,
        },
      };

      setAssessmentResult(newRecord);
      onCompleteAssessment(newRecord);
    }, 2500);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 w-full animate-in fade-in duration-300">
      {/* Persistent Progress Indicator Header (Screens 07-12) */}
      {currentSection !== 'processing' && currentSection !== 'results' && (
        <div className="glass-panel p-5 rounded-2xl bg-white/80 border border-white mb-8">
          <div className="flex items-center justify-between text-xs mb-3">
            <span className="font-semibold text-[#1A2E44] uppercase tracking-wider">
              Educational Screening
            </span>
            <span className="font-mono text-[#4F7396] font-medium">
              {sectionsList.find((s) => s.key === currentSection)?.num || '05 / 05'}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {sectionsList.map((sec, idx) => {
              const isCurrent = sec.key === currentSection;
              const isPast =
                sectionsList.findIndex((s) => s.key === currentSection) > idx;

              return (
                <div key={sec.key} className="flex flex-col space-y-1">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      isCurrent
                        ? 'bg-[#1A2E44]'
                        : isPast
                        ? 'bg-[#4F7396]'
                        : 'bg-[#E8EDF2]'
                    }`}
                  ></div>
                  <span
                    className={`text-[10px] truncate ${
                      isCurrent
                        ? 'text-[#1A2E44] font-semibold'
                        : isPast
                        ? 'text-[#4F7396]'
                        : 'text-[#AAB7C6]'
                    }`}
                  >
                    {sec.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 1: QUESTIONNAIRE (Screen 08) */}
      {currentSection === 'questionnaire' && (
        <div className="glass-panel p-8 sm:p-10 rounded-3xl bg-white/90 border border-white/90 shadow-md">
          <div className="flex items-center justify-between text-xs text-[#7A8C9F] mb-6">
            <span>Section 1 • Self-Reported Questionnaire</span>
            <span>Question {questionnaireIndex + 1} of {QUESTIONNAIRE_ITEMS.length}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-semibold text-[#1A2E44] mb-8 leading-snug dyslexia-ready">
            {QUESTIONNAIRE_ITEMS[questionnaireIndex].question}
          </h2>

          <div className="space-y-3 mb-8">
            {[
              { label: 'Never', value: 1 },
              { label: 'Rarely', value: 2 },
              { label: 'Sometimes', value: 3 },
              { label: 'Often', value: 4 },
              { label: 'Very Often', value: 5 },
            ].map((opt) => {
              const currentQId = QUESTIONNAIRE_ITEMS[questionnaireIndex].id;
              const isSelected = questionnaireAnswers[currentQId] === opt.value;

              return (
                <button
                  key={opt.value}
                  onClick={() => handleSelectQuestionnaireOption(opt.value)}
                  className={`w-full p-4 rounded-xl text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-[#1A2E44] text-white shadow-xs'
                      : 'bg-[#F0F2F5]/80 text-[#1A2E44] hover:bg-[#E8EDF2] border border-[#D1D9E6]'
                  }`}
                >
                  <span>{opt.label}</span>
                  {isSelected && <CheckCircle className="w-4 h-4 text-[#D1D9E6]" />}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#E8EDF2]">
            <button
              onClick={handlePrevQuestionnaire}
              disabled={questionnaireIndex === 0}
              className={`flex items-center space-x-1.5 text-xs font-semibold px-4 py-2 rounded-xl transition-colors ${
                questionnaireIndex === 0
                  ? 'text-[#AAB7C6] cursor-not-allowed'
                  : 'text-[#5A6D82] hover:text-[#1A2E44] cursor-pointer'
              }`}
              id="q-back-btn"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous Question</span>
            </button>

            <button
              onClick={handleNextQuestionnaire}
              disabled={!questionnaireAnswers[QUESTIONNAIRE_ITEMS[questionnaireIndex].id]}
              className={`px-6 py-3 text-xs sm:text-sm font-semibold rounded-full transition-all flex items-center space-x-2 ${
                questionnaireAnswers[QUESTIONNAIRE_ITEMS[questionnaireIndex].id]
                  ? 'bg-[#1A2E44] text-white hover:bg-[#2D4561] cursor-pointer shadow-xs'
                  : 'bg-[#E8EDF2] text-[#AAB7C6] cursor-not-allowed'
              }`}
              id="q-next-btn"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* SECTION 2: WORD RECOGNITION (Screen 09) */}
      {currentSection === 'word_recognition' && (
        <div className="glass-panel p-8 sm:p-10 rounded-3xl bg-white/90 border border-white/90 shadow-md">
          <div className="flex items-center justify-between text-xs text-[#7A8C9F] mb-6">
            <span>Section 2 • Word Recognition Task</span>
            <span>Task {wordIndex + 1} of {WORD_RECOGNITION_ITEMS.length}</span>
          </div>

          <h2 className="text-lg font-semibold text-[#1A2E44] mb-2 leading-snug">
            Select the correctly spelled word.
          </h2>
          <p className="text-xs text-[#7A8C9F] mb-8 dyslexia-ready">
            Choose the correct spelling from the options below as quickly and accurately as possible.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {WORD_RECOGNITION_ITEMS[wordIndex].options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectWordOption(option)}
                className="p-5 rounded-2xl bg-[#F0F2F5]/90 border border-[#D1D9E6] hover:bg-white hover:border-[#4F7396] hover:shadow-xs text-[#1A2E44] text-base font-semibold tracking-wide text-center transition-all cursor-pointer"
              >
                {option}
              </button>
            ))}
          </div>

          <div className="text-center text-[11px] text-[#AAB7C6] italic">
            Note: Feedback is withheld during testing to maintain screening validity.
          </div>
        </div>
      )}

      {/* SECTION 3: READING ASSESSMENT (Screen 10) */}
      {currentSection === 'reading' && (
        <div className="glass-panel p-8 sm:p-10 rounded-3xl bg-white/90 border border-white/90 shadow-md">
          <div className="flex items-center justify-between text-xs text-[#7A8C9F] mb-6">
            <span>Section 3 • Reading Passage Assessment</span>
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#E8EDF2] text-[#1A2E44] font-mono font-medium">
              <Clock className="w-3.5 h-3.5 text-[#4F7396]" />
              <span>Time: {formatTime(readingSeconds)}</span>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-[#1A2E44] mb-2">
            {READING_PASSAGE.title}
          </h2>
          <p className="text-xs text-[#7A8C9F] mb-6">
            Read the passage carefully at your natural pace. Click "I've finished reading" when you reach the end.
          </p>

          <div className="p-6 sm:p-8 rounded-2xl bg-[#F0F2F5]/80 border border-[#D1D9E6] text-sm sm:text-base text-[#1A2E44] leading-relaxed mb-8 dyslexia-ready">
            {READING_PASSAGE.content}
          </div>

          <button
            onClick={handleFinishReading}
            className="w-full py-4 bg-[#1A2E44] text-white text-xs sm:text-sm font-semibold rounded-2xl shadow-xs hover:bg-[#2D4561] transition-all flex items-center justify-center space-x-2 cursor-pointer"
            id="finish-reading-btn"
          >
            <BookOpen className="w-4 h-4 text-[#D1D9E6]" />
            <span>I've Finished Reading</span>
          </button>
        </div>
      )}

      {/* SECTION 4: READING COMPREHENSION (Screen 11) */}
      {currentSection === 'comprehension' && (
        <div className="glass-panel p-8 sm:p-10 rounded-3xl bg-white/90 border border-white/90 shadow-md">
          <div className="flex items-center justify-between text-xs text-[#7A8C9F] mb-6">
            <span>Section 4 • Reading Comprehension</span>
            <span>Recorded Reading Time: {formatTime(readingSeconds)}</span>
          </div>

          <h2 className="text-xl font-semibold text-[#1A2E44] mb-6">
            Comprehension Questions
          </h2>

          <div className="space-y-6 mb-8">
            {READING_PASSAGE.questions.map((q) => (
              <div key={q.id} className="p-5 rounded-2xl bg-[#F0F2F5]/80 border border-[#E8EDF2]">
                <h3 className="text-sm font-semibold text-[#1A2E44] mb-4 dyslexia-ready">
                  {q.question}
                </h3>
                <div className="space-y-2.5">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = comprehensionAnswers[q.id] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectComprehension(q.id, optIdx)}
                        className={`w-full p-3.5 rounded-xl text-left text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-[#1A2E44] text-white'
                            : 'bg-white text-[#1A2E44] hover:bg-[#E8EDF2] border border-[#D1D9E6]'
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && <CheckCircle className="w-4 h-4 text-[#D1D9E6]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleNextComprehension}
            disabled={Object.keys(comprehensionAnswers).length < READING_PASSAGE.questions.length}
            className={`w-full py-4 text-xs sm:text-sm font-semibold rounded-2xl transition-all flex items-center justify-center space-x-2 ${
              Object.keys(comprehensionAnswers).length === READING_PASSAGE.questions.length
                ? 'bg-[#1A2E44] text-white hover:bg-[#2D4561] cursor-pointer shadow-xs'
                : 'bg-[#E8EDF2] text-[#AAB7C6] cursor-not-allowed'
            }`}
            id="comp-next-btn"
          >
            <span>Continue to Processing Speed Task</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* SECTION 5: TIMED PROCESSING TASK (Screen 12) */}
      {currentSection === 'timed_task' && (
        <div className="glass-panel p-8 sm:p-10 rounded-3xl bg-white/90 border border-white/90 shadow-md">
          <div className="flex items-center justify-between text-xs text-[#7A8C9F] mb-6">
            <span>Section 5 • Rapid Matching Task</span>
            <span>Trial {timedTrialIndex + 1} of {TIMED_TRIAL_ITEMS.length}</span>
          </div>

          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4F7396]">Target Word</span>
            <div className="text-3xl font-bold tracking-widest text-[#1A2E44] my-2 p-4 rounded-2xl bg-[#E8EDF2]/80 border border-[#D1D9E6]">
              {TIMED_TRIAL_ITEMS[timedTrialIndex].targetWord}
            </div>
            <p className="text-xs text-[#7A8C9F] mt-2">
              Select the exact matching target word as quickly and accurately as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {TIMED_TRIAL_ITEMS[timedTrialIndex].options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectTimedOption(opt)}
                className="p-4 rounded-xl bg-[#F0F2F5]/90 border border-[#D1D9E6] hover:bg-white hover:border-[#4F7396] text-[#1A2E44] text-sm font-semibold tracking-wider text-center transition-all cursor-pointer"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ASSESSMENT REVIEW (Screen 13) */}
      {currentSection === 'review' && (
        <div className="glass-panel p-8 sm:p-10 rounded-3xl bg-white/90 border border-white/90 shadow-md">
          <h2 className="text-2xl font-semibold text-[#1A2E44] tracking-tight mb-2">
            Assessment Complete
          </h2>
          <p className="text-xs text-[#5A6D82] mb-6 dyslexia-ready">
            Review your activity summary before finalizing your educational screening submission.
          </p>

          <div className="space-y-3 mb-8">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F0F2F5]/80 border border-[#E8EDF2] text-xs">
              <span className="font-semibold text-[#1A2E44]">Section 1: Questionnaire</span>
              <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                <CheckCircle className="w-4 h-4" />
                <span>Completed</span>
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F0F2F5]/80 border border-[#E8EDF2] text-xs">
              <span className="font-semibold text-[#1A2E44]">Section 2: Word Recognition</span>
              <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                <CheckCircle className="w-4 h-4" />
                <span>Completed ({WORD_RECOGNITION_ITEMS.length} trials)</span>
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F0F2F5]/80 border border-[#E8EDF2] text-xs">
              <span className="font-semibold text-[#1A2E44]">Section 3: Reading Passage</span>
              <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                <CheckCircle className="w-4 h-4" />
                <span>Recorded ({formatTime(readingSeconds)})</span>
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F0F2F5]/80 border border-[#E8EDF2] text-xs">
              <span className="font-semibold text-[#1A2E44]">Section 4: Reading Comprehension</span>
              <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                <CheckCircle className="w-4 h-4" />
                <span>Completed ({READING_PASSAGE.questions.length} questions)</span>
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F0F2F5]/80 border border-[#E8EDF2] text-xs">
              <span className="font-semibold text-[#1A2E44]">Section 5: Timed Processing Task</span>
              <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                <CheckCircle className="w-4 h-4" />
                <span>Completed ({TIMED_TRIAL_ITEMS.length} trials)</span>
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs mb-8 flex items-start space-x-3">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Important Notice:</span> Once submitted, your screening responses cannot be modified.
            </div>
          </div>

          <button
            onClick={handleSubmitAssessment}
            className="w-full py-4 bg-[#1A2E44] text-white text-xs sm:text-sm font-semibold rounded-2xl shadow-sm hover:bg-[#2D4561] transition-all flex items-center justify-center space-x-2 cursor-pointer"
            id="submit-assessment-btn"
          >
            <span>Submit Assessment</span>
            <ArrowRight className="w-4 h-4 text-[#D1D9E6]" />
          </button>
        </div>
      )}

      {/* PROCESSING SCREEN (Screen 14) */}
      {currentSection === 'processing' && (
        <div className="glass-panel p-12 rounded-3xl bg-white/90 border border-white/90 shadow-md text-center py-20 animate-pulse">
          <div className="w-12 h-12 rounded-full bg-[#E8EDF2] flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-6 h-6 text-[#4F7396] animate-spin" />
          </div>
          <h2 className="text-2xl font-semibold text-[#1A2E44] mb-2">
            Reviewing your responses...
          </h2>
          <p className="text-xs text-[#5A6D82] dyslexia-ready">
            Preparing your educational screening summary and personalized recommendations.
          </p>
        </div>
      )}

      {/* RESULTS & RECOMMENDATIONS (Screens 15, 16, 17, 18) */}
      {currentSection === 'results' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* Main Results Card */}
          <div className="glass-panel p-8 sm:p-10 rounded-3xl bg-white/90 border border-white/90 shadow-md">
            <span className="text-xs font-bold tracking-widest text-[#4F7396] uppercase">
              Educational Screening Summary
            </span>

            <h1 className="text-3xl font-semibold text-[#1A2E44] tracking-tight mt-1 mb-2">
              Screening Results
            </h1>

            <p className="text-xs text-[#5A6D82] mb-8 dyslexia-ready">
              Your results indicate areas of cognitive reading performance that may require further attention or tailored support.
            </p>

            {/* Overall screening summary badge */}
            <div className="p-6 rounded-2xl bg-[#E8EDF2]/80 border border-[#D1D9E6] mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-[#4F7396] uppercase tracking-wider">
                  Overall Screening Status
                </span>
                <div className="text-lg font-semibold text-[#1A2E44] mt-0.5">
                  Further support may be recommended
                </div>
              </div>
              <div className="px-3.5 py-1.5 rounded-full bg-[#1A2E44] text-white text-xs font-medium">
                Educational Assessment
              </div>
            </div>

            {/* Categorized Performance Breakdown */}
            <h3 className="text-sm font-semibold text-[#1A2E44] mb-4">
              Category Breakdown
            </h3>

            <div className="space-y-3 mb-8">
              {[
                { title: 'Reading Passage Speed', status: 'Needs attention', detail: `Recorded reading time: ${formatTime(readingSeconds)}` },
                { title: 'Word Recognition & Spelling', status: 'Moderate', detail: 'Orthographic lexical matching performance' },
                { title: 'Reading Comprehension', status: 'Good', detail: 'Passage accuracy and main idea retention' },
                { title: 'Processing Speed', status: 'Needs attention', detail: 'Timed rapid matching performance' },
              ].map((cat, idx) => {
                const isExpanded = expandedCategory === cat.title;

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#F0F2F5]/80 border border-[#E8EDF2] transition-all"
                  >
                    <div
                      onClick={() => setExpandedCategory(isExpanded ? null : cat.title)}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <div>
                        <span className="text-xs font-semibold text-[#1A2E44]">{cat.title}</span>
                        <div className="text-[11px] text-[#5A6D82] mt-0.5">{cat.detail}</div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                            cat.status === 'Needs attention'
                              ? 'bg-amber-100 text-amber-800'
                              : cat.status === 'Moderate'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {cat.status}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-[#7A8C9F]" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-[#7A8C9F]" />
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 pt-3 border-t border-[#D1D9E6] text-xs text-[#5A6D82] dyslexia-ready">
                        Your performance in this section suggests that pacing or processing speed in this specific domain may benefit from structured exercises and academic accommodations.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Non-diagnostic notice */}
            <div className="p-4 rounded-2xl bg-white border border-[#D1D9E6] text-xs text-[#5A6D82] dyslexia-ready mb-8 flex items-start space-x-3">
              <ShieldAlert className="w-4 h-4 text-[#4F7396] shrink-0 mt-0.5" />
              <div>
                <strong>Important Notice:</strong> This result does not constitute a formal medical or clinical diagnosis of dyslexia. It serves as an educational screening tool for Durban University of Technology learning support.
              </div>
            </div>
          </div>

            {/* Recommendations Section (Screen 17) */}
          <div className="glass-panel p-8 sm:p-10 rounded-3xl bg-white/90 border border-white/90 shadow-md">
            <div className="flex items-center space-x-2 mb-6">
              <Award className="w-5 h-5 text-[#4F7396]" />
              <h2 className="text-xl font-semibold text-[#1A2E44]">
                Recommended Educational Activities
              </h2>
            </div>
            
            <p className="text-xs text-[#5A6D82] mb-6 dyslexia-ready">
              Based on your screening results, here are specific educational exercises to help build your skills. These activities are for educational practice and do not constitute a medical treatment or diagnosis.
            </p>

            <div className="space-y-4 mb-8">
              {[
                { key: 'reading', title: 'Reading Passage Practice', desc: 'Practice short timed reading passages to build fluency and comfort.', show: assessmentResult?.categories.reading !== 'Good' },
                { key: 'wordRecognition', title: 'Word Recognition Drills', desc: 'Practice word recognition exercises with visual word patterns.', show: assessmentResult?.categories.wordRecognition !== 'Good' },
                { key: 'comprehension', title: 'Comprehension & Idea Retention', desc: 'Practice reading short passages and identifying main ideas.', show: assessmentResult?.categories.comprehension !== 'Good' },
                { key: 'processingSpeed', title: 'Rapid Matching Practice', desc: 'Visual recognition matching to improve your processing speed.', show: assessmentResult?.categories.processingSpeed !== 'Good' },
              ].filter(rec => rec.show || assessmentResult?.overallStatus === 'No significant indicators').map((rec, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-[#F0F2F5]/80 border border-[#E8EDF2] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xs font-semibold text-[#1A2E44]">{rec.title}</h3>
                    <p className="text-xs text-[#5A6D82] mt-0.5 dyslexia-ready">
                      {rec.desc}
                    </p>
                  </div>
                  <button
                    onClick={onExitToDashboard}
                    className="px-4 py-2 bg-[#1A2E44] text-white text-xs font-semibold rounded-xl hover:bg-[#2D4561] transition-all cursor-pointer shrink-0"
                  >
                    Go to Dashboard
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Support / Referral Section (Screen 18) */}
          <div className="glass-panel p-8 sm:p-10 rounded-3xl bg-white/90 border border-white/90 shadow-md">
            <h2 className="text-xl font-semibold text-[#1A2E44] mb-2">
              Need Additional Support?
            </h2>
            <p className="text-xs text-[#5A6D82] mb-6 dyslexia-ready">
              If you are concerned about your results or feel that reading difficulties are impacting your academic studies, consider speaking with a qualified professional or contacting the DUT Disability Unit.
            </p>

            <div className="p-6 rounded-2xl bg-[#E8EDF2]/80 border border-[#D1D9E6] space-y-3 text-xs mb-8">
              <div className="font-bold text-[#1A2E44] text-sm">{DUT_DISABILITY_UNIT_INFO.unitName}</div>
              <p className="text-[#5A6D82] leading-relaxed">{DUT_DISABILITY_UNIT_INFO.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-[#D1D9E6]/60 text-[#1A2E44] font-medium">
                <div>Email: {DUT_DISABILITY_UNIT_INFO.contactEmail}</div>
                <div>Phone: {DUT_DISABILITY_UNIT_INFO.contactPhone}</div>
                <div>Location: {DUT_DISABILITY_UNIT_INFO.location}</div>
                <div>Hours: {DUT_DISABILITY_UNIT_INFO.officeHours}</div>
              </div>
            </div>

            <button
              onClick={onExitToDashboard}
              className="w-full py-4 bg-[#1A2E44] text-white text-xs sm:text-sm font-semibold rounded-2xl shadow-xs hover:bg-[#2D4561] transition-all flex items-center justify-center space-x-2 cursor-pointer"
              id="return-dashboard-btn"
            >
              <RotateCcw className="w-4 h-4 text-[#D1D9E6]" />
              <span>Return to Student Dashboard</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
