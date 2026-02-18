import React, { useState } from 'react';
import { declareComponent } from '@webflow/react';
import { submitToHubSpot, getAnswerText } from '../utils/hubspot';
import OnboardingScreen from './OnboardingScreen';

interface QuizOption {
  id: string;
  text: string;
  value: string;
  score?: number; // Optional score for questions 1-3
}

interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
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

function ITMaturityQuiz() {
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

  // HubSpot configuration - REPLACE WITH YOUR VALUES
  const HUBSPOT_CONFIG = {
    portalId: 'YOUR_PORTAL_ID', // Replace with your HubSpot Portal ID
    formId: 'YOUR_FORM_ID',     // Replace with your HubSpot Form ID
  };

  const progress = ((currentQuestion + 1) / quizData.length) * 100;

  const handleStartQuiz = () => {
    setShowOnboarding(false);
  };

  const handleOptionSelect = (optionValue: string) => {
    setSelectedOption(optionValue);

    // Auto-advance to next question after 400ms
    setTimeout(() => {
      setIsTransitioning(true);

      setTimeout(() => {
        // Save the answer
        setAnswers({ ...answers, [currentQuestion]: optionValue });

        // Move to next question or complete
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

  // Restart function - kept for future use
  // const handleRestart = () => {
  //   setCurrentQuestion(0);
  //   setAnswers({});
  //   setSelectedOption('');
  //   setIsComplete(false);
  //   setEmail('');
  //   setEmailSubmitted(false);
  //   setEmailError('');
  // };

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
      // Calculate results
      const score = calculateScore();
      const maturityLevel = getResultMessage(score);

      // Send to HubSpot
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
        console.log('✅ Data submitted to HubSpot successfully');
      } else {
        console.warn('⚠️ HubSpot submission failed:', result.error);
        // Continue anyway - don't block user from seeing results
      }
    } catch (error) {
      console.error('HubSpot submission error:', error);
      // Continue anyway - don't block user from seeing results
    } finally {
      setIsSubmitting(false);
    }

    setEmailSubmitted(true);

    // Dispatch custom event to unlock TOC in Webflow
    window.dispatchEvent(new CustomEvent('unlockTOC', {
      detail: {
        email: email,
        maturityLevel: getResultMessage(calculateScore()),
        score: calculateScore(),
        timestamp: new Date().toISOString(),
        quizCompleted: true
      }
    }));
  };

  // Calculate total score from questions 1-3
  const calculateScore = () => {
    let totalScore = 0;

    // Only calculate score for questions 0, 1, 2 (questions 1-3)
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

  // Get result message based on score
  const getResultMessage = (score: number) => {
    if (score >= 3 && score <= 5) {
      return 'Reactive IT';
    } else if (score >= 6 && score <= 7) {
      return 'Structured IT';
    } else {
      return 'Optimized IT';
    }
  };

  // Show onboarding screen first
  if (showOnboarding) {
    return (
      <div
        className="flex items-center justify-center p-4"
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #F9F5FF 0%, #FFFFFF 100%)'
        }}
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
          <OnboardingScreen onStart={handleStartQuiz} />
        </div>
      </div>
    );
  }

  if (isComplete && !emailSubmitted) {
    // Show results preview (blurred) with email overlay
    const totalScore = calculateScore();
    const maturityLevel = getResultMessage(totalScore);

    return (
      <div
        style={{
          position: 'relative',
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #F9F5FF 0%, #FFFFFF 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}
      >
        {/* Blurred results preview in background */}
        <div
          style={{
            maxWidth: '1066px',
            width: '100%',
            border: '1px solid rgba(0, 0, 0, 0.12)',
            borderRadius: '16px',
            backgroundColor: '#FFFFFF',
            padding: '48px',
            filter: 'blur(8px)',
            pointerEvents: 'none'
          }}
        >
          <h2
            style={{
              fontFamily: 'Inter Display',
              fontSize: '48px',
              fontWeight: 500,
              color: '#201515',
              textAlign: 'center',
              marginBottom: '24px'
            }}
          >
            You're at {maturityLevel}
          </h2>
          <p style={{ textAlign: 'center', fontSize: '18px', color: '#666' }}>
            Your results are ready...
          </p>
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
              fontFamily: 'Inter Display',
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
            {/* Name field */}
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
                  fontFamily: 'Inter',
                  fontSize: '16px',
                  color: '#201515',
                  outline: 'none',
                  transition: 'border 200ms ease'
                }}
                onFocus={(e) => e.target.style.border = '1px solid #9966FF'}
                onBlur={(e) => e.target.style.border = '1px solid #D9D9D9'}
              />
            </div>

            {/* Email field */}
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
                  fontFamily: 'Inter',
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
                <p style={{ color: '#FF0000', fontSize: '14px', marginTop: '8px', fontFamily: 'Inter' }}>
                  {emailError}
                </p>
              )}
            </div>

            {/* Submit button */}
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
                fontFamily: 'Inter',
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
    // Show results after email is submitted
    const totalScore = calculateScore();
    const maturityLevel = getResultMessage(totalScore);

    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #F9F5FF 0%, #FFFFFF 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}
      >
        <div
          style={{
            maxWidth: '1066px',
            width: '100%',
            border: '1px solid rgba(0, 0, 0, 0.12)',
            borderRadius: '16px',
            backgroundColor: '#FFFFFF',
            padding: '48px',
            textAlign: 'center'
          }}
        >
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg
                className="w-10 h-10 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            {/* Result Level */}
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              You're at {maturityLevel}
            </h2>

            {/* Description based on maturity level */}
            {maturityLevel === 'Reactive IT' && (
              <div className="max-w-xl mx-auto mb-8">
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Your agents are handling work that AI and automation could deflect. Every ticket deflected saves 15-30 minutes of agent time.
                </p>

                <div className="bg-gray-50 rounded-xl p-6 text-left">
                  <h3 className="font-bold text-gray-900 mb-4">Ticket Composition:</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="mb-1">
                        <span className="font-semibold text-gray-700">Deflectable:</span>
                        <span className="text-gray-600">40-50% of tickets handled manually</span>
                      </div>
                    </div>
                    <div>
                      <div className="mb-1">
                        <span className="font-semibold text-gray-700">Automatable:</span>
                        <span className="text-gray-600">20-30% requiring human routing</span>
                      </div>
                    </div>
                    <div>
                      <div className="mb-1">
                        <span className="font-semibold text-gray-700">Expert:</span>
                        <span className="text-gray-600">30-40% but agents rarely get to focus here</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Show additional content based on question 4 answer */}
                {answers[3] === 'option_1' && (
                  <div className="bg-primary-50 rounded-xl p-6 text-left mt-6 border-2 border-primary-200">
                    <div className="mb-3">
                      <span className="font-bold text-gray-900">Priority: </span>
                      <span className="text-gray-700">Simple AI deflection, fast implementation, low admin overhead</span>
                    </div>
                    <div>
                      <span className="font-bold text-gray-900">Insight: </span>
                      <span className="text-gray-700">At 1,000 deflectable tickets/month, effective AI can reclaim 250-500 hours of agent time.</span>
                    </div>
                  </div>
                )}

                {answers[3] === 'option_2' && (
                  <div className="bg-primary-50 rounded-xl p-6 text-left mt-6 border-2 border-primary-200">
                    <div className="mb-3">
                      <span className="font-bold text-gray-900">Priority: </span>
                      <span className="text-gray-700">Slack/Teams-native, consumer-simple UX, mobile-first</span>
                    </div>
                    <div>
                      <span className="font-bold text-gray-900">Insight: </span>
                      <span className="text-gray-700">Employees shouldn't need training to get help. Meet them where they already work.</span>
                    </div>
                  </div>
                )}

                {answers[3] === 'option_3' && (
                  <div className="bg-primary-50 rounded-xl p-6 text-left mt-6 border-2 border-primary-200">
                    <div className="mb-3">
                      <span className="font-bold text-gray-900">Priority: </span>
                      <span className="text-gray-700">Start with deflection before workflow automation</span>
                    </div>
                    <div>
                      <span className="font-bold text-gray-900">Insight: </span>
                      <span className="text-gray-700">Reduce volume first—then you'll have capacity to build automation.</span>
                    </div>
                  </div>
                )}

                {answers[3] === 'option_4' && (
                  <div className="bg-primary-50 rounded-xl p-6 text-left mt-6 border-2 border-primary-200">
                    <div className="mb-3">
                      <span className="font-bold text-gray-900">Priority: </span>
                      <span className="text-gray-700">Quick wins with AI deflection to build momentum</span>
                    </div>
                    <div>
                      <span className="font-bold text-gray-900">Insight: </span>
                      <span className="text-gray-700">Demonstrate ROI with measurable ticket reduction before larger transformation.</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {maturityLevel === 'Structured IT' && (
              <div className="max-w-xl mx-auto mb-8">
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  You've started deflecting easy stuff, but agents still spend significant time on automatable work with manual handoffs between systems.
                </p>

                <div className="bg-gray-50 rounded-xl p-6 text-left">
                  <h3 className="font-bold text-gray-900 mb-4">Ticket Composition:</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="mb-1">
                        <span className="font-semibold text-gray-700">Deflectable:</span>
                        <span className="text-gray-600">30-50% now deflected</span>
                      </div>
                    </div>
                    <div>
                      <div className="mb-1">
                        <span className="font-semibold text-gray-700">Automatable:</span>
                        <span className="text-gray-600">Still mostly manual execution</span>
                      </div>
                    </div>
                    <div>
                      <div className="mb-1">
                        <span className="font-semibold text-gray-700">Expert:</span>
                        <span className="text-gray-600">Agents have more capacity but still interrupted</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Show additional content based on question 4 answer */}
                {answers[3] === 'option_1' && (
                  <div className="bg-primary-50 rounded-xl p-6 text-left mt-6 border-2 border-primary-200">
                    <div className="mb-3">
                      <span className="font-bold text-gray-900">Priority: </span>
                      <span className="text-gray-700">Production-ready AI with proven deflection rates, workflow automation</span>
                    </div>
                    <div>
                      <span className="font-bold text-gray-900">Insight: </span>
                      <span className="text-gray-700">Every automated workflow saves 10-20 minutes per execution.</span>
                    </div>
                  </div>
                )}

                {answers[3] === 'option_2' && (
                  <div className="bg-primary-50 rounded-xl p-6 text-left mt-6 border-2 border-primary-200">
                    <div className="mb-3">
                      <span className="font-bold text-gray-900">Priority: </span>
                      <span className="text-gray-700">Seamless handoffs, proactive notifications, self-service workflows</span>
                    </div>
                    <div>
                      <span className="font-bold text-gray-900">Insight: </span>
                      <span className="text-gray-700">Employees feel the friction of manual handoffs. Smooth the edges.</span>
                    </div>
                  </div>
                )}

                {answers[3] === 'option_3' && (
                  <div className="bg-primary-50 rounded-xl p-6 text-left mt-6 border-2 border-primary-200">
                    <div className="mb-3">
                      <span className="font-bold text-gray-900">Priority: </span>
                      <span className="text-gray-700">ESM capabilities, low-code workflows, strong integrations</span>
                    </div>
                    <div>
                      <span className="font-bold text-gray-900">Insight: </span>
                      <span className="text-gray-700">Extend service management beyond IT without proportional headcount.</span>
                    </div>
                  </div>
                )}

                {answers[3] === 'option_4' && (
                  <div className="bg-primary-50 rounded-xl p-6 text-left mt-6 border-2 border-primary-200">
                    <div className="mb-3">
                      <span className="font-bold text-gray-900">Priority: </span>
                      <span className="text-gray-700">API-first platforms that integrate with your ecosystem</span>
                    </div>
                    <div>
                      <span className="font-bold text-gray-900">Insight: </span>
                      <span className="text-gray-700">Avoid rip-and-replace. Composable platforms let you modernize incrementally.</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {maturityLevel === 'Optimized IT' && (
              <div className="max-w-xl mx-auto mb-8">
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  You've automated the routine. Agents focus on work that genuinely requires expertise—complex troubleshooting, architecture, strategic initiatives.
                </p>

                <div className="bg-gray-50 rounded-xl p-6 text-left">
                  <h3 className="font-bold text-gray-900 mb-4">Ticket Composition:</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="mb-1">
                        <span className="font-semibold text-gray-700">Deflectable:</span>
                        <span className="text-gray-600">80-90% autonomously resolved</span>
                      </div>
                    </div>
                    <div>
                      <div className="mb-1">
                        <span className="font-semibold text-gray-700">Automatable:</span>
                        <span className="text-gray-600">60-80% handled by workflows</span>
                      </div>
                    </div>
                    <div>
                      <div className="mb-1">
                        <span className="font-semibold text-gray-700">Expert:</span>
                        <span className="text-gray-600">Agents spend 70%+ of time here</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Show additional content based on question 4 answer */}
                {answers[3] === 'option_1' && (
                  <div className="bg-primary-50 rounded-xl p-6 text-left mt-6 border-2 border-primary-200">
                    <div className="mb-3">
                      <span className="font-bold text-gray-900">Priority: </span>
                      <span className="text-gray-700">Advanced AI for edge cases, predictive capabilities</span>
                    </div>
                    <div>
                      <span className="font-bold text-gray-900">Insight: </span>
                      <span className="text-gray-700">You've handled the obvious—now tackle the long tail.</span>
                    </div>
                  </div>
                )}

                {answers[3] === 'option_2' && (
                  <div className="bg-primary-50 rounded-xl p-6 text-left mt-6 border-2 border-primary-200">
                    <div className="mb-3">
                      <span className="font-bold text-gray-900">Priority: </span>
                      <span className="text-gray-700">Proactive service, personalization, cross-department consistency</span>
                    </div>
                    <div>
                      <span className="font-bold text-gray-900">Insight: </span>
                      <span className="text-gray-700">Move from reactive to anticipatory service delivery.</span>
                    </div>
                  </div>
                )}

                {answers[3] === 'option_3' && (
                  <div className="bg-primary-50 rounded-xl p-6 text-left mt-6 border-2 border-primary-200">
                    <div className="mb-3">
                      <span className="font-bold text-gray-900">Priority: </span>
                      <span className="text-gray-700">Federated architecture, enterprise-wide ESM</span>
                    </div>
                    <div>
                      <span className="font-bold text-gray-900">Insight: </span>
                      <span className="text-gray-700">Your model works—now extend it systematically across the organization.</span>
                    </div>
                  </div>
                )}

                {answers[3] === 'option_4' && (
                  <div className="bg-primary-50 rounded-xl p-6 text-left mt-6 border-2 border-primary-200">
                    <div className="mb-3">
                      <span className="font-bold text-gray-900">Priority: </span>
                      <span className="text-gray-700">Composable architecture, consumption analytics, transparent TCO</span>
                    </div>
                    <div>
                      <span className="font-bold text-gray-900">Insight: </span>
                      <span className="text-gray-700">Value shifts from cost reduction to capacity creation for strategic work.</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Action Button */}
            <div className="mt-8">
              <button
                onClick={() => {
                  // Dispatch custom event to communicate with Webflow
                  window.dispatchEvent(new CustomEvent('showReport', {
                    detail: {
                      maturityLevel: maturityLevel,
                      score: totalScore,
                      email: email,
                      answers: answers,
                      selectedGoal: answers[3], // Question 4 answer
                      timestamp: new Date().toISOString()
                    }
                  }));
                  console.log('Report event dispatched:', {
                    maturityLevel,
                    score: totalScore,
                    selectedGoal: answers[3]
                  });

                  // Auto-scroll to first section of report
                  setTimeout(() => {
                    const firstSection = document.querySelector('#section-intro');
                    if (firstSection) {
                      firstSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                      });
                    }
                  }, 150);
                }}
                className="bg-primary-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-700 transition-colors"
              >
                Read the report
              </button>
            </div>
          </div>
      </div>
    );
  }

  const question = quizData[currentQuestion];

  return (
    <div
      className="flex items-center justify-center p-4"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #F9F5FF 0%, #FFFFFF 100%)'
      }}
    >
      <div
        style={{
          maxWidth: '1066px',
          width: '100%',
          border: '1px solid rgba(0, 0, 0, 0.12)',
          borderRadius: '16px',
          backgroundColor: '#FFFFFF',
          padding: '64px',
          transition: 'opacity 300ms ease-in-out',
          opacity: isTransitioning ? 0 : 1
        }}
      >
        {/* Segmented Progress Bar */}
        <div style={{ marginBottom: '48px' }}>
          {/* Step count and percentage */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span
              style={{
                fontFamily: 'Inter',
                fontWeight: 500,
                fontSize: '14px',
                color: '#201515',
                letterSpacing: '-0.15px'
              }}
            >
              Step {currentQuestion + 1} of {quizData.length}
            </span>
            <span
              style={{
                fontFamily: 'Inter',
                fontWeight: 500,
                fontSize: '14px',
                color: '#201515',
                letterSpacing: '-0.15px'
              }}
            >
              {Math.round(progress)}%
            </span>
          </div>
          {/* Progress bars */}
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

        {/* Question */}
        <div>
          <h2
            style={{
              fontFamily: 'Inter Display',
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
                  fontFamily: 'Inter',
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
                {/* Radio button */}
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
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: '#FFFFFF'
                      }}
                    />
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
                fontFamily: 'Inter',
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

// Export as Webflow Code Component
export default declareComponent(ITMaturityQuiz, {
  name: 'ITMaturityQuiz',
  description: 'Interactive questionnaire to assess IT maturity level with scoring and personalized recommendations',
  group: 'Interactive'
});
