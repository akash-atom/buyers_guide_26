import React, { useState } from 'react';
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

export default function Quiz() {
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
        {/* Blurred results preview in background - actual results content */}
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
            {/* First Row - 2 Column Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', marginBottom: '48px' }}>
              {/* Left Column - Content */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                {/* "Your result" heading */}
                <h3
                  style={{
                    textTransform: 'uppercase',
                    fontFamily: 'Inter',
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

                {/* Maturity Level */}
                <h2
                  style={{
                    fontFamily: 'Inter Display',
                    fontWeight: 500,
                    fontSize: '48px',
                    letterSpacing: '-0.02em',
                    color: '#201515',
                    marginBottom: '18px'
                  }}
                >
                  {maturityLevel}
                </h2>

                {/* Description based on maturity level */}
                {maturityLevel === 'Reactive IT' && (
                  <p
                    style={{
                      fontFamily: 'Inter Display',
                      fontWeight: 400,
                      fontSize: '18px',
                      letterSpacing: '-0.004em',
                      color: '#201515',
                      lineHeight: 1.6,
                      marginBottom: '18px'
                    }}
                  >
                    Your agents are handling work that AI and automation could deflect. Every ticket deflected saves 15-30 minutes of agent time.
                  </p>
                )}

                {maturityLevel === 'Structured IT' && (
                  <p
                    style={{
                      fontFamily: 'Inter Display',
                      fontWeight: 400,
                      fontSize: '18px',
                      letterSpacing: '-0.004em',
                      color: '#201515',
                      lineHeight: 1.6,
                      marginBottom: '18px'
                    }}
                  >
                    You've started deflecting easy stuff, but agents still spend significant time on automatable work with manual handoffs between systems.
                  </p>
                )}

                {maturityLevel === 'Optimized IT' && (
                  <p
                    style={{
                      fontFamily: 'Inter Display',
                      fontWeight: 400,
                      fontSize: '18px',
                      letterSpacing: '-0.004em',
                      color: '#201515',
                      lineHeight: 1.6,
                      marginBottom: '18px'
                    }}
                  >
                    You've automated the routine. Agents focus on work that genuinely requires expertise—complex troubleshooting, architecture, strategic initiatives.
                  </p>
                )}

                {/* CTA Button placeholder */}
                <div
                  style={{
                    fontFamily: 'Inter',
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

              {/* Right Column - SVG Visualization placeholder */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0px' }}>
                {/* Optimized IT - Top */}
                <div style={{ filter: maturityLevel === 'Optimized IT' ? 'none' : 'saturate(0.2) brightness(1.3) contrast(0.8)', position: 'relative', marginBottom: '-85px', zIndex: 3 }}>
                  <svg width="273" height="165" viewBox="0 0 273 165" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="156.941" height="156.941" rx="15.3299" transform="matrix(0.866025 -0.5 0.866025 0.5 0.309082 86.1445)" fill="url(#paint0_linear_preview1)" stroke="#272727" strokeWidth="0.306599" strokeLinecap="round" strokeDasharray="3.07 3.07"/>
                    <rect width="156.941" height="156.941" rx="15.3299" transform="matrix(0.866025 -0.5 0.866025 0.5 0 78.4688)" fill="url(#paint1_linear_preview1)" stroke="#B2B2B2" strokeWidth="0.383248" strokeLinecap="round"/>
                    <defs>
                      <linearGradient id="paint0_linear_preview1" x1="78.4703" y1="0" x2="78.4703" y2="156.941" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#D8D8D8"/>
                        <stop offset="0.504808" stopColor="white"/>
                        <stop offset="1" stopColor="#D8D8D8"/>
                      </linearGradient>
                      <linearGradient id="paint1_linear_preview1" x1="152.683" y1="4.12785" x2="-0.317485" y2="157.128" gradientUnits="userSpaceOnUse">
                        <stop offset="0.226929" stopColor="#4AB583"/>
                        <stop offset="1" stopColor="#CEFFDE"/>
                      </linearGradient>
                    </defs>
                  </svg>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontFamily: 'Inter', fontWeight: 700, fontSize: '18px', letterSpacing: '-0.015em', color: maturityLevel === 'Optimized IT' ? '#FFFFFF' : '#868686' }}>
                    Optimized IT
                  </div>
                </div>

                {/* Structured IT - Middle */}
                <div style={{ filter: maturityLevel === 'Structured IT' ? 'none' : 'saturate(0.2) brightness(1.3) contrast(0.8)', position: 'relative', marginBottom: '-110px', zIndex: 2 }}>
                  <svg width="334" height="201" viewBox="0 0 334 201" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="192.376" height="192.376" rx="15.3299" transform="matrix(0.866025 -0.5 0.866025 0.5 0.147461 104.18)" fill="url(#paint0_linear_preview2)" stroke="#272727" strokeWidth="0.306599" strokeLinecap="round" strokeDasharray="3.07 3.07"/>
                    <rect width="192.376" height="192.376" rx="15.3299" transform="matrix(0.866025 -0.5 0.866025 0.5 0 96.1875)" fill="url(#paint1_linear_preview2)" stroke="#B2B2B2" strokeWidth="0.383248" strokeLinecap="round"/>
                    <defs>
                      <linearGradient id="paint0_linear_preview2" x1="96.188" y1="0" x2="96.188" y2="192.376" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#D8D8D8"/>
                        <stop offset="0.504808" stopColor="white"/>
                        <stop offset="1" stopColor="#D8D8D8"/>
                      </linearGradient>
                      <linearGradient id="paint1_linear_preview2" x1="187.097" y1="5.05926" x2="-0.389069" y2="192.546" gradientUnits="userSpaceOnUse">
                        <stop offset="0.226929" stopColor="#9966FF"/>
                        <stop offset="1" stopColor="#E8DEFF"/>
                      </linearGradient>
                    </defs>
                  </svg>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontFamily: 'Inter', fontWeight: 700, fontSize: '18px', letterSpacing: '-0.015em', color: maturityLevel === 'Structured IT' ? '#FFFFFF' : '#868686' }}>
                    Structured IT
                  </div>
                </div>

                {/* Reactive IT - Bottom */}
                <div style={{ filter: maturityLevel === 'Reactive IT' ? 'none' : 'saturate(0.2) brightness(1.3) contrast(0.8)', position: 'relative', zIndex: 1 }}>
                  <svg width="395" height="237" viewBox="0 0 395 237" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="227.811" height="227.811" rx="15.3299" transform="matrix(0.866025 -0.5 0.866025 0.5 0.147461 122.18)" fill="url(#paint0_linear_preview3)" stroke="#272727" strokeWidth="0.306599" strokeLinecap="round" strokeDasharray="3.07 3.07"/>
                    <rect width="227.811" height="227.811" rx="15.3299" transform="matrix(0.866025 -0.5 0.866025 0.5 0 113.906)" fill="url(#paint1_linear_preview3)" stroke="#B2B2B2" strokeWidth="0.383248" strokeLinecap="round"/>
                    <defs>
                      <linearGradient id="paint0_linear_preview3" x1="113.906" y1="0" x2="113.906" y2="227.811" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#D8D8D8"/>
                        <stop offset="0.504808" stopColor="white"/>
                        <stop offset="1" stopColor="#D8D8D8"/>
                      </linearGradient>
                      <linearGradient id="paint1_linear_preview3" x1="221.523" y1="5.9891" x2="-0.460638" y2="227.973" gradientUnits="userSpaceOnUse">
                        <stop offset="0.226929" stopColor="#9966FF"/>
                        <stop offset="1" stopColor="#E8DEFF"/>
                      </linearGradient>
                    </defs>
                  </svg>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontFamily: 'Inter', fontWeight: 700, fontSize: '18px', letterSpacing: '-0.015em', color: maturityLevel === 'Reactive IT' ? '#FFFFFF' : '#868686' }}>
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
                  backgroundColor: '#FFFFFF',
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
            textAlign: 'left'
          }}
        >
            {/* First Row - 2 Column Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', marginBottom: '48px' }}>
              {/* Left Column - Content */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                {/* "Your result" heading */}
                <h3
                  style={{
                    textTransform: 'uppercase',
                    fontFamily: 'Inter',
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

                {/* Maturity Level */}
                <h2
                  style={{
                    fontFamily: 'Inter Display',
                    fontWeight: 500,
                    fontSize: '48px',
                    letterSpacing: '-0.02em',
                    color: '#201515',
                    marginBottom: '18px'
                  }}
                >
                  {maturityLevel}
                </h2>

                {/* Description based on maturity level */}
                {maturityLevel === 'Reactive IT' && (
                  <p
                    style={{
                      fontFamily: 'Inter Display',
                      fontWeight: 400,
                      fontSize: '18px',
                      letterSpacing: '-0.004em',
                      color: '#201515',
                      lineHeight: 1.6,
                      marginBottom: '18px'
                    }}
                  >
                    Your agents are handling work that AI and automation could deflect. Every ticket deflected saves 15-30 minutes of agent time.
                  </p>
                )}

                {maturityLevel === 'Structured IT' && (
                  <p
                    style={{
                      fontFamily: 'Inter Display',
                      fontWeight: 400,
                      fontSize: '18px',
                      letterSpacing: '-0.004em',
                      color: '#201515',
                      lineHeight: 1.6,
                      marginBottom: '18px'
                    }}
                  >
                    You've started deflecting easy stuff, but agents still spend significant time on automatable work with manual handoffs between systems.
                  </p>
                )}

                {maturityLevel === 'Optimized IT' && (
                  <p
                    style={{
                      fontFamily: 'Inter Display',
                      fontWeight: 400,
                      fontSize: '18px',
                      letterSpacing: '-0.004em',
                      color: '#201515',
                      lineHeight: 1.6,
                      marginBottom: '18px'
                    }}
                  >
                    You've automated the routine. Agents focus on work that genuinely requires expertise—complex troubleshooting, architecture, strategic initiatives.
                  </p>
                )}

                {/* CTA Button */}
                <button
                  onClick={() => {
                    // Dispatch custom event to communicate with Webflow
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
                  style={{
                    fontFamily: 'Inter',
                    fontSize: '20px',
                    fontWeight: 600,
                    color: '#FFFFFF',
                    backgroundColor: '#8040F0',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '18px 28px',
                    cursor: 'pointer',
                    transition: 'background-color 200ms ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6F35D1'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8040F0'}
                >
                  Read the complete guide {'->'}
                </button>
              </div>

              {/* Right Column - SVG Visualization - All 3 stacked */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0px' }}>
                {/* Optimized IT - Top */}
                <div style={{ filter: maturityLevel === 'Optimized IT' ? 'none' : 'saturate(0.2) brightness(1.3) contrast(0.8)', transition: 'filter 300ms ease', position: 'relative', marginBottom: '-85px', zIndex: 3 }}>
                  <svg width="273" height="165" viewBox="0 0 273 165" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="156.941" height="156.941" rx="15.3299" transform="matrix(0.866025 -0.5 0.866025 0.5 0.309082 86.1445)" fill="url(#paint0_linear_796_3068)" stroke="#272727" strokeWidth="0.306599" strokeLinecap="round" strokeDasharray="3.07 3.07"/>
                    <rect width="156.941" height="156.941" rx="15.3299" transform="matrix(0.866025 -0.5 0.866025 0.5 0 78.4688)" fill="url(#paint1_linear_796_3068)" stroke="#B2B2B2" strokeWidth="0.383248" strokeLinecap="round"/>
                    <defs>
                      <linearGradient id="paint0_linear_796_3068" x1="78.4703" y1="0" x2="78.4703" y2="156.941" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#D8D8D8"/>
                        <stop offset="0.504808" stopColor="white"/>
                        <stop offset="1" stopColor="#D8D8D8"/>
                      </linearGradient>
                      <linearGradient id="paint1_linear_796_3068" x1="152.683" y1="4.12785" x2="-0.317485" y2="157.128" gradientUnits="userSpaceOnUse">
                        <stop offset="0.226929" stopColor="#4AB583"/>
                        <stop offset="1" stopColor="#CEFFDE"/>
                      </linearGradient>
                    </defs>
                  </svg>
                  {/* Text overlay */}
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontFamily: 'Inter', fontWeight: 700, fontSize: '18px', letterSpacing: '-0.015em', color: maturityLevel === 'Optimized IT' ? '#FFFFFF' : '#868686', transition: 'color 300ms ease' }}>
                    Optimized IT
                  </div>
                </div>

                {/* Structured IT - Middle */}
                <div style={{ filter: maturityLevel === 'Structured IT' ? 'none' : 'saturate(0.2) brightness(1.3) contrast(0.8)', transition: 'filter 300ms ease', position: 'relative', marginBottom: '-110px', zIndex: 2 }}>
                  <svg width="334" height="201" viewBox="0 0 334 201" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="192.376" height="192.376" rx="15.3299" transform="matrix(0.866025 -0.5 0.866025 0.5 0.147461 104.18)" fill="url(#paint0_linear_796_3082)" stroke="#272727" strokeWidth="0.306599" strokeLinecap="round" strokeDasharray="3.07 3.07"/>
                    <g filter="url(#filter0_n_796_3082)">
                      <rect width="192.376" height="192.376" rx="15.3299" transform="matrix(0.866025 -0.5 0.866025 0.5 0 96.1875)" fill="url(#paint1_linear_796_3082)"/>
                      <rect width="192.376" height="192.376" rx="15.3299" transform="matrix(0.866025 -0.5 0.866025 0.5 0 96.1875)" stroke="#B2B2B2" strokeWidth="0.383248" strokeLinecap="round"/>
                    </g>
                    <defs>
                      <filter id="filter0_n_796_3082" x="7.54248" y="4.35547" width="318.12" height="183.664" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                        <feTurbulence type="fractalNoise" baseFrequency="2 2" stitchTiles="stitch" numOctaves="3" result="noise" seed="936" />
                        <feColorMatrix in="noise" type="luminanceToAlpha" result="alphaNoise" />
                        <feComponentTransfer in="alphaNoise" result="coloredNoise1">
                          <feFuncA type="discrete" tableValues="1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 "/>
                        </feComponentTransfer>
                        <feComposite operator="in" in2="shape" in="coloredNoise1" result="noise1Clipped" />
                        <feFlood floodColor="rgba(50, 11, 117, 0.15)" result="color1Flood" />
                        <feComposite operator="in" in2="noise1Clipped" in="color1Flood" result="color1" />
                        <feMerge result="effect1_noise_796_3082">
                          <feMergeNode in="shape" />
                          <feMergeNode in="color1" />
                        </feMerge>
                      </filter>
                      <linearGradient id="paint0_linear_796_3082" x1="96.188" y1="0" x2="96.188" y2="192.376" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#D8D8D8"/>
                        <stop offset="0.504808" stopColor="white"/>
                        <stop offset="1" stopColor="#D8D8D8"/>
                      </linearGradient>
                      <linearGradient id="paint1_linear_796_3082" x1="187.157" y1="5.05987" x2="-0.38917" y2="192.606" gradientUnits="userSpaceOnUse">
                        <stop offset="0.226929" stopColor="#392064"/>
                        <stop offset="1" stopColor="#8E7BFF"/>
                      </linearGradient>
                    </defs>
                  </svg>
                  {/* Text overlay */}
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontFamily: 'Inter', fontWeight: 700, fontSize: '18px', letterSpacing: '-0.015em', color: maturityLevel === 'Structured IT' ? '#FFFFFF' : '#868686', transition: 'color 300ms ease' }}>
                    Structured IT
                  </div>
                </div>

                {/* Reactive IT - Bottom */}
                <div style={{ filter: maturityLevel === 'Reactive IT' ? 'none' : 'saturate(0.2) brightness(1.3) contrast(0.8)', transition: 'filter 300ms ease', position: 'relative', zIndex: 1 }}>
                  <svg width="418" height="253" viewBox="0 0 418 253" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="241.044" height="241.044" rx="15.3299" transform="matrix(0.866025 -0.5 0.866025 0.5 0 131.535)" fill="url(#paint0_linear_796_3086)" stroke="#272727" strokeWidth="0.306599" strokeLinecap="round" strokeDasharray="3.07 3.07"/>
                    <g filter="url(#filter0_n_796_3086)">
                      <path d="M13.2761 128.184C5.94391 123.951 5.94391 117.088 13.2761 112.855L195.475 7.66227C202.807 3.42903 214.695 3.42903 222.027 7.66227L404.225 112.855C411.557 117.088 411.557 123.951 404.225 128.184L222.027 233.377C214.695 237.61 202.807 237.61 195.475 233.377L13.2761 128.184Z" fill="url(#paint1_linear_796_3086)"/>
                      <path d="M13.2761 128.184C5.94391 123.951 5.94391 117.088 13.2761 112.855L195.475 7.66227C202.807 3.42903 214.695 3.42903 222.027 7.66227L404.225 112.855C411.557 117.088 411.557 123.951 404.225 128.184L222.027 233.377C214.695 237.61 202.807 237.61 195.475 233.377L13.2761 128.184Z" stroke="#B2B2B2" strokeWidth="0.383248" strokeLinecap="round"/>
                    </g>
                    <defs>
                      <filter id="filter0_n_796_3086" x="7.54248" y="4.35156" width="402.417" height="232.336" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                        <feTurbulence type="fractalNoise" baseFrequency="2 2" stitchTiles="stitch" numOctaves="3" result="noise" seed="936" />
                        <feColorMatrix in="noise" type="luminanceToAlpha" result="alphaNoise" />
                        <feComponentTransfer in="alphaNoise" result="coloredNoise1">
                          <feFuncA type="discrete" tableValues="1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 "/>
                        </feComponentTransfer>
                        <feComposite operator="in" in2="shape" in="coloredNoise1" result="noise1Clipped" />
                        <feFlood floodColor="rgba(50, 11, 117, 0.15)" result="color1Flood" />
                        <feComposite operator="in" in2="noise1Clipped" in="color1Flood" result="color1" />
                        <feMerge result="effect1_noise_796_3086">
                          <feMergeNode in="shape" />
                          <feMergeNode in="color1" />
                        </feMerge>
                      </filter>
                      <linearGradient id="paint0_linear_796_3086" x1="120.522" y1="0" x2="120.522" y2="241.044" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#D8D8D8"/>
                        <stop offset="0.504808" stopColor="white"/>
                        <stop offset="1" stopColor="#D8D8D8"/>
                      </linearGradient>
                      <linearGradient id="paint1_linear_796_3086" x1="208.577" y1="6.43726" x2="208.577" y2="241.429" gradientUnits="userSpaceOnUse">
                        <stop offset="0.226929" stopColor="#392064"/>
                        <stop offset="1" stopColor="#8E7BFF"/>
                      </linearGradient>
                    </defs>
                  </svg>
                  {/* Text overlay */}
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontFamily: 'Inter', fontWeight: 700, fontSize: '18px', letterSpacing: '-0.015em', color: maturityLevel === 'Reactive IT' ? '#FFFFFF' : '#868686', transition: 'color 300ms ease' }}>
                    Reactive IT
                  </div>
                </div>
              </div>
            </div>

            {/* Divider line */}
            <div style={{ width: '100%', height: '1px', backgroundColor: '#D9D9D9', marginTop: '32px', marginBottom: '32px' }}></div>

            {/* Second Row - Goal-Based Recommendations */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '32px' }}>
              <h3
                style={{
                  textTransform: 'uppercase',
                  fontFamily: 'Inter',
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

            {/* Priority and Insight based on maturity level and selected goal */}
            {maturityLevel === 'Reactive IT' && (
              <div>
                {answers[3] === 'option_1' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div style={{ borderLeft: '2px solid #A182FF', paddingLeft: '16px' }}>
                      <div style={{ fontFamily: 'Inter Display', fontWeight: 500, fontSize: '18px', color: '#101828', letterSpacing: '-0.005em', marginBottom: '8px' }}>Priority</div>
                      <div style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '14px', color: '#201515', letterSpacing: '-0.0015em', textWrap: 'balance' } as React.CSSProperties}>Simple AI deflection, fast implementation, low admin overhead</div>
                    </div>
                    <div style={{ borderLeft: '2px solid #A182FF', paddingLeft: '16px' }}>
                      <div style={{ fontFamily: 'Inter Display', fontWeight: 500, fontSize: '18px', color: '#101828', letterSpacing: '-0.005em', marginBottom: '8px' }}>Insight</div>
                      <div style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '14px', color: '#201515', letterSpacing: '-0.0015em', textWrap: 'balance' } as React.CSSProperties}>At 1,000 deflectable tickets/month, effective AI can reclaim 250-500 hours of agent time.</div>
                    </div>
                  </div>
                )}

                {answers[3] === 'option_2' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div style={{ borderLeft: '2px solid #A182FF', paddingLeft: '16px' }}>
                      <div style={{ fontFamily: 'Inter Display', fontWeight: 500, fontSize: '18px', color: '#101828', letterSpacing: '-0.005em', marginBottom: '8px' }}>Priority</div>
                      <div style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '14px', color: '#201515', letterSpacing: '-0.0015em', textWrap: 'balance' } as React.CSSProperties}>Slack/Teams-native, consumer-simple UX, mobile-first</div>
                    </div>
                    <div style={{ borderLeft: '2px solid #A182FF', paddingLeft: '16px' }}>
                      <div style={{ fontFamily: 'Inter Display', fontWeight: 500, fontSize: '18px', color: '#101828', letterSpacing: '-0.005em', marginBottom: '8px' }}>Insight</div>
                      <div style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '14px', color: '#201515', letterSpacing: '-0.0015em', textWrap: 'balance' } as React.CSSProperties}>Employees shouldn't need training to get help. Meet them where they already work.</div>
                    </div>
                  </div>
                )}

                {answers[3] === 'option_3' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div style={{ borderLeft: '2px solid #A182FF', paddingLeft: '16px' }}>
                      <div style={{ fontFamily: 'Inter Display', fontWeight: 500, fontSize: '18px', color: '#101828', letterSpacing: '-0.005em', marginBottom: '8px' }}>Priority</div>
                      <div style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '14px', color: '#201515', letterSpacing: '-0.0015em', textWrap: 'balance' } as React.CSSProperties}>Start with deflection before workflow automation</div>
                    </div>
                    <div style={{ borderLeft: '2px solid #A182FF', paddingLeft: '16px' }}>
                      <div style={{ fontFamily: 'Inter Display', fontWeight: 500, fontSize: '18px', color: '#101828', letterSpacing: '-0.005em', marginBottom: '8px' }}>Insight</div>
                      <div style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '14px', color: '#201515', letterSpacing: '-0.0015em', textWrap: 'balance' } as React.CSSProperties}>Reduce volume first—then you'll have capacity to build automation.</div>
                    </div>
                  </div>
                )}

                {answers[3] === 'option_4' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div style={{ borderLeft: '2px solid #A182FF', paddingLeft: '16px' }}>
                      <div style={{ fontFamily: 'Inter Display', fontWeight: 500, fontSize: '18px', color: '#101828', letterSpacing: '-0.005em', marginBottom: '8px' }}>Priority</div>
                      <div style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '14px', color: '#201515', letterSpacing: '-0.0015em', textWrap: 'balance' } as React.CSSProperties}>Quick wins with AI deflection to build momentum</div>
                    </div>
                    <div style={{ borderLeft: '2px solid #A182FF', paddingLeft: '16px' }}>
                      <div style={{ fontFamily: 'Inter Display', fontWeight: 500, fontSize: '18px', color: '#101828', letterSpacing: '-0.005em', marginBottom: '8px' }}>Insight</div>
                      <div style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '14px', color: '#201515', letterSpacing: '-0.0015em', textWrap: 'balance' } as React.CSSProperties}>Demonstrate ROI with measurable ticket reduction before larger transformation.</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {maturityLevel === 'Structured IT' && (
              <div>
                {answers[3] === 'option_1' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div style={{ borderLeft: '2px solid #A182FF', paddingLeft: '16px' }}>
                      <div style={{ fontFamily: 'Inter Display', fontWeight: 500, fontSize: '18px', color: '#101828', letterSpacing: '-0.005em', marginBottom: '8px' }}>Priority</div>
                      <div style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '14px', color: '#201515', letterSpacing: '-0.0015em', textWrap: 'balance' } as React.CSSProperties}>Production-ready AI with proven deflection rates, workflow automation</div>
                    </div>
                    <div style={{ borderLeft: '2px solid #A182FF', paddingLeft: '16px' }}>
                      <div style={{ fontFamily: 'Inter Display', fontWeight: 500, fontSize: '18px', color: '#101828', letterSpacing: '-0.005em', marginBottom: '8px' }}>Insight</div>
                      <div style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '14px', color: '#201515', letterSpacing: '-0.0015em', textWrap: 'balance' } as React.CSSProperties}>Every automated workflow saves 10-20 minutes per execution.</div>
                    </div>
                  </div>
                )}

                {answers[3] === 'option_2' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div style={{ borderLeft: '2px solid #A182FF', paddingLeft: '16px' }}>
                      <div style={{ fontFamily: 'Inter Display', fontWeight: 500, fontSize: '18px', color: '#101828', letterSpacing: '-0.005em', marginBottom: '8px' }}>Priority</div>
                      <div style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '14px', color: '#201515', letterSpacing: '-0.0015em', textWrap: 'balance' } as React.CSSProperties}>Seamless handoffs, proactive notifications, self-service workflows</div>
                    </div>
                    <div style={{ borderLeft: '2px solid #A182FF', paddingLeft: '16px' }}>
                      <div style={{ fontFamily: 'Inter Display', fontWeight: 500, fontSize: '18px', color: '#101828', letterSpacing: '-0.005em', marginBottom: '8px' }}>Insight</div>
                      <div style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '14px', color: '#201515', letterSpacing: '-0.0015em', textWrap: 'balance' } as React.CSSProperties}>Employees feel the friction of manual handoffs. Smooth the edges.</div>
                    </div>
                  </div>
                )}

                {answers[3] === 'option_3' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div style={{ borderLeft: '2px solid #A182FF', paddingLeft: '16px' }}>
                      <div style={{ fontFamily: 'Inter Display', fontWeight: 500, fontSize: '18px', color: '#101828', letterSpacing: '-0.005em', marginBottom: '8px' }}>Priority</div>
                      <div style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '14px', color: '#201515', letterSpacing: '-0.0015em', textWrap: 'balance' } as React.CSSProperties}>ESM capabilities, low-code workflows, strong integrations</div>
                    </div>
                    <div style={{ borderLeft: '2px solid #A182FF', paddingLeft: '16px' }}>
                      <div style={{ fontFamily: 'Inter Display', fontWeight: 500, fontSize: '18px', color: '#101828', letterSpacing: '-0.005em', marginBottom: '8px' }}>Insight</div>
                      <div style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '14px', color: '#201515', letterSpacing: '-0.0015em', textWrap: 'balance' } as React.CSSProperties}>Extend service management beyond IT without proportional headcount.</div>
                    </div>
                  </div>
                )}

                {answers[3] === 'option_4' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div style={{ borderLeft: '2px solid #A182FF', paddingLeft: '16px' }}>
                      <div style={{ fontFamily: 'Inter Display', fontWeight: 500, fontSize: '18px', color: '#101828', letterSpacing: '-0.005em', marginBottom: '8px' }}>Priority</div>
                      <div style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '14px', color: '#201515', letterSpacing: '-0.0015em', textWrap: 'balance' } as React.CSSProperties}>API-first platforms that integrate with your ecosystem</div>
                    </div>
                    <div style={{ borderLeft: '2px solid #A182FF', paddingLeft: '16px' }}>
                      <div style={{ fontFamily: 'Inter Display', fontWeight: 500, fontSize: '18px', color: '#101828', letterSpacing: '-0.005em', marginBottom: '8px' }}>Insight</div>
                      <div style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '14px', color: '#201515', letterSpacing: '-0.0015em', textWrap: 'balance' } as React.CSSProperties}>Avoid rip-and-replace. Composable platforms let you modernize incrementally.</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {maturityLevel === 'Optimized IT' && (
              <div>
                {answers[3] === 'option_1' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div style={{ borderLeft: '2px solid #A182FF', paddingLeft: '16px' }}>
                      <div style={{ fontFamily: 'Inter Display', fontWeight: 500, fontSize: '18px', color: '#101828', letterSpacing: '-0.005em', marginBottom: '8px' }}>Priority</div>
                      <div style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '14px', color: '#201515', letterSpacing: '-0.0015em', textWrap: 'balance' } as React.CSSProperties}>Advanced AI for edge cases, predictive capabilities</div>
                    </div>
                    <div style={{ borderLeft: '2px solid #A182FF', paddingLeft: '16px' }}>
                      <div style={{ fontFamily: 'Inter Display', fontWeight: 500, fontSize: '18px', color: '#101828', letterSpacing: '-0.005em', marginBottom: '8px' }}>Insight</div>
                      <div style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '14px', color: '#201515', letterSpacing: '-0.0015em', textWrap: 'balance' } as React.CSSProperties}>You've handled the obvious—now tackle the long tail.</div>
                    </div>
                  </div>
                )}

                {answers[3] === 'option_2' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div style={{ borderLeft: '2px solid #A182FF', paddingLeft: '16px' }}>
                      <div style={{ fontFamily: 'Inter Display', fontWeight: 500, fontSize: '18px', color: '#101828', letterSpacing: '-0.005em', marginBottom: '8px' }}>Priority</div>
                      <div style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '14px', color: '#201515', letterSpacing: '-0.0015em', textWrap: 'balance' } as React.CSSProperties}>Proactive service, personalization, cross-department consistency</div>
                    </div>
                    <div style={{ borderLeft: '2px solid #A182FF', paddingLeft: '16px' }}>
                      <div style={{ fontFamily: 'Inter Display', fontWeight: 500, fontSize: '18px', color: '#101828', letterSpacing: '-0.005em', marginBottom: '8px' }}>Insight</div>
                      <div style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '14px', color: '#201515', letterSpacing: '-0.0015em', textWrap: 'balance' } as React.CSSProperties}>Move from reactive to anticipatory service delivery.</div>
                    </div>
                  </div>
                )}

                {answers[3] === 'option_3' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div style={{ borderLeft: '2px solid #A182FF', paddingLeft: '16px' }}>
                      <div style={{ fontFamily: 'Inter Display', fontWeight: 500, fontSize: '18px', color: '#101828', letterSpacing: '-0.005em', marginBottom: '8px' }}>Priority</div>
                      <div style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '14px', color: '#201515', letterSpacing: '-0.0015em', textWrap: 'balance' } as React.CSSProperties}>Federated architecture, enterprise-wide ESM</div>
                    </div>
                    <div style={{ borderLeft: '2px solid #A182FF', paddingLeft: '16px' }}>
                      <div style={{ fontFamily: 'Inter Display', fontWeight: 500, fontSize: '18px', color: '#101828', letterSpacing: '-0.005em', marginBottom: '8px' }}>Insight</div>
                      <div style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '14px', color: '#201515', letterSpacing: '-0.0015em', textWrap: 'balance' } as React.CSSProperties}>Your model works—now extend it systematically across the organization.</div>
                    </div>
                  </div>
                )}

                {answers[3] === 'option_4' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div style={{ borderLeft: '2px solid #A182FF', paddingLeft: '16px' }}>
                      <div style={{ fontFamily: 'Inter Display', fontWeight: 500, fontSize: '18px', color: '#101828', letterSpacing: '-0.005em', marginBottom: '8px' }}>Priority</div>
                      <div style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '14px', color: '#201515', letterSpacing: '-0.0015em', textWrap: 'balance' } as React.CSSProperties}>Composable architecture, consumption analytics, transparent TCO</div>
                    </div>
                    <div style={{ borderLeft: '2px solid #A182FF', paddingLeft: '16px' }}>
                      <div style={{ fontFamily: 'Inter Display', fontWeight: 500, fontSize: '18px', color: '#101828', letterSpacing: '-0.005em', marginBottom: '8px' }}>Insight</div>
                      <div style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '14px', color: '#201515', letterSpacing: '-0.0015em', textWrap: 'balance' } as React.CSSProperties}>Value shifts from cost reduction to capacity creation for strategic work.</div>
                    </div>
                  </div>
                )}
              </div>
            )}
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
          padding: '64px'
        }}
      >
        {/* Segmented Progress Bar - always visible */}
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

        {/* Question content - fades during transitions */}
        <div
          style={{
            transition: 'opacity 300ms ease-in-out',
            opacity: isTransitioning ? 0 : 1
          }}
        >
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
