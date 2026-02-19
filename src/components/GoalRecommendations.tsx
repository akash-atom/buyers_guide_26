import React from 'react';
import { MaturityLevel } from '../hooks/useQuizLogic';
import { recommendations, commonStyles } from '../styles/tokens';

interface GoalRecommendationsProps {
  maturityLevel: MaturityLevel;
  selectedGoal: string;
}

export default function GoalRecommendations({ maturityLevel, selectedGoal }: GoalRecommendationsProps) {
  const recommendation = recommendations[maturityLevel]?.[selectedGoal];

  if (!recommendation) {
    return null;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
      <div style={commonStyles.recommendationCard}>
        <div style={commonStyles.recommendationTitle}>Priority</div>
        <div style={{ ...commonStyles.recommendationText, textWrap: 'balance' } as React.CSSProperties}>
          {recommendation.priority}
        </div>
      </div>
      <div style={commonStyles.recommendationCard}>
        <div style={commonStyles.recommendationTitle}>Insight</div>
        <div style={{ ...commonStyles.recommendationText, textWrap: 'balance' } as React.CSSProperties}>
          {recommendation.insight}
        </div>
      </div>
    </div>
  );
}
