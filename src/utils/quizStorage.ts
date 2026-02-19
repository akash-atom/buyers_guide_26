// Quiz state persistence using localStorage
// Allows returning visitors to skip the quiz and view their results immediately

const STORAGE_KEY = 'it_maturity_quiz_state';
const EXPIRY_DAYS = 30;

export interface QuizStateStorage {
  version: number;
  email: string;
  answers: Record<number, string>;
  score: number;
  maturityLevel: string;
  completedAt: string;
  expiresAt: string;
}

/**
 * Check if localStorage is available
 */
function isLocalStorageAvailable(): boolean {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Validate that saved data has all required fields and valid values
 */
function validateQuizState(data: unknown): data is QuizStateStorage {
  if (!data || typeof data !== 'object') return false;

  const state = data as Record<string, unknown>;

  return (
    typeof state.version === 'number' &&
    typeof state.email === 'string' &&
    state.email.length > 0 &&
    typeof state.answers === 'object' &&
    state.answers !== null &&
    Object.keys(state.answers as object).length === 4 &&
    typeof state.score === 'number' &&
    state.score >= 3 && state.score <= 9 &&
    typeof state.maturityLevel === 'string' &&
    ['Reactive IT', 'Structured IT', 'Optimized IT'].includes(state.maturityLevel) &&
    typeof state.completedAt === 'string' &&
    typeof state.expiresAt === 'string'
  );
}

/**
 * Check if the saved state has expired
 */
function isStateExpired(state: QuizStateStorage): boolean {
  try {
    return new Date(state.expiresAt) < new Date();
  } catch {
    return true;
  }
}

/**
 * Get expiry date (30 days from now)
 */
export function getExpiryDate(): string {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + EXPIRY_DAYS);
  return expiryDate.toISOString();
}

/**
 * Load quiz state from localStorage
 * Returns null if no valid state exists, expired, or localStorage unavailable
 */
export function loadQuizState(): QuizStateStorage | null {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage not available - quiz state cannot be restored');
    return null;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const data = JSON.parse(stored);

    if (!validateQuizState(data)) {
      console.warn('Invalid quiz state found - clearing');
      clearQuizState();
      return null;
    }

    if (isStateExpired(data)) {
      console.log('Quiz state expired - clearing');
      clearQuizState();
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error loading quiz state:', error);
    clearQuizState();
    return null;
  }
}

/**
 * Save quiz state to localStorage
 * Returns true if save was successful, false otherwise
 */
export function saveQuizState(state: QuizStateStorage): boolean {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage not available - quiz state cannot be saved');
    return false;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (error) {
    console.error('Error saving quiz state:', error);
    return false;
  }
}

/**
 * Clear quiz state from localStorage
 */
export function clearQuizState(): void {
  if (!isLocalStorageAvailable()) return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing quiz state:', error);
  }
}
