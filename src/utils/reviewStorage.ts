import { MasteryLevel } from '../types';

const STORAGE_KEY = 'incident_lab_review_progress_v1';

export interface ScenarioReviewRecord {
  reviewCount: number;
  masteryLevel: MasteryLevel;
  lastReviewedAt: string;
  isBookmarked?: boolean;
  userNotes?: string;
}

export const loadReviewRecords = (): Record<string, ScenarioReviewRecord> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

export const saveReviewRecords = (records: Record<string, ScenarioReviewRecord>): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    // ignore
  }
};

export const calculateMasteryLevel = (count: number): MasteryLevel => {
  if (count <= 0) return 'UNEXPLORED';
  if (count === 1) return 'LEARNING';
  if (count === 2) return 'FAMILIAR';
  return 'MASTERED';
};

export const incrementReview = (
  scenarioId: string,
  userNotes?: string
): ScenarioReviewRecord => {
  const records = loadReviewRecords();
  const existing = records[scenarioId] || {
    reviewCount: 0,
    masteryLevel: 'UNEXPLORED',
    lastReviewedAt: new Date().toISOString(),
    isBookmarked: false,
    userNotes: '',
  };

  const newCount = existing.reviewCount + 1;
  const newMastery = calculateMasteryLevel(newCount);
  const nowStr = new Date().toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
  });

  const updated: ScenarioReviewRecord = {
    ...existing,
    reviewCount: newCount,
    masteryLevel: newMastery,
    lastReviewedAt: nowStr,
    userNotes: userNotes !== undefined ? userNotes : existing.userNotes,
  };

  records[scenarioId] = updated;
  saveReviewRecords(records);
  return updated;
};

export const toggleScenarioBookmark = (scenarioId: string): boolean => {
  const records = loadReviewRecords();
  const existing = records[scenarioId] || {
    reviewCount: 0,
    masteryLevel: 'UNEXPLORED',
    lastReviewedAt: '',
    isBookmarked: false,
  };

  const nextBookmarked = !existing.isBookmarked;
  records[scenarioId] = {
    ...existing,
    isBookmarked: nextBookmarked,
  };
  saveReviewRecords(records);
  return nextBookmarked;
};

export const updateScenarioNote = (scenarioId: string, note: string): void => {
  const records = loadReviewRecords();
  const existing = records[scenarioId] || {
    reviewCount: 0,
    masteryLevel: 'UNEXPLORED',
    lastReviewedAt: '',
  };

  records[scenarioId] = {
    ...existing,
    userNotes: note,
  };
  saveReviewRecords(records);
};

export const clearAllReviews = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('incident_lab_pocket_stats_v1');
  } catch {
    // ignore
  }
};

const POCKET_STORAGE_KEY = 'incident_lab_pocket_stats_v1';

export interface PocketStats {
  date: string;
  count: number;
  minutes: number;
}

export const getTodayPocketStats = (): PocketStats => {
  const todayStr = new Date().toISOString().slice(0, 10);
  try {
    const raw = localStorage.getItem(POCKET_STORAGE_KEY);
    if (!raw) return { date: todayStr, count: 0, minutes: 0 };
    const parsed: PocketStats = JSON.parse(raw);
    if (parsed.date !== todayStr) {
      return { date: todayStr, count: 0, minutes: 0 };
    }
    return parsed;
  } catch {
    return { date: todayStr, count: 0, minutes: 0 };
  }
};

export const incrementTodayPocket = (minutesToAdd: number): PocketStats => {
  const current = getTodayPocketStats();
  const updated: PocketStats = {
    date: current.date,
    count: current.count + 1,
    minutes: current.minutes + minutesToAdd,
  };
  try {
    localStorage.setItem(POCKET_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
  return updated;
};

