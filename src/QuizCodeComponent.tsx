import Quiz from './components/Quiz';

/**
 * Webflow Code Component wrapper for IT Maturity Quiz
 *
 * This component is designed to be used as a Webflow Code Component.
 * It wraps the Quiz component and ensures compatibility with Webflow.
 */

// Export the Quiz component for Webflow Code Components
export default function QuizCodeComponent() {
  return (
    <div className="webflow-quiz-wrapper">
      <Quiz />
    </div>
  );
}

// Component metadata for Webflow
export const metadata = {
  displayName: 'IT Maturity Quiz',
  description: 'Interactive questionnaire to assess IT maturity level',
  version: '1.0.0',
  category: 'Interactive',
  // Properties that can be configured in Webflow (currently none - quiz is self-contained)
  properties: []
};
