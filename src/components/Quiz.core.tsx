import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import { submitToHubSpot, getAnswerText } from '../utils/hubspot';
import { loadQuizState, saveQuizState, clearQuizState, getExpiryDate } from '../utils/quizStorage';
import OnboardingScreen from './OnboardingScreen';

interface QuizOption {
  id: string;
  text: string;
  value: string;
  score?: number;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
}

// Props that differ between local and Webflow environments
export interface QuizCoreProps {
  fontFamily?: string;
  background?: 'gradient' | 'transparent';
  svgIdPrefix?: string;
  coverImageUrl?: string;
}

const quizData: QuizQuestion[] = [
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

export default function QuizCore({
  fontFamily = 'Inter, sans-serif',
  background = 'gradient',
  svgIdPrefix = '',
  coverImageUrl
}: QuizCoreProps) {
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
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  // Ref for the results card to capture as screenshot
  const resultsCardRef = useRef<HTMLDivElement>(null);

  // Background style based on prop
  const isWebflow = background === 'transparent';
  const bgStyle = background === 'gradient'
    ? 'linear-gradient(180deg, #F9F5FF 0%, #FFFFFF 100%)'
    : 'transparent';

  // Restore state from localStorage on mount
  useEffect(() => {
    const savedState = loadQuizState();

    if (savedState) {
      setAnswers(savedState.answers);
      setEmail(savedState.email);
      setIsComplete(true);
      setEmailSubmitted(true);
      setShowOnboarding(false);
      setIsReturningUser(true);

      window.dispatchEvent(new CustomEvent('unlockTOC', {
        detail: {
          email: savedState.email,
          maturityLevel: savedState.maturityLevel,
          score: savedState.score,
          timestamp: savedState.completedAt,
          quizCompleted: true,
          isReturningUser: true
        }
      }));

      console.log('Returning user - quiz state restored');
    }
  }, []);

  const HUBSPOT_CONFIG = {
    portalId: 'YOUR_PORTAL_ID',
    formId: 'YOUR_FORM_ID',
  };

  const progress = ((currentQuestion + 1) / quizData.length) * 100;

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

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isBusinessEmail = (email: string) => {
    const domain = email.toLowerCase().split('@')[1];
    return domain && !freeEmailDomains.includes(domain);
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
      const score = calculateScore();
      const maturityLevel = getResultMessage(score);

      const result = await submitToHubSpot(
        {
          email: email,
          score: score,
          maturityLevel: maturityLevel,
          question1Answer: getAnswerText(0, answers[0]),
          question2Answer: getAnswerText(1, answers[1]),
          question3Answer: getAnswerText(2, answers[2]),
          selectedGoal: getAnswerText(3, answers[3]),
        },
        HUBSPOT_CONFIG
      );

      if (result.success) {
        console.log('Data submitted to HubSpot successfully');
      } else {
        console.warn('HubSpot submission failed:', result.error);
      }
    } catch (error) {
      console.error('HubSpot submission error:', error);
    } finally {
      setIsSubmitting(false);
    }

    setEmailSubmitted(true);

    const score = calculateScore();
    const maturityLevel = getResultMessage(score);
    const completedAt = new Date().toISOString();

    const quizState = {
      version: 1,
      email: email,
      answers: answers,
      score: score,
      maturityLevel: maturityLevel,
      completedAt: completedAt,
      expiresAt: getExpiryDate()
    };

    const saved = saveQuizState(quizState);
    if (saved) {
      console.log('Quiz state saved for future visits');
    } else {
      console.warn('Could not save quiz state - localStorage may be disabled');
    }

    window.dispatchEvent(new CustomEvent('unlockTOC', {
      detail: {
        email: email,
        maturityLevel: maturityLevel,
        score: score,
        timestamp: completedAt,
        quizCompleted: true
      }
    }));
  };

  const handleRetakeQuiz = () => {
    clearQuizState();

    setCurrentQuestion(0);
    setAnswers({});
    setSelectedOption('');
    setIsComplete(false);
    setEmail('');
    setName('');
    setEmailSubmitted(false);
    setEmailError('');
    setIsReturningUser(false);
    setShowOnboarding(true);

    console.log('Quiz reset - ready for retake');
  };

  // Download results as image
  const handleDownloadResult = async () => {
    if (!resultsCardRef.current || isCapturing) return;

    setIsCapturing(true);

    try {
      const canvas = await html2canvas(resultsCardRef.current, {
        backgroundColor: '#FFFFFF',
        scale: 2, // Higher resolution
        useCORS: true,
        logging: false,
        // Ignore elements with data-html2canvas-ignore attribute
        ignoreElements: (element) => {
          return element.hasAttribute('data-html2canvas-ignore');
        }
      });

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'IT-Maturity-Quiz-Result.png';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }, 'image/png');
    } catch (error) {
      console.error('Error capturing screenshot:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  const calculateScore = () => {
    let totalScore = 0;

    for (let i = 0; i < 3; i++) {
      const selectedValue = answers[i];
      const question = quizData[i];
      const selectedOption = question.options.find(opt => opt.value === selectedValue);

      if (selectedOption && selectedOption.score) {
        totalScore += selectedOption.score;
      }
    }

    return totalScore;
  };

  const getResultMessage = (score: number) => {
    if (score >= 3 && score <= 5) {
      return 'Reactive IT';
    } else if (score >= 6 && score <= 7) {
      return 'Structured IT';
    } else {
      return 'Optimized IT';
    }
  };

  // SVG gradient IDs with prefix for uniqueness
  const gradientIds = {
    preview1_0: `paint0_linear_preview1${svgIdPrefix}`,
    preview1_1: `paint1_linear_preview1${svgIdPrefix}`,
    preview2_0: `paint0_linear_preview2${svgIdPrefix}`,
    preview2_1: `paint1_linear_preview2${svgIdPrefix}`,
    preview3_0: `paint0_linear_preview3${svgIdPrefix}`,
    preview3_1: `paint1_linear_preview3${svgIdPrefix}`,
    result1_0: `paint0_linear_796_3068${svgIdPrefix}`,
    result1_1: `paint1_linear_796_3068${svgIdPrefix}`,
    result2_0: `paint0_linear_796_3082${svgIdPrefix}`,
    result2_1: `paint1_linear_796_3082${svgIdPrefix}`,
    result2_filter: `filter0_n_796_3082${svgIdPrefix}`,
    result2_noise: `effect1_noise_796_3082${svgIdPrefix}`,
    result3_0: `paint0_linear_796_3086${svgIdPrefix}`,
    result3_1: `paint1_linear_796_3086${svgIdPrefix}`,
    result3_filter: `filter0_n_796_3086${svgIdPrefix}`,
    result3_noise: `effect1_noise_796_3086${svgIdPrefix}`,
  };

  // Show onboarding screen first
  if (showOnboarding) {
    return (
      <div
        className="flex items-center justify-center p-4"
        style={{ minHeight: isWebflow ? undefined : '100vh', background: bgStyle }}
      >
        <div
          style={{
            maxWidth: '1066px',
            width: '100%',
            border: '1px solid rgba(0, 0, 0, 0.12)',
            borderRadius: '16px',
            backgroundColor: '#FFFFFF',
            padding: '16px',
            overflow: 'hidden'
          }}
        >
          <OnboardingScreen onStart={handleStartQuiz} coverImageUrl={coverImageUrl} />
        </div>
      </div>
    );
  }

  if (isComplete && !emailSubmitted) {
    const totalScore = calculateScore();
    const maturityLevel = getResultMessage(totalScore);

    return (
      <div
        style={{
          position: 'relative',
          minHeight: isWebflow ? undefined : '100vh',
          background: bgStyle,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}
      >
        {/* Blurred results preview */}
        <div
          style={{
            maxWidth: '1066px',
            width: '100%',
            border: '1px solid rgba(0, 0, 0, 0.12)',
            borderRadius: '16px',
            backgroundColor: '#FFFFFF',
            padding: '48px',
            filter: 'blur(8px)',
            pointerEvents: 'none',
            textAlign: 'left'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', marginBottom: '48px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <h3
                style={{
                  textTransform: 'uppercase',
                  fontFamily,
                  fontWeight: 500,
                  fontSize: '11px',
                  letterSpacing: '11px',
                  color: '#4A5565',
                  marginBottom: '18px',
                  backgroundColor: 'rgba(168, 171, 255, 0.36)',
                  padding: '2px 10px'
                }}
              >
                Your result
              </h3>

              <h2
                style={{
                  fontFamily,
                  fontWeight: 500,
                  fontSize: '48px',
                  letterSpacing: '-0.02em',
                  color: '#201515',
                  marginBottom: '18px'
                }}
              >
                {maturityLevel}
              </h2>

              {maturityLevel === 'Reactive IT' && (
                <p style={{ fontFamily, fontWeight: 400, fontSize: '18px', letterSpacing: '-0.004em', color: '#201515', lineHeight: 1.6, marginBottom: '18px' }}>
                  Your agents are handling work that AI and automation could deflect. Every ticket deflected saves 15-30 minutes of agent time.
                </p>
              )}

              {maturityLevel === 'Structured IT' && (
                <p style={{ fontFamily, fontWeight: 400, fontSize: '18px', letterSpacing: '-0.004em', color: '#201515', lineHeight: 1.6, marginBottom: '18px' }}>
                  You've started deflecting easy stuff, but agents still spend significant time on automatable work with manual handoffs between systems.
                </p>
              )}

              {maturityLevel === 'Optimized IT' && (
                <p style={{ fontFamily, fontWeight: 400, fontSize: '18px', letterSpacing: '-0.004em', color: '#201515', lineHeight: 1.6, marginBottom: '18px' }}>
                  You've automated the routine. Agents focus on work that genuinely requires expertise—complex troubleshooting, architecture, strategic initiatives.
                </p>
              )}

              <div
                style={{
                  fontFamily,
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  backgroundColor: '#8040F0',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '18px 28px'
                }}
              >
                Read the complete guide {'->'}
              </div>
            </div>

            {/* SVG Visualization placeholder */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0px' }}>
              {/* Optimized IT */}
              <div style={{ filter: maturityLevel === 'Optimized IT' ? 'none' : 'saturate(0.2) brightness(1.3) contrast(0.8)', position: 'relative', marginBottom: '-85px', zIndex: 3 }}>
                <svg width="273" height="165" viewBox="0 0 273 165" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="156.941" height="156.941" rx="15.3299" transform="matrix(0.866025 -0.5 0.866025 0.5 0.309082 86.1445)" fill={`url(#${gradientIds.preview1_0})`} stroke="#272727" strokeWidth="0.306599" strokeLinecap="round" strokeDasharray="3.07 3.07"/>
                  <rect width="156.941" height="156.941" rx="15.3299" transform="matrix(0.866025 -0.5 0.866025 0.5 0 78.4688)" fill={`url(#${gradientIds.preview1_1})`} stroke="#B2B2B2" strokeWidth="0.383248" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id={gradientIds.preview1_0} x1="78.4703" y1="0" x2="78.4703" y2="156.941" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#D8D8D8"/><stop offset="0.504808" stopColor="white"/><stop offset="1" stopColor="#D8D8D8"/>
                    </linearGradient>
                    <linearGradient id={gradientIds.preview1_1} x1="152.683" y1="4.12785" x2="-0.317485" y2="157.128" gradientUnits="userSpaceOnUse">
                      <stop offset="0.226929" stopColor="#4AB583"/><stop offset="1" stopColor="#CEFFDE"/>
                    </linearGradient>
                  </defs>
                </svg>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontFamily, fontWeight: 700, fontSize: '18px', letterSpacing: '-0.015em', color: maturityLevel === 'Optimized IT' ? '#FFFFFF' : '#868686' }}>
                  Optimized IT
                </div>
              </div>

              {/* Structured IT */}
              <div style={{ filter: maturityLevel === 'Structured IT' ? 'none' : 'saturate(0.2) brightness(1.3) contrast(0.8)', position: 'relative', marginBottom: '-110px', zIndex: 2 }}>
                <svg width="334" height="201" viewBox="0 0 334 201" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="192.376" height="192.376" rx="15.3299" transform="matrix(0.866025 -0.5 0.866025 0.5 0.147461 104.18)" fill={`url(#${gradientIds.preview2_0})`} stroke="#272727" strokeWidth="0.306599" strokeLinecap="round" strokeDasharray="3.07 3.07"/>
                  <rect width="192.376" height="192.376" rx="15.3299" transform="matrix(0.866025 -0.5 0.866025 0.5 0 96.1875)" fill={`url(#${gradientIds.preview2_1})`} stroke="#B2B2B2" strokeWidth="0.383248" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id={gradientIds.preview2_0} x1="96.188" y1="0" x2="96.188" y2="192.376" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#D8D8D8"/><stop offset="0.504808" stopColor="white"/><stop offset="1" stopColor="#D8D8D8"/>
                    </linearGradient>
                    <linearGradient id={gradientIds.preview2_1} x1="187.097" y1="5.05926" x2="-0.389069" y2="192.546" gradientUnits="userSpaceOnUse">
                      <stop offset="0.226929" stopColor="#9966FF"/><stop offset="1" stopColor="#E8DEFF"/>
                    </linearGradient>
                  </defs>
                </svg>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontFamily, fontWeight: 700, fontSize: '18px', letterSpacing: '-0.015em', color: maturityLevel === 'Structured IT' ? '#FFFFFF' : '#868686' }}>
                  Structured IT
                </div>
              </div>

              {/* Reactive IT */}
              <div style={{ filter: maturityLevel === 'Reactive IT' ? 'none' : 'saturate(0.2) brightness(1.3) contrast(0.8)', position: 'relative', zIndex: 1 }}>
                <svg width="395" height="237" viewBox="0 0 395 237" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="227.811" height="227.811" rx="15.3299" transform="matrix(0.866025 -0.5 0.866025 0.5 0.147461 122.18)" fill={`url(#${gradientIds.preview3_0})`} stroke="#272727" strokeWidth="0.306599" strokeLinecap="round" strokeDasharray="3.07 3.07"/>
                  <rect width="227.811" height="227.811" rx="15.3299" transform="matrix(0.866025 -0.5 0.866025 0.5 0 113.906)" fill={`url(#${gradientIds.preview3_1})`} stroke="#B2B2B2" strokeWidth="0.383248" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id={gradientIds.preview3_0} x1="113.906" y1="0" x2="113.906" y2="227.811" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#D8D8D8"/><stop offset="0.504808" stopColor="white"/><stop offset="1" stopColor="#D8D8D8"/>
                    </linearGradient>
                    <linearGradient id={gradientIds.preview3_1} x1="221.523" y1="5.9891" x2="-0.460638" y2="227.973" gradientUnits="userSpaceOnUse">
                      <stop offset="0.226929" stopColor="#9966FF"/><stop offset="1" stopColor="#E8DEFF"/>
                    </linearGradient>
                  </defs>
                </svg>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontFamily, fontWeight: 700, fontSize: '18px', letterSpacing: '-0.015em', color: maturityLevel === 'Reactive IT' ? '#FFFFFF' : '#868686' }}>
                  Reactive IT
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Email form overlay */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: '900px',
            width: 'calc(100% - 32px)',
            padding: '48px'
          }}
        >
          <h2
            style={{
              fontFamily,
              fontSize: '56px',
              fontWeight: 400,
              color: '#000000',
              textAlign: 'center',
              marginBottom: '32px',
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              maxWidth: '850px',
              margin: '0 auto 32px auto',
              textWrap: 'balance'
            } as React.CSSProperties}
          >
            Almost there! We're getting your results ready.
          </h2>

          <form onSubmit={handleEmailSubmit} noValidate>
            <div style={{ marginBottom: '20px' }}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  borderRadius: '8px',
                  border: '1px solid #D9D9D9',
                  backgroundColor: '#FFFFFF',
                  fontFamily,
                  fontSize: '16px',
                  color: '#201515',
                  outline: 'none',
                  transition: 'border 200ms ease'
                }}
                onFocus={(e) => e.target.style.border = '1px solid #9966FF'}
                onBlur={(e) => e.target.style.border = '1px solid #D9D9D9'}
              />
            </div>

            <div style={{ marginBottom: '32px' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError('');
                }}
                placeholder="Work email"
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  borderRadius: '8px',
                  border: emailError ? '1px solid #FF0000' : '1px solid #D9D9D9',
                  fontFamily,
                  fontSize: '16px',
                  color: '#201515',
                  outline: 'none',
                  transition: 'border 200ms ease',
                  backgroundColor: emailError ? '#FFF5F5' : '#FFFFFF'
                }}
                onFocus={(e) => !emailError && (e.target.style.border = '1px solid #9966FF')}
                onBlur={(e) => !emailError && (e.target.style.border = '1px solid #D9D9D9')}
              />
              {emailError && (
                <p style={{ color: '#FF0000', fontSize: '14px', marginTop: '8px', fontFamily }}>
                  {emailError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#8040F0',
                color: '#FFFFFF',
                fontFamily,
                fontSize: '18px',
                fontWeight: 600,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'background-color 200ms ease',
                opacity: isSubmitting ? 0.6 : 1
              }}
            >
              {isSubmitting ? 'Submitting...' : 'View my result'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (isComplete && emailSubmitted) {
    const totalScore = calculateScore();
    const maturityLevel = getResultMessage(totalScore);

    return (
      <div
        style={{
          minHeight: isWebflow ? undefined : '100vh',
          background: bgStyle,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}
      >
        <div
          ref={resultsCardRef}
          style={{
            maxWidth: '1066px',
            width: '100%',
            border: '1px solid rgba(0, 0, 0, 0.12)',
            borderRadius: '16px',
            backgroundColor: '#FFFFFF',
            padding: '48px',
            textAlign: 'left',
            position: 'relative'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', marginBottom: '48px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <h3
                style={{
                  textTransform: 'uppercase',
                  fontFamily,
                  fontWeight: 500,
                  fontSize: '11px',
                  letterSpacing: '11px',
                  color: '#4A5565',
                  marginBottom: '18px',
                  backgroundColor: 'rgba(168, 171, 255, 0.36)',
                  padding: '2px 10px'
                }}
              >
                Your result
              </h3>

              <h2
                style={{
                  fontFamily,
                  fontWeight: 500,
                  fontSize: '48px',
                  letterSpacing: '-0.02em',
                  color: '#201515',
                  marginBottom: '18px'
                }}
              >
                {maturityLevel}
              </h2>

              {maturityLevel === 'Reactive IT' && (
                <p style={{ fontFamily, fontWeight: 400, fontSize: '18px', letterSpacing: '-0.004em', color: '#201515', lineHeight: 1.6, marginBottom: '18px' }}>
                  Your agents are handling work that AI and automation could deflect. Every ticket deflected saves 15-30 minutes of agent time.
                </p>
              )}

              {maturityLevel === 'Structured IT' && (
                <p style={{ fontFamily, fontWeight: 400, fontSize: '18px', letterSpacing: '-0.004em', color: '#201515', lineHeight: 1.6, marginBottom: '18px' }}>
                  You've started deflecting easy stuff, but agents still spend significant time on automatable work with manual handoffs between systems.
                </p>
              )}

              {maturityLevel === 'Optimized IT' && (
                <p style={{ fontFamily, fontWeight: 400, fontSize: '18px', letterSpacing: '-0.004em', color: '#201515', lineHeight: 1.6, marginBottom: '18px' }}>
                  You've automated the routine. Agents focus on work that genuinely requires expertise—complex troubleshooting, architecture, strategic initiatives.
                </p>
              )}

              <button
                data-html2canvas-ignore
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('showReport', {
                    detail: {
                      maturityLevel: maturityLevel,
                      score: totalScore,
                      email: email,
                      answers: answers,
                      selectedGoal: answers[3],
                      timestamp: new Date().toISOString()
                    }
                  }));
                }}
                style={{
                  fontFamily,
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  backgroundColor: '#8040F0',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '18px 28px',
                  cursor: 'pointer',
                  transition: 'background-color 200ms ease',
                  minWidth: '320px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6F35D1'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8040F0'}
              >
                Read the complete guide {'->'}
              </button>

              {isReturningUser && (
                <button
                  data-html2canvas-ignore
                  onClick={handleRetakeQuiz}
                  style={{
                    fontFamily,
                    fontSize: '20px',
                    fontWeight: 600,
                    color: '#4A5565',
                    backgroundColor: 'transparent',
                    border: '1px solid #D9D9D9',
                    borderRadius: '8px',
                    padding: '18px 28px',
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                    marginTop: '12px',
                    minWidth: '320px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#9966FF';
                    e.currentTarget.style.color = '#9966FF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#D9D9D9';
                    e.currentTarget.style.color = '#4A5565';
                  }}
                >
                  Retake Quiz
                </button>
              )}
            </div>

            {/* SVG Visualization */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0px' }}>
              {/* Optimized IT */}
              <div style={{ position: 'relative', marginBottom: '-85px', zIndex: 3 }}>
                <svg width="273" height="165" viewBox="0 0 273 165" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="156.941" height="156.941" rx="15.3299" transform="matrix(0.866025 -0.5 0.866025 0.5 0.309082 86.1445)" fill={`url(#${gradientIds.result1_0})`} stroke="#272727" strokeWidth="0.306599" strokeLinecap="round" strokeDasharray="3.07 3.07"/>
                  <rect width="156.941" height="156.941" rx="15.3299" transform="matrix(0.866025 -0.5 0.866025 0.5 0 78.4688)" fill={`url(#${gradientIds.result1_1})`} stroke="#B2B2B2" strokeWidth="0.383248" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id={gradientIds.result1_0} x1="78.4703" y1="0" x2="78.4703" y2="156.941" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#D8D8D8"/><stop offset="0.504808" stopColor="white"/><stop offset="1" stopColor="#D8D8D8"/>
                    </linearGradient>
                    <linearGradient id={gradientIds.result1_1} x1="152.683" y1="4.12785" x2="-0.317485" y2="157.128" gradientUnits="userSpaceOnUse">
                      <stop offset="0.226929" stopColor={maturityLevel === 'Optimized IT' ? '#4AB583' : '#B8B8B8'}/><stop offset="1" stopColor={maturityLevel === 'Optimized IT' ? '#CEFFDE' : '#E8E8E8'}/>
                    </linearGradient>
                  </defs>
                </svg>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontFamily, fontWeight: 700, fontSize: '18px', letterSpacing: '-0.015em', color: maturityLevel === 'Optimized IT' ? '#FFFFFF' : '#868686', transition: 'color 300ms ease' }}>
                  Optimized IT
                </div>
              </div>

              {/* Structured IT */}
              <div style={{ position: 'relative', marginBottom: '-110px', zIndex: 2 }}>
                <svg width="334" height="201" viewBox="0 0 334 201" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="192.376" height="192.376" rx="15.3299" transform="matrix(0.866025 -0.5 0.866025 0.5 0.147461 104.18)" fill={`url(#${gradientIds.result2_0})`} stroke="#272727" strokeWidth="0.306599" strokeLinecap="round" strokeDasharray="3.07 3.07"/>
                  <rect width="192.376" height="192.376" rx="15.3299" transform="matrix(0.866025 -0.5 0.866025 0.5 0 96.1875)" fill={`url(#${gradientIds.result2_1})`} stroke="#B2B2B2" strokeWidth="0.383248" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id={gradientIds.result2_0} x1="96.188" y1="0" x2="96.188" y2="192.376" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#D8D8D8"/><stop offset="0.504808" stopColor="white"/><stop offset="1" stopColor="#D8D8D8"/>
                    </linearGradient>
                    <linearGradient id={gradientIds.result2_1} x1="187.157" y1="5.05987" x2="-0.38917" y2="192.606" gradientUnits="userSpaceOnUse">
                      <stop offset="0.226929" stopColor={maturityLevel === 'Structured IT' ? '#392064' : '#808080'}/><stop offset="1" stopColor={maturityLevel === 'Structured IT' ? '#8E7BFF' : '#C8C8C8'}/>
                    </linearGradient>
                  </defs>
                </svg>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontFamily, fontWeight: 700, fontSize: '18px', letterSpacing: '-0.015em', color: maturityLevel === 'Structured IT' ? '#FFFFFF' : '#868686', transition: 'color 300ms ease' }}>
                  Structured IT
                </div>
              </div>

              {/* Reactive IT */}
              <div style={{ position: 'relative', zIndex: 1 }}>
                <svg width="418" height="253" viewBox="0 0 418 253" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="241.044" height="241.044" rx="15.3299" transform="matrix(0.866025 -0.5 0.866025 0.5 0 131.535)" fill={`url(#${gradientIds.result3_0})`} stroke="#272727" strokeWidth="0.306599" strokeLinecap="round" strokeDasharray="3.07 3.07"/>
                  <path d="M13.2761 128.184C5.94391 123.951 5.94391 117.088 13.2761 112.855L195.475 7.66227C202.807 3.42903 214.695 3.42903 222.027 7.66227L404.225 112.855C411.557 117.088 411.557 123.951 404.225 128.184L222.027 233.377C214.695 237.61 202.807 237.61 195.475 233.377L13.2761 128.184Z" fill={`url(#${gradientIds.result3_1})`} stroke="#B2B2B2" strokeWidth="0.383248" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id={gradientIds.result3_0} x1="120.522" y1="0" x2="120.522" y2="241.044" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#D8D8D8"/><stop offset="0.504808" stopColor="white"/><stop offset="1" stopColor="#D8D8D8"/>
                    </linearGradient>
                    <linearGradient id={gradientIds.result3_1} x1="208.577" y1="6.43726" x2="208.577" y2="241.429" gradientUnits="userSpaceOnUse">
                      <stop offset="0.226929" stopColor={maturityLevel === 'Reactive IT' ? '#392064' : '#808080'}/><stop offset="1" stopColor={maturityLevel === 'Reactive IT' ? '#8E7BFF' : '#C8C8C8'}/>
                    </linearGradient>
                  </defs>
                </svg>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontFamily, fontWeight: 700, fontSize: '18px', letterSpacing: '-0.015em', color: maturityLevel === 'Reactive IT' ? '#FFFFFF' : '#868686', transition: 'color 300ms ease' }}>
                  Reactive IT
                </div>
              </div>
            </div>
          </div>

          {/* Divider line */}
          <div style={{ width: '100%', height: '1px', backgroundColor: '#D9D9D9', marginTop: '32px', marginBottom: '32px' }}></div>

          {/* Goal-Based Recommendations */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '32px' }}>
            <h3
              style={{
                textTransform: 'uppercase',
                fontFamily,
                fontWeight: 500,
                fontSize: '11px',
                letterSpacing: '11px',
                color: '#4A5565',
                backgroundColor: 'rgba(201, 201, 201, 0.36)',
                padding: '2px 10px'
              }}
            >
              Goal-Based Recommendations
            </h3>
          </div>

          {/* Recommendations based on maturity level and goal */}
          {renderRecommendations(maturityLevel, answers[3], fontFamily)}

          {/* Download Button - Bottom Right */}
          <button
            data-html2canvas-ignore
            onClick={handleDownloadResult}
            disabled={isCapturing}
            title="Download result as image"
            style={{
              position: 'absolute',
              bottom: '16px',
              right: '16px',
              width: '44px',
              height: '44px',
              borderRadius: '8px',
              border: '1px solid #D9D9D9',
              backgroundColor: '#FFFFFF',
              cursor: isCapturing ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 200ms ease',
              opacity: isCapturing ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
              if (!isCapturing) {
                e.currentTarget.style.borderColor = '#9966FF';
                e.currentTarget.style.backgroundColor = '#F9F5FF';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#D9D9D9';
              e.currentTarget.style.backgroundColor = '#FFFFFF';
            }}
          >
            {isCapturing ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ animation: 'spin 1s linear infinite' }}>
                <circle cx="12" cy="12" r="10" stroke="#9966FF" strokeWidth="2" strokeDasharray="31.4 31.4" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="#4A5565" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 10L12 15L17 10" stroke="#4A5565" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 15V3" stroke="#4A5565" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    );
  }

  const question = quizData[currentQuestion];

  return (
    <div
      className="flex items-center justify-center p-4"
      style={{ minHeight: isWebflow ? undefined : '100vh', background: bgStyle }}
    >
      <div
        style={{
          maxWidth: '1066px',
          width: '100%',
          border: '1px solid rgba(0, 0, 0, 0.12)',
          borderRadius: '16px',
          backgroundColor: '#FFFFFF',
          padding: '64px'
        }}
      >
        {/* Progress Bar */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontFamily, fontWeight: 500, fontSize: '14px', color: '#201515', letterSpacing: '-0.15px' }}>
              Step {currentQuestion + 1} of {quizData.length}
            </span>
            <span style={{ fontFamily, fontWeight: 500, fontSize: '14px', color: '#201515', letterSpacing: '-0.15px' }}>
              {Math.round(progress)}%
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {quizData.map((_, index) => (
              <div
                key={index}
                style={{
                  flex: 1,
                  height: '8px',
                  borderRadius: '0px',
                  backgroundColor: index <= currentQuestion ? '#F37052' : '#D9D9D9',
                  transition: 'background-color 300ms ease-in-out'
                }}
              />
            ))}
          </div>
        </div>

        {/* Question content */}
        <div style={{ transition: 'opacity 300ms ease-in-out', opacity: isTransitioning ? 0 : 1 }}>
          <h2
            style={{
              fontFamily,
              fontSize: '48px',
              fontWeight: 400,
              letterSpacing: '-0.96px',
              color: '#201515',
              lineHeight: 1.3,
              marginBottom: '48px'
            }}
          >
            {question.question}
          </h2>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '94px' }}>
            {question.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option.value)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '20px 24px',
                  borderRadius: '10px',
                  border: selectedOption === option.value ? '1px solid #9966FF' : '1px solid #D9D9D9',
                  background: selectedOption === option.value
                    ? 'linear-gradient(to right, #9966FF, #FF8FA3)'
                    : '#FFFFFF',
                  color: selectedOption === option.value ? '#FFFFFF' : '#201515',
                  fontFamily,
                  fontSize: '18px',
                  fontWeight: 400,
                  letterSpacing: '-0.072px',
                  lineHeight: 1.5,
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    border: selectedOption === option.value ? '2px solid #FFFFFF' : '2px solid #D9D9D9',
                    backgroundColor: selectedOption === option.value ? 'transparent' : '#FFFFFF',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {selectedOption === option.value && (
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#FFFFFF' }} />
                  )}
                </div>
                <span>{option.text}</span>
              </button>
            ))}
          </div>

          {/* Back Button */}
          {currentQuestion > 0 && (
            <button
              onClick={handlePrevious}
              style={{
                padding: '16px 40px',
                borderRadius: '8px',
                border: '1px solid #C1C1C1',
                backgroundColor: '#FFFFFF',
                color: '#201515',
                fontFamily,
                fontSize: '16px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 200ms ease'
              }}
            >
              Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function to render recommendations
function renderRecommendations(maturityLevel: string, goal: string, fontFamily: string) {
  const recommendations: Record<string, Record<string, { priority: string; insight: string }>> = {
    'Reactive IT': {
      'option_1': {
        priority: 'Simple AI deflection, fast implementation, low admin overhead',
        insight: 'At 1,000 deflectable tickets/month, effective AI can reclaim 250-500 hours of agent time.',
      },
      'option_2': {
        priority: 'Slack/Teams-native, consumer-simple UX, mobile-first',
        insight: "Employees shouldn't need training to get help. Meet them where they already work.",
      },
      'option_3': {
        priority: 'Start with deflection before workflow automation',
        insight: "Reduce volume first—then you'll have capacity to build automation.",
      },
      'option_4': {
        priority: 'Quick wins with AI deflection to build momentum',
        insight: 'Demonstrate ROI with measurable ticket reduction before larger transformation.',
      },
    },
    'Structured IT': {
      'option_1': {
        priority: 'Production-ready AI with proven deflection rates, workflow automation',
        insight: 'Every automated workflow saves 10-20 minutes per execution.',
      },
      'option_2': {
        priority: 'Seamless handoffs, proactive notifications, self-service workflows',
        insight: 'Employees feel the friction of manual handoffs. Smooth the edges.',
      },
      'option_3': {
        priority: 'ESM capabilities, low-code workflows, strong integrations',
        insight: 'Extend service management beyond IT without proportional headcount.',
      },
      'option_4': {
        priority: 'API-first platforms that integrate with your ecosystem',
        insight: 'Avoid rip-and-replace. Composable platforms let you modernize incrementally.',
      },
    },
    'Optimized IT': {
      'option_1': {
        priority: 'Advanced AI for edge cases, predictive capabilities',
        insight: "You've handled the obvious—now tackle the long tail.",
      },
      'option_2': {
        priority: 'Proactive service, personalization, cross-department consistency',
        insight: 'Move from reactive to anticipatory service delivery.',
      },
      'option_3': {
        priority: 'Federated architecture, enterprise-wide ESM',
        insight: 'Your model works—now extend it systematically across the organization.',
      },
      'option_4': {
        priority: 'Composable architecture, consumption analytics, transparent TCO',
        insight: 'Value shifts from cost reduction to capacity creation for strategic work.',
      },
    },
  };

  const rec = recommendations[maturityLevel]?.[goal];
  if (!rec) return null;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
      <div style={{ borderLeft: '2px solid #A182FF', paddingLeft: '16px' }}>
        <div style={{ fontFamily, fontWeight: 500, fontSize: '18px', color: '#101828', letterSpacing: '-0.005em', marginBottom: '8px' }}>Priority</div>
        <div style={{ fontFamily, fontWeight: 500, fontSize: '14px', color: '#201515', letterSpacing: '-0.0015em', textWrap: 'balance' } as React.CSSProperties}>{rec.priority}</div>
      </div>
      <div style={{ borderLeft: '2px solid #A182FF', paddingLeft: '16px' }}>
        <div style={{ fontFamily, fontWeight: 500, fontSize: '18px', color: '#101828', letterSpacing: '-0.005em', marginBottom: '8px' }}>Insight</div>
        <div style={{ fontFamily, fontWeight: 500, fontSize: '14px', color: '#201515', letterSpacing: '-0.0015em', textWrap: 'balance' } as React.CSSProperties}>{rec.insight}</div>
      </div>
    </div>
  );
}
