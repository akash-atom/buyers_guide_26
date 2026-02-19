import { declareComponent } from '@webflow/react';
import { props } from '@webflow/data-types';
import QuizCore from './Quiz.core';

interface ITMaturityQuizProps {
  coverImage?: {
    src: string;
    alt?: string;
  };
}

function ITMaturityQuiz({ coverImage }: ITMaturityQuizProps) {
  return (
    <QuizCore
      fontFamily="Intervariable"
      background="transparent"
      svgIdPrefix="_wf"
      coverImageUrl={coverImage?.src}
    />
  );
}

// Export as Webflow Code Component
export default declareComponent(ITMaturityQuiz, {
  name: 'ITMaturityQuiz',
  description: 'Interactive questionnaire to assess IT maturity level with scoring and personalized recommendations',
  group: 'Interactive',
  props: {
    coverImage: props.Image({
      name: 'Cover Image',
      tooltip: 'Select a cover image from the asset library'
    })
  }
});
