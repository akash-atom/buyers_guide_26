/**
 * Quiz State Persistence Utility
 * Manages localStorage operations for saving and restoring quiz completion state
 */

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
 * Check if localStorage is available in the current browser
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const test = '__test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Calculate expiry date (30 days from now)
 */
export function getExpiryDate(): string {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + EXPIRY_DAYS);
  return expiryDate.toISOString();
}

/**
 * Check if saved state has expired
 */
export function isStateExpired(state: QuizStateStorage): boolean {
  return new Date(state.expiresAt) < new Date();
}

/**
 * Validate quiz state data structure
 */
export function validateQuizState(data: any): data is QuizStateStorage {
  if (!data) return false;

  // Check all required fields exist
  const hasRequiredFields =
    typeof data.version === 'number' &&
    typeof data.email === 'string' &&
    typeof data.answers === 'object' &&
    typeof data.score === 'number' &&
    typeof data.maturityLevel === 'string' &&
    typeof data.completedAt === 'string' &&
    typeof data.expiresAt === 'string';

  if (!hasRequiredFields) return false;

  // Validate answers (must have 4 questions answered)
  const answersCount = Object.keys(data.answers).length;
  if (answersCount !== 4) return false;

  // Validate score range (3-9 based on quiz logic)
  if (data.score < 3 || data.score > 9) return false;

  // Validate maturity level
  const validLevels = ['Reactive IT', 'Structured IT', 'Optimized IT'];
  if (!validLevels.includes(data.maturityLevel)) return false;

  return true;
}

/**
 * Load quiz state from localStorage
 * Returns null if no state, invalid state, or expired state
 */
export function loadQuizState(): QuizStateStorage | null {
  // Check if localStorage is available
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available - quiz state cannot be restored');
    return null;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    // No saved state
    if (!stored) {
      return null;
    }

    // Parse JSON
    const data = JSON.parse(stored);

    // Validate data structure
    if (!validateQuizState(data)) {
      console.warn('Invalid quiz state found - clearing corrupted data');
      clearQuizState();
      return null;
    }

    // Check if expired
    if (isStateExpired(data)) {
      console.log('Quiz state expired - clearing');
      clearQuizState();
      return null;
    }

    console.log('✅ Valid quiz state found - restoring');
    return data;

  } catch (error) {
    console.error('Error loading quiz state:', error);
    clearQuizState();
    return null;
  }
}

/**
 * Save quiz state to localStorage
 * Returns true if successful, false otherwise
 */
export function saveQuizState(state: QuizStateStorage): boolean {
  // Check if localStorage is available
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available - quiz state cannot be saved');
    return false;
  }

  try {
    // Validate before saving
    if (!validateQuizState(state)) {
      console.error('Cannot save invalid quiz state');
      return false;
    }

    const json = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, json);

    console.log('✅ Quiz state saved successfully');
    return true;

  } catch (error) {
    console.error('Error saving quiz state:', error);
    return false;
  }
}

/**
 * Clear saved quiz state from localStorage
 */
export function clearQuizState(): void {
  if (!isLocalStorageAvailable()) {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('🗑️ Quiz state cleared');
  } catch (error) {
    console.error('Error clearing quiz state:', error);
  }
}
