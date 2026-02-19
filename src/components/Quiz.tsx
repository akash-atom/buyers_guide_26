import QuizCore from './Quiz.core';

// Local development wrapper
// Uses Inter font and gradient background
export default function Quiz() {
  return (
    <QuizCore
      fontFamily="Inter, sans-serif"
      background="gradient"
      svgIdPrefix=""
    />
  );
}
