/**
 * HubSpot Forms API Integration
 *
 * Submit quiz data to HubSpot form
 * Docs: https://legacydocs.hubspot.com/docs/methods/forms/submit_form
 */

interface QuizData {
  email: string;
  score: number;
  maturityLevel: string;
  question1Answer: string;
  question2Answer: string;
  question3Answer: string;
  selectedGoal: string;
}

interface HubSpotConfig {
  portalId: string;
  formId: string;
}

/**
 * Submit quiz data to HubSpot form
 */
export async function submitToHubSpot(
  data: QuizData,
  config: HubSpotConfig
): Promise<{ success: boolean; error?: string }> {
  const { portalId, formId } = config;

  // HubSpot Forms API endpoint
  const url = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`;

  // Format data for HubSpot
  const payload = {
    fields: [
      {
        objectTypeId: '0-1', // Contact object type
        name: 'email',
        value: data.email,
      },
      {
        objectTypeId: '0-1',
        name: 'quiz_score', // Custom field - must exist in HubSpot
        value: data.score.toString(),
      },
      {
        objectTypeId: '0-1',
        name: 'it_maturity_level', // Custom field - must exist in HubSpot
        value: data.maturityLevel,
      },
      {
        objectTypeId: '0-1',
        name: 'quiz_question_1', // Custom field - must exist in HubSpot
        value: data.question1Answer,
      },
      {
        objectTypeId: '0-1',
        name: 'quiz_question_2', // Custom field - must exist in HubSpot
        value: data.question2Answer,
      },
      {
        objectTypeId: '0-1',
        name: 'quiz_question_3', // Custom field - must exist in HubSpot
        value: data.question3Answer,
      },
      {
        objectTypeId: '0-1',
        name: 'primary_goal', // Custom field - must exist in HubSpot
        value: data.selectedGoal,
      },
    ],
    context: {
      pageUri: window.location.href,
      pageName: document.title,
    },
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('HubSpot submission error:', errorData);
      return {
        success: false,
        error: errorData.message || 'Failed to submit to HubSpot',
      };
    }

    const result = await response.json();
    console.log('HubSpot submission successful:', result);

    return { success: true };
  } catch (error) {
    console.error('HubSpot submission failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get human-readable answer text from option value
 */
export function getAnswerText(questionId: number, optionValue: string): string {
  const answerMap: Record<string, Record<string, string>> = {
    '0': {
      // Question 1
      option_1: 'Agents handle most of them manually',
      option_2: 'Some self-service/AI deflection, but agents still handle many',
      option_3: '80%+ resolved automatically without agent involvement',
    },
    '1': {
      // Question 2
      option_1: 'Agent manually provisions each system, lots of back-and-forth',
      option_2: 'Documented process exists, but humans execute each step',
      option_3:
        'If-this-then-that workflows automatically provision across systems',
    },
    '2': {
      // Question 3
      option_1:
        "Less than 30% — we're constantly firefighting routine issues",
      option_2:
        '30-50% — getting better but still interrupted by automatable tasks',
      option_3: '70%+ — routine work is handled, we focus on real problems',
    },
    '3': {
      // Question 4
      option_1: 'Reduce ticket volume and agent workload',
      option_2: 'Improve employee experience',
      option_3: 'Scale service management without adding headcount',
      option_4: 'Modernize our tech stack / demonstrate ROI',
    },
  };

  return answerMap[questionId.toString()]?.[optionValue] || optionValue;
}
