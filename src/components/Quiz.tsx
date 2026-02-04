import React, { useState } from 'react';
import { submitToHubSpot, getAnswerText } from '../utils/hubspot';

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
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isComplete, setIsComplete] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // HubSpot configuration - REPLACE WITH YOUR VALUES
  const HUBSPOT_CONFIG = {
    portalId: 'YOUR_PORTAL_ID', // Replace with your HubSpot Portal ID
    formId: 'YOUR_FORM_ID',     // Replace with your HubSpot Form ID
  };

  const progress = ((currentQuestion + 1) / quizData.length) * 100;

  const handleOptionSelect = (optionValue: string) => {
    setSelectedOption(optionValue);
  };

  const handleNext = () => {
    if (!selectedOption) return;

    // Save the answer
    setAnswers({ ...answers, [currentQuestion]: selectedOption });

    // Move to next question or complete
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption('');
    } else {
      setIsComplete(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(answers[currentQuestion - 1] || '');
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

  if (isComplete && !emailSubmitted) {
    // Show email collection form
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-primary-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 animate-fade-in">
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
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              Almost there!
            </h2>
            <p className="text-lg text-gray-600 mb-8 text-center">
              Enter your work email to see your IT maturity level results
            </p>

            <form onSubmit={handleEmailSubmit} noValidate className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError('');
                  }}
                  placeholder="your.email@company.com"
                  className={`w-full px-6 py-4 rounded-2xl border-2 text-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                    emailError
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-200 focus:border-primary-300'
                  }`}
                />
                {emailError && (
                  <p className="text-red-600 text-sm mt-3 ml-1 font-medium">{emailError}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-primary-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'View My Results'}
              </button>
            </form>

            <p className="text-sm text-gray-500 mt-6 text-center">
              We respect your privacy. Your email will only be used to send you relevant information.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isComplete && emailSubmitted) {
    // Show results after email is submitted
    const totalScore = calculateScore();
    const maturityLevel = getResultMessage(totalScore);

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-primary-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center animate-fade-in">
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
      </div>
    );
  }

  const question = quizData[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-primary-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Question {currentQuestion + 1} of {quizData.length}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-600 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            {question.question}
          </h2>

          {/* Options */}
          <div className="space-y-4 mb-8">
            {question.options.map((option, index) => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option.value)}
                className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-200 transform hover:scale-[1.02] ${
                  selectedOption === option.value
                    ? 'border-primary-600 bg-primary-50 shadow-lg'
                    : 'border-gray-200 hover:border-primary-300 bg-white'
                }`}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="flex items-center">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${
                      selectedOption === option.value
                        ? 'border-primary-600 bg-primary-600'
                        : 'border-gray-300'
                    }`}
                  >
                    {selectedOption === option.value && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span
                    className={`text-lg font-medium ${
                      selectedOption === option.value
                        ? 'text-primary-900'
                        : 'text-gray-700'
                    }`}
                  >
                    {option.text}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            {currentQuestion > 0 && (
              <button
                onClick={handlePrevious}
                className="flex-1 px-6 py-3 rounded-full border-2 border-gray-300 text-gray-700 font-semibold hover:border-gray-400 hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!selectedOption}
              className={`flex-1 px-6 py-3 rounded-full font-semibold transition-all ${
                selectedOption
                  ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {currentQuestion === quizData.length - 1 ? 'Complete' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
