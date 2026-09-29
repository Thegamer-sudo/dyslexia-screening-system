import { AccessibilitySettings, AssessmentRecord } from '../types';

export interface UserProfile {
  firstName: string;
  lastName: string;
  studentNumber: string;
  email: string;
}

export interface QuestionItem {
  id: number;
  question: string;
  category: 'questionnaire' | 'word_recognition' | 'reading' | 'comprehension' | 'processing';
}

export interface WordRecognitionItem {
  id: number;
  options: string[];
  correctAnswer: string;
}

export interface ReadingPassage {
  id: number;
  title: string;
  content: string;
  questions: {
    id: number;
    question: string;
    options: string[];
    correctIndex: number;
  }[];
}

export interface TimedTrialItem {
  id: number;
  targetWord: string;
  options: string[];
}


export const QUESTIONNAIRE_ITEMS = [
  { id: 1, question: 'How often do you find reading long academic texts or textbooks difficult?' },
  { id: 2, question: 'How often do you need to re-read sentences multiple times to grasp their meaning?' },
  { id: 3, question: 'How often do you feel fatigued or experience headache symptoms when reading for extended periods?' },
  { id: 4, question: 'How often do you confuse words with similar visual structures when reading quickly?' },
  { id: 5, question: 'How often do you find taking written lecture notes at normal speed challenging?' },
];

export const WORD_RECOGNITION_ITEMS: WordRecognitionItem[] = [
  { id: 1, options: ['Receive', 'Recieve', 'Receeve', 'Receve'], correctAnswer: 'Receive' },
  { id: 2, options: ['Accodmodate', 'Accommodate', 'Acommodate', 'Accomodate'], correctAnswer: 'Accommodate' },
  { id: 3, options: ['Neccessary', 'Necesary', 'Necessary', 'Nessesary'], correctAnswer: 'Necessary' },
  { id: 4, options: ['Separite', 'Separate', 'Seperate', 'Seperite'], correctAnswer: 'Separate' },
  { id: 5, options: ['Conscious', 'Conscios', 'Consious', 'Conshus'], correctAnswer: 'Conscious' },
];

export const READING_PASSAGE: ReadingPassage = {
  id: 1,
  title: 'Learning and Memory',
  content: `Learning is how we gain new skills and knowledge. When we read a book, our brain connects the words we see with the sounds we hear. Sometimes, reading can feel hard because our brain needs to work fast to match those letters to sounds. A good memory helps us remember what the story is about. Getting plenty of sleep and practicing reading slowly can help make it easier over time.`,
  questions: [
    {
      id: 1,
      question: 'What does the brain connect when we read a book?',
      options: [
        'Words we see with sounds we hear',
        'Pictures with numbers',
        'Songs with dreams',
        'Letters with colors'
      ],
      correctIndex: 0
    },
    {
      id: 2,
      question: 'What can help make reading easier over time?',
      options: [
        'Reading faster',
        'Getting plenty of sleep and practicing slowly',
        'Skipping the hard words',
        'Watching television'
      ],
      correctIndex: 1
    }
  ]
};

export const TIMED_TRIAL_ITEMS: TimedTrialItem[] = [
  { id: 1, targetWord: 'STRUCTURE', options: ['STUCTURE', 'STRUCTURE', 'STRUCUTRE', 'STRUTURE'] },
  { id: 2, targetWord: 'PHONOLOGY', options: ['PHONLOGY', 'PHONOLOGY', 'PHONOLGY', 'PHONOLGOY'] },
  { id: 3, targetWord: 'COGNITIVE', options: ['COGNITIVE', 'COGNATIVE', 'COGNTIVE', 'CONGITIVE'] },
  { id: 4, targetWord: 'LEXICAL', options: ['LEXACAL', 'LEXICAL', 'LEXICEL', 'LEXCLE'] },
];

export const DUT_DISABILITY_UNIT_INFO = {
  unitName: 'DUT Disability Support Unit',
  institution: 'Durban University of Technology',
  description: 'The Disability Support Unit provides confidential academic accommodations, assistive technology support, and formal diagnostic referral pathways for students.',
  contactEmail: 'disabilitysupport@dut.ac.za',
  contactPhone: '+27 (0)31 373 2551',
  location: 'Student Success Centre, Gate 1, Steve Biko Campus',
  website: 'https://www.dut.ac.za/disability_support',
  officeHours: 'Monday – Friday: 08:00 – 16:00',
};

export const PRACTICE_WORD_RECOGNITION: WordRecognitionItem[] = [
  { id: 1, options: ['Environment', 'Enviroment', 'Evironment', 'Environemnt'], correctAnswer: 'Environment' },
  { id: 2, options: ['Definately', 'Definitely', 'Definitly', 'Defenitely'], correctAnswer: 'Definitely' },
  { id: 3, options: ['Occurred', 'Occured', 'Ocurred', 'Ocuured'], correctAnswer: 'Occurred' },
  { id: 4, options: ['Reccommend', 'Recommend', 'Recomend', 'Reccomend'], correctAnswer: 'Recommend' },
  { id: 5, options: ['Embarrass', 'Embarass', 'Embarras', 'Emmbarrass'], correctAnswer: 'Embarrass' },
];

export const PRACTICE_READING_PASSAGE: ReadingPassage = {
  id: 2,
  title: 'The Process of Photosynthesis',
  content: `Plants make their own food using a process called photosynthesis. They use sunlight, water from the soil, and carbon dioxide from the air. Inside their leaves, a green substance called chlorophyll captures the energy from the sun. This energy helps turn the water and carbon dioxide into sugar, which the plant uses to grow. During this process, plants also release oxygen into the air, which humans and animals need to breathe.`,
  questions: [
    {
      id: 1,
      question: 'What green substance captures energy from the sun?',
      options: ['Carbon dioxide', 'Chlorophyll', 'Oxygen', 'Water'],
      correctIndex: 1
    },
    {
      id: 2,
      question: 'What do plants release into the air during photosynthesis?',
      options: ['Sugar', 'Carbon dioxide', 'Oxygen', 'Sunlight'],
      correctIndex: 2
    }
  ]
};

export const PRACTICE_TIMED_TRIAL: TimedTrialItem[] = [
  { id: 1, targetWord: 'SCIENTIFIC', options: ['SCEINTIFIC', 'SCIENTIFIC', 'SCIENTIFC', 'SCINTIFIC'] },
  { id: 2, targetWord: 'KNOWLEDGE', options: ['KNOWLEGE', 'KNOWELDGE', 'KNOWLEDGE', 'KNOLWEDGE'] },
  { id: 3, targetWord: 'EXPERIMENT', options: ['EXPERIMENT', 'EXPREIMENT', 'EXPERMINT', 'EXPERMENT'] },
  { id: 4, targetWord: 'HYPOTHESIS', options: ['HYPOTHOSIS', 'HYPOTHESIS', 'HYPOTHSIS', 'HYPOTHESES'] },
];

