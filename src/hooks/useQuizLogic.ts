import { useState } from 'react';
import { submitToHubSpot, getAnswerText } from '../utils/hubspot';

// Types
export interface QuizOption {
  id: string;
  text: string;
  value: string;
  score?: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
}

export type MaturityLevel = 'Reactive IT' | 'Structured IT' | 'Optimized IT';

// Quiz data
export const quizData: QuizQuestion[] = [
  {
    id: 1,
    question: "How are password resets and basic 'how do I' questions handled today?",
    options: [
      { id: '1a', text: 'Agents handle most of them manually', value: 'option_1', score: 1 },
      { id: '1b', text: 'Some self-service/AI deflection, but agents still handle many ', value: 'option_2', score: 2 },
      { id: '1c', text: '80%+ resolved automatically without agent involvement ', value: 'option_3', score: 3 },
    ],
  },
  {
    id: 2,
    question: "When someone needs access to multiple systems (onboarding, role change), what happens?",
    options: [
      { id: '2a', text: 'Agent manually provisions each system, lots of back-and-forth', value: 'option_1', score: 1 },
      { id: '2b', text: 'Documented process exists, but humans execute each step', value: 'option_2', score: 2 },
      { id: '2d', text: 'If-this-then-that workflows automatically provision across systems  ', value: 'option_3', score: 3 },
    ],
  },
  {
    id: 3,
    question: "What percentage of your IT team's time goes to complex work (architecture, investigations, strategic projects)?",
    options: [
      { id: '3a', text: "Less than 30% — we're constantly firefighting routine issues", value: 'option_1', score: 1 },
      { id: '3b', text: '30-50% — getting better but still interrupted by automatable tasks', value: 'option_2', score: 2 },
      { id: '3c', text: '70%+ — routine work is handled, we focus on real problems', value: 'option_3', score: 3 },
    ],
  },
  {
    id: 4,
    question: "What's your primary goal for your ITSM platform in the next 12 months?",
    options: [
      { id: '4a', text: 'Reduce ticket volume and agent workload', value: 'option_1' },
      { id: '4b', text: 'Improve employee experience', value: 'option_2' },
      { id: '4c', text: 'Scale service management without adding headcount', value: 'option_3' },
      { id: '4d', text: 'Modernize our tech stack / demonstrate ROI', value: 'option_4' },
    ],
  },
];

// Free email domains for validation
const freeEmailDomains = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com',
  'icloud.com', 'mail.com', 'protonmail.com', 'zoho.com', 'yandex.com',
  'gmx.com', 'inbox.com', 'live.com', 'msn.com', 'yahoo.co.uk',
  'yahoo.co.in', 'yahoo.fr', 'yahoo.de', 'googlemail.com', 'me.com',
  'mac.com', 'hotmail.co.uk', 'hotmail.fr', 'live.co.uk', 'live.fr',
  'qq.com', '163.com', '126.com', 'sina.com', 'rediffmail.com',
  'fastmail.com', 'hushmail.com', 'tutanota.com', 'mailfence.com',
  'proton.me', 'hey.com'
];

// HubSpot configuration
const HUBSPOT_CONFIG = {
  portalId: 'YOUR_PORTAL_ID',
  formId: 'YOUR_FORM_ID',
};

// Utility functions
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isBusinessEmail = (email: string): boolean => {
  const domain = email.toLowerCase().split('@')[1];
  return domain ? !freeEmailDomains.includes(domain) : false;
};

export const calculateScore = (answers: Record<number, string>): number => {
  let totalScore = 0;
  for (let i = 0; i < 3; i++) {
    const selectedValue = answers[i];
    const question = quizData[i];
    const selectedOption = question.options.find(opt => opt.value === selectedValue);
    if (selectedOption?.score) {
      totalScore += selectedOption.score;
    }
  }
  return totalScore;
};

export const getResultMessage = (score: number): MaturityLevel => {
  if (score >= 3 && score <= 5) {
    return 'Reactive IT';
  } else if (score >= 6 && score <= 7) {
    return 'Structured IT';
  } else {
    return 'Optimized IT';
  }
};

// Hook return type
export interface UseQuizLogicReturn {
  // State
  showOnboarding: boolean;
  currentQuestion: number;
  answers: Record<number, string>;
  selectedOption: string;
  isComplete: boolean;
  name: string;
  email: string;
  emailSubmitted: boolean;
  emailError: string;
  isSubmitting: boolean;
  isTransitioning: boolean;
  progress: number;
  question: QuizQuestion;
  totalScore: number;
  maturityLevel: MaturityLevel;

  // Setters
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setEmailError: (error: string) => void;

  // Handlers
  handleStartQuiz: () => void;
  handleOptionSelect: (optionValue: string) => void;
  handlePrevious: () => void;
  handleEmailSubmit: (e: React.FormEvent) => Promise<void>;
}

export function useQuizLogic(): UseQuizLogicReturn {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isComplete, setIsComplete] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const progress = ((currentQuestion + 1) / quizData.length) * 100;
  const question = quizData[currentQuestion];
  const totalScore = calculateScore(answers);
  const maturityLevel = getResultMessage(totalScore);

  const handleStartQuiz = () => {
    setShowOnboarding(false);
  };

  const handleOptionSelect = (optionValue: string) => {
    setSelectedOption(optionValue);

    setTimeout(() => {
      setIsTransitioning(true);

      setTimeout(() => {
        setAnswers({ ...answers, [currentQuestion]: optionValue });

        if (currentQuestion < quizData.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedOption('');
        } else {
          setIsComplete(true);
        }

        setIsTransitioning(false);
      }, 300);
    }, 400);
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setIsTransitioning(true);

      setTimeout(() => {
        setCurrentQuestion(currentQuestion - 1);
        setSelectedOption(answers[currentQuestion - 1] || '');
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setEmailError('Please enter your work email address');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    if (!isBusinessEmail(email)) {
      setEmailError('Please use your work email address. Free email providers are not accepted.');
      return;
    }

    setIsSubmitting(true);
    setEmailError('');

    try {
      const result = await submitToHubSpot(
        {
          email: email,
          score: totalScore,
          maturityLevel: maturityLevel,
          question1Answer: getAnswerText(0, answers[0]),
          question2Answer: getAnswerText(1, answers[1]),
          question3Answer: getAnswerText(2, answers[2]),
          selectedGoal: getAnswerText(3, answers[3]),
        },
        HUBSPOT_CONFIG
      );

      if (result.success) {
        console.log('✅ Data submitted to HubSpot successfully');
      } else {
        console.warn('⚠️ HubSpot submission failed:', result.error);
      }
    } catch (error) {
      console.error('HubSpot submission error:', error);
    } finally {
      setIsSubmitting(false);
    }

    setEmailSubmitted(true);

    window.dispatchEvent(new CustomEvent('unlockTOC', {
      detail: {
        email: email,
        maturityLevel: maturityLevel,
        score: totalScore,
        timestamp: new Date().toISOString(),
        quizCompleted: true
      }
    }));
  };

  return {
    // State
    showOnboarding,
    currentQuestion,
    answers,
    selectedOption,
    isComplete,
    name,
    email,
    emailSubmitted,
    emailError,
    isSubmitting,
    isTransitioning,
    progress,
    question,
    totalScore,
    maturityLevel,

    // Setters
    setName,
    setEmail,
    setEmailError,

    // Handlers
    handleStartQuiz,
    handleOptionSelect,
    handlePrevious,
    handleEmailSubmit,
  };
}
